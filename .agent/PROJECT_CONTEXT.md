# Eva People Ops Orchestrator - Project Context

This document provides context for AI-assisted development and collaboration.

## Project Overview

**Eva People Ops Orchestrator** is a visual workflow automation platform for People Operations. It enables HR teams to design, execute, and monitor onboarding/offboarding processes through an intuitive node-based interface.

## Core Architecture

### Hexagonal Architecture (Ports & Adapters)

```
┌─────────────────────────────────────────┐
│          UI LAYER (Adapter)             │
│  React Flow, Components, Visualizations │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        APPLICATION LAYER (Ports)        │
│   ApiService, EvaEngine, Business Logic │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         DOMAIN LAYER (Core)             │
│    Types, Models, Orchestration Logic   │
└─────────────────────────────────────────┘
```

### Key Principles

1. **UI Independence**: React Flow is just a visualization tool. The core logic is backend-agnostic.
2. **API-First**: All integrations happen through typed API contracts (`src/services/ApiService.ts`).
3. **Type Safety**: Full TypeScript coverage for all components, services, and types.
4. **Design System**: Centralized tokens in `src/design-system.ts` for visual consistency.

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18.3 | UI framework |
| **Flow Engine** | React Flow 11.11 | Node-based workflow visualization |
| **Language** | TypeScript 5.4 | Type safety |
| **Build Tool** | Vite 5.1 | Fast dev server and bundler |
| **Styling** | Vanilla CSS + Design System | Consistent visual design |
| **State** | React Hooks (useState, useEffect) | Local state management |

## Project Structure

```
src/
├── components/
│   ├── nodes/           # Custom React Flow nodes
│   │   ├── TriggerNode.tsx
│   │   ├── JourneyNode.tsx
│   │   ├── DecisionNode.tsx
│   │   ├── TagManagerNode.tsx
│   │   └── DelayNode.tsx
│   ├── editor/          # Flow editing interface
│   │   └── FlowEditor.tsx
│   ├── dashboard/       # Orchestrator list view
│   │   └── DashboardView.tsx
│   ├── collaborators/   # Employee management
│   │   └── CollaboratorsView.tsx
│   ├── monitor/         # Execution analytics
│   │   └── MonitorView.tsx
│   └── layout/          # Navigation components
│       └── MainSidebar.tsx
├── services/
│   ├── ApiService.ts    # Backend API client
│   └── EvaEngine.ts     # Mock orchestration engine (for demo)
├── types/
│   └── index.ts         # TypeScript interfaces
├── design-system.ts     # Design tokens (colors, spacing, etc.)
├── global.css           # CSS implementation of design system
├── App.tsx              # Main application component
└── main.tsx             # React entry point
```

## Data Flow

### 1. Orchestrator Management
```
User → DashboardView → App State → FlowEditor → Save → Update State
```

### 2. Backend Integration
```
CollaboratorsView → ApiService → Backend API → Response → State Update → UI Refresh
```

### 3. Node Interaction
```
User Clicks Node → React Flow Event → FlowEditor → Update Node Data → State → Re-render
```

## Key Features

### Current Implementation

✅ **Visual Flow Builder**: Drag-and-drop nodes with React Flow  
✅ **5 Node Types**: Trigger, Journey, Decision, Tag Manager, Delay  
✅ **Orchestrator Dashboard**: Manage multiple workflows  
✅ **Execution Monitor**: Real-time logs and analytics  
✅ **Collaborators View**: Employee tagging and journey tracking  
✅ **Backend Integration**: Type-safe API service layer  
✅ **Design System**: Centralized tokens for consistency  

### Planned Features (Future)

⏳ **Undo/Redo**: Flow editing history  
⏳ **Templates**: Pre-built workflow templates  
⏳ **Real-time Collaboration**: Multi-user editing  
⏳ **Advanced Analytics**: Funnel analysis, journey completion rates  
⏳ **Webhook Support**: Real-time event triggers  

## API Integration

### Endpoints (v1)

