import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });

const notFound = () => jsonResponse({ error: "Not found" }, 404);

const parseJson = async (req: Request) => {
  if (req.headers.get("content-type")?.includes("application/json")) {
    return await req.json();
  }
  return {};
};

const hashWorkspaceKey = async (key: string) => {
  const data = new TextEncoder().encode(key);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const getWorkspace = async (req: Request) => {
  const workspaceKey = req.headers.get("x-workspace-key")?.trim();
  if (!workspaceKey) {
    return { error: jsonResponse({ error: "Missing workspace key" }, 401) };
  }

  const hash = await hashWorkspaceKey(workspaceKey);
  const { data, error } = await supabase
    .from("workspaces")
    .select("id,name")
    .eq("api_key_hash", hash)
    .maybeSingle();

  if (error || !data) {
    return { error: jsonResponse({ error: "Invalid workspace key" }, 401) };
  }

  return { data };
};

const stripApiPrefix = (pathname: string) => {
  const trimmed = pathname.replace("/functions/v1/api", "");
  return trimmed.length === 0 ? "/" : trimmed;
};

const getLatestVersion = async (orchestratorId: string, publishedOnly = false) => {
  let query = supabase
    .from("orchestrator_versions")
    .select("id,version,graph_json,published_at,created_at")
    .eq("orchestrator_id", orchestratorId)
    .order("version", { ascending: false })
    .limit(1);

  if (publishedOnly) {
    query = query.not("published_at", "is", null);
  }

  const { data, error } = await query.maybeSingle();
  if (error) {
    throw error;
  }
  return data;
};

const getLatestDraft = async (orchestratorId: string) => {
  const { data, error } = await supabase
    .from("orchestrator_versions")
    .select("id,version,graph_json,published_at,created_at")
    .eq("orchestrator_id", orchestratorId)
    .is("published_at", null)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return data;
};

const getNextVersionNumber = async (orchestratorId: string) => {
  const { data, error } = await supabase
    .from("orchestrator_versions")
    .select("version")
    .eq("orchestrator_id", orchestratorId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.version ?? 0) + 1;
};

const buildOrchestratorResponse = (
  orchestrator: any,
  version: any | null
) => {
  const graph = version?.graph_json ?? { nodes: [], edges: [] };

  return {
    id: orchestrator.id,
    name: orchestrator.name,
    description: "",
    status: orchestrator.status,
    nodes: graph.nodes ?? [],
    edges: graph.edges ?? [],
    executionHealth: 100,
    lastExecution: orchestrator.lastExecution ?? null,
    errorCount: 0
  };
};

const handleOrchestratorsList = async (workspaceId: string) => {
  const { data: orchestrators, error } = await supabase
    .from("orchestrators")
    .select("id,name,status,created_at,updated_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const items = [];
  for (const orchestrator of orchestrators ?? []) {
    const version = await getLatestDraft(orchestrator.id);
    items.push(buildOrchestratorResponse(orchestrator, version));
  }

  return jsonResponse({ orchestrators: items });
};

const handleOrchestratorCreate = async (workspaceId: string, body: any) => {
  const name = body?.name ?? "Novo Orquestrador";

  const { data: orchestrator, error } = await supabase
    .from("orchestrators")
    .insert({ workspace_id: workspaceId, name, status: "draft" })
    .select("id,name,status")
    .single();

  if (error || !orchestrator) {
    return jsonResponse({ error: error?.message ?? "Failed" }, 500);
  }

  await supabase.from("orchestrator_versions").insert({
    orchestrator_id: orchestrator.id,
    version: 1,
    graph_json: { nodes: [], edges: [] }
  });

  return jsonResponse(buildOrchestratorResponse(orchestrator, null), 201);
};

const handleOrchestratorGet = async (workspaceId: string, orchestratorId: string) => {
  const { data: orchestrator, error } = await supabase
    .from("orchestrators")
    .select("id,name,status,created_at,updated_at")
    .eq("workspace_id", workspaceId)
    .eq("id", orchestratorId)
    .maybeSingle();

  if (error || !orchestrator) {
    return jsonResponse({ error: "Orchestrator not found" }, 404);
  }

  let version = await getLatestDraft(orchestratorId);
  if (!version) {
    version = await getLatestVersion(orchestratorId, true);
  }

  return jsonResponse(buildOrchestratorResponse(orchestrator, version));
};

const handleOrchestratorUpdate = async (
  workspaceId: string,
  orchestratorId: string,
  body: any
) => {
  const graph = body?.graph_json ?? body?.graphJson;

  if (!graph) {
    return jsonResponse({ error: "graph_json is required" }, 400);
  }

  const { data: orchestrator, error } = await supabase
    .from("orchestrators")
    .select("id,name,status")
    .eq("workspace_id", workspaceId)
    .eq("id", orchestratorId)
    .maybeSingle();

  if (error || !orchestrator) {
    return jsonResponse({ error: "Orchestrator not found" }, 404);
  }

  const version = await getNextVersionNumber(orchestratorId);

  const { error: versionError } = await supabase
    .from("orchestrator_versions")
    .insert({
      orchestrator_id: orchestratorId,
      version,
      graph_json: graph
    });

  if (versionError) {
    return jsonResponse({ error: versionError.message }, 500);
  }

  return jsonResponse(buildOrchestratorResponse(orchestrator, { graph_json: graph }));
};

const handleOrchestratorPublish = async (
  workspaceId: string,
  orchestratorId: string
) => {
  const { data: orchestrator, error } = await supabase
    .from("orchestrators")
    .select("id,name,status")
    .eq("workspace_id", workspaceId)
    .eq("id", orchestratorId)
    .maybeSingle();

  if (error || !orchestrator) {
    return jsonResponse({ error: "Orchestrator not found" }, 404);
  }

  const latestDraft = await getLatestDraft(orchestratorId);
  if (!latestDraft) {
    return jsonResponse({ error: "No draft version to publish" }, 400);
  }

  const version = await getNextVersionNumber(orchestratorId);

  const { error: versionError } = await supabase
    .from("orchestrator_versions")
    .insert({
      orchestrator_id: orchestratorId,
      version,
      graph_json: latestDraft.graph_json,
      published_at: new Date().toISOString()
    });

  if (versionError) {
    return jsonResponse({ error: versionError.message }, 500);
  }

  await supabase
    .from("orchestrators")
    .update({ status: "published" })
    .eq("id", orchestratorId);

  return jsonResponse({ status: "published" });
};

const handleTagsList = async (workspaceId: string) => {
  const { data, error } = await supabase
    .from("tags")
    .select("id,name")
    .eq("workspace_id", workspaceId)
    .order("name");

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ tags: data ?? [] });
};

