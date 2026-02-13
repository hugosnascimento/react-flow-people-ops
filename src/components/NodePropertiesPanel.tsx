import React, { useState, useEffect } from 'react';
import { IconButton, Button, Modal } from './ui';
import { JourneyPropsEditor, DecisionPropsEditor, NotificationPropsEditor, AdvancedSettings } from './properties';

interface NodePropertiesPanelProps {
    selectedNode: any;
    onUpdate: (id: string, data: any) => void;
    onDelete: () => void;
    onClose: () => void;
    availableJourneys: any[];
    integrations?: any[];
}

export const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
    selectedNode,
    onUpdate,
    onDelete,
    onClose,
    availableJourneys,
    integrations
}) => {
    const [localData, setLocalData] = useState<any>(selectedNode.data);
    const [isDirty, setIsDirty] = useState(false);
    const [showCloseWarning, setShowCloseWarning] = useState(false);

    useEffect(() => {
        setLocalData(JSON.parse(JSON.stringify(selectedNode.data)));
        setIsDirty(false);
    }, [selectedNode.id]);

    const handleUpdate = (patch: any) => {
        setLocalData((prev: any) => {
            const newData = { ...prev, ...patch };
            setIsDirty(true);
            return newData;
        });
    };

    const handleSave = () => {
        onUpdate(selectedNode.id, localData);
        setIsDirty(false);
    };

    const handleCloseAttempt = () => {
        if (isDirty) {
            setShowCloseWarning(true);
        } else {
            onClose();
        }
    };

    const discardAndClose = () => {
        setIsDirty(false);
        setShowCloseWarning(false);
        onClose();
    };

    return (
        <>
            <div className="absolute right-8 top-8 bottom-8 w-[420px] bg-white rounded-[40px] shadow-2xl border border-slate-200 z-30 flex flex-col p-8 animate-fade-in">
                {/* Header */}
                <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-black text-slate-900 text-xs tracking-widest uppercase">Properties</h2>
                        <p className="text-[10px] text-slate-400 mt-1">{selectedNode.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {isDirty && (
                            <span className="text-[9px] font-bold text-amber-500 uppercase animate-pulse">
                                Unsaved Changes
                            </span>
                        )}
                        <IconButton icon="close" onClick={handleCloseAttempt} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto py-8 space-y-6 no-scrollbar">
                    {/* Common Label Field */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Node Name</label>
                        <input
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-[#4f39f6]"
                            value={localData.label || ''}
                            onChange={e => handleUpdate({ label: e.target.value })}
                        />
                    </div>

                    {/* Specific Editors */}
                    {selectedNode.type === 'startFlow' && (
                        <JourneyPropsEditor
                            data={localData}
                            availableJourneys={availableJourneys}
                            onUpdate={handleUpdate}
                        />
                    )}

                    {selectedNode.type === 'conditional' && (
                        <DecisionPropsEditor
                            data={localData}
                            onUpdate={handleUpdate}
                        />
                    )}

                    {selectedNode.type === 'notification' && (
                        <NotificationPropsEditor
                            data={localData}
                            onUpdate={handleUpdate}
                        />
                    )}

                    {selectedNode.type === 'humanInTheLoop' && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest">Assignee</label>
                                    {!localData.assignee && <span className="text-[9px] text-rose-500 font-bold uppercase">Required</span>}
                                </div>
                                <input
                                    className={`w-full px-5 py-4 bg-slate-50 border ${!localData.assignee ? 'border-rose-200' : 'border-slate-200'} rounded-2xl text-sm font-bold outline-none focus:border-[#4f39f6]`}
                                    value={localData.assignee || ''}
                                    onChange={e => handleUpdate({ assignee: e.target.value })}
                                    placeholder="e.g. Manager, HR"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Instructions</label>
                                <textarea
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-[#4f39f6] min-h-[100px]"
                                    value={localData.description || ''}
                                    onChange={e => handleUpdate({ description: e.target.value })}
                                    placeholder="Describe what needs to be approved..."
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">Timeout (Hours)</label>
                                <input
                                    type="number"
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-[#4f39f6]"
                                    value={localData.timeout || 0}
                                    onChange={e => handleUpdate({ timeout: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <AdvancedSettings data={localData} onUpdate={handleUpdate} />
                        </div>
                    )}
                </div>

                {/* Footer with Save/Delete */}
                <div className="pt-6 border-t border-slate-100 space-y-3">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSave}
                        className={`w-full ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isDirty}
                    >
                        Save Changes
                    </Button>
                    <Button variant="danger" size="sm" onClick={onDelete} className="w-full">
                        Delete Node
                    </Button>
                </div>
            </div>

            {/* Close Warning Modal */}
            <Modal
                isOpen={showCloseWarning}
                onClose={() => setShowCloseWarning(false)}
                title="Unsaved Changes"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowCloseWarning(false)}>Cancel</Button>
                        <Button variant="danger" onClick={discardAndClose}>Discard</Button>
                        <Button variant="primary" onClick={() => { handleSave(); onClose(); }}>Save & Close</Button>
                    </>
                }
            >
                <p className="text-slate-600 font-bold mb-4">You have unsaved changes in this node.</p>
                <p className="text-sm text-slate-500">Closing without saving will discard your edits.</p>
            </Modal>
        </>
    );
};
