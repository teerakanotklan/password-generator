"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Copy,
  RotateCw,
  Download,
  Sparkles,
  AlertCircle,
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
        <Tabs
          value={mobileTab}
          onValueChange={(val) => setMobileTab(val as "passwords" | "settings")}
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

      {/* Responsive 2-Column Grid on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Password Section (Unified shadcn Card)                       */}
        {/* ========================================================================= */}
        <div
          className={cn(
            "lg:col-span-7 flex flex-col h-auto min-h-0",
            mobileTab === "passwords" ? "flex" : "hidden lg:flex",
          )}
        >
          <Card className="flex flex-col min-h-0 overflow-hidden">
            <CardHeader className="border-b pb-4 shrink-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        Generated Passwords
                      </CardTitle>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {passwords.length}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      Click any password to copy to clipboard
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Regenerate Button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleManualRegenerate}
                    title="Generate new password(s)"
                    className="cursor-pointer gap-1.5"
                  >
                    <RotateCw
                      className={cn(
                        "h-3.5 w-3.5",
                        isRotating && "animate-spin",
                      )}
                    />
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
                        className="cursor-pointer gap-1.5"
                        title="Copy next password in order (cycles back to first)"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy One</span>
                      </Button>

                      {/* Copy All Button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyAllPasswords}
                        className="cursor-pointer gap-1.5"
                        title="Copy all passwords to clipboard"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy All</span>
                      </Button>

                      {/* Export / Download Button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={downloadAsTextFile}
                        className="cursor-pointer gap-1.5"
                        title="Download passwords as a text file"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Export</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-4 flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Generation Error Alert if any */}
              {generationError && (
                <div className="flex items-center gap-2.5 p-3 mb-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium shrink-0">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}

              {/* Password List Section (Immediately at the top) */}
              <PasswordDisplayList
                passwords={passwords}
                copiedItemIndex={copiedItemIndex}
                onCopySingle={copySinglePassword}
              />
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Settings Section (Open Layout, No Card, No Scroll)          */}
        {/* ========================================================================= */}
        <div
          className={cn(
            "lg:col-span-5 flex flex-col space-y-6",
            mobileTab === "settings" ? "flex" : "hidden lg:flex",
          )}
        >
          {/* Settings Section Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Settings2 className="h-4 w-4" />
              </div>
              <div className="text-left">
                <h2 className="text-base font-semibold tracking-tight">
                  Settings & Rules
                </h2>
                <p className="text-xs text-muted-foreground">
                  Customize length, quantity, and character rules
                </p>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              Config
            </Badge>
          </div>

          {/* Form Controls - Natural flow, no scroll container */}
          <form
            onSubmit={form.handleSubmit(runGenerate)}
            className="space-y-5"
          >
            {/* Parameters Section (Length Slider & Presets) */}
            <PasswordLengthControl
              value={currentLength}
              onChange={(val) => {
                form.setValue("length", val, { shouldValidate: true });
                triggerDebouncedGenerate(60);
              }}
              onCommit={runGenerate}
            />

            <Separator />

            {/* Parameters Section (Quantity Slider) */}
            <PasswordQuantityControl
              value={currentQuantity}
              onChange={(val) => {
                form.setValue("quantity", val, { shouldValidate: true });
                triggerDebouncedGenerate(60);
              }}
              onCommit={runGenerate}
            />

            <Separator />

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

            <Separator />

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
          </form>
        </div>
      </div>
    </div>
  );
}
