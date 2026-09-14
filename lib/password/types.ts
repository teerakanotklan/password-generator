export interface GeneratePasswordResult {
  success: boolean;
  password?: string;
  error?: string;
}

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

export type CharType = "digit" | "symbol" | "upper" | "lower";
