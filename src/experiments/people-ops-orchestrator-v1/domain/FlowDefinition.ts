// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Hugo Soares Nascimento

import { CommunicationIntent } from "./CommunicationIntent";

/**
 * Represents an orchestrated People Ops flow.
 * A flow is a composition of communication intents that define
 * a complete operational process.
 */
export interface FlowDefinition {
    id: string;
    name: string;
    intents: CommunicationIntent[];
}
