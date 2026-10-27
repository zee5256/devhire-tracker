import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { readJson, handleApiError, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await readJson(request);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return jsonError(first?.message ?? "Invalid details.", 422);
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    if (existing) {
      return jsonError("An account with that email already exists.", 409);
    }

    const passwordHash = await hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return jsonError("An account with that email already exists.", 409);
    }
    return handleApiError(error);
  }
}
