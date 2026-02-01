import React, { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
    Background,
    Connection,
    useReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Controls,
    MiniMap
} from "reactflow";
import engine from "../services/EvaEngine";
import { Orchestrator } from "../types";
import { TriggerNode, JourneyNode, DecisionNode, TagManagerNode, DelayNode } from "./nodes";
import { MonitorView } from "./monitor/MonitorView";
import { Button, IconButton, Modal } from "./ui";
import { TriggerPropsEditor } from "./properties/TriggerPropsEditor";
import { JourneyPropsEditor, TagPropsEditor, DelayPropsEditor, DecisionPropsEditor } from "./properties";

const nodeTypes = {
    trigger: TriggerNode,
    journey: JourneyNode,
    decision: DecisionNode,
    setTag: TagManagerNode,
    delay: DelayNode,
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
        if (isDirty) {
            setShowUnsavedModal(true);
        } else {
            onBack();
        }
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
        setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: "#4f39f6", strokeWidth: 3 } }, eds));
        setIsDirty(true);
    }, [setEdges]);

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

    const nodeFactoryItems = [
        { type: 'trigger', label: 'External Trigger', icon: 'api', color: 'text-[#ff5a1f]', data: { label: 'API Gateway', method: 'POST', endpoint: 'https://api.example.com', authType: 'API Key', integrationActive: true } },
        { type: 'journey', label: 'Flow Starter', icon: 'rocket_launch', color: 'text-[#4f39f6]', data: { label: 'Start Journey', journeyId: '' } },
        { type: 'decision', label: 'Decision Logic', icon: 'call_split', color: 'text-purple-600', data: { label: 'Branch Logic', switchField: 'tag', cases: { "val1": "Path A" } } },
        { type: 'setTag', label: 'Tag Manager', icon: 'sell', color: 'text-emerald-600', data: { label: 'Update Tags', addTag: '', removeTag: '' } },
        { type: 'delay', label: 'Wait Delay', icon: 'schedule', color: 'text-amber-500', data: { label: 'Wait Period', delayValue: 1, delayUnit: 'days' } }
    ];

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
                <aside className="w-[320px] flex flex-col shrink-0 z-20 rounded-[32px] border border-slate-200 bg-white shadow-premium p-7">
                    <h2 className="font-black text-[11px] text-slate-400 tracking-[0.25em] mb-8 uppercase flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">construction</span>
                        Node Factory
                    </h2>
                    <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar">
                        {nodeFactoryItems.map((n, i) => (
                            <button
                                key={i}
                                onClick={() => addNode(n.type, n.data)}
                                className="w-full text-left p-4 bg-slate-50 hover:bg-white hover:shadow-xl hover:translate-y-[-2px] border border-slate-100 rounded-[24px] flex items-center gap-5 transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-white border border-slate-100 ${n.color} flex items-center justify-center group-hover:scale-110 shadow-sm transition-all`}>
                                    <span className="material-symbols-outlined text-xl font-black">{n.icon}</span>
                                </div>
                                <div>
                                    <span className="text-[13px] font-black text-slate-800 block">{n.label}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">Insert Node</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* React Flow Canvas */}
                <main className="flex-1 relative bg-canvas-gradient rounded-[48px] border border-slate-200 shadow-premium overflow-hidden">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
                        onPaneClick={() => setSelectedNodeId(null)}
                        fitView
                        className="absolute inset-0"
                    >
                        <Background color="#cbd5e1" gap={32} size={1} />
                        <Controls className="react-flow__controls" />
                        <MiniMap className="react-flow__minimap" maskColor="rgba(241, 245, 249, 0.4)" />
                    </ReactFlow>

                    {/* Properties Panel */}
                    {selectedNode && (
                        <div className="absolute right-8 top-8 bottom-8 w-[420px] bg-white rounded-[40px] shadow-2xl border border-slate-200 z-30 flex flex-col p-8 animate-fade-in">
                            <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="font-black text-slate-900 text-xs tracking-widest uppercase">Properties</h2>
                                    <p className="text-[10px] text-slate-400 mt-1">{selectedNode.id}</p>
                                </div>
                                <IconButton icon="close" onClick={() => setSelectedNodeId(null)} />
                            </div>

                            <div className="flex-1 overflow-y-auto py-8 space-y-6 no-scrollbar">
                                {/* Label field - universal */}
                                <div>
                                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Label</label>
                                    <input
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-[#4f39f6]"
                                        value={selectedNode.data.label}
                                        onChange={e => updateNode(selectedNode.id, { label: e.target.value })}
                                    />
                                </div>

                                {/* Type-specific fields */}
                                {selectedNode.type === 'trigger' && (
                                    <TriggerPropsEditor
                                        data={selectedNode.data}
                                        onUpdate={patch => updateNode(selectedNode.id, patch)}
                                        integrations={integrations}
                                    />
                                )}

                                {selectedNode.type === 'journey' && (
                                    <JourneyPropsEditor
                                        data={selectedNode.data}
                                        availableJourneys={availableJourneys}
                                        onUpdate={patch => updateNode(selectedNode.id, patch)}
                                    />
                                )}

                                {selectedNode.type === 'setTag' && (
                                    <TagPropsEditor
                                        data={selectedNode.data}
                                        onUpdate={patch => updateNode(selectedNode.id, patch)}
                                    />
                                )}

                                {selectedNode.type === 'delay' && (
                                    <DelayPropsEditor
                                        data={selectedNode.data}
                                        onUpdate={patch => updateNode(selectedNode.id, patch)}
                                    />
                                )}

                                {selectedNode.type === 'decision' && (
                                    <DecisionPropsEditor
                                        data={selectedNode.data}
                                        onUpdate={patch => updateNode(selectedNode.id, patch)}
                                    />
                                )}
                            </div>

                            <Button variant="danger" size="sm" onClick={deleteNode} className="w-full">
                                Delete Node
                            </Button>
                        </div>
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
            </div>
        </div>
    );
};
