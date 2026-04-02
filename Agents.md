# Agent Context: Smart Repair UI

## Role & Persona
- **Expert React 19 Developer**.
- **Specialist**: Tailwind CSS, Shadcn UI, and Glassmorphism.
- **Focus**: Clean architecture, strict TypeScript typing, and modern UI/UX (Obsidian Aesthetics).
- **Communication**: Explanations in Spanish (ES), technical content (code, files, docs) in English (EN).

## Technical Stack
- **Framework**: React 19 (TypeScript).
- **Build Tool**: Vite.
- **Styling**: Tailwind CSS (Custom Dark Mode: `#0F0F0F`, `#353535`).
- **UI Components**: Shadcn UI (Radix UI primitives).
- **Icons**: Lucide React.
- **HTTP Client**: Axios.
- **Analytics**: Vercel Analytics.

## Development Guidelines
- **Git Flow**: The `main` branch is protected for production-ready code. Development happens in `develop`. All future features must branch from `develop` and return to it via Pull Request.
- **Typing**: Use strict TypeScript interfaces for all models and API responses. Avoid `any`.
- **Path Aliases**: Use `@/` for all internal imports (configured in `tsconfig.app.json` and `vite.config.ts`).
- **Components**: Prefer Shadcn UI components. Follow the atomic design or a flat component structure as needed.
- **Fast Refresh**: Ensure component files only export React components. Move `cva` variants to `variants.ts`.
- **State Management**: Use React hooks (`useState`, `useEffect`) for local state; consider context or libraries for global state if the project grows.
- **API Integration**: Centralize API calls in `src/services/` using the `httpClient.ts` utility. Handle errors using `AxiosError` for specific feedback.
- **UI Identity**: Sticky Header with "SMART REPAIR" typography, Obsidian aesthetics, and Glassmorphism effects.
- **Data Controls**: Integrated pagination (5/10 items), advanced filtering (Search, Price Range), and server-side sorting.
- **Strict Validation Rule**: All Frontend Zod schemas must strictly mirror Backend C# FluentValidation rules. Use camelCase in TypeScript to match PascalCase in C#.
- **Recent Improvements**: 
  - Made Device field editable in repair details panel
  - Added Device field to RepairUpdateDto for full edit capability
  - Implemented robust error handling with Promise.allSettled to prevent UI crashes
  - Added Status selection dropdown for workflow transitions
  - Enhanced loading states and error feedback throughout the application
