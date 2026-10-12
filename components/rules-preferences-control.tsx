"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface PreferenceItem {
  id: string;
  title: string;
  description: string;
}

export const PREFERENCE_ITEMS: PreferenceItem[] = [
  {
    id: "excludeSimilar",
    title: "Avoid Ambiguous Glyphs",
    description: "Excludes confusing characters: i, l, 1, o, O, 0",
  },
  {
    id: "beginWithLetter",
    title: "Enforce Leading Letter",
    description: "First character is guaranteed to be [A-Za-z]",
  },
  {
    id: "excludeDuplicate",
    title: "Disallow Duplicate Chars",
    description: "Every character in password is unique",
  },
  {
    id: "save",
    title: "Persist Settings Locally",
    description: "Store current preferences in browser localStorage",
  },
];

/**
 * Render checkboxes to toggle cryptographic preferences.
 *
 * @param props Rules preferences properties.
 * @returns Rules preferences control component.
 */
export function RulesPreferencesControl(props: {
  selectedOptions: string[];
  onChange: (options: string[]) => void;
}) {
  const handleToggle = (id: string) => {
    if (props.selectedOptions.includes(id)) {
      props.onChange(props.selectedOptions.filter((item) => item !== id));
    } else {
      props.onChange([...props.selectedOptions, id]);
    }
  };

  return (
    <div className="space-y-2.5">
      <h3 className="text-start text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Cryptographic Rules
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PREFERENCE_ITEMS.map((item) => {
          const isChecked = props.selectedOptions.includes(item.id);

          return (
            <label
              key={item.id}
              htmlFor={`pref-${item.id}`}
              className={cn(
                "flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer select-none",
                isChecked
                  ? "bg-muted/40 border-border"
                  : "bg-muted/10 border-border/40 hover:bg-muted/20 opacity-70",
              )}
            >
              <Checkbox
                id={`pref-${item.id}`}
                checked={isChecked}
                onCheckedChange={() => handleToggle(item.id)}
                className="mt-0.5 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={`pref-${item.id}`}
                  className="text-xs font-medium text-foreground cursor-pointer block"
                >
                  {item.title}
                </Label>
                <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  {item.description}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
