# Eva Orchestrator API - Documentação de Contratos v1

Esta documentação reflete as assinaturas reais dos endpoints do backend (v1) para integração com o novo front-end.

## Autenticação
Todos os endpoints em `/api/v1/*` utilizam o middleware `requireApiAuth`.
É necessário enviar um Bearer token no header `Authorization`.

**Headers Esperados:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

---

## 1. Listar Usuários (Employees)
Retorna a lista de colaboradores com paginação e filtros.

- **Endpoint:** `GET /api/v1/employees`
- **Método:** `GET`
- **Query Params:**
  - `page` (integer)
  - `pageSize` (integer, default 10)
  - `query` (string) - Busca por nome ou email
  - `tags[]` (array de ObjectId) - Filtro por tags
  - `journeyId` (ObjectId) - Filtro por journey vinculada
  - `journeyStatus` (started | completed | cancelled)

---

## 2. Listar Tags
Recupera todas as tags cadastradas no sistema.

- **Endpoint:** `GET /api/v1/tags`
- **Método:** `GET`

---

## 3. Atribuir / Excluir Tags
A atualização de tags é feita através do endpoint de atualização parcial do usuário.

- **Endpoint:** `PATCH /api/v1/employees/{userId}`
- **Método:** `PATCH`
- **Body Esperado (Parcial):**
```json
{
  "tags": ["<tagId1>", "<tagId2>"]
}
```

---

## 4. Listar Fluxos/Journeys por Usuário
Retorna o histórico de jornadas de um colaborador específico.

- **Endpoint:** `GET /api/v1/employees/{userId}/journeys`
- **Método:** `GET`
- **Query Params:**
  - `journeyType` (baseDateOffset | fixedDate)
  - `external` (boolean, opcional)

---

## 5. Iniciar Journey
Inicia uma nova jornada de onboarding para um colaborador.

- **Endpoint:** `POST /api/v1/onboarding/start-journey`
- **Método:** `POST`
- **Body Esperado:**
```json
{
  "userId": "<ObjectId>",
  "journeyId": "<ObjectId>",
  "startDate": "<date>",
  "preventReplace": false
}
```

---

## 6. Cancelar Journey
Interrompe jornadas em andamento para uma lista de usuários.

- **Endpoint:** `DELETE /api/v1/onboarding/cancel-journey/{journeyId}`
- **Método:** `DELETE`
- **Body Esperado:**
```json
{
  "users": ["<userId1>", "<userId2>"]
}
```
