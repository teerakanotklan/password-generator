"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { cn, getCharType } from "@/lib/utils";
import { usePasswordGenerator } from "@/hooks/use-password-generator";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { StrengthMeter } from "@/components/strength-meter";
import { PasswordGeneratorSkeleton } from "@/components/password-generator-skeleton";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Copy,
  Check,
  RotateCw,
  Download,
  Sliders,
  Sparkles,
  AlertCircle,
  Layers,
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
    .max(5000, "Maximum batch size is 5000"),

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

interface OptionItem {
  id: string;
  title: string;
  description: string;
  isCharPool?: boolean;
}

const charPoolItems: OptionItem[] = [
  {
    id: "uppercase",
    title: "Uppercase Letters",
    description: "A, B, C, ... Z",
    isCharPool: true,
  },
  {
    id: "lowercase",
    title: "Lowercase Letters",
    description: "a, b, c, ... z",
    isCharPool: true,
  },
  {
    id: "number",
    title: "Numbers",
    description: "0, 1, 2, ... 9",
    isCharPool: true,
  },
  {
    id: "symbol",
    title: "Special Symbols",
    description: "@#",
    isCharPool: true,
  },
];

const preferenceItems: OptionItem[] = [
  {
    id: "beginWithLetter",
    title: "Start with a Letter",
    description: "First char will be a letter",
  },
  {
    id: "excludeDuplicate",
    title: "Disallow Duplicates",
    description: "No repeating characters",
  },
  {
    id: "excludeSimilar",
    title: "Avoid Ambiguous",
    description: "Excludes i, I, l, 1, o, O, 0...",
  },
  {
    id: "save",
    title: "Save Preferences",
    description: "Remember on this browser",
  },
];

