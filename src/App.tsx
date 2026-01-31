import React, { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Connection,
  Edge,
  Handle,
  Node,
  NodeProps,
  Position,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect
} from "reactflow";
import { OrchestratorAPI } from "./experiments/people-ops-orchestrator-v1/api/OrchestratorAPI";
import { EvaClient } from "./experiments/people-ops-orchestrator-v1/api/EvaClient";
import { FlowDefinition } from "./experiments/people-ops-orchestrator-v1/domain/FlowDefinition";
import { CommunicationIntent } from "./experiments/people-ops-orchestrator-v1/domain/CommunicationIntent";

import "reactflow/dist/style.css";

const palette = {
  orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  red: "text-red-400 bg-red-500/10 border-red-500/20",
  indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  slate: "text-slate-300 bg-slate-700 border-slate-700"
} as const;

const JourneyNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`node-card rounded-xl px-4 py-3 w-[200px] border-l-4 ${selected ? "border-primary shadow-glow" : "border-white/10"
        }`}
      style={{ borderLeftColor: "#6366f1" }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${palette.indigo}`}>
          <span className="material-symbols-outlined text-lg">rocket_launch</span>
        </div>
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Start Journey</span>
      </div>
      <div className="text-sm font-semibold text-white">{data.label}</div>
      <div className="text-[10px] text-slate-500 mt-1">ID: {data.journeyId || 'Not set'}</div>
    </div>
  );
};

const TagSwitchNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`node-card rounded-xl px-4 py-3 w-[220px] border-l-4 ${selected ? "border-primary shadow-glow" : "border-white/10"
        }`}
      style={{ borderLeftColor: "#8b5cf6" }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${palette.purple}`}>
          <span className="material-symbols-outlined text-lg">sell</span>
        </div>
        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Tag Switch</span>
      </div>
      <div className="text-sm font-semibold text-white">Switch: {data.switchField || 'tag'}</div>
      <div className="mt-2 space-y-1">
        {data.cases ? Object.keys(data.cases).map(tag => (
          <div key={tag} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-[10px] text-slate-400 font-mono">{tag}</span>
          </div>
        )) : <span className="text-[10px] text-slate-500 italic">No tags configured</span>}
      </div>
    </div>
  );
};

const nodeTypes = {
  journey: JourneyNode,
  tagSwitch: TagSwitchNode,
};

type WorkflowNodeData = {
  label: string;
  journeyId?: string;
  switchField?: string;
  cases?: Record<string, string>;
  offset?: number;
  executionHour?: number;
  executionMinute?: number;
};

const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: "node-1",
    type: "tagSwitch",
    position: { x: 100, y: 300 },
    data: {
      label: "User Interest Check",
      switchField: "user_tag",
      cases: { "vip": "VIP Flow", "standard": "Regular Flow" },
      offset: 0,
      executionHour: 9,
      executionMinute: 0
    }
  },
  {
    id: "node-2",
    type: "journey",
    position: { x: 450, y: 150 },
    data: {
      label: "Exclusive Offers",
      journeyId: "journey_vip_001",
      offset: 1,
      executionHour: 10,
      executionMinute: 30
    }
  },
  {
    id: "node-3",
    type: "journey",
    position: { x: 450, y: 450 },
    data: {
      label: "Onboarding Sequence",
      journeyId: "journey_std_001",
      offset: 0,
      executionHour: 14,
      executionMinute: 0
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "node-1",
    target: "node-2",
    label: "VIP",
    style: { stroke: "#8b5cf6", strokeWidth: 2 }
  },
  {
    id: "e1-3",
    source: "node-1",
    target: "node-3",
    label: "STANDARD",
    style: { stroke: "#8b5cf6", strokeWidth: 2 }
  }
];

