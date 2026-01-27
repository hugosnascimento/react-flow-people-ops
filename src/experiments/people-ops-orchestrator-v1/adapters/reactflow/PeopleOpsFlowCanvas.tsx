// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Hugo Soares Nascimento

import React, { useCallback, useState } from 'react';
import ReactFlow, {
    Node,
    Edge,
    addEdge,
    Connection,
    useNodesState,
    useEdgesState,
    NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { OrchestratorAPI } from '../../api/OrchestratorAPI';
import { FlowDefinition } from '../../domain/FlowDefinition';
import { CommunicationIntent } from '../../domain/CommunicationIntent';

/**
 * ReactFlow Adapter for People Ops Orchestrator.
 * 
 * IMPORTANT: This is a THIN UI ADAPTER.
 * - ReactFlow is used ONLY for visualization
 * - All orchestration logic lives in the API layer
 * - This component is completely replaceable
 * 
 * The adapter's responsibilities:
 * 1. Visualize CommunicationIntent nodes
 * 2. Convert ReactFlow state to FlowDefinition
 * 3. Display validation results from OrchestratorAPI
 */

// Custom node component for CommunicationIntent
const CommunicationIntentNode: React.FC<NodeProps> = ({ data }) => {
    return (
        <div style={{
            padding: '10px 20px',
            border: '2px solid #333',
            borderRadius: '8px',
            background: '#fff',
            minWidth: '200px'
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Communication Intent
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
                Channel: <strong>{data.channel}</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
                Audience: <strong>{data.audience}</strong>
            </div>
        </div>
    );
};

const nodeTypes = {
    communication_intent: CommunicationIntentNode,
};

// Sample hardcoded flow
const initialNodes: Node[] = [
    {
        id: 'intent-1',
        type: 'communication_intent',
        position: { x: 100, y: 100 },
        data: {
            channel: 'email',
            audience: 'employee',
            messageTemplate: 'Welcome to the team! Here is your onboarding guide.'
        },
    },
    {
        id: 'intent-2',
        type: 'communication_intent',
        position: { x: 400, y: 100 },
        data: {
            channel: 'slack',
            audience: 'leader',
            messageTemplate: 'New team member has been onboarded. Please schedule 1:1.'
        },
    },
];

const initialEdges: Edge[] = [
    {
        id: 'e1-2',
        source: 'intent-1',
        target: 'intent-2',
    },
];

export const PeopleOpsFlowCanvas: React.FC = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const orchestrator = new OrchestratorAPI();

    // Convert ReactFlow nodes to FlowDefinition
    const convertToFlowDefinition = useCallback((): FlowDefinition => {
        const intents: CommunicationIntent[] = nodes.map(node => ({
            id: node.id,
            channel: node.data.channel,
            audience: node.data.audience,
            messageTemplate: node.data.messageTemplate,
        }));

        return {
            id: 'sample-flow-1',
            name: 'Employee Onboarding Flow',
            intents,
        };
    }, [nodes]);

    // Validate flow whenever nodes change
    React.useEffect(() => {
        const flow = convertToFlowDefinition();
        const errors = orchestrator.validateFlow(flow);
        setValidationErrors(errors);
    }, [nodes, convertToFlowDefinition]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            {/* Validation Output */}
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 10,
                background: validationErrors.length > 0 ? '#fee' : '#efe',
                padding: '10px 20px',
                borderRadius: '8px',
                border: `2px solid ${validationErrors.length > 0 ? '#c33' : '#3c3'}`,
                maxWidth: '400px'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    Flow Validation
                </div>
                {validationErrors.length === 0 ? (
                    <div style={{ color: '#060' }}>✓ Flow is valid</div>
                ) : (
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#c00' }}>
                        {validationErrors.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* ReactFlow Canvas */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            />
        </div>
    );
};
