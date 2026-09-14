"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-full opacity-50 cursor-default"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={cycleTheme}
      className="flex items-center gap-1.5 rounded-full px-3 text-xs font-medium cursor-pointer border-border/80 hover:bg-accent transition-colors"
      title={`Theme: ${theme ?? "system"} (click to cycle)`}
      aria-label="Toggle theme"
    >
      {theme === "light" && <Sun className="h-3.5 w-3.5 text-amber-500" />}
      {theme === "dark" && <Moon className="h-3.5 w-3.5 text-blue-400" />}
      {(theme === "system" || !theme) && (
        <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className="capitalize">{theme ?? "system"}</span>
    </Button>
  );
}
