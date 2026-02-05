import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const CsvUploadNode: React.FC<NodeProps> = ({ data, selected }) => (
    <div className={`node-card rounded-[28px] p-6 w-[280px] border-l-[8px] transition-all duration-300 ${selected ? "selected shadow-premium" : "border-slate-100"}`} style={{ borderLeftColor: "#ec4899" }}>
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#ec4899] !border-4 !border-white" />
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#ec4899]/10 text-[#ec4899] border border-white shadow-sm">
                <span className="material-symbols-outlined text-2xl font-black">upload_file</span>
            </div>
            <div>
                <span className="text-[10px] font-black text-[#ec4899] uppercase tracking-[0.2em] leading-none mb-1 block">
                    Data Source
                </span>
                <span className="text-sm font-black text-slate-900">{data.label || 'CSV Upload'}</span>
            </div>
        </div>
        <div className="space-y-3">
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 font-mono text-[10px] text-slate-500 truncate flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px]">description</span>
                {data.templateId ? `Template: ${data.templateId}` : 'No Template'}
            </div>
        </div>
        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-[#ec4899] !border-4 !border-white" />
    </div>
);
