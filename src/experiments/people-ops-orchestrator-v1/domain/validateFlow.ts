// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Hugo Soares Nascimento

import { FlowDefinition } from "./FlowDefinition";

/**
 * Domain validation rules for People Ops flows.
 * These rules enforce the core business constraints of the orchestration model.
 */
export function validateFlow(flow: FlowDefinition): string[] {
    const errors: string[] = [];

    // Rule 1: A flow must contain at least one CommunicationIntent
    if (!flow.intents || flow.intents.length === 0) {
        errors.push("Flow must contain at least one CommunicationIntent");
    }

    // Rule 2: A flow must target at least one internal audience
    const internalAudiences = ["employee", "leader", "people_ops"];
    const hasInternalAudience = flow.intents.some(intent =>
        internalAudiences.includes(intent.audience)
    );

    if (!hasInternalAudience) {
        errors.push("Flow must target at least one internal audience (employee, leader, or people_ops)");
    }

    // Rule 3: Channels must remain abstract (implicit - enforced by type system)
    // No provider-specific logic is allowed in domain layer

    return errors;
}
