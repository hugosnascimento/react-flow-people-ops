# Casos de Uso - Eva People Ops Orchestrator

Este documento descreve casos de uso práticos da ferramenta no contexto de People Operations.

---

## 1. Onboarding de Novos Colaboradores

### Cenário
A empresa precisa automatizar o processo de onboarding para garantir que todos os novos colaboradores passem pelas mesmas etapas, independentemente do departamento.

### Fluxo no Orchestrator

```
[Trigger: ATS Webhook] 
    → Candidato contratado no Greenhouse
    ↓
[Delay: 3 dias antes do D-1]
    → Aguardar até 3 dias antes da data de início
    ↓
[Journey: Pre-boarding]
    → Enviar documentação, acessos iniciais, boas-vindas
    ↓
[Decision: Por Departamento]
    ├─ Tag "tech" → [Journey: Onboarding Tech] (Setup dev, acesso GitHub, Figma)
    ├─ Tag "sales" → [Journey: Onboarding Sales] (CRM training, sales playbook)
    └─ Tag "ops" → [Journey: Onboarding Ops] (Process docs, tools training)
    ↓
[Delay: D+7]
    → Primeira semana completa
    ↓
[Journey: Check-in Week 1]
    → Feedback inicial, ajustes necessários
    ↓
[Delay: D+30]
    → Fim do primeiro mês
    ↓
[Tag Manager: Remove "new-hire", Add "onboarded"]
    → Atualizar status do colaborador
```

### Benefícios
- **Consistência**: Todos passam pelas mesmas etapas
- **Automação**: Reduz trabalho manual do RH
- **Personalização**: Flows específicos por departamento
- **Tracking**: Visibilidade completa do processo

---

## 2. Offboarding Estruturado

### Cenário
Colaborador pede demissão ou é desligado. É necessário garantir que todos os acessos sejam revogados e conhecimento seja transferido.

### Fluxo no Orchestrator

```
[Trigger: HRIS Update]
    → Status do colaborador mudou para "exiting"
    ↓
[Journey: Knowledge Transfer]
    → Documentar responsabilidades, passar contextos
    ↓
[Delay: 15 dias antes do last day]
    → Iniciar preparação de saída
    ↓
[Journey: Exit Checklist]
    → Devolver equipamentos, revogar acessos, exit interview
    ↓
[Tag Manager: Remove todas as tags, Add "former-employee"]
    → Arquivar colaborador
    ↓
[Trigger: Email final]
    → Enviar carta de referência e despedida formal
```

### Benefícios
- **Segurança**: Nenhum acesso esquecido
- **Compliance**: Processo documentado
- **Conhecimento preservado**: Transferência estruturada
- **Experiência positiva**: Offboarding profissional

---

## 3. Programa de Mentoria/Buddy System

### Cenário
Novos colaboradores são pareados com mentores (buddies) para facilitar adaptação.

### Fluxo no Orchestrator

```
[Trigger: New Hire Confirmed]
    → Novo colaborador confirmado
    ↓
[Decision: Por Senioridade]
    ├─ Junior → [Tag Manager: Add "needs-senior-buddy"]
    └─ Mid/Senior → [Tag Manager: Add "needs-peer-buddy"]
    ↓
[Trigger: Slack Bot]
    → Notificar possíveis buddies no canal #people-ops
    ↓
[Delay: 2 dias]
    → Aguardar match manual
    ↓
[Journey: Buddy Program Kickoff]
    → Apresentação, primeira reunião, agenda de check-ins
    ↓
[Delay: +7 dias]
[Journey: Week 1 Check-in]
    ↓
[Delay: +30 dias]
[Journey: Month 1 Review]
    ↓
[Delay: +90 dias]
[Tag Manager: Remove "in-buddy-program", Add "buddy-program-complete"]
```

### Benefícios
- **Retenção**: Novos colaboradores se sentem apoiados
- **Cultura**: Facilita integração
- **Automação**: RH não precisa gerenciar manualmente
- **Visibilidade**: Tracking de progresso

---

## 4. Performance Review Cycle

### Cenário
Realizar ciclos de avaliação de performance trimestralmente de forma estruturada.

