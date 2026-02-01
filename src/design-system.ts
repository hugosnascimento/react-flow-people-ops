/**
 * Eva People Ops - Design System
 * 
 * Centralized design tokens for consistency across the application.
 * All components should reference these tokens instead of hardcoded values.
 */

export const colors = {
    // Brand Colors
    brand: {
        primary: '#4f39f6',      // Indigo/Purple - Main brand color
        primaryLight: '#6366f1',
        primaryDark: '#4338ca',
    },

    // Node Type Colors
    nodes: {
        trigger: '#ff5a1f',      // Orange - External triggers/APIs
        journey: '#4f39f6',      // Indigo - Journey flows
        decision: '#8b5cf6',     // Purple - Decision nodes
        tagManager: '#10b981',   // Emerald - Tag operations
        delay: '#f59e0b',        // Amber - Time-based operations
    },

    // Semantic Colors
    semantic: {
        success: '#10b981',      // Emerald
        warning: '#f59e0b',      // Amber
        error: '#ef4444',        // Rose
        info: '#3b82f6',         // Blue
    },

    // Status Colors
    status: {
        active: '#10b981',
        inactive: '#94a3b8',
        draft: '#64748b',
        published: '#10b981',
        cancelled: '#ef4444',
    },

    // Neutral Colors
    neutral: {
        white: '#ffffff',
        slate50: '#f8fafc',
        slate100: '#f1f5f9',
        slate200: '#e2e8f0',
        slate300: '#cbd5e1',
        slate400: '#94a3b8',
        slate500: '#64748b',
        slate600: '#475569',
        slate700: '#334155',
        slate800: '#1e293b',
        slate900: '#0f172a',
        black: '#000000',
    },
};

export const spacing = {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
};

export const borderRadius = {
    sm: '0.5rem',      // 8px
    md: '1rem',        // 16px
    lg: '1.5rem',      // 24px
    xl: '2rem',        // 32px
    '2xl': '2.5rem',   // 40px
    '3xl': '3rem',     // 48px
    full: '9999px',
};

export const typography = {
    fontFamily: {
        sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", monospace',
    },

    fontSize: {
        xs: '0.625rem',    // 10px
        sm: '0.75rem',     // 12px
        base: '0.875rem',  // 14px
        lg: '1rem',        // 16px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '2rem',     // 32px
        '4xl': '2.5rem',   // 40px
    },

    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        black: 900,
    },

    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.2em',
    },
};

export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    premium: '0 20px 40px -10px rgba(79, 57, 246, 0.15)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

export const transitions = {
    fast: '150ms ease-in-out',
    base: '300ms ease-in-out',
    slow: '500ms ease-in-out',
};

export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
};

// Component-specific design tokens
export const components = {
    node: {
        width: {
            trigger: '280px',
            journey: '260px',
            decision: '300px',
            tagManager: '240px',
            delay: '220px',
        },
        borderWidth: '8px',
        padding: spacing.lg,
    },

    button: {
        height: {
            sm: '2rem',      // 32px
            md: '2.5rem',    // 40px
            lg: '3rem',      // 48px
        },
        paddingX: {
            sm: spacing.md,
            md: spacing.lg,
            lg: spacing.xl,
        },
    },

    input: {
        height: '3rem',    // 48px
        padding: spacing.lg,
    },

    sidebar: {
        width: '80px',     // Main navigation
        contentWidth: '320px', // Tool sidebar
    },
};

// Utility functions
export const getNodeColor = (nodeType: string): string => {
    return colors.nodes[nodeType as keyof typeof colors.nodes] || colors.brand.primary;
};

export const getStatusColor = (status: string): string => {
    return colors.status[status as keyof typeof colors.status] || colors.neutral.slate400;
};

export default {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
    transitions,
    breakpoints,
    components,
    getNodeColor,
    getStatusColor,
};
