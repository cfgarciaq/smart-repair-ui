# Project Context: Smart Repair UI

## Current Project State
The frontend is a modern React 19 application built with Vite, Tailwind CSS, and Shadcn UI. It features a premium "Obsidian" aesthetic with Glassmorphism effects.

## Last Implemented Features
- **Obsidian Aesthetics**: Premium design with custom dark mode (`#0F0F0F`, `#353535`), grain textures, and neon accents.
- **Glassmorphism**: Applied `backdrop-blur` and semi-transparent backgrounds to the Header, Footer, and Side Panels (Sheet).
- **Advanced Table UI**: Clickable headers for sorting (Date, Client, Device, Technician, Cost) with visual indicators and server-side integration.
- **Theme Support**: Light/Dark mode toggle with automatic system preference detection.
- **UI Rebranding**: Premium sticky header with "SMART REPAIR" typography and professional description.
- **Pagination & Filtering**: Integrated search bar (case-insensitive) and price range filters with dynamic page sizes.
- **Multilingual README**: Added support for Spanish, English, and French.

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
