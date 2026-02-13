import { Orchestrator } from '../types';
import { Edge, Node } from 'reactflow';

interface BackendAction {
    type: string;
    args: any;
    fallback?: any;
    delayDay?: number;
    nextAction?: string;
    ui: {
        position: {
            x: number;
            y: number;
        };
    };
}

interface BackendOrchestrator {
    _id: string;
    workspaceId?: string;
    name: string;
    firstAction: string;
    actions: Record<string, BackendAction>;
}

export class OrchestratorMapper {
    static toFrontend(backendData: any): Orchestrator {
        // Handle array response (list) vs single object
        const backendOrchestrator = Array.isArray(backendData) ? backendData[0] : backendData;

        if (!backendOrchestrator) {
            throw new Error("Invalid backend data");
        }

        const nodes: Node[] = [];
        const edges: Edge[] = [];
        const actions = backendOrchestrator.actions || {};

        Object.entries(actions).forEach(([key, action]: [string, any]) => {
            // Create Node
            nodes.push({
                id: key,
                type: action.type,
                position: action.ui?.position || { x: 0, y: 0 },
                data: action.args || {}
            });

            // Create Edges from nextAction
            if (action.nextAction) {
                edges.push({
                    id: `e-${key}-${action.nextAction}`,
                    source: key,
                    target: action.nextAction,
                    type: 'deletable', // Default edge type
                    animated: true,
                    style: { stroke: "#4f39f6", strokeWidth: 3 }
                });
            }

            // Handle Conditional Nodes (branches often stored in args/rules)
            // If the node type is conditional, we might need to extract edges from rules
            if (action.type === 'conditional' && action.args?.rules) {
                action.args.rules.forEach((rule: any) => {
                    if (rule.nextActionId) { // Assuming rules have nextActionId
                        // This is hypothetical, depends on how backend actually stores branch targets
                        // If backend stores branches in 'nextAction' map or similar, logic goes here
                        // For now, adhering to the basic provided structure
                    }
                });
            }
        });

        return {
            id: backendOrchestrator._id || backendOrchestrator.id,
            name: backendOrchestrator.name || 'Untitled Orchestrator',
            description: '',
            status: 'draft', // Default, maybe derive from somewhere else
            nodes,
            edges,
            executionHealth: 100, // Mock
            lastExecution: undefined,
            errorCount: 0 // Mock
        };
    }

    static toBackend(frontendData: Orchestrator): Partial<BackendOrchestrator> {
        const actions: Record<string, BackendAction> = {};
        let firstAction = '';

        // Find Start Node (node with no incoming edges? or explicit type?)
        // Heuristic: specific type 'startFlow' or 'trigger'
        const startNode = frontendData.nodes.find(n => n.type === 'startFlow' || n.type === 'trigger');
        firstAction = startNode ? startNode.id : (frontendData.nodes[0]?.id || '');

        frontendData.nodes.forEach(node => {
            // Find outgoing edge
            const outgoingEdge = frontendData.edges.find(e => e.source === node.id);

            // Basic next action mapping
            const nextAction = outgoingEdge ? outgoingEdge.target : undefined;

            actions[node.id] = {
                type: node.type || 'default',
                args: node.data,
                nextAction: nextAction,
                ui: {
                    position: {
                        x: node.position.x,
                        y: node.position.y
                    }
                }
            };
        });

        return {
            name: frontendData.name,
            firstAction,
            actions
        };
    }
}