### Fluxo no Orchestrator

```
[Trigger: Quarterly Schedule]
    → Início do ciclo de review (ex: 1º dia de cada trimestre)
    ↓
[Journey: Self-Assessment]
    → Colaborador preenche auto-avaliação (14 dias)
    ↓
[Delay: 14 dias]
[Journey: Manager Review]
    → Gestor avalia (7 dias)
    ↓
[Delay: 7 dias]
[Journey: Calibration Meeting]
    → Alinhamento entre gestores (5 dias)
    ↓
[Delay: 5 dias]
[Journey: 1:1 Feedback Session]
    → Reunião de feedback (10 dias)
    ↓
[Decision: Rating]
    ├─ Exceeds → [Tag Manager: Add "high-performer"]
    ├─ Meets → [Tag Manager: Add "good-standing"]
    └─ Below → [Journey: Performance Improvement Plan]
    ↓
[Tag Manager: Add "reviewed-Q{n}"]
```

### Benefícios
- **Consistência**: Mesmo processo para todos
- **Deadlines claros**: Automação de lembretes
- **Transparência**: Status visível para RH
- **Ações automáticas**: PIPs para baixo desempenho

---

## 5. Career Development & Promotion Track

### Cenário
Acompanhar progressão de carreira e elegibilidade para promoções.

### Fluxo no Orchestrator

```
[Trigger: 6 meses no cargo]
    → Colaborador completa 6 meses na posição atual
    ↓
[Tag Manager: Add "eligible-for-progression-review"]
    ↓
[Journey: Skills Assessment]
    → Avaliar skills técnicas e soft skills
    ↓
[Decision: Pronto para promoção?]
    ├─ Sim → [Journey: Promotion Process]
    │         ├─ Validação com gestores
    │         ├─ Aprovação de budget
    │         └─ Anúncio e ajuste salarial
    └─ Não → [Journey: Development Plan]
              ├─ Identificar gaps
              ├─ Criar plano de desenvolvimento
              └─ Agendar reavaliação em 3 meses
```

### Benefícios
- **Transparência**: Critérios claros
- **Proatividade**: RH antecipa conversas
- **Retenção**: Desenvolvimento contínuo
- **Equidade**: Processo justo para todos

---

## 6. Employee Lifecycle Management

### Cenário
Gerenciar marcos importantes ao longo da jornada do colaborador.

### Fluxo no Orchestrator

```
[Trigger: Hire Date Anniversary]
    → A cada ano de empresa
    ↓
[Decision: Tempo de Casa]
    ├─ 1 ano → [Journey: First Year Celebration]
    ├─ 3 anos → [Journey: Loyalty Recognition + Stock Options Review]
    ├─ 5 anos → [Journey: Senior Milestone + Sabbatical Eligibility]
    └─ 10+ anos → [Journey: Long-term Recognition Program]
    ↓
[Tag Manager: Add "tenure-{n}-years"]
    ↓
[Trigger: Congratulations Email + Slack Announcement]
```

### Benefícios
- **Reconhecimento automático**: Ninguém é esquecido
- **Cultura de valorização**: Celebração de milestones
- **Retenção**: Demonstra apreço
- **Consistência**: Mesmo tratamento para todos

---

## 7. Compliance & Training Automation

### Cenário
Garantir que todos os colaboradores completem treinamentos obrigatórios (segurança da informação, compliance, anti-assédio).

### Fluxo no Orchestrator

```
[Trigger: Novo colaborador D+1]
    → Primeiro dia de trabalho
    ↓
[Journey: Mandatory Training]
    ├─ Módulo 1: Info Security (prazo: 7 dias)
    ├─ Módulo 2: Code of Conduct (prazo: 7 dias)
    └─ Módulo 3: Anti-harassment (prazo: 7 dias)
    ↓
[Delay: 7 dias]
[Decision: Completou?]
    ├─ Sim → [Tag Manager: Add "compliance-complete"]
    └─ Não → [Journey: Reminder + Escalation]
              ├─ Lembrete ao colaborador
              ├─ Notificar gestor (D+10)
              └─ Bloquear sistemas se não completar (D+14)
    ↓
[Trigger: Anual]
    → Renovação anual de treinamentos
```

