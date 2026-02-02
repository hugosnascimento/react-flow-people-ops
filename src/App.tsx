import React, { useCallback, useRef, useState, useEffect } from "react";
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
  Controls,
  MiniMap
} from "reactflow";
import engine from "./services/EvaEngine";
import {
  createOrchestrator,
  getOrchestrator,
  listOrchestrators,
  publishOrchestrator,
  saveOrchestrator,
  triggerOrchestrator,
} from "./services/orchestratorApi";
import { Orchestrator, WorkflowNodeData } from "./types";
import { DashboardView } from "./components/dashboard/DashboardView";
import { MonitorView } from "./components/monitor/MonitorView";

import "reactflow/dist/style.css";

// --- Custom Nodes ---

const TriggerNode: React.FC<NodeProps> = ({ data, selected }) => (
  <div className={`node-card rounded-[28px] p-6 w-[280px] border-l-[8px] transition-all duration-300 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeftColor: "#ff5a1f" }}>
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#ff5a1f]/10 text-[#ff5a1f]">
        <span className="material-symbols-outlined text-2xl font-black">api</span>
      </div>
      <div>
        <span className="text-[10px] font-black text-[#ff5a1f] uppercase tracking-[0.2em] leading-none mb-1 block">External Trigger</span>
        <span className="text-sm font-black text-slate-900">{data.label || 'API Gateway'}</span>
      </div>
    </div>
    <div className="space-y-3">
      <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 font-mono text-[10px] text-slate-500 truncate">
        {data.method} {data.endpoint}
      </div>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${data.integrationActive ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
        <span className="material-symbols-outlined text-[14px]">{data.integrationActive ? 'verified' : 'info'}</span>
        <span className="text-[9px] font-black uppercase tracking-wider">{data.integrationActive ? 'Active Integration' : 'Inactive'}</span>
      </div>
    </div>
    <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-[#ff5a1f] !border-4 !border-white" />
  </div>
);

const JourneyNode: React.FC<NodeProps> = ({ data, selected }) => {
  const journey = engine.getJourneys().find(j => j.id === data.journeyId);
  return (
    <div className={`node-card rounded-[28px] p-6 w-[260px] border-l-[8px] transition-all duration-300 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeftColor: "#4f39f6" }}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#4f39f6] !border-4 !border-white !-left-1.5" />
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#4f39f6]/10 text-[#4f39f6]">
          <span className="material-symbols-outlined text-2xl">rocket_launch</span>
        </div>
        <div>
          <span className="text-[10px] font-black text-[#4f39f6] uppercase tracking-[0.2em] leading-none mb-1 block">Flow Starter</span>
          <span className="text-sm font-black text-slate-900">{data.label}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-4 text-center">
        <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100"><span className="text-[9px] font-black text-slate-400 uppercase block">Steps</span><span className="text-sm font-black text-slate-800">{journey?.steps || '--'}</span></div>
        <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100"><span className="text-[9px] font-black text-slate-400 uppercase block">SLA</span><span className="text-sm font-black text-slate-800">{journey?.estimatedDays || '--'}d</span></div>
      </div>
      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-[#4f39f6] !border-4 !border-white !-right-1.5" />
    </div>
  );
};

