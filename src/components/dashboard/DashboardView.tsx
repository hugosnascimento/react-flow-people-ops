import React, { useState } from 'react';
import { Orchestrator } from '../../types';

interface DashboardProps {
    orchestrators: Orchestrator[];
    onEdit: (o: Orchestrator) => void;
    onCreate: () => void;
    onRename: (id: string, newName: string) => void;
    onViewExecution: (o: Orchestrator) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ orchestrators, onEdit, onCreate, onRename, onViewExecution }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempName, setTempName] = useState("");

    const startRename = (o: Orchestrator) => {
        setEditingId(o.id);
        setTempName(o.name);
    };

    const saveRename = (id: string) => {
        onRename(id, tempName);
        setEditingId(null);
    };

    return (
        <div className="flex-1 overflow-y-auto p-12 bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#4f39f6]/10 flex items-center justify-center text-[#4f39f6]">
                                <span className="material-symbols-outlined text-lg">account_tree</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4f39f6]">Control Tower</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Orchestration Hub</h1>
                    </div>
                    <button
                        onClick={onCreate}
                        className="bg-[#4f39f6] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-3"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        New Orchestrator
                    </button>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-200 shadow-premium overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">People Ops Orchestrators</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Execution Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Node Health</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Latest Log</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orchestrators.map(o => (
                                <tr key={o.id} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4f39f6]/10 group-hover:text-[#4f39f6] transition-all">
                                                <span className="material-symbols-outlined">hub</span>
                                            </div>
                                            {editingId === o.id ? (
                                                <input
                                                    autoFocus
                                                    className="text-base font-black text-slate-900 bg-transparent border-b-2 border-[#4f39f6] outline-none py-1"
                                                    value={tempName}
                                                    onChange={(e) => setTempName(e.target.value)}
                                                    onBlur={() => saveRename(o.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && saveRename(o.id)}
                                                />
                                            ) : (
                                                <div className="text-base font-black text-slate-900 flex items-center gap-2">
                                                    {o.name}
                                                    <button onClick={() => startRename(o)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-[#4f39f6]">
                                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className={`mx-auto w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${o.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                            {o.status === 'published' ? 'Listening' : 'Draft'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center font-mono font-black">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={`text-[11px] ${o.errorCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{o.executionHealth}%</span>
                                            {o.errorCount > 0 && <span className="material-symbols-outlined text-rose-500 text-sm">report</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                                            {o.lastExecution || '--'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => onEdit(o)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#4f39f6] hover:border-[#4f39f6]/20 transition-all shadow-sm">Configure</button>
                                            <button onClick={() => onViewExecution(o)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-[#4f39f6] transition-all">
                                                <span className="material-symbols-outlined text-lg">history</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orchestrators.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="material-symbols-outlined text-5xl text-slate-200 mb-4">account_tree</div>
                            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">No orchestrators configured</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
