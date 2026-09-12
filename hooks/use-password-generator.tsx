import { useState, useCallback, useEffect, useRef } from "react";
import { generateSecurePassword } from "@/lib/utils";

export type CopiedState = number | "all" | null;

export interface GeneratePasswordsParams {
  length: number;
  quantity: number;
  options: string[];
}

export function usePasswordGenerator() {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copiedItemIndex, setCopiedItemIndex] = useState<CopiedState>(null);
  const lastCycleIndexRef = useRef<number>(-1);

  // Auto-reset copied state indicator after 2 seconds
  useEffect(() => {
    if (copiedItemIndex === null) return;
    const timer = setTimeout(() => {
      setCopiedItemIndex(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copiedItemIndex]);

  // Generate passwords based on user configuration
  const generatePasswords = useCallback(
    ({ length, quantity, options }: GeneratePasswordsParams) => {
      setGenerationError(null);

      // Convert options array into a lookup map
      const optionMap = Object.fromEntries(
        options.map((option) => [option, true]),
      );

      // Cap quantity to prevent blocking UI thread
      const safeQuantity = Math.min(Math.max(1, quantity || 1), 5000);
      const generatedList: string[] = [];

      for (let i = 0; i < safeQuantity; i++) {
        const result = generateSecurePassword(optionMap, length);
        if (!result.success) {
          setGenerationError(result.error || "Failed to generate passwords");
          if (generatedList.length === 0) {
            setPasswords([]);
            return;
          }
          break;
        }
        generatedList.push(result.password!);
      }

      setPasswords(generatedList);
      setCopiedItemIndex(null);
      lastCycleIndexRef.current = -1;
    },
    [],
  );

  // Copy an individual password by index
  const copySinglePassword = useCallback(
    async (index: number) => {
      if (!passwords[index]) return;
      try {
        await navigator.clipboard.writeText(passwords[index]);
        setCopiedItemIndex(index);
        lastCycleIndexRef.current = index;
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    },
    [passwords],
  );

  // Cycle through and copy the next password (wraps around to 0 when reaching the end)
  const copyNextPassword = useCallback(async () => {
    if (!passwords.length) return;

    const nextIndex = (lastCycleIndexRef.current + 1) % passwords.length;
    lastCycleIndexRef.current = nextIndex;

    try {
      await navigator.clipboard.writeText(passwords[nextIndex]);
      setCopiedItemIndex(nextIndex);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  }, [passwords]);

  // Copy all passwords (newline separated)
  const copyAllPasswords = useCallback(async () => {
    if (!passwords.length) return;

    try {
      await navigator.clipboard.writeText(passwords.join("\n"));
      setCopiedItemIndex("all");
    } catch (err) {
      console.error("Clipboard copy all failed:", err);
    }
  }, [passwords]);

  // Download passwords as a text file
  const downloadAsTextFile = useCallback(() => {
    if (!passwords.length) return;
    const blob = new Blob([passwords.join("\r\n")], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `passwords-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [passwords]);

  return {
    passwords,
    generationError,
    copiedItemIndex,
    generatePasswords,
    copySinglePassword,
    copyNextPassword,
    copyAllPasswords,
    downloadAsTextFile,
  };
}
