"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/constants";

export function DemoButton({
  label = "Try the live demo",
  variant = "secondary",
  size = "md",
  className,
  fullWidth = false,
}: {
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  fullWidth?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDemo() {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        redirect: false,
      });

      if (result?.error) {
        toast.error("The demo account is not available", {
          description: "Run `npm run db:seed` to create the demo workspace.",
        });
        return;
      }

      router.push("/board");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      loading={loading}
      onClick={handleDemo}
      className={fullWidth ? `w-full ${className ?? ""}` : className}
    >
      {!loading ? <Sparkles className="size-4" aria-hidden /> : null}
      {label}
    </Button>
  );
}
