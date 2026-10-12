"use client";

import { KeyRound } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

/**
 * Render sticky top application header with brand mark and theme toggle.
 *
 * @returns Header element.
 */
export function SiteHeader() {
  return (
    <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-bold tracking-tight text-foreground text-sm sm:text-base">
          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
            <KeyRound className="h-4 w-4" />
          </div>
          <span>PassGen</span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
