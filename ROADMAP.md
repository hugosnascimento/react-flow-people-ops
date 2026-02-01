# 🗺️ Roadmap - Eva People Ops Orchestrator

## ✅ Fase 1: Foundation (CONCLUÍDA)

### Infraestrutura Base
- [x] React + TypeScript + Vite setup
- [x] React Flow integração
- [x] Design system completo
- [x] 5 tipos de nós (Trigger, Journey, Decision, Tag, Delay)
- [x] Flow editor com drag-and-drop
- [x] Dashboard de orchestrators
- [x] Documentação completa

### Backend Integration
- [x] ApiService type-safe
- [x] Contratos API v1 documentados
- [x] Mock engine para desenvolvimento offline
- [x] Autenticação Bearer token

### Code Quality
- [x] DRY aplicado (componentes reutilizáveis)
- [x] Hooks customizados
- [x] Save explícito (não auto-save)
- [x] Estrutura de pastas simplificada
- [x] Contexto otimizado para IA

---

## 🚧 Fase 2: Completar Core Features (PRIORIDADE ALTA)

### Editor Enhancements
- [ ] **Properties Panel** - Extrair para component separado
  - [ ] TriggerNodeProps.tsx
  - [ ] JourneyNodeProps.tsx
  - [ ] DecisionNodeProps.tsx
  - [ ] TagNodeProps.tsx
  - [ ] DelayNodeProps.tsx

- [ ] **Node Validation** - Validar antes de salvar
  - [ ] Trigger: endpoint obrigatório
  - [ ] Journey: journeyId obrigatório
  - [ ] Decision: pelo menos 1 case
  - [ ] Tag: pelo menos addTag ou removeTag
  - [ ] Delay: delayValue > 0

- [ ] **Undo/Redo** - Histórico de mudanças
  - [ ] Implementar com Immer
  - [ ] Keyboard shortcuts (Ctrl+Z, Ctrl+Y)
  - [ ] Indicador visual de histórico

- [ ] **Copy/Paste Nodes** - Duplicar nós facilmente
  - [ ] Ctrl+C / Ctrl+V
  - [ ] Manter connections quando faz sentido

### UI/UX Improvements
- [ ] **Loading States** - Skeleton screens
- [ ] **Error Boundaries** - Isolar falhas
- [ ] **Toast Notifications** - Feedback visual
- [ ] **Keyboard Shortcuts** - Produtividade
  - [ ] Ctrl+S: Save
  - [ ] Ctrl+Z: Undo
  - [ ] Del: Delete node
  - [ ] Esc: Deselect

### Data Management
- [ ] **Local Storage** - Auto-save draft local
- [ ] **Export/Import** - JSON de orchestrators
- [ ] **Templates** - Workflows pré-configurados
  - [ ] Onboarding padrão
  - [ ] Offboarding padrão
  - [ ] Performance review

---

## 🎨 Fase 3: Polish & Scale (MÉDIO PRAZO)

### Testing
- [ ] **Unit Tests** - Vitest
  - [ ] Hooks: useUnsavedChanges, useSelection
  - [ ] UI components: Button, Input, Select
  - [ ] Utils: design-system helpers

- [ ] **Integration Tests** - Vitest + React Testing Library
  - [ ] FlowEditor interactions
  - [ ] Node CRUD operations
  - [ ] Save/Load workflows

- [ ] **E2E Tests** - Playwright
  - [ ] Create orchestrator flow
  - [ ] Edit and save workflow
  - [ ] Publish orchestrator

### Developer Experience
- [ ] **Storybook** - Component library
  - [ ] Todos components de ui/
  - [ ] Todos node types
  - [ ] Estados: loading, error, empty

- [ ] **ESLint + Prettier** - Code quality
- [ ] **Husky** - Pre-commit hooks
- [ ] **CI/CD** - GitHub Actions
  - [ ] Lint + type-check
  - [ ] Run tests
  - [ ] Build preview

### Documentation
- [ ] **Video Tutorial** - Walkthrough completo
- [ ] **Interactive Demo** - Sandbox online
- [ ] **API Examples** - Código copy-paste
- [ ] **Troubleshooting** - FAQs

---

## 🚀 Fase 4: Advanced Features (LONGO PRAZO)

### Collaboration
- [ ] **Version Control** - Git-like para workflows
- [ ] **Comments** - Anotações em nodes
- [ ] **Team Permissions** - Roles (viewer, editor, admin)
- [ ] **Audit Log** - Quem mudou o quê

### Analytics & Monitoring
- [ ] **Real-time Execution** - Ver flows rodando
- [ ] **Analytics Dashboard** - Métricas de sucesso
  - [ ] Journey completion rates
  - [ ] Failed nodes
  - [ ] Average execution time

- [ ] **Alerts** - Notificações de falhas
- [ ] **Retry Logic** - Auto-retry em erros transientes

### Integrations
- [ ] **Webhook Support** - Triggers externos
- [ ] **OAuth Providers** - Google, Microsoft, etc
- [ ] **Custom Scripts** - JavaScript sandbox
- [ ] **AI Assistant** - Sugestões de workflows

### Advanced Nodes
- [ ] **ConditionalDelayNode** - "Esperar até sexta-feira"
- [ ] **ParallelNode** - Executar múltiplos paths
- [ ] **LoopNode** - Repetir ações
- [ ] **SubflowNode** - Orchestrators dentro de orchestrators
- [ ] **DataTransformNode** - Manipular dados

---

## 🎯 Métricas de Sucesso

### Phase 2 (3 meses)
- [ ] Properties panel completo
- [ ] Undo/Redo funcionando
- [ ] Templates básicos criados
- [ ] Validação de nodes
- [ ] 80% code coverage (tests)

### Phase 3 (6 meses)
- [ ] Storybook completo
- [ ] CI/CD rodando
- [ ] E2E tests cobrindo happy paths
- [ ] Documentação com vídeos

### Phase 4 (12 meses)
- [ ] Real-time execution
- [ ] Analytics dashboard
- [ ] 5+ integrações third-party
- [ ] AI-powered suggestions

---

## 💡 Ideias Futuras (Backlog)

- [ ] Mobile app (React Native)
- [ ] CLI tool (para automação)
- [ ] VS Code extension
- [ ] Marketplace de templates
- [ ] White-label solution

---

## 📊 Current Status

**Fase 1**: ✅ 100% concluída  
**Fase 2**: ⏳ 0% (pendente)  
**Fase 3**: ⏳ 0% (pendente)  
**Fase 4**: ⏳ 0% (planejamento)

**Próximo Milestone**: Completar Properties Panel (Fase 2)

---

**Última Atualização**: 2026-02-01  
**Mantido por**: Hugo Soares Nascimento
