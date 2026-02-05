import React, { useState, useEffect } from "react";
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
import { SupabaseService } from "./services/SupabaseService";

import "reactflow/dist/style.css";

const InnerApp: React.FC = () => {
  const { user, checkLimit } = useAuth();
  const [view, setView] = useState<'dashboard' | 'editor' | 'integrations'>('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Initial Integrations (can eventually be moved to DB too)
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'gupy', name: 'Gupy', type: 'ATS', initials: 'GU', color: '#2563EB', status: 'active', description: 'Recruitment & Selection platform integration.', baseUrl: 'https://api.gupy.io/' },
    { id: 'eva', name: 'Eva', type: 'Communication', initials: 'EV', color: '#4f39f6', status: 'active', description: 'People Ops bot for automated engagement.', baseUrl: 'https://api.eva.bot/' },
    { id: 'lg', name: 'Lugar de Gente', type: 'HCM', initials: 'LG', color: '#059669', status: 'inactive', description: 'HCM suite for payroll and personnel.', baseUrl: 'https://api.lg.com.br/' },
    { id: 'feedz', name: 'Feedz', type: 'Engagement', initials: 'FE', color: '#DB2777', status: 'active', description: 'Employee engagement platform.', baseUrl: 'https://api.feedz.com.br/' },
    { id: 'qculture', name: 'Qulture.Rocks', type: 'LMS', initials: 'QR', color: '#7C3AED', status: 'active', description: 'Performance and LMS integration.', baseUrl: 'https://api.qulture.rocks/' }
  ]);

  const [orchestrators, setOrchestrators] = useState<Orchestrator[]>([]);
  const [currentOrchestrator, setCurrentOrchestrator] = useState<Orchestrator | null>(null);
  const [monitorOrchestrator, setMonitorOrchestrator] = useState<Orchestrator | null>(null);

  // Load orchestrators from Supabase when user is logged in
  useEffect(() => {
    if (user) {
      setIsLoadingData(true);
      SupabaseService.getOrchestrators()
        .then(data => {
          setOrchestrators(data);
        })
        .catch(err => console.error("Failed to load orchestrators", err))
        .finally(() => setIsLoadingData(false));
    }
  }, [user]);

  if (!user) {
    return <LoginView />;
  }

  const handleEdit = (o: Orchestrator) => {
    setCurrentOrchestrator(o);
    setView('editor');
  };

  const handleCreate = async () => {
    if (!checkLimit(orchestrators.length)) {
      setShowLimitModal(true);
      return;
    }

    const newOrchestrator: Orchestrator = {
      id: `o-${Date.now()}`, // Or generate UUID
      name: "New Orchestrator",
      description: "Draft workflow",
      status: "draft",
      executionHealth: 100,
      errorCount: 0,
      nodes: [],
      edges: []
    };

    // Optimistic update
    setOrchestrators([newOrchestrator, ...orchestrators]);
    setCurrentOrchestrator(newOrchestrator);
    setView('editor');

    // Persist
    try {
      await SupabaseService.createOrchestrator(newOrchestrator, user.id);
    } catch (error) {
      console.error("Failed to create orchestrator in DB", error);
      // Could revert state here
    }
  };

  const handleSave = async (updated: Orchestrator) => {
    // Optimistic update
    setOrchestrators(prev => prev.map(o => o.id === updated.id ? updated : o));
    if (currentOrchestrator?.id === updated.id) setCurrentOrchestrator(updated);

    // Persist
    try {
      await SupabaseService.updateOrchestrator(updated);
    } catch (error) {
      console.error("Failed to save orchestrator", error);
    }
  };

  const handleRename = async (id: string, name: string) => {
    const orchestrator = orchestrators.find(o => o.id === id);
    if (!orchestrator) return;

    const updated = { ...orchestrator, name };
    setOrchestrators(prev => prev.map(o => o.id === id ? updated : o));

    try {
      await SupabaseService.updateOrchestrator(updated);
    } catch (error) {
      console.error("Failed to rename", error);
    }
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
              onRename={handleRename}
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
          <p className="text-slate-600 font-bold mb-2">You've reached the limit of your plan.</p>
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
