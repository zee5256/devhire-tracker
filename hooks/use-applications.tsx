"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { apiRequest, errorMessage } from "@/lib/client-api";
import type { ApplicationFormValues } from "@/lib/validations/application";
import type { ApplicationDTO, NoteDTO } from "@/types";

export type ReorderItem = {
  id: string;
  status: ApplicationDTO["status"];
  position: number;
};

type ApplicationsContextValue = {
  applications: ApplicationDTO[];
  createApplication: (values: ApplicationFormValues) => Promise<boolean>;
  updateApplication: (
    id: string,
    values: ApplicationFormValues,
  ) => Promise<boolean>;
  deleteApplication: (id: string) => Promise<boolean>;
  moveApplications: (items: ReorderItem[]) => Promise<boolean>;
  addNote: (applicationId: string, content: string) => Promise<NoteDTO | null>;
  refresh: () => Promise<void>;
};

const ApplicationsContext = createContext<ApplicationsContextValue | null>(
  null,
);

export function ApplicationsProvider({
  initialApplications,
  children,
}: {
  initialApplications: ApplicationDTO[];
  children: React.ReactNode;
}) {
  const [applications, setApplications] =
    useState<ApplicationDTO[]>(initialApplications);
  const applicationsRef = useRef(applications);

  useEffect(() => {
    applicationsRef.current = applications;
  }, [applications]);

  const refresh = useCallback(async () => {
    try {
      const data = await apiRequest<{ applications: ApplicationDTO[] }>(
        "/api/applications",
      );
      setApplications(data.applications);
    } catch {
      // Silent: the board keeps the last known state.
    }
  }, []);

  const createApplication = useCallback(
    async (values: ApplicationFormValues) => {
      try {
        const data = await apiRequest<{ application: ApplicationDTO }>(
          "/api/applications",
          { method: "POST", body: JSON.stringify(values) },
        );

        setApplications((current) => [
          ...current.map((app) =>
            app.status === data.application.status
              ? { ...app, position: app.position + 1 }
              : app,
          ),
          data.application,
        ]);

        toast.success("Application added", {
          description: `${data.application.role} at ${data.application.company}`,
        });
        return true;
      } catch (error) {
        toast.error("Could not add application", {
          description: errorMessage(error),
        });
        return false;
      }
    },
    [],
  );

  const updateApplication = useCallback(
    async (id: string, values: ApplicationFormValues) => {
      const previous = applicationsRef.current.find((app) => app.id === id);
      try {
        const data = await apiRequest<{ application: ApplicationDTO }>(
          `/api/applications/${id}`,
          { method: "PATCH", body: JSON.stringify(values) },
        );

        setApplications((current) =>
          current.map((app) => (app.id === id ? data.application : app)),
        );

        // Moving to another column can shift positions; resync quietly.
        if (previous && previous.status !== data.application.status) {
          void refresh();
        }

        toast.success("Application updated");
        return true;
      } catch (error) {
        toast.error("Could not update application", {
          description: errorMessage(error),
        });
        return false;
      }
    },
    [refresh],
  );

  const deleteApplication = useCallback(async (id: string) => {
    const snapshot = applicationsRef.current;
    setApplications((current) => current.filter((app) => app.id !== id));

    try {
      await apiRequest<{ ok: true }>(`/api/applications/${id}`, {
        method: "DELETE",
      });
      toast.success("Application deleted");
      return true;
    } catch (error) {
      setApplications(snapshot);
      toast.error("Could not delete application", {
        description: errorMessage(error),
      });
      return false;
    }
  }, []);

  const moveApplications = useCallback(async (items: ReorderItem[]) => {
    const snapshot = applicationsRef.current;

    // Optimistic update — the card moves instantly.
    setApplications((current) =>
      current.map((app) => {
        const item = items.find((entry) => entry.id === app.id);
        return item
          ? { ...app, status: item.status, position: item.position }
          : app;
      }),
    );

    try {
      await apiRequest<{ ok: true }>("/api/applications/reorder", {
        method: "PATCH",
        body: JSON.stringify({ items }),
      });
      return true;
    } catch (error) {
      setApplications(snapshot);
      toast.error("Could not move the card", {
        description: errorMessage(error),
      });
      return false;
    }
  }, []);

  const addNote = useCallback(
    async (applicationId: string, content: string) => {
      try {
        const data = await apiRequest<{ note: NoteDTO }>(
          `/api/applications/${applicationId}/notes`,
          { method: "POST", body: JSON.stringify({ content }) },
        );

        setApplications((current) =>
          current.map((app) =>
            app.id === applicationId
              ? { ...app, noteCount: app.noteCount + 1 }
              : app,
          ),
        );
        return data.note;
      } catch (error) {
        toast.error("Could not save note", {
          description: errorMessage(error),
        });
        return null;
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      applications,
      createApplication,
      updateApplication,
      deleteApplication,
      moveApplications,
      addNote,
      refresh,
    }),
    [
      applications,
      createApplication,
      updateApplication,
      deleteApplication,
      moveApplications,
      addNote,
      refresh,
    ],
  );

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error("useApplications must be used inside ApplicationsProvider");
  }
  return context;
}