See **[API_DOCUMENTATION.md](../API_DOCUMENTATION.md)** for complete reference.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/employees` | GET | List employees with filters |
| `/api/v1/tags` | GET | Get all tags |
| `/api/v1/employees/{id}` | PATCH | Update employee (tags) |
| `/api/v1/employees/{id}/journeys` | GET | Get user journeys |
| `/api/v1/onboarding/start-journey` | POST | Start a journey |
| `/api/v1/onboarding/cancel-journey/{id}` | DELETE | Cancel a journey |

### Authentication

All requests require a Bearer token:
```
Authorization: Bearer <token>
```

Configure in `.env`:
```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_AUTH_TOKEN=your_token_here
```

## Design System Reference

### Colors

```typescript
// Import design tokens
import { colors } from './design-system';

// Usage examples
colors.brand.primary        // #4f39f6 (main brand color)
colors.nodes.trigger        // #ff5a1f (trigger nodes)
colors.semantic.success     // #10b981 (success states)
```

### Spacing

```typescript
import { spacing } from './design-system';

spacing.xs   // 0.25rem (4px)
spacing.md   // 1rem (16px)
spacing.xl   // 2rem (32px)
```

### Typography

```typescript
import { typography } from './design-system';

typography.fontSize.base    // 0.875rem (14px)
typography.fontWeight.bold  // 700
```

## Development Workflows

### Adding a New Node Type

1. Create node component in `src/components/nodes/`
2. Export from `src/components/nodes/index.ts`
3. Add node type to `nodeTypes` object in `FlowEditor.tsx`
4. Add node factory button in the sidebar
5. Update TypeScript types in `src/types/index.ts`

### Adding a New API Endpoint

1. Define TypeScript interfaces in `src/types/index.ts`
2. Add method to `ApiService` class
3. Use the method in relevant component
4. Handle loading/error states
5. Update API_DOCUMENTATION.md

### Styling Guidelines

- ✅ Use design system tokens from `design-system.ts`
- ✅ Reference CSS custom properties in `global.css`
- ❌ Never hardcode colors, spacing, or font sizes
- ✅ Use Tailwind-style utility classes where available
- ✅ Follow BEM naming for custom classes

## Common Patterns

### Fetching Data

```typescript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await api.getEmployees();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
      // Fallback to mock data
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Updating Node Data

```typescript
const handleUpdateNode = (id: string, patch: Partial<NodeData>) => {
  setNodes(nds => nds.map(n => 
    n.id === id ? { ...n, data: { ...n.data, ...patch } } : n
  ));
};
```

## Testing Strategy

### Current State
- Manual testing via dev server
- Browser DevTools for debugging

### Future Improvements
- Unit tests with Vitest
- Integration tests for API calls
- E2E tests with Playwright
- Visual regression testing

## Deployment

### Build Process
```bash
npm run build   # Outputs to dist/
```

### Environment Variables
```env
VITE_API_URL=https://api.production.com/api/v1
VITE_AUTH_TOKEN=production_token
```

## Troubleshooting

### Common Issues

**Issue**: API calls failing with SyntaxError  
**Cause**: Backend not running, Vite returns HTML instead of JSON  
**Solution**: Ensure backend is running or use fallback mock data

**Issue**: Nodes not updating after edit  
**Cause**: State not triggering re-render  
**Solution**: Ensure immutable updates (spread operator)

**Issue**: React Flow controls not appearing  
**Cause**: Missing CSS import  
**Solution**: Verify `import "reactflow/dist/style.css"` in App.tsx

## License & IP

- **License**: AGPL-3.0-only
- **Commercial Use**: Requires written authorization
- **Core IP**: API-level abstraction, not the UI
- See [COMMERCIAL_USE.md](../COMMERCIAL_USE.md) for details

## Contact & Support

For questions or issues, contact the project maintainer or open a GitHub issue.

---

**Last Updated**: 2026-02-01  
**Maintained By**: Hugo Soares Nascimento
