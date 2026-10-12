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
}

export const CHAR_POOL_ITEMS: CharPoolItem[] = [
  {
    id: "uppercase",
    title: "Uppercase",
    range: "A-Z",
    sample: "ABC",
  },
  {
    id: "lowercase",
    title: "Lowercase",
    range: "a-z",
    sample: "abc",
  },
  {
    id: "number",
    title: "Numbers",
    range: "0-9",
    sample: "123",
  },
  {
    id: "symbol",
    title: "Symbols",
    range: "!@#$...",
    sample: "#$!&",
  },
];

/**
 * Render checkboxes to toggle character types.
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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Character Sets
        </h3>
        {props.error && (
          <span className="text-xs text-destructive font-medium flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{props.error}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {CHAR_POOL_ITEMS.map((item) => {
          const isChecked = props.selectedOptions.includes(item.id);

          return (
            <label
              key={item.id}
              htmlFor={`char-${item.id}`}
              className={cn(
                "group relative flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer select-none",
                isChecked
                  ? "bg-primary/5 border-primary/40 shadow-xs"
                  : "bg-muted/20 border-border/60 hover:bg-muted/40 hover:border-border opacity-70",
              )}
            >
              <div className="flex items-center justify-between w-full">
                <Label
                  htmlFor={`char-${item.id}`}
                  className="text-xs font-semibold text-foreground cursor-pointer"
                >
                  {item.title}
                </Label>
                <Checkbox
                  id={`char-${item.id}`}
                  checked={isChecked}
                  onCheckedChange={() => handleToggle(item.id)}
                />
              </div>

              <div className="flex items-center justify-between w-full mt-1.5 font-mono text-[11px]">
                <span className="text-muted-foreground">{item.range}</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded font-medium",
                    isChecked
                      ? "bg-background text-foreground border border-border/40"
                      : "text-muted-foreground/50",
                  )}
                >
                  {item.sample}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
