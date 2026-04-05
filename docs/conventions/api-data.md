# API & Data Management

## HTTP Client
- Centralize API calls in `src/services/` using the `httpClient.ts` utility (Axios).
- Handle errors using `AxiosError` for specific feedback.
- **Security**: Ensure `axios` version is `1.13.6` (avoid `1.14.1` due to `plain-crypto-js` vulnerability).

## Validation
- **Strict Validation Rule**: All Frontend **Zod** schemas must strictly mirror Backend C# **FluentValidation** rules.
- Use `camelCase` in TypeScript to match `PascalCase` in C#.

## Data Controls
- Integrated pagination (5/10/20 items).
- Advanced filtering (Search, Price Range).
- Server-side sorting.
