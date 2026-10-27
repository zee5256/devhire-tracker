import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Mail, ShieldCheck, Sparkles } from "lucide-react";

import { SignOutButton } from "@/components/layout/sign-out-button";
import { Avatar } from "@/components/ui/avatar";
import { ExportCsvLink } from "@/components/ui/export-csv-link";
import { PageHeader } from "@/components/ui/page-header";
import { ThemePicker } from "@/components/ui/theme-toggle";
import { auth } from "@/lib/auth";
import { DEMO_EMAIL } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: { select: { applications: true } },
    },
  });

  if (!user) redirect("/login");

  const isDemo = user.email === DEMO_EMAIL;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <PageHeader
        title="Settings"
        description="Your account, appearance, and data."
      />

      <section className="surface p-5">
        <div className="flex items-center gap-4">
          <Avatar
            name={user.name}
            email={user.email}
            image={user.image}
            size="lg"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">
              {user.name || "Your account"}
            </p>
            <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
              <Mail className="size-3" aria-hidden />
              {user.email}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
          {isDemo ? (
            <span className="ml-auto shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-semibold text-accent">
              Demo account
            </span>
          ) : null}
        </div>
      </section>

      <section className="surface p-5">
        <h2 className="text-sm font-semibold">Appearance</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Pick a theme for this browser. System follows your OS setting.
        </p>
        <div className="mt-4 max-w-sm">
          <ThemePicker />
        </div>
      </section>

      <section className="surface p-5">
        <h2 className="text-sm font-semibold">Your data</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {user._count.applications}{" "}
          {user._count.applications === 1 ? "application" : "applications"} saved
          to your account.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ExportCsvLink
            label="Export applications as CSV"
            size="sm"
          />
        </div>
      </section>

      {isDemo ? (
        <section className="surface border-accent/25 bg-accent/[0.04] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-accent" aria-hidden />
            You are exploring the demo
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            This workspace is seeded with realistic sample data so you can try
            the board, reminders, and analytics. Create your own account to
            start from a clean slate.
          </p>
        </section>
      ) : null}

      <section className="surface p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="size-4 text-muted-foreground" aria-hidden />
          Account
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Passwords are hashed with bcrypt and sessions are signed JWTs.
        </p>
        <div className="mt-4">
          <SignOutButtonWithLabel />
        </div>
      </section>
    </div>
  );
}

function SignOutButtonWithLabel() {
  return (
    <div className="inline-flex items-center gap-2">
      <SignOutButton />
      <span className="text-xs text-muted-foreground">Sign out of this device</span>
    </div>
  );
}
