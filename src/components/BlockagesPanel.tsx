import React, { useState, useEffect } from 'react';
import { Button, IconButton } from './ui';

interface BlockedEmployee {
    id: string;
    name: string;
    blockedAtNodeId: string;
    blockedAtNodeLabel: string;
    reason: string;
    avatar?: string;
}

interface BlockagesPanelProps {
    isOpen: boolean;
    onClose: () => void;
    nodes: any[];
    onNodeSelectMode: (empId: string | null) => void;
    selectionModeEmployeeId: string | null;
    selectedNodeId: string | null; // The node currently selected in the canvas
}

const MOCK_BLOCKED_EMPLOYEES: BlockedEmployee[] = [
    {
        id: 'emp-001',
        name: 'Ana Souza',
        blockedAtNodeId: 'node-502',
        blockedAtNodeLabel: 'A2 - Aprovação Gestor',
        reason: 'Gestor não respondeu em 24h',
        avatar: 'https://i.pravatar.cc/150?u=emp-001'
    },
    {
        id: 'emp-002',
        name: 'Carlos Oliveira',
        blockedAtNodeId: 'node-505',
        blockedAtNodeLabel: 'B1 - Integração ERP',
        reason: 'Falha na API (500)',
    },
    {
        id: 'emp-003',
        name: 'Mariana Costa',
        blockedAtNodeId: 'node-510',
        blockedAtNodeLabel: 'C3 - Envio de Kit',
        reason: 'Endereço inválido',
        avatar: 'https://i.pravatar.cc/150?u=emp-003'
    }
];

export const BlockagesPanel: React.FC<BlockagesPanelProps> = ({
    isOpen,
    onClose,
    nodes,
    onNodeSelectMode,
    selectionModeEmployeeId,
    selectedNodeId
}) => {
    const [selectedAction, setSelectedAction] = useState<Record<string, string>>({});

    // If we are in selection mode, and a node is selected, update the action for that employee
    useEffect(() => {
        if (selectionModeEmployeeId && selectedNodeId) {
            setSelectedAction(prev => ({ ...prev, [selectionModeEmployeeId]: selectedNodeId }));
            onNodeSelectMode(null); // Exit selection mode after picking
        }
    }, [selectedNodeId, selectionModeEmployeeId, onNodeSelectMode]);

    const handleUnblock = (empId: string) => {
        const targetNodeId = selectedAction[empId];
        const targetNode = nodes.find(n => n.id === targetNodeId);
        const nodeLabel = targetNode ? (targetNode.data.displayId || targetNode.data.label) : targetNodeId;

        console.log(`Unblocking employee ${empId} to node ${targetNodeId}`);
        alert(`Colaborador desbloqueado e movido para o passo: ${nodeLabel}`);
        // Here you would call the API
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-8 top-8 bottom-8 w-[400px] bg-white rounded-[40px] shadow-2xl border border-slate-200 z-30 flex flex-col p-8 animate-slide-in">
            {/* Header */}
            <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                        <span className="material-symbols-outlined">lock_clock</span>
                    </div>
                    <div>
                        <h2 className="font-black text-slate-900 text-xs tracking-widest uppercase">Bloqueios</h2>
                        <span className="text-[10px] font-bold text-amber-500 uppercase bg-amber-50 px-2 py-0.5 rounded-full">
                            {MOCK_BLOCKED_EMPLOYEES.length} Casos
                        </span>
                    </div>
                </div>
                <IconButton icon="close" onClick={onClose} />
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4 no-scrollbar">
                {MOCK_BLOCKED_EMPLOYEES.map(emp => {
                    const targetId = selectedAction[emp.id];
                    const targetNode = nodes.find(n => n.id === targetId);
                    const targetLabel = targetNode ? `${targetNode.data.displayId || ''} ${targetNode.data.label}` : '';
                    const isPicking = selectionModeEmployeeId === emp.id;

                    return (
                        <div key={emp.id} className={`bg-white border rounded-2xl p-4 transition-all ${isPicking ? 'border-amber-400 shadow-md ring-2 ring-amber-100' : 'border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 font-bold shrink-0">
                                    {emp.avatar ? <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" /> : emp.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-xs">{emp.name}</h3>
                                    <div className="text-[10px] text-slate-500 mt-1">
                                        Bloqueado em: <span className="font-bold text-slate-700">{emp.blockedAtNodeLabel}</span>
                                    </div>
                                    <div className="text-[10px] text-rose-500 font-bold mt-1 bg-rose-50 inline-block px-1.5 py-0.5 rounded">
                                        {emp.reason}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-3">
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                    Ação de Desbloqueio
                                </label>

                                <div className="flex items-center gap-2 mb-3">
                                    <div className={`flex-1 h-9 rounded-xl border flex items-center px-3 text-xs font-bold transition-colors ${isPicking ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                        {isPicking ? (
                                            <span className="flex items-center gap-2 animate-pulse">
                                                <span className="material-symbols-outlined text-[14px]">touch_app</span>
                                                Selecione um nó no canvas...
                                            </span>
                                        ) : targetNode ? (
                                            <span className="flex items-center gap-2 text-slate-900">
                                                <span className="material-symbols-outlined text-[14px] text-[#4f39f6]">my_location</span>
                                                {targetLabel}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">Nenhum destino selecionado</span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => onNodeSelectMode(isPicking ? null : emp.id)}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${isPicking ? 'bg-amber-500 border-amber-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-[#4f39f6] hover:border-[#4f39f6]'}`}
                                        title="Selecionar no Canvas"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {isPicking ? 'close' : 'ads_click'}
                                        </span>
                                    </button>
                                </div>

                                <Button
                                    size="sm"
                                    className="w-full"
                                    disabled={!targetId}
                                    onClick={() => handleUnblock(emp.id)}
                                >
                                    Desbloquear
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400">
                    Selecione um colaborador e clique no ícone de mira para escolher o próximo passo diretamente no fluxo.
                </p>
            </div>
        </div>
    );
};
