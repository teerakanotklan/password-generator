import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// -------------------- Character sets --------------------

export const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  number: "0123456789",
  symbol: "@#",
} as const;

export const SIMILAR_CHAR_SET = new Set("iIl1oO0S5B8");

// -------------------- Cryptographically Secure Random --------------------

/**
 * Returns a cryptographically secure random integer in [0, max - 1]
 * using Web Crypto API and rejection sampling to eliminate modulo bias.
 */
export function getSecureRandomInt(max: number): number {
  if (max <= 1) return 0;
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);

  while (true) {
    crypto.getRandomValues(buffer);
    if (buffer[0] < limit) {
      return buffer[0] % max;
    }
  }
}

// -------------------- Main Generation Functions --------------------

export interface GeneratePasswordResult {
  success: boolean;
  password?: string;
  error?: string;
}

export function generateSecurePassword(
  optionMap: Record<string, boolean>,
  length: number,
): GeneratePasswordResult {
  const charPools = getEnabledCharPools(optionMap);
  const combinedPool = charPools.join("");

  if (!combinedPool) {
    return {
      success: false,
      error: "At least one character set must be selected",
    };
  }

  // Ensure enough unique characters if duplicates are prohibited
  const uniquePoolCount = new Set(combinedPool).size;
  if (optionMap.excludeDuplicate && uniquePoolCount < length) {
    return {
      success: false,
      error: `Not enough unique characters (pool has ${uniquePoolCount}, requested length is ${length})`,
    };
  }

  const usedChars: Set<string> = new Set();
  const password: string[] = [];

  // Step 1: Ensure at least one character from each enabled pool
  for (const pool of charPools) {
    const char = getSecureRandomChar(pool, optionMap.excludeDuplicate, usedChars);
    if (!char) {
      return { success: false, error: "Failed to allocate unique character" };
    }
    password.push(char);
    usedChars.add(char);
  }

  // Step 2: Fill remaining characters
  while (password.length < length) {
    const char = getSecureRandomChar(
      combinedPool,
      optionMap.excludeDuplicate,
      usedChars,
    );
    if (!char) {
      return { success: false, error: "Failed to allocate unique character" };
    }
    password.push(char);
    usedChars.add(char);
  }

  // Step 3: Cryptographically secure Fisher–Yates shuffle
  secureShuffle(password);

  // Step 4: Ensure starts with letter if requested
  if (optionMap.beginWithLetter) {
    enforceLeadingLetter(password, optionMap, usedChars);
  }

  return {
    success: true,
    password: password.join(""),
  };
}

export function generatePassword(
  optionMap: Record<string, boolean>,
  length: number,
): string {
  const result = generateSecurePassword(optionMap, length);
  if (!result.success) {
    throw new Error(result.error || "Generation failed");
  }
  return result.password!;
}

// -------------------- Helpers --------------------

function getEnabledCharPools(options: Record<string, boolean>): string[] {
  return Object.entries(CHAR_SETS)
    .filter(([key]) => options[key])
    .map(([, chars]) => maybeExcludeSimilar(chars, options.excludeSimilar))
    .filter((pool) => pool.length > 0);
}

function maybeExcludeSimilar(chars: string, excludeSimilar?: boolean): string {
  if (!excludeSimilar) return chars;
  return [...chars].filter((ch) => !SIMILAR_CHAR_SET.has(ch)).join("");
}

function getSecureRandomChar(
  chars: string,
  avoidDuplicate: boolean | undefined,
  usedChars: Set<string>,
): string | null {
  const pool = avoidDuplicate
    ? [...chars].filter((ch) => !usedChars.has(ch))
    : [...chars];

  if (!pool.length) return null;
  const index = getSecureRandomInt(pool.length);
  return pool[index];
}

function secureShuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function enforceLeadingLetter(
  password: string[],
  options: Record<string, boolean>,
  usedChars: Set<string>,
) {
  const letterPool = [
    ...(options.uppercase
      ? maybeExcludeSimilar(CHAR_SETS.uppercase, options.excludeSimilar)
      : ""),
    ...(options.lowercase
      ? maybeExcludeSimilar(CHAR_SETS.lowercase, options.excludeSimilar)
      : ""),
  ];

  if (!letterPool.length) return;

  const letterSet = new Set(letterPool);
  const firstLetterIndex = password.findIndex((ch) => letterSet.has(ch));

  if (firstLetterIndex === -1) {
    const newLetter = getSecureRandomChar(letterPool.join(""), false, usedChars);
    if (!newLetter) return;

    if (options.excludeDuplicate) {
      usedChars.delete(password[0]);
    }

    password[0] = newLetter;
    usedChars.add(newLetter);
    return;
  }

  if (firstLetterIndex !== 0) {
    [password[0], password[firstLetterIndex]] = [
      password[firstLetterIndex],
      password[0],
    ];
  }
}

// -------------------- Password Strength & Entropy --------------------

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";
  color: string;
  badgeClass: string;
  entropyBits: number;
  crackTimeDisplay: string;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: "Very Weak",
      color: "bg-destructive",
      badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
      entropyBits: 0,
      crackTimeDisplay: "Instant",
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSymbol: false,
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSymbol) poolSize += 32;

  const len = password.length;
  // Shannon entropy in bits = length * log2(poolSize)
  const entropyBits = poolSize > 0 ? Math.round(len * Math.log2(poolSize)) : 0;

  // Modern offline GPU cracking benchmark: ~10^10 (10 billion) guesses per second
  const guessesPerSecond = 1e10;
  const totalCombinations = poolSize > 0 ? Math.pow(poolSize, len) : 0;
  const secondsToCrack = totalCombinations / (2 * guessesPerSecond); // average time is half the keyspace

  const crackTimeDisplay = formatCrackTime(secondsToCrack);

  let score: 0 | 1 | 2 | 3 | 4 = 0;
  let label: PasswordStrength["label"] = "Very Weak";
  let color = "bg-destructive";
  let badgeClass = "bg-destructive/10 text-destructive border-destructive/20";

  if (len < 6 || entropyBits < 28) {
    score = 0;
    label = "Very Weak";
    color = "bg-red-500";
    badgeClass = "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
  } else if (len < 10 || entropyBits < 45) {
    score = 1;
    label = "Weak";
    color = "bg-orange-500";
    badgeClass =
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
  } else if (entropyBits < 64) {
    score = 2;
    label = "Fair";
    color = "bg-amber-500";
    badgeClass =
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  } else if (entropyBits < 88) {
    score = 3;
    label = "Strong";
    color = "bg-emerald-500";
    badgeClass =
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  } else {
    score = 4;
    label = "Very Strong";
    color = "bg-teal-500";
    badgeClass =
      "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
  }

  return {
    score,
    label,
    color,
    badgeClass,
    entropyBits,
    crackTimeDisplay,
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
  };
}

function formatCrackTime(seconds: number): string {
  if (seconds <= 0.1) return "Instant";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 86400 * 30) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 86400 * 365) return `${Math.round(seconds / (86400 * 30))} months`;
  if (seconds < 86400 * 365 * 100)
    return `${Math.round(seconds / (86400 * 365))} years`;
  if (seconds < 86400 * 365 * 1000000)
    return `${Math.round(seconds / (86400 * 365 * 1000))}k years`;
  return "Centuries+";
}

// -------------------- Character Type for UI Highlighting --------------------

export function getCharType(
  char: string,
): "digit" | "symbol" | "upper" | "lower" {
  if (/[0-9]/.test(char)) return "digit";
  if (/[A-Z]/.test(char)) return "upper";
  if (/[a-z]/.test(char)) return "lower";
  return "symbol";
}