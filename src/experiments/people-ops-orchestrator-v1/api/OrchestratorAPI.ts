// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Hugo Soares Nascimento

import { FlowDefinition } from "../domain/FlowDefinition";
import { validateFlow } from "../domain/validateFlow";

/**
 * Core API for People Ops Flow Orchestration.
 * 
 * THIS IS THE PRIMARY INTELLECTUAL PROPERTY OF THIS PROJECT.
 * 
 * This API represents the orchestration contract that enables:
 * - Channel-agnostic communication orchestration
 * - Vendor-agnostic flow definition
 * - Composable People Ops processes
 * 
 * The API is completely independent of:
 * - UI frameworks (ReactFlow is just an adapter)
 * - Communication providers (abstracted behind ports)
 * - Persistence mechanisms
 * 
 * This enables the orchestration logic to be reused across:
 * - Different UI implementations
 * - Different communication backends
 * - Different deployment contexts
 */
export class OrchestratorAPI {
    private flows: Map<string, FlowDefinition> = new Map();

    /**
     * Register a new flow in the orchestrator.
     * @param flow The flow definition to register
     */
    registerFlow(flow: FlowDefinition): void {
        this.flows.set(flow.id, flow);
    }

    /**
     * Validate a flow against domain rules.
     * @param flow The flow to validate
     * @returns Array of validation error messages (empty if valid)
     */
    validateFlow(flow: FlowDefinition): string[] {
        return validateFlow(flow);
    }

    /**
     * List all registered flows.
     * @returns Array of all registered flow definitions
     */
    listFlows(): FlowDefinition[] {
        return Array.from(this.flows.values());
    }
}
