"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAppStore } from "@/lib/store";
import {
  LayoutDashboard,
  Inbox,
  Radar,
  Send,
  BarChart3,
  Fingerprint,
  Users,
  CalendarClock,
  Settings,
  Target,
  Search,
} from "lucide-react";

const PAGES = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/queue", label: "Draft Queue", icon: Inbox },
  { href: "/sources", label: "Sources", icon: Radar },
  { href: "/posts", label: "Posts", icon: Send },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/style", label: "Style Profile", icon: Fingerprint },
  { href: "/competitors", label: "Competitors", icon: Users },
  { href: "/schedule", label: "Schedule", icon: CalendarClock },
  { href: "/benchmark", label: "Benchmark & Mode", icon: Target },
  { href: "/settings", label: "Settings", icon: Settings },
];

// Global ⌘K palette: navigate anywhere, or run a keyword sweep from anywhere.
export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const runKeyword = useAppStore((s) => s.runKeyword);
  const addKeyword = useAppStore((s) => s.addKeyword);
  const keywords = useAppStore((s) => s.keywords);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const sweep = (term: string) => {
    if (!keywords.some((k) => k.term === term)) addKeyword(term);
    runKeyword(term);
    toast.success(`Keyword sweep started: “${term}”`, {
      description: "Crawling X for matching stories — results land in Sources.",
    });
    go("/sources");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search pages, or type a keyword to sweep X…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        {query.trim().length > 1 ? (
          <>
            <CommandGroup heading="Keyword sweep">
              <CommandItem
                value={`sweep-${query}`}
                onSelect={() => sweep(query.trim())}
              >
                <Search className="h-4 w-4" />
                Sweep X for “{query.trim()}”
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
          </>
        ) : null}
        <CommandGroup heading="Go to">
          {PAGES.map((p) => {
            const Icon = p.icon;
            return (
              <CommandItem key={p.href} value={p.label} onSelect={() => go(p.href)}>
                <Icon className="h-4 w-4" />
                {p.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
