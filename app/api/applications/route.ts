import { NextResponse } from "next/server";

import {
  handleApiError,
  jsonError,
  readJson,
  requireUserId,
} from "@/lib/api";
import {
  applicationWithCount,
  listApplications,
  toApplicationDTO,
} from "@/lib/applications";
import { toApplicationData } from "@/lib/application-form";
import { prisma } from "@/lib/prisma";
import { applicationFormSchema } from "@/lib/validations/application";

export async function GET() {
  try {
    const userId = await requireUserId();
    const applications = await listApplications(userId);
    return NextResponse.json({ applications });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUserId();
    const body = await readJson(request);
    const parsed = applicationFormSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return jsonError(first?.message ?? "Invalid application.", 422);
    }

    const data = toApplicationData(parsed.data);

    // New cards go to the top of their column.
    await prisma.application.updateMany({
      where: { userId, status: data.status },
      data: { position: { increment: 1 } },
    });

    const created = await prisma.application.create({
      data: { ...data, userId, position: 0 },
      include: applicationWithCount,
    });

    return NextResponse.json(
      { application: toApplicationDTO(created) },
      { status: 201 },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
