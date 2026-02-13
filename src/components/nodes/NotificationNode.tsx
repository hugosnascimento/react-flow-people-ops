import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const NotificationNode = ({ data, selected }: { data: any, selected: boolean }) => {
    return (
        <div className={`w-[280px] bg-white rounded-[24px] border-2 transition-all duration-300 shadow-sm group ${selected ? 'border-[#4f39f6] shadow-xl scale-105' : 'border-slate-100 hover:border-slate-300'}`}>
            {/* Input Handle */}
            <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-300 group-hover:!bg-[#4f39f6] transition-colors" />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 shadow-sm group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-xl">notifications_active</span>
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-sky-500 bg-sky-50 px-2 py-1 rounded-full uppercase tracking-widest">
                            Notification
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                    <h3 className="font-black text-slate-800 text-lg leading-tight">
                        {data.label || 'Send Notification'}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className="material-symbols-outlined text-sm">
                            {data.channel === 'slack' ? 'tag' : data.channel === 'whatsapp' ? 'chat' : 'mail'}
                        </span>
                        <span>{data.channel || 'Email'}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="truncate max-w-[100px]">{data.recipients || 'No setup'}</span>
                    </div>
                </div>
            </div>

            {/* Display ID Badge */}
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white text-[10px] font-black border-2 border-white shadow-md z-10">
                {data.displayId || '?'}
            </div>

            {/* Helper text for fallback role */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">Fallback / Error Handler</span>
            </div>

            {/* Output Handle */}
            <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-300 group-hover:!bg-[#4f39f6] transition-colors" />
        </div>
    );
};

export default memo(NotificationNode);
