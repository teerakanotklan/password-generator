"use client";

import React from "react";
import { Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const LENGTH_PRESETS = [
  { val: 8, label: "8" },
  { val: 12, label: "12" },
  { val: 16, label: "16" },
  { val: 20, label: "20" },
  { val: 24, label: "24" },
  { val: 32, label: "32" },
] as const;

/**
 * Render slider and numeric input to control password length.
 *
 * @param props Length control properties.
 * @returns Password length control component.
 */
export function PasswordLengthControl(props: {
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    if (isNaN(num)) num = 4;
    num = Math.max(4, Math.min(64, num));
    props.onChange(num);
  };

  const handleSliderChange = (val: number | readonly number[]) => {
    const nextVal = typeof val === "number" ? val : val[0];
    props.onChange(nextVal);
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-primary" />
          <Label
            htmlFor="length-input"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Password Length
          </Label>
        </div>

        <div className="flex items-center gap-1.5">
          <Input
            id="length-input"
            type="number"
            min={4}
            max={64}
            value={props.value}
            onChange={handleInputChange}
            className="w-16 h-8 text-center font-mono font-bold text-sm bg-muted/40 border-border/80"
            aria-label="Password length value"
          />
          <span className="text-xs text-muted-foreground font-mono">chars</span>
        </div>
      </div>

      <Slider
        value={props.value}
        min={4}
        max={64}
        step={1}
        onValueChange={handleSliderChange}
        onValueCommitted={props.onCommit}
        className="cursor-pointer py-1"
        aria-label="Password length slider"
      />

      {/* Tactile Presets */}
      <div className="flex items-center justify-between gap-1.5 pt-0.5">
        <span className="text-[11px] text-muted-foreground select-none">
          Presets:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {LENGTH_PRESETS.map((preset) => (
            <button
              key={preset.val}
              type="button"
              onClick={() => {
                props.onChange(preset.val);
                props.onCommit?.();
              }}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer border active:scale-95",
                props.value === preset.val
                  ? "bg-primary text-primary-foreground border-primary font-semibold shadow-xs"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60",
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
