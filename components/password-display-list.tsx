"use client";

import React from "react";
import { Check, Copy } from "lucide-react";
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
    <div className="flex-1 flex flex-col min-h-0 pt-1 overflow-hidden h-[240px] sm:h-[300px] lg:h-full">
      <ScrollArea className="flex-1 min-h-0 h-full">
        <div className="p-1 space-y-1">
          {passwords.map((pwd, idx) => {
            const isCopied = copiedItemIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => onCopySingle(idx)}
                className={cn(
                  "group flex items-center justify-between p-2 rounded-lg font-mono text-xs sm:text-sm transition-colors cursor-pointer border border-transparent",
                  isCopied
                    ? "bg-primary/10 border-primary/30 text-primary font-bold"
                    : "hover:bg-muted/70 hover:border-border/60 text-foreground",
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                  <span className="text-xs text-muted-foreground font-sans w-8 text-right shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="truncate">{renderSyntaxPassword(pwd)}</span>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                  {isCopied ? (
                    <span className="text-[11px] font-sans text-primary flex items-center gap-1">
                      <Check className="h-3 w-3" /> Copied
                    </span>
                  ) : (
                    <span className="text-[11px] font-sans text-muted-foreground flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
