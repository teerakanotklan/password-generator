"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

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
  const handleOptionChange = (id: string, checked: boolean) => {
    if (checked) {
      if (!selectedOptions.includes(id)) {
        onChange([...selectedOptions, id]);
      }
    } else {
      onChange(selectedOptions.filter((item) => item !== id));
    }
  };

  return (
    <div className="space-y-2.5">
      <h3 className="text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Rules & Preferences
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {PREFERENCE_ITEMS.map((item) => {
          const isChecked = selectedOptions.includes(item.id);

          return (
            <div
              key={item.id}
              className="flex items-center gap-2"
            >
              <Checkbox
                id={`pref-${item.id}`}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleOptionChange(item.id, Boolean(checked))
                }
              />
              <Label
                htmlFor={`pref-${item.id}`}
                className="text-xs font-medium leading-none cursor-pointer select-none"
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