const DecisionNode: React.FC<NodeProps> = ({ data, selected }) => {
  const cases = data.cases || {};
  const caseKeys = Object.keys(cases);
  const height = Math.max(180, caseKeys.length * 48 + 140);
  return (
    <div style={{ height }} className="relative w-[300px] transition-all duration-300">
      <div className={`node-card absolute inset-0 rounded-[36px] flex flex-col pt-7 pb-4 pl-8 pr-12 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeft: '8px solid #8b5cf6' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-[#8b5cf6]"><span className="material-symbols-outlined text-xl">call_split</span></div>
          <div><span className="text-[10px] font-black text-purple-700 uppercase tracking-[0.2em] leading-none mb-1 block">Decision</span><span className="text-sm font-black text-slate-900">{data.label}</span></div>
        </div>
        <div className="text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 self-start mb-6 w-full truncate">Var: <span className="text-[#8b5cf6] font-mono">{data.switchField}</span></div>
        <div className="flex-1 space-y-4">
          {caseKeys.map(tag => (
            <div key={tag} className="flex items-center justify-end h-[32px]"><div className="bg-white border-2 border-slate-100 px-3 py-1 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-tighter shadow-sm w-full truncate">{cases[tag]}</div></div>
          ))}
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-purple-500 !border-4 !border-white !-left-1.5" />
      <div className="absolute right-[-6px] top-[168px] bottom-0 flex flex-col gap-[36px] items-center">
        {caseKeys.map((tag) => <Handle key={tag} type="source" position={Position.Right} id={tag} style={{ position: 'relative', top: 'auto', right: '0' }} className="!w-3 !h-3 !bg-purple-500 !border-4 !border-white" />)}
      </div>
    </div>
  );
};

const TagManagerNode: React.FC<NodeProps> = ({ data, selected }) => (
  <div className={`node-card rounded-[28px] p-6 w-[240px] border-l-[8px] transition-all duration-300 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeftColor: "#10b981" }}>
    <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-emerald-500 !border-4 !border-white !-left-1.5" />
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-100 text-emerald-600"><span className="material-symbols-outlined text-2xl font-black">sell</span></div>
      <div><span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none mb-1 block">Context Bridge</span><span className="text-sm font-black text-slate-900">Tag Manager</span></div>
    </div>
    <div className="space-y-2">
      {data.addTag && <div className="bg-emerald-50/80 px-4 py-3 rounded-2xl border border-emerald-100 flex items-center justify-between"><span className="text-[10px] font-black text-emerald-700 uppercase">Add</span><span className="text-[10px] font-black font-mono text-emerald-900">{data.addTag}</span></div>}
      {data.removeTag && <div className="bg-rose-50/80 px-4 py-3 rounded-2xl border border-rose-100 flex items-center justify-between"><span className="text-[10px] font-black text-rose-700 uppercase">Remove</span><span className="text-[10px] font-black font-mono text-rose-900">{data.removeTag}</span></div>}
    </div>
    <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-emerald-500 !border-4 !border-white !-right-1.5" />
  </div>
);

