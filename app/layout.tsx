import type { Metadata } from "next";
import { headers } from "next/headers";
import { Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "PassGen",
  description:
    "Generate strong, cryptographically secure passwords locally in your browser using the Web Crypto API. Calculate real-time entropy and crack time.",
};

/**
 * Render root HTML layout shell including header and theme provider.
 *
 * @param props Root layout properties.
 * @returns Root HTML document.
 */
export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>,
) {
  const headersList = await headers();
  const nonce = headersList.get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        bricolage.variable,
        geistMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="theme-system-only"
          enableSystem
          disableTransitionOnChange
          nonce={nonce}
        >
          <main className="flex-1 flex flex-col">{props.children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
