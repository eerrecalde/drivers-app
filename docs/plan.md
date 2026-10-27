# Implementation plan

This summary was written after completion to make the original planning discussion easy to review. Final decisions and refinements are recorded in [decisions.md](decisions.md); completed work and verification notes are in [tasks.md](tasks.md).

## Priorities

- Work within the brief's roughly two-hour timebox; prioritise core behaviour over visual design.
- Keep code readable and straightforward enough to explain every part during the interview.
- Use SvelteKit conventions and built-in features. Add only Zod for validation; use the scaffold's TypeScript, Vitest, ESLint and Prettier tooling.
- Deliver small, verifiable changes on task branches and preserve their boundaries with merge commits.

## Approach

- **Drivers first:** Server-render `/drivers` as soon as drivers arrive. Stream policies separately so a slow service cannot block primary content.
- **Recoverable policies:** Batch visible driver IDs and automatically fetch all policy pages. Show loading, complete results or a retryable error. Retry keeps drivers visible and preserves the URL page and scroll position.
- **Shareable state:** Use ordinary pagination links and `?page=`, with 10 drivers per page. Defer search.
- **Reliable creation:** Use `/drivers/new`, a server action and Zod validation. Start with HTML POST that works without JavaScript; add pending feedback through `use:enhance`.
- **Usable errors:** Associate errors with fields, show other failures at form level and retain values on failure. Include labels, keyboard access, visible focus and accessible status feedback from the start.
- **Repeated entry:** Stay on the form after success, confirm creation and clear fields. Visiting the list fetches fresh data; the driver appears in the API's alphabetical order.
- **Server boundary:** Keep API credentials in private environment variables. JavaScript-disabled support is required for the form; policies may require JavaScript.

## Delivery and verification

Build in order: scaffold → decisions → driver listing/pagination → policies/retry → creation form → documentation and minimal styling.

Include focused unit tests with features. Manually check driver-first rendering, policy failure/retry, URL navigation, successful creation and retained values on failed submissions, including JavaScript-disabled forms. Finish with formatting, lint, type, test and build checks.

Defer automated E2E coverage, deeper accessibility verification, broader edge cases, search and visual polish. See [follow-up work](decisions.md#what-id-do-with-more-time).
