import React, { createContext, useContext, useState } from 'react';

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
    login: (email: string) => void;
    logout: () => void;
    checkLimit: (currentCount: number) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (email: string) => {
        // Mock login logic
        const mockUser: User = {
            id: "u-123",
            name: email.split('@')[0],
            email: email,
            company: "Acme Corp",
            avatar: "https://ui-avatars.com/api/?background=4f39f6&color=fff&name=" + email.split('@')[0],
            plan: {
                name: "Starter Mocado",
                maxOrchestrators: 3,
                expiresAt: "2026-12-31"
            }
        };
        setUser(mockUser);
    };

    const logout = () => setUser(null);

    const checkLimit = (currentCount: number) => {
        if (!user) return false;
        return currentCount < user.plan.maxOrchestrators;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, checkLimit }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
