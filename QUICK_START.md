# 🎯 Guia Rápido - Eva People Ops Orchestrator

## Stack & Estrutura

**Stack**: React 18 + TypeScript 5 + React Flow 11 + Vite 5

```
src/
├── components/
│   ├── nodes/           # 5 tipos de nós
│   ├── ui/              # Button, Input, Select, IconButton
│   ├── FlowEditor.tsx   # Editor principal ⭐
│   ├── DashboardView.tsx
│   ├── CollaboratorsView.tsx
│   ├── monitor/
│   └── layout/
├── hooks/               # useUnsavedChanges, useSelection
├── services/            # ApiService, EvaEngine
├── types/              # Interfaces TypeScript
├── design-system.ts    # Tokens de design
└── App.tsx            # Entry point
```

## Componentes Principais

### FlowEditor.tsx ⭐
Canvas React Flow com **save explícito** (não auto-save).

**State importante:**
- `nodes` - nós do flow
- `edges` - conexões
- `selectedNodeId` - nó selecionado
- `isDirty` - mudanças não salvas

**Funções chave:**
- `addNode(type, data)` - adiciona nó
- `updateNode(id, patch)` - atualiza dados
- `handleSave()` - salva orchestrator

### 5 Tipos de Nós

1. **TriggerNode** 🟠 - Webhooks, APIs externas
2. **JourneyNode** 🟣 - Inicia sub-flows
3. **DecisionNode** 🟪 - Roteamento condicional
4. **TagManagerNode** 🟢 - Gerencia tags
5. **DelayNode** 🟡 - Esperas temporais

### ApiService
```typescript
api.getEmployees(params)
api.getTags()
api.updateEmployee(id, data)
api.getUserJourneys(id)
api.startJourney(request)
api.cancelJourney(id, users)
```

## Padrões de Código

### ✅ Boas Práticas

```typescript
// 1. Usar componentes reutilizáveis
import { Button } from './ui';
<Button variant="primary" onClick={handleSave}>Save</Button>

// 2. Usar design system
import { colors, spacing } from '../design-system';
<div style={{ color: colors.brand.primary, padding: spacing.lg }}>

// 3. Hooks customizados
const { isDirty, save } = useUnsavedChanges(initial);

// 4. Type safety
interface Props {
  onSave: (o: Orchestrator) => void;
}
```

### ❌ Evitar

```typescript
// ❌ Hardcoded values
<div style={{ color: '#4f39f6', padding: '24px' }}>

// ❌ Inline complex components (extrair)
<button className="w-10 h-10 flex items-center...">

// ❌ Auto-save (usar explícito)
useEffect(() => onSave(data), [data]);

// ❌ any type
const data: any = ...
```

## Tarefas Comuns

### Adicionar Novo Tipo de Nó
1. Criar `src/components/nodes/EmailNode.tsx`
2. Export em `nodes/index.ts`
3. Add em `nodeTypes` (FlowEditor.tsx)
4. Add em `nodeFactoryItems`
5. Add color em `design-system.ts`

### Add Endpoint API
1. Interface em `types/index.ts`
2. Method em `ApiService.ts`
3. Use em component com try/catch

### Modificar Design
1. Check `design-system.ts`
2. Se token não existe, adicionar lá
3. Usar token (não hardcode)

## Casos de Uso Top 3

### 1. Onboarding
```
Trigger (ATS) → Delay → Journey → Decision (dept) → Tag
```

### 2. Performance Review
```
Trigger (quarterly) → Journey (self) → Journey (manager) → Tag
```

### 3. Offboarding
```
Trigger → Journey (transfer) → Journey (exit) → Tag (archive)
```

Ver `docs/USE_CASES.md` para 10 casos completos.

## Debugging Rápido

**Node não atualiza?**
→ Check spread: `{ ...n, data: { ...n.data, ...patch } }`

**API error?**
→ Backend down? Check fallback mock data

**Type error?**
→ Check `types/index.ts` interfaces

## Comandos

```bash
npm run dev          # Servidor dev (http://localhost:5173)
npm run build        # Build produção
npm run type-check   # Verificar tipos
```

## Documentação Completa

- **Quick Context**: `.agent/QUICK_CONTEXT.md` (para IA)
- **Use Cases**: `docs/USE_CASES.md`
- **Design System**: `docs/DESIGN_SYSTEM.md`
- **Architecture**: `.agent/ARCHITECTURE.md`
- **API Docs**: `API_DOCUMENTATION.md`

## Filosofia

**Código limpo > código esperto**  
**Se copiou 2x, extraia para function/component**  
**Save explícito, não automático**

---

**Leia primeiro**: `.agent/QUICK_CONTEXT.md` (otimizado para IA, 70% menos tokens)
