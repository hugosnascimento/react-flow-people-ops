import { apiFetch } from "./apiClient";
import { Orchestrator } from "../types";

export interface ExecutionRecord {
  id: string;
  status: string;
  started_at: string;
  finished_at?: string | null;
  orchestrator_version_id: string;
  orchestrator_versions?: { orchestrator_id: string } | null;
}

export interface ExecutionEventRecord {
  id: string;
  type: string;
  payload_json: {
    nodeLabel?: string;
    status?: "success" | "warning" | "error";
    message?: string;
    latency?: string;
  };
  created_at: string;
}

export const listOrchestrators = async () => {
  const data = await apiFetch<{ orchestrators: Orchestrator[] }>(
    "/orchestrators",
    { method: "GET" }
  );
  return data.orchestrators;
};

export const createOrchestrator = async (name?: string) => {
  return await apiFetch<Orchestrator>("/orchestrators", {
    method: "POST",
    body: JSON.stringify({ name })
  });
};

export const getOrchestrator = async (id: string) => {
  return await apiFetch<Orchestrator>(`/orchestrators/${id}`, {
    method: "GET"
  });
};

export const saveOrchestrator = async (orchestrator: Orchestrator) => {
  return await apiFetch<Orchestrator>(`/orchestrators/${orchestrator.id}`, {
    method: "PUT",
    body: JSON.stringify({
      graph_json: {
        nodes: orchestrator.nodes,
        edges: orchestrator.edges
      }
    })
  });
};

export const publishOrchestrator = async (id: string) => {
  return await apiFetch<{ status: string }>(`/orchestrators/${id}/publish`, {
    method: "POST"
  });
};

export const triggerOrchestrator = async (id: string) => {
  return await apiFetch<{ execution_id: string }>("/trigger", {
    method: "POST",
    body: JSON.stringify({ orchestrator_id: id })
  });
};

export const listTags = async () => {
  return await apiFetch<{ tags: { id: string; name: string }[] }>("/tags", {
    method: "GET"
  });
};

export const updateCollaboratorTags = async (
  collaboratorId: string,
  payload: { tag?: string; addTag?: string; removeTag?: string }
) => {
  return await apiFetch<{ status: string }>(
    `/collaborators/${collaboratorId}/tags`,
    {
      method: "POST",
      body: JSON.stringify(payload)
    }
  );
};

export const listExecutions = async (orchestratorId?: string) => {
  const query = orchestratorId
    ? `?orchestrator_id=${orchestratorId}`
    : "";
  return await apiFetch<{ executions: ExecutionRecord[] }>(
    `/executions${query}`,
    { method: "GET" }
  );
};

export const listExecutionEvents = async (executionId: string) => {
  return await apiFetch<{ events: ExecutionEventRecord[] }>(
    `/executions/${executionId}/events`,
    { method: "GET" }
  );
};
