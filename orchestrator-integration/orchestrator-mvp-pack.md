# Orchestrator MVP — Pacote único (copiar/colar)

Este arquivo **único** contém tudo que você precisa para levar ao outro repositório (`react-flow-people-ops`).
O objetivo é reduzir ao máximo o número de arquivos e facilitar a extração.

---

# 1) O QUE FAZER NO OUTRO REPOSITÓRIO (INSTRUÇÕES PARA O ASSISTENTE)

**Contexto**: O Orchestrator (front-end) precisa disparar a Eva via HTTP com segurança, usando os endpoints já existentes.

**Tarefas que o assistente deve executar no outro repo**:

1. Criar um módulo (ou pasta) chamado `orchestrator-integration/` (ou similar) contendo **apenas** um arquivo:
   - `orchestrator-mvp-pack.md` (este arquivo inteiro, copiado como está).

2. Implementar no front-end **três chamadas HTTP** usando o contrato abaixo:
   - `POST /onboarding/startJourney`
   - `POST /onboarding/bulk/start-journey-by-tag`
   - `DELETE /onboarding/cancel-journey/:journeyId`

3. Implementar uma camada simples de **service/client** (ex.: `EvaClient`) com métodos:
   - `startJourney({ userId, journeyId, startDate })`
   - `startJourneyByTag({ workspaceId, journeyId, tagId, startDate })`
   - `cancelJourney({ journeyId, users })`

4. Implementar **mocks** usando os exemplos abaixo (curl / HTTP request) para testes manuais.

5. Opcional (futuro): adicionar header `Authorization: Bearer <token>` para Auth0 (sem exigir agora).

---

# 2) CONTRATO FUNCIONAL (MVP)

## 2.1 Start Journey (1 usuário)
**Endpoint**: `POST /onboarding/startJourney`

**Request**:
```json
{
  "userId": "<ObjectId>",
  "journeyId": "<ObjectId>",
  "startDate": "2026-01-15T12:00:00.000Z"
}
```

**Response**: `200 OK`

---

## 2.2 Start Journey por tag (grupo)
**Endpoint**: `POST /onboarding/bulk/start-journey-by-tag`

**Request**:
```json
{
  "workspaceId": "<ObjectId>",
  "journeyId": "<ObjectId>",
  "tagId": "<ObjectId>",
  "startDate": "2026-01-15T12:00:00.000Z"
}
```

**Response**: `200 OK`

---

## 2.3 Cancel Journey (descadastrar usuários)
**Endpoint**: `DELETE /onboarding/cancel-journey/:journeyId`

**Request**:
```json
{
  "users": ["<ObjectId>", "<ObjectId>"]
}
```

**Response**: `200 OK`

---

# 3) DELAY ENTRE STEPS DO ORCHESTRATOR (REGRAS)

- O Orchestrator controla **quando** chamar a Eva (offset de dias).
- A Eva aplica o delay interno a partir do `startDate` informado.
- Portanto, o Orchestrator deve calcular `startDate` para cada ação e **chamar no momento certo**.

---

# 4) Mocks e Requests (prontos)

## 4.1 JSONs de exemplo

### start-journey.json
```json
{
  "userId": "64b7f6f2a1b2c3d4e5f67890",
  "journeyId": "64b7f6f2a1b2c3d4e5f67891",
  "startDate": "2026-01-15T12:00:00.000Z"
}
```

### start-journey-by-tag.json
```json
{
  "workspaceId": "64b7f6f2a1b2c3d4e5f67899",
  "journeyId": "64b7f6f2a1b2c3d4e5f67891",
  "tagId": "64b7f6f2a1b2c3d4e5f67900",
  "startDate": "2026-01-15T12:00:00.000Z"
}
```

### cancel-journey.json
```json
{
  "users": [
    "64b7f6f2a1b2c3d4e5f67890",
    "64b7f6f2a1b2c3d4e5f67892"
  ]
}
```

---

## 4.2 Requests prontos (curl)

```bash
BASE_URL=${BASE_URL:-"http://localhost:3000"}

# Start Journey (single user)
curl -sS -X POST "$BASE_URL/onboarding/startJourney" \
  -H "Content-Type: application/json" \
  -d '{"userId":"64b7f6f2a1b2c3d4e5f67890","journeyId":"64b7f6f2a1b2c3d4e5f67891","startDate":"2026-01-15T12:00:00.000Z"}' \
  -w "\nHTTP %{http_code}\n"

# Start Journey (by tag)
curl -sS -X POST "$BASE_URL/onboarding/bulk/start-journey-by-tag" \
  -H "Content-Type: application/json" \
  -d '{"workspaceId":"64b7f6f2a1b2c3d4e5f67899","journeyId":"64b7f6f2a1b2c3d4e5f67891","tagId":"64b7f6f2a1b2c3d4e5f67900","startDate":"2026-01-15T12:00:00.000Z"}' \
  -w "\nHTTP %{http_code}\n"

# Cancel Journey
curl -sS -X DELETE "$BASE_URL/onboarding/cancel-journey/64b7f6f2a1b2c3d4e5f67891" \
  -H "Content-Type: application/json" \
  -d '{"users":["64b7f6f2a1b2c3d4e5f67890","64b7f6f2a1b2c3d4e5f67892"]}' \
  -w "\nHTTP %{http_code}\n"
```

---

# 5) OpenAPI (compacto, inline)

```yaml
openapi: 3.0.3
info:
  title: Eva Orchestrator MVP API
  version: 0.1.0
servers:
  - url: http://localhost:3000
paths:
  /onboarding/startJourney:
    post:
      summary: Start Journey para um usuário
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [userId, journeyId, startDate]
              properties:
                userId: { type: string }
                journeyId: { type: string }
                startDate: { type: string, format: date-time }
      responses:
        '200': { description: OK }
  /onboarding/bulk/start-journey-by-tag:
    post:
      summary: Start Journey por tag
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [workspaceId, journeyId, tagId, startDate]
              properties:
                workspaceId: { type: string }
                journeyId: { type: string }
                tagId: { type: string }
                startDate: { type: string, format: date-time }
      responses:
        '200': { description: OK }
  /onboarding/cancel-journey/{journeyId}:
    delete:
      summary: Cancelar journey para usuários
      parameters:
        - in: path
          name: journeyId
          required: true
          schema: { type: string }
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [users]
              properties:
                users:
                  type: array
                  items: { type: string }
      responses:
        '200': { description: OK }
```

---

# 6) Observações rápidas

- MVP sem autenticação, mas deixar preparado para `Authorization: Bearer <token>`.
- Evitar publicar jobs diretamente no Bull; usar apenas HTTP.
- A Eva aplica o agendamento interno dos steps usando `startDate`.
