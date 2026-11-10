"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { usePasswordGenerator } from "@/hooks/use-password-generator";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { PasswordGeneratorSkeleton } from "@/components/password-generator-skeleton";
import { PasswordLengthControl } from "@/components/password-length-control";
import { PasswordQuantityControl } from "@/components/password-quantity-control";
import { CharacterTypesControl } from "@/components/character-types-control";
import { RulesPreferencesControl } from "@/components/rules-preferences-control";
import { PasswordDisplayList } from "@/components/password-display-list";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, KeyRound } from "lucide-react";

const emptySubscribe = () => () => {};

const formSchema = z.object({
  length: z
    .number()
    .min(4, "Length must be at least 4 characters")
    .max(64, "Length cannot exceed 64 characters"),

  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(500, "Maximum batch size is 500"),

  options: z.array(z.string()).refine(
    (value) => {
      const required = ["uppercase", "lowercase", "number", "symbol"];
      return value.some((id) => required.includes(id));
    },
    {
      message: "Please select at least one character type",
    },
  ),
});

type FormValues = z.infer<typeof formSchema>;

/**
 * Render password generation workbench with configuration controls and result list.
 *
 * @returns Password generator form interface.
 */
export function GeneratePasswordForm() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    passwords,
    generationError,
    copiedItemIndex,
    generatePasswords,
    copySinglePassword,
    copyAllPasswords,
    downloadAsTextFile,
  } = usePasswordGenerator();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 8,
      quantity: 5,
      options: [
        "uppercase",
        "lowercase",
        "number",
        "symbol",
        "excludeSimilar",
        "beginWithLetter",
        "excludeDuplicate",
        "save",
      ],
    },
  });

  // Trigger password generation based on form values
  const runGenerate = () => {
    const { length, quantity, options } = form.getValues();
    const generatorOptions = options.filter((opt) => opt !== "save");

    generatePasswords({
      length: Number(length) || 16,
      quantity: Number(quantity) || 1,
      options: generatorOptions,
    });
  };

  // Load saved settings if present in localStorage
  useFormPersistence({
    form,
    schema: formSchema,
    onReady: runGenerate,
  });

  // Debounced generator for smooth slider dragging
  const triggerDebouncedGenerate = (delay = 60) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      runGenerate();
    }, delay);
  };

  const handleManualRegenerate = () => {
    runGenerate();
  };

  useEffect(() => {
    if (mounted && passwords.length === 0) {
      runGenerate();
    }
  }, [mounted, passwords.length]);

  // Spacebar shortcut to regenerate when not focused on an interactive element
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !(e.target instanceof HTMLElement) ||
        e.target.closest(
          "button, input, textarea, select, [role='checkbox'], [role='button'], a",
        ) ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleManualRegenerate();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentLength = form.watch("length");
  const currentQuantity = form.watch("quantity");

  if (!mounted) {
    return <PasswordGeneratorSkeleton />;
  }

  return (
    <div className="grid w-full gap-4 sm:gap-6 lg:h-[calc(100dvh-3rem)] lg:grid-cols-[minmax(24rem,30rem)_minmax(0,1fr)]">
      <div className="min-w-0 lg:overflow-y-auto">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Make a password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick the rules, then generate. Everything is created in your
              browser and never leaves it.
            </p>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(runGenerate)}
          className="space-y-4 rounded-3xl bg-card p-5"
        >
          <PasswordLengthControl
            value={currentLength}
            onChange={(val) => {
              form.setValue("length", val, { shouldValidate: true });
              triggerDebouncedGenerate(40);
            }}
            onCommit={runGenerate}
          />

          <Separator />

          <PasswordQuantityControl
            value={currentQuantity}
            onChange={(val) => {
              form.setValue("quantity", val, { shouldValidate: true });
              triggerDebouncedGenerate(40);
            }}
            onCommit={runGenerate}
          />

          <Separator />

          <Controller
            name="options"
            control={form.control}
            render={({ field }) => (
              <CharacterTypesControl
                selectedOptions={field.value}
                onChange={(next) => {
                  field.onChange(next);
                  setTimeout(runGenerate, 0);
                }}
                error={form.formState.errors.options?.message}
              />
            )}
          />

          <Separator />

          <Controller
            name="options"
            control={form.control}
            render={({ field }) => (
              <RulesPreferencesControl
                selectedOptions={field.value}
                onChange={(next) => {
                  const prevGenOpts = field.value
                    .filter((opt) => opt !== "save")
                    .sort()
                    .join(",");
                  const nextGenOpts = next
                    .filter((opt) => opt !== "save")
                    .sort()
                    .join(",");

                  field.onChange(next);

                  if (prevGenOpts !== nextGenOpts) {
                    setTimeout(runGenerate, 0);
                  }
                }}
              />
            )}
          />

          {generationError && (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span>{generationError}</span>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="h-12 w-full cursor-pointer rounded-full text-base"
          >
            <KeyRound />
            Generate {currentQuantity === 1 ? "password" : "passwords"}
          </Button>
        </form>
      </div>

      <PasswordDisplayList
        passwords={passwords}
        copiedItemIndex={copiedItemIndex}
        onCopySingle={copySinglePassword}
        onRegenerate={handleManualRegenerate}
        onCopyAll={copyAllPasswords}
        onDownload={downloadAsTextFile}
      />
    </div>
  );
}
