import type { ApplicationStatus } from "@prisma/client";

/** Serialisable application shape shared between server and client. */
export type ApplicationDTO = {
  id: string;
  company: string;
  role: string;
  jobUrl: string | null;
  location: string | null;
  salary: string | null;
  status: ApplicationStatus;
  appliedDate: string | null; // YYYY-MM-DD
  followUpDate: string | null; // YYYY-MM-DD
  notes: string | null;
  position: number;
  createdAt: string;
  updatedAt: string;
  noteCount: number;
};

export type NoteDTO = {
  id: string;
  applicationId: string;
  content: string;
  createdAt: string;
};

export type FilterState = {
  query: string;
  status: ApplicationStatus | "ALL";
  from: string;
  to: string;
  sort: "newest" | "oldest" | "company" | "follow-up";
};

export const EMPTY_FILTERS: FilterState = {
  query: "",
  status: "ALL",
  from: "",
  to: "",
  sort: "newest",
};

export type NewApplication = {
  company: string;
  role: string;
  status: ApplicationStatus;
  jobUrl?: string;
  location?: string;
  salary?: string;
  appliedDate?: string;
  followUpDate?: string;
  notes?: string;
};
