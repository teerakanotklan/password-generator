"use client";

import React from "react";
import { Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface PasswordQuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  onCommit?: () => void;
}

export function PasswordQuantityControl({
  value,
  onChange,
  onCommit,
}: PasswordQuantityControlProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    if (isNaN(num)) num = 1;
    num = Math.max(1, Math.min(500, num));
    onChange(num);
  };

  const handleSliderChange = (val: number | readonly number[]) => {
    const nextVal = typeof val === "number" ? val : val[0];
    onChange(nextVal);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <Label
            htmlFor="quantity-input"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Quantity
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Input
            id="quantity-input"
            type="number"
            min={1}
            max={500}
            value={value}
            onChange={handleInputChange}
            className="w-20 h-8 text-center font-mono font-bold text-sm"
            aria-label="Password quantity value"
          />
          <span className="text-xs text-muted-foreground font-mono">
            passwords
          </span>
        </div>
      </div>

      <Slider
        value={value}
        min={1}
        max={500}
        step={1}
        onValueChange={handleSliderChange}
        onValueCommitted={onCommit}
        aria-label="Password quantity slider"
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
        <span>Batch generation</span>
        <span>Max: 500 passwords</span>
      </div>
    </div>
  );
}
