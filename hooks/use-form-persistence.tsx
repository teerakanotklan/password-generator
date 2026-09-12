import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

const STORAGE_KEY = "password-generator-settings";

export interface PersistedFormData {
  length: number;
  quantity: number;
  options: string[];
}

export function useFormPersistence<T extends PersistedFormData>(
  form: UseFormReturn<T>,
  schema: z.ZodType<T, any, any>,
  onReady?: () => void,
) {
  const hasInitialized = useRef(false);

  // Load saved data on mount (only once)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        onReady?.();
        return;
      }

      const parsed = JSON.parse(raw);
      const result = schema.safeParse(parsed);
      if (result.success) {
        form.reset(result.data);
      }
    } catch (err) {
      console.warn("Failed to parse saved form data:", err);
    } finally {
      onReady?.();
    }
  }, [form, schema, onReady]);

  // Watch and persist form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        const isSaveEnabled = value?.options?.includes("save");

        if (isSaveEnabled) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.warn("Failed to write to localStorage:", err);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);
}
