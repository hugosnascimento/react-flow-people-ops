# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Design system with centralized tokens (`src/design-system.ts`)
- Comprehensive documentation (README, CONTRIBUTING, ARCHITECTURE)
- Project context file for AI-assisted development (`.agent/PROJECT_CONTEXT.md`)
- Workflow guides for common tasks (`.agent/workflows/`)
- Environment configuration example (`.env.example`)

### Changed
- Refactored monolithic `App.tsx` into modular components
- Extracted all custom nodes into separate files (`src/components/nodes/`)
- Improved `global.css` with design system CSS custom properties
- Updated `package.json` with complete metadata

### Fixed
- None

## [0.1.0] - 2026-02-01

### Added
- Initial project setup with Vite + React + TypeScript
- React Flow integration for visual workflow building
- 5 custom node types:
  - TriggerNode (External API triggers)
  - JourneyNode (Onboarding flow initiators)
  - DecisionNode (Conditional routing)
  - TagManagerNode (Employee tagging)
  - DelayNode (Time-based delays)
- Dashboard view for orchestrator management
- Flow editor with drag-and-drop interface
- Collaborators view for employee management
- Execution monitor with real-time logs
- ApiService for backend integration
- Type-safe TypeScript interfaces
- Backend API documentation (`API_DOCUMENTATION.md`)

### Infrastructure
- Hexagonal architecture implementation
- Component-based folder structure
- Design system foundation (colors, spacing, typography)
- Mock data service (EvaEngine) for offline development

---

## Version History

- **0.1.0** (2026-02-01) - Initial release with core features
- **Unreleased** - Ongoing refactoring and documentation improvements

[Unreleased]: https://github.com/hugosnascimento/react-flow-people-ops/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/hugosnascimento/react-flow-people-ops/releases/tag/v0.1.0
