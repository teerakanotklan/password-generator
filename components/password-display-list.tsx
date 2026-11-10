"use client";

import { Check, Copy, Download, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CopiedState } from "@/hooks/use-password-generator";
import { calculatePasswordStrength } from "@/lib/password-strength";

/**
 * Pick a text color class for a password character by its type.
 *
 * @param char Single password character.
 * @returns Tailwind color class.
 */
function charClass(char: string) {
  if (/[0-9]/.test(char)) return "text-primary";
  if (/[a-zA-Z]/.test(char)) return "text-foreground";
  return "text-symbol";
}

/**
 * Render a password with digits and symbols colored apart from letters.
 *
 * @param props Password text.
 * @returns Colored password element.
 */
function PasswordText(props: { value: string }) {
  return (
    <span className="min-w-0 flex-1 break-all font-mono text-base font-medium sm:text-lg">
      {Array.from(props.value).map((char, idx) => (
        <span key={idx} className={charClass(char)}>
          {char}
        </span>
      ))}
    </span>
  );
}

/**
 * Render generated passwords in a side panel with copy and export actions.
 *
 * @param props Panel and list properties.
 * @returns Password list panel.
 */
export function PasswordDisplayList(props: {
  passwords: string[];
  copiedItemIndex: CopiedState;
  onCopySingle: (index: number) => void;
  onRegenerate: () => void;
  onCopyAll: () => void;
  onDownload: () => void;
}) {
  const strength = calculatePasswordStrength(props.passwords[0] ?? "");
  const count = props.passwords.length;

  return (
    <section className="flex flex-col overflow-hidden rounded-3xl bg-card lg:h-full lg:min-h-0">
      <div className="px-5 pt-5 sm:px-7 sm:pt-7">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            {count === 1 ? "Your password" : `Your ${count} passwords`}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {strength.label}, {strength.entropyBits} bits of entropy. Would take{" "}
            {strength.crackTimeDisplay} to crack.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 pt-4 sm:px-7">
        <Button
          type="button"
          onClick={props.onRegenerate}
          className="h-10 cursor-pointer rounded-full px-4"
        >
          <RotateCw />
          Regenerate
        </Button>
        {count > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={props.onCopyAll}
            className="h-10 cursor-pointer rounded-full px-4"
          >
            {props.copiedItemIndex === "all" ? <Check /> : <Copy />}
            {props.copiedItemIndex === "all" ? "Copied all" : "Copy all"}
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={props.onDownload}
          className="h-10 cursor-pointer rounded-full px-4"
        >
          <Download />
          Save as .txt
        </Button>
      </div>

      <ul className="mt-4 min-h-0 flex-1 divide-y divide-border overflow-y-auto border-y border-border">
        {props.passwords.map((pwd, idx) => {
          const isCopied = props.copiedItemIndex === idx;
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => props.onCopySingle(idx)}
                aria-label={`Copy password ${idx + 1}`}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 px-5 py-3.5 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted sm:px-7",
                  isCopied && "bg-highlight hover:bg-highlight",
                )}
              >
                <PasswordText value={pwd} />
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  {isCopied ? (
                    <>
                      <Check className="size-4 text-foreground" />
                      <span className="text-foreground">Copied</span>
                    </>
                  ) : (
                    <Copy className="size-4" />
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
