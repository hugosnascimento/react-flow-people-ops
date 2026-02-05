# Eva People Ops - Contexto Rápido para IA

## O Que É
Orquestrador visual de workflows de People Ops. Think Zapier/n8n mas específico para RH.

## Stack
- React 18 + TypeScript 5
- React Flow 11 (canvas de nós)
- Vite 5 (build)

## Estrutura Simplificada
```
src/
├── components/
│   ├── nodes/          # 5 tipos: Trigger, Journey, Decision, Tag, Delay
│   ├── FlowEditor.tsx  # Canvas principal
│   ├── DashboardView.tsx
│   ├── CollaboratorsView.tsx
│   └── ui/             # Button, Input, etc
├── services/
│   ├── ApiService.ts   # Cliente backend
│   └── EvaEngine.ts    # Mock/demo
├── hooks/
│   └── index.ts        # useUnsavedChanges, useSelection
├── types/index.ts      # Todas as interfaces
├── design-system.ts    # Tokens de design
└── App.tsx             # Entry point
```

## Componentes Principais

### App.tsx
- Gerencia estado global de orchestrators
- Navegação entre views (dashboard/editor/collaborators)
- Passa callbacks de save/rename/delete

### FlowEditor.tsx
- Canvas React Flow
- **IMPORTANTE**: Save explícito (não auto-save)
- `isDirty` state para mudanças não salvas
- Node factory sidebar
- Properties panel quando node selecionado

### Nodes (5 tipos)
1. **TriggerNode**: API webhooks, eventos externos
2. **JourneyNode**: Inicia sub-flows (onboarding, offboarding)
3. **DecisionNode**: Roteamento condicional (baseado em tags)
4. **TagManagerNode**: Add/remove tags dos colaboradores  
5. **DelayNode**: Espera baseada em tempo (dias/horas)

### ApiService
```typescript
api.getEmployees(params)      // Lista colaboradores
api.getTags()                 // Tags disponíveis
api.updateEmployee(id, data)  // Atualiza (inclusive tags)
api.getUserJourneys(id)       // Jornadas do usuário
api.startJourney(request)     // Inicia jornada
api.cancelJourney(id, users)  // Cancela jornada
```

## Fluxo de Dados

### Salvar Mudanças
```typescript
// ANTES (ruim - auto-save):
useEffect(() => {
  onSave(orchestrator); // Salva a cada mudança
}, [nodes, edges]);

// AGORA (bom - save explícito):
const [isDirty, setIsDirty] = useState(false);
useEffect(() => { setIsDirty(true); }, [nodes, edges]);
const handleSave = () => {
  onSave(orchestrator);
  setIsDirty(false);
};
```

### Atualizar Node
```typescript
const updateNode = (id: string, patch: any) => {
  setNodes(nds => nds.map(n => 
    n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
  ));
};
```

## Design System
```typescript
import { colors, spacing } from './design-system';

// ❌ Não fazer:
<div style={{ color: '#4f39f6', padding: '24px' }}>

// ✅ Fazer:
<div style={{ color: colors.brand.primary, padding: spacing.lg }}>
```

## Padrões Importantes

### 1. Componentes Reutilizáveis
Use `src/components/ui/` para Button, Input, Select, IconButton

### 2. Hooks Customizados
```typescript
// useUnsavedChanges - gerencia dirty state
const { value, updateValue, save, isDirty } = useUnsavedChanges(initial);

// useSelection - gerencia seleção de items
const { selected, select, clear } = useSelection(items);
```

### 3. Type Safety
✅ Sempre tipar props  
✅ Evitar `any` (usar `unknown` se necessário)  
✅ Interfaces em `types/index.ts`

## Casos de Uso (Referência Rápida)
Ver `docs/USE_CASES.md` para detalhes completos.

**Top 3 mais comuns:**
1. **Onboarding**: Trigger → Delay → Journey → Decision (por dept) → Tag
2. **Performance Review**: Trigger (quarterly) → Journey (self-eval) → Journey (manager-eval) → Decision (rating) → Tag
3. **Offboarding**: Trigger (status change) → Journey (knowledge transfer) → Journey (exit checklist) → Tag Manager (archive)

## APIs Backend (v1)

### Auth
```
Authorization: Bearer <token>
```

### Endpoints
```
GET    /api/v1/employees       # Lista colaboradores
GET    /api/v1/tags            # Tags disponíveis
PATCH  /api/v1/employees/:id   # Atualiza (tags aqui)
GET    /api/v1/employees/:id/journeys
POST   /api/v1/onboarding/start-journey
DELETE /api/v1/onboarding/cancel-journey/:id
```

## Tarefas Comuns

### Adicionar Novo Node Type
1. Criar `src/components/nodes/NewNode.tsx`
2. Export em `src/components/nodes/index.ts`
3. Add to `nodeTypes` object em `FlowEditor.tsx`
4. Add to `nodeFactoryItems` array
5. Add color em `design-system.ts` → `colors.nodes.newType`

### Adicionar Endpoint
1. Add interface em `types/index.ts`
2. Add method em `ApiService.ts`
3. Use em component com try/catch + fallback

### Modificar Design
1. Check se token existe em `design-system.ts`
2. Se não, adicionar lá primeiro
3. Usar token no component (não hardcode)

## Performance

✅ `useCallback` para functions passadas a children  
✅ `React.memo` para components pesados  
✅ Lazy load routes (futuro)  

## Debugging

### Console Errors Comuns

**"Cannot read property 'map'"**
→ Data não carregou. Check se API retornou.

**"SyntaxError: Unexpected token"**
→ Backend down, frontend recebeu HTML em vez de JSON.

**Node não atualiza**
→ Verificar se `updateNode` faz spread correto: `{ ...n, data: { ...n.data, ...patch } }`

## Próximos Steps (Roadmap)

- [ ] Extrair Properties Panel para component separado
- [ ] Criar custom hooks para node operations
- [ ] Add undo/redo (via Immer ou similar)
- [ ] Testes unitários (Vitest)
- [ ] E2E tests (Playwright)

---

**Filosofia**: Código limpo > código esperto. Clareza > brevidade.  
**Regra de ouro**: Se copiou/colou 2x, extraia para function/component.
