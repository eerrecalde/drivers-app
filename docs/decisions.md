# Decisions

Plan only; implementation and verification are pending. Keep documentation brief.

## Agreed

- **Scope:** SvelteKit, Svelte 5, TypeScript and pnpm; about two hours. Prioritise readable code and required behaviour. Use small commits.
- **Validation:** Zod in the server action, with native browser constraints. Map API field errors to inputs and other failures to the form; preserve values on failure.
- **Form:** `/drivers/new`, using HTML POST and `use:enhance`. Works without JavaScript; enhancement adds pending feedback and submission without a document reload.
- **Success:** Stay on the form, show confirmation and clear fields for another entry. Provide a “View drivers” link.
- **List freshness:** Visiting `/drivers` fetches current data. Created drivers retain the API's alphabetical position and expire after five minutes. Manual refresh is unnecessary.
- **Accessibility:** Include labels, associated errors, keyboard access, visible focus and accessible status feedback from the start.
- **Without JavaScript:** The form must work fully. Policies may require JavaScript; the brief's explicit no-JavaScript requirement applies to Task 2.

- **Pagination:** `/drivers?page=2`, 10 drivers per page, ordinary Previous/Next links. Defer search.
- **Loading:** Await drivers in server load; stream policies separately so they never block the initial driver display. Keep Basic-auth credentials server-only in environment variables.
- **Retry:** Show one policy error and Retry button. Rerun the page load at the same URL, preserving visible drivers, pagination and scroll while loading. This also refetches drivers, avoiding a separate retry endpoint. Driver-fetch failures get a page-level error and retry.
- **Policy completeness:** Batch visible driver IDs and automatically fetch all policy pages (50 per request). Show policies, or “No policies”, only once complete. On failure, show the policy error and Retry. Skip requests for an empty driver list.
- **Dependencies:** Add only Zod. Keep existing formatting, linting and test tools.
- **README:** Setup, commands, brief AI-use disclosure and a link here for decisions, interpretations and gaps.

## Commit sequence

1. Connect the existing GitHub repository using `gh`; commit the untouched scaffold.
2. Record the agreed plan and decisions.
3. Add driver listing and URL pagination.
4. Add policy loading, failure handling and retry.
5. Add accessible creation form and validation.
6. Finish documentation and a minimal style reset if time allows.

Include relevant unit tests with each feature. Reserve time for checks and manual verification; stop at the timebox and record unfinished work.

## Verification

Use Vitest for validation boundaries, policy pagination/failures and action error/value handling. Manually check driver-first rendering, retry, URL pagination, creation and JavaScript-disabled submissions. Run format, lint, type and build checks. Existing Playwright-backed component tests are not application E2E tests.

## What I'd do with more time

- **E2E:** Driver-first rendering, retry, URL pagination, creation, retained values on 422/409 and JavaScript-disabled submissions. Control server-side upstream responses for predictable failures/delays.
- **Accessibility:** Screen-reader, automated and deeper focus/announcement checks.
- **Edge cases:** Leap-day birthdays, pagination after expiry, additional upstream failures and timeout/cancellation handling.
- **Search:** Add URL-based search alongside pagination if useful; reset the page when the query changes.
- **Visual polish:** Improve spacing and responsive layout after behaviour is verified.
