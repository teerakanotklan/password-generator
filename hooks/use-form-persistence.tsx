import { useEffect, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type * as z from "zod";

const STORAGE_KEY = "password-generator-settings";

export interface PersistedFormData {
  length: number;
  quantity: number;
  options: string[];
}

/**
 * Persist and restore form state to and from browser localStorage.
 *
 * @param options Persistence options object containing form, schema, and onReady callback.
 */
export function useFormPersistence<T extends PersistedFormData>(options: {
  form: UseFormReturn<T>;
  schema: z.ZodType<T>;
  onReady?: () => void;
}) {
  const hasInitialized = useRef(false);

  // Load saved data on mount (only once)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        options.onReady?.();
        return;
      }

      const parsed: unknown = JSON.parse(raw);
      const result = options.schema.safeParse(parsed);
      if (result.success) {
        options.form.reset(result.data);
      }
    } catch (err) {
      console.warn("Failed to parse saved form data:", err);
    } finally {
      options.onReady?.();
    }
  }, [options.form, options.schema, options.onReady]);

  // Watch and persist form changes
  useEffect(() => {
    const subscription = options.form.watch((value) => {
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
  }, [options.form]);
}
