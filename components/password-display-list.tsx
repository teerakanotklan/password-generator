"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CopiedState } from "@/hooks/use-password-generator";
import { calculatePasswordStrength } from "@/lib/password/strength";
import {
  Copy,
  Check,
  Download,
  RotateCw,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";

/**
 * Render list of generated passwords with copy and export controls.
 *
 * @param props Display list properties.
 * @returns Password display list component.
 */
export function PasswordDisplayList(props: {
  passwords: string[];
  copiedItemIndex: CopiedState;
  onCopySingle: (index: number) => void;
  onRegenerate: () => void;
  isRotating: boolean;
  onCopyNext?: () => void;
  onCopyAll?: () => void;
  onDownload?: () => void;
}) {
  const primaryPassword = props.passwords[0] || "";
  const strength = calculatePasswordStrength(primaryPassword);

  if (props.passwords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] p-8 text-center rounded-2xl border border-dashed border-border/80 bg-muted/10">
        <Sparkles className="h-8 w-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm font-medium text-foreground">
          No passwords generated yet
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Select your desired parameters and click Generate to produce secure keys.
        </p>
        <Button
          type="button"
          size="sm"
          onClick={props.onRegenerate}
          className="mt-4 cursor-pointer gap-2"
        >
          <RotateCw className="h-3.5 w-3.5" />
          <span>Generate Now</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-foreground">
                Generated Passwords
              </h2>
              <Badge variant="secondary" className="font-mono text-xs px-2 py-0 h-5">
                {props.passwords.length}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Click any password to copy to clipboard
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={props.onRegenerate}
            disabled={props.isRotating}
            title="Generate new password(s)"
            className="cursor-pointer gap-1.5 h-8 text-xs font-medium border-border/70 hover:bg-muted"
          >
            <RotateCw
              className={cn("h-3.5 w-3.5", props.isRotating && "animate-spin")}
            />
            <span>Generate</span>
          </Button>

          {props.passwords.length > 1 && (
            <>
              {props.onCopyNext && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={props.onCopyNext}
                  className="cursor-pointer gap-1.5 h-8 text-xs font-medium border-border/70 hover:bg-muted"
                  title="Copy next password in order (cycles back to first)"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy One</span>
                </Button>
              )}

              {props.onCopyAll && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={props.onCopyAll}
                  className={cn(
                    "cursor-pointer gap-1.5 h-8 text-xs font-medium border-border/70 hover:bg-muted",
                    props.copiedItemIndex === "all" &&
                      "border-emerald-500 text-emerald-600 bg-emerald-500/10",
                  )}
                  title="Copy all passwords to clipboard"
                >
                  {props.copiedItemIndex === "all" ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied All!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy All</span>
                    </>
                  )}
                </Button>
              )}

              {props.onDownload && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={props.onDownload}
                  className="cursor-pointer gap-1.5 h-8 text-xs font-medium border-border/70 hover:bg-muted"
                  title="Download passwords as a text file"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Real-time Entropy & Security Indicator Strip */}
      {primaryPassword && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium text-foreground">
              {strength.label}
            </span>
            <span>•</span>
            <span className="font-mono">{strength.entropyBits} bits entropy</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Clock className="h-3 w-3 shrink-0" />
            <span>Crack time:</span>
            <span className="font-semibold text-foreground">
              {strength.crackTimeDisplay}
            </span>
          </div>
        </div>
      )}

      {/* Single Password Display (Hero style when quantity is 1) */}
      {props.passwords.length === 1 ? (
        <div
          onClick={() => props.onCopySingle(0)}
          className={cn(
            "group relative flex flex-col justify-between p-5 rounded-xl border transition-all cursor-pointer active:scale-[0.995]",
            props.copiedItemIndex === 0
              ? "bg-emerald-500/10 border-emerald-500/40 shadow-xs"
              : "bg-muted/20 border-border/70 hover:bg-muted/40 hover:border-border",
          )}
        >
          <div className="flex items-center justify-between pb-3 text-xs text-muted-foreground border-b border-border/30">
            <span className="font-mono text-[11px] font-medium">
              Primary Key ({primaryPassword.length} chars)
            </span>
            <span className="text-[11px] flex items-center gap-1">
              {props.copiedItemIndex === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="h-3.5 w-3.5" />
                  Copied to clipboard
                </span>
              ) : (
                <span className="group-hover:text-foreground transition-colors flex items-center gap-1">
                  <Copy className="h-3.5 w-3.5" />
                  Click to copy
                </span>
              )}
            </span>
          </div>

          <div className="py-4 overflow-x-auto">
            <span className="text-lg sm:text-xl font-mono tracking-wider font-medium text-foreground select-all break-all">
              {primaryPassword}
            </span>
          </div>
        </div>
      ) : (
        /* Batch Passwords Stream */
        <div className="max-h-[calc(100vh-270px)] min-h-[460px] overflow-y-auto space-y-1.5 pr-1 focus:outline-none">
          {props.passwords.map((pwd, idx) => {
            const isCopied = props.copiedItemIndex === idx;

            return (
              <div
                key={idx}
                onClick={() => props.onCopySingle(idx)}
                className={cn(
                  "group flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm border transition-all cursor-pointer select-none active:scale-[0.995]",
                  isCopied
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "bg-muted/20 border-border/40 hover:bg-muted/60 hover:border-border text-foreground",
                )}
              >
                <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                  <span className="text-[11px] text-muted-foreground font-mono font-medium w-6 text-right shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="truncate tracking-wide font-mono font-medium text-foreground select-all">
                    {pwd}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {isCopied ? (
                    <Badge
                      variant="default"
                      className="text-[10px] h-5 py-0 px-2 flex items-center gap-1 bg-emerald-600 text-white"
                    >
                      <Check className="h-3 w-3" />
                      <span>Copied</span>
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground/30 group-hover:text-muted-foreground text-xs flex items-center gap-1 transition-colors">
                      <Copy className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
