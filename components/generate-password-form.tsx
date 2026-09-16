"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { usePasswordGenerator } from "@/hooks/use-password-generator";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { StrengthMeter } from "@/components/strength-meter";
import { PasswordGeneratorSkeleton } from "@/components/password-generator-skeleton";
import { PasswordLengthControl } from "@/components/password-length-control";
import { PasswordQuantityControl } from "@/components/password-quantity-control";
import { CharacterTypesControl } from "@/components/character-types-control";
import { RulesPreferencesControl } from "@/components/rules-preferences-control";
import { PasswordDisplayList } from "@/components/password-display-list";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Check,
  RotateCw,
  Download,
  Sparkles,
  AlertCircle,
  CheckCheck,
  Settings2,
  ListFilter,
  SlidersHorizontal,
} from "lucide-react";

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

export function GeneratePasswordForm() {
  const [mounted, setMounted] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [mobileTab, setMobileTab] = useState<"passwords" | "settings">(
    "passwords",
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
        "beginWithLetter",
        "excludeDuplicate",
        "excludeSimilar",
        "save",
      ],
    },
  });

  // Load saved settings if present in localStorage
  useFormPersistence(form, formSchema);

  // Trigger password generation based on form values
  const runGenerate = useCallback(() => {
    const { length, quantity, options } = form.getValues();
    const generatorOptions = options.filter((opt) => opt !== "save");

    generatePasswords({
      length: Number(length) || 16,
      quantity: Number(quantity) || 1,
      options: generatorOptions,
    });
  }, [form, generatePasswords]);

  // Debounced generator to keep slider dragging completely smooth at 60fps
  const triggerDebouncedGenerate = useCallback(
    (delay = 75) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        runGenerate();
      }, delay);
    },
    [runGenerate],
  );

  useEffect(() => {
    setMounted(true);
    runGenerate();
  }, [runGenerate]);

  const handleManualRegenerate = () => {
    setIsRotating(true);
    runGenerate();
    setTimeout(() => setIsRotating(false), 400);
  };

  const primaryPassword = passwords[0] || "";
  const currentLength = form.watch("length");
  const currentQuantity = form.watch("quantity");

  // Show matching skeleton while client initializes
  if (!mounted) {
    return <PasswordGeneratorSkeleton />;
  }

  return (
    <div className="w-full">
      {/* Mobile Segmented View Switcher (Top of the page on mobile screens) */}
      <div className="block lg:hidden mb-4">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-muted/60 rounded-xl border border-border/50">
          <button
            type="button"
            onClick={() => setMobileTab("passwords")}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer",
              mobileTab === "passwords"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <ListFilter className="h-3.5 w-3.5" />
            <span>Passwords ({passwords.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("settings")}
            className={cn(
              "flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer",
              mobileTab === "settings"
                ? "bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Responsive 2-Column Grid with Equal Height Partition on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Password Section (Borderless, contains carded password list) */}
        {/* ========================================================================= */}

        <div
          className={cn(
            "lg:col-span-7 flex flex-col h-auto lg:h-full lg:max-h-[690px] lg:overflow-hidden space-y-4 min-h-0",
            mobileTab === "passwords" ? "flex" : "hidden lg:flex",
          )}
        >
          {/* Header with Title and Global Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 min-h-8 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold tracking-tight">
                Generated Passwords ({passwords.length.toLocaleString()})
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Regenerate Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleManualRegenerate}
                title="Generate new password(s)"
                className="cursor-pointer"
              >
                <RotateCw />
                <span>Generate</span>
              </Button>

              {/* Action Buttons */}
              {passwords.length > 1 && (
                <>
                  {/* Sequential Copy Next Password */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyNextPassword}
                    className="cursor-pointer"
                    title="Copy next password in order (cycles back to first)"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy One
                  </Button>

                  {/* Copy All Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyAllPasswords}
                    className="cursor-pointer"
                    title="Copy all passwords to clipboard"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy All
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* 1. Include & Strength Section (At the TOP of the password list) */}
          <div className="shrink-0">
            <StrengthMeter password={primaryPassword} />
          </div>

          {/* Generation Error Alert if any */}
          {generationError && (
            <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium shrink-0">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{generationError}</span>
            </div>
          )}

          {/* 2. Password List Section (Modular Display Component) */}
          <PasswordDisplayList
            passwords={passwords}
            primaryPassword={primaryPassword}
            copiedItemIndex={copiedItemIndex}
            onCopySingle={copySinglePassword}
          />
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Settings Section (Capped at 690px on Desktop, Natural on Mobile) */}
        {/* ========================================================================= */}
        <div
          className={cn(
            "lg:col-span-5 flex flex-col h-auto lg:h-full lg:max-h-[690px]",
            mobileTab === "settings" ? "flex" : "hidden lg:flex",
          )}
        >
          <form
            onSubmit={form.handleSubmit(runGenerate)}
            className="flex flex-col h-auto lg:h-full lg:max-h-[690px]"
          >
            <div className="space-y-4">
              {/* Settings Header matching Left Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold tracking-tight">
                    Settings & Customization
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  Parameters
                </span>
              </div>

              {/* Parameters Section (Length & Quantity via shadcn Sliders) */}
              <PasswordLengthControl
                value={currentLength}
                onChange={(val) => {
                  form.setValue("length", val, { shouldValidate: true });
                  triggerDebouncedGenerate(60);
                }}
                onCommit={runGenerate}
              />

              <PasswordQuantityControl
                value={currentQuantity}
                onChange={(val) => {
                  form.setValue("quantity", val, { shouldValidate: true });
                  triggerDebouncedGenerate(60);
                }}
                onCommit={runGenerate}
              />

              {/* Character Types & Advanced Rules Section */}
              <Card>
                <CardContent className="space-y-3">
                  {/* Character Types Configuration */}
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

                  {/* Advanced Rules & Preferences */}
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
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
