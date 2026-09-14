"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export interface PreferenceItem {
  id: string;
  title: string;
  description: string;
}

export const PREFERENCE_ITEMS: PreferenceItem[] = [
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
    description: "Excludes i, l, 1, o, O, 0...",
  },
  {
    id: "save",
    title: "Save Preferences",
    description: "Remember on this browser",
  },
];

interface RulesPreferencesControlProps {
  selectedOptions: string[];
  onChange: (options: string[]) => void;
}

export function RulesPreferencesControl({
  selectedOptions,
  onChange,
}: RulesPreferencesControlProps) {
  const toggleOption = (id: string) => {
    const next = selectedOptions.includes(id)
      ? selectedOptions.filter((item) => item !== id)
      : [...selectedOptions, id];
    onChange(next);
  };

  return (
    <div className="space-y-2.5 pt-1">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Rules & Preferences
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PREFERENCE_ITEMS.map((item) => {
          const isChecked = selectedOptions.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => toggleOption(item.id)}
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
                onCheckedChange={() => toggleOption(item.id)}
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
      </div>
    </div>
  );
}
