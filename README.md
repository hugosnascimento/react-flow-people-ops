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

## License

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
