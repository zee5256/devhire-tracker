import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ApplicationsClient } from "@/components/applications/applications-client";
import { ApplicationsProvider } from "@/hooks/use-applications";
import { listApplications } from "@/lib/applications";
import { getCurrentUserId } from "@/lib/auth";

export const metadata: Metadata = { title: "Applications" };
export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const applications = await listApplications(userId);

  return (
    <ApplicationsProvider initialApplications={applications}>
      <ApplicationsClient />
    </ApplicationsProvider>
  );
}
