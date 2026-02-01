import React, { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import { Orchestrator, Integration } from "./types";
import { DashboardView } from "./components/dashboard/DashboardView";
import { MonitorView } from "./components/monitor/MonitorView";
import { FlowEditor } from "./components/FlowEditor";
import { IntegrationsView } from "./components/integrations/IntegrationsView";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginView } from "./components/auth/LoginView";
import { ProfileModal } from "./components/user/ProfileModal";
import { Modal, Button } from "./components/ui";

import "reactflow/dist/style.css";

const InnerApp: React.FC = () => {
  const { user, checkLimit } = useAuth();
  const [view, setView] = useState<'dashboard' | 'editor' | 'integrations'>('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'gupy', name: 'Gupy', type: 'ATS', initials: 'GU', color: '#2563EB', status: 'active', description: 'Recruitment & Selection platform integration.', baseUrl: 'https://api.gupy.io/' },
    { id: 'eva', name: 'Eva', type: 'Communication', initials: 'EV', color: '#4f39f6', status: 'active', description: 'People Ops bot for automated engagement.', baseUrl: 'https://api.eva.bot/' },
    { id: 'lg', name: 'Lugar de Gente', type: 'HCM', initials: 'LG', color: '#059669', status: 'inactive', description: 'HCM suite for payroll and personnel.', baseUrl: 'https://api.lg.com.br/' },
    { id: 'feedz', name: 'Feedz', type: 'Engagement', initials: 'FE', color: '#DB2777', status: 'active', description: 'Employee engagement platform.', baseUrl: 'https://api.feedz.com.br/' },
    { id: 'qculture', name: 'Qulture.Rocks', type: 'LMS', initials: 'QR', color: '#7C3AED', status: 'active', description: 'Performance and LMS integration.', baseUrl: 'https://api.qulture.rocks/' }
  ]);

  const [orchestrators, setOrchestrators] = useState<Orchestrator[]>([
    {
      id: "o-onb-90",
      name: "Onboarding & Ramp-up Journey",
      description: "End-to-end integration flow from D-10 to D+90 days.",
      status: "published",
      executionHealth: 98,
      lastExecution: "01/02/2026 14:30",
      errorCount: 0,
      nodes: [
        { id: "trig", type: "trigger", position: { x: 0, y: 300 }, data: { label: "ATS: Hired Webhook", method: 'POST', endpoint: 'https://api.ats.com/hired', authType: 'API Key', integrationActive: true } },
        { id: "del1", type: "delay", position: { x: 300, y: 300 }, data: { label: "Wait: D-10", delayValue: 10, delayUnit: 'days' } },
        { id: "j1", type: "journey", position: { x: 600, y: 300 }, data: { label: "Pre-boarding Docs", journeyId: "jb-pre-1" } },
        { id: "dec1", type: "decision", position: { x: 900, y: 300 }, data: { label: "Dept Check", switchField: "department", cases: { "tech": "Tech Track", "biz": "Business Track" } } },

        // Tech Path
        { id: "j_tech", type: "journey", position: { x: 1200, y: 150 }, data: { label: "Tech Setup & Access", journeyId: "jb-tech-setup" } },
        { id: "tag_tech", type: "setTag", position: { x: 1500, y: 150 }, data: { label: "Tag: Engineering", addTag: "eng-team", removeTag: "" } },

        // Biz Path
        { id: "j_biz", type: "journey", position: { x: 1200, y: 450 }, data: { label: "Sales/Ops Setup", journeyId: "jb-biz-setup" } },

        // Convergence
        { id: "del2", type: "delay", position: { x: 1800, y: 300 }, data: { label: "Wait: Day 30", delayValue: 30, delayUnit: 'days' } },
        { id: "j2", type: "journey", position: { x: 2100, y: 300 }, data: { label: "30-Day Check-in", journeyId: "jb-30d-check" } },
        { id: "del3", type: "delay", position: { x: 2400, y: 300 }, data: { label: "Wait: Day 90", delayValue: 60, delayUnit: 'days' } },
        { id: "j3", type: "journey", position: { x: 2700, y: 300 }, data: { label: "Probation Review", journeyId: "jb-90d-review" } },
        { id: "tag_final", type: "setTag", position: { x: 3000, y: 300 }, data: { label: "Status: Active", addTag: "fully-ramped", removeTag: "probation" } },
      ],
      edges: [
        { id: "e1", source: "trig", target: "del1", animated: true },
        { id: "e2", source: "del1", target: "j1", animated: true },
        { id: "e3", source: "j1", target: "dec1", animated: true },
        { id: "e4", source: "dec1", target: "j_tech", animated: true, label: "Tech" },
        { id: "e5", source: "dec1", target: "j_biz", animated: true, label: "Business" },
        { id: "e6", source: "j_tech", target: "tag_tech", animated: true },
        { id: "e7", source: "tag_tech", target: "del2", animated: true },
        { id: "e8", source: "j_biz", target: "del2", animated: true },
        { id: "e9", source: "del2", target: "j2", animated: true },
        { id: "e10", source: "j2", target: "del3", animated: true },
        { id: "e11", source: "del3", target: "j3", animated: true },
        { id: "e12", source: "j3", target: "tag_final", animated: true },
      ]
    },
    {
      id: "o-attract-select",
      name: "Attraction & Selection Pipeline",
      description: "Full recruiting cycle from talent pool to offer acceptance with SLA tracking.",
      status: "published",
      executionHealth: 96,
      errorCount: 1,
      lastExecution: "01/02/2026 16:20",
      nodes: [
        // Início
        { id: "trig1", type: "trigger", position: { x: 0, y: 300 }, data: { label: "External Trigger: Candidate Added", method: "POST", endpoint: "https://api.ats.com/webhook/candidate", integrationActive: true } },
        { id: "tag1", type: "setTag", position: { x: 300, y: 300 }, data: { label: "Normalize: stage=talent", addTag: "stage:talent", removeTag: "" } },
        { id: "dec1", type: "decision", position: { x: 600, y: 300 }, data: { label: "Has req_id?", switchField: "req_id", cases: { "no": "No Req", "yes": "Has Req" } } },

        // Sem vaga (Pool)
        { id: "j_pool", type: "journey", position: { x: 900, y: 100 }, data: { label: "Assign to Pool + Ask Position", journeyId: "jb-pool-assign" } },

        // Com vaga (Outreach)
        { id: "j_reach", type: "journey", position: { x: 900, y: 500 }, data: { label: "Outreach / Acknowledge", journeyId: "jb-outreach" } },
        { id: "del1", type: "delay", position: { x: 1200, y: 500 }, data: { label: "Wait 2 days", delayValue: 2, delayUnit: "days" } },
        { id: "dec2", type: "decision", position: { x: 1500, y: 500 }, data: { label: "Replied?", switchField: "replied", cases: { "no": "No Reply", "yes": "Replied" } } },

        // Follow-up
        { id: "j_fup1", type: "journey", position: { x: 1500, y: 700 }, data: { label: "Follow-up 1", journeyId: "jb-fup-1" } },

        // Triagem & Interview
        { id: "j_triage", type: "journey", position: { x: 1800, y: 300 }, data: { label: "Triage Call & Scorecard", journeyId: "jb-triage" } },
        { id: "tag_stg1", type: "setTag", position: { x: 2100, y: 300 }, data: { label: "stage=interview", addTag: "stage:interview", removeTag: "stage:triage" } },
        { id: "dec_tr", type: "decision", position: { x: 2400, y: 300 }, data: { label: "Track Check", switchField: "track", cases: { "tech": "Tech", "biz": "Business" } } },

        // Tracks
        { id: "j_int_tech", type: "journey", position: { x: 2700, y: 200 }, data: { label: "Tech Interview Pack", journeyId: "jb-int-tech" } },
        { id: "j_int_biz", type: "journey", position: { x: 2700, y: 400 }, data: { label: "Biz Interview Pack", journeyId: "jb-int-biz" } },

        // Hiring Decision
        { id: "j_comm", type: "journey", position: { x: 3000, y: 300 }, data: { label: "Hiring Committee", journeyId: "jb-hiring-committee" } },
        { id: "dec_app", type: "decision", position: { x: 3300, y: 300 }, data: { label: "Approved?", switchField: "decision", cases: { "yes": "Approved", "no": "Rejected" } } },

        // Offer
        { id: "tag_off", type: "setTag", position: { x: 3600, y: 300 }, data: { label: "stage=offer_sent", addTag: "stage:offer_sent", removeTag: "stage:interview" } },
        { id: "dec_typ", type: "decision", position: { x: 3900, y: 300 }, data: { label: "Contract Type", switchField: "contract_type", cases: { "clt": "CLT", "pj": "PJ", "estagio": "Intern" } } },
        { id: "j_sign", type: "journey", position: { x: 4200, y: 300 }, data: { label: "Send Offer (e-sign)", journeyId: "jb-send-offer" } },

        // Closing
        { id: "del_sg", type: "delay", position: { x: 4500, y: 300 }, data: { label: "Wait Sign 3d", delayValue: 3, delayUnit: "days" } },
        { id: "dec_sg", type: "decision", position: { x: 4800, y: 300 }, data: { label: "Offer Signed?", switchField: "signed", cases: { "yes": "Signed", "no": "Pending" } } },
        { id: "tag_win", type: "setTag", position: { x: 5100, y: 300 }, data: { label: "stage=offer_accepted", addTag: "stage:offer_accepted", removeTag: "stage:offer_sent" } },
        { id: "j_pre", type: "journey", position: { x: 5400, y: 300 }, data: { label: "Trigger Pre-boarding", journeyId: "jb-trigger-onb" } },
      ],
      edges: [
        { id: "e1", source: "trig1", target: "tag1" },
        { id: "e2", source: "tag1", target: "dec1" },
        { id: "e3", source: "dec1", target: "j_pool", label: "No Req" },
        { id: "e4", source: "dec1", target: "j_reach", label: "Has Req" },
        { id: "e5", source: "j_reach", target: "del1" },
        { id: "e6", source: "del1", target: "dec2" },
        { id: "e7", source: "dec2", target: "j_fup1", label: "No Reply" },
        { id: "e8", source: "dec2", target: "j_triage", label: "Replied" },
        { id: "e9", source: "j_triage", target: "tag_stg1" },
        { id: "e10", source: "tag_stg1", target: "dec_tr" },
        { id: "e11", source: "dec_tr", target: "j_int_tech", label: "Tech" },
        { id: "e12", source: "dec_tr", target: "j_int_biz", label: "Business" },
        { id: "e13", source: "j_int_tech", target: "j_comm" },
        { id: "e14", source: "j_int_biz", target: "j_comm" },
        { id: "e15", source: "j_comm", target: "dec_app" },
        { id: "e16", source: "dec_app", target: "tag_off", label: "Approved" },
        { id: "e17", source: "tag_off", target: "dec_typ" },
        { id: "e18", source: "dec_typ", target: "j_sign", label: "All types" },
        { id: "e19", source: "j_sign", target: "del_sg" },
        { id: "e20", source: "del_sg", target: "dec_sg" },
        { id: "e21", source: "dec_sg", target: "tag_win", label: "Signed" },
        { id: "e22", source: "tag_win", target: "j_pre" },
      ]
    },
    {
      id: "o-off-risk",
      name: "Offboarding: Risk & Compliance",
      description: "Secure exit process handling both immediate termination and planned handovers.",
      status: "draft",
      executionHealth: 100,
      errorCount: 0,
      nodes: [
        { id: "t_term", type: "trigger", position: { x: 0, y: 300 }, data: { label: "Termination Created", method: "POST", endpoint: "https://hris.api/term", integrationActive: true } },
        { id: "tag_init", type: "setTag", position: { x: 300, y: 300 }, data: { label: "Init Case: stage=offboarding", addTag: "stage:offboarding_open", removeTag: "" } },
        { id: "dec_risk", type: "decision", position: { x: 600, y: 300 }, data: { label: "Risk Level?", switchField: "risk_level", cases: { "high": "High Risk / Immediate", "low": "Low Risk / Planned" } } },

        // Caminho A: Corte Imediato (High Risk)
        { id: "j_cut_now", type: "journey", position: { x: 900, y: 100 }, data: { label: "Immediate Access Cut", journeyId: "jb-cut-access-now" } },
        { id: "tag_cut_ok", type: "setTag", position: { x: 1200, y: 100 }, data: { label: "access_cut_status=done", addTag: "access:revoked", removeTag: "access:active" } },
        { id: "j_notify", type: "journey", position: { x: 1500, y: 100 }, data: { label: "Notify Stakeholders", journeyId: "jb-notify-stake" } },
        { id: "j_assets", type: "journey", position: { x: 1800, y: 100 }, data: { label: "Assets Retrieval Logistics", journeyId: "jb-assets-log" } },

        // Caminho B: Planejado (Low Risk)
        { id: "j_plan", type: "journey", position: { x: 900, y: 500 }, data: { label: "Handover Plan & Knowledge", journeyId: "jb-handover" } },
        { id: "del_last", type: "delay", position: { x: 1200, y: 500 }, data: { label: "Wait until Last Day", delayValue: 1, delayUnit: "days" } },
        { id: "j_cut_end", type: "journey", position: { x: 1500, y: 500 }, data: { label: "Access Cut (EOD)", journeyId: "jb-cut-access-eod" } },
        { id: "j_return", type: "journey", position: { x: 1800, y: 500 }, data: { label: "Asset Return (On-site)", journeyId: "jb-asset-return-onsite" } },

        // Convergencia - DP/Jurídico
        { id: "j_legal", type: "journey", position: { x: 2100, y: 300 }, data: { label: "DP/Legal Package", journeyId: "jb-dp-legal" } },
        { id: "dec_wkr", type: "decision", position: { x: 2400, y: 300 }, data: { label: "Worker Type", switchField: "worker_type", cases: { "clt": "CLT", "pj": "PJ", "intern": "Intern" } } },

        { id: "j_clt", type: "journey", position: { x: 2700, y: 200 }, data: { label: "CLT Rescisão", journeyId: "jb-clt-term" } },
        { id: "j_pj", type: "journey", position: { x: 2700, y: 400 }, data: { label: "Contract Close", journeyId: "jb-pj-close" } },

        { id: "j_close", type: "journey", position: { x: 3000, y: 300 }, data: { label: "Close Case w/ Evidence", journeyId: "jb-case-close" } }
      ],
      edges: [
        { id: "e1", source: "t_term", target: "tag_init" },
        { id: "e2", source: "tag_init", target: "dec_risk" },

        // Path A
        { id: "e3", source: "dec_risk", target: "j_cut_now", label: "High Risk" },
        { id: "e4", source: "j_cut_now", target: "tag_cut_ok" },
        { id: "e5", source: "tag_cut_ok", target: "j_notify" },
        { id: "e6", source: "j_notify", target: "j_assets" },
        { id: "e7", source: "j_assets", target: "j_legal" },

        // Path B
        { id: "e8", source: "dec_risk", target: "j_plan", label: "Low Risk" },
        { id: "e9", source: "j_plan", target: "del_last" },
        { id: "e10", source: "del_last", target: "j_cut_end" },
        { id: "e11", source: "j_cut_end", target: "j_return" },
        { id: "e12", source: "j_return", target: "j_legal" },

        // Converge
        { id: "e13", source: "j_legal", target: "dec_wkr" },
        { id: "e14", source: "dec_wkr", target: "j_clt", label: "CLT" },
        { id: "e15", source: "dec_wkr", target: "j_pj", label: "PJ" },
        { id: "e16", source: "j_clt", target: "j_close" },
        { id: "e17", source: "j_pj", target: "j_close" }
      ]
    }
  ]);

  const [currentOrchestrator, setCurrentOrchestrator] = useState<Orchestrator | null>(null);
  const [monitorOrchestrator, setMonitorOrchestrator] = useState<Orchestrator | null>(null);

  if (!user) {
    return <LoginView />;
  }

  const handleEdit = (o: Orchestrator) => {
    setCurrentOrchestrator(o);
    setView('editor');
  };

  const handleCreate = () => {
    if (!checkLimit(orchestrators.length)) {
      setShowLimitModal(true);
      return;
    }

    const newOrchestrator: Orchestrator = {
      id: `o-${Date.now()}`,
      name: "New Orchestrator",
      description: "Draft workflow",
      status: "draft",
      executionHealth: 100,
      errorCount: 0,
      nodes: [],
      edges: []
    };
    setOrchestrators([newOrchestrator, ...orchestrators]);
    setCurrentOrchestrator(newOrchestrator);
    setView('editor');
  };

  const handleSave = (updated: Orchestrator) => {
    setOrchestrators(prev => prev.map(o => o.id === updated.id ? updated : o));
    if (currentOrchestrator?.id === updated.id) setCurrentOrchestrator(updated);
  };

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]">
        {/* Sidebar */}
        <aside className="w-20 bg-slate-900 flex flex-col items-center py-8 gap-8 shrink-0">
          <div className="w-12 h-12 bg-[#4f39f6] rounded-[18px] flex items-center justify-center text-white shadow-lg mb-4">
            <span className="material-symbols-outlined font-black">hub</span>
          </div>

          <button
            onClick={() => setView('dashboard')}
            className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all ${view === 'dashboard' || view === 'editor' ? 'bg-[#4f39f6] text-white' : 'text-slate-500 hover:bg-slate-800'
              }`}
            title="Dashboard"
          >
            <span className="material-symbols-outlined">dashboard</span>
          </button>

          <button
            onClick={() => setView('integrations')}
            className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all ${view === 'integrations' ? 'bg-[#4f39f6] text-white' : 'text-slate-500 hover:bg-slate-800'
              }`}
            title="Integrations & Apps"
          >
            <span className="material-symbols-outlined">extension</span>
          </button>

          <div className="mt-auto">
            <button
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 hover:ring-2 ring-[#4f39f6] transition-all overflow-hidden"
            >
              {user.avatar ? <img src={user.avatar} alt="Me" /> : 'PO'}
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {view === 'dashboard' ? (
            <DashboardView
              orchestrators={orchestrators}
              onEdit={handleEdit}
              onCreate={handleCreate}
              onRename={(id, name) => setOrchestrators(prev => prev.map(o => o.id === id ? { ...o, name } : o))}
              onViewExecution={o => setMonitorOrchestrator(o)}
            />
          ) : view === 'integrations' ? (
            <IntegrationsView
              integrations={integrations}
              onSave={(updatedIntegration) => {
                setIntegrations(prev => {
                  const exists = prev.find(i => i.id === updatedIntegration.id);
                  if (exists) {
                    return prev.map(i => i.id === updatedIntegration.id ? updatedIntegration : i);
                  }
                  return [...prev, updatedIntegration];
                });
              }}
              onBack={() => setView('dashboard')}
            />
          ) : (
            currentOrchestrator && (
              <FlowEditor
                orchestrator={currentOrchestrator}
                onBack={() => setView('dashboard')}
                onSave={handleSave}
                integrations={integrations}
              />
            )
          )}
        </div>
      </div>

      {/* Modals */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        orchestratorCount={orchestrators.length}
      />

      <Modal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        title="Upgrade Required"
        footer={<Button onClick={() => setShowLimitModal(false)}>Understood</Button>}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <p className="text-slate-600 font-bold mb-2">You've reached the limit of your mocked plan.</p>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            The Starter plan allows up to {user.plan.maxOrchestrators} orchestrators.
            Please upgrade to create more.
          </p>
        </div>
      </Modal>

      {monitorOrchestrator && (
        <MonitorView
          orchestrator={monitorOrchestrator}
          onClose={() => setMonitorOrchestrator(null)}
        />
      )}
    </ReactFlowProvider>
  );
};

// Wrap with AuthProvider
const App: React.FC = () => (
  <AuthProvider>
    <InnerApp />
  </AuthProvider>
);

export default App;
