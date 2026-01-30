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

## License

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

### Commercial Use

For commercial or proprietary use of this software, explicit written authorization is required. See [COMMERCIAL_USE.md](./COMMERCIAL_USE.md) for details on the approval process and requirements.