const FlowCanvas: React.FC<{
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onUpdateNode: (nodeId: string, patch: Partial<WorkflowNodeData>) => void;
}> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  selectedNodeId,
  onSelectNode,
  onUpdateNode,
}) => {
    const onNodeClick = useCallback(
      (_: React.MouseEvent, node: Node) => {
        onSelectNode(node.id);
      },
      [onSelectNode]
    );

    const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;

    const updateSelectedNode = useCallback(
      (patch: Partial<WorkflowNodeData>) => {
        if (!selectedNode) return;
        onUpdateNode(selectedNode.id, patch);
      },
      [onUpdateNode, selectedNode]
    );

    return (
      <div className="absolute inset-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={() => onSelectNode(null)}
          fitView
          className="absolute inset-0"
        >
          <Background color="#1f2937" gap={32} size={1} />
        </ReactFlow>

        {selectedNode && (
          <div className="absolute right-4 top-24 w-80 glass-panel rounded-2xl shadow-2xl border border-white/10 z-30">
            <div className="p-4 border-b border-white/5">
              <h2 className="font-bold text-white tracking-wide">Configuration</h2>
              <p className="text-xs text-slate-500 mt-1">Edit node parameters</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Node Name
                </label>
                <input
                  className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                  value={selectedNode.data.label}
                  onChange={(event) => updateSelectedNode({ label: event.target.value })}
                />
              </div>

              {selectedNode.type === 'journey' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Journey Identifier
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                    value={selectedNode.data.journeyId || ''}
                    onChange={(event) => updateSelectedNode({ journeyId: event.target.value })}
                    placeholder="e.g. welcome_flow_01"
                  />
                </div>
              )}

              {selectedNode.type === 'tagSwitch' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Switch Field (Tag)
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                    value={selectedNode.data.switchField || ''}
                    onChange={(event) => updateSelectedNode({ switchField: event.target.value })}
                    placeholder="e.g. loyalty_tier"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Offset (Days)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none"
                    value={selectedNode.data.offset || 0}
                    onChange={(event) => updateSelectedNode({ offset: parseInt(event.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Time (UTC)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      className="w-full px-2 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white"
                      value={selectedNode.data.executionHour || 0}
                      onChange={(event) => updateSelectedNode({ executionHour: parseInt(event.target.value) })}
                      min="0" max="23"
                    />
                    <span className="text-white">:</span>
                    <input
                      type="number"
                      className="w-full px-2 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white"
                      value={selectedNode.data.executionMinute || 0}
                      onChange={(event) => updateSelectedNode({ executionMinute: parseInt(event.target.value) })}
                      min="0" max="59"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

const AppContent: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();
  const idCounter = useRef(10);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const orchestrator = useMemo(() => new OrchestratorAPI(), []);
  const evaClient = useMemo(() => new EvaClient(), []);
  const [evaStatus, setEvaStatus] = useState<{ tone: "neutral" | "success" | "error"; message: string }>({
    tone: "neutral",
    message: "No Eva requests yet."
  });

  const evaMocks = useMemo(
    () => ({
      startJourney: {
        userId: "64b7f6f2a1b2c3d4e5f67890",
        journeyId: "64b7f6f2a1b2c3d4e5f67891",
        startDate: "2026-01-15T12:00:00.000Z"
      },
      startJourneyByTag: {
        workspaceId: "64b7f6f2a1b2c3d4e5f67899",
        journeyId: "64b7f6f2a1b2c3d4e5f67891",
        tagId: "64b7f6f2a1b2c3d4e5f67900",
        startDate: "2026-01-15T12:00:00.000Z"
      },
      cancelJourney: {
        journeyId: "64b7f6f2a1b2c3d4e5f67891",
        users: ["64b7f6f2a1b2c3d4e5f67890", "64b7f6f2a1b2c3d4e5f67892"]
      }
    }),
    []
  );

  const runEvaAction = useCallback(
    async (label: string, action: () => Promise<void>) => {
      setEvaStatus({ tone: "neutral", message: `Running ${label}...` });
      try {
        await action();
        setEvaStatus({ tone: "success", message: `${label} completed successfully.` });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setEvaStatus({ tone: "error", message: `${label} failed: ${message}` });
      }
    },
    []
  );
  const evaStatusClass =
    evaStatus.tone === "success"
      ? "text-emerald-400"
      : evaStatus.tone === "error"
        ? "text-red-400"
        : "text-slate-400";

  const addWorkflowNode = useCallback(
    (type: Node<WorkflowNodeData>["type"], baseData: WorkflowNodeData) => {
      const id = `node-${idCounter.current++}`;
      const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      const newNode: Node<WorkflowNodeData> = {
        id,
        type,
        position,
        data: baseData
      };
      setNodes((prev) => prev.concat(newNode));
      setSelectedNodeId(id);
    },
    [screenToFlowPosition, setNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#94a3b8" } }, eds)),
    [setEdges]
  );

  const handleUpdateNode = useCallback((nodeId: string, patch: Partial<WorkflowNodeData>) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...patch } } : node))
    );
  }, [setNodes]);

  // Effect to validate flow whenever nodes change
  React.useEffect(() => {
    // Basic validation: ensure all nodes have required fields
    const errors: string[] = [];
    nodes.forEach(node => {
      if (node.type === 'journey' && !node.data.journeyId) {
        errors.push(`Journey node "${node.data.label}" missing Journey ID`);
      }
      if (node.type === 'tagSwitch' && !node.data.switchField) {
        errors.push(`Tag Switch "${node.data.label}" missing Switch Field`);
      }
    });

    if (nodes.length === 0) {
      errors.push("Template must contain at least one action");
    }

    setValidationErrors(errors);
  }, [nodes]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-canvas text-slate-300 selection:bg-primary selection:text-white overflow-hidden">
      <header className="h-16 glass-panel border-b-0 flex items-center justify-between px-6 shrink-0 z-30 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white shadow-glow">
              <span className="material-symbols-outlined text-xl">account_tree</span>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white leading-tight">
                Orchestrator <span className="text-primary">Pro</span>
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  Live Canvas
                </span>
                {validationErrors.length === 0 ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    Valid
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[12px]">error</span>
                    {validationErrors.length} {validationErrors.length === 1 ? 'Error' : 'Errors'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-4">
            {["JD", "AS", "+3"].map((label, idx) => (
              <div
                key={idx}
                className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs text-white font-medium"
              >
                {label}
              </div>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-white/10 transition-colors">
            <span className="material-symbols-outlined text-base">save</span>
            Save
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-indigo-500 rounded-lg shadow-glow transition-all">
            <span className="material-symbols-outlined text-base">play_circle</span>
            Deploy Workflow
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <aside className="w-72 glass-panel border-r border-t-0 flex flex-col shrink-0 z-20 absolute left-4 top-4 bottom-4 rounded-2xl shadow-2xl">
          <div className="p-5 border-b border-white/5">
            <h2 className="font-bold text-sm text-white tracking-wide flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">grid_view</span>
              Components
            </h2>
            <div className="mt-3 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-slate-500">
                <span className="material-symbols-outlined text-lg">search</span>
              </span>
              <input
                type="text"
                placeholder="Search nodes..."
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-slate-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
            <section>
              <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Template Actions</h3>
              <div className="space-y-3">
                <button
                  className="w-full text-left p-3 bg-slate-800/40 border border-white/5 rounded-xl flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                  onClick={() => addWorkflowNode("journey", {
                    label: "New Journey Flow",
                    journeyId: "",
                    offset: 0,
                    executionHour: 9,
                    executionMinute: 0
                  })}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-active:scale-95 ${palette.indigo}`}>
                    <span className="material-symbols-outlined text-xl">rocket_launch</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-200 block">Start Journey</span>
                    <span className="text-[10px] text-slate-500">External Flow Trigger</span>
                  </div>
                </button>

                <button
                  className="w-full text-left p-3 bg-slate-800/40 border border-white/5 rounded-xl flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                  onClick={() => addWorkflowNode("tagSwitch", {
                    label: "Evaluate Tag",
                    switchField: "tag",
                    cases: {},
                    offset: 0,
                    executionHour: 9,
                    executionMinute: 0
                  })}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-active:scale-95 ${palette.purple}`}>
                    <span className="material-symbols-outlined text-xl">sell</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-200 block">Tag Switch</span>
                    <span className="text-[10px] text-slate-500">Property Comparison</span>
                  </div>
                </button>
              </div>
            </section>
            <section>
              <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">
                Eva Integration (Mocks)
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full text-left p-3 bg-slate-800/40 border border-white/5 rounded-xl flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                  onClick={() =>
                    runEvaAction("Start Journey", () => evaClient.startJourney(evaMocks.startJourney))
                  }
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${palette.emerald}`}>
                    <span className="material-symbols-outlined text-xl">play_arrow</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-200 block">Start Journey</span>
                    <span className="text-[10px] text-slate-500">Single user trigger</span>
                  </div>
                </button>

                <button
                  className="w-full text-left p-3 bg-slate-800/40 border border-white/5 rounded-xl flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                  onClick={() =>
                    runEvaAction("Start Journey by Tag", () =>
                      evaClient.startJourneyByTag(evaMocks.startJourneyByTag)
                    )
                  }
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${palette.orange}`}>
                    <span className="material-symbols-outlined text-xl">sell</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-200 block">Start Journey by Tag</span>
                    <span className="text-[10px] text-slate-500">Bulk trigger by tag</span>
                  </div>
                </button>

                <button
                  className="w-full text-left p-3 bg-slate-800/40 border border-white/5 rounded-xl flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                  onClick={() =>
                    runEvaAction("Cancel Journey", () => evaClient.cancelJourney(evaMocks.cancelJourney))
                  }
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${palette.red}`}>
                    <span className="material-symbols-outlined text-xl">cancel</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-200 block">Cancel Journey</span>
                    <span className="text-[10px] text-slate-500">Unsubscribe users</span>
                  </div>
                </button>
              </div>
              <div className="mt-3 text-[10px] leading-relaxed text-slate-500">
                <span className={`font-semibold ${evaStatusClass}`}>{evaStatus.message}</span>
              </div>
            </section>
          </div>
        </aside>

        <main className="flex-1 relative bg-canvas overflow-hidden">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            onUpdateNode={handleUpdateNode}
          />
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
};

export default App;
