# Eva Orchestrator API - Documentação de Contratos (Mock)

Abaixo estão os contratos da API utilizados pelo Orchestrator para gerenciar tags e fluxos de colaboradores. 

## Autenticação
Todas as requisições devem incluir o header:
`Authorization: Bearer <eva_token>`

---

## 1. Listar Tags do Workspace
Recupera a lista global de tags disponíveis para segmentação.

- **Endpoint:** `GET /tags/workspace`
- **Response (200 OK):**
```json
{
  "tags": ["vip", "standard", "lideranca", "tech", "sales", "externo", "engajado"]
}
```

---

## 2. Listar Tags de um Colaborador
Retorna as tags atualmente atribuídas a um colaborador específico.

- **Endpoint:** `GET /collaborators/:id/tags`
- **Path Params:** `id` (String) - UUID do colaborador.
- **Response (200 OK):**
```json
{
  "collaborator_id": "1",
  "tags": ["vip", "engajado"]
}
```
- **Error (404 Not Found):** `{"error": "Collaborator not found"}`

---

## 3. Adicionar Tag a um Colaborador (Idempotente)
Atribui uma nova tag ao perfil do colaborador. Evita duplicidade automaticamente.

- **Endpoint:** `POST /collaborators/:id/tags`
- **Payload:**
```json
{
  "tag": "lideranca"
}
```
- **Business Rules:** 
  - Se a tag já existir, retorna `201` ou `200` sem alteração (Idempotência).
  - A tag deve existir no workspace.
- **Response (201 Created):** `{"message": "Tag added successfully"}`
- **Error (401 Unauthorized):** `{"error": "Invalid token"}`

---

## 4. Remover Tag de um Colaborador
Remove uma tag específica do perfil do colaborador.

- **Endpoint:** `DELETE /collaborators/:id/tags/:tag`
- **Business Rules:**
  - Se a tag não existir no perfil, retorna `200 OK` (Operação bem sucedida, estado final atingido).
- **Response (200 OK):** `{"message": "Tag removed"}`

---

## Códigos de Erro Padronizados
| Código | Significado | Motivo Comum |
|--------|-------------|--------------|
| 200/201| Success | Operação concluída ou estado desejado atingido. |
| 400 | Bad Request | Payload malformado ou tag inválida. |
| 401 | Unauthorized | Token expirado ou ausente. |
| 404 | Not Found | Colaborador não existe na base. |
| 409 | Conflict | Tentativa de adicionar tag em estado de conflito de transição. |
