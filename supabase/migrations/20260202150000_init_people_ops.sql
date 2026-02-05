create extension if not exists pgcrypto;

create table if not exists workspaces (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    api_key_hash text not null,
    created_at timestamptz not null default now()
);

create table if not exists orchestrators (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    name text not null,
    status text not null default 'draft' check (status in ('draft', 'published')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists orchestrator_versions (
    id uuid primary key default gen_random_uuid(),
    orchestrator_id uuid not null references orchestrators(id) on delete cascade,
    version integer not null,
    graph_json jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    published_at timestamptz,
    unique (orchestrator_id, version)
);

create table if not exists tags (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    name text not null,
    unique (workspace_id, name)
);

create table if not exists collaborators (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    external_id text not null,
    attributes_json jsonb not null default '{}'::jsonb,
    unique (workspace_id, external_id)
);

create table if not exists collaborator_tags (
    collaborator_id uuid not null references collaborators(id) on delete cascade,
    tag_id uuid not null references tags(id) on delete cascade,
    primary key (collaborator_id, tag_id)
);

create table if not exists executions (
    id uuid primary key default gen_random_uuid(),
    workspace_id uuid not null references workspaces(id) on delete cascade,
    orchestrator_version_id uuid not null references orchestrator_versions(id) on delete cascade,
    status text not null default 'running' check (status in ('running', 'completed', 'failed')),
    started_at timestamptz not null default now(),
    finished_at timestamptz
);

create table if not exists execution_events (
    id uuid primary key default gen_random_uuid(),
    execution_id uuid not null references executions(id) on delete cascade,
    type text not null,
    payload_json jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now()
);

create index if not exists idx_orchestrators_workspace_id on orchestrators(workspace_id);
create index if not exists idx_orchestrator_versions_orchestrator_id on orchestrator_versions(orchestrator_id);
create index if not exists idx_tags_workspace_id on tags(workspace_id);
create index if not exists idx_collaborators_workspace_id on collaborators(workspace_id);
create index if not exists idx_executions_workspace_id on executions(workspace_id);
create index if not exists idx_execution_events_execution_id on execution_events(execution_id);

create or replace function set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger orchestrators_set_updated_at
before update on orchestrators
for each row execute procedure set_updated_at();
