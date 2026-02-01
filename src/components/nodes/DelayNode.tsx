import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const DelayNode: React.FC<NodeProps> = ({ data, selected }) => (
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
