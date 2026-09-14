"use client";

import { useMemo } from "react";
import { calculatePasswordStrength } from "@/lib/password/strength";
import type { PasswordStrength } from "@/lib/password/types";
import { Shield, ShieldAlert, ShieldCheck, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StrengthMeterProps {
  password?: string;
  className?: string;
}

export function StrengthMeter({ password = "", className }: StrengthMeterProps) {
  const strength: PasswordStrength = useMemo(
    () => calculatePasswordStrength(password),
    [password],
  );

  if (!password) {
    return null;
  }

  const getShieldIcon = () => {
    if (strength.score >= 3) {
      return <ShieldCheck className="h-4 w-4 text-emerald-500" />;
    }
    if (strength.score === 2) {
      return <Shield className="h-4 w-4 text-amber-500" />;
    }
    return <ShieldAlert className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className={cn("space-y-3 pt-2", className)}>
      {/* Top row: Label, Badge, Crack Time */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 font-medium">
          {getShieldIcon()}
          <span>Password Strength:</span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full font-semibold border text-[11px]",
              strength.badgeClass,
            )}
          >
            {strength.label}
          </span>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="flex items-center gap-1" title="Estimated crack time">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Crack Time:{" "}
              <strong className="text-foreground font-medium">
                {strength.crackTimeDisplay}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1" title="Shannon Entropy">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>
              <strong className="text-foreground font-medium">
                {strength.entropyBits}
              </strong>{" "}
              bits
            </span>
          </div>
        </div>
      </div>

      {/* 4 Segment Progress Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        {[0, 1, 2, 3].map((step) => {
          const isActive = strength.score > step;
          return (
            <div
              key={step}
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isActive ? strength.color : "bg-muted dark:bg-muted/40",
              )}
            />
          );
        })}
      </div>

      {/* Character Composition Badges */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px]">
        <span className="text-muted-foreground mr-1">Includes:</span>
        <span
          className={cn(
            "px-2 py-0.5 rounded border transition-colors",
            strength.hasUpper
              ? "bg-primary/10 border-primary/20 text-primary font-medium"
              : "bg-muted/40 border-border/40 text-muted-foreground/60 line-through",
          )}
        >
          Uppercase (A-Z)
        </span>
        <span
          className={cn(
            "px-2 py-0.5 rounded border transition-colors",
            strength.hasLower
              ? "bg-primary/10 border-primary/20 text-primary font-medium"
              : "bg-muted/40 border-border/40 text-muted-foreground/60 line-through",
          )}
        >
          Lowercase (a-z)
        </span>
        <span
          className={cn(
            "px-2 py-0.5 rounded border transition-colors",
            strength.hasNumber
              ? "bg-primary/10 border-primary/20 text-primary font-medium"
              : "bg-muted/40 border-border/40 text-muted-foreground/60 line-through",
          )}
        >
          Numbers (0-9)
        </span>
        <span
          className={cn(
            "px-2 py-0.5 rounded border transition-colors",
            strength.hasSymbol
              ? "bg-primary/10 border-primary/20 text-primary font-medium"
              : "bg-muted/40 border-border/40 text-muted-foreground/60 line-through",
          )}
        >
          Symbols (@#)
        </span>
      </div>
    </div>
  );
}
