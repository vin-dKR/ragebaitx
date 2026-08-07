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
  ShieldCheck,
  Flame,
} from "lucide-react";

const NAV = [
  {
    group: "Operate",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/queue", label: "Draft Queue", icon: Inbox, badge: "pending" },
      { href: "/sources", label: "Sources", icon: Radar },
      { href: "/posts", label: "Posts", icon: Send },
    ],
  },
  {
    group: "Optimize",
    items: [
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/style", label: "Style Profile", icon: Fingerprint },
      { href: "/competitors", label: "Competitors", icon: Users },
      { href: "/schedule", label: "Schedule", icon: CalendarClock },
    ],
  },
  {
    group: "Configure",
    items: [
      { href: "/benchmark", label: "Benchmark & Mode", icon: Target },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const pendingCount = useAppStore(
    (s) => s.drafts.filter((d) => d.status === "pending").length,
  );
  const account = useAppStore((s) => s.config.xAccount);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-soft">
          <Flame className="h-4 w-4 text-brand" />
        </span>
        <span className="text-sm font-bold tracking-tight">
          ragebait<span className="text-brand">x</span>
        </span>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV.map((group) => (
          <div key={group.group}>
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
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
                        "group relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )}
                    >
                      {active ? (
                        <span className="absolute -left-3 h-4 w-0.5 rounded-full bg-brand" />
                      ) : null}
                      <Icon className="h-4 w-4 shrink-0" />
                      {item.label}
                      {"badge" in item &&
                      item.badge === "pending" &&
                      pendingCount > 0 ? (
                        <span className="tnum ml-auto rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                          {pendingCount}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Account footer */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand/70 to-brand/30 text-xs font-bold text-white">
            {account.name.slice(0, 1)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight">
              @{account.handle}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-3 w-3 text-status-good" />
              Connected · healthy
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
