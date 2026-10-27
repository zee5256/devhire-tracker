import { PrismaClient, type ApplicationStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@devhire.app";
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "demo1234";

/** UTC midnight, `offset` days from today (negative = past). */
function day(offset: number): Date {
  const now = new Date();
  const date = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
  );
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
}

type SeedNote = { content: string; daysAgo: number };

type SeedApplication = {
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDaysAgo: number | null;
  followUpOffset: number | null;
  location: string;
  salary: string;
  jobUrl: string;
  notes: string;
  timeline: SeedNote[];
};

const SEED_APPLICATIONS: SeedApplication[] = [
  {
    company: "Vercel",
    role: "Senior Frontend Engineer",
    status: "INTERVIEW",
    appliedDaysAgo: 12,
    followUpOffset: 2,
    location: "Remote · US",
    salary: "$150k – $190k",
    jobUrl: "https://vercel.com/careers",
    notes:
      "Referred by Maya on the DX team. Recruiter screen went well — next step is a technical deep dive on rendering and caching.",
    timeline: [
      { content: "Recruiter screen booked for Thursday.", daysAgo: 9 },
      {
        content:
          "Screen complete. They liked the Next.js performance work in my portfolio. Panel scheduled.",
        daysAgo: 6,
      },
      { content: "Sent a thank-you note and availability for next week.", daysAgo: 3 },
    ],
  },
  {
    company: "Linear",
    role: "Product Engineer",
    status: "APPLIED",
    appliedDaysAgo: 5,
    followUpOffset: 0,
    location: "Remote",
    salary: "$140k – $170k",
    jobUrl: "https://linear.app/careers",
    notes:
      "Applied through the careers page with a short note about the keyboard-first design. No response yet.",
    timeline: [{ content: "Application submitted.", daysAgo: 5 }],
  },
  {
    company: "Stripe",
    role: "UI Engineer",
    status: "APPLIED",
    appliedDaysAgo: 9,
    followUpOffset: -2,
    location: "Remote · EU",
    salary: "€95k – €120k",
    jobUrl: "https://stripe.com/jobs",
    notes:
      "Strong match on the design systems team. Follow-up is overdue — send a polite nudge to the recruiter.",
    timeline: [
      { content: "Applied via referral link.", daysAgo: 9 },
      { content: "Follow-up due — draft a short nudge.", daysAgo: 2 },
    ],
  },
  {
    company: "Figma",
    role: "Design Engineer",
    status: "INTERVIEW",
    appliedDaysAgo: 21,
    followUpOffset: 1,
    location: "San Francisco · Hybrid",
    salary: "$160k – $200k",
    jobUrl: "https://figma.com/careers",
    notes:
      "Two rounds done. The take-home was a canvas-based prototype — feedback was positive. Final panel next.",
    timeline: [
      { content: "Recruiter call — team context and process.", daysAgo: 16 },
      { content: "Take-home brief received.", daysAgo: 13 },
      { content: "Take-home submitted; demo scheduled.", daysAgo: 7 },
      { content: "Demo went well. Waiting on the final panel.", daysAgo: 2 },
    ],
  },
  {
    company: "GitHub",
    role: "Platform Engineer",
    status: "OFFER",
    appliedDaysAgo: 35,
    followUpOffset: 5,
    location: "Remote",
    salary: "$170k – $210k",
    jobUrl: "https://github.com/about/careers",
    notes:
      "Offer received. Base plus equity, remote-first. Need to respond by the end of next week — compare with the Figma process.",
    timeline: [
      { content: "Applied after a referral from a friend on the platform team.", daysAgo: 35 },
      { content: "Technical screen — systems design.", daysAgo: 24 },
      { content: "Onsite loop (4 interviews).", daysAgo: 14 },
      { content: "Verbal offer received. Written offer on the way.", daysAgo: 4 },
    ],
  },
  {
    company: "Notion",
    role: "Frontend Engineer",
    status: "APPLIED",
    appliedDaysAgo: 3,
    followUpOffset: 6,
    location: "New York · Hybrid",
    salary: "$135k – $165k",
    jobUrl: "https://notion.so/careers",
    notes:
      "Applied to the editor team. Portfolio includes a block-based editor side project.",
    timeline: [{ content: "Application submitted.", daysAgo: 3 }],
  },
  {
    company: "Supabase",
    role: "Full-stack Engineer",
    status: "WISHLIST",
    appliedDaysAgo: null,
    followUpOffset: null,
    location: "Remote",
    salary: "$120k – $160k",
    jobUrl: "https://supabase.com/careers",
    notes:
      "Great fit for the Postgres + Next.js stack. Tailor the résumé around the realtime work first.",
    timeline: [],
  },
  {
    company: "Raycast",
    role: "Frontend Engineer",
    status: "WISHLIST",
    appliedDaysAgo: null,
    followUpOffset: null,
    location: "Remote",
    salary: "€90k – €120k",
    jobUrl: "https://raycast.com/jobs",
    notes: "Need to finish the extension side project before applying.",
    timeline: [],
  },
  {
    company: "Atlassian",
    role: "Frontend Developer",
    status: "REJECTED",
    appliedDaysAgo: 28,
    followUpOffset: null,
    location: "Remote · AU",
    salary: "A$140k – A$170k",
    jobUrl: "https://atlassian.com/careers",
    notes:
      "Rejected after the recruiter screen. Feedback: looking for more experience with large-scale design systems.",
    timeline: [
      { content: "Recruiter screen.", daysAgo: 22 },
      { content: "Rejection email received. Keep the door open.", daysAgo: 18 },
    ],
  },
  {
    company: "Shopify",
    role: "Senior React Developer",
    status: "REJECTED",
    appliedDaysAgo: 40,
    followUpOffset: null,
    location: "Remote",
    salary: "C$150k – C$180k",
    jobUrl: "https://shopify.com/careers",
    notes: "No response after the take-home. Moving on.",
    timeline: [{ content: "Take-home submitted.", daysAgo: 31 }],
  },
  {
    company: "Datadog",
    role: "Frontend Engineer",
    status: "APPLIED",
    appliedDaysAgo: 15,
    followUpOffset: -5,
    location: "Paris · Hybrid",
    salary: "€75k – €95k",
    jobUrl: "https://datadoghq.com/careers",
    notes:
      "Applied through a warm intro. Follow-up is overdue — the recruiter said they would reply after the hiring review.",
    timeline: [{ content: "Warm intro sent by Antoine.", daysAgo: 15 }],
  },
  {
    company: "Cloudflare",
    role: "Systems Engineer",
    status: "WISHLIST",
    appliedDaysAgo: null,
    followUpOffset: null,
    location: "Austin · Hybrid",
    salary: "$150k – $185k",
    jobUrl: "https://cloudflare.com/careers",
    notes: "Interested in the edge runtime team. Check for a Rust requirement.",
    timeline: [],
  },
  {
    company: "Duolingo",
    role: "Web Engineer",
    status: "INTERVIEW",
    appliedDaysAgo: 18,
    followUpOffset: 3,
    location: "Pittsburgh · Hybrid",
    salary: "$140k – $175k",
    jobUrl: "https://duolingo.com/careers",
    notes:
      "Loved the product exercise. Next round is a frontend architecture discussion.",
    timeline: [
      { content: "Recruiter call.", daysAgo: 13 },
      { content: "Product exercise submitted.", daysAgo: 6 },
      { content: "Exercise review scheduled.", daysAgo: 1 },
    ],
  },
  {
    company: "Spotify",
    role: "Frontend Engineer",
    status: "APPLIED",
    appliedDaysAgo: 1,
    followUpOffset: 4,
    location: "Stockholm · Remote",
    salary: "€80k – €105k",
    jobUrl: "https://spotify.com/careers",
    notes: "Applied to the web player team.",
    timeline: [{ content: "Application submitted.", daysAgo: 1 }],
  },
];