const MAX_PREVIEW_ITEMS = 100;

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

  // Helper to render syntax-colored characters
  const renderSyntaxPassword = (pwd: string) => {
    return Array.from(pwd).map((char, index) => {
      const type = getCharType(char);
      let colorClass = "text-foreground";
      if (type === "digit") colorClass = "text-blue-600 dark:text-blue-400";
      else if (type === "symbol")
        colorClass = "text-amber-600 dark:text-amber-400 font-extrabold";
      else if (type === "upper") colorClass = "text-foreground";
      else if (type === "lower") colorClass = "text-muted-foreground";

      return (
        <span key={index} className={colorClass}>
          {char}
        </span>
      );
    });
  };

  const previewPasswords = passwords.slice(0, MAX_PREVIEW_ITEMS);
  const remainingCount = passwords.length - MAX_PREVIEW_ITEMS;

  // Show matching skeleton while client initializes
  if (!mounted) {
    return <PasswordGeneratorSkeleton />;
  }

  return (
    <div className="w-full">
      {/* Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Unified Passwords Section (Includes on top, then passwords)  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card>
            <CardContent className="space-y-5">
              {/* Header with Title and Global Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold tracking-tight">
                    {passwords.length > 1
                      ? `Generated Passwords (${passwords.length.toLocaleString()})`
                      : "Generated Password"}
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

                  {/* Multiple Passwords Actions */}
                  {passwords.length > 1 ? (
                    <>
                      {/* Sequential Copy Next Password */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={copyNextPassword}
                        className="gap-1.5 text-xs h-8 cursor-pointer"
                        title="Copy next password (cycles through list)"
                      >
                        {typeof copiedItemIndex === "number" ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                            Copied #{copiedItemIndex + 1}!
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
                        onClick={copyAllPasswords}
                        className="gap-1.5 text-xs h-8 cursor-pointer"
                      >
                        {copiedItemIndex === "all" ? (
                          <>
                            <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
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
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => copySinglePassword(0)}
                      disabled={!primaryPassword}
                      className="gap-1.5 text-xs h-8 px-3 cursor-pointer"
                    >
                      {copiedItemIndex === 0 ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-primary-foreground" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* 1. Include & Strength Section (At the TOP of the password list) */}
              <StrengthMeter password={primaryPassword} />

              {/* Generation Error Alert if any */}
              {generationError && (
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}

              {/* 2. Password List Section (Directly under Include & Strength section) */}
              {passwords.length <= 1 ? (
                /* Single Password View */
                <div className="relative group pt-1">
                  <div className="flex items-center justify-between gap-3 min-h-[56px] px-4 py-3 bg-muted/50 dark:bg-muted/30 rounded-xl border border-border/70 transition-colors focus-within:border-primary">
                    <div className="font-mono text-base sm:text-xl font-bold tracking-wider break-all select-all flex-1 py-1">
                      {primaryPassword ? (
                        renderSyntaxPassword(primaryPassword)
                      ) : (
                        <span className="text-muted-foreground text-sm font-normal">
                          Adjust options to generate password...
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-mono text-muted-foreground">
                        {primaryPassword.length} chars
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Batch Passwords List View */
                <div className="space-y-2 pt-1">
                  <ScrollArea className="h-80 rounded-xl border bg-muted/20">
                    <div className="p-2 space-y-1">
                      {previewPasswords.map((pwd, idx) => {
                        const isCopied = copiedItemIndex === idx;

                        return (
                          <div
                            key={idx}
                            onClick={() => copySinglePassword(idx)}
                            className={cn(
                              "group flex items-center justify-between p-2 rounded-lg font-mono text-xs sm:text-sm transition-colors cursor-pointer border border-transparent",
                              isCopied
                                ? "bg-primary/10 border-primary/30 text-primary font-bold"
                                : "hover:bg-muted/70 hover:border-border/60 text-foreground",
                            )}
                          >
                            <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                              <span className="text-xs text-muted-foreground font-sans w-8 text-right shrink-0">
                                #{idx + 1}
                              </span>
                              <span className="truncate">
                                {renderSyntaxPassword(pwd)}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                              {isCopied ? (
                                <span className="text-[11px] font-sans text-primary flex items-center gap-1">
                                  <Check className="h-3 w-3" /> Copied
                                </span>
                              ) : (
                                <span className="text-[11px] font-sans text-muted-foreground flex items-center gap-1">
                                  <Copy className="h-3 w-3" /> Copy
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {remainingCount > 0 && (
                        <div className="text-center py-2.5 px-3 text-xs text-muted-foreground bg-muted/40 rounded-lg border border-border/40 mt-2">
                          <span>
                            Showing first {MAX_PREVIEW_ITEMS} of {passwords.length.toLocaleString()} passwords in preview.
                          </span>
                          <span className="block text-[11px] text-primary/80 mt-0.5">
                            All {passwords.length.toLocaleString()} passwords are ready to Copy All or Download as .txt.
                          </span>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Settings Section (Unified Card matching left column layout)  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col">
          <form onSubmit={form.handleSubmit(runGenerate)}>
            <Card>
              <CardContent className="space-y-5">
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

                {/* Parameters Section (Length & Quantity) */}
                <div className="space-y-3">
                  {/* Password Length Controller */}
                  <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sliders className="h-4 w-4 text-primary" />
                        <label htmlFor="length-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Length
                        </label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Input
                          id="length-input"
                          type="number"
                          min={4}
                          max={64}
                          value={currentLength}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            form.setValue("length", val, { shouldValidate: true });
                            triggerDebouncedGenerate(60);
                          }}
                          className="w-16 h-8 text-center font-mono font-bold text-sm"
                        />
                        <span className="text-xs text-muted-foreground font-mono">chars</span>
                      </div>
                    </div>

                    <div>
                      <input
                        type="range"
                        min={4}
                        max={64}
                        value={currentLength}
                        onChange={(e) => {
                          form.setValue("length", Number(e.target.value), {
                            shouldValidate: true,
                          });
                          triggerDebouncedGenerate(60);
                        }}
                        onMouseUp={runGenerate}
                        onTouchEnd={runGenerate}
                        className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        aria-label="Password length slider"
                      />
                    </div>
                  </div>

                  {/* Batch Quantity Controller */}
                  <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" />
                        <label htmlFor="quantity-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Quantity
                        </label>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Input
                          id="quantity-input"
                          type="number"
                          min={1}
                          max={5000}
                          value={currentQuantity}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            form.setValue("quantity", val, { shouldValidate: true });
                            triggerDebouncedGenerate(60);
                          }}
                          className="w-20 h-8 text-center font-mono font-bold text-sm"
                        />
                        <span className="text-xs text-muted-foreground font-mono">passwords</span>
                      </div>
                    </div>

                    <div>
                      <input
                        type="range"
                        min={1}
                        max={5000}
                        value={currentQuantity}
                        onChange={(e) => {
                          form.setValue("quantity", Number(e.target.value), {
                            shouldValidate: true,
                          });
                          triggerDebouncedGenerate(60);
                        }}
                        onMouseUp={runGenerate}
                        onTouchEnd={runGenerate}
                        className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                        aria-label="Password quantity slider"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground flex items-center justify-between pt-0.5">
                      <span>Batch generation</span>
                      <span className="font-medium text-foreground/80">Max: 5,000 passwords at once</span>
                    </p>
                  </div>
                </div>

                {/* Character Types Configuration */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Character Types
                    </h3>
                    {form.formState.errors.options && (
                      <span className="text-xs text-destructive font-medium">
                        {form.formState.errors.options.message}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Controller
                      name="options"
                      control={form.control}
                      render={({ field }) => (
                        <>
                          {charPoolItems.map((item) => {
                            const isChecked = field.value.includes(item.id);

                            const toggle = () => {
                              const next = isChecked
                                ? field.value.filter((id) => id !== item.id)
                                : [...field.value, item.id];
                              field.onChange(next);
                              setTimeout(runGenerate, 0);
                            };

                            return (
                              <div
                                key={item.id}
                                onClick={toggle}
                                className={cn(
                                  "flex items-start gap-2.5 p-3 rounded-lg border transition-all cursor-pointer select-none",
                                  isChecked
                                    ? "bg-primary/5 border-primary/40 shadow-xs"
                                    : "bg-card border-border/70 hover:bg-muted/30 opacity-70",
                                )}
                              >
                                <Checkbox
                                  id={`opt-${item.id}`}
                                  checked={isChecked}
                                  onCheckedChange={toggle}
                                  className="mt-0.5"
                                />
                                <div className="space-y-0.5">
                                  <label
                                    htmlFor={`opt-${item.id}`}
                                    className="text-xs font-medium leading-none cursor-pointer block"
                                  >
                                    {item.title}
                                  </label>
                                  <p className="text-[11px] text-muted-foreground font-mono">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    />
                  </div>
                </div>

                {/* Advanced Rules & Preferences */}
                <div className="space-y-2.5 pt-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Rules & Preferences
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Controller
                      name="options"
                      control={form.control}
                      render={({ field }) => (
                        <>
                          {preferenceItems.map((item) => {
                            const isChecked = field.value.includes(item.id);

                            const toggle = () => {
                              const next = isChecked
                                ? field.value.filter((id) => id !== item.id)
                                : [...field.value, item.id];
                              field.onChange(next);
                              setTimeout(runGenerate, 0);
                            };

                            return (
                              <div
                                key={item.id}
                                onClick={toggle}
                                className={cn(
                                  "flex items-start gap-2.5 p-3 rounded-lg border transition-all cursor-pointer select-none",
                                  isChecked
                                    ? "bg-muted/60 border-border shadow-xs"
                                    : "bg-card border-border/50 hover:bg-muted/30 opacity-70",
                                )}
                              >
                                <Checkbox
                                  id={`pref-${item.id}`}
                                  checked={isChecked}
                                  onCheckedChange={toggle}
                                  className="mt-0.5"
                                />
                                <div className="space-y-0.5">
                                  <label
                                    htmlFor={`pref-${item.id}`}
                                    className="text-xs font-medium leading-none cursor-pointer block"
                                  >
                                    {item.title}
                                  </label>
                                  <p className="text-[11px] text-muted-foreground">
                                    {item.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
}
