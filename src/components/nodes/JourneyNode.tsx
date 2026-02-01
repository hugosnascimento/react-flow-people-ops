import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import engine from '../../services/EvaEngine';

export const JourneyNode: React.FC<NodeProps> = ({ data, selected }) => {
    const journey = engine.getJourneys().find(j => j.id === data.journeyId);
    return (
        <div className={`node-card rounded-[28px] p-6 w-[260px] border-l-[8px] transition-all duration-300 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeftColor: "#4f39f6" }}>
            <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#4f39f6] !border-4 !border-white !-left-1.5" />
            <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#4f39f6]/10 text-[#4f39f6]">
                    <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                </div>
                <div>
                    <span className="text-[10px] font-black text-[#4f39f6] uppercase tracking-[0.2em] leading-none mb-1 block">Flow Starter</span>
                    <span className="text-sm font-black text-slate-900">{data.label}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100"><span className="text-[9px] font-black text-slate-400 uppercase block">Steps</span><span className="text-sm font-black text-slate-800">{journey?.steps || '--'}</span></div>
                <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100"><span className="text-[9px] font-black text-slate-400 uppercase block">SLA</span><span className="text-sm font-black text-slate-800">{journey?.estimatedDays || '--'}d</span></div>
            </div>
            <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-[#4f39f6] !border-4 !border-white !-right-1.5" />
        </div>
    );
};
