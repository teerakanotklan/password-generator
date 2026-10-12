"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { usePasswordGenerator } from "@/hooks/use-password-generator";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { PasswordGeneratorSkeleton } from "@/components/password-generator-skeleton";
import { PasswordLengthControl } from "@/components/password-length-control";
import { PasswordQuantityControl } from "@/components/password-quantity-control";
import { CharacterTypesControl } from "@/components/character-types-control";
import { RulesPreferencesControl } from "@/components/rules-preferences-control";
import { PasswordDisplayList } from "@/components/password-display-list";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  SlidersHorizontal,
  ListFilter,
  Settings2,
  Command,
} from "lucide-react";

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
  const [isRotating, setIsRotating] = useState(false);
  const [mobileTab, setMobileTab] = useState<"settings" | "passwords">(
    "passwords",
  );
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    passwords,
    generationError,
    copiedItemIndex,
    generatePasswords,
    copySinglePassword,
    copyNextPassword,
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
    setIsRotating(true);
    runGenerate();
    setTimeout(() => setIsRotating(false), 350);
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
    <div className="w-full text-left">
      {/* Mobile Tab Switcher */}
      <div className="block lg:hidden mb-4">
        <Tabs
          value={mobileTab}
          onValueChange={(val) =>
            setMobileTab(val === "settings" ? "settings" : "passwords")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-10">
            <TabsTrigger
              value="passwords"
              className="flex items-center justify-center gap-2 text-xs"
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Passwords ({passwords.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center justify-center gap-2 text-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main 2-Column Responsive Full-Width Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Settings & Configuration (Sticky on desktop)                 */}
        {/* ========================================================================= */}
        <div
          className={cn(
            "lg:col-span-5 xl:col-span-4 flex flex-col space-y-5 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs lg:sticky lg:top-20",
            mobileTab === "settings" ? "flex" : "hidden lg:flex",
          )}
        >
          {/* Settings Section Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Settings2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-foreground">
                  Configuration
                </h2>
                <p className="text-[11px] text-muted-foreground">
                  Entropy parameters & rules
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground font-mono bg-muted/40 px-2 py-0.5 rounded border border-border/40">
              <Command className="h-3 w-3" />
              <span>Space = Re-roll</span>
            </div>
          </div>

          {/* Form Controls */}
          <form onSubmit={form.handleSubmit(runGenerate)} className="space-y-5">
            {/* Length Control */}
            <PasswordLengthControl
              value={currentLength}
              onChange={(val) => {
                form.setValue("length", val, { shouldValidate: true });
                triggerDebouncedGenerate(40);
              }}
              onCommit={runGenerate}
            />

            <Separator className="bg-border/60" />

            {/* Quantity Control */}
            <PasswordQuantityControl
              value={currentQuantity}
              onChange={(val) => {
                form.setValue("quantity", val, { shouldValidate: true });
                triggerDebouncedGenerate(40);
              }}
              onCommit={runGenerate}
            />

            <Separator className="bg-border/60" />

            {/* Character Types */}
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

            <Separator className="bg-border/60" />

            {/* Rules & Preferences */}
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
          </form>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Password Display List (Generous Full-Width Space)          */}
        {/* ========================================================================= */}
        <div
          className={cn(
            "lg:col-span-7 xl:col-span-8 flex flex-col space-y-4 rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs",
            mobileTab === "passwords" ? "flex" : "hidden lg:flex",
          )}
        >
          {/* Generation Error Alert if any */}
          {generationError && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{generationError}</span>
            </div>
          )}

          {/* Password List Section */}
          <PasswordDisplayList
            passwords={passwords}
            copiedItemIndex={copiedItemIndex}
            onCopySingle={copySinglePassword}
            onRegenerate={handleManualRegenerate}
            isRotating={isRotating}
            onCopyNext={copyNextPassword}
            onCopyAll={copyAllPasswords}
            onDownload={downloadAsTextFile}
          />
        </div>
      </div>
    </div>
  );
}
