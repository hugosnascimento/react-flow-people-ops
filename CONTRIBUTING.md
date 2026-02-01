# Contributing to Eva People Ops Orchestrator

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow

## Getting Started

### 1. Fork the Repository

```bash
git clone https://github.com/hugosnascimento/react-flow-people-ops.git
cd react-flow-people-ops-1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

## Development Guidelines

### Code Style

- **TypeScript**: Use explicit types, avoid `any`
- **React**: Functional components with hooks
- **Naming**: 
  - Components: PascalCase (`UserCard.tsx`)
  - Functions: camelCase (`handleClick`)
  - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Design System

- ✅ Use tokens from `src/design-system.ts`
- ❌ Never hardcode colors, spacing, or fonts
- ✅ Reference CSS custom properties in styles

### File Organization

```
src/
├── components/        # UI components
│   └── feature/      # Group by feature
├── services/         # API and business logic
├── types/            # TypeScript definitions
└── design-system.ts  # Design tokens
```

### Component Structure

```tsx
import React from 'react';
import { YourType } from '../../types';

interface YourComponentProps {
  data: YourType;
  onAction: () => void;
}

export const YourComponent: React.FC<YourComponentProps> = ({ data, onAction }) => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

## Commit Guidelines

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/config changes

### Examples

```bash
git commit -m "feat(nodes): add email notification node"
git commit -m "fix(api): handle 401 errors gracefully"
git commit -m "docs(readme): update installation instructions"
```

## Testing

### Run Tests

```bash
npm run test
```

### Write Tests

```typescript
import { describe, it, expect } from 'vitest';

describe('Component', () => {
  it('should render correctly', () => {
    // Test implementation
  });
});
```

## Pull Request Process

### 1. Update Your Branch

```bash
git fetch origin
git rebase origin/main
```

### 2. Push Changes

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

- Go to GitHub repository
- Click "New Pull Request"
- Fill out the template
- Request review

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How to test the changes

## Screenshots (if applicable)
Add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
```

## Areas for Contribution

### High Priority

- [ ] Unit tests for components
- [ ] Integration tests for API service
- [ ] Accessibility improvements (ARIA labels)
- [ ] Performance optimizations
- [ ] Error boundary implementation

### Feature Requests

- [ ] Undo/Redo functionality
- [ ] Template library
- [ ] Advanced analytics
- [ ] Real-time collaboration
- [ ] Webhook support

### Documentation

- [ ] API endpoint examples
- [ ] Component usage guides
- [ ] Video tutorials
- [ ] Deployment guides

## Questions?

- Open a GitHub Discussion
- Contact the maintainer
- Check existing issues

## License

By contributing, you agree that your contributions will be licensed under **AGPL-3.0-only**.

---

Thank you for contributing! 🙏
