# Project Context: Smart Repair UI

## Current Project State
The frontend is a modern React 19 application built with Vite, Tailwind CSS, and Shadcn UI. It is integrated with the Smart Repair API.

## Last Implemented Features
- **Advanced Table UI**: Implemented clickable headers for sorting (Device, Client, Technician, Cost, Date) with visual indicators and API integration.
- **Theme Support**: Added a Light/Dark mode toggle with system preference support. Custom dark theme using `#0F0F0F` and `#353535`.
- **Glassmorphism**: Applied backdrop-blur effects to the header, footer, and side panels (Sheet) for a modern look.
- **UI Rebranding**: Implemented a premium sticky header with "SMART REPAIR" typography and a professional project description.
- **Pagination UI**: Added controls to select `pageSize` (5 or 10) and navigation buttons.
- **Advanced Filtering**: Integrated search bar and price range filters (Min/Max Cost) in the `RepairsList` component.
- **API Integration**: Centralized calls in `src/services/repairsService.ts` using `httpClient.ts`.

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
