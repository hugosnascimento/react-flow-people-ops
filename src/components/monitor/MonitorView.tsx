import React, { useState, useEffect } from 'react';
import { Orchestrator, NodeExecutionEvent } from '../../types';
import { listExecutions, listExecutionEvents } from '../../services/orchestratorApi';

interface MonitorProps {
    orchestrator: Orchestrator;
    onClose: () => void;
}

export const MonitorView: React.FC<MonitorProps> = ({ orchestrator, onClose }) => {
    const [events, setEvents] = useState<NodeExecutionEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadEvents = async () => {
            try {
                const { executions } = await listExecutions(orchestrator.id);
                const latestExecution = executions[0];
                if (!latestExecution) {
                    if (isMounted) {
                        setEvents([]);
                    }
                    return;
                }

                const { events: apiEvents } = await listExecutionEvents(latestExecution.id);
                const mapped = apiEvents.map((event) => ({
                    id: event.id,
                    nodeId: event.id,
                    nodeLabel: event.payload_json?.nodeLabel ?? event.type,
                    timestamp: new Date(event.created_at).toLocaleTimeString(),
                    status: event.payload_json?.status ?? 'success',
                    message: event.payload_json?.message ?? event.type,
                    latency: event.payload_json?.latency
                }));

                if (isMounted) {
                    setEvents(mapped);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadEvents();

        return () => {
            isMounted = false;
        };
    }, [orchestrator.id]);

    const getStatusStyle = (status: NodeExecutionEvent['status']) => {
        switch (status) {
            case 'success': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'error': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-400 border-slate-100';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col border border-white/20">
                <div className="p-10 border-b border-slate-100 bg-slate-50/10 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-slate-900 rounded-[22px] flex items-center justify-center text-white shadow-xl">
                            <span className="material-symbols-outlined text-2xl font-black">terminal</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Node Execution Analytics</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Execution Integrity: {orchestrator.name}</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                        <span className="material-symbols-outlined font-black">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-white z-10">
                            <tr className="border-b border-slate-100">
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Target</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Result</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Execution Message</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {events.map(e => (
                                <tr key={e.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-10 py-6">
                                        <span className="text-[11px] font-mono text-slate-400 font-bold">{e.timestamp}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{e.nodeLabel}</span>
                                            <span className="text-[9px] font-mono text-slate-300">ID: {e.nodeId}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(e.status)}`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {e.status}
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className={`text-[11px] font-bold max-w-md truncate ${e.status === 'error' ? 'text-rose-600' : 'text-slate-500'}`}>{e.message}</span>
                                            <span className="text-[9px] font-mono text-slate-300 mt-1">Latency: {e.latency}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && events.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-10 py-10 text-center text-sm text-slate-400 font-semibold">
                                        Nenhum evento registrado para este orquestrador.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-12">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Handoff Success Rate</span>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-black text-emerald-500 tabular-nums">98.2%</span>
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[98%]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-slate-200"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Errors</span>
                            <span className="text-2xl font-black text-rose-500">1 Critical</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                        Close Execution Tower
                    </button>
                </div>
            </div>
        </div>
    );
};
