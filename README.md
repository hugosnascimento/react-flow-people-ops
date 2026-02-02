# react-flow-people-ops

Open-source People Ops workflow builder built on ReactFlow (MIT) for designing people operations workflows with nodes, rules, and templates. Project code is AGPL-3.0. Third-party components keep their original licenses. Commercial licensing may be available for proprietary use.

## Intellectual Property

The core intellectual property of this project is the **API-level abstraction for People Ops communication orchestration**, not the UI.

Copyright (c) 2026 Hugo Soares Nascimento

## Architecture

This project follows **hexagonal architecture** (ports and adapters):

- **Domain**: Pure business logic and models
- **API**: Orchestration contracts (PRIMARY IP)
- **Ports**: Abstraction interfaces for external systems
- **Adapters**: Replaceable implementations (UI, communication channels, etc.)

ReactFlow is used only as a **visualization adapter**. The orchestration logic is completely independent and can be consumed by any client.

## Experiments

### Experiment #1: API-First People Ops Flow Orchestrator

Located in: `src/experiments/people-ops-orchestrator-v1/`

This experiment demonstrates:
- Channel-agnostic communication orchestration
- Vendor-agnostic flow definition
- Composable People Ops processes
- ReactFlow as a thin UI adapter

Key concepts:
- **FlowDefinition**: Represents an orchestrated People Ops process
- **CommunicationIntent**: Abstract communication instruction
- **OrchestratorAPI**: Core orchestration contract
- **CommunicationPort**: Abstraction for channel delivery

## Running locally

1. Install dependencies via `npm install` (this also pulls in Vite, React and React Flow).
2. Start the dev server with `npm run dev` and open the URL shown by Vite (default `http://127.0.0.1:5173/`).
3. The page renders the Modern Workflow Orchestrator layout, so you can drag the canvasset with React Flow and see the validation badge on the top-left.

## Supabase setup (API-first backend)

This project uses Supabase Postgres for persistence and Supabase Edge Functions as the API layer. The browser only calls the Edge Functions. Do not connect the database directly in the front-end.

### What you need from Supabase

1. Supabase URL.
2. Supabase anon key.
3. Supabase service role key. This is only for Edge Functions.
4. Supabase project ref. This is for `supabase link`.
5. A workspace API key. You choose this secret.

### Create a Supabase project

1. Go to https://app.supabase.com and create a project.
2. Open Settings. Then open API.
3. Copy the Project URL and the anon key.
4. Go to Settings. Then open API Keys.
5. Copy the service role key.

### Configure local environment

1. Copy `.env.example` to `.env`.
2. Fill `VITE_SUPABASE_URL`.
3. Fill `VITE_SUPABASE_ANON_KEY`.
4. Fill `VITE_WORKSPACE_API_KEY`.

### Configure Supabase CLI

1. Install the Supabase CLI.
2. Run `supabase link` and use your project ref.
3. Run `supabase start`.

### Apply database migrations

1. Run `supabase db reset`.
2. This applies the SQL files in `supabase/migrations`.
3. The seed creates a default workspace with key `CHANGE_ME`.
4. Generate a new key and hash it before production.
5. Use `node scripts/hashWorkspaceKey.mjs "<key>"`.
6. Replace the hash in `workspaces.api_key_hash`.

### Set Edge Function secrets

1. Run `supabase secrets set SUPABASE_URL=...`.
2. Run `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...`.

### Run Edge Functions locally

1. Run `supabase functions serve --no-verify-jwt`.
2. The API is available at `/functions/v1/api`.

### Run the front-end

1. Run `npm run dev`.
2. Open the Vite URL.

### Deploy Edge Functions

1. Run `supabase functions deploy api --no-verify-jwt`.
2. Run `supabase functions list` to verify.

## Workspace API key

All API routes require the `x-workspace-key` header. The key is hashed in the database. Keep the raw key in `.env`. Do not commit it.

To rotate the key:

1. Generate a new key.
2. Hash it with SHA-256.
3. Update `workspaces.api_key_hash`.
4. Update your `.env` and Supabase secrets.

## License

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

### Commercial Use

For commercial or proprietary use of this software, explicit written authorization is required. See [COMMERCIAL_USE.md](./COMMERCIAL_USE.md) for details on the approval process and requirements.
