# Phase 1: Setup — Todo breakdown

**Source**: [TODOS.md](./TODOS.md) Phase 1.  
**Reference**: [Initial_Planning.md](./Initial_Planning.md) §3 Tech Stack, §5 Project Structure, §13 Single-command Run.

Phase 1 establishes the monorepo, frontend and backend apps, shared types, a single-command dev experience, and commit hygiene. No feature work yet.

---

## 1.1 — Create monorepo (yarn workspaces or Turborepo) with `apps/web` and `apps/api`

**What**: Root repo with workspaces so `apps/web` and `apps/api` are separate packages under one repo; optional Turborepo for cached builds and task pipelines.

**Why**: Single clone, shared tooling (Yarn), and later a shared `packages/shared` for types consumed by both apps. Aligns with Initial_Planning “optional but recommended” monorepo.

**How**: Root `package.json` with `"private": true` and `"workspaces": ["apps/*", "packages/*"]` (Yarn). Create empty `apps/web` and `apps/api` with their own `package.json`. Add `turbo.json` if using Turborepo.

---

## 1.2 — Scaffold `apps/web` — Vite + React + TypeScript (merge v0 output here if ready)

**What**: Frontend app bootstrapped with Vite, React 19, and TypeScript. If Phase 0 (v0) output exists, merge it into this app instead of a blank CRA/Vite template.

**Why**: Vite gives fast HMR and simple config; React 19 + TS is the chosen stack. Merging v0 here keeps one source of truth for the UI.

**How**: `yarn create vite apps/web --template react-ts` (or equivalent), then add React 19 and TS deps. Replace or merge `src/` with v0-generated code; align entry point and any path aliases.

---

## 1.3 — Add Shadcn/ui + Tailwind to `apps/web`

**What**: Install and wire Tailwind CSS and Shadcn/ui (Radix-based components + Tailwind) so the app can use the design system and v0-style components.

**Why**: Initial_Planning and v0_prompt specify Shadcn + Tailwind; Shadcn is copy-paste and themeable via CSS variables.

**How**: Tailwind init in `apps/web`; add Shadcn with `npx shadcn@latest init` and install components as needed. Ensure Tailwind content paths include all component and page files.

---

## 1.3b — Copy `GENERATED_IMAGES/` to `apps/web/public/images/`

**What**: Make stay imagery and videos available to the frontend at `/images/...` by copying (or symlinking) the repo’s `GENERATED_IMAGES/` into `apps/web/public/images/`.

**Why**: Initial_Planning “Image targeting”: stay `images[].path` is relative (e.g. `forest/01.jpg`); the app resolves URLs as `STAY_IMAGES_BASE + path` → `/images/forest/01.jpg`. Static assets must live under `public/` for that to work.

**How**: `cp -r GENERATED_IMAGES/* apps/web/public/images/` or symlink. Confirm folder layout matches stays data (e.g. `city/`, `forest/`, `mountains/`, `sea/`).

---

## 1.4 — Scaffold `apps/api` — NestJS

**What**: Backend app created with the NestJS CLI (or manual entry point), with a minimal app module and a way to run the HTTP server.

**Why**: Initial_Planning chooses NestJS for structure, DI, and validation. No routes or data yet—just a runnable API process.

**How**: `nest new apps/api` (or create `apps/api` and add Nest deps). Ensure it runs with `yarn dev` or `yarn start:dev` from `apps/api`. Root will later run it via workspace script.

---

## 1.5 — Create `packages/shared` with shared types (Stay, Review, Booking)

**What**: A workspace package that exports TypeScript interfaces (and optionally DTOs) for Stay, Review, and Booking so both `apps/web` and `apps/api` use the same contracts.

**Why**: Prevents drift between frontend and backend types and keeps API contracts in one place. Stay type must include the four scenario types: CITY, FOREST, MOUNTAINS, SEA.

**How**: Add `packages/shared` with `package.json` (main/typings pointing to built or source). Define `Stay`, `Review`, `Booking` (and any enums) per Initial_Planning §8. Export from `packages/shared/src`; have both apps depend on `@cocoon/shared` or a workspace reference.

---

## 1.6 — Single-command run (assessment NFR): Root `yarn dev` runs both apps (concurrently); or document two-step in README

**What**: From the repo root, one command starts both the web app and the API (e.g. `yarn dev`). If you keep two processes, document the two-step flow clearly in the README.

**Why**: Assignment requires “runs locally with a single command (or clearly documented two-step setup).” Single command improves DX and onboarding.

**How**: Root `package.json` script: `"dev": "concurrently \"yarn workspace api dev\" \"yarn workspace web dev\""` (or Turborepo `turbo dev`). Ensure `apps/api` and `apps/web` each expose a `dev` script. If you use two terminals, add a short “Run” section in README with exact commands.

---

## 1.7 — Guard commit messages: commitlint + husky (or similar) to enforce Conventional Commits on commit

**What**: Reject commits that don’t follow Conventional Commits (e.g. `feat:`, `fix:`, `chore:`). Use a commit-msg hook (husky + commitlint) so invalid messages are blocked locally.

**Why**: Keeps history consistent and enables tooling (changelogs, semantic-release). Aligns with TODOS “Commit messages” section and 2026-style conventions.

**How**: Install `husky` and `@commitlint/cli` + `@commitlint/config-conventional` at root. Add `commit-msg` hook that runs `commitlint -e $HUSKY_GIT_PARAMS`. Add `commitlint.config.js` extending the conventional config. Optionally add a `lint-staged` or pre-commit for format/lint.

---

## 1.8 — Document Phase 1 in `docs/phase-1-setup.md`

**What**: After Phase 1 is done, write a short doc under `docs/` that describes what was created (monorepo layout, scripts, key config), any decisions (e.g. Turborepo vs plain workspaces, symlink vs copy for images), and what Phase 2 should know.

**Why**: Follows the workflow in docs/README.md: each phase leaves a doc so the next phase (or another dev) has context without re-reading the whole plan.

**How**: Create `docs/phase-1-setup.md` with: structure created, how to run (single command or two-step), where types live, how images are served, and any gotchas (e.g. shared package build step if used).

