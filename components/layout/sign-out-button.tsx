"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SignOutButton({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      aria-label="Sign out"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut className="size-4" aria-hidden />
    </Button>
  );
}
