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

## Supabase setup (API-first backend)

This project uses Supabase Postgres for persistence and Supabase Edge Functions as the API layer. The browser only calls the Edge Functions. Do not connect the database directly in the front-end.

### What you need from Supabase

1. Supabase URL.
2. Supabase anon key.
3. Supabase service role key. This is only for Edge Functions.
4. Supabase project ref. This is for `supabase link`.
5. A workspace API key. You choose this secret.

### Create a Supabase project

1. Go to https://app.supabase.com and create a project.
2. Open Settings. Then open API.
3. Copy the Project URL and the anon key.
4. Go to Settings. Then open API Keys.
5. Copy the service role key.

### Configure local environment

1. Copy `.env.example` to `.env`.
2. Fill `VITE_SUPABASE_URL`.
3. Fill `VITE_SUPABASE_ANON_KEY`.
4. Fill `VITE_WORKSPACE_API_KEY`.

### Configure Supabase CLI

1. Install the Supabase CLI.
2. Run `supabase link` and use your project ref.
3. Run `supabase start`.

### Apply database migrations

1. Run `supabase db reset`.
2. This applies the SQL files in `supabase/migrations`.
3. The seed creates a default workspace with key `CHANGE_ME`.
4. Generate a new key and hash it before production.
5. Use `node scripts/hashWorkspaceKey.mjs "<key>"`.
6. Replace the hash in `workspaces.api_key_hash`.

### Set Edge Function secrets

1. Run `supabase secrets set SUPABASE_URL=...`.
2. Run `supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...`.

### Run Edge Functions locally

1. Run `supabase functions serve --no-verify-jwt`.
2. The API is available at `/functions/v1/api`.

### Run the front-end

1. Run `npm run dev`.
2. Open the Vite URL.

### Deploy Edge Functions

1. Run `supabase functions deploy api --no-verify-jwt`.
2. Run `supabase functions list` to verify.

## Workspace API key

All API routes require the `x-workspace-key` header. The key is hashed in the database. Keep the raw key in `.env`. Do not commit it.

To rotate the key:

1. Generate a new key.
2. Hash it with SHA-256.
3. Update `workspaces.api_key_hash`.
4. Update your `.env` and Supabase secrets.

## License

---

**Powered by Orchestrator Engine v1.0**
