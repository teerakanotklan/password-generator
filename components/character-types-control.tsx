"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

export interface CharPoolItem {
  id: string;
  title: string;
}

export const CHAR_POOL_ITEMS: CharPoolItem[] = [
  {
    id: "uppercase",
    title: "Uppercase Letters",
  },
  {
    id: "lowercase",
    title: "Lowercase Letters",
  },
  { id: "number", title: "Numbers" },
  { id: "symbol", title: "Special Symbols" },
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
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`opt-${item.id}`}
                checked={isChecked}
                onCheckedChange={() => toggleOption(item.id)}
              />
              <Label
                htmlFor={`opt-${item.id}`}
                className="text-sm font-medium cursor-pointer"
              >
                {item.title}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
