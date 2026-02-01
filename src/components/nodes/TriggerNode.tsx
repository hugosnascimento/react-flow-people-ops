import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const TriggerNode: React.FC<NodeProps> = ({ data, selected }) => (
    <div className={`node-card rounded-[28px] p-6 w-[280px] border-l-[8px] transition-all duration-300 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeftColor: "#ff5a1f" }}>
        <div className="flex items-center gap-4 mb-4">
            <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white shadow-sm transition-colors ${!data.integrationActive ? 'bg-[#ff5a1f]/10 text-[#ff5a1f]' : ''}`}
                style={{ backgroundColor: data.integrationActive ? (data.integrationColor || '#ff5a1f') : undefined }}
            >
                {data.integrationActive && data.integrationInitials ? (
                    <span className="text-xl font-black text-white tracking-widest">{data.integrationInitials}</span>
                ) : (
                    <span className="material-symbols-outlined text-2xl font-black">api</span>
                )}
            </div>
            <div>
                <span className="text-[10px] font-black text-[#ff5a1f] uppercase tracking-[0.2em] leading-none mb-1 block">
                    {data.integrationName || 'External Trigger'}
                </span>
                <span className="text-sm font-black text-slate-900">{data.label || 'API Gateway'}</span>
            </div>
        </div>
        <div className="space-y-3">
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 font-mono text-[10px] text-slate-500 truncate">
                {data.method} {data.endpoint}
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${data.integrationActive ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                <span className="material-symbols-outlined text-[14px]">{data.integrationActive ? 'verified' : 'info'}</span>
                <span className="text-[9px] font-black uppercase tracking-wider">{data.integrationActive ? 'Integration Active' : 'No Integration'}</span>
            </div>
        </div>
        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-[#ff5a1f] !border-4 !border-white" />
    </div>
);
