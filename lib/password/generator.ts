import { CHAR_SETS, SIMILAR_CHAR_SET } from "./constants";
import type { GeneratePasswordResult } from "./types";


/**
 * Return a cryptographically secure random integer in [0, max - 1].
 *
 * @param max Upper exclusive bound.
 * @returns Cryptographically secure random integer.
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
 * Generate a cryptographically secure password based on configuration options.
 *
 * @param optionMap Map of enabled feature and character options.
 * @param length Desired password length.
 * @returns Result object containing status and generated password or error message.
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
    const char = getSecureRandomChar({
      chars: pool,
      avoidDuplicate: optionMap.excludeDuplicate,
      usedChars,
    });
    if (!char) {
      return { success: false, error: "Failed to allocate unique character" };
    }
    password.push(char);
    usedChars.add(char);
  }

  // Step 2: Fill remaining characters
  while (password.length < length) {
    const char = getSecureRandomChar({
      chars: combinedPool,
      avoidDuplicate: optionMap.excludeDuplicate,
      usedChars,
    });
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
    enforceLeadingLetter({
      password,
      optionMap,
      usedChars,
    });
  }

  return {
    success: true,
    password: password.join(""),
  };
}

/**
 * Generate a cryptographically secure password and return string value.
 *
 * @param optionMap Map of enabled feature and character options.
 * @param length Desired password length.
 * @returns Generated password string.
 * @throws Error when generation fails.
 */
export function generatePassword(
  optionMap: Record<string, boolean>,
  length: number,
): string {
  const result = generateSecurePassword(optionMap, length);
  if (!result.success || !result.password) {
    throw new Error(result.error ?? "Generation failed");
  }
  return result.password;
}

// -------------------- Helpers --------------------

/**
 * Get enabled character pool strings matching selected options.
 *
 * @param options Map of options.
 * @returns Array of character pools.
 */
function getEnabledCharPools(options: Record<string, boolean>): string[] {
  return Object.entries(CHAR_SETS)
    .filter(([key]) => options[key])
    .map(([, chars]) => maybeExcludeSimilar(chars, options.excludeSimilar))
    .filter((pool) => pool.length > 0);
}

/**
 * Filter out ambiguous characters from character string if requested.
 *
 * @param chars Character pool string.
 * @param excludeSimilar Whether to exclude ambiguous glyphs.
 * @returns Filtered character string.
 */
function maybeExcludeSimilar(chars: string, excludeSimilar?: boolean): string {
  if (!excludeSimilar) return chars;
  return [...chars].filter((ch) => !SIMILAR_CHAR_SET.has(ch)).join("");
}

/**
 * Select a cryptographically secure random character from pool.
 *
 * @param options Selection options containing characters, duplicate policy, and used set.
 * @returns Selected character or null if pool exhausted.
 */
function getSecureRandomChar(options: {
  chars: string;
  avoidDuplicate?: boolean;
  usedChars: Set<string>;
}): string | null {
  const pool = options.avoidDuplicate
    ? [...options.chars].filter((ch) => !options.usedChars.has(ch))
    : [...options.chars];

  if (!pool.length) return null;
  const index = getSecureRandomInt(pool.length);
  return pool[index];
}

/**
 * Shuffle array in-place using Fisher–Yates with cryptographically secure random integers.
 *
 * @param array Array of strings to shuffle.
 */
function secureShuffle(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Ensure password starts with a letter character.
 *
 * @param options Leading letter options containing password, option map, and used characters.
 */
function enforceLeadingLetter(options: {
  password: string[];
  optionMap: Record<string, boolean>;
  usedChars: Set<string>;
}) {
  const letterPool = [
    ...(options.optionMap.uppercase
      ? maybeExcludeSimilar(CHAR_SETS.uppercase, options.optionMap.excludeSimilar)
      : ""),
    ...(options.optionMap.lowercase
      ? maybeExcludeSimilar(CHAR_SETS.lowercase, options.optionMap.excludeSimilar)
      : ""),
  ];

  if (!letterPool.length) return;

  const letterSet = new Set(letterPool);
  const firstLetterIndex = options.password.findIndex((ch) => letterSet.has(ch));

  if (firstLetterIndex === -1) {
    const newLetter = getSecureRandomChar({
      chars: letterPool.join(""),
      avoidDuplicate: false,
      usedChars: options.usedChars,
    });
    if (!newLetter) return;

    if (options.optionMap.excludeDuplicate) {
      options.usedChars.delete(options.password[0]);
    }

    options.password[0] = newLetter;
    options.usedChars.add(newLetter);
    return;
  }

  if (firstLetterIndex !== 0) {
    [options.password[0], options.password[firstLetterIndex]] = [
      options.password[firstLetterIndex],
      options.password[0],
    ];
  }
}
