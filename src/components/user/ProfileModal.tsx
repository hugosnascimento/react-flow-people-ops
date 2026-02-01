import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Modal, Button } from '../ui';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    orchestratorCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, orchestratorCount }) => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const usagePercent = (orchestratorCount / user.plan.maxOrchestrators) * 100;
    const isLimitReached = orchestratorCount >= user.plan.maxOrchestrators;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Account Settings"
            footer={
                <Button variant="danger" size="sm" onClick={() => { logout(); onClose(); }}>
                    Sign Out
                </Button>
            }
        >
            <div className="flex items-center gap-4 mb-8">
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-2xl shadow-lg border-2 border-slate-100" />
                <div>
                    <h2 className="text-lg font-black text-slate-900">{user.name}</h2>
                    <p className="text-xs font-bold text-slate-400">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#4f39f6]/10 text-[#4f39f6] text-[10px] font-black uppercase rounded-full">
                        {user.company}
                    </span>
                </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Plan</span>
                    <span className="text-xs font-black text-[#4f39f6] uppercase tracking-widest">{user.plan.name}</span>
                </div>

                <div className="mb-2 flex justify-between text-xs font-bold text-slate-700">
                    <span>Usage</span>
                    <span>{orchestratorCount} / {user.plan.maxOrchestrators} Orchestrators</span>
                </div>

                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ease-out ${isLimitReached ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(usagePercent, 100)}%` }}
                    />
                </div>

                {isLimitReached && (
                    <p className="mt-3 text-[10px] font-bold text-rose-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">warning</span>
                        Plan limit reached. Upgrade to add more.
                    </p>
                )}
            </div>
        </Modal>
    );
};
