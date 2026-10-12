"use client";

import React from "react";
import { Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const QUANTITY_PRESETS = [
  { val: 1, label: "1" },
  { val: 5, label: "5" },
  { val: 10, label: "10" },
  { val: 25, label: "25" },
  { val: 50, label: "50" },
] as const;

/**
 * Render slider and numeric input to control batch quantity.
 *
 * @param props Quantity control properties.
 * @returns Password quantity control component.
 */
export function PasswordQuantityControl(props: {
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    if (isNaN(num)) num = 1;
    num = Math.max(1, Math.min(500, num));
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
          <Layers className="h-4 w-4 text-primary" />
          <Label
            htmlFor="quantity-input"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Batch Quantity
          </Label>
        </div>

        <div className="flex items-center gap-1.5">
          <Input
            id="quantity-input"
            type="number"
            min={1}
            max={500}
            value={props.value}
            onChange={handleInputChange}
            className="w-16 h-8 text-center font-mono font-bold text-sm bg-muted/40 border-border/80"
            aria-label="Password quantity value"
          />
          <span className="text-xs text-muted-foreground font-mono">items</span>
        </div>
      </div>

      <Slider
        value={props.value}
        min={1}
        max={500}
        step={1}
        onValueChange={handleSliderChange}
        onValueCommitted={props.onCommit}
        className="cursor-pointer py-1"
        aria-label="Password quantity slider"
      />

      {/* Tactile Batch Presets */}
      <div className="flex items-center justify-between gap-1.5 pt-0.5">
        <span className="text-[11px] text-muted-foreground select-none">
          Presets:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {QUANTITY_PRESETS.map((preset) => (
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
