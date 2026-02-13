import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const DecisionNode: React.FC<NodeProps> = ({ data, selected }) => {
    // Support new 'rules' structure or fallback to 'cases'
    const rules = data.rules || [];
    // Fallback for old structure if needed, or if rules is empty but cases has data (migration edge case)
    const fallbackCases = data.cases ? Object.keys(data.cases).map(k => ({ id: k, label: data.cases[k] })) : [];
    const activeBranches = rules.length > 0 ? rules : fallbackCases;

    // Always show strict Else branch as the default backup
    const showElseBranch = true;
    const totalBranches = activeBranches.length + 1;

    const height = Math.max(180, totalBranches * 52 + 140);

    return (
        <div style={{ height }} className="relative w-[300px] transition-all duration-300">
            <div className={`node-card absolute inset-0 rounded-[36px] flex flex-col pt-7 pb-4 pl-8 pr-12 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeft: '8px solid #8b5cf6' }}>
                {/* Main Input: Left */}
                <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-purple-500 !border-4 !border-white !-left-1.5" />

                {(data.delayValue > 0) && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-amber-100 border border-amber-200 rounded-full flex items-center gap-1 shadow-sm z-10">
                        <span className="material-symbols-outlined text-[10px] text-amber-600">schedule</span>
                        <span className="text-[9px] font-black text-amber-700 uppercase tracking-wide">Delay {data.delayValue} {data.delayUnit?.substr(0, 1) || 'm'}</span>
                    </div>
                )}

                {data.displayId && (
                    <div className="absolute -top-3 right-6 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 shadow-sm border-2 border-white">
                        {data.displayId}
                    </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-[#8b5cf6]"><span className="material-symbols-outlined text-xl">call_split</span></div>
                    <div>
                        <span className="text-[10px] font-black text-purple-700 uppercase tracking-[0.2em] leading-none mb-1 block">Regra de Ramo</span>
                        <span className="text-sm font-black text-slate-900">{data.label}</span>
                    </div>
                </div>

                <div className="flex-1 space-y-3 mt-4">
                    {activeBranches.map((branch: any, i: number) => (
                        <div key={branch.id} className="flex items-center justify-end h-[40px] relative group">
                            <div className="absolute left-0 text-[9px] font-bold text-slate-300 uppercase hidden group-hover:block transition-all">
                                {branch.field ? `${branch.field} ${branch.operator}` : `Rule ${i + 1}`}
                            </div>
                            <div className="bg-white border-2 border-slate-100 px-3 py-2 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-tighter shadow-sm w-full truncate flex items-center justify-between">
                                <span>{branch.label}</span>
                            </div>
                            <div className="absolute -right-[22px] w-6 h-6 bg-purple-500 border-2 border-white rounded-full flex items-center justify-center shadow-sm z-50 pointer-events-none">
                                <span className="text-[10px] text-white font-bold">{String.fromCharCode(65 + i)}</span>
                            </div>
                            {/* Branch Output: Right */}
                            <Handle
                                type="source"
                                position={Position.Right}
                                id={branch.id}
                                className="!w-6 !h-6 !bg-transparent !border-0 !-right-[22px] !z-50"
                            />
                        </div>
                    ))}

                    {showElseBranch && (
                        <div className="flex items-center justify-end h-[40px] relative group">
                            <div className="absolute left-0 text-[9px] font-bold text-slate-300 uppercase hidden group-hover:block transition-all">
                                Fallback
                            </div>
                            <div className="bg-slate-50 border-2 border-slate-100 px-3 py-2 rounded-xl text-[11px] font-black text-slate-400 uppercase tracking-tighter shadow-sm w-full truncate flex items-center justify-between">
                                <span>Default</span>
                            </div>
                            <div className="absolute -right-[22px] w-6 h-6 bg-slate-400 border-2 border-white rounded-full flex items-center justify-center shadow-sm z-50 pointer-events-none">
                                <span className="text-[10px] text-white font-bold">X</span>
                            </div>
                            {/* Fail/Else Output: Right (or potentially bottom? User asked for standard entry/exit. Conditional commonly has outputs on right/bottom. Keeping Right for branches is cleaner visually for trees) */}
                            <Handle
                                type="source"
                                position={Position.Right}
                                id="else-handle"
                                className="!w-6 !h-6 !bg-transparent !border-0 !-right-[22px] !z-50"
                            />
                        </div>
                    )}

                    {activeBranches.length === 0 && !showElseBranch && (
                        <div className="text-[10px] text-slate-400 italic">No rules configured. Flow will stop.</div>
                    )}
                </div>
            </div>
        </div>
    );
};
