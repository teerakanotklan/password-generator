"use client";

import React from "react";
import { Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface PasswordLengthControlProps {
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
}

export function PasswordLengthControl({
  value,
  onChange,
  onCommit,
}: PasswordLengthControlProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    if (isNaN(num)) num = 4;
    num = Math.max(4, Math.min(64, num));
    onChange(num);
  };

  const handleSliderChange = (val: number | readonly number[]) => {
    const nextVal = typeof val === "number" ? val : val[0];
    onChange(nextVal);
  };

  return (
    <div className="p-3.5 rounded-xl border border-border/70 bg-card/60 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-primary" />
          <label
            htmlFor="length-input"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Length
          </label>
        </div>
        <div className="flex items-center gap-1.5">
          <Input
            id="length-input"
            type="number"
            min={4}
            max={64}
            value={value}
            onChange={handleInputChange}
            className="w-16 h-8 text-center font-mono font-bold text-sm"
            aria-label="Password length value"
          />
          <span className="text-xs text-muted-foreground font-mono">chars</span>
        </div>
      </div>

      <div className="py-1">
        <Slider
          value={value}
          min={4}
          max={64}
          step={1}
          onValueChange={handleSliderChange}
          onValueCommitted={onCommit}
          aria-label="Password length slider"
        />
      </div>

      {/* Fast preset pills for touch & mobile */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <span className="text-[11px] text-muted-foreground select-none">Presets:</span>
        <div className="flex items-center gap-1.5">
          {[8, 12, 16, 20, 24, 32].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                onChange(preset);
                onCommit?.();
              }}
              className={cn(
                "px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors cursor-pointer border",
                value === preset
                  ? "bg-primary text-primary-foreground border-primary font-semibold shadow-2xs"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50",
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