const ensureCollaborator = async (workspaceId: string, externalId: string) => {
  const { data, error } = await supabase
    .from("collaborators")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("external_id", externalId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data.id;
  }

  const { data: created, error: createError } = await supabase
    .from("collaborators")
    .insert({ workspace_id: workspaceId, external_id: externalId })
    .select("id")
    .single();

  if (createError || !created) {
    throw createError;
  }

  return created.id;
};

const ensureTag = async (workspaceId: string, name: string) => {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Tag name is required");
  }

  const { data, error } = await supabase
    .from("tags")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("name", trimmed)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return data.id;
  }

  const { data: created, error: createError } = await supabase
    .from("tags")
    .insert({ workspace_id: workspaceId, name: trimmed })
    .select("id")
    .single();

  if (createError || !created) {
    throw createError;
  }

  return created.id;
};

const handleCollaboratorTags = async (
  workspaceId: string,
  collaboratorId: string,
  body: any
) => {
  const tagToAdd = body?.tag ?? body?.addTag;
  const tagToRemove = body?.removeTag;

  if (!tagToAdd && !tagToRemove) {
    return jsonResponse({ error: "Tag payload is required" }, 400);
  }

  const collaboratorDbId = await ensureCollaborator(
    workspaceId,
    collaboratorId
  );

  if (tagToAdd) {
    const tagId = await ensureTag(workspaceId, tagToAdd);
    await supabase
      .from("collaborator_tags")
      .upsert({ collaborator_id: collaboratorDbId, tag_id: tagId });
  }

  if (tagToRemove) {
    const tagId = await ensureTag(workspaceId, tagToRemove);
    await supabase
      .from("collaborator_tags")
      .delete()
      .eq("collaborator_id", collaboratorDbId)
      .eq("tag_id", tagId);
  }

  return jsonResponse({ status: "ok" });
};

