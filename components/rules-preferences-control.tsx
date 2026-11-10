"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck, ArrowRightToLine, Fingerprint, HardDrive } from "lucide-react";

export interface PreferenceItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const PREFERENCE_ITEMS: PreferenceItem[] = [
  {
    id: "excludeSimilar",
    title: "Avoid ambiguous glyphs",
    description: "Filters visually identical characters like i, l, 1, o, O, 0",
    badge: "Recommended",
    icon: ShieldCheck,
  },
  {
    id: "beginWithLetter",
    title: "Enforce leading letter",
    description: "Guarantee first character is [A-Za-z] for legacy systems",
    icon: ArrowRightToLine,
  },
  {
    id: "excludeDuplicate",
    title: "Disallow duplicate characters",
    description: "Each symbol in the password occurs at most once",
    icon: Fingerprint,
  },
  {
    id: "save",
    title: "Persist configuration locally",
    description: "Saves selected lengths and pools across browser visits",
    badge: "Auto-saved",
    icon: HardDrive,
  },
];

/**
 * Render checkboxes to toggle cryptographic preferences with enhanced card layout.
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
    <div className="space-y-2">
      <span className="text-xs font-semibold text-foreground tracking-tight">
        Rules
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1">
        {PREFERENCE_ITEMS.map((item) => {
          const isChecked = props.selectedOptions.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              title={item.description}
              className="flex items-center gap-2 py-1 cursor-pointer select-none"
            >
              <Checkbox
                id={`pref-${item.id}`}
                checked={isChecked}
                onCheckedChange={() => handleToggle(item.id)}
                onClick={(e) => e.stopPropagation()}
                className="size-3.5 shrink-0"
              />
              <Label
                htmlFor={`pref-${item.id}`}
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer text-xs font-medium text-foreground"
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