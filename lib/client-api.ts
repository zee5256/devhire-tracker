export class ApiClientError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export async function apiRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...init, headers });
  const payload = (await response.json().catch(() => null)) as
    | { error?: string; fieldErrors?: Record<string, string> }
    | null;

  if (!response.ok) {
    throw new ApiClientError(
      payload?.error ?? "Something went wrong. Please try again.",
      response.status,
      payload?.fieldErrors,
    );
  }

  return payload as T;
}

export function errorMessage(error: unknown): string {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
