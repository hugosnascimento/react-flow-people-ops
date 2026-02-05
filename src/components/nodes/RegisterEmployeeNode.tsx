import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const RegisterEmployeeNode: React.FC<NodeProps> = ({ data, selected }) => (
    <div className={`node-card rounded-[28px] p-6 w-[280px] border-l-[8px] transition-all duration-300 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeftColor: "#14b8a6" }}>
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#14b8a6] !border-4 !border-white" />
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#14b8a6]/10 text-[#14b8a6] border border-white shadow-sm">
                <span className="material-symbols-outlined text-2xl font-black">person_add</span>
            </div>
            <div>
                <span className="text-[10px] font-black text-[#14b8a6] uppercase tracking-[0.2em] leading-none mb-1 block">
                    Action
                </span>
                <span className="text-sm font-black text-slate-900">{data.label || 'Register Employee'}</span>
            </div>
        </div>
        <div className="space-y-3">
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-2 text-slate-500">
                <span className="material-symbols-outlined text-[14px]">dns</span>
                <span className="text-[10px] font-bold uppercase">{data.system || 'Eva Platform'}</span>
            </div>
        </div>
        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-[#14b8a6] !border-4 !border-white" />
    </div>
);
