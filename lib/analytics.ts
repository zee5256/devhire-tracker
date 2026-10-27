import { prisma } from "@/lib/prisma";
import { STATUS_META, APPLICATION_STATUSES } from "@/lib/constants";
import { daysFromToday } from "@/lib/utils";
import type { ApplicationStatus } from "@prisma/client";

export type WeeklyPoint = {
  label: string;
  applications: number;
  interviews: number;
};

export type FunnelPoint = {
  status: ApplicationStatus;
  label: string;
  count: number;
  fill: string;
};

export type OutcomePoint = {
  name: string;
  value: number;
  fill: string;
};

export type Analytics = {
  total: number;
  active: number;
  interviews: number;
  offers: number;
  rejections: number;
  wishlist: number;
  responseRate: number;
  offerRate: number;
  dueToday: number;
  overdue: number;
  weekly: WeeklyPoint[];
  funnel: FunnelPoint[];
  outcomes: OutcomePoint[];
};

const WEEK_COUNT = 8;

function startOfWeekUtc(date: Date): Date {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const offset = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - offset);
  return d;
}

export async function getAnalytics(userId: string): Promise<Analytics> {
  const applications = await prisma.application.findMany({
    where: { userId },
    select: {
      status: true,
      appliedDate: true,
      followUpDate: true,
      createdAt: true,
    },
  });

  const counts = new Map<ApplicationStatus, number>();
  for (const status of APPLICATION_STATUSES) counts.set(status, 0);

  let submitted = 0;
  let responded = 0;
  let dueToday = 0;
  let overdue = 0;

  for (const app of applications) {
    counts.set(app.status, (counts.get(app.status) ?? 0) + 1);

    if (app.status !== "WISHLIST") submitted += 1;
    if (app.status === "INTERVIEW" || app.status === "OFFER") responded += 1;
    if (app.status === "REJECTED") responded += 1;

    if (app.followUpDate && app.status !== "REJECTED") {
      const days = daysFromToday(app.followUpDate);
      if (days === 0) dueToday += 1;
      if (days !== null && days < 0) overdue += 1;
    }
  }

  const wishlist = counts.get("WISHLIST") ?? 0;
  const interviews = counts.get("INTERVIEW") ?? 0;
  const offers = counts.get("OFFER") ?? 0;
  const rejections = counts.get("REJECTED") ?? 0;
  const total = applications.length;

  // Build the last 8 weeks, oldest first.
  const currentWeek = startOfWeekUtc(new Date());
  const buckets = Array.from({ length: WEEK_COUNT }, (_, i) => {
    const weekStart = new Date(currentWeek);
    weekStart.setUTCDate(weekStart.getUTCDate() - (WEEK_COUNT - 1 - i) * 7);
    return {
      weekStart: weekStart.getTime(),
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }).format(weekStart),
      applications: 0,
      interviews: 0,
    };
  });

  for (const app of applications) {
    const date = app.appliedDate ?? app.createdAt;
    const weekStart = startOfWeekUtc(date).getTime();
    const bucket = buckets.find((point) => point.weekStart === weekStart);
    if (!bucket) continue;
    bucket.applications += 1;
    if (app.status === "INTERVIEW" || app.status === "OFFER") {
      bucket.interviews += 1;
    }
  }

  const funnel: FunnelPoint[] = APPLICATION_STATUSES.map((status) => ({
    status,
    label: STATUS_META[status].label,
    count: counts.get(status) ?? 0,
    fill: STATUS_META[status].hex,
  }));

  return {
    total,
    active: total - rejections - offers,
    interviews,
    offers,
    rejections,
    wishlist,
    responseRate: submitted === 0 ? 0 : Math.round((responded / submitted) * 100),
    offerRate: submitted === 0 ? 0 : Math.round((offers / submitted) * 100),
    dueToday,
    overdue,
    weekly: buckets.map(({ label, applications: apps, interviews: ints }) => ({
      label,
      applications: apps,
      interviews: ints,
    })),
    funnel,
    outcomes: [
      { name: "Offers", value: offers, fill: STATUS_META.OFFER.hex },
      { name: "Rejections", value: rejections, fill: STATUS_META.REJECTED.hex },
      {
        name: "In progress",
        value: total - offers - rejections,
        fill: STATUS_META.INTERVIEW.hex,
      },
    ],
  };
}
