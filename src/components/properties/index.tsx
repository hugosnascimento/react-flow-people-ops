import React from 'react';

// --- Shared Components ---

// --- Advanced Configuration Component ---
export const AdvancedSettings: React.FC<{ data: any, onUpdate: (patch: any) => void }> = ({ data, onUpdate }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="mt-6 border-t border-slate-100 pt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-left group"
            >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                    Advanced Settings
                </span>
                <span className={`material-symbols-outlined text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    expand_more
                </span>
            </button>

            {isOpen && (
                <div className="mt-4 space-y-4 animate-fade-in pl-2 border-l-2 border-slate-100">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            Delay Execution
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="number"
                                min="0"
                                className="w-20 px-3 py-2 bg-white border border-amber-200 rounded-xl text-sm font-bold text-amber-700 outline-none text-center"
                                value={data.delayValue || 0}
                                onChange={e => onUpdate({ delayValue: parseInt(e.target.value) || 0 })}
                            />
                            <select
                                className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-700 outline-none"
                                value={data.delayUnit || 'minutes'}
                                onChange={e => onUpdate({ delayUnit: e.target.value })}
                            >
                                <option value="minutes">Minutes</option>
                                <option value="hours">Hours</option>
                                <option value="days">Days</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Notification Editor ---
interface NotificationPropsEditorProps {
    data: any;
    onUpdate: (patch: any) => void;
}

export const NotificationPropsEditor: React.FC<NotificationPropsEditorProps> = ({ data, onUpdate }) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                    Channel *
                </label>
                <select
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6]"
                    value={data.channel || 'email'}
                    onChange={e => onUpdate({ channel: e.target.value })}
                >
                    <option value="email">Email</option>
                    <option value="slack">Slack</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="teams">Microsoft Teams</option>
                </select>
            </div>

            <div>
                <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                    Recipients *
                </label>
                <input
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6]"
                    value={data.recipients || ''}
                    onChange={e => onUpdate({ recipients: e.target.value })}
                    placeholder="e.g. user@company.com, #channel-name"
                />
                <p className="text-[9px] text-slate-400 mt-2 text-right">Separate multiple recipients with commas</p>
            </div>

            <div>
                <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                    Message Template
                </label>
                <textarea
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-600 outline-none focus:border-[#4f39f6] min-h-[120px]"
                    value={data.message || ''}
                    onChange={e => onUpdate({ message: e.target.value })}
                    placeholder="Hello {{name}}, your process has been updated..."
                />
            </div>

            <AdvancedSettings data={data} onUpdate={onUpdate} />
        </div>
    );
};

// --- Journey Editor ---

interface JourneyPropsEditorProps {
    data: any;
    availableJourneys: any[];
    onUpdate: (patch: any) => void;
}

export const JourneyPropsEditor: React.FC<JourneyPropsEditorProps> = ({ data, availableJourneys, onUpdate }) => {
    const selectedJourney = availableJourneys.find(j => j.id === data.journeyId);

    return (
        <div>
            <div className="space-y-4">
                <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Selected Flow *
                    </label>
                    <select
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6]"
                        value={data.journeyId || ''}
                        onChange={e => onUpdate({ journeyId: e.target.value })}
                    >
                        <option value="">Select a flow...</option>
                        {availableJourneys.map(j => (
                            <option key={j.id} value={j.id}>{j.name}</option>
                        ))}
                    </select>
                </div>

                {selectedJourney && (
                    <div className="bg-[#4f39f6]/5 p-4 rounded-2xl border border-[#4f39f6]/10 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Steps</span>
                            <span className="text-xs font-black text-slate-700">{selectedJourney.steps} steps</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Est. Duration</span>
                            <span className="text-xs font-black text-slate-700">{selectedJourney.estimatedDays} days</span>
                        </div>
                    </div>
                )}
            </div>
            <AdvancedSettings data={data} onUpdate={onUpdate} />
        </div>
    );
};

// --- Decision Editor (Enhanced) ---

interface DecisionPropsEditorProps {
    data: any;
    onUpdate: (patch: any) => void;
}

export const DecisionPropsEditor: React.FC<DecisionPropsEditorProps> = ({ data, onUpdate }) => {
    // rules structure: [{ id: '1', label: 'Tech Team', field: 'department', operator: 'equals', value: 'Technology' }]
    const rules = data.rules || [];

    const addRule = () => {
        if (rules.length >= 10) return;
        const newRule = {
            id: `rule-${Date.now()}`,
            label: 'New Rule',
            field: 'department',
            operator: 'equals',
            value: ''
        };
        onUpdate({ rules: [...rules, newRule] });
    };

    const updateRule = (index: number, field: string, value: string) => {
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], [field]: value };
        onUpdate({ rules: newRules });
    };

    const removeRule = (index: number) => {
        const newRules = rules.filter((_: any, i: number) => i !== index);
        onUpdate({ rules: newRules });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Decision Rules ({rules.length}/10)
                    </label>
                    <button
                        onClick={addRule}
                        disabled={rules.length >= 10}
                        className="text-[10px] font-black text-purple-600 uppercase hover:underline disabled:opacity-50"
                    >
                        + Add Rule
                    </button>
                </div>

                {rules.map((rule: any, i: number) => (
                    <div key={rule.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 relative group transition-all hover:bg-white hover:shadow-md">
                        <div className="flex gap-2">
                            {/* Branch Name */}
                            <input
                                className="flex-1 bg-transparent text-xs font-black text-purple-700 placeholder-purple-300 outline-none border-b border-transparent focus:border-purple-200"
                                value={rule.label}
                                onChange={e => updateRule(i, 'label', e.target.value)}
                                placeholder="Branch Name (e.g. Tech)"
                            />
                            {/* Priority Indicator */}
                            <span className="text-[9px] font-mono text-slate-300 self-center">#{i + 1}</span>
                            <button onClick={() => removeRule(i)} className="text-rose-400 hover:text-rose-600 ml-2"><span className="material-symbols-outlined text-sm">delete</span></button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            {/* Field */}
                            <select
                                className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 outline-none"
                                value={rule.field}
                                onChange={e => updateRule(i, 'field', e.target.value)}
                            >
                                <option value="department">Department</option>
                                <option value="role">Role</option>
                                <option value="seniority">Seniority</option>
                                <option value="location">Location</option>
                                <option value="tenure">Tenure</option>
                            </select>
                            {/* Operator */}
                            <select
                                className="w-full px-2 py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 outline-none"
                                value={rule.operator}
                                onChange={e => updateRule(i, 'operator', e.target.value)}
                            >
                                <option value="equals">Equals</option>
                                <option value="not_equals">Does not equal</option>
                            </select>
                        </div>
                        {/* Comparison Value */}
                        <input
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-purple-400"
                            value={rule.value}
                            onChange={e => updateRule(i, 'value', e.target.value)}
                            placeholder="Value (e.g. Tech, Senior, BR)"
                        />
                    </div>
                ))}

                {rules.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs italic">
                        No rules configured.
                    </div>
                )}

                <AdvancedSettings data={data} onUpdate={onUpdate} />
            </div>
        </div>
    );
};