const handleTrigger = async (workspaceId: string, body: any) => {
  const orchestratorId = body?.orchestrator_id ?? body?.orchestratorId;
  if (!orchestratorId) {
    return jsonResponse({ error: "orchestrator_id is required" }, 400);
  }

  const publishedVersion = await getLatestVersion(orchestratorId, true);
  if (!publishedVersion) {
    return jsonResponse({ error: "No published version found" }, 400);
  }

  const { data: execution, error } = await supabase
    .from("executions")
    .insert({
      workspace_id: workspaceId,
      orchestrator_version_id: publishedVersion.id,
      status: "running"
    })
    .select("id,started_at")
    .single();

  if (error || !execution) {
    return jsonResponse({ error: error?.message ?? "Failed" }, 500);
  }

  const events = [
    {
      execution_id: execution.id,
      type: "trigger_received",
      payload_json: {
        nodeLabel: "External Trigger",
        status: "success",
        message: "Trigger recebido e validado.",
        latency: "12ms"
      }
    },
    {
      execution_id: execution.id,
      type: "delay_scheduled",
      payload_json: {
        nodeLabel: "Delay",
        status: "warning",
        message: "Delay agendado (simulado).",
        latency: "1ms"
      }
    },
    {
      execution_id: execution.id,
      type: "delay_elapsed",
      payload_json: {
        nodeLabel: "Delay",
        status: "success",
        message: "Delay concluído (simulado).",
        latency: "1ms"
      }
    },
    {
      execution_id: execution.id,
      type: "node_success",
      payload_json: {
        nodeLabel: "Tag Manager",
        status: "success",
        message: "Tag aplicada com sucesso.",
        latency: "34ms"
      }
    }
  ];

  const { error: eventsError } = await supabase
    .from("execution_events")
    .insert(events);

  if (eventsError) {
    return jsonResponse({ error: eventsError.message }, 500);
  }

  await supabase
    .from("executions")
    .update({ status: "completed", finished_at: new Date().toISOString() })
    .eq("id", execution.id);

  return jsonResponse({ execution_id: execution.id }, 201);
};

const handleExecutionsList = async (workspaceId: string, req: Request) => {
  const url = new URL(req.url);
  const orchestratorId = url.searchParams.get("orchestrator_id");

  const { data, error } = await supabase
    .from("executions")
    .select(
      "id,status,started_at,finished_at,orchestrator_version_id,orchestrator_versions(orchestrator_id)"
    )
    .eq("workspace_id", workspaceId)
    .order("started_at", { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  const filtered = (data ?? []).filter((execution: any) => {
    if (!orchestratorId) {
      return true;
    }
    return execution.orchestrator_versions?.orchestrator_id === orchestratorId;
  });

  return jsonResponse({ executions: filtered });
};

const handleExecutionEvents = async (executionId: string) => {
  const { data, error } = await supabase
    .from("execution_events")
    .select("id,type,payload_json,created_at")
    .eq("execution_id", executionId)
    .order("created_at", { ascending: true });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ events: data ?? [] });
};

Deno.serve(async (req) => {
  const workspace = await getWorkspace(req);
  if (workspace.error) {
    return workspace.error;
  }

  const url = new URL(req.url);
  const path = stripApiPrefix(url.pathname);

  if (req.method === "GET" && path === "/orchestrators") {
    return await handleOrchestratorsList(workspace.data.id);
  }

  if (req.method === "POST" && path === "/orchestrators") {
    const body = await parseJson(req);
    return await handleOrchestratorCreate(workspace.data.id, body);
  }

  const orchestratorMatch = path.match(/^\/orchestrators\/([^/]+)$/);
  if (orchestratorMatch) {
    const orchestratorId = orchestratorMatch[1];
    if (req.method === "GET") {
      return await handleOrchestratorGet(workspace.data.id, orchestratorId);
    }
    if (req.method === "PUT") {
      const body = await parseJson(req);
      return await handleOrchestratorUpdate(
        workspace.data.id,
        orchestratorId,
        body
      );
    }
  }

  const publishMatch = path.match(/^\/orchestrators\/([^/]+)\/publish$/);
  if (publishMatch && req.method === "POST") {
    return await handleOrchestratorPublish(workspace.data.id, publishMatch[1]);
  }

  if (req.method === "GET" && path === "/tags") {
    return await handleTagsList(workspace.data.id);
  }

  const collaboratorTagMatch = path.match(/^\/collaborators\/([^/]+)\/tags$/);
  if (collaboratorTagMatch && req.method === "POST") {
    const body = await parseJson(req);
    return await handleCollaboratorTags(
      workspace.data.id,
      collaboratorTagMatch[1],
      body
    );
  }

  if (req.method === "POST" && path === "/trigger") {
    const body = await parseJson(req);
    return await handleTrigger(workspace.data.id, body);
  }

  if (req.method === "GET" && path === "/executions") {
    return await handleExecutionsList(workspace.data.id, req);
  }

  const executionEventsMatch = path.match(/^\/executions\/([^/]+)\/events$/);
  if (executionEventsMatch && req.method === "GET") {
    return await handleExecutionEvents(executionEventsMatch[1]);
  }

  return notFound();
});
