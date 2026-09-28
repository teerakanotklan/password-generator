import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCharType } from "@/lib/password/strength";
import type { CopiedState } from "@/hooks/use-password-generator";
import { Copy, Check } from "lucide-react";

export function renderSyntaxPassword(pwd: string) {
  return Array.from(pwd).map((char, index) => {
    const type = getCharType(char);
    let colorClass = "text-foreground";
    if (type === "digit") colorClass = "text-blue-600 dark:text-blue-400 font-semibold";
    else if (type === "symbol")
      colorClass = "text-amber-600 dark:text-amber-400 font-bold";
    else if (type === "upper") colorClass = "text-foreground font-medium";
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
      <div className="flex-1 flex flex-col items-center justify-center min-h-[280px] p-6 text-center">
        <p className="text-muted-foreground text-sm">
          No passwords generated yet. Adjust your settings or click Generate.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea
      className="flex-1 min-h-[320px] max-h-[520px] lg:max-h-[560px] overflow-auto rounded-lg pr-1"
      hideScrollbar
    >
      <div className="space-y-1.5 p-1">
        {passwords.map((pwd, idx) => {
          const isCopied = copiedItemIndex === idx;

          return (
            <div
              key={idx}
              onClick={() => onCopySingle(idx)}
              className={cn(
                "group flex items-center justify-between px-3.5 py-2.5 rounded-lg font-mono text-xs sm:text-sm border transition-all cursor-pointer select-none active:scale-[0.99]",
                isCopied
                  ? "bg-primary/10 border-primary/30 text-primary shadow-2xs"
                  : "bg-muted/30 border-border/40 hover:bg-muted/70 hover:border-border text-foreground",
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                <span className="text-xs text-muted-foreground font-sans font-medium w-6 text-right shrink-0">
                  #{idx + 1}
                </span>
                <span className="truncate tracking-wide">
                  {renderSyntaxPassword(pwd)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {isCopied ? (
                  <Badge variant="default" className="text-[11px] h-5 py-0 px-1.5 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Copied</span>
                  </Badge>
                ) : (
                  <span className="text-muted-foreground/0 group-hover:text-muted-foreground text-xs flex items-center gap-1 transition-colors">
                    <Copy className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
