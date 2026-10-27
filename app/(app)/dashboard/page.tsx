import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Briefcase,
  ChartColumn,
  CircleAlert,
  CircleCheck,
  Clock,
  TrendingUp,
} from "lucide-react";

import {
  FunnelChart,
  OutcomesDonut,
  WeeklyChart,
} from "@/components/analytics/charts";
import { StatusBadge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ExportCsvLink } from "@/components/ui/export-csv-link";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { getAnalytics } from "@/lib/analytics";
import { listApplications } from "@/lib/applications";
import { getCurrentUserId } from "@/lib/auth";
import { isDueToday, isOverdue, relativeDayLabel } from "@/lib/utils";

export const metadata: Metadata = { title: "Analytics" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const [analytics, applications] = await Promise.all([
    getAnalytics(userId),
    listApplications(userId),
  ]);

  const reminders = applications
    .filter((app) => app.followUpDate && app.status !== "REJECTED")
    .sort((a, b) => (a.followUpDate ?? "").localeCompare(b.followUpDate ?? ""))
    .slice(0, 4);

  const dueTodayCount = applications.filter(
    (app) => app.status !== "REJECTED" && isDueToday(app.followUpDate),
  ).length;
  const overdueCount = applications.filter(
    (app) => app.status !== "REJECTED" && isOverdue(app.followUpDate),
  ).length;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Analytics"
        description="A clear view of your search — activity, conversion, and what needs attention."
        actions={<ExportCsvLink />}
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard
          label="Applications"
          value={analytics.total}
          hint={`${analytics.active} still active`}
          icon={Briefcase}
        />
        <StatCard
          label="Response rate"
          value={`${analytics.responseRate}%`}
          hint={`${analytics.interviews + analytics.offers + analytics.rejections} replies received`}
          icon={TrendingUp}
        />
        <StatCard
          label="Interviews"
          value={analytics.interviews}
          hint="Conversations in progress"
          icon={ChartColumn}
        />
        <StatCard
          label="Offers"
          value={analytics.offers}
          hint={`${analytics.offerRate}% of applications`}
          icon={CircleCheck}
          accent
        />
      </div>

      {analytics.total === 0 ? (
        <EmptyState
          icon={ChartColumn}
          title="No analytics yet"
          description="Add a few applications and this dashboard will fill up with weekly activity, your funnel, response rate, and outcomes."
          action={
            <Link href="/board" className={buttonStyles()}>
              Go to the board
            </Link>
          }
          className="py-20"
        />
      ) : (
        <div className="grid gap-3 xl:grid-cols-3">
          <section className="surface p-4 xl:col-span-2">
            <header className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">Applications per week</h2>
                <p className="text-xs text-muted-foreground">
                  The last 8 weeks of activity
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded-full bg-[#5b5bd6]" />
                  Applications
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-0.5 w-4 rounded-full border-t-2 border-dashed border-[#10b981]" />
                  Interviews & offers
                </span>
              </div>
            </header>
            <WeeklyChart data={analytics.weekly} />
          </section>

          <section className="surface flex flex-col p-4">
            <header className="mb-1">
              <h2 className="text-sm font-semibold">Offers vs rejections</h2>
              <p className="text-xs text-muted-foreground">
                How your submitted applications ended up
              </p>
            </header>
            <div className="flex flex-1 flex-col justify-center">
              <OutcomesDonut
                data={analytics.outcomes}
                total={analytics.total - analytics.wishlist}
              />
            </div>
          </section>

          <section className="surface flex flex-col p-4 xl:col-span-2">
            <header className="mb-3">
              <h2 className="text-sm font-semibold">Status funnel</h2>
              <p className="text-xs text-muted-foreground">
                Where every application sits right now
              </p>
            </header>
            <div className="min-h-[230px] flex-1">
              <FunnelChart data={analytics.funnel} />
            </div>
          </section>

          <section className="surface p-4">
            <header className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">Reminders</h2>
                <p className="text-xs text-muted-foreground">
                  Follow-ups that need attention
                </p>
              </div>
              <Link
                href="/board"
                className="shrink-0 text-xs font-medium text-accent hover:underline"
              >
                Open board
              </Link>
            </header>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-2.5">
                <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  <Clock className="size-3" aria-hidden />
                  Due today
                </p>
                <p className="mt-1 text-xl font-semibold tabular-nums">
                  {dueTodayCount}
                </p>
              </div>
              <div className="rounded-xl border border-danger/25 bg-danger/5 p-2.5">
                <p className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-danger">
                  <CircleAlert className="size-3" aria-hidden />
                  Overdue
                </p>
                <p className="mt-1 text-xl font-semibold tabular-nums">
                  {overdueCount}
                </p>
              </div>
            </div>

            {reminders.length === 0 ? (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-4 text-xs text-muted-foreground">
                <CircleCheck className="size-4 text-success" aria-hidden />
                You are all caught up.
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {reminders.map((app) => {
                  const overdue = isOverdue(app.followUpDate);
                  return (
                    <li
                      key={app.id}
                      className="rounded-xl border border-border p-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium">
                            {app.company}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {app.role}
                          </p>
                        </div>
                        <StatusBadge status={app.status} withDot={false} />
                      </div>
                      <p
                        className={`mt-1.5 text-[10px] font-medium ${
                          overdue
                            ? "text-danger"
                            : isDueToday(app.followUpDate)
                              ? "text-amber-600 dark:text-amber-300"
                              : "text-muted-foreground"
                        }`}
                      >
                        {relativeDayLabel(app.followUpDate)}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