async function main() {
  console.log("→ Seeding DevHire Tracker demo workspace…");

  const passwordHash = await hash(DEMO_PASSWORD, 12);

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: "Demo Recruiter", passwordHash },
    create: {
      name: "Demo Recruiter",
      email: DEMO_EMAIL,
      passwordHash,
    },
  });

  // Reset only the demo user's data so the seed is safely repeatable.
  await prisma.application.deleteMany({ where: { userId: user.id } });

  const positions = new Map<ApplicationStatus, number>();

  for (const item of SEED_APPLICATIONS) {
    const position = positions.get(item.status) ?? 0;
    positions.set(item.status, position + 1);

    const appliedDate =
      item.appliedDaysAgo === null ? null : day(-item.appliedDaysAgo);
    const createdAt =
      item.appliedDaysAgo === null
        ? day(-Math.floor(Math.random() * 20) - 1)
        : appliedDate;

    await prisma.application.create({
      data: {
        userId: user.id,
        company: item.company,
        role: item.role,
        status: item.status,
        location: item.location,
        salary: item.salary,
        jobUrl: item.jobUrl,
        notes: item.notes,
        appliedDate,
        followUpDate:
          item.followUpOffset === null ? null : day(item.followUpOffset),
        createdAt: createdAt ?? new Date(),
        position,
        noteEntries: {
          create: item.timeline.map((note) => ({
            content: note.content,
            createdAt: day(-note.daysAgo),
          })),
        },
      },
    });
  }

  console.log(
    `✓ Seeded ${SEED_APPLICATIONS.length} applications for ${DEMO_EMAIL}`,
  );
  console.log(`  Password: ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