const DelayNode: React.FC<NodeProps> = ({ data, selected }) => (
  <div className={`node-card rounded-[28px] p-6 w-[220px] border-l-[8px] transition-all duration-300 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeftColor: "#f59e0b" }}>
    <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-amber-500 !border-4 !border-white !-left-1.5" />
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-100 text-amber-600"><span className="material-symbols-outlined text-2xl font-black">schedule</span></div>
      <div>
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] leading-none mb-1 block">Time Hub</span>
        <span className="text-sm font-black text-slate-900">Wait Delay</span>
      </div>
    </div>
    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex flex-col items-center">
      <span className="text-2xl font-black text-amber-700 tracking-tighter">{data.delayValue || 0}</span>
      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{data.delayUnit || 'days'}</span>
    </div>
    <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-amber-500 !border-4 !border-white !-right-1.5" />
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  journey: JourneyNode,
  decision: DecisionNode,
  setTag: TagManagerNode,
  delay: DelayNode,
};

// --- App Component ---

const AppContent: React.FC<{
  orchestrator: Orchestrator;
  onBack: () => void;
  onSave: (o: Orchestrator) => void;
  onPublish: (o: Orchestrator) => void;
  onTrigger: (o: Orchestrator) => void;
}> = ({ orchestrator, onBack, onSave, onPublish, onTrigger }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(orchestrator.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(orchestrator.edges);
  const { screenToFlowPosition } = useReactFlow();
  const idCounter = useRef(500);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    onSave({ ...orchestrator, nodes, edges });
  }, [nodes, edges]);

  const addNode = (type: string, data: any) => {
    const id = `node-${idCounter.current++}`;
    // Calculate center of the screen in flow coordinates
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    setNodes(nds => nds.concat({ id, type, position, data }));
    setSelectedNodeId(id);
  };

  const onConnect = useCallback((params: Connection) => {
    setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: "#4f39f6", strokeWidth: 3 } }, eds));
  }, [setEdges]);

  const handleUpdateNode = (id: string, patch: any) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n));
  };

  // Helper to update body params
  const updateBodyParam = (nodeId: string, index: number, field: string, value: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.data.bodyParams) return;
    const newParams = [...node.data.bodyParams];
    newParams[index] = { ...newParams[index], [field]: value };
    handleUpdateNode(nodeId, { bodyParams: newParams });
  };

  const addBodyParam = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    const newParams = [...(node.data.bodyParams || []), { key: '', value: '', type: 'property' }];
    handleUpdateNode(nodeId, { bodyParams: newParams });
  };

  const removeBodyParam = (nodeId: string, index: number) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || !node.data.bodyParams) return;
    const newParams = node.data.bodyParams.filter((_: any, i: number) => i !== index);
    handleUpdateNode(nodeId, { bodyParams: newParams });
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      <header className="h-20 flex items-center justify-between px-8 shrink-0 z-30 mx-6 mt-6 rounded-[24px] bg-white border border-slate-200 shadow-premium">
        <div className="flex items-center gap-8">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm"><span className="material-symbols-outlined">arrow_back</span></button>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#4f39f6] rounded-xl flex items-center justify-center text-white shadow-lg"><span className="material-symbols-outlined font-black">hub</span></div>
            <div>
              <div className="flex items-baseline gap-2"><h1 className="font-black text-xl tracking-tighter text-slate-900 leading-tight">{orchestrator.name}</h1><span className="text-[10px] font-black text-[#4f39f6] bg-[#4f39f6]/5 px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#4f39f6]/10">Node Orchestrator</span></div>
              <div className="flex items-center gap-2 mt-0.5"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest"><span className="text-emerald-500">HEARTBEAT OK</span> • NODE EXECUTION INTEGRITY 98%</span></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {orchestrator.status === 'published' && (
            <>
              <button onClick={() => onTrigger(orchestrator)} className="flex items-center gap-3 px-6 py-3.5 text-[10px] font-black text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-2xl border border-emerald-100 transition-all font-mono uppercase">
                Trigger Flow
              </button>
              <button onClick={() => setShowMonitor(true)} className="flex items-center gap-3 px-6 py-3.5 text-[10px] font-black text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl border border-rose-100 transition-all font-mono uppercase">
                Node Exec Log
              </button>
            </>
          )}
          {orchestrator.status !== 'published' && (
            <button onClick={() => onPublish(orchestrator)} className="px-8 py-3.5 text-[10px] font-black rounded-2xl transition-all shadow-xl bg-[#4f39f6] text-white">
              <span className="tracking-widest uppercase">PUBLISH ENGINE</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden p-6 gap-6 relative">
        <aside className="w-[320px] flex flex-col shrink-0 z-20 rounded-[32px] border border-slate-200 bg-white shadow-premium p-7">
          <h2 className="font-black text-[11px] text-slate-400 tracking-[0.25em] mb-8 uppercase flex items-center gap-2"><span className="material-symbols-outlined text-sm">construction</span>Node Factory</h2>
          <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar">
            {[
              { type: 'trigger', label: 'External Trigger', icon: 'api', color: 'text-[#ff5a1f]', data: { label: 'API Gateway', method: 'POST', endpoint: 'api.hubapi.com/crm/v3/objects/tickets', integrationActive: true } },
              { type: 'journey', label: 'Flow Starter', icon: 'rocket_launch', color: 'text-[#4f39f6]', data: { label: 'Strategic Flow', journeyId: '' } },
              { type: 'decision', label: 'Decision Logic', icon: 'call_split', color: 'text-purple-600', data: { label: 'Segment Hub', switchField: 'context.tag', cases: { "val": "Target" } } },
              { type: 'setTag', label: 'Tag Manager', icon: 'sell', color: 'text-emerald-600', data: { label: 'Context Bridge', addTag: 'success', removeTag: '' } },
              { type: 'delay', label: 'Wait Delay', icon: 'schedule', color: 'text-amber-500', data: { label: 'Time Hub', delayValue: 1, delayUnit: 'days' } }
            ].map((n, i) => (
              <button key={i} onClick={() => addNode(n.type, n.data)} className="w-full text-left p-4 bg-slate-50 hover:bg-white hover:shadow-xl hover:translate-y-[-2px] border border-slate-100 rounded-[24px] flex items-center gap-5 transition-all group">
                <div className={`w-12 h-12 rounded-2xl bg-white border border-slate-100 ${n.color} flex items-center justify-center group-hover:scale-110 shadow-sm transition-all`}><span className="material-symbols-outlined text-xl font-black">{n.icon}</span></div>
                <div><span className="text-[13px] font-black text-slate-800 block">{n.label}</span><span className="text-[9px] text-slate-400 font-bold uppercase">Insert Node</span></div>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1 relative bg-canvas-gradient rounded-[48px] border border-slate-200 shadow-premium overflow-hidden">
          <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} onNodeClick={(_, node) => setSelectedNodeId(node.id)} onPaneClick={() => setSelectedNodeId(null)} fitView className="absolute inset-0">
            <Background color="#cbd5e1" gap={32} size={1} />
            <Controls className="react-flow__controls" />
            <MiniMap className="react-flow__minimap" maskColor="rgba(241, 245, 249, 0.4)" />
          </ReactFlow>

          {selectedNode && (
            <div className="absolute right-8 top-8 bottom-8 w-[420px] bg-white rounded-[40px] shadow-2xl border border-slate-200 z-30 flex flex-col p-8 animate-fade-in animate-slide-in">
              <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
                <div><h2 className="font-black text-slate-900 text-xs tracking-widest uppercase">Node Properties</h2><p className="text-[10px] text-slate-400 mt-1">Ref: {selectedNode.id}</p></div>
                <button onClick={() => setSelectedNodeId(null)} className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all shadow-sm"><span className="material-symbols-outlined">close</span></button>
              </div>

              <div className="flex-1 overflow-y-auto py-8 space-y-8 no-scrollbar">
                <div className="group"><label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Label</label><input className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6]" value={selectedNode.data.label} onChange={e => handleUpdateNode(selectedNode.id, { label: e.target.value })} /></div>

                {selectedNode.type === 'trigger' && (
                  <div className="space-y-6">
                    <div className="group"><label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Method *</label><select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6]" value={selectedNode.data.method} onChange={e => handleUpdateNode(selectedNode.id, { method: e.target.value })}><option value="POST">POST</option><option value="GET">GET</option><option value="PUT">PUT</option><option value="PATCH">PATCH</option></select></div>

                    <div className="group"><label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Endpoint URL *</label><div className="flex items-center gap-2"><span className="text-xs font-bold text-slate-400">https://</span><input className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-mono font-bold text-[#4f39f6] outline-none focus:border-[#4f39f6]" value={selectedNode.data.endpoint?.replace('https://', '')} onChange={e => handleUpdateNode(selectedNode.id, { endpoint: 'https://' + e.target.value })} placeholder="api.hubapi.com/..." /></div></div>

                    <div className="group"><label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Auth Type *</label><select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6]" value={selectedNode.data.authType} onChange={e => handleUpdateNode(selectedNode.id, { authType: e.target.value })}><option value="API Key">API Key</option><option value="Bearer Token">Bearer Token</option><option value="OAuth2">OAuth2</option><option value="None">None</option></select></div>

                    {selectedNode.data.authType === 'API Key' && (
                      <div className="p-5 bg-[#4f39f6]/5 rounded-3xl border border-[#4f39f6]/10">
                        <label className="block text-[10px] font-black text-[#4f39f6] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">API Secret * <span className="material-symbols-outlined text-xs">lock</span></label>
                        <select className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"><option>hubspot_api_key</option><option>greenhouse_secret</option></select>
                      </div>
                    )}

                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest">Payload Mapping</label>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase ${selectedNode.data.integrationActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                          {selectedNode.data.integrationActive ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {selectedNode.data.bodyParams?.map((p: any, i: number) => (
                          <div key={i} className="flex gap-3">
                            <input className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-700" value={p.key} onChange={e => updateBodyParam(selectedNode.id, i, 'key', e.target.value)} placeholder="Key" />
                            <div className="flex-1 flex gap-2">
                              <select className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500" value={p.value} onChange={e => updateBodyParam(selectedNode.id, i, 'value', e.target.value)}><option value="Subject">Subject</option><option value="Pipeline">Pipeline</option><option value="CollaboratorName">Collaborator Name</option></select>
                              <button onClick={() => removeBodyParam(selectedNode.id, i)} className="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><span className="material-symbols-outlined text-lg">delete</span></button>
                            </div>
                          </div>
                        ))}
                        <button onClick={() => addBodyParam(selectedNode.id)} className="flex items-center gap-2 text-[10px] font-black text-[#4f39f6] uppercase tracking-widest hover:translate-x-1 transition-transform"><span className="material-symbols-outlined text-sm">add</span> Add Property</button>
                      </div>
                    </div>
                  </div>
                )}

                {selectedNode.type === 'setTag' && (
                  <div className="space-y-6">
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                      <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Add Project Tag</label>
                      <input className="w-full px-5 py-4 bg-white border border-emerald-200 rounded-2xl text-sm font-bold text-slate-800" value={selectedNode.data.addTag} onChange={e => handleUpdateNode(selectedNode.id, { addTag: e.target.value })} placeholder="Ex: finished-onboarding" />
                    </div>
                    <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                      <label className="block text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4">Remove Project Tag</label>
                      <input className="w-full px-5 py-4 bg-white border border-rose-200 rounded-2xl text-sm font-bold text-slate-800" value={selectedNode.data.removeTag} onChange={e => handleUpdateNode(selectedNode.id, { removeTag: e.target.value })} placeholder="Ex: in-progress" />
                    </div>
                  </div>
                )}

                {selectedNode.type === 'delay' && (
                  <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">Time Interval</label>
                      <input type="number" className="w-full px-5 py-4 bg-white border border-amber-200 rounded-2xl text-lg font-black text-amber-700" value={selectedNode.data.delayValue} onChange={e => handleUpdateNode(selectedNode.id, { delayValue: parseInt(e.target.value) })} />
                    </div>
                    <div className="flex gap-2">
                      {['days', 'hours'].map(u => (
                        <button key={u} onClick={() => handleUpdateNode(selectedNode.id, { delayUnit: u })} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedNode.data.delayUnit === u ? 'bg-amber-600 text-white border-amber-600 shadow-lg' : 'bg-white text-amber-600 border-amber-200'}`}>{u}</button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedNode.type === 'journey' && (<div><label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Node Flow Ref</label><select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none" value={selectedNode.data.journeyId} onChange={e => handleUpdateNode(selectedNode.id, { journeyId: e.target.value })}><option value="">Select...</option>{engine.getJourneys().map(j => <option key={j.id} value={j.id}>{j.name}</option>)}</select></div>)}

                {selectedNode.type === 'decision' && (
                  <div className="space-y-4">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">Logic Path Configuration</label>
                    {Object.entries(selectedNode.data.cases || {}).map(([val, label]: any) => (
                      <div key={val} className="flex gap-2"><input className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold font-mono text-purple-600" value={label} onChange={e => { const nc = { ...selectedNode.data.cases }; nc[val] = e.target.value; handleUpdateNode(selectedNode.id, { cases: nc }); }} /><button onClick={() => { const nc = { ...selectedNode.data.cases }; delete nc[val]; handleUpdateNode(selectedNode.id, { cases: nc }); }} className="w-10 h-10 text-rose-400 hover:bg-rose-50 rounded-lg"><span className="material-symbols-outlined">delete</span></button></div>
                    ))}
                    <button className="w-full py-4 bg-purple-50 text-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-purple-100 transition-all" onClick={() => { const val = `val_${Date.now()}`; const nc = { ...selectedNode.data.cases, [val]: "New Branch" }; handleUpdateNode(selectedNode.id, { cases: nc }); }}>Add Logic Branch</button>
                  </div>
                )}
              </div>
              <button onClick={() => { setNodes(nds => nds.filter(n => n.id !== selectedNodeId)); setSelectedNodeId(null); }} className="w-full py-5 text-rose-500 text-[10px] font-black uppercase border-2 border-slate-100 rounded-3xl hover:bg-rose-50 transition-all">Destroy Node</button>
            </div>
          )}
        </main>
        {showMonitor && <MonitorView orchestrator={orchestrator} onClose={() => setShowMonitor(false)} />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'editor'>('dashboard');
  const [orchestrators, setOrchestrators] = useState<Orchestrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentOrchestrator, setCurrentOrchestrator] = useState<Orchestrator | null>(null);
  const [monitorOrchestrator, setMonitorOrchestrator] = useState<Orchestrator | null>(null);

  const loadOrchestrators = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listOrchestrators();
      setOrchestrators(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrchestrators();
  }, [loadOrchestrators]);

  const handleEdit = async (o: Orchestrator) => {
    const loaded = await getOrchestrator(o.id);
    setCurrentOrchestrator(loaded);
    setView('editor');
  };

  const handleSave = async (updated: Orchestrator) => {
    const saved = await saveOrchestrator(updated);
    setOrchestrators(prev => prev.map(o => o.id === saved.id ? saved : o));
    if (currentOrchestrator?.id === saved.id) {
      setCurrentOrchestrator(saved);
    }
  };

  const handleCreate = async () => {
    const created = await createOrchestrator();
    await loadOrchestrators();
    setCurrentOrchestrator(created);
    setView('editor');
  };

  const handlePublish = async (o: Orchestrator) => {
    await publishOrchestrator(o.id);
    await loadOrchestrators();
    const refreshed = await getOrchestrator(o.id);
    setCurrentOrchestrator(refreshed);
  };

  const handleTrigger = async (o: Orchestrator) => {
    await triggerOrchestrator(o.id);
    setMonitorOrchestrator(o);
  };

  return (
    <ReactFlowProvider>
      {view === 'dashboard' ? (
        <DashboardView orchestrators={orchestrators} onEdit={handleEdit} onCreate={handleCreate} onRename={(id, name) => setOrchestrators(prev => prev.map(o => o.id === id ? { ...o, name } : o))} onViewExecution={o => setMonitorOrchestrator(o)} />
      ) : (
        currentOrchestrator && (
          <AppContent
            orchestrator={currentOrchestrator}
            onBack={() => setView('dashboard')}
            onSave={handleSave}
            onPublish={handlePublish}
            onTrigger={handleTrigger}
          />
        )
      )}
      {monitorOrchestrator && <MonitorView orchestrator={monitorOrchestrator} onClose={() => setMonitorOrchestrator(null)} />}
      {loading && (
        <div className="fixed bottom-6 right-6 bg-white border border-slate-200 shadow-xl rounded-2xl px-6 py-3 text-xs font-bold text-slate-500">
          Carregando orquestradores...
        </div>
      )}
    </ReactFlowProvider>
  );
};

export default App;
