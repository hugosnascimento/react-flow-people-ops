// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Hugo Soares Nascimento

/**
 * Experiment #1: API-First People Ops Flow Orchestrator
 * 
 * This experiment demonstrates the core intellectual property of this project:
 * A channel-agnostic, vendor-agnostic API for orchestrating People Ops communications.
 * 
 * Key architectural principles:
 * 
 * 1. HEXAGONAL ARCHITECTURE
 *    - Domain models are pure and independent
 *    - API layer defines the orchestration contract
 *    - Ports abstract external dependencies
 *    - Adapters are replaceable implementations
 * 
 * 2. API AS PRIMARY IP
 *    - The OrchestratorAPI is the core value
 *    - ReactFlow is just one possible UI adapter
 *    - Communication channels are abstracted behind ports
 *    - The API can be consumed by any client
 * 
 * 3. DOMAIN-DRIVEN DESIGN
 *    - FlowDefinition: orchestrated process
 *    - CommunicationIntent: abstract communication instruction
 *    - Validation rules enforce business constraints
 * 
 * Structure:
 * - domain/       : Core domain models and rules
 * - api/          : Orchestration API (PRIMARY IP)
 * - ports/        : Abstraction interfaces
 * - adapters/     : Replaceable implementations (ReactFlow, etc.)
 */

export { CommunicationIntent, CommunicationChannel, Audience } from './domain/CommunicationIntent';
export { FlowDefinition } from './domain/FlowDefinition';
export { validateFlow } from './domain/validateFlow';
export { OrchestratorAPI } from './api/OrchestratorAPI';
export { CommunicationPort } from './ports/CommunicationPort';
export { PeopleOpsFlowCanvas } from './adapters/reactflow/PeopleOpsFlowCanvas';
