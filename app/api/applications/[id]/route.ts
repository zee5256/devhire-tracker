import { NextResponse } from "next/server";

import { ApiError, handleApiError, jsonError, readJson, requireUserId } from "@/lib/api";
import { toApplicationData } from "@/lib/application-form";
import {
  applicationWithCount,
  toApplicationDTO,
  toNoteDTO,
} from "@/lib/applications";
import { prisma } from "@/lib/prisma";
import { applicationFormSchema } from "@/lib/validations/application";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const application = await prisma.application.findFirst({
      where: { id, userId },
      include: {
        ...applicationWithCount,
        noteEntries: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!application) throw new ApiError("Application not found.", 404);

    return NextResponse.json({
      application: toApplicationDTO(application),
      notes: application.noteEntries.map(toNoteDTO),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const existing = await prisma.application.findFirst({
      where: { id, userId },
      select: { id: true, status: true },
    });
    if (!existing) throw new ApiError("Application not found.", 404);

    const body = await readJson(request);
    const parsed = applicationFormSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return jsonError(first?.message ?? "Invalid application.", 422);
    }

    const data = toApplicationData(parsed.data);
    const statusChanged = existing.status !== data.status;

    let position: number | undefined;
    if (statusChanged) {
      position = await prisma.application.count({
        where: { userId, status: data.status },
      });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { ...data, ...(position === undefined ? {} : { position }) },
      include: applicationWithCount,
    });

    return NextResponse.json({ application: toApplicationDTO(updated) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const deleted = await prisma.application.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      throw new ApiError("Application not found.", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
