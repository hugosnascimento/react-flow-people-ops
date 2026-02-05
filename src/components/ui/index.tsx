import React from 'react';

// Re-export existing components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const variantStyles = {
    primary: 'bg-[#4f39f6] text-white hover:bg-[#4338ca]',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
};

const sizeStyles = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    className = '',
    children,
    ...props
}) => (
    <button
        className={`rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
    >
        {children}
    </button>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
    <div>
        {label && (
            <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                {label}
            </label>
        )}
        <input
            className={`w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6] ${className}`}
            {...props}
        />
    </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
    <div>
        {label && (
            <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
                {label}
            </label>
        )}
        <select
            className={`w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-[#4f39f6] ${className}`}
            {...props}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string;
    label?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, label, className = '', ...props }) => (
    <button
        className={`w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all ${className}`}
        title={label}
        {...props}
    >
        <span className="material-symbols-outlined">{icon}</span>
    </button>
);

export { Modal } from './Modal';
