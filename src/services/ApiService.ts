import { Collaborator, Tag, UserJourney, StartJourneyRequest, CancelJourneyRequest } from '../types';

const API_BASE_URL = '/api/v1';

class ApiService {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
    }

    private getHeaders() {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async getEmployees(params: {
        page?: number;
        pageSize?: number;
        query?: string;
        tags?: string[];
        journeyId?: string;
        journeyStatus?: 'started' | 'completed' | 'cancelled';
    } = {}) {
        const url = new URL(`${API_BASE_URL}/employees`, window.location.origin);
        if (params.page) url.searchParams.append('page', params.page.toString());
        if (params.pageSize) url.searchParams.append('pageSize', params.pageSize.toString());
        if (params.query) url.searchParams.append('query', params.query);
        if (params.tags) params.tags.forEach(tag => url.searchParams.append('tags[]', tag));
        if (params.journeyId) url.searchParams.append('journeyId', params.journeyId);
        if (params.journeyStatus) url.searchParams.append('journeyStatus', params.journeyStatus);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch employees');
        return response.json();
    }

    async getTags(): Promise<Tag[]> {
        const response = await fetch(`${API_BASE_URL}/tags`, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch tags');
        return response.json();
    }

    async updateEmployee(userId: string, data: Partial<Collaborator>) {
        const response = await fetch(`${API_BASE_URL}/employees/${userId}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to update employee');
        return response.json();
    }

    async getUserJourneys(userId: string, params: {
        journeyType?: 'baseDateOffset' | 'fixedDate';
        external?: boolean;
    } = {}): Promise<UserJourney[]> {
        const url = new URL(`${API_BASE_URL}/employees/${userId}/journeys`, window.location.origin);
        if (params.journeyType) url.searchParams.append('journeyType', params.journeyType);
        if (params.external !== undefined) url.searchParams.append('external', params.external.toString());

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) throw new Error('Failed to fetch user journeys');
        return response.json();
    }

    async startJourney(data: StartJourneyRequest) {
        const response = await fetch(`${API_BASE_URL}/onboarding/start-journey`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to start journey');
        return response.json();
    }

    async cancelJourney(journeyId: string, users: string[]) {
        const response = await fetch(`${API_BASE_URL}/onboarding/cancel-journey/${journeyId}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
            body: JSON.stringify({ users }),
        });

        if (!response.ok) throw new Error('Failed to cancel journey');
        return response.json();
    }

    // Orchestrator Endpoints

    async getOrchestrator(id: string): Promise<any> {
        // GET /orchestrator/:id
        const response = await fetch(`${API_BASE_URL}/orchestrator/${id}`, {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch orchestrator');
        return response.json();
    }

    async createOrchestrator(): Promise<any> {
        // GET /create/ -> creates and returns redirect/id
        // Using POST might be more standard but following user spec "GET create/"
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'GET', // User specified GET
            headers: this.getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to create orchestrator');
        // Likely returns the new ID or the object
        return response.json();
    }

    async updateOrchestrator(id: string, data: any) {
        // PUT /orchestrator/:id
        const response = await fetch(`${API_BASE_URL}/orchestrator/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update orchestrator');
        return response.json();
    }

    async listTemplates(): Promise<any[]> {
        // GET / (list templates) - mapped to /templates for clarity in code, but user said "return body [ { id, name } ]"
        // User request: "/list templates GET /" -> Implies base path /orchestrator/ might have logic, or maybe separate endpoint.
        // Assuming /orchestrator/list or just /orchestrator/ with specific handling.
        // Let's assume a dedicated endpoint or the base listing.
        const response = await fetch(`${API_BASE_URL}/templates`, { // Adjust endpoint as needed
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch templates');
        return response.json();
    }

    async startInstance(data: { userId: string; orchestratorTemplateId: string; startDate: string }) {
        // POST start/
        const response = await fetch(`${API_BASE_URL}/start`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to start instance');
        return response.json();
    }

    async getInstances(params: { q?: string; page?: number; pageSize?: number; sort?: string } = {}) {
        // GET instances
        const url = new URL(`${API_BASE_URL}/instances`, window.location.origin);
        if (params.q) url.searchParams.append('q', params.q);
        if (params.page) url.searchParams.append('page', params.page.toString());
        if (params.pageSize) url.searchParams.append('pageSize', params.pageSize.toString());
        if (params.sort) url.searchParams.append('sort', params.sort);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: this.getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch instances');
        return response.json();
    }
}

export const api = new ApiService();
export default api;
