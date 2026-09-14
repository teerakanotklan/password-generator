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
      length: 16,
      quantity: 1,
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
      {/* Responsive 2-Column Grid with Equal Height Partition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Password Section (No Card or Border Effect)                  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full lg:max-h-[690px] lg:overflow-hidden space-y-4 p-4 sm:p-6 min-h-0">
          {/* Header with Title and Global Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/40 shrink-0">
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
                size="icon-sm"
                onClick={handleManualRegenerate}
                title="Generate new password(s)"
                className="rounded-lg h-8 w-8 cursor-pointer hover:bg-muted"
              >
                <RotateCw
                  className={cn(
                    "h-3.5 w-3.5 text-foreground transition-transform duration-300",
                    isRotating && "rotate-180",
                  )}
                />
              </Button>

              {/* Action Buttons */}
              {passwords.length > 1 ? (
                <>
                  {/* Sequential Copy Next Password */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyNextPassword}
                    className="gap-1.5 text-xs h-8 cursor-pointer"
                    title="Copy next password in order (cycles back to first)"
                  >
                    {typeof copiedItemIndex === "number" ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-primary" />
                        <span className="font-mono">#{copiedItemIndex + 1}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>

                  {/* Copy All Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyAllPasswords}
                    className="gap-1.5 text-xs h-8 cursor-pointer"
                  >
                    {copiedItemIndex === "all" ? (
                      <>
                        <CheckCheck className="h-3.5 w-3.5 text-primary" />
                        Copied All!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy All
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadAsTextFile}
                    className="gap-1.5 text-xs h-8 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    .txt
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copySinglePassword(0)}
                    disabled={!primaryPassword}
                    className="gap-1.5 text-xs h-8 px-3 cursor-pointer"
                  >
                    {copiedItemIndex === 0 ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-primary" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={downloadAsTextFile}
                    className="gap-1.5 text-xs h-8 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    .txt
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
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full lg:max-h-[690px]">
          <form
            onSubmit={form.handleSubmit(runGenerate)}
            className="flex flex-col h-auto lg:h-full lg:max-h-[690px]"
          >
            <Card className="flex flex-col h-auto lg:h-full lg:max-h-[690px] lg:overflow-hidden">
              <CardContent className="space-y-4 flex flex-col flex-1 p-4 sm:p-6 min-h-0">
                {/* Settings Header matching Left Card Header */}
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
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
                <div className="space-y-3">
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
                </div>

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
                        field.onChange(next);
                        setTimeout(runGenerate, 0);
                      }}
                    />
                  )}
                />
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
