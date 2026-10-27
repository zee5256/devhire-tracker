import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Bell,
  ChartColumn,
  CircleCheck,
  ListFilter,
  Lock,
  Moon,
  SquareKanban,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { DemoButton } from "@/components/auth/demo-button";
import { buttonStyles } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "DevHire Tracker — Job search, organised",
};

const MOCK_COLUMNS = [
  {
    label: "Wishlist",
    dot: "bg-slate-400",
    cards: [
      { company: "Linear", role: "Product Engineer" },
      { company: "Raycast", role: "Frontend Engineer" },
    ],
  },
  {
    label: "Applied",
    dot: "bg-blue-500",
    cards: [
      { company: "Vercel", role: "Senior Frontend" },
      { company: "Supabase", role: "Full-stack" },
      { company: "Stripe", role: "UI Engineer" },
    ],
  },
  {
    label: "Interview",
    dot: "bg-violet-500",
    cards: [
      { company: "Figma", role: "Design Engineer" },
      { company: "Notion", role: "Frontend" },
    ],
  },
  {
    label: "Offer",
    dot: "bg-emerald-500",
    cards: [{ company: "GitHub", role: "Platform Engineer" }],
  },
  {
    label: "Rejected",
    dot: "bg-rose-500",
    cards: [{ company: "Atlassian", role: "Frontend" }],
  },
];

const FEATURES = [
  {
    icon: SquareKanban,
    title: "Kanban that keeps up",
    body: "Five stages, drag and drop, and ordering that persists. Optimistic updates make moving cards feel instant.",
  },
  {
    icon: ChartColumn,
    title: "Analytics that matter",
    body: "Applications per week, a status funnel, response rate, and offers vs rejections — all computed from your real data.",
  },
  {
    icon: Bell,
    title: "Follow-up reminders",
    body: "Set a follow-up date on any application and see what is due today or overdue right on the dashboard.",
  },
  {
    icon: ListFilter,
    title: "Find anything fast",
    body: "Search by company, role, or notes, filter by status and date range, then export the whole pipeline to CSV.",
  },
  {
    icon: Moon,
    title: "Dark mode, done right",
    body: "A polished light and dark theme that follows your system preference — or override it per browser.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "Email and password or Google OAuth. Every query is scoped to your account, and secrets never reach the client.",
  },
];

const STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "PostgreSQL",
  "Prisma",
  "NextAuth",
  "dnd-kit",
  "Recharts",
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.id) redirect("/board");

  return (
    <div className="min-h-dvh">
      {/* Background */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
        aria-hidden
      />

      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 sm:px-8">
          <Logo href="/" />
          <nav
            className="ml-6 hidden items-center gap-6 text-xs font-medium text-muted-foreground md:flex"
            aria-label="Landing navigation"
          >
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-foreground">
              How it works
            </a>
            <a href="#stack" className="transition-colors hover:text-foreground">
              Stack
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className={buttonStyles({ variant: "ghost", size: "sm" })}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className={buttonStyles({ size: "sm", className: "hidden sm:inline-flex" })}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-16 text-center sm:px-8 sm:pt-24">
          <p className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-xs">
            <Sparkles className="size-3 text-accent" aria-hidden />
            Free, open-source job tracker
          </p>

          <h1 className="mx-auto mt-5 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Track every application.
            <span className="text-gradient"> Land the offer.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            DevHire Tracker turns the chaos of a job search into one calm board —
            with follow-up reminders and analytics that show what is actually
            working.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Link
              href="/register"
              className={buttonStyles({ size: "lg", className: "w-full sm:w-auto" })}
            >
              Start tracking free
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <DemoButton
              size="lg"
              className="w-full sm:w-auto"
              label="Try the live demo"
            />
          </div>

          <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CircleCheck className="size-3 text-success" aria-hidden /> No credit card
            </span>
            <span className="inline-flex items-center gap-1">
              <CircleCheck className="size-3 text-success" aria-hidden /> Seeded demo data
            </span>
            <span className="inline-flex items-center gap-1">
              <CircleCheck className="size-3 text-success" aria-hidden /> Your data stays yours
            </span>
          </p>

          {/* Product mock */}
          <div className="relative mx-auto mt-14 max-w-5xl">
            <div
              className="absolute -inset-x-10 -top-6 bottom-10 -z-10 rounded-[3rem] bg-gradient-to-b from-accent/20 via-accent/5 to-transparent blur-2xl"
              aria-hidden
            />
            <div className="overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-2xl shadow-black/10 dark:shadow-black/50 sm:rounded-3xl">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-rose-400" aria-hidden />
                <span className="size-2.5 rounded-full bg-amber-400" aria-hidden />
                <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden />
                <span className="mx-auto hidden rounded-md border border-border bg-background px-3 py-1 text-[10px] text-muted-foreground sm:block">
                  devhire.app/board
                </span>
              </div>

              <div className="p-3 sm:p-5">
                <div className="mb-3 hidden items-center justify-between sm:flex">
                  <div>
                    <p className="text-sm font-semibold">Pipeline</p>
                    <p className="text-[11px] text-muted-foreground">
                      9 applications · 2 overdue follow-ups
                    </p>
                  </div>
                  <span className="rounded-lg bg-accent px-3 py-1.5 text-[10px] font-medium text-accent-foreground">
                    + Add application
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {MOCK_COLUMNS.map((column) => (
                    <div
                      key={column.label}
                      className="rounded-xl border border-border bg-muted/40 p-1.5"
                    >
                      <div className="mb-1.5 flex items-center gap-1 px-1 pt-0.5">
                        <span className={`size-1.5 rounded-full ${column.dot}`} aria-hidden />
                        <span className="truncate text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {column.label}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {column.cards.slice(0, 2).map((card) => (
                          <div
                            key={card.company}
                            className="rounded-lg border border-border bg-card p-2 shadow-xs"
                          >
                            <p className="text-[8px] uppercase tracking-wide text-muted-foreground">
                              {card.company}
                            </p>
                            <p className="truncate text-[10px] font-medium">
                              {card.role}
                            </p>
                            <div className="mt-1.5 flex gap-1">
                              <span className="h-1 w-8 rounded-full bg-muted" />
                              <span className="h-1 w-5 rounded-full bg-muted" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 right-6 hidden rounded-xl border border-border bg-card px-3 py-2 text-left shadow-xl shadow-black/5 sm:block">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                Response rate
              </p>
              <p className="flex items-center gap-1 text-lg font-semibold">
                <TrendingUp className="size-4 text-success" aria-hidden />
                42%
              </p>
            </div>

            <div className="absolute -bottom-5 left-6 hidden rounded-xl border border-border bg-card px-3 py-2 text-left shadow-xl shadow-black/5 sm:block">
              <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                Follow-ups due
              </p>
              <p className="text-lg font-semibold">3 today</p>
            </div>
          </div>
        </section>

        {/* Stack strip */}
        <section id="stack" className="border-y border-border/70 bg-surface/50">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 py-5 text-[11px] font-medium text-muted-foreground sm:px-8">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/70">
              Built with
            </span>
            {STACK.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">
              Everything in one place
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for how a job search actually feels
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              No spreadsheets, no forgotten follow-ups, no guessing which channel
              works. Just a clean pipeline and the numbers behind it.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="surface card-hover p-5"
                >
                  <span className="grid size-9 place-items-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {feature.body}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
          <div className="surface overflow-hidden">
            <div className="grid gap-0 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Capture the role",
                  body: "Add the company, role, salary, and the date you applied — or add it to your wishlist first.",
                },
                {
                  step: "02",
                  title: "Move it forward",
                  body: "Drag the card from Applied to Interview to Offer. Positions and status save instantly.",
                },
                {
                  step: "03",
                  title: "Learn and follow up",
                  body: "The dashboard highlights overdue follow-ups and shows your response rate over time.",
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className={`p-6 ${index < 2 ? "border-b border-border md:border-b-0 md:border-r" : ""}`}
                >
                  <span className="text-[11px] font-semibold tracking-widest text-accent">
                    {item.step}
                  </span>
                  <h3 className="mt-2 text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-20 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-accent/[0.06] px-6 py-12 text-center">
            <div
              className="absolute -right-20 -top-20 size-64 rounded-full bg-accent/20 blur-3xl"
              aria-hidden
            />
            <h2 className="relative text-2xl font-semibold tracking-tight sm:text-3xl">
              Your next offer starts with a clearer pipeline
            </h2>
            <p className="relative mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Create an account in seconds, or jump straight into the seeded demo.
            </p>
            <div className="relative mt-6 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
              <Link href="/register" className={buttonStyles({ size: "lg" })}>
                Get started free
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <DemoButton size="lg" label="Explore the demo" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
          <Logo href="/" />
          <p className="sm:ml-auto">
            © {new Date().getFullYear()} DevHire Tracker · Built with Next.js and
            Prisma
          </p>
        </div>
      </footer>
    </div>
  );
}
