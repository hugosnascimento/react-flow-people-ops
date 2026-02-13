import React, { useState, useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import { Button, IconButton, Select, Input } from '../ui';
import { Orchestrator } from '../../types';

// Mock Interfaces as per PRD
interface ExecutionSnapshot {
    execution_id: string;
    snapshot_index: number;
    created_at: string;
    nodes_state_json: Node[]; // Full state of nodes at snapshot time
    edges_state_json?: Edge[]; // Optional edges state
    event_message: string;
    event_status: 'success' | 'warning' | 'error' | 'running' | 'pending';
}

interface ExecutionEvent {
    id: string;
    node_id: string;
    node_status: 'success' | 'warning' | 'error' | 'running' | 'pending';
    timestamp: string;
    message: string;
}

interface Execution {
    id: string;
    collaborator_id: string;
    collaborator_name: string;
    orchestrator_id: string;
    status: 'completed' | 'failed' | 'running';
    started_at: string;
    ended_at?: string;
    version: string;
    snapshots: ExecutionSnapshot[];
    events: ExecutionEvent[];
}

interface ExecutionSnapshotsViewProps {
    orchestrator: Orchestrator;
    onClose: () => void;
}

// Mock Data
const MOCK_EXECUTIONS: Execution[] = [
    {
        id: 'exec-alpha-001',
        collaborator_id: 'col-123',
        collaborator_name: 'Ana Souza',
        orchestrator_id: 'orch-001',
        status: 'completed',
        started_at: '2023-10-25T10:00:00Z',
        ended_at: '2023-10-25T10:05:00Z',
        version: 'v1.2',
        events: [],
        snapshots: [
            {
                execution_id: 'exec-alpha-001',
                snapshot_index: 0,
                created_at: '2023-10-25T10:00:00Z',
                event_message: 'Flow Started',
                event_status: 'running',
                nodes_state_json: [] // Will be populated dynamically based on logic for demo
            },
            {
                execution_id: 'exec-alpha-001',
                snapshot_index: 1,
                created_at: '2023-10-25T10:02:00Z',
                event_message: 'Manager Approval',
                event_status: 'success',
                nodes_state_json: []
            }
        ]
    },
    {
        id: 'exec-beta-002',
        collaborator_id: 'col-456',
        collaborator_name: 'Carlos Oliveira',
        orchestrator_id: 'orch-001',
        status: 'failed',
        started_at: '2023-10-26T14:30:00Z',
        ended_at: '2023-10-26T14:32:00Z',
        version: 'v1.3',
        events: [],
        snapshots: []
    }
];

export const ExecutionSnapshotsView: React.FC<ExecutionSnapshotsViewProps> = ({ orchestrator, onClose }) => {
    const [view, setView] = useState<'list' | 'viewer'>('list');
    const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);
    const [selectedSnapshotIndex, setSelectedSnapshotIndex] = useState<number>(0);
    const [filterCollaborator, setFilterCollaborator] = useState('');

    // Filter Logic
    const filteredExecutions = useMemo(() => {
        return MOCK_EXECUTIONS.filter(ex =>
            ex.orchestrator_id === orchestrator.id || true // For demo, show all if orchestrator matches or just show mocks
        ).filter(ex =>
            ex.collaborator_name.toLowerCase().includes(filterCollaborator.toLowerCase())
        );
    }, [orchestrator.id, filterCollaborator]);

    // Snapshot Viewer Logic
    const currentSnapshot = useMemo(() => {
        if (!selectedExecution || !selectedExecution.snapshots.length) return null;
        return selectedExecution.snapshots[selectedSnapshotIndex];
    }, [selectedExecution, selectedSnapshotIndex]);

    const handleOpenExecution = (execution: Execution) => {
        setSelectedExecution(execution);
        // Ensure snapshots have some nodes for demo purposes if empty
        if (execution.snapshots.length > 0 && execution.snapshots[0].nodes_state_json.length === 0) {
            // Clone current orchestration nodes as base for demo
            const baseNodes = orchestrator.nodes || [];
            execution.snapshots.forEach((snap, idx) => {
                snap.nodes_state_json = baseNodes.map(n => ({
                    ...n,
                    style: {
                        ...n.style,
                        borderColor: idx > 0 ? (snap.event_status === 'success' ? '#22c55e' : snap.event_status === 'error' ? '#ef4444' : '#3b82f6') : '#cbd5e1',
                        borderWidth: idx > 0 ? 4 : 1
                    }
                }));
            });
        }
        setSelectedSnapshotIndex(execution.snapshots.length - 1); // Open latest
        setView('viewer');
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center animate-fade-in p-8">
            <div className="bg-white w-full h-full rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative">

                {/* Header */}
                <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                            <span className="material-symbols-outlined font-black">history_edu</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Execution Snapshots</h2>
                            <p className="text-xs text-slate-500 font-medium">Investigação Operacional por Colaborador</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {view === 'viewer' && (
                            <Button variant="secondary" onClick={() => setView('list')} className="flex items-center gap-2">
                                <span className="material-symbols-outlined">arrow_back</span>
                                Voltar para Lista
                            </Button>
                        )}
                        <IconButton icon="close" onClick={onClose} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden relative">

                    {/* VIEW: LIST */}
                    {view === 'list' && (
                        <div className="h-full flex flex-col p-8 max-w-5xl mx-auto w-full">
                            {/* Filters */}
                            <div className="flex gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <div className="flex-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Buscar Colaborador</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">search</span>
                                        <input
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-colors"
                                            placeholder="Nome do colaborador..."
                                            value={filterCollaborator}
                                            onChange={e => setFilterCollaborator(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="w-48">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Status</label>
                                    <Select
                                        options={[
                                            { value: 'all', label: 'Todos' },
                                            { value: 'completed', label: 'Completed' },
                                            { value: 'failed', label: 'Failed' },
                                            { value: 'running', label: 'Running' }
                                        ]}
                                        value="all"
                                        onChange={() => { }}
                                        className="!py-2 !text-sm"
                                    />
                                </div>
                                <div className="w-48">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Período</label>
                                    <Select
                                        options={[
                                            { value: '7d', label: 'Últimos 7 dias' },
                                            { value: '30d', label: 'Últimos 30 dias' }
                                        ]}
                                        value="7d"
                                        onChange={() => { }}
                                        className="!py-2 !text-sm"
                                    />
                                </div>
                            </div>

                            {/* List */}
                            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                                {filteredExecutions.length === 0 ? (
                                    <div className="text-center py-20 text-slate-400">
                                        <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                                        <p>Nenhuma execução encontrada para os filtros aplicados.</p>
                                    </div>
                                ) : (
                                    filteredExecutions.map(exec => (
                                        <div
                                            key={exec.id}
                                            className="group bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer flex items-center justify-between"
                                            onClick={() => handleOpenExecution(exec)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${exec.status === 'failed' ? 'bg-rose-500' : exec.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                                    {exec.collaborator_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                                                        {exec.collaborator_name}
                                                        <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-2 rounded-full">{exec.id}</span>
                                                    </h3>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                            {new Date(exec.started_at).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                            {new Date(exec.started_at).toLocaleTimeString()}
                                                        </span>
                                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                                                            {exec.version}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${exec.status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                                                        exec.status === 'failed' ? 'bg-rose-100 text-rose-600' :
                                                            'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {exec.status}
                                                </div>
                                                <span className="material-symbols-outlined text-slate-300 group-hover:translate-x-1 transition-transform">chevron_right</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* VIEW: SNAPSHOT VIEWER */}
                    {view === 'viewer' && selectedExecution && (
                        <div className="h-full flex flex-col">
                            {/* Toolbar */}
                            <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
                                <div className="flex items-center gap-4">
                                    <div className="text-xs">
                                        <span className="text-slate-400 font-bold uppercase mr-2">Colaborador</span>
                                        <span className="font-black text-slate-900">{selectedExecution.collaborator_name}</span>
                                    </div>
                                    <div className="h-4 w-px bg-slate-200"></div>
                                    <div className="text-xs">
                                        <span className="text-slate-400 font-bold uppercase mr-2">Versão</span>
                                        <span className="font-black text-slate-900">{selectedExecution.version}</span>
                                    </div>
                                    <div className="h-4 w-px bg-slate-200"></div>
                                    <div className="text-xs">
                                        <span className="text-slate-400 font-bold uppercase mr-2">Snapshot</span>
                                        <span className="font-black text-indigo-600">
                                            {selectedSnapshotIndex + 1} / {selectedExecution.snapshots.length}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={selectedSnapshotIndex <= 0}
                                        onClick={() => setSelectedSnapshotIndex(prev => prev - 1)}
                                        className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>

                                    {/* Timeline Scrubber */}
                                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                        {selectedExecution.snapshots.map((snap, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedSnapshotIndex(idx)}
                                                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${idx === selectedSnapshotIndex ? 'bg-indigo-600 scale-125' :
                                                        idx < selectedSnapshotIndex ? 'bg-indigo-300' : 'bg-slate-300'
                                                    }`}
                                                title={`${snap.event_message} - ${new Date(snap.created_at).toLocaleTimeString()}`}
                                            />
                                        ))}
                                    </div>

                                    <button
                                        disabled={selectedSnapshotIndex >= selectedExecution.snapshots.length - 1}
                                        onClick={() => setSelectedSnapshotIndex(prev => prev + 1)}
                                        className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                            </div>

                            {/* Canvas Area */}
                            <div className="flex-1 relative bg-slate-50">
                                {currentSnapshot ? (
                                    <ReactFlow
                                        nodes={currentSnapshot.nodes_state_json}
                                        edges={orchestrator.edges} // Assuming edges structure is constant for V1
                                        fitView
                                        nodesDraggable={false}
                                        nodesConnectable={false}
                                        className="pointer-events-none" // Optional: disable all interaction if truly read-only, or just selection
                                    >
                                        <Background color="#cbd5e1" gap={32} size={1} />
                                        <Controls showInteractive={false} />

                                        {/* Overlay Info for current snapshot */}
                                        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur border border-slate-200 p-4 rounded-xl shadow-lg max-w-sm pointer-events-auto">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`w-2 h-2 rounded-full ${currentSnapshot.event_status === 'success' ? 'bg-emerald-500' :
                                                        currentSnapshot.event_status === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                                                    }`} />
                                                <span className="text-xs font-bold uppercase text-slate-500">
                                                    {new Date(currentSnapshot.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <h3 className="font-black text-slate-900 text-sm mb-1">
                                                {currentSnapshot.event_message}
                                            </h3>
                                            <p className="text-xs text-slate-600 leading-relaxed">
                                                Snapshot captured at step execution. Node state reflects data at this specific timestamp.
                                            </p>
                                        </div>
                                    </ReactFlow>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 font-bold">
                                        No snapshot data available.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
