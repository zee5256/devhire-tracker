"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/fields";
import { apiRequest, errorMessage } from "@/lib/client-api";
import { registerSchema } from "@/lib/validations/auth";

const registerFormSchema = registerSchema
  .extend({ confirmPassword: z.string().min(1, "Confirm your password") })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setFormError(null);

    try {
      await apiRequest<{ user: { id: string } }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });
    } catch (error) {
      const message = errorMessage(error);
      if (message.toLowerCase().includes("already exists")) {
        setError("email", { message: "This email is already registered." });
      } else {
        setFormError(message);
      }
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setFormError(
        "Your account was created, but sign-in failed. Please sign in manually.",
      );
      return;
    }

    router.push("/board");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Start tracking applications in under a minute.
      </p>

      {formError ? (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-danger/25 bg-danger/5 px-3 py-2 text-xs text-danger"
        >
          {formError}
        </div>
      ) : null}

      <div className="mt-6">
        {googleEnabled ? (
          <>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setGoogleLoading(true);
                void signIn("google", { callbackUrl: "/board" });
              }}
              loading={googleLoading}
            >
              {!googleLoading ? <GoogleIcon /> : null}
              Sign up with Google
            </Button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                or with email
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
          </>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Field label="Name" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              autoComplete="name"
              placeholder="Ada Lovelace"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
          </Field>

          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
          </Field>

          <Field
            label="Password"
            htmlFor="password"
            error={errors.password?.message}
            hint="At least 8 characters"
          >
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="pr-10"
                aria-invalid={Boolean(errors.password)}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
          </Field>

          <Field
            label="Confirm password"
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
          </Field>

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-accent hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
