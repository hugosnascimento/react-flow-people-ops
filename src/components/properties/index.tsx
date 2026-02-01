import React from 'react';

interface JourneyPropsEditorProps {
    data: any;
    availableJourneys: any[];
    onUpdate: (patch: any) => void;
}

export const JourneyPropsEditor: React.FC<JourneyPropsEditorProps> = ({ data, availableJourneys, onUpdate }) => (
    <div>
        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Journey ID *
        </label>
        <select
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6]"
            value={data.journeyId || ''}
            onChange={e => onUpdate({ journeyId: e.target.value })}
        >
            <option value="">Select Journey...</option>
            {availableJourneys.map(j => (
                <option key={j.id} value={j.id}>{j.name}</option>
            ))}
        </select>
        <p className="text-[10px] text-slate-400 mt-2">
            This will trigger the selected journey flow for matched collaborators
        </p>
    </div>
);

interface TagPropsEditorProps {
    data: any;
    onUpdate: (patch: any) => void;
}

export const TagPropsEditor: React.FC<TagPropsEditorProps> = ({ data, onUpdate }) => (
    <div className="space-y-6">
        <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
            <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">
                Add Tag
            </label>
            <input
                className="w-full px-5 py-4 bg-white border border-emerald-200 rounded-2xl text-sm font-bold text-slate-800"
                value={data.addTag || ''}
                onChange={e => onUpdate({ addTag: e.target.value })}
                placeholder="e.g., onboarded, tech-team"
            />
        </div>
        <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
            <label className="block text-[10px] font-black text-rose-600 uppercase tracking-widest mb-4">
                Remove Tag
            </label>
            <input
                className="w-full px-5 py-4 bg-white border border-rose-200 rounded-2xl text-sm font-bold text-slate-800"
                value={data.removeTag || ''}
                onChange={e => onUpdate({ removeTag: e.target.value })}
                placeholder="e.g., new-hire, in-progress"
            />
        </div>
    </div>
);

interface DelayPropsEditorProps {
    data: any;
    onUpdate: (patch: any) => void;
}

export const DelayPropsEditor: React.FC<DelayPropsEditorProps> = ({ data, onUpdate }) => (
    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-6">
        <div>
            <label className="block text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">
                Time Interval *
            </label>
            <input
                type="number"
                min="1"
                className="w-full px-5 py-4 bg-white border border-amber-200 rounded-2xl text-lg font-black text-amber-700"
                value={data.delayValue || 1}
                onChange={e => onUpdate({ delayValue: parseInt(e.target.value) || 1 })}
            />
        </div>
        <div className="flex gap-2">
            {['hours', 'days', 'weeks'].map(u => (
                <button
                    key={u}
                    onClick={() => onUpdate({ delayUnit: u })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${data.delayUnit === u
                            ? 'bg-amber-600 text-white border-amber-600 shadow-lg'
                            : 'bg-white text-amber-600 border-amber-200'
                        }`}
                >
                    {u}
                </button>
            ))}
        </div>
    </div>
);

interface DecisionPropsEditorProps {
    data: any;
    onUpdate: (patch: any) => void;
}

export const DecisionPropsEditor: React.FC<DecisionPropsEditorProps> = ({ data, onUpdate }) => {
    const cases = data.cases || {};

    const updateCase = (oldVal: string, newLabel: string) => {
        const nc = { ...cases };
        nc[oldVal] = newLabel;
        onUpdate({ cases: nc });
    };

    const removeCase = (val: string) => {
        const nc = { ...cases };
        delete nc[val];
        onUpdate({ cases: nc });
    };

    const addCase = () => {
        const val = `val_${Date.now()}`;
        const nc = { ...cases, [val]: "New Branch" };
        onUpdate({ cases: nc });
    };

    return (
        <div className="space-y-4">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Decision Branches
            </label>
            {Object.entries(cases).map(([val, label]: [string, any]) => (
                <div key={val} className="flex gap-2">
                    <input
                        className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-bold font-mono text-purple-600"
                        value={label}
                        onChange={e => updateCase(val, e.target.value)}
                        placeholder="Branch label"
                    />
                    <button
                        onClick={() => removeCase(val)}
                        className="w-10 h-10 text-rose-400 hover:bg-rose-50 rounded-lg"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div>
            ))}
            <button
                className="w-full py-4 bg-purple-50 text-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-purple-100 transition-all hover:bg-purple-100"
                onClick={addCase}
            >
                + Add Branch
            </button>
        </div>
    );
};
