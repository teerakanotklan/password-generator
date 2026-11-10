"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

export interface CharPoolItem {
  id: string;
  title: string;
  range: string;
  sample: string;
  description: string;
}

export const CHAR_POOL_ITEMS: CharPoolItem[] = [
  {
    id: "uppercase",
    title: "Uppercase letters",
    range: "A–Z",
    sample: "ABC",
    description: "Capital Latin glyphs",
  },
  {
    id: "lowercase",
    title: "Lowercase letters",
    range: "a–z",
    sample: "abc",
    description: "Small Latin glyphs",
  },
  {
    id: "number",
    title: "Numeric digits",
    range: "0–9",
    sample: "012",
    description: "Decimal numbers",
  },
  {
    id: "symbol",
    title: "Special symbols",
    range: "!@#$...",
    sample: "%&#*",
    description: "High-entropy punctuation",
  },
];

/**
 * Render interactive cards to toggle character sets with immediate visual tactile feedback.
 *
 * @param props Control properties.
 * @returns Character types control component.
 */
export function CharacterTypesControl(props: {
  selectedOptions: string[];
  onChange: (options: string[]) => void;
  error?: string;
}) {
  const handleToggle = (id: string) => {
    if (props.selectedOptions.includes(id)) {
      props.onChange(props.selectedOptions.filter((item) => item !== id));
    } else {
      props.onChange([...props.selectedOptions, id]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-foreground tracking-tight">
          Character sets
        </span>
        {props.error && (
          <span className="text-[11px] text-destructive font-medium flex items-center gap-1">
            <ShieldAlert className="h-3 w-3 shrink-0" />
            <span>{props.error}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {CHAR_POOL_ITEMS.map((item) => {
          const isChecked = props.selectedOptions.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              title={item.description}
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border cursor-pointer select-none transition-colors",
                isChecked
                  ? "bg-card border-foreground/25"
                  : "bg-muted/30 border-border/60 hover:border-border opacity-70",
              )}
            >
              <Checkbox
                id={`char-${item.id}`}
                checked={isChecked}
                onCheckedChange={() => handleToggle(item.id)}
                onClick={(e) => e.stopPropagation()}
                className="size-3.5 shrink-0"
              />
              <Label
                htmlFor={`char-${item.id}`}
                onClick={(e) => e.stopPropagation()}
                className="min-w-0 flex-1 cursor-pointer truncate text-xs font-medium text-foreground"
              >
                {item.title}
              </Label>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                {item.sample}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}