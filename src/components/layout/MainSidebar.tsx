import React from 'react';

interface MainSidebarProps {
    currentView: 'dashboard' | 'editor' | 'collaborators';
    onViewChange: (view: 'dashboard' | 'collaborators') => void;
}

export const MainSidebar: React.FC<MainSidebarProps> = ({ currentView, onViewChange }) => {
    return (
        <aside className="w-20 bg-slate-900 flex flex-col items-center py-8 gap-8 shrink-0">
            <div className="w-12 h-12 bg-[#4f39f6] rounded-[18px] flex items-center justify-center text-white shadow-lg mb-4">
                <span className="material-symbols-outlined font-black">token</span>
            </div>

            <button
                onClick={() => onViewChange('dashboard')}
                className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all ${(currentView === 'dashboard' || currentView === 'editor') ? 'bg-[#4f39f6] text-white' : 'text-slate-500 hover:bg-slate-800'
                    }`}
                title="Orchestration Hub"
            >
                <span className="material-symbols-outlined">dashboard</span>
            </button>

            <button
                onClick={() => onViewChange('collaborators')}
                className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all ${currentView === 'collaborators' ? 'bg-[#4f39f6] text-white' : 'text-slate-500 hover:bg-slate-800'
                    }`}
                title="Collaborators"
            >
                <span className="material-symbols-outlined">badge</span>
            </button>

            <div className="mt-auto">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">EV</div>
            </div>
        </aside>
    );
};
