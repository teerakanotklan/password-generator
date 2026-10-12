import { useState, useRef } from "react";
import { generateSecurePassword } from "@/lib/password/generator";

export type CopiedState = number | "all" | null;

export interface GeneratePasswordsParams {
  length: number;
  quantity: number;
  options: string[];
}

/**
 * Manage password generation state, batching, and clipboard operations.
 *
 * @returns State and controller functions for password generation.
 */
export function usePasswordGenerator() {
  const [passwords, setPasswords] = useState<string[]>([]);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copiedItemIndex, setCopiedItemIndex] = useState<CopiedState>(null);
  const lastCycleIndexRef = useRef<number>(-1);
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const markCopied = (state: CopiedState) => {
    setCopiedItemIndex(state);
    if (copyResetTimerRef.current) {
      clearTimeout(copyResetTimerRef.current);
    }
    copyResetTimerRef.current = setTimeout(() => {
      setCopiedItemIndex(null);
    }, 2000);
  };

  const generatePasswords = (params: GeneratePasswordsParams) => {
    setGenerationError(null);

    const optionMap = Object.fromEntries(
      params.options.map((option) => [option, true]),
    );

    const safeQuantity = Math.min(Math.max(1, params.quantity || 1), 500);
    const generatedList: string[] = [];

    for (let i = 0; i < safeQuantity; i++) {
      const result = generateSecurePassword(optionMap, params.length);
      if (!result.success) {
        setGenerationError(result.error ?? "Failed to generate passwords");
        if (generatedList.length === 0) {
          setPasswords([]);
          return;
        }
        break;
      }
      if (result.password) {
        generatedList.push(result.password);
      }
    }

    setPasswords(generatedList);
    setCopiedItemIndex(null);
    lastCycleIndexRef.current = -1;
  };

  const copySinglePassword = async (index: number) => {
    const targetPassword = passwords[index];
    if (!targetPassword) return;
    try {
      await navigator.clipboard.writeText(targetPassword);
      markCopied(index);
      lastCycleIndexRef.current = index;
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const copyNextPassword = async () => {
    if (!passwords.length) return;

    const nextIndex = (lastCycleIndexRef.current + 1) % passwords.length;
    lastCycleIndexRef.current = nextIndex;

    try {
      await navigator.clipboard.writeText(passwords[nextIndex]);
      markCopied(nextIndex);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const copyAllPasswords = async () => {
    if (!passwords.length) return;

    try {
      await navigator.clipboard.writeText(passwords.join("\n"));
      markCopied("all");
    } catch (err) {
      console.error("Clipboard copy all failed:", err);
    }
  };

  const downloadAsTextFile = () => {
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
  };

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
