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
}

export const api = new ApiService();
export default api;
