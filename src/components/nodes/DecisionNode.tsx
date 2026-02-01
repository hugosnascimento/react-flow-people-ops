import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const DecisionNode: React.FC<NodeProps> = ({ data, selected }) => {
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
