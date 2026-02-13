import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const HumanInTheLoopNode: React.FC<NodeProps> = ({ data, selected }) => (
    <div className={`node-card rounded-[28px] p-6 w-[280px] border-l-[8px] transition-all duration-300 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeftColor: "#ec4899" }}>
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-pink-500 !border-4 !border-white !-left-1.5" />
        {data.displayId && (
            <div className="absolute -top-3 right-6 bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full z-10 shadow-sm border-2 border-white">
                {data.displayId}
            </div>
        )}

        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-pink-100 text-pink-600">
                <span className="material-symbols-outlined text-2xl font-black">assignment_ind</span>
            </div>
            <div>
                <span className="text-[10px] font-black text-pink-600 uppercase tracking-[0.2em] leading-none mb-1 block">
                    Approval
                </span>
                <span className="text-sm font-black text-slate-900">{data.label || 'Human Task'}</span>
            </div>
        </div>

        <div className="space-y-3">
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-2 text-slate-500">
                <span className="material-symbols-outlined text-[14px]">person</span>
                <span className="text-[10px] font-bold uppercase truncate">{data.assignee || 'Unassigned'}</span>
            </div>
            {data.timeout && (
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 flex items-center gap-2 text-slate-500">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span className="text-[10px] font-bold uppercase">{data.timeout}h Timeout</span>
                </div>
            )}
        </div>

        {/* Dynamic Handles for Approval Flow */}
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex flex-col gap-8">
            <div className="relative group">
                <Handle
                    id="approved"
                    type="source"
                    position={Position.Right}
                    className="!w-3 !h-3 !bg-emerald-500 !border-4 !border-white !relative !right-0 transition-transform hover:scale-125"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Approved
                </span>
            </div>
            <div className="relative group">
                <Handle
                    id="rejected"
                    type="source"
                    position={Position.Right}
                    className="!w-3 !h-3 !bg-rose-500 !border-4 !border-white !relative !right-0 transition-transform hover:scale-125"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Rejected
                </span>
            </div>
        </div>
    </div>
);
