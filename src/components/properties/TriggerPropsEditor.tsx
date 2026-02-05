import React from 'react';
import { Input, Select } from '../ui';
import { Integration } from '../../types';

interface TriggerPropsEditorProps {
    data: any;
    onUpdate: (patch: any) => void;
    integrations?: Integration[]; // Optional to avoid breaking if not passed yet
}

export const TriggerPropsEditor: React.FC<TriggerPropsEditorProps> = ({ data, onUpdate, integrations = [] }) => {
    const updateBodyParam = (index: number, field: string, value: string) => {
        const newParams = [...(data.bodyParams || [])];
        newParams[index] = { ...newParams[index], [field]: value };
        onUpdate({ bodyParams: newParams });
    };

    const addBodyParam = () => {
        const newParams = [...(data.bodyParams || []), { key: '', value: '', type: 'property' }];
        onUpdate({ bodyParams: newParams });
    };

    const removeBodyParam = (index: number) => {
        const newParams = (data.bodyParams || []).filter((_: any, i: number) => i !== index);
        onUpdate({ bodyParams: newParams });
    };

    const activeIntegrations = integrations.filter(i => i.status === 'active');
    const selectedIntegration = integrations.find(i => i.id === data.integrationId);

    return (
        <div className="space-y-6">
            {!data.integrationActive ? (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <p className="text-xs text-slate-500 mb-4">Select an active integration to verify triggers.</p>
                    <button
                        onClick={() => onUpdate({ integrationActive: true })}
                        className="w-full py-3 bg-[#4f39f6] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#4338ca]"
                    >
                        Enable Integration
                    </button>
                </div>
            ) : (
                <>
                    <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                            Integration Source *
                        </label>
                        <div className="relative">
                            <select
                                className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6] appearance-none"
                                value={data.integrationId || ''}
                                onChange={e => {
                                    const integ = integrations.find(i => i.id === e.target.value);
                                    onUpdate({
                                        integrationId: e.target.value,
                                        integrationName: integ?.name,
                                        integrationInitials: integ?.initials,
                                        integrationColor: integ?.color,
                                        endpoint: integ?.baseUrl || ''
                                    });
                                }}
                            >
                                <option value="">Select a provider...</option>
                                {activeIntegrations.map(integ => (
                                    <option key={integ.id} value={integ.id}>{integ.name}</option>
                                ))}
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                {selectedIntegration ? (
                                    <div
                                        className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white"
                                        style={{ backgroundColor: selectedIntegration.color }}
                                    >
                                        {selectedIntegration.initials}
                                    </div>
                                ) : (
                                    <span className="material-symbols-outlined text-slate-400 text-lg">extension</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <Select
                        label="Method *"
                        value={data.method || 'POST'}
                        onChange={e => onUpdate({ method: e.target.value })}
                        options={[
                            { value: 'POST', label: 'POST (Webhook)' },
                            { value: 'GET', label: 'GET (Polling)' },
                        ]}
                    />

                    <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                            Event / Endpoint Path *
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-4 rounded-l-2xl border border-r-0 border-slate-200">
                                {selectedIntegration?.baseUrl || '/webhook/'}
                            </span>
                            <input
                                className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-r-2xl text-[11px] font-mono font-bold text-[#4f39f6] outline-none focus:border-[#4f39f6] border-l-0"
                                value={data.endpoint?.replace('https://', '') || ''}
                                onChange={e => onUpdate({ endpoint: e.target.value })}
                                placeholder="candidate/hired"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest">
                                Mapped Fields
                            </label>
                        </div>

                        <div className="space-y-3">
                            {(data.bodyParams || []).map((p: any, i: number) => (
                                <div key={i} className="flex gap-2">
                                    <input
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-700"
                                        value={p.key}
                                        onChange={e => updateBodyParam(i, 'key', e.target.value)}
                                        placeholder="Source Field"
                                    />
                                    <span className="flex items-center text-slate-300">→</span>
                                    <input
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500"
                                        value={p.value}
                                        onChange={e => updateBodyParam(i, 'value', e.target.value)}
                                        placeholder="Var Name"
                                    />
                                    <button
                                        onClick={() => removeBodyParam(i)}
                                        className="w-10 h-10 flex items-center justify-center text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addBodyParam}
                                className="flex items-center gap-2 text-[10px] font-black text-[#4f39f6] uppercase tracking-widest hover:translate-x-1 transition-transform"
                            >
                                <span className="material-symbols-outlined text-sm">add</span> Map New Field
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
