"use client";

import { useEffect, useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { cn, getCharType } from "@/lib/utils";
import { usePasswordGenerator } from "@/hooks/use-password-generator";
import { useFormPersistence } from "@/hooks/use-form-persistence";
import { StrengthMeter } from "@/components/strength-meter";

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
    .max(100, "Maximum batch size is 100"),

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

const QUANTITY_PRESETS = [1, 5, 10, 25, 50];

export function GeneratePasswordForm() {
  const [isRotating, setIsRotating] = useState(false);

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

  // Initial generation on component load
  useEffect(() => {
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

  return (
    <div className="w-full">
      {/* Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: All Passwords Section (Primary Showcase + Batch Passwords)    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Primary Password Showcase Card */}
          <Card>
            <CardContent className="space-y-5">
              {/* Top info badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Generated Password
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Length: {primaryPassword.length}
                </span>
              </div>

              {/* Large Password Display */}
              <div className="relative group">
                <div className="flex items-center justify-between gap-3 min-h-[60px] sm:min-h-[72px] px-4 py-3 bg-muted/60 dark:bg-muted/30 rounded-xl border border-border/80 transition-colors focus-within:border-primary">
                  <div className="font-mono text-base sm:text-xl md:text-2xl font-bold tracking-wider break-all select-all flex-1 py-1">
                    {primaryPassword ? (
                      Array.from(primaryPassword).map((char, index) => {
                        const type = getCharType(char);
                        let colorClass = "text-foreground";
                        if (type === "digit")
                          colorClass = "text-blue-600 dark:text-blue-400";
                        else if (type === "symbol")
                          colorClass = "text-amber-600 dark:text-amber-400 font-extrabold";
                        else if (type === "upper")
                          colorClass = "text-foreground";
                        else if (type === "lower")
                          colorClass = "text-muted-foreground";

                        return (
                          <span key={index} className={colorClass}>
                            {char}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground text-sm font-normal">
                        Adjust options to generate password...
                      </span>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleManualRegenerate}
                      title="Generate new password"
                      className="rounded-lg h-10 w-10 cursor-pointer hover:bg-background shadow-xs transition-transform active:scale-95"
                    >
                      <RotateCw
                        className={cn(
                          "h-4 w-4 text-foreground transition-transform duration-300",
                          isRotating && "rotate-180",
                        )}
                      />
                    </Button>

                    <Button
                      type="button"
                      size="default"
                      onClick={() => copySinglePassword(0)}
                      disabled={!primaryPassword}
                      className="h-10 px-4 gap-2 rounded-lg cursor-pointer shadow-xs transition-all active:scale-95"
                    >
                      {copiedItemIndex === 0 ? (
                        <>
                          <Check className="h-4 w-4 text-primary-foreground animate-in zoom-in-50" />
                          <span className="font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span className="font-semibold">Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Live Entropy & Strength Meter */}
              <StrengthMeter password={primaryPassword} />

              {/* Generation Error Alert */}
              {generationError && (
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{generationError}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Batch Passwords Section (Rendered in left column when quantity > 1) */}
          {passwords.length > 1 && (
            <Card>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold">
                      Batch Passwords ({passwords.length})
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Click any row to copy, or export the whole batch
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyAllPasswords}
                      className="gap-1.5 text-xs cursor-pointer"
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
                      className="gap-1.5 text-xs cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download .txt
                    </Button>
                  </div>
                </div>

                <ScrollArea className="h-72 sm:h-80 rounded-lg border bg-muted/20">
                  <div className="p-2 space-y-1">
                    {passwords.map((pwd, idx) => {
                      const isCopied = copiedItemIndex === idx;

                      return (
                        <div
                          key={idx}
                          onClick={() => copySinglePassword(idx)}
                          className={cn(
                            "group flex items-center justify-between p-2 rounded-md font-mono text-xs sm:text-sm transition-colors cursor-pointer",
                            isCopied
                              ? "bg-primary/10 text-primary font-bold"
                              : "hover:bg-muted/80 text-foreground",
                          )}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                            <span className="text-xs text-muted-foreground font-sans w-6 text-right">
                              #{idx + 1}
                            </span>
                            <span className="truncate">{pwd}</span>
                          </div>

                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Settings Section                                            */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <form onSubmit={form.handleSubmit(runGenerate)} className="space-y-5">
            {/* Settings Header */}
            <div className="flex items-center gap-2 pb-1 border-b border-border/40">
              <Settings2 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold tracking-tight">
                Settings & Customization
              </h2>
            </div>

            {/* Password Length Controller */}
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    <label htmlFor="length-input" className="text-sm font-semibold">
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
                        runGenerate();
                      }}
                      className="w-16 h-8 text-center font-mono font-bold text-sm"
                    />
                    <span className="text-xs text-muted-foreground">chars</span>
                  </div>
                </div>

                {/* Range Slider */}
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
                      runGenerate();
                    }}
                    className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                    aria-label="Password length slider"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Batch Quantity Controller */}
            <Card>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <label htmlFor="quantity-input" className="text-sm font-semibold">
                      Quantity
                    </label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Input
                      id="quantity-input"
                      type="number"
                      min={1}
                      max={100}
                      value={currentQuantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        form.setValue("quantity", val, { shouldValidate: true });
                        runGenerate();
                      }}
                      className="w-16 h-8 text-center font-mono font-bold text-sm"
                    />
                    <span className="text-xs text-muted-foreground">passwords</span>
                  </div>
                </div>

                {/* Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-muted-foreground mr-1">Presets:</span>
                  {QUANTITY_PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant={currentQuantity === preset ? "default" : "outline"}
                      size="xs"
                      onClick={() => {
                        form.setValue("quantity", preset, { shouldValidate: true });
                        runGenerate();
                      }}
                      className="cursor-pointer text-xs"
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Character Types Configuration */}
            <div className="space-y-2.5">
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
            <div className="space-y-2.5">
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
          </form>
        </div>
      </div>
    </div>
  );
}
