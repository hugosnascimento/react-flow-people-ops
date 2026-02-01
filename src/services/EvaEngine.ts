import { NodeExecutionEvent, ExternalJourney } from '../types';

class EvaEngine {
    private executionLog: NodeExecutionEvent[] = [
        { id: 'ex-1', nodeId: 'trig-1', nodeLabel: 'ATS Recruitment', timestamp: '10:25:01', status: 'success', message: 'API Request successful. 24 candidates fetched.', latency: '124ms' },
        { id: 'ex-2', nodeId: 'fs-1', nodeLabel: 'Pre-boarding Hub', timestamp: '10:25:05', status: 'success', message: 'Flow initiated for 12 collaborators.', latency: '45ms' },
        { id: 'ex-3', nodeId: 'dec-1', nodeLabel: 'Segment', timestamp: '10:26:12', status: 'warning', message: 'Missing tag mapping for collaborator "John Doe". Routed to default.', latency: '12ms' },
        { id: 'ex-4', nodeId: 'tag-1', nodeLabel: 'Context Bridge', timestamp: '10:28:45', status: 'error', message: 'Failed to update tag in External HRIS. Timeout after 5000ms.', latency: '5002ms' },
        { id: 'ex-5', nodeId: 'trig-1', nodeLabel: 'ATS Recruitment', timestamp: '10:30:15', status: 'success', message: 'API Request successful. 2 candidates fetched.', latency: '98ms' },
    ];

    private journeys: ExternalJourney[] = [
        { id: 'pre-clt', name: 'CLT Pre-boarding', steps: 12, estimatedDays: 5 },
        { id: 'pre-pj', name: 'PJ Pre-boarding', steps: 8, estimatedDays: 3 },
        { id: 'pre-intern', name: 'Intern Pre-boarding', steps: 6, estimatedDays: 2 },
        { id: 'onb-org', name: 'Organizational Onboarding', steps: 15, estimatedDays: 7 },
        { id: 'onb-tech', name: 'Technology Onboarding', steps: 20, estimatedDays: 14 },
        { id: 'onb-sales', name: 'Sales Onboarding', steps: 18, estimatedDays: 10 },
        { id: 'onb-cs', name: 'CS Onboarding', steps: 15, estimatedDays: 8 },
    ];

    private terminalLog(method: string, endpoint: string, status: number, message: string, payload?: any) {
        const timestamp = new Date().toLocaleTimeString();
        console.group(`%c EVA ENGINE %c ${method} %c ${endpoint}`,
            'background: #4f39f6; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;',
            `background: ${status < 300 ? '#10b981' : '#6366f1'}; color: white; padding: 2px 5px; border-radius: 3px; font-weight: bold;`,
            'color: #64748b; font-weight: bold;'
        );
        console.log(`%cStatus: %c${status}`, 'color: #94a3b8;', `color: ${status < 300 ? '#10b981' : '#ef4444'}; font-weight: bold;`);
        console.log(`%cMessage: %c${message}`, 'color: #94a3b8;', 'color: #1e293b;');
        if (payload) console.log('%cPayload:', 'color: #94a3b8;', payload);
        console.groupEnd();
    }

    public getJourneys(): ExternalJourney[] {
        return this.journeys;
    }

    public getNodeExecutions(): NodeExecutionEvent[] {
        return this.executionLog;
    }

    // Orchestration specific logs
    public logNodeHandoff(nodeLabel: string, status: 'success' | 'error', details: string) {
        this.terminalLog('ORCHESTRATION', `/nodes/${nodeLabel}/handoff`, status === 'success' ? 200 : 500, details);
    }

    public logExecutionError(nodeLabel: string, error: string) {
        this.terminalLog('ERROR', `/execution/fault`, 500, `Critical failure in Node [${nodeLabel}]: ${error}`);
    }
}

export const engine = new EvaEngine();
export default engine;
