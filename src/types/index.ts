export interface Collaborator {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    avatar: string;
    status: 'active' | 'onboarding' | 'offboarding' | 'inactive';
    startDate: string;
    tags: string[];
    journeys: UserJourney[];
}

export interface Tag {
    id: string;
    name: string;
    color: string;
    category: string;
}

export interface UserJourney {
    id: string;
    journeyId: string;
    journeyName: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    progress: number;
    startDate: string;
    currentStep: string;
}

export interface Orchestrator {
    id: string;
    name: string;
    description: string;
    status: 'draft' | 'active' | 'paused' | 'published';
    nodes: any[];
    edges: any[];
    executionHealth: number;
    lastExecution?: string;
    errorCount: number;
}

export interface NodeExecutionEvent {
    id: string;
    nodeId: string;
    nodeLabel: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
    message: string;
    latency?: string;
}

export interface Integration {
    id: string;
    name: string;
    type: 'ATS' | 'HCM' | 'LMS' | 'Communication' | 'Engagement' | 'Other';
    initials: string; // Ex: GU, EV, LG
    color: string;    // Ex: #4f39f6
    status: 'active' | 'inactive';
    description: string;
    // Campos técnicos (mockados para UI)
    baseUrl?: string;
    authType?: string;
}
