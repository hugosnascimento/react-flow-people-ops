---
description: How to run the application locally for development
---

# Running the Application Locally

Follow these steps to start the development server.

## Prerequisites

Ensure you have the following installed:
- Node.js >= 18.0.0
- npm >= 9.0.0

## Steps

// turbo-all

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

3. **Access Application**
Open your browser to `http://localhost:5173`

## Expected Behavior

- Vite dev server starts on port 5173
- Hot Module Replacement (HMR) enabled
- Application loads in ~800ms
- Dashboard view shows orchestrators list
- Collaborators view accessible via sidebar

## Troubleshooting

**Port Already in Use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Dependencies Out of Date**
```bash
npm install
```

**Build Errors**
```bash
rm -rf node_modules package-lock.json
npm install
```
