# Project Context: Smart Repair UI

## Overview
This is the frontend application for the Smart Repair system, built with **React 19** and **Vite**. It provides a modern interface for managing vehicle repairs.

## Tech Stack
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Radix UI primitives)
- **Icons:** Lucide React
- **HTTP Client:** Axios

## Architecture & Configuration
- **ESM Standards:** The project is fully migrated to ESM. Configuration files like `vite.config.ts` and `tailwind.config.js` use `import/export` syntax.
- **Path Aliases:** 
  - `@/*` maps to `./src/*`
  - Configured consistently across `tsconfig.app.json`, `vite.config.ts`, and `components.json`.
- **Styling Strategy:** Uses Tailwind CSS with CSS variables for theming (supporting light/dark modes).

## API Integration
- **Backend URL:** `http://localhost:5000` (Default for local development)
- **Client:** `src/api/httpClient.ts`
- **Services:** `src/services/` contains the logic for interacting with the API.

## Recent Changes (Modernization)
- Integrated Tailwind CSS and PostCSS.
- Initialized Shadcn UI and added core components (e.g., `Button`).
- Refactored `App.tsx` to demonstrate UI integration.
- Standardized path aliases and ESM configuration.
- **Status:** Changes committed and pushed to `feature/frontend-modernization`.
