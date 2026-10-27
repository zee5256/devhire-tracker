import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { auth } from "@/lib/auth";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Throws a 401 ApiError when there is no session. */
export async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new ApiError("You must be signed in to do that.", 401);
  }
  return userId;
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return jsonError(error.message, error.status);
  }

  if (error instanceof ZodError) {
    const first = error.issues[0];
    return NextResponse.json(
      {
        error: first?.message ?? "Invalid input.",
        fieldErrors: first?.path.length
          ? { [String(first.path[0])]: first.message }
          : undefined,
      },
      { status: 422 },
    );
  }

  console.error("[api]", error);
  return jsonError("Something went wrong. Please try again.", 500);
}

/** Parses a JSON body without throwing on malformed input. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError("Request body must be valid JSON.", 400);
  }
}
