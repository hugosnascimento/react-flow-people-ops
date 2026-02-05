import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const TagManagerNode: React.FC<NodeProps> = ({ data, selected }) => (
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
