import { NextResponse } from "next/server";

import { ApiError, handleApiError, jsonError, readJson, requireUserId } from "@/lib/api";
import { toNoteDTO } from "@/lib/applications";
import { prisma } from "@/lib/prisma";
import { noteSchema } from "@/lib/validations/application";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const userId = await requireUserId();
    const { id } = await params;

    const application = await prisma.application.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!application) throw new ApiError("Application not found.", 404);

    const body = await readJson(request);
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid note.", 422);
    }

    const note = await prisma.note.create({
      data: { applicationId: id, content: parsed.data.content },
    });

    return NextResponse.json({ note: toNoteDTO(note) }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
