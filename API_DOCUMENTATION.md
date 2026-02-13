# API & Functional Documentation

## Orchestrator Service
Base URL: `/api/v1/orchestrator`

### 1. Get Orchestrator
**Endpoint:** `GET /:id`
**Description:** Retrieves the full configuration of a specific orchestrator, including nodes and edges.
**Response:**
```json
{
  "id": "o-123",
  "name": "Onboarding Flow",
  "nodes": [...],
  "edges": [...]
}
```

### 2. Create Orchestrator
**Endpoint:** `GET /create`
**Description:** Initializes a new orchestrator and returns its ID or a redirect URL.
**Response:**
```json
{
  "id": "o-new-456",
  "status": "created"
}
```

### 3. Update Orchestrator
**Endpoint:** `PUT /:id`
**Description:** Updates the orchestrator's structure (nodes, edges) and metadata.
**Payload:**
```json
{
  "name": "Updated Flow Name",
  "nodes": [...],
  "edges": [...]
}
```

### 4. Start Instance
**Endpoint:** `POST /instance/start`
**Description:** Triggers a new execution instance of a published orchestrator.
**Payload:**
```json
{
  "orchestratorId": "o-123",
  "triggerData": {
    "employeeId": "emp-001",
    "context": "hiring"
  }
}
```

---

## Node Functional Requirements

### Human In The Loop Node
**Type:** `humanInTheLoop`
**Purpose:** Pauses the workflow until a human actor approves or denies the task.
**Required Fields:**
- `assignee`: (String) The email or role of the person responsible.
- `description`: (String) Instructions for the approver.
**Outputs:**
- `approved`: Connected when the task is approved.
- `rejected`: Connected when the task is rejected.
- `timeout`: (Implicit) System handles timeout based on configuration.

### System Update Node
**Type:** `systemUpdate`
**Purpose:** Executes a side-effect or update in an external system.
**Required Fields:**
- `system`: (String) The target system name (e.g., "Eva People", "Salesforce").
- `action`: (String) The script or method to execute.
**Optional Fields:**
- `payload`: (JSON String) Additional data parameters for the action.
**Outputs:**
- `success`: Connected when the action completes successfully.
- `error`: Connected when the action fails.

### Trigger Node
**Type:** `trigger`
**Purpose:** Entry point for the workflow.
**Required Fields:**
- `type`: Must be 'trigger'.
**Configuration:**
- `endpoint`: The webhook URL generating the event.
- `method`: HTTP Method (POST/GET).

### Conditional Node
**Type:** `conditional`
**Purpose:** Routes flow based on data rules.
**Configuration:**
- Dynamic handles based on rules (A, B, C...).
- Default `else-handle` for fallback.

---

## Integration Notes
- All nodes must have a unique `id`.
- Edges are colored dynamically in the editor based on the source handle (`approved`=green, `rejected`=red, `success`=blue, `error`=orange).
