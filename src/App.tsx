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

const TriggerNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`node-card rounded-xl px-4 py-3 w-[180px] border ${selected ? "border-primary shadow-glow" : "border-white/10"
        }`}
    >
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${palette.orange}`}>
          <span className="material-symbols-outlined text-lg">touch_app</span>
        </div>
        <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Trigger</span>
      </div>
      <div className="text-sm font-semibold text-white">{data.label}</div>
      <div className="text-[10px] text-slate-500 mt-1">{data.subtitle}</div>
    </div>
  );
};

const ActionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const accent = data.accent as keyof typeof palette;
  return (
    <div
      className={`node-card rounded-xl px-4 py-3 w-[200px] border-l-4 ${selected ? "border-primary shadow-glow" : "border-white/10"
        }`}
      style={{ borderLeftColor: data.borderColor || "#334155" }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`material-symbols-outlined ${palette[accent]} text-lg`}> {data.icon} </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${palette[accent]} bg-transparent border-0`}>
            {data.typeLabel}
          </span>
        </div>
        {data.active && <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
      </div>
      <div className="text-sm font-semibold text-white">{data.label}</div>
      {data.template && <div className="text-[10px] text-slate-500 mt-2 truncate">{data.template}</div>}
    </div>
  );
};

const ConditionalNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="relative w-[160px] h-[160px] flex items-center justify-center">
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      <div className="w-[120px] h-[120px] bg-slate-900 triangle-node flex items-end justify-center pb-4 shadow-glow relative">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 triangle-node border-b-4 border-purple-500 bg-purple-500/10"></div>
        <span className="material-symbols-outlined text-purple-400 text-4xl mb-2 relative z-10 drop-shadow-lg">
          call_split
        </span>
      </div>
      <div className="absolute -bottom-4 bg-slate-800/90 backdrop-blur px-3 py-1.5 rounded-full border border-purple-500/30 shadow-lg">
        <span className="text-xs font-bold text-purple-300 whitespace-nowrap">{data.label}</span>
      </div>
      <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[10px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)] backdrop-blur-sm transform translate-x-4">
        TRUE
      </div>
      <div className="absolute bottom-2 right-0 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 text-[10px] font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)] backdrop-blur-sm transform translate-x-4">
        FALSE
      </div>
    </div>
  );
};

