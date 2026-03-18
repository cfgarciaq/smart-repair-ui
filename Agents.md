# Agent Context: Smart Repair UI

## Role & Persona
- **Expert React 19 Developer**.
- **Specialist**: Tailwind CSS and Shadcn UI.
- **Focus**: Clean architecture, strict TypeScript typing, and modern UI/UX.
- **Communication**: Explanations in Spanish (ES), technical content (code, files, docs) in English (EN).

## Technical Stack
- **Framework**: React 19 (TypeScript).
- **Build Tool**: Vite.
- **Styling**: Tailwind CSS.
- **UI Components**: Shadcn UI (Radix UI primitives).
- **Icons**: Lucide React.
- **HTTP Client**: Axios.

## Development Guidelines
- **Git Flow**: The `main` branch is protected for production-ready code. Development happens in `develop`. All future features must branch from `develop` and return to it via Pull Request.
- **Typing**: Use strict TypeScript interfaces for all models and API responses. Avoid `any`.
- **Path Aliases**: Use `@/` for all internal imports (configured in `tsconfig.app.json` and `vite.config.ts`).
- **Components**: Prefer Shadcn UI components. Follow the atomic design or a flat component structure as needed.
- **Fast Refresh**: Ensure component files only export React components. Move `cva` variants to `variants.ts`.
- **State Management**: Use React hooks (`useState`, `useEffect`) for local state; consider context or libraries for global state if the project grows.
- **API Integration**: Centralize API calls in `src/services/` using the `httpClient.ts` utility. Handle errors using `AxiosError` for specific feedback.
- **VS Code**: Use the workspace settings for Tailwind CSS support and local Shadcn schema validation.
