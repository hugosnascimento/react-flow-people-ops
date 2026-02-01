# Project Structure

## Directory Tree

```
react-flow-people-ops-1/
├── .agent/                      # AI-assisted development context
│   ├── config/                 # Configuration files
│   ├── workflows/              # Development workflow guides
│   │   ├── run-local.md
│   │   └── add-node-type.md
│   ├── PROJECT_CONTEXT.md      # Project overview for AI
│   └── ARCHITECTURE.md         # Technical architecture doc
│
├── docs/                        # Documentation
│   └── DESIGN_SYSTEM.md        # Design system reference
│
├── public/                      # Static assets
│
├── src/                         # Source code
│   ├── components/             # React components
│   │   ├── collaborators/     # Employee management view
│   │   ├── common/            # Shared components (future)
│   │   ├── dashboard/         # Orchestrator list view
│   │   ├── editor/            # Flow editor interface
│   │   ├── layout/            # Navigation components
│   │   ├── monitor/           # Execution analytics
│   │   └── nodes/             # Custom React Flow nodes
│   │       ├── TriggerNode.tsx
│   │       ├── JourneyNode.tsx
│   │       ├── DecisionNode.tsx
│   │       ├── TagManagerNode.tsx
│   │       ├── DelayNode.tsx
│   │       └── index.ts
│   │
│   ├── experiments/            # Experimental features
│   │   └── people-ops-orchestrator-v1/
│   │
│   ├── services/               # Business logic & APIs
│   │   ├── ApiService.ts      # Backend API client
│   │   └── EvaEngine.ts       # Mock orchestration engine
│   │
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts           # All type exports
│   │
│   ├── App.tsx                 # Main application
│   ├── main.tsx                # React entry point
│   ├── design-system.ts        # Design tokens
│   └── global.css              # Global styles
│
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── API_DOCUMENTATION.md         # Backend API contracts
├── CHANGELOG.md                 # Version history
├── COMMERCIAL_USE.md            # Commercial licensing
├── CONTRIBUTING.md              # Contribution guidelines
├── LICENSE                      # AGPL-3.0 license
├── README.md                    # Project overview
├── STITCH_SETUP.md             # Deployment guide
├── index.html                   # HTML entry point
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config
├── tsconfig.node.json           # Node TypeScript config
└── vite.config.ts               # Vite configuration
```

## File Count

- **Total TypeScript/React Files**: 27
- **Components**: 13
- **Services**: 2
- **Documentation Files**: 8+

## Key Directories Explained

### `/src/components/`
All UI components, organized by feature:
- **nodes/**: Custom React Flow node types
- **editor/**: Flow canvas and editing interface
- **dashboard/**: Orchestrator management
- **collaborators/**: Employee/talent management
- **monitor/**: Execution logs and analytics
- **layout/**: Navigation and shell components

### `/src/services/`
Application business logic:
- **ApiService.ts**: Type-safe backend API client
- **EvaEngine.ts**: Mock data service for offline dev

### `/src/types/`
Centralized TypeScript definitions for:
- Domain models (Orchestrator, Collaborator, etc.)
- API request/response types
- Component prop interfaces

### `/.agent/`
Context for AI-assisted development:
- **PROJECT_CONTEXT.md**: High-level project overview
- **ARCHITECTURE.md**: Technical architecture details
- **workflows/**: Step-by-step guides for common tasks

### `/docs/`
User-facing documentation:
- **DESIGN_SYSTEM.md**: Complete design token reference

## File Ownership & Purpose

| File | Purpose | Owner |
|------|---------|-------|
| `src/App.tsx` | Main application shell | Core |
| `src/design-system.ts` | Design tokens (JS) | Design System |
| `src/global.css` | Design tokens (CSS) | Design System |
| `src/components/nodes/*` | Custom node types | Feature |
| `src/components/editor/FlowEditor.tsx` | Flow canvas | Feature |
| `src/services/ApiService.ts` | Backend integration | Service |
| `API_DOCUMENTATION.md` | API contracts | Documentation |
| `README.md` | Project overview | Documentation |

## Component Hierarchy

```
App
├── MainSidebar
└── <Current View>
    ├── DashboardView
    │   └── Orchestrator Table
    ├── FlowEditor
    │   ├── Sidebar (Node Factory)
    │   ├── Canvas (React Flow)
    │   │   ├── TriggerNode
    │   │   ├── JourneyNode
    │   │   ├── DecisionNode
    │   │   ├── TagManagerNode
    │   │   └── DelayNode
    │   └── PropertiesPanel
    ├── CollaboratorsView
    │   ├── Employee Table
    │   └── Detail Sidebar
    └── MonitorView (Modal)
        └── Execution Logs Table
```

## Import Paths

### Absolute Imports (Recommended)
```typescript
import { colors } from '../design-system';
import { Orchestrator } from '../types';
import api from '../services/ApiService';
```

### Component Imports
```typescript
import { TriggerNode } from '../components/nodes';
import { FlowEditor } from '../components/editor/FlowEditor';
```

## Build Output

```
dist/
├── assets/
│   ├── index-[hash].js    # Bundled JavaScript
│   └── index-[hash].css   # Bundled CSS
└── index.html             # Entry HTML
```

## Development Flow

1. **Start Dev Server**: `npm run dev`
2. **Edit Components**: Hot reload enabled
3. **Check Types**: `npm run type-check`
4. **Build**: `npm run build`
5. **Preview**: `npm run preview`

---

**Last Updated**: 2026-02-01  
**Maintained By**: Hugo Soares Nascimento
