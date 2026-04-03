# Project Context: Smart Repair UI

## Current Project State
The frontend is a modern React 19 application built with Vite, Tailwind CSS, and Shadcn UI. It features a premium "Obsidian" aesthetic with Glassmorphism effects.

## Last Implemented Features
- **Obsidian Aesthetics**: Premium design with custom dark mode (`#0F0F0F`, `#353535`), grain textures, and neon accents.
- **Glassmorphism**: Applied `backdrop-blur` and semi-transparent backgrounds to the Header, Footer, Side Panels (Sheet), and Filter Bar.
- **Advanced Table UI**: Clickable headers for sorting (Date, Client, Device, Technician, Cost) with visual indicators and server-side integration.
- **Technician Column**: Restored with `CircleUserRound` icon for better visual identification.
- **Compact Filter Bar**: Single-row layout with glassmorphism inputs and improved spacing.
- **Refactored Sidebar Actions**: Minimalist icon-only buttons (Pencil, Trash2, Save, X) with hover effects and collision avoidance.
- **Editable Device Field**: Users can now edit the Device field in the repair details panel to correct typos or update information.
- **Status Selection**: Added dropdown to change repair status (Pending, In Progress, Completed, etc.) directly from the detail panel.
- **Robust Data Loading**: Improved error handling in modals to prevent white screens when API endpoints are temporarily unavailable.
- **Theme Support**: Light/Dark mode toggle with automatic system preference detection.
- **UI Rebranding**: Premium sticky header with "SMART REPAIR" typography and professional description.
- **Pagination & Filtering**: Integrated search bar (case-insensitive) and price range filters with dynamic page sizes.
- **Multilingual README**: Added support for Spanish, English, and French.
- **Vercel Analytics**: Integrated `@vercel/analytics` for performance and visitor tracking.
- **Repair Deletion**: Implemented `deleteRepair` in `repairsService.ts` and a custom `DeleteRepairModal` component for a professional deletion workflow.
- **Documentation Refactor**: Reorganized `Agents.md` following progressive disclosure principles, moving specialized conventions to `docs/conventions/`.
- **Critical Fixes**:
  - Fixed "White Screen of Death" in `CreateRepairModal.tsx` by adding defensive mapping (`Array.isArray`) and robust error handling.
  - Resolved 404 error for `/api/technicians` by implementing the `TechniciansController` in the backend.
  - Added `api/clients/all` endpoint to `ClientsController.cs` to provide a non-paginated list for frontend selectors.
  - Fixed accessibility warnings in `CreateRepairModal.tsx` and `DeleteRepairModal.tsx` by adding `DialogDescription`.
  - Added visual error feedback in the creation modal when data fails to load.

## Backend Status
- **Done**: Full CRUD operations implemented with FluentValidation and AutoMapper.

## Current Milestone
- **Sprint 3**: UI Implementation (Repair Management).

## Commercial Roadmap
- **Engine for SaaS**: Current CRUD operations serve as the core engine for a future SaaS product.
- **Data Cleanup**: Plans for automated data cleanup and maintenance.
- **Payment Integration**: Future integration with payment gateways for repair billing.

## Pending Technical Debt or Bugs
- **Global State**: Consider implementing Context API or a state management library if the application grows.
- **Unit Testing**: Components and services need test coverage.
- **Error Handling**: Improve user feedback for API errors.

## Next Immediate Steps
1. **Dashboard Visualization**: Implement charts and metrics for repair tracking.
2. **Authentication UI**: Create login and registration pages.

## Infrastructure
- **Frontend:** Vercel (Production: `main`, Staging: `develop`).
  - **Production URL:** `https://smart-repair-ui.vercel.app`
- **API:** Render.com (Web Service).
  - **Production URL:** `https://smart-repair-api-5rrg.onrender.com/api`

## Git Flow
- **Main Branch:** Protected, production-ready code.
- **Develop Branch:** Primary integration branch.
- **Feature Branches:** Created from `develop`, merged back via Pull Request.
