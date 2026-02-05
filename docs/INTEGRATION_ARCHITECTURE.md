# Arquitetura de Integrações

Este documento descreve como o sistema gerencia conexões externas e como elas são expostas no orquestrador.

## Fluxo de Dados

1.  **Integrations Hub (`src/components/integrations`)**:
    *   Gerencia a lista mestre de objetos `Integration`.
    *   Armazena metadados (Logo, Nome, Tipo) e dados técnicos (BaseURL, AuthType).
    *   Permite CRUD (Create, Update) de configurações.

2.  **App State (`src/App.tsx`)**:
    *   Mantém o estado global `integrations`.
    *   Passa este estado para o `FlowEditor`.

3.  **Flow Editor (`src/components/FlowEditor.tsx`)**:
    *   Recebe a lista de integrações.
    *   Injeta no `TriggerPropsEditor`.

4.  **Property Panel (`src/components/properties/TriggerPropsEditor.tsx`)**:
    *   Exibe dropdown de integrações ativas.
    *   Ao selecionar, preenche automaticamente metadados no `Node Data`.

5.  **Node Visualization (`src/components/nodes/TriggerNode.tsx`)**:
    *   Lê `data.integrationLogo` e renderiza visualmente no card.

## Modelo de Dados (Integration)

```typescript
interface Integration {
  id: string;
  name: string;
  type: 'ATS' | 'HCM' | 'LMS' | 'Communication' | 'Engagement' | 'Other';
  logo: string;
  status: 'active' | 'inactive';
  description: string;
  baseUrl?: string;     // URL base para chamadas API
  authType?: string;    // 'API Key' | 'OAuth2' | 'Basic'
}
```

## Boas Práticas

*   **Logos**: Use URLs públicas (ex: Clearbit) ou base64.
*   **Segurança**: Em um ambiente real, `authSecret` nunca deve ser exposto no frontend. Aqui estamos mocando.
*   **Whitelabel**: O sistema é agnóstico ao fornecedor (Gupy, Greenhouse, Lever funcionam igual).
