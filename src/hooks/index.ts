import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar estado de alterações não salvas
 */
export const useUnsavedChanges = <T,>(initialValue: T) => {
    const [value, setValue] = useState<T>(initialValue);
    const [saved, setSaved] = useState<T>(initialValue);
    const [isDirty, setIsDirty] = useState(false);

    const updateValue = useCallback((newValue: T) => {
        setValue(newValue);
        setIsDirty(true);
    }, []);

    const save = useCallback(() => {
        setSaved(value);
        setIsDirty(false);
        return value;
    }, [value]);

    const reset = useCallback(() => {
        setValue(saved);
        setIsDirty(false);
    }, [saved]);

    return {
        value,
        updateValue,
        save,
        reset,
        isDirty,
    };
};

/**
 * Hook para gerenciar seleção de items
 */
export const useSelection = <T,>(items: T[]) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selected = items.find((item: any) => item.id === selectedId) || null;

    const select = (id: string | null) => setSelectedId(id);
    const clear = () => setSelectedId(null);

    return { selected, select, clear, selectedId };
};
