import React, { useState, useEffect } from 'react';
import { Integration } from '../../types';
import { Modal, Input, Button, Select } from '../ui';

interface IntegrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (integration: Integration) => void;
    initialData?: Integration | null;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<Partial<Integration>>({
        name: '',
        type: 'Other',
        initials: 'CU',
        color: '#6366F1',
        description: '',
        baseUrl: 'https://api.example.com/v1/',
        authType: 'API Key',
        status: 'active'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                type: 'Other',
                initials: 'CU',
                color: '#6366F1',
                description: '',
                baseUrl: 'https://api.example.com/v1/',
                authType: 'API Key',
                status: 'active'
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData as Integration,
            id: initialData?.id || `custom-${Date.now()}`
        });
        onClose();
    };

    const colors = [
        '#4f39f6', '#2563EB', '#059669', '#DB2777', '#7C3AED',
        '#EA580C', '#DC2626', '#0891B2', '#475569', '#000000'
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? `Configure ${initialData.name}` : 'New Integration'}
        >
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex gap-4 items-start">
                    <div
                        className="w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg transition-colors border-4 border-white ring-1 ring-slate-100"
                        style={{ backgroundColor: formData.color }}
                    >
                        {formData.initials}
                    </div>
                    <div className="flex-1 space-y-4">
                        <Input
                            label="Integration Name"
                            value={formData.name}
                            onChange={e => setFormData({
                                ...formData,
                                name: e.target.value,
                                initials: e.target.value.substring(0, 2).toUpperCase()
                            })}
                            placeholder="e.g. Jira, Slack, Salesforce"
                            required
                        />
                        <div className="flex gap-3">
                            <div className="w-24">
                                <Input
                                    label="Initials"
                                    value={formData.initials}
                                    onChange={e => setFormData({ ...formData, initials: e.target.value.substring(0, 2).toUpperCase() })}
                                    placeholder="XY"
                                    maxLength={2}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-700 mb-1.5 ml-1">Badge Color</label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, color: c })}
                                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === c ? 'border-white ring-2 ring-slate-400 scale-110' : 'border-transparent'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Select
                    label="Category"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    options={[
                        { value: 'ATS', label: 'ATS (Recruitment)' },
                        { value: 'HCM', label: 'HCM (HR Core)' },
                        { value: 'LMS', label: 'LMS (Learning)' },
                        { value: 'Communication', label: 'Communication' },
                        { value: 'Engagement', label: 'Engagement' },
                        { value: 'Other', label: 'Other/Custom' },
                    ]}
                />

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">settings_ethernet</span>
                        Connection Settings
                    </h4>

                    <Input
                        label="Base API URL"
                        value={formData.baseUrl}
                        onChange={e => setFormData({ ...formData, baseUrl: e.target.value })}
                        placeholder="https://api.service.com/v1"
                    />

                    <Select
                        label="Auth Method"
                        value={formData.authType}
                        onChange={e => setFormData({ ...formData, authType: e.target.value })}
                        options={[
                            { value: 'API Key', label: 'API Key / Bearer Token' },
                            { value: 'OAuth2', label: 'OAuth 2.0' },
                            { value: 'Basic', label: 'Basic Auth' },
                            { value: 'None', label: 'No Auth (Public)' },
                        ]}
                    />

                    <Input
                        label={formData.authType === 'OAuth2' ? 'Client ID' : 'API Secret / Token'}
                        type="password"
                        placeholder="••••••••••••••••"
                        disabled={formData.authType === 'None'}
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary">
                        {initialData ? 'Save Changes' : 'Install Integration'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
