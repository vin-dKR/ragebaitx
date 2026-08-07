"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
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
  Flame,
} from "lucide-react";

const ITEMS = [
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

export function MobileNav() {
  const pathname = usePathname();
  const pendingCount = useAppStore(
    (s) => s.drafts.filter((d) => d.status === "pending").length,
  );
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-soft">
          <Flame className="h-4 w-4 text-brand" />
        </span>
        <span className="text-sm font-bold tracking-tight">
          ragebait<span className="text-brand">x</span>
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {ITEMS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm",
                    active
                      ? "bg-accent font-medium"
                      : "text-muted-foreground hover:bg-accent/60",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.href === "/queue" && pendingCount > 0 ? (
                    <span className="tnum ml-auto rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                      {pendingCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
