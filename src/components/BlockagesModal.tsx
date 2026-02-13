import React, { useState } from 'react';
import { Modal, Button, Select } from './ui';

interface BlockedEmployee {
    id: string;
    name: string;
    blockedAtNodeId: string;
    blockedAtNodeLabel: string;
    reason: string;
    avatar?: string;
}

interface BlockagesModalProps {
    isOpen: boolean;
    onClose: () => void;
    nodes: any[]; // To list possible target nodes
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

export const BlockagesModal: React.FC<BlockagesModalProps> = ({ isOpen, onClose, nodes }) => {
    const [selectedAction, setSelectedAction] = useState<Record<string, string>>({});

    const handleActionChange = (empId: string, nodeId: string) => {
        setSelectedAction(prev => ({ ...prev, [empId]: nodeId }));
    };

    const handleUnblock = (empId: string) => {
        // Logic to call API would go here
        console.log(`Unblocking employee ${empId} to node ${selectedAction[empId]}`);
        alert(`Colaborador desbloqueado e movido para o passo selecionado!`);
    };

    const nodeOptions = nodes.map(n => ({
        value: n.id,
        label: `${n.data.displayId || ''} ${n.data.label}`.trim() || n.id
    }));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Gestão de Bloqueios"
            footer={
                <Button variant="secondary" onClick={onClose}>Fechar</Button>
            }
        >
            <div className="space-y-6">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-amber-500">warning</span>
                    <div>
                        <h4 className="font-bold text-amber-800 text-sm">Colaboradores Bloqueados</h4>
                        <p className="text-xs text-amber-700 mt-1">
                            Estes colaboradores estão parados no fluxo devido a erros ou timeouts.
                            Selecione um novo passo para desbloqueá-los.
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {MOCK_BLOCKED_EMPLOYEES.map(emp => (
                        <div key={emp.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-400 font-bold">
                                        {emp.avatar ? <img src={emp.avatar} alt={emp.name} /> : emp.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-800 text-sm">{emp.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                                Bloqueado em: {emp.blockedAtNodeLabel}
                                            </span>
                                            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                                                {emp.reason}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex items-end gap-3">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        Próximo Passo (Desbloqueio)
                                    </label>
                                    <Select
                                        options={[{ value: '', label: 'Selecione o destino...' }, ...nodeOptions]}
                                        value={selectedAction[emp.id] || ''}
                                        onChange={e => handleActionChange(emp.id, e.target.value)}
                                        className="!py-2 !text-xs"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    disabled={!selectedAction[emp.id]}
                                    onClick={() => handleUnblock(emp.id)}
                                    className={!selectedAction[emp.id] ? 'opacity-50' : ''}
                                >
                                    Desbloquear
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
