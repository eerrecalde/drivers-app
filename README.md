# Drivers

A SvelteKit app for listing drivers and their policies and adding a driver.

## Setup

Install dependencies with `pnpm install`. Copy `.env.example` to `.env` and fill in the API base URL, username and password. Keep `.env` private. Run `pnpm dev` and open the local URL printed in the terminal; `/` redirects to `/drivers`.

## Commands

- `pnpm dev` — development server
- `pnpm lint` — formatting and lint checks
- `pnpm check` — Svelte and TypeScript checks
- `pnpm test` — unit tests
- `pnpm build` and `pnpm preview` — production build and local preview

See the [implementation plan](docs/plan.md) and [decisions, interpretations and follow-up work](docs/decisions.md).

AI assistance was used to plan, implement, review and verify the app; the resulting code and decisions should be reviewed and understood by the author.
