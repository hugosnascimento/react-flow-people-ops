export type OrchestratorStatus = 'draft' | 'published' | 'archived';

export interface Orchestrator {
    id: string;
    name: string;
    description: string;
    status: OrchestratorStatus;
    nodes: any[];
    edges: any[];
    executionHealth: number; // Node success rate percentage
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

export interface ExternalJourney {
    id: string;
    name: string;
    steps: number;
    estimatedDays: number;
}

export interface Collaborator {
    id: string;
    name: string;
    email: string;
    tags: string[];
    currentOrchestrationStatus?: 'waiting' | 'in_progress' | 'completed' | 'failed';
    currentOrchestratorStepId?: string;
}

export interface LogEntry {
    id: string;
    timestamp: string;
    method: 'GET' | 'POST' | 'DELETE' | 'PUT';
    endpoint: string;
    payload?: any;
    status: number;
    message: string;
}

export interface WorkflowNodeData {
    label: string;
    journeyId?: string;
    switchField?: string;
    addTag?: string;
    removeTag?: string;
    cases?: Record<string, string>;
    // API Config for External Trigger
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
    endpoint?: string;
    authType?: string;
    integrationActive?: boolean;
    bodyParams?: { key: string; value: string; type: 'property' | 'static' }[];
    provider?: string;
    // Delay Config
    delayValue?: number;
    delayUnit?: 'days' | 'hours';
}

export interface WorkspaceConfig {
    tags: string[];
}
