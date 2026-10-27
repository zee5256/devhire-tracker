"use client";

import {
  Briefcase,
  ChartColumn,
  Settings,
  SquareKanban,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/board", label: "Board", icon: SquareKanban },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/dashboard", label: "Analytics", icon: ChartColumn },
  { href: "/settings", label: "Settings", icon: Settings },
];

export type ShellUser = {
  name: string | null;
  email: string | null;
  image: string | null;
};

export function NavItems({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={cn("space-y-1", className)} aria-label="Main navigation">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent/10 text-accent"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-4 transition-transform group-hover:scale-105",
                active && "text-accent",
              )}
              aria-hidden
            />
            {item.label}
            {active ? (
              <span
                className="ml-auto size-1.5 rounded-full bg-accent"
                aria-hidden
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppSidebar({
  user,
  isDemo,
}: {
  user: ShellUser;
  isDemo: boolean;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface/70 backdrop-blur lg:flex">
      <div className="flex h-16 items-center justify-between gap-2 px-4">
        <Logo href="/board" />
        <ThemeToggle />
      </div>

      <div className="flex-1 px-3 py-2">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Workspace
        </p>
        <NavItems />

        {isDemo ? (
          <div className="mx-1 mt-4 rounded-xl border border-accent/25 bg-accent/5 p-3">
            <p className="text-[11px] font-semibold text-accent">
              Demo workspace
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
              Explore freely — this data is sample data.
            </p>
          </div>
        ) : null}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-xl p-2">
          <Avatar name={user.name} email={user.email} image={user.image} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">
              {user.name || "Your account"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {user.email}
            </p>
          </div>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

export function MobileChrome({
  user,
  isDemo,
}: {
  user: ShellUser;
  isDemo: boolean;
}) {
  const pathname = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md lg:hidden">
        <Logo href="/board" />
        <div className="flex items-center gap-2">
          {isDemo ? (
            <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-semibold text-accent">
              Demo
            </span>
          ) : null}
          <ThemeToggle />
          <Avatar
            name={user.name}
            email={user.email}
            image={user.image}
            size="sm"
          />
        </div>
      </header>

      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <div className="grid grid-cols-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                  active ? "text-accent" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
