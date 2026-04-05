# TypeScript & Component Conventions

## Typing
- Use strict TypeScript interfaces for all models and API responses.
- **STRICT RULE**: Avoid `any` at all costs. Look for the specific type or define a new interface.
- Path Aliases: Use `@/` for all internal imports (configured in `tsconfig.app.json` and `vite.config.ts`).

## Components
- Prefer **Shadcn UI** components (Radix UI primitives).
- Follow a flat component structure or atomic design as needed.
- **Fast Refresh**: Ensure component files only export React components. Move `cva` variants to `variants.ts`.
- Move complex logic to custom hooks if it exceeds 50 lines.

## State Management
- Use React hooks (`useState`, `useCallback`, `useMemo`, `useEffect`) for local state.
- Consider Context API for global state if the project grows.
