import type { PasswordStrength, CharType } from "./types";

/**
 * Calculates password strength, Shannon entropy, and estimated offline crack time.
 */
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

export function formatCrackTime(seconds: number): string {
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

/**
 * Character type classifier for UI syntax highlighting.
 */
export function getCharType(char: string): CharType {
  if (/[0-9]/.test(char)) return "digit";
  if (/[A-Z]/.test(char)) return "upper";
  if (/[a-z]/.test(char)) return "lower";
  return "symbol";
}
