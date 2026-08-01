import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ragebaitx — news autoposter",
  description: "AI-assisted news curation & posting for a single X account",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto max-w-3xl px-4 py-6">
          <header className="mb-8 flex items-center justify-between border-b border-neutral-800 pb-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              ragebait<span className="text-sky-400">x</span>
            </Link>
            <nav className="flex gap-4 text-sm text-neutral-400">
              <Link href="/" className="hover:text-neutral-100">
                Queue
              </Link>
              <Link href="/settings" className="hover:text-neutral-100">
                Settings
              </Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
