"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getCharType } from "@/lib/password/strength";
import type { CopiedState } from "@/hooks/use-password-generator";

export function renderSyntaxPassword(pwd: string) {
  return Array.from(pwd).map((char, index) => {
    const type = getCharType(char);
    let colorClass = "text-foreground";
    if (type === "digit") colorClass = "text-blue-600 dark:text-blue-400";
    else if (type === "symbol")
      colorClass = "text-amber-600 dark:text-amber-400 font-extrabold";
    else if (type === "upper") colorClass = "text-foreground";
    else if (type === "lower") colorClass = "text-muted-foreground";

    return (
      <span key={index} className={colorClass}>
        {char}
      </span>
    );
  });
}

interface PasswordDisplayListProps {
  passwords: string[];
  primaryPassword?: string;
  copiedItemIndex: CopiedState;
  onCopySingle: (index: number) => void;
}

export function PasswordDisplayList({
  passwords,
  copiedItemIndex,
  onCopySingle,
}: PasswordDisplayListProps) {
  if (passwords.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-h-0 pt-1 overflow-hidden h-[240px] sm:h-[300px] lg:h-full">
        <div className="text-muted-foreground text-sm font-normal py-4 text-center">
          Adjust options to generate password...
        </div>
      </div>
    );
  }

  return (
    <ScrollArea
      className="flex-1 min-h-0 max-h-[420px] md:max-h-[470px] overflow-auto border rounded-xl p-2"
      hideScrollbar
    >
      <div className="space-y-1">
        {passwords.map((pwd, idx) => {
          const isCopied = copiedItemIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => onCopySingle(idx)}
              className={cn(
                "group flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-lg font-mono text-xs sm:text-sm transition-all cursor-pointer select-none active:scale-[0.99]",
                isCopied
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted/60 text-foreground",
              )}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0 flex-1">
                <span className="text-xs text-muted-foreground font-sans font-medium w-7 text-right shrink-0">
                  #{idx + 1}
                </span>
                <span className="truncate font-medium tracking-wide">
                  {pwd}
                </span>
              </div>

              {isCopied && (
                <span className="text-[11px] font-sans font-medium text-primary shrink-0 ml-2">
                  Copied
                </span>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
