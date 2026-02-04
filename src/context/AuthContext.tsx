import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface User {
    id: string;
    name: string;
    email: string;
    company: string;
    avatar: string;
    plan: {
        name: string;
        maxOrchestrators: number;
        expiresAt: string;
    };
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password?: string) => Promise<{ error: any }>;
    logout: () => Promise<void>;
    checkLimit: (currentCount: number) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
                console.error("Session check error:", error);
                setUser(null);
            } else if (data?.session?.user) {
                mapUser(data.session.user).then(u => setUser(u));
            } else {
                setUser(null);
            }
        }).catch(err => {
            console.error("Unexpected auth error:", err);
            setUser(null);
        }).finally(() => {
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                mapUser(session.user).then(u => setUser(u));
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const mapUser = async (supabaseUser: any): Promise<User> => {
        // In a real app, we would fetch the profile from a 'profiles' table.
        // For now, we'll derive the info from the auth user + some defaults to match existing UI.

        // Try to get metadata specific to our app, or fallback
        const name = supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User';
        const avatar = supabaseUser.user_metadata?.avatar ||
            ("https://ui-avatars.com/api/?background=4f39f6&color=fff&name=" + name);

        return {
            id: supabaseUser.id,
            name: name,
            email: supabaseUser.email || '',
            company: supabaseUser.user_metadata?.company || "Acme Corp", // Default/Mock for now
            avatar: avatar,
            plan: {
                name: "Starter Plan", // Renamed from "Starter Mocado" to look more real
                maxOrchestrators: 10,  // Increased limit for real usage
                expiresAt: "2099-12-31"
            }
        };
    };

    const login = async (email: string, password?: string) => {
        if (!password) {
            // Fallback for dev/existing calls that might miss password, or if we want magic link
            // But for this request, assuming password auth.
            return { error: { message: "Password is required" } };
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        return { error };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const checkLimit = (currentCount: number) => {
        if (!user) return false;
        return currentCount < user.plan.maxOrchestrators;
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkLimit }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
