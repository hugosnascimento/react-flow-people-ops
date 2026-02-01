import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../ui';

export const LoginView: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) login(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
            <div className="w-full max-w-md p-8 bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#4f39f6] rounded-[24px] flex items-center justify-center text-white shadow-xl mb-8 animate-bounce-slow">
                    <span className="material-symbols-outlined text-3xl font-black">hub</span>
                </div>

                <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">People Ops Orchestrator</h1>
                <p className="text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">Workflow Login</p>

                <form onSubmit={handleLogin} className="w-full space-y-6">
                    <Input
                        label="Work Email"
                        placeholder="name@company.com"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        autoFocus
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full py-4 !text-sm">
                        Sign In to Dashboard
                    </Button>

                    <p className="text-center text-[10px] uppercase font-bold text-slate-400">
                        Powered by Orchestrator Engine v1.0
                    </p>
                </form>
            </div>
        </div>
    );
};
