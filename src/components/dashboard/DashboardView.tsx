import React, { useState } from 'react';
import { Orchestrator } from '../../types';

interface DashboardProps {
    orchestrators: Orchestrator[];
    onEdit: (o: Orchestrator) => void;
    onCreate: () => void;
    onRename: (id: string, newName: string) => void;
    onViewExecution: (o: Orchestrator) => void;
}

import { SupabaseService } from '../../services/SupabaseService';
import { useAuth } from '../../context/AuthContext';

export const DashboardView: React.FC<DashboardProps> = ({ orchestrators, onEdit, onCreate, onRename, onViewExecution }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tempName, setTempName] = useState("");
    const { user } = useAuth();

    const startRename = (o: Orchestrator) => {
        setEditingId(o.id);
        setTempName(o.name);
    };

    const saveRename = (id: string) => {
        onRename(id, tempName);
        setEditingId(null);
    };

    const handleSeed = async () => {
        if (!confirm("Isso irá resetar e criar os fluxos de exemplo no banco de dados. Confirmar?")) return;

        const flows = [
            {
                id: 'o-onboarding-v2',
                name: 'Onboarding VIP & IT Setup',
                description: 'Automated provisioning flow for VIP hires with manual IT verification steps.',
                status: 'published',
                executionHealth: 98,
                errorCount: 0,
                nodes: [
                    { "id": "start", "type": "trigger", "position": { "x": 50, "y": 300 }, "data": { "label": "ATS: Offer Signed", "method": "POST", "endpoint": "https://api.eva.com/hooks/offer-signed", "integrationActive": true } },
                    { "id": "create_user", "type": "registerEmployee", "position": { "x": 400, "y": 300 }, "data": { "label": "Create Eva Profile", "system": "Eva People" } },
                    { "id": "prov_google", "type": "systemUpdate", "position": { "x": 750, "y": 300 }, "data": { "label": "Provison G-Workspace", "system": "Google Workspace", "action": "create_account", "payload": "{ \"license\": \"enterprise\", \"org_unit\": \"/engineering\" }" } },
                    { "id": "wait_kit", "type": "delay", "position": { "x": 1100, "y": 300 }, "data": { "label": "Wait for Shipping", "delayValue": 2, "delayUnit": "days" } },
                    { "id": "verify_it", "type": "humanInTheLoop", "position": { "x": 1450, "y": 300 }, "data": { "label": "Verify IT Kit Delivery", "assignee": "IT Logistics", "description": "Confirm that the MacBook Pro and peripherals have been delivered to the candidate.", "timeout": 24 } },
                    { "id": "notify_done", "type": "systemUpdate", "position": { "x": 1850, "y": 150 }, "data": { "label": "Welcome Email", "system": "Slack", "action": "send_message", "payload": "{ \"channel\": \"#general\", \"text\": \"Welcome to the team!\" }" } },
                    { "id": "notify_fail", "type": "systemUpdate", "position": { "x": 1850, "y": 450 }, "data": { "label": "Escalate Delivery", "system": "Jira", "action": "create_ticket", "payload": "{ \"priority\": \"High\", \"summary\": \"Delivery Failed\" }" } }
                ],
                edges: [
                    { "id": "e1", "source": "start", "target": "create_user", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                    { "id": "e2", "source": "create_user", "target": "prov_google", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                    { "id": "e3", "source": "prov_google", "sourceHandle": "success", "target": "wait_kit", "animated": true, "label": "Success", "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
                    { "id": "e4", "source": "wait_kit", "target": "verify_it", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                    { "id": "e5", "source": "verify_it", "sourceHandle": "approved", "target": "notify_done", "animated": true, "label": "Delivered", "style": { "stroke": "#10b981", "strokeWidth": 3 } },
                    { "id": "e6", "source": "verify_it", "sourceHandle": "rejected", "target": "notify_fail", "animated": true, "label": "Missing", "style": { "stroke": "#f43f5e", "strokeWidth": 3 } }
                ]
            },
            {
                id: 'o-perf-cycle',
                name: 'Quarterly Performance Cycle',
                description: 'Manages the end-to-end performance review process including calibration.',
                status: 'published',
                executionHealth: 100,
                errorCount: 0,
                nodes: [
                    { "id": "trig_q1", "type": "trigger", "position": { "x": 50, "y": 250 }, "data": { "label": "Sched: Q1 Cycle", "method": "CRON", "endpoint": "0 9 1 * *", "integrationActive": false } },
                    { "id": "gen_forms", "type": "systemUpdate", "position": { "x": 400, "y": 250 }, "data": { "label": "Generate Reviews", "system": "Eva Performance", "action": "bulk_create_reviews", "payload": "{ \"cycle\": \"Q1_2026\", \"template\": \"standard_eng\" }" } },
                    { "id": "mgr_review", "type": "humanInTheLoop", "position": { "x": 750, "y": 250 }, "data": { "label": "Manager Assessment", "assignee": "Direct Manager", "description": "Complete the skills assessment and leadership potential index.", "timeout": 72 } },
                    { "id": "calib_check", "type": "conditional", "position": { "x": 1150, "y": 250 }, "data": { "label": "Rating Tier?", "switchField": "final_score", "rules": [{ "id": "r1", "label": "High Perf (>4.5)", "field": "score", "operator": "gt", "value": "4.5" }, { "id": "r2", "label": "Low Perf (<2.0)", "field": "score", "operator": "lt", "value": "2.0" }] } },
                    { "id": "calc_bonus", "type": "systemUpdate", "position": { "x": 1550, "y": 100 }, "data": { "label": "Calculate Spot Bonus", "system": "Workday Finance", "action": "issue_payment", "payload": "{ \"percentage\": 0.10 }" } },
                    { "id": "perf_plan", "type": "humanInTheLoop", "position": { "x": 1550, "y": 400 }, "data": { "label": "Create PIP Plan", "assignee": "HRBP", "description": "Draft a Performance Improvement Plan for the employee.", "timeout": 48 } }
                ],
                edges: [
                    { "id": "e1", "source": "trig_q1", "target": "gen_forms", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                    { "id": "e2", "source": "gen_forms", "sourceHandle": "success", "target": "mgr_review", "animated": true, "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
                    { "id": "e3", "source": "mgr_review", "sourceHandle": "approved", "target": "calib_check", "animated": true, "label": "Completed", "style": { "stroke": "#10b981", "strokeWidth": 3 } },
                    { "id": "e4", "source": "calib_check", "sourceHandle": "r1", "target": "calc_bonus", "animated": true, "label": "High Performer", "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                    { "id": "e5", "source": "calib_check", "sourceHandle": "r2", "target": "perf_plan", "animated": true, "label": "Needs Improv.", "style": { "stroke": "#4f39f6", "strokeWidth": 3 } }
                ]
            },
            {
                id: 'o-offboarding',
                name: 'Secure Offboarding Protocol',
                description: 'Ensures immediate access revocation and asset recovery upon termination.',
                status: 'draft',
                executionHealth: 100,
                errorCount: 0,
                nodes: [
                    { "id": "term_event", "type": "trigger", "position": { "x": 50, "y": 300 }, "data": { "label": "HRIS: Termination", "method": "POST", "endpoint": "/hooks/term", "integrationActive": true } },
                    { "id": "revoke_okta", "type": "systemUpdate", "position": { "x": 400, "y": 300 }, "data": { "label": "Revoke SSO Access", "system": "Okta", "action": "deactivate_user", "payload": "{ \"immediate\": true }" } },
                    { "id": "wipe_device", "type": "systemUpdate", "position": { "x": 750, "y": 300 }, "data": { "label": "Wipe Corporate Mobile", "system": "Jamf MDM", "action": "remote_wipe", "payload": "{ \"device_type\": \"all\" }" } },
                    { "id": "asset_col", "type": "humanInTheLoop", "position": { "x": 1100, "y": 300 }, "data": { "label": "Collect Physical Assets", "assignee": "Office Manager", "description": "Retrieve Laptop (Tag #232), Badge, and Monitor.", "timeout": 24 } },
                    { "id": "pay_calc", "type": "humanInTheLoop", "position": { "x": 1450, "y": 300 }, "data": { "label": "Final Severance Calc", "assignee": "Payroll Specialist", "description": "Calculate pro-rated vacation and severance package.", "timeout": 48 } },
                    { "id": "archive_emp", "type": "systemUpdate", "position": { "x": 1800, "y": 300 }, "data": { "label": "Archive Employee Record", "system": "Eva People", "action": "archive_profile", "payload": "{ \"reason\": \"termination\" }" } }
                ],
                edges: [
                    { "id": "e1", "source": "term_event", "target": "revoke_okta", "animated": true, "style": { "stroke": "#4f39f6", "strokeWidth": 3 } },
                    { "id": "e2", "source": "revoke_okta", "sourceHandle": "success", "target": "wipe_device", "animated": true, "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
                    { "id": "e3", "source": "wipe_device", "sourceHandle": "success", "target": "asset_col", "animated": true, "style": { "stroke": "#0ea5e9", "strokeWidth": 3 } },
                    { "id": "e4", "source": "asset_col", "sourceHandle": "approved", "target": "pay_calc", "animated": true, "label": "Collected", "style": { "stroke": "#10b981", "strokeWidth": 3 } },
                    { "id": "e5", "source": "pay_calc", "sourceHandle": "approved", "target": "archive_emp", "animated": true, "label": "Calculated", "style": { "stroke": "#10b981", "strokeWidth": 3 } }
                ]
            }
        ];

        try {
            // Upsert all defined flows
            for (const flow of flows) {
                // @ts-ignore
                await SupabaseService.createOrchestrator(flow, user?.id || 'anon');
            }
            alert("Database Seeded Successfully! Refreshing...");
            window.location.reload();
        } catch (e) {
            console.error(e);
            alert("Error seeding database");
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-12 bg-[#f8fafc]">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#4f39f6]/10 flex items-center justify-center text-[#4f39f6]">
                                <span className="material-symbols-outlined text-lg">account_tree</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4f39f6]">Control Tower</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">People Ops Orchestration</h1>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSeed}
                            className="bg-white text-slate-500 border border-slate-200 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-[#4f39f6] hover:text-[#4f39f6] transition-all flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-lg">database</span>
                            Seed DB
                        </button>
                        <button
                            onClick={onCreate}
                            className="bg-[#4f39f6] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            New Orchestrator
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-200 shadow-premium overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">People Ops Orchestrators</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Execution Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Node Health</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Latest Log</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orchestrators.map(o => (
                                <tr key={o.id} className="group hover:bg-slate-50/30 transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4f39f6]/10 group-hover:text-[#4f39f6] transition-all">
                                                <span className="material-symbols-outlined">hub</span>
                                            </div>
                                            {editingId === o.id ? (
                                                <input
                                                    autoFocus
                                                    className="text-base font-black text-slate-900 bg-transparent border-b-2 border-[#4f39f6] outline-none py-1"
                                                    value={tempName}
                                                    onChange={(e) => setTempName(e.target.value)}
                                                    onBlur={() => saveRename(o.id)}
                                                    onKeyDown={(e) => e.key === 'Enter' && saveRename(o.id)}
                                                />
                                            ) : (
                                                <div className="text-base font-black text-slate-900 flex items-center gap-2">
                                                    {o.name}
                                                    <button onClick={() => startRename(o)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-[#4f39f6]">
                                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className={`mx-auto w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${o.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                                            {o.status === 'published' ? 'Listening' : 'Draft'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center font-mono font-black">
                                        <div className="flex items-center justify-center gap-2">
                                            <span className={`text-[11px] ${o.errorCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{o.executionHealth}%</span>
                                            {o.errorCount > 0 && <span className="material-symbols-outlined text-rose-500 text-sm">report</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                                            {o.lastExecution || '--'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button onClick={() => onEdit(o)} className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#4f39f6] hover:border-[#4f39f6]/20 transition-all shadow-sm">Configure</button>
                                            <button onClick={() => onViewExecution(o)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-200 hover:text-[#4f39f6] transition-all">
                                                <span className="material-symbols-outlined text-lg">history</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orchestrators.length === 0 && (
                        <div className="p-20 text-center">
                            <div className="material-symbols-outlined text-5xl text-slate-200 mb-4">account_tree</div>
                            <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">No orchestrators configured</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
