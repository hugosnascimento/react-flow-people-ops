const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const workspaceKey = import.meta.env.VITE_WORKSPACE_API_KEY;

if (!supabaseUrl || !supabaseAnonKey || !workspaceKey) {
  console.warn("Missing Supabase environment variables.");
}

const baseUrl = `${supabaseUrl}/functions/v1/api`;

export const apiFetch = async <T>(path: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers ?? {});
  headers.set("Authorization", `Bearer ${supabaseAnonKey}`);
  headers.set("x-workspace-key", workspaceKey);
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || "Request failed");
  }

  return (await response.json()) as T;
};
