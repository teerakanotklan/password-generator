"use client";

import React from "react";
import { Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <label
              htmlFor="quantity-input"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Quantity
            </label>
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
        </CardTitle>
        <CardDescription>
          <Slider
            value={value}
            min={1}
            max={500}
            step={1}
            onValueChange={handleSliderChange}
            onValueCommitted={onCommit}
            aria-label="Password quantity slider"
          />
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Batch generation</p>
        <p className="text-xs text-muted-foreground">
          Max: 500 passwords at once
        </p>
      </CardContent>
    </Card>
  );
}
