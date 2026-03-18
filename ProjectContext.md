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
- **Fast Refresh Optimization:** UI variants (cva) are separated into `src/components/ui/variants.ts` to ensure components only export React components.
- **VS Code Integration:** Workspace settings configured for Tailwind CSS IntelliSense and local Shadcn schema validation.

## API Integration
- **Backend URL:** `http://localhost:5000` (Default for local development)
- **Client:** `src/api/httpClient.ts`
- **Services:** `src/services/` contains the logic for interacting with the API.
- **Data Flow:** Achieved full **Eager Loading** (`.Include`) for Technicians and History from the backend.
- **Consistency:** Standardized naming (e.g., `specialization`) across the entire stack.

## Infrastructure
- **Frontend:** Vercel (Production: `main`, Staging: `develop`).
- **API:** Render.com (Web Service).
  - *Justification:* Render provides a sustainable Free Tier for Web Services, ensuring the portfolio remains live indefinitely without the 30-day expiration of Azure trials. It also preserves the full ASP.NET Core logic (DTOs, AutoMapper, FluentValidation) without requiring a rewrite for serverless architectures.
- **Database:** Supabase (Remote PostgreSQL).
- **Strategy:** Professional hybrid cloud approach leveraging the best-in-class features of each provider.

## Recent Changes (Modernization)
- Integrated Tailwind CSS and PostCSS.
- Initialized Shadcn UI and added core components (`Button`, `Table`, `Badge`, `Sheet`).
- Refactored `App.tsx` to demonstrate UI integration.
- Standardized path aliases and ESM configuration.
- **Backend Integration:** Enabled CORS for `http://localhost:5173` in `.NET` API.
- **Data Flow:** Updated frontend models and services with strict TypeScript typing (zero `any`).
- **UI Update:** `RepairsList` now uses Shadcn Table and Badge components with colored status indicators.
- **Master-Detail View:** Implemented a side panel using Shadcn **Sheet** that displays full repair details and a vertical history timeline when a row is clicked.
- **Type Safety & Refinement:** Resolved deprecated `React.ElementRef` usage in UI components and ensured strict TypeScript typing across the application.
- **Zero Warnings:** Resolved all ESLint, TypeScript, and Fast Refresh warnings.
- **Status:** Changes committed and pushed to `feature/frontend-modernization`.
