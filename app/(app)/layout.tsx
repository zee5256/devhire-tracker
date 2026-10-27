import { redirect } from "next/navigation";

import { AppSidebar, MobileChrome } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";
import { DEMO_EMAIL } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = {
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
  };
  const isDemo = user.email === DEMO_EMAIL;

  return (
    <div className="min-h-dvh">
      <AppSidebar user={user} isDemo={isDemo} />
      <MobileChrome user={user} isDemo={isDemo} />
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-[1500px] px-4 pb-24 pt-[4.5rem] sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