const DelayNode: React.FC<NodeProps> = ({ data }) => {
  return (
    <div className="relative w-[160px] h-[120px] flex items-center justify-center">
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <div className="w-[88px] h-[88px] bg-slate-900 hexagon-node flex items-center justify-center shadow-lg relative">
        <div className="absolute inset-0 bg-amber-500/10 hexagon-node"></div>
        <div className="absolute inset-0 border-2 border-amber-500/50 hexagon-node"></div>
        <span className="material-symbols-outlined text-amber-400 text-2xl drop-shadow-md">hourglass_bottom</span>
      </div>
      <div className="absolute -bottom-4 bg-slate-800/90 px-3 py-1 rounded-full border border-amber-500/30 shadow-lg backdrop-blur-sm">
        <span className="text-xs font-bold text-amber-300">{data.label}</span>
      </div>
    </div>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  conditional: ConditionalNode,
  delay: DelayNode
};

type WorkflowNodeData = {
  label: string;
  subtitle?: string;
  typeLabel?: string;
  icon?: string;
  template?: string;
  accent?: keyof typeof palette;
  borderColor?: string;
  active?: boolean;
};

const initialNodes: Node<WorkflowNodeData>[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 80, y: 240 },
    data: { label: "HR Announcement", subtitle: "User initiated" }
  },
  {
    id: "conditional-1",
    type: "conditional",
    position: { x: 520, y: 210 },
    data: { label: "Check: Active Status" }
  },
  {
    id: "action-1",
    type: "action",
    position: { x: 880, y: 80 },
    data: {
      label: "Send Policy Update",
      typeLabel: "Slack",
      icon: "chat",
      template: "Template: #policy-update-v2",
      accent: "blue",
      active: true,
      borderColor: "#10b981"
    }
  },
  {
    id: "delay-1",
    type: "delay",
    position: { x: 1220, y: 90 },
    data: { label: "3 Days" }
  },
  {
    id: "action-2",
    type: "action",
    position: { x: 1520, y: 90 },
    data: {
      label: "Reminder: Policy",
      typeLabel: "Email",
      icon: "mail",
      accent: "indigo",
      borderColor: "#6366f1"
    }
  },
  {
    id: "action-3",
    type: "action",
    position: { x: 880, y: 420 },
    data: {
      label: "Log: Inactive User",
      typeLabel: "End",
      icon: "do_not_disturb_on",
      accent: "slate",
      borderColor: "#64748b"
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "trigger-1",
    target: "conditional-1",
    style: { stroke: "#475569", strokeWidth: 2 }
  },
  {
    id: "e2-3",
    source: "conditional-1",
    target: "action-1",
    label: "TRUE",
    style: { stroke: "#10b981", strokeWidth: 2, strokeDasharray: "6 4" },
    labelStyle: { fill: "#10b981", fontSize: 10 }
  },
  {
    id: "e2-4",
    source: "conditional-1",
    target: "action-3",
    label: "FALSE",
    style: { stroke: "#ef4444", strokeWidth: 2, strokeDasharray: "6 4" },
    labelStyle: { fill: "#ef4444", fontSize: 10 }
  },
  {
    id: "e3-4",
    source: "action-1",
    target: "delay-1",
    style: { stroke: "#475569", strokeWidth: 2 }
  },
  {
    id: "e4-5",
    source: "delay-1",
    target: "action-2",
    style: { stroke: "#475569", strokeWidth: 2 }
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
              {selectedNode.data.template !== undefined && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Template
                  </label>
                  <input
                    className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500"
                    value={selectedNode.data.template}
                    onChange={(event) => updateSelectedNode({ template: event.target.value })}
                  />
                </div>
              )}
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
    const intents: CommunicationIntent[] = nodes
      .filter(n => n.type === 'action')
      .map(n => ({
        id: n.id,
        channel: (n.data.typeLabel?.toLowerCase() as any) || 'email',
        audience: 'employee',
        messageTemplate: n.data.template || ''
      }));

    const flow: FlowDefinition = {
      id: 'current-flow',
      name: 'Active Workflow',
      intents
    };

    setValidationErrors(orchestrator.validateFlow(flow));
  }, [nodes, orchestrator]);

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
              <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Triggers</h3>
              <button
                className="w-full text-left p-3 bg-slate-800/40 border border-white/5 rounded-xl flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                onClick={() => addWorkflowNode("trigger", { label: "Manual Trigger", subtitle: "User initiated" })}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-active:scale-95 ${palette.orange}`}>
                  <span className="material-symbols-outlined text-xl">bolt</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-200 block">Manual Trigger</span>
                  <span className="text-[10px] text-slate-500">User initiated</span>
                </div>
              </button>
            </section>
            <section>
              <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Logic &amp; Flow</h3>
              <div className="space-y-2">
                <button
                  className="w-full text-left p-3 bg-slate-800/40 border border-white/5 rounded-xl flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                  onClick={() => addWorkflowNode("conditional", { label: "Condition" })}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-active:scale-95 ${palette.purple}`}>
                    <span className="material-symbols-outlined text-xl">call_split</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-200 block">Conditional</span>
                    <span className="text-[10px] text-slate-500">Branching logic</span>
                  </div>
                </button>
                <button
                  className="w-full text-left p-3 bg-slate-800/40 border border-white/5 rounded-xl flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                  onClick={() => addWorkflowNode("delay", { label: "2 Days" })}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-active:scale-95 ${palette.warning}`}>
                    <span className="material-symbols-outlined text-xl">hourglass_empty</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-200 block">Delay</span>
                    <span className="text-[10px] text-slate-500">Wait for duration</span>
                  </div>
                </button>
              </div>
            </section>
            <section>
              <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-wider">Actions</h3>
              <button
                className="w-full text-left p-3 bg-slate-800/40 border border-white/5 rounded-xl flex items-center gap-3 hover:bg-slate-700/60 transition-colors group"
                onClick={() =>
                  addWorkflowNode("action", {
                    label: "Send Message",
                    typeLabel: "Slack",
                    icon: "chat",
                    template: "Template: #message",
                    accent: "blue",
                    active: true,
                    borderColor: "#6366f1"
                  })
                }
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-active:scale-95 ${palette.blue}`}>
                  <span className="material-symbols-outlined text-xl">send</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-200 block">Send Message</span>
                  <span className="text-[10px] text-slate-500">Slack / Email</span>
                </div>
              </button>
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
