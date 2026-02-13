import React, { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
    Background,
    Connection,
    useReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Controls,
} from "reactflow";
import engine from "../services/EvaEngine";
import { Orchestrator } from "../types";
import {
    JourneyNode,
    DecisionNode,
    HumanInTheLoopNode,
    NotificationNode
} from "./nodes"; // JourneyNode -> StartFlow, DecisionNode -> Conditional
import { MonitorView } from "./monitor/MonitorView";
import { Button, IconButton, Modal } from "./ui";
import { NodePropertiesPanel } from "./NodePropertiesPanel";
import { BlockagesPanel } from "./BlockagesPanel";
import { ExecutionSnapshotsView } from "./snapshots/ExecutionSnapshotsView";
import { DeletableEdge } from "./edges";

// Nodes renamed mapping for React Flow
const nodeTypes = {
    startFlow: JourneyNode, // Reuse existing component logic but renamed conceptually
    conditional: DecisionNode,
    humanInTheLoop: HumanInTheLoopNode,
    notification: NotificationNode
};

const edgeTypes = {
    deletable: DeletableEdge,
};

interface FlowEditorProps {
    orchestrator: Orchestrator;
    onBack: () => void;
    onSave: (o: Orchestrator) => void;
    integrations: any[];
}

export const FlowEditor: React.FC<FlowEditorProps> = ({ orchestrator, onBack, onSave, integrations }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(orchestrator.nodes);

    const [edges, setEdges, onEdgesChange] = useEdgesState(orchestrator.edges);
    const { screenToFlowPosition } = useReactFlow();
    const idCounter = useRef(500);

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [showMonitor, setShowMonitor] = useState(false);
    const [availableJourneys, setAvailableJourneys] = useState<any[]>([]);
    const [isDirty, setIsDirty] = useState(false);

    // New States
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);

    useEffect(() => {
        setAvailableJourneys(engine.getJourneys());

        // Initialize ID counter to prevent collisions with existing nodes
        const maxId = orchestrator.nodes.reduce((max, node) => {
            const match = node.id.match(/^node-(\d+)$/);
            if (match) {
                return Math.max(max, parseInt(match[1], 10));
            }
            return max;
        }, 500);
        idCounter.current = maxId + 1;
    }, []);

    // Track unsaved changes
    useEffect(() => {
        if (nodes !== orchestrator.nodes || edges !== orchestrator.edges) {
            setIsDirty(true);
        }
    }, [nodes, edges, orchestrator.nodes, orchestrator.edges]);

    const handleSave = () => {
        onSave({ ...orchestrator, nodes, edges });
        setIsDirty(false);
        setLastSaved(new Date());
    };

    const handleBackWithCheck = () => {
        // Simple check to avoid blocking if just navigating
        // In real app, strict dirty check is better
        onBack();
    };

    const addNode = (type: string, data: any) => {
        const id = `node-${idCounter.current++}`;
        const position = screenToFlowPosition({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2
        });
        setNodes(nds => nds.concat({ id, type, position, data }));
        setSelectedNodeId(id);
        setIsDirty(true);
    };

    const onConnect = useCallback((params: Connection) => {
        const sourceNode = nodes.find(n => n.id === params.source);
        let label = '';
        let strokeColor = "#64748b"; // default slate-500
        let style = {};

        if (sourceNode?.type === 'conditional' && sourceNode.data.rules) {
            const rules = sourceNode.data.rules || [];
            const index = rules.findIndex((r: any) => r.id === params.sourceHandle);
            if (index !== -1) {
                label = String.fromCharCode(65 + index);
            } else if (params.sourceHandle === 'else-handle') {
                label = 'Else';
            }
            strokeColor = "#4f39f6";
        }

        // Dynamic Handle Colors
        if (params.sourceHandle === 'approved') { strokeColor = "#22c55e"; label = "Approved"; style = { strokeDasharray: '0' }; } // Green-500 Solid
        if (params.sourceHandle === 'rejected') { strokeColor = "#ef4444"; label = "Rejected"; style = { strokeDasharray: '0' }; } // Red-500 Solid
        if (params.sourceHandle === 'success') { strokeColor = "#22c55e"; label = "Success"; style = { strokeDasharray: '0' }; } // Green-500 Solid
        if (params.sourceHandle === 'error') { strokeColor = "#ef4444"; label = "Error"; style = { strokeDasharray: '0' }; } // Red-500 Solid

        // Default / Fallback
        if (params.sourceHandle === 'fallback') {
            strokeColor = "#94a3b8"; // Slate-400
            label = "Fallback";
            style = { strokeDasharray: '5,5' }; // Dashed
        }

        setEdges(eds => addEdge({
            ...params,
            type: 'deletable',
            label,
            animated: true, // Always animated as requested

            style: { stroke: strokeColor, strokeWidth: 2, ...style }
        }, eds));
        setIsDirty(true);
    }, [nodes, setEdges]); // depend on nodes to find source

    const updateNode = (id: string, patch: any) => {
        setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n));
        setIsDirty(true);
    };

    const deleteNode = () => {
        if (!selectedNodeId) return;
        setNodes(nds => nds.filter(n => n.id !== selectedNodeId));
        setSelectedNodeId(null);
        setIsDirty(true);
    };

    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    // STRICT NODE FACTORY - ONLY MODERN VALID NODES
    const nodeFactoryItems = [
        {
            type: 'startFlow',
            label: 'Start Flow',
            icon: 'play_circle',
            color: 'text-emerald-600',
            data: { label: 'Start Flow', journeyId: '' }
        },
        {
            type: 'conditional',
            label: 'Conditional',
            icon: 'call_split',
            color: 'text-purple-600',
            data: { label: 'Decision Logic', rules: [] }
        },
        {
            type: 'humanInTheLoop',
            label: 'Human In The Loop',
            icon: 'person_raised_hand',
            color: 'text-orange-500',
            data: { label: 'Approval Step', assignee: '', timeout: 24 }
        },
        {
            type: 'notification',
            label: 'Notification',
            icon: 'notifications_active',
            color: 'text-sky-500',
            data: { label: 'Send Notification', channel: 'email', recipients: '' }
        }
    ];

    // --- NODE NAMING ALGORITHM ---
    useEffect(() => {
        if (nodes.length === 0) return;

        const newNodes = [...nodes];
        let changed = false;

        // 1. Build Adjacency List
        const adj: Record<string, string[]> = {};
        const inDegree: Record<string, number> = {};

        nodes.forEach(n => {
            adj[n.id] = [];
            inDegree[n.id] = 0;
        });

        edges.forEach(e => {
            if (adj[e.source]) adj[e.source].push(e.target);
            if (inDegree[e.target] !== undefined) inDegree[e.target]++;
        });

        // 2. Sort children by Y position for deterministic branching
        Object.keys(adj).forEach(id => {
            adj[id].sort((a, b) => {
                const nodeA = nodes.find(n => n.id === a);
                const nodeB = nodes.find(n => n.id === b);
                return (nodeA?.position.y || 0) - (nodeB?.position.y || 0);
            });
        });

        // 3. Simple Traversal
        // We use a simplified DFS/BFS hybrid to assign labels
        // We track 'branch' letters vertically.

        const visited = new Set<string>();
        let nextBranchChar = 'A'.charCodeAt(0);
        const branchCounters: Record<string, number> = {};

        // Find roots (inDegree 0)
        let roots = nodes.filter(n => inDegree[n.id] === 0);

        // Fallback if loop (no roots), pick the top-left most node
        if (roots.length === 0 && nodes.length > 0) {
            roots = [nodes.sort((a, b) => a.position.x - b.position.x)[0]];
        }

        const queue: { id: string; branch: string }[] = [];

        roots.forEach(r => {
            const char = String.fromCharCode(nextBranchChar++);
            branchCounters[char] = 1;
            queue.push({ id: r.id, branch: char });
        });

        while (queue.length > 0) {
            const { id, branch } = queue.shift()!;

            if (visited.has(id)) continue;
            visited.add(id);

            // Assign Label
            const count = branchCounters[branch]++;
            const label = `${branch}${count}`;

            const nodeIndex = newNodes.findIndex(n => n.id === id);
            if (nodeIndex !== -1) {
                if (newNodes[nodeIndex].data.displayId !== label) {
                    newNodes[nodeIndex] = {
                        ...newNodes[nodeIndex],
                        data: {
                            ...newNodes[nodeIndex].data,
                            displayId: label
                        }
                    };
                    changed = true;
                }
            }

            // Process Children
            const children = adj[id] || [];
            children.forEach((childId, idx) => {
                if (!visited.has(childId)) {
                    // First child continues branch, others get new branches
                    let nextBranch = branch;
                    if (idx > 0) {
                        nextBranch = String.fromCharCode(nextBranchChar++);
                        branchCounters[nextBranch] = 1;
                    }
                    queue.push({ id: childId, branch: nextBranch });
                }
            });
        }

        if (changed) {
            setNodes(newNodes);
        }

    }, [nodes.length, edges.length, JSON.stringify(edges.map(e => e.source + e.target))]); // Dependency on topology


    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isBlockPanelOpen, setIsBlockPanelOpen] = useState(false);
    const [showSnapshots, setShowSnapshots] = useState(false);
    const [selectionModeEmployeeId, setSelectionModeEmployeeId] = useState<string | null>(null);

    const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
        if (selectionModeEmployeeId) {
            setSelectedNodeId(node.id);
            return;
        }
        setSelectedNodeId(node.id);
        setIsBlockPanelOpen(false);
    }, [selectionModeEmployeeId]);

    const handlePaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    const toggleBlockPanel = () => {
        if (isBlockPanelOpen) {
            setIsBlockPanelOpen(false);
            setSelectionModeEmployeeId(null);
        } else {
            setIsBlockPanelOpen(true);
            setSelectedNodeId(null);
        }
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-20 flex items-center justify-between px-8 shrink-0 mx-6 mt-6 rounded-[24px] bg-white border border-slate-200 shadow-premium z-30">
                <div className="flex items-center gap-8">
                    <IconButton icon="arrow_back" onClick={handleBackWithCheck} label="Back" />
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#4f39f6] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <span className="material-symbols-outlined font-black">hub</span>
                        </div>
                        <div>
                            <div className="flex items-baseline gap-2">
                                <h1 className="font-black text-xl tracking-tighter text-slate-900">{orchestrator.name}</h1>
                                <span className="text-[10px] font-black text-[#4f39f6] bg-[#4f39f6]/5 px-2 py-0.5 rounded-full uppercase">
                                    {orchestrator.status}
                                </span>
                            </div>

                            {/* Last Saved Logic */}
                            <div className="flex items-center gap-2 mt-0.5">
                                {isDirty ? (
                                    <span className="text-[9px] font-bold text-amber-500 uppercase flex items-center gap-1 animate-pulse">
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                        Unsaved Changes
                                    </span>
                                ) : lastSaved && (
                                    <span className="text-[9px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[10px]">cloud_done</span>
                                        Saved {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => setShowSnapshots(true)}
                        className="!border-indigo-200 !text-indigo-600 hover:!bg-indigo-50 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">history_edu</span>
                        Snapshots
                    </Button>

                    <Button
                        variant="secondary"
                        size="md"
                        onClick={toggleBlockPanel}
                        className={`!border-amber-200 !text-amber-600 hover:!bg-amber-50 flex items-center gap-2 ${isBlockPanelOpen ? 'bg-amber-50 ring-2 ring-amber-100' : ''}`}
                    >
                        <span className="material-symbols-outlined text-sm">lock_clock</span>
                        Bloqueios (3)
                    </Button>

                    {orchestrator.status === 'published' && (
                        <Button variant="secondary" size="sm" onClick={() => setShowMonitor(true)}>
                            View Logs
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleSave}
                        disabled={!isDirty}
                        className={!isDirty ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                        Save
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden p-6 gap-6 relative">
                {/* Node Factory Sidebar */}
                <aside
                    className={`${isSidebarCollapsed ? 'w-[100px] px-3' : 'w-[320px] p-7'} flex flex-col shrink-0 z-20 rounded-[32px] border border-slate-200 bg-white shadow-premium transition-all duration-300 ease-in-out relative`}
                >
                    <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} mb-8`}>
                        {!isSidebarCollapsed && (
                            <h2 className="font-black text-[11px] text-slate-400 tracking-[0.25em] uppercase flex items-center gap-2 whitespace-nowrap">
                                <span className="material-symbols-outlined text-sm">construction</span>
                                Node Factory
                            </h2>
                        )}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
                        >
                            <span className="material-symbols-outlined text-xl">
                                {isSidebarCollapsed ? 'chevron_right' : 'chevron_left'}
                            </span>
                        </button>
                    </div>

                    <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar">
                        {nodeFactoryItems.map((n, i) => (
                            <button
                                key={i}
                                onClick={() => addNode(n.type, n.data)}
                                className={`w-full text-left bg-slate-50 hover:bg-white hover:shadow-xl hover:translate-y-[-2px] border border-slate-100 rounded-[24px] flex items-center transition-all group ${isSidebarCollapsed ? 'justify-center p-3' : 'p-4 gap-5'}`}
                                title={isSidebarCollapsed ? n.label : ''}
                            >
                                <div className={`w-12 h-12 shrink-0 rounded-2xl bg-white border border-slate-100 ${n.color} flex items-center justify-center group-hover:scale-110 shadow-sm transition-all`}>
                                    <span className="material-symbols-outlined text-xl font-black">{n.icon}</span>
                                </div>
                                {!isSidebarCollapsed && (
                                    <div className="min-w-0">
                                        <span className="text-[13px] font-black text-slate-800 block truncate">{n.label}</span>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase truncate block">Insert Node</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* React Flow Canvas */}
                <main className={`flex-1 relative bg-canvas-gradient rounded-[48px] border border-slate-200 shadow-premium overflow-hidden transition-all ${selectionModeEmployeeId ? 'cursor-crosshair ring-4 ring-amber-400 ring-opacity-50' : ''}`}>
                    {selectionModeEmployeeId && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white px-6 py-2 rounded-full shadow-lg font-bold text-sm animate-bounce pointer-events-none">
                            Select the next step in the flow...
                        </div>
                    )}

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onNodeClick={handleNodeClick}
                        onPaneClick={handlePaneClick}
                        fitView
                        className="absolute inset-0"
                    >
                        <Background color="#cbd5e1" gap={32} size={1} />
                        <Controls className="react-flow__controls" />

                    </ReactFlow>

                    {/* Properties Panel */}
                    {selectedNode && !isBlockPanelOpen && !selectionModeEmployeeId && (
                        <NodePropertiesPanel
                            selectedNode={selectedNode}
                            onUpdate={updateNode}
                            onDelete={deleteNode}
                            onClose={() => setSelectedNodeId(null)}
                            availableJourneys={availableJourneys}
                            integrations={integrations}
                        />
                    )}

                    {isBlockPanelOpen && (
                        <BlockagesPanel
                            isOpen={isBlockPanelOpen}
                            onClose={() => { setIsBlockPanelOpen(false); setSelectionModeEmployeeId(null); }}
                            nodes={nodes}
                            onNodeSelectMode={setSelectionModeEmployeeId}
                            selectionModeEmployeeId={selectionModeEmployeeId}
                            selectedNodeId={selectedNodeId}
                        />
                    )}
                </main>

                {showMonitor && <MonitorView orchestrator={orchestrator} onClose={() => setShowMonitor(false)} />}

                {/* Confirmation Modal */}
                <Modal
                    isOpen={showUnsavedModal}
                    onClose={() => setShowUnsavedModal(false)}
                    title="Unsaved Changes"
                    footer={
                        <>
                            <Button variant="secondary" onClick={() => setShowUnsavedModal(false)}>Cancel</Button>
                            <Button variant="danger" onClick={onBack}>Discard Changes</Button>
                            <Button variant="primary" onClick={() => { handleSave(); onBack(); }}>Save & Exit</Button>
                        </>
                    }
                >
                    <p className="text-slate-600 font-bold mb-4">You have unsaved changes in your workflow.</p>
                    <p className="text-sm text-slate-500">Leaving without saving will discard all recent modifications.</p>
                </Modal>

                {showSnapshots && <ExecutionSnapshotsView orchestrator={orchestrator} onClose={() => setShowSnapshots(false)} />}
            </div>
        </div>
    );
};
