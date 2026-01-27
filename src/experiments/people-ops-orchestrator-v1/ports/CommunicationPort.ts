// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Hugo Soares Nascimento

import { CommunicationIntent } from "../domain/CommunicationIntent";

/**
 * Outbound port for communication delivery.
 * This port abstracts the actual communication mechanism.
 * Implementations are responsible for translating intents into actual messages.
 * 
 * This is the core abstraction that enables channel-agnostic orchestration.
 */
export interface CommunicationPort {
    /**
     * Send a communication intent through the appropriate channel.
     * @param intent The communication intent to send
     * @returns Promise that resolves when the communication is sent
     */
    send(intent: CommunicationIntent): Promise<void>;
}
