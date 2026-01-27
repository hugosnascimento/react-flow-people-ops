// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Hugo Soares Nascimento

/**
 * Represents an abstract communication instruction in a People Ops context.
 * This is a channel-agnostic, vendor-agnostic domain model.
 */
export type CommunicationChannel = 
  | "email" 
  | "slack" 
  | "teams" 
  | "whatsapp" 
  | "sms" 
  | "telegram";

export type Audience = 
  | "employee" 
  | "leader" 
  | "people_ops";

export interface CommunicationIntent {
  id: string;
  channel: CommunicationChannel;
  audience: Audience;
  messageTemplate: string;
}
