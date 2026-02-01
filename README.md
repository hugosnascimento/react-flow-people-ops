# People Ops Flow Orchestrator

Plataforma unificada para orquestração de processos de People Ops, integrando ATS, HCM, LMS e Ferramentas de Comunicação em fluxos visuais automatizados.

## 🚀 Visão Geral

O **People Ops Orchestrator** permite desenhar e automatizar jornadas complexas do colaborador (Onboarding, Offboarding, Mobilidade) sem código, conectando ferramentas dispersas em um único fluxo lógico.

### ✨ Principais Features

- **Editor Visual de Fluxos**: Arraste e solte nós (Trigger, Journey, Decision, Delay, Tag).
- **Hub de Integrações**: Gerenciamento centralizado de conexões (Gupy, Eva, LG, etc).
- **Monitoramento em Tempo Real**: Visualize a execução de cada colaborador no fluxo.
- **Ricas Bibliotecas de Nós**:
  - `Trigger`: Webhooks e API polling.
  - `Journey`: Dispara jornadas na Eva.
  - `Decision`: Lógica condicional (Se/Então).
  - `Tag Manager`: Normalização de dados e controle de estado.
  - `Delay`: Pausas temporais inteligentes (dias úteis, datas específicas).

## 🛠️ Stack Tecnológica

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Visualização**: React Flow
- **Build**: Vite
- **Ícones**: Material Symbols & Logos (Clearbit)

## 📦 Estrutura do Projeto

```
src/
├── components/
│   ├── editor/          # Lógica do Canvas (FlowEditor)
│   ├── nodes/           # Componentes Visuais dos Nós
│   ├── properties/      # Painéis de Configuração (Sidebar direita)
│   ├── integrations/    # Hub de Integrações (App Store)
│   └── dashboard/       # Visão geral dos orquestradores
├── context/
│   └── AuthContext.tsx  # Gestão de Sessão e Billing Mocado
└── types/               # Definições TypeScript globais
```

## 🔌 Integrações e Extensibilidade

O sistema possui um **Integrations Hub** onde é possível:
1.  **Conectar Apps**: Ativar/Desativar integrações pré-instaladas.
2.  **Configurar Credenciais**: Base URL, Tokens e Autenticação (OAuth2/API Key).
3.  **Adicionar Custom Apps**: Criar novas conexões genéricas para qualquer API.

As integrações configuradas aparecem automaticamente no **Trigger Node**, simplificando a configuração técnica dos fluxos.

## 🚦 Como Rodar

1. Instale as dependências:
```bash
npm install
```

2. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse `http://localhost:5173`

---

**Powered by Orchestrator Engine v1.0**
