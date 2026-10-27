import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ApplicationDTO, NoteDTO } from "@/types";

export const applicationWithCount = {
  _count: { select: { noteEntries: true } },
} satisfies Prisma.ApplicationInclude;

export type ApplicationRecord = Prisma.ApplicationGetPayload<{
  include: typeof applicationWithCount;
}>;

export function toApplicationDTO(record: ApplicationRecord): ApplicationDTO {
  return {
    id: record.id,
    company: record.company,
    role: record.role,
    jobUrl: record.jobUrl,
    location: record.location,
    salary: record.salary,
    status: record.status,
    appliedDate: record.appliedDate
      ? record.appliedDate.toISOString().slice(0, 10)
      : null,
    followUpDate: record.followUpDate
      ? record.followUpDate.toISOString().slice(0, 10)
      : null,
    notes: record.notes,
    position: record.position,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    noteCount: record._count.noteEntries,
  };
}

export function toNoteDTO(record: {
  id: string;
  applicationId: string;
  content: string;
  createdAt: Date;
}): NoteDTO {
  return {
    id: record.id,
    applicationId: record.applicationId,
    content: record.content,
    createdAt: record.createdAt.toISOString(),
  };
}

export async function listApplications(
  userId: string,
): Promise<ApplicationDTO[]> {
  const records = await prisma.application.findMany({
    where: { userId },
    include: applicationWithCount,
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });

  return records.map(toApplicationDTO);
}
