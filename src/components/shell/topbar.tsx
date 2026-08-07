"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Target, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { ModeBadge } from "./mode-badge";
import { CommandMenu } from "./command-menu";
import { MobileNav } from "./mobile-nav";
import { useAppStore } from "@/lib/store";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/queue": "Draft Queue",
  "/sources": "Sources",
  "/posts": "Posts",
  "/analytics": "Analytics",
  "/style": "Style Profile",
  "/competitors": "Competitors",
  "/schedule": "Schedule",
  "/benchmark": "Benchmark & Mode",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState(false);
  const benchmark = useAppStore((s) => s.benchmark);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const title =
    TITLES[pathname] ??
    TITLES[
      Object.keys(TITLES)
        .filter((k) => k !== "/" && pathname.startsWith(k))
        .sort((a, b) => b.length - a.length)[0] ?? "/"
    ] ??
    "Ragebaitx";

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-8">
      {/* Mobile nav */}
      <Sheet>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="lg:hidden" />}
        >
          <Menu className="h-5 w-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileNav />
        </SheetContent>
      </Sheet>

      <h2 className="text-sm font-semibold">{title}</h2>

      <div className="ml-auto flex items-center gap-2.5">
        {/* Benchmark progress — always one glance away */}
        {!benchmark.graduated ? (
          <Link
            href="/benchmark"
            className="hidden items-center gap-2 rounded-full border border-border px-3 py-1 transition-colors hover:bg-accent sm:flex"
          >
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
            <Progress
              value={(benchmark.streak / benchmark.target) * 100}
              className="h-1.5 w-16"
            />
            <span className="tnum text-xs text-muted-foreground">
              {benchmark.streak}/{benchmark.target}
            </span>
          </Link>
        ) : null}

        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={() => setCmdOpen(true)}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search or sweep keyword…</span>
          <kbd className="pointer-events-none hidden rounded border border-border bg-muted px-1.5 font-mono text-[10px] sm:inline">
            ⌘K
          </kbd>
        </Button>

        <ModeBadge />
      </div>

      <CommandMenu open={cmdOpen} onOpenChange={setCmdOpen} />
    </header>
  );
}
