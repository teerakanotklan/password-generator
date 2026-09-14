"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface CharPoolItem {
  id: string;
  title: string;
  description: string;
}

export const CHAR_POOL_ITEMS: CharPoolItem[] = [
  { id: "uppercase", title: "Uppercase Letters", description: "A, B, C, ... Z" },
  { id: "lowercase", title: "Lowercase Letters", description: "a, b, c, ... z" },
  { id: "number", title: "Numbers", description: "0, 1, 2, ... 9" },
  { id: "symbol", title: "Special Symbols", description: "@#" },
];

interface CharacterTypesControlProps {
  selectedOptions: string[];
  onChange: (options: string[]) => void;
  error?: string;
}

export function CharacterTypesControl({
  selectedOptions,
  onChange,
  error,
}: CharacterTypesControlProps) {
  const toggleOption = (id: string) => {
    const next = selectedOptions.includes(id)
      ? selectedOptions.filter((item) => item !== id)
      : [...selectedOptions, id];
    onChange(next);
  };

  return (
    <div className="space-y-2.5 pt-1">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Character Types
        </h3>
        {error && (
          <span className="text-xs text-destructive font-medium">{error}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CHAR_POOL_ITEMS.map((item) => {
          const isChecked = selectedOptions.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => toggleOption(item.id)}
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
                onCheckedChange={() => toggleOption(item.id)}
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
      </div>
    </div>
  );
}
