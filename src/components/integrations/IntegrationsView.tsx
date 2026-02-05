import React, { useState } from 'react';
import { Integration } from '../../types';
import { Button, IconButton } from '../ui';
import { IntegrationModal } from './IntegrationModal';

interface IntegrationsViewProps {
    integrations: Integration[];
    onSave: (integration: Integration) => void;
    onBack: () => void;
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({ integrations, onSave, onBack }) => {
    const [showModal, setShowModal] = useState(false);
    const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);

    const handleEdit = (integration: Integration) => {
        setEditingIntegration(integration);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingIntegration(null);
        setShowModal(true);
    };

    return (
        <div className="flex-1 flex flex-col bg-[#f8fafc] h-full overflow-hidden">
            {/* Header */}
            <header className="h-24 px-10 flex items-center justify-between bg-white border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-6">
                    <IconButton icon="arrow_back" onClick={onBack} label="Back to Dashboard" />
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Integrations Hub</h1>
                        <p className="text-sm font-bold text-slate-400 mt-1">Manage external tool connections</p>
                    </div>
                </div>
                <Button variant="primary" size="md" onClick={handleCreate}>
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined">add_link</span>
                        New Integration
                    </span>
                </Button>
            </header>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {integrations.map(integration => (
                        <div
                            key={integration.id}
                            className={`relative flex flex-col p-8 rounded-[32px] border transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl ${integration.status === 'active'
                                ? 'bg-white border-slate-100 shadow-premium'
                                : 'bg-slate-50 border-slate-200'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div
                                    className="w-16 h-16 rounded-2xl p-3 shadow-md border-4 border-white flex items-center justify-center text-xl font-black text-white"
                                    style={{ backgroundColor: integration.color }}
                                >
                                    {integration.initials}
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${integration.status === 'active'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        : 'bg-slate-100 text-slate-400 border-slate-200'
                                    }`}>
                                    {integration.status}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-lg font-black text-slate-900 mb-2">{integration.name}</h3>
                                <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-[90%] line-clamp-2">
                                    {integration.description || `Integration with ${integration.name}`}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">category</span>
                                    {integration.type}
                                </span>

                                <button
                                    onClick={() => handleEdit(integration)}
                                    className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${integration.status === 'active'
                                        ? 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                                        : 'bg-[#4f39f6] text-white hover:bg-[#4338ca] shadow-lg'
                                        }`}
                                >
                                    {integration.status === 'active' ? 'Configure' : 'Connect'}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Placeholder */}
                    <button
                        onClick={handleCreate}
                        className="flex flex-col items-center justify-center p-8 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-[#4f39f6] hover:bg-[#4f39f6]/5 transition-all group min-h-[320px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-slate-300 group-hover:text-[#4f39f6]">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <span className="text-sm font-black text-slate-400 group-hover:text-[#4f39f6] uppercase tracking-widest">
                            Add Custom Integration
                        </span>
                    </button>
                </div>
            </div>

            <IntegrationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={(data) => {
                    onSave(data);
                    setShowModal(false);
                }}
                initialData={editingIntegration}
            />
        </div>
    );
};
