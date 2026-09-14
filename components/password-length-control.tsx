"use client";

import React from "react";
import { Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

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
    </div>
  );
}
