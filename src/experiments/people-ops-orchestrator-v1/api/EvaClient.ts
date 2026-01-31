// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Hugo Soares Nascimento

type StartJourneyPayload = {
  userId: string;
  journeyId: string;
  startDate: string;
};

type StartJourneyByTagPayload = {
  workspaceId: string;
  journeyId: string;
  tagId: string;
  startDate: string;
};

type CancelJourneyPayload = {
  journeyId: string;
  users: string[];
};

type EvaClientOptions = {
  baseUrl?: string;
  authToken?: string;
};

export class EvaClient {
  private baseUrl: string;
  private authToken?: string;

  constructor(options: EvaClientOptions = {}) {
    const env = import.meta.env as { VITE_EVA_BASE_URL?: string; VITE_EVA_AUTH_TOKEN?: string };
    this.baseUrl = options.baseUrl ?? env.VITE_EVA_BASE_URL ?? "http://localhost:3000";
    this.authToken = options.authToken ?? env.VITE_EVA_AUTH_TOKEN;
  }

  async startJourney(payload: StartJourneyPayload): Promise<void> {
    await this.request("/onboarding/startJourney", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  async startJourneyByTag(payload: StartJourneyByTagPayload): Promise<void> {
    await this.request("/onboarding/bulk/start-journey-by-tag", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  async cancelJourney(payload: CancelJourneyPayload): Promise<void> {
    await this.request(`/onboarding/cancel-journey/${payload.journeyId}`, {
      method: "DELETE",
      body: JSON.stringify({ users: payload.users })
    });
  }

  private async request(path: string, options: RequestInit): Promise<void> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.authToken ? { Authorization: `Bearer ${this.authToken}` } : {})
      }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Eva request failed (${response.status}): ${body || response.statusText}`);
    }
  }
}
