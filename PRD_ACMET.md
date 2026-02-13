# PRD — Orquestrador de People Ops (React Flow)

## 1. Visão do Produto
O Orquestrador de People Ops é um orquestrador visual de operações de People Ops, construído sobre React Flow e com foco em **orquestração de comunicações e fluxos de RH**. Ele foi criado para permitir que times de People Ops e TI desenhem fluxos de onboarding, pré‑boarding, notificações e segmentações de colaboradores sem acoplar a lógica a um canal ou fornecedor específico. A proposta central é ser **API‑first**, integrando com sistemas externos para executar ações (ex.: atualização de tags), enquanto mantém a **lógica de orquestração (API)** separada da **camada de visualização (UI)**, permitindo reuso em diferentes integrações e interfaces.

## 2. Problema que o produto resolve
Times de People Ops lidam com processos complexos e repetitivos (onboarding, mudanças internas, notificações recorrentes). Esses processos costumam depender de múltiplos canais (email, Slack, WhatsApp, etc.) e de integrações com sistemas externos (ATS, HRIS). O Orquestrador de People Ops resolve:
- Falta de visibilidade sobre os fluxos de comunicação entre sistemas e pessoas.
- Dificuldade em alterar ou escalar processos de People Ops sem custo de engenharia.
- Dependência de integrações específicas e não reutilizáveis.
- Necessidade de uma aplicação **enxuta** que consome APIs externas para operar sem exigir grandes adaptações nos sistemas de origem.

## 3. Objetivos de Negócio
- **Padronizar** a criação e manutenção de fluxos de People Ops.
- **Reduzir tempo de implementação** de novos processos de RH.
- **Tornar a orquestração auditável** com logs de execução e monitoramento visual.
- **Permitir escalabilidade** via arquitetura hexagonal e API‑first.

## 4. Público‑alvo (Personas)
1. **People Ops Manager**: precisa desenhar e ajustar fluxos de onboarding e comunicação sem depender de desenvolvedores.
2. **HR Tech / Engenheiro de Integrações**: integra canais externos e mantém a confiabilidade de execução.
3. **Product/Tech Lead**: busca eficiência e governança em processos de RH.

## 5. Casos de Uso Principais
- **Onboarding e pré‑boarding** com múltiplos passos e segmentação por tags (ex: CLT, PJ, Intern).
- **Notificações recorrentes** (ex: férias, folha de pagamento, compliance).
- **Segmentação condicional** por atributos e tags de colaboradores.
- **Orquestração multicanal** (email, Slack, Teams, WhatsApp, SMS, Telegram).
- **Monitoramento de execução** para auditoria de falhas.

## 6. Escopo Atual (MVP / Estado do Projeto)
### 6.1. Funcionalidades de UI
- **Dashboard de Orquestradores** com status (draft/published), saúde de execução e ações de edição/monitoramento.
- **Editor Visual de Fluxos** com React Flow, incluindo criação e conexão de nós.
- **Painel de Propriedades do Nó** para edição contextual.
- **Monitor de Execução** (execution log) com eventos de sucesso/erro e métricas visuais.

### 6.2. Tipos de Nós Disponíveis
- **Start Flow (Iniciar Fluxo)**: Referencia jornadas de People Ops existentes para iniciar o processo.
- **Conditional (Condicional)**: Cria ramificações com base em regras lógicas (ex: departamento, cargo, senioridade).
- **Human In The Loop**: Atribui tarefas manuais de aprovação ou input para um responsável (ex: Gestor, RH).
- **Notification (Notificação)**: Envia comunicações via Email, Slack, WhatsApp ou Teams. **Principal mecanismo de fallback** e tratamento de erros.

### 6.3. Novas Funcionalidades
- **Execution Snapshots**: Visualização histórica da execução de fluxos, permitindo "viajar no tempo" para auditar o estado dos nós.
- **Advanced Settings**: Configurações de **Delay** incorporadas diretamente nos nós, sem necessidade de um nó dedicado.
- **Tratamento de Erros**: Centralizado no nó de Notificação.

### 6.4. APIs Mockadas (Documentação)
- Operações para listagem de colaboradores e jornadas.

## 7. Requisitos Funcionais (FR)
1. Criar/editar orquestradores com nós conectáveis (Start Flow, Conditional, HITL, Notification).
2. Definir lógica condicional (branching) por atributos de colaboradores.
3. Atribuir tarefas humanas com timeout.
4. Enviar notificações multicanal (Email, Slack, WhatsApp).
5. Visualizar **Snapshots de Execução** para auditoria visual e depuração.
6. Configurar delays diretamente nas propriedades dos nós.

## 8. Requisitos Não‑Funcionais (NFR)
- **Arquitetura hexagonal** (domínio isolado, API como contrato, adaptadores substituíveis).
- **Independência de canal e fornecedor** para comunicações.
- **Extensibilidade** para novos canais, tipos de nós e integrações externas.

## 9. Métricas de Sucesso (KPIs)
- **Horas economizadas** na execução de jornadas de People Ops (comparando execução manual vs. orquestrada).
- **Tempo total de execução** das jornadas (humano vs. orquestrador), medindo redução de ciclo.
- **Redução de retrabalho** causado por erros humanos (ex.: falhas de comunicação, perda de prazos).
- **Taxa de erro operacional** (eventos de falha por etapa/fluxo).
- **Digitalização de jornada**: % de etapas executadas de forma automatizada vs. manual.

## 10. Não‑Objetivos (Out of Scope por agora)
- Persistência real em banco de dados (o estado é local/UI).
- Execução real de fluxos em produção (hoje é mock e prototipação).
- Gestão de usuários e autenticação própria (a aplicação não gerencia usuários; integra com sistemas externos).
- Autenticação e RBAC completos na própria plataforma.

## 11. Premissas e Restrições
- UI é **um adaptador visual**, não o núcleo do produto.
- A propriedade intelectual principal é a **API de orquestração**, não a interface.
- A aplicação **não faz gestão de usuários**; ela se conecta a sistemas externos para atualização de campos e execução de ações.
- O projeto está em estágio experimental, com foco em arquitetura e prototipação.

## 12. Dependências e Integrações
- **React Flow** como camada de visualização.
- Integrações externas (ATS, HRIS, etc.) representadas via gatilhos e APIs mockadas.

## 13. Glossário
- **Orchestrator**: fluxo de People Ops com nós conectados.
- **FlowDefinition**: modelo do fluxo na API (intents de comunicação).
- **CommunicationIntent**: instrução abstrata de comunicação (canal + audiência + template).
- **Journey**: jornada externa de People Ops com passos e SLA.
- **Tag Manager**: nó responsável por adicionar/remover tags.

---

## Anexos de Referência
- README: visão geral e arquitetura.
- API_DOCUMENTATION: contratos mockados de tags.
- Código do experimento `people-ops-orchestrator-v1` (API e domínio).
- UI principal no `src/App.tsx`.