### Benefícios
- **Compliance garantido**: Rastreabilidade total
- **Automação**: Sem esforço manual
- **Escalação inteligente**: Pressão progressiva
- **Auditoria fácil**: Relatórios prontos

---

## 8. Remote Work Management

### Cenário
Colaborador solicita mudança de país/estado. É necessário verificar compliance trabalhista e logística.

### Fluxo no Orchestrator

```
[Trigger: Relocation Request]
    → Colaborador preenche formulário
    ↓
[Decision: Localização]
    ├─ Mesmo país → [Journey: Domestic Relocation]
    │                ├─ Atualizar address
    │                ├─ Ajustar impostos
    │                └─ Enviar welcome pack
    └─ Outro país → [Journey: International Relocation]
                     ├─ Legal review (prazo: 14 dias)
                     ├─ Tax implications (prazo: 14 dias)
                     ├─ Visa/work permit check
                     └─ Decision: Approved?
                         ├─ Sim → [Journey: Relocation Support]
                         └─ Não → [Journey: Alternative Options]
    ↓
[Tag Manager: Update "location-{country}"]
```

### Benefícios
- **Compliance**: Verificações legais automáticas
- **Experiência do colaborador**: Processo transparente
- **Visibilidade**: RH sabe status de todas requisições
- **Escalação**: Aprovações estruturadas

---

## 9. Wellness & Benefits Engagement

### Cenário
Aumentar engajamento com programas de bem-estar e benefícios.

### Fluxo no Orchestrator

```
[Trigger: Quarterly Wellness Campaign]
    → Início de cada trimestre
    ↓
[Journey: Wellness Challenge Launch]
    ├─ Email de apresentação
    ├─ Slack announcement
    └─ Sign-up form
    ↓
[Delay: 7 dias]
[Tag Manager: Add "wellness-participant-Q{n}"]
    ↓
[Journey: Weekly Check-ins]
    ├─ Week 1: Activity tracking
    ├─ Week 2: Mental health resources
    ├─ Week 3: Nutrition tips
    └─ Week 4: Sleep hygiene
    ↓
[Delay: 30 dias]
[Decision: Completion]
    ├─ Completou → [Tag Manager: Add "wellness-champion"] + Reward
    └─ Não completou → [Journey: Re-engagement Campaign]
```

### Benefícios
- **Engajamento automático**: Lembretes consistentes
- **Personalização**: Content relevante por semana
- **Tracking**: Métricas de participação
- **Reconhecimento**: Recompensas para completers

---

## 10. Emergency Contact & Crisis Management

### Cenário
Atualizar e validar informações de contato de emergência regularmente.

### Fluxo no Orchestrator

```
[Trigger: Annual Review]
    → Uma vez por ano
    ↓
[Journey: Emergency Contact Update]
    ├─ Email solicitando confirmação/atualização
    ├─ Link para formulário
    └─ Prazo: 14 dias
    ↓
[Delay: 14 dias]
[Decision: Atualizou?]
    ├─ Sim → [Tag Manager: Add "emergency-contact-updated-{year}"]
    └─ Não → [Journey: Reminder Sequence]
              ├─ Reminder 1 (D+16)
              ├─ Reminder 2 (D+18)
              └─ Manager escalation (D+20)
```

### Benefícios
- **Segurança**: Informações sempre atualizadas
- **Compliance**: Requisito legal atendido
- **Automação**: Sem trabalho manual de RH
- **Cobertura**: 100% dos colaboradores

---

## Como Usar Este Documento

1. **Identificar necessidade**: Qual processo você quer automatizar?
2. **Mapear o fluxo**: Desenhe o flow usando os casos como referência
3. **Configurar nodes**: Use Trigger, Journey, Decision, Tag, Delay conforme necessário
4. **Testar**: Rode em draft com grupo pequeno
5. **Publicar**: Ative o orchestrator

---

**Estes são apenas exemplos. O Orchestrator é flexível para atender qualquer workflow de People Ops.**
