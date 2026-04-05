# Git Workflow & Branching

## Git Flow
- **Main Branch**: Protected for production-ready code.
- **Develop Branch**: Primary integration branch.
- **Feature Branches**: Created from `develop`, merged back via Pull Request.
- **Cleanup**: Delete feature branches locally and remotely after merging.

## Commits
- Use **Conventional Commits** format: `<type>[optional scope]: <description>`.
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`.
- Description: Use imperative, present tense (e.g., "add" instead of "added").
