# Eva People Ops Orchestrator - Architecture & Patterns

## System Architecture

### High-Level Overview

```
┌───────────────────────────────────────────────────────────┐
│                    USER INTERFACE                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Dashboard   │  │ Flow Editor │  │ Collaborators│       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└───────────────────────────┬───────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                 APPLICATION SERVICES                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ ApiService  │  │ EvaEngine   │  │ StateManager│       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└───────────────────────────┬───────────────────────────────┘
                            │
┌───────────────────────────▼───────────────────────────────┐
│                    DOMAIN MODELS                          │
│         Types, Interfaces, Business Rules                 │
└───────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. Presentation Layer (`src/components/`)

**Responsibility**: UI rendering and user interaction

#### Node Components (`src/components/nodes/`)
- **TriggerNode**: External API/webhook triggers
- **JourneyNode**: Onboarding/offboarding flow initiators
- **DecisionNode**: Conditional routing based on tags/context
- **TagManagerNode**: Add/remove employee tags
- **DelayNode**: Time-based waiting periods

Each node is:
- Self-contained React component
- Receives data via props
- Renders with design system tokens
- Emits events via React Flow

#### Feature Components
- **FlowEditor**: Canvas for building workflows
- **DashboardView**: List and manage orchestrators
- **CollaboratorsView**: Employee management interface
- **MonitorView**: Execution logs and analytics

### 2. Service Layer (`src/services/`)

**Responsibility**: Business logic and external communication

#### ApiService
```typescript
class ApiService {
  private token: string | null;
  
  setToken(token: string): void
  getEmployees(params): Promise<Collaborator[]>
  getTags(): Promise<Tag[]>
  updateEmployee(id, data): Promise<void>
  getUserJourneys(id): Promise<UserJourney[]>
  startJourney(request): Promise<void>
  cancelJourney(id, users): Promise<void>
}
```

**Pattern**: Singleton with method-based API

#### EvaEngine
```typescript
class EvaEngine {
  getJourneys(): ExternalJourney[]
  getNodeExecutions(): NodeExecutionEvent[]
  logNodeHandoff(label, status, details): void
  logExecutionError(label, error): void
}
```

**Pattern**: Mock/demo service for offline development

### 3. Domain Layer (`src/types/`)

**Responsibility**: Type definitions and business rules

#### Core Types
- `Orchestrator`: Workflow definition
- `WorkflowNodeData`: Node configuration
- `Collaborator`: Employee record
- `Tag`: Context/segmentation marker
- `UserJourney`: Active onboarding/offboarding process

## Design Patterns

### 1. **Hexagonal Architecture**

The UI is an **adapter**, not the core. The orchestration logic can be consumed by:
- Web UI (current)
- Mobile app
- CLI tool
- API-only backend

### 2. **Composition Over Inheritance**

Components are composed of smaller, reusable pieces:
```tsx
<FlowEditor>
  <Sidebar>
    <NodeFactory />
  </Sidebar>
  <Canvas>
    <ReactFlow />
  </Canvas>
  <PropertiesPanel />
</FlowEditor>
```

### 3. **Controlled Components**

All form inputs are controlled:
```tsx
<input 
  value={data.label} 
  onChange={e => updateNode({ label: e.target.value })} 
/>
```

### 4. **Custom Hooks (Future)**

Extract reusable logic:
```tsx
const useNodeSelection = (nodes) => {
  const [selected, setSelected] = useState(null);
  // ...selection logic
  return [selected, setSelected];
};
```

### 5. **Error Boundaries (Future)**

Graceful error handling:
```tsx
<ErrorBoundary fallback={<ErrorView />}>
  <FlowEditor />
</ErrorBoundary>
```

## Data Flow Patterns

### 1. Props Down, Events Up

```
Parent Component
    │
    ├─ data (props) ──────> Child Component
    │
    └─ onEvent (callback) <── Child emits event
```

### 2. Lifting State Up

Shared state lives in the nearest common ancestor:
```tsx
// App.tsx holds orchestrators state
const [orchestrators, setOrchestrators] = useState([...]);

// Pass to children
<DashboardView orchestrators={orchestrators} />
<FlowEditor orchestrator={current} onSave={handleSave} />
```

### 3. Derived State

Compute values from existing state:
```tsx
const selectedNode = nodes.find(n => n.id === selectedNodeId);
const journey = journeys.find(j => j.id === data.journeyId);
```

## State Management Strategy

### Current Approach: React Hooks

```tsx
// Local component state
const [nodes, setNodes] = useState([]);

// Lifting to parent
const [orchestrators, setOrchestrators] = useState([]);

// Side effects
useEffect(() => {
  fetchData();
}, [dependency]);
```

### Future: Context API (if needed)

For deeply nested data:
```tsx
const OrchestratorContext = createContext(null);

<OrchestratorContext.Provider value={current}>
  <FlowEditor />
</OrchestratorContext.Provider>
```

## API Integration Strategy

### 1. Service Layer Abstraction

All API calls go through `ApiService`:
```typescript
// ✅ Good
const employees = await api.getEmployees();

// ❌ Bad
const res = await fetch('/api/v1/employees');
```

### 2. Error Handling

Three-tier strategy:
```typescript
try {
  const data = await api.getEmployees();
  setState(data);
} catch (error) {
  console.error('API Error:', error);
  // Fallback to mock data for development
  setState(MOCK_DATA);
} finally {
  setLoading(false);
}
```

### 3. Loading States

Always show loading indicators:
```tsx
{loading ? <Spinner /> : <DataTable data={data} />}
```

## Performance Considerations

### Current Optimizations

1. **React.memo**: Prevent unnecessary re-renders
2. **useCallback**: Memoize event handlers
3. **CSS transitions**: Hardware-accelerated animations

### Future Optimizations

1. **Lazy Loading**: Code-split routes
2. **Virtual Lists**: For large datasets
3. **Web Workers**: Heavy computations off main thread

## Testing Strategy

### Unit Tests (Future)

```typescript
describe('ApiService', () => {
  it('should fetch employees', async () => {
    const data = await api.getEmployees();
    expect(data).toBeDefined();
  });
});
```

### Integration Tests (Future)

```typescript
describe('FlowEditor', () => {
  it('should create and save node', async () => {
    const { getByText, getByRole } = render(<FlowEditor />);
    fireEvent.click(getByText('Add Trigger'));
    // ...assertions
  });
});
```

### E2E Tests (Future)

```typescript
test('create orchestrator workflow', async ({ page }) => {
  await page.goto('/');
  await page.click('text=New Orchestrator');
  // ...workflow
});
```

## Security Considerations

### Current

- HTTPS only in production
- Bearer token authentication
- Input sanitization via TypeScript types

### Future

- CSRF protection
- XSS prevention (CSP headers)
- Rate limiting
- Audit logging

## Deployment Architecture

```
┌─────────────┐
│   Vite Build│
│  (dist/)    │
└──────┬──────┘
       │
┌──────▼──────┐
│   CDN/S3    │  Static assets
└──────┬──────┘
       │
┌──────▼──────┐
│  CloudFront │  Edge caching
└─────────────┘
```

## Monitoring & Observability (Future)

- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Google Analytics**: User behavior
- **Custom metrics**: Node execution rates, journey completion

---

**Last Updated**: 2026-02-01  
**Maintained By**: Hugo Soares Nascimento
