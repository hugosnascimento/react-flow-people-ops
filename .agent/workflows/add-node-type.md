---
description: How to add a new custom node type to the flow editor
---

# Adding a New Node Type

This workflow guides you through creating a new custom node type for the React Flow orchestrator.

## Steps

1. **Create Node Component**

Create a new file in `src/components/nodes/` (e.g., `EmailNode.tsx`):

```tsx
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const EmailNode: React.FC<NodeProps> = ({ data, selected }) => (
  <div className={`node-card rounded-[28px] p-6 w-[260px] border-l-[8px] ${selected ? "selected" : ""}`} 
       style={{ borderLeftColor: "#3b82f6" }}>
    <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-blue-500 !border-4 !border-white !-left-1.5" />
    
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-100 text-blue-600">
        <span className="material-symbols-outlined text-2xl">mail</span>
      </div>
      <div>
        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block">Email Action</span>
        <span className="text-sm font-black text-slate-900">{data.label}</span>
      </div>
    </div>
    
    <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-blue-500 !border-4 !border-white !-right-1.5" />
  </div>
);
```

2. **Export Node from Index**

Update `src/components/nodes/index.ts`:

```typescript
export * from './EmailNode';
```

3. **Register Node Type**

In `src/components/editor/FlowEditor.tsx`, add to `nodeTypes` object:

```typescript
const nodeTypes = {
  trigger: TriggerNode,
  journey: JourneyNode,
  decision: DecisionNode,
  setTag: TagManagerNode,
  delay: DelayNode,
  email: EmailNode,  // Add this
};
```

4. **Add Factory Button**

In the same file, add to the node factory array:

```typescript
{
  type: 'email',
  label: 'Send Email',
  icon: 'mail',
  color: 'text-blue-600',
  data: { label: 'Email Notification', subject: '', body: '' }
}
```

5. **Update Types (if needed)**

Add node-specific data fields in `src/types/index.ts`:

```typescript
export interface WorkflowNodeData {
  label: string;
  // ... existing fields
  subject?: string;  // Email-specific
  body?: string;     // Email-specific
}
```

6. **Add Configuration Panel (optional)**

In FlowEditor's properties panel, add a conditional block:

```typescript
{selectedNode.type === 'email' && (
  <div className="space-y-4">
    <div>
      <label className="block text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3">
        Subject
      </label>
      <input
        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl"
        value={selectedNode.data.subject}
        onChange={e => handleUpdateNode(selectedNode.id, { subject: e.target.value })}
      />
    </div>
  </div>
)}
```

7. **Test the Node**

- Run `npm run dev`
- Open the flow editor
- Click the new "Send Email" button
- Verify the node appears and can be configured

## Checklist

- [ ] Node component created in `src/components/nodes/`
- [ ] Exported from `index.ts`
- [ ] Registered in `nodeTypes` object
- [ ] Factory button added
- [ ] TypeScript types updated
- [ ] Configuration panel added (if needed)
- [ ] Tested in dev environment
