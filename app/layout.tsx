import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { KeyRound, ShieldCheck } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "VaultPass | Cryptographically Secure Password Generator",
  description:
    "Generate strong, cryptographically secure passwords locally in your browser using the Web Crypto API. Calculate real-time entropy and crack time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        inter.variable,
        geistMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold tracking-tight text-sm sm:text-base">
                    VaultPass
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 flex flex-col">{children}</main>

          {/* Footer */}
          <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
            <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                Passwords are generated locally in your browser. No data ever leaves your device.
              </p>
              <p className="text-muted-foreground/80">
                Built with Next.js & Web Crypto
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
