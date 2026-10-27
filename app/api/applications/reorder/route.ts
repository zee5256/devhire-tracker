import { NextResponse } from "next/server";

import { ApiError, handleApiError, jsonError, readJson, requireUserId } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { reorderSchema } from "@/lib/validations/application";

export async function PATCH(request: Request) {
  try {
    const userId = await requireUserId();
    const body = await readJson(request);
    const parsed = reorderSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid board state.", 422);
    }

    const { items } = parsed.data;
    const uniqueIds = [...new Set(items.map((item) => item.id))];

    // Never allow a user to mutate another user's cards.
    const owned = await prisma.application.findMany({
      where: { id: { in: uniqueIds }, userId },
      select: { id: true },
    });
    if (owned.length !== uniqueIds.length) {
      throw new ApiError("One or more applications could not be found.", 404);
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.application.update({
          where: { id: item.id },
          data: { status: item.status, position: item.position },
        }),
      ),
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
