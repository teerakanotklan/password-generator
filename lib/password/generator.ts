import { CHAR_SETS, SIMILAR_CHAR_SET } from "./constants";
import type { GeneratePasswordResult } from "./types";

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

/**
 * Generates a cryptographically secure password based on the provided configuration options.
 */
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
