import Link from "next/link";
import { ArrowUpRight, CircleCheck, SquareKanban, TrendingUp } from "lucide-react";

import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand panel */}
      <aside className="relative hidden overflow-hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col">
        <div
          className="absolute inset-0 bg-grid opacity-[0.15]"
          aria-hidden
        />
        <div
          className="absolute -left-24 top-1/4 size-96 rounded-full bg-indigo-500/30 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -right-20 bottom-0 size-80 rounded-full bg-emerald-500/20 blur-3xl"
          aria-hidden
        />

        <div className="relative">
          <Logo href="/" className="[&_span]:text-white" />
        </div>

        <div className="relative mt-auto max-w-md">
          <p className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80">
            <SquareKanban className="size-3" aria-hidden />
            Built for developers on the hunt
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight">
            Your job search, finally under control.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            One board for every application, automatic follow-up reminders, and
            analytics that show what is actually working.
          </p>

          <ul className="mt-6 space-y-2.5 text-sm text-white/75">
            {[
              "Drag applications from wishlist to offer",
              "Never miss a follow-up again",
              "See response rates and offers at a glance",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <CircleCheck className="size-4 shrink-0 text-emerald-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-10 flex items-center gap-6 border-t border-white/10 pt-5 text-xs text-white/50">
          <span className="inline-flex items-center gap-1.5">
            <TrendingUp className="size-3.5" aria-hidden />
            Real-time analytics
          </span>
          <span>Free forever</span>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-1 transition-colors hover:text-white"
          >
            Back to site
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </aside>

      {/* Form panel */}
      <div className="flex min-h-dvh flex-col px-5 py-6 sm:px-8">
        <div className="lg:hidden">
          <Logo href="/" />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          {children}
        </div>
        <p className="text-center text-[11px] text-muted-foreground">
          © {new Date().getFullYear()} DevHire Tracker. Built with Next.js.
        </p>
      </div>
    </div>
  );
}
