# Task tracker

Work through these in order, one task per chat. Keep the total implementation time near two hours across chats; record time spent when completing each task.

## Starting a chat

> Read AGENTS.md, docs/decisions.md and docs/tasks.md. Start the next unchecked task's branch from updated main and complete that task only. Keep it simple; ask before important new decisions. Verify the work, update this tracker with checks, time spent and remaining issues, and commit them together. Review before merging with --no-ff, then push the branch and main.

Requirements: [brief](/Users/emilianoerrecalde/Downloads/brief.md) and [API spec](/Users/emilianoerrecalde/Downloads/api.md). Read both before implementation. Credentials belong in an ignored `.env`; never commit them.

Setup commits are pushed to `origin/main` at `eerrecalde/drivers-app`; setup time was not tracked.

## Tasks

- [x] **1. Connect GitHub and commit the scaffold** — `207b2bd`.
  - GitHub access verified; untouched starter committed.
- [x] **2. Record agreed decisions** — `51a72bd`.
  - See [decisions.md](decisions.md). Formatting verified.
- [x] **3. Driver listing and pagination** — `feature/driver-listing`.
  - Server-render `/drivers`; keep Basic-auth credentials server-only. Add `.env.example` with placeholders.
  - Use `?page=`, 10 drivers per page and ordinary pagination links. Handle empty results, invalid page input and driver-fetch errors.
  - Verify shared URLs, Back/Forward and pagination without JavaScript; add relevant unit tests.
- [x] **4. Policy loading and retry** — `feature/policy-loading`, after task 3.
  - Render drivers before policies finish. Batch visible driver IDs and automatically fetch every policy page; skip empty driver lists.
  - Show policies or confirmed empty results only after completion. Handle network failures and non-JSON 5xx responses.
  - Retry at the same URL, preserving visible drivers, page and scroll. Refetching drivers is acceptable.
  - Test policy pagination/failures; manually verify delayed success, failure and retry using API simulation.
- [x] **4.b. Default to the driver list** — `feature/default-drivers`.
  - Remove the Svelte starter page and example files; redirect `/` to `/drivers`.
  - Tests, lint, type checking and build passed. Browser checks confirmed the redirect with JavaScript enabled and disabled. Approximately 2 minutes.
- [x] **5. Accessible creation form** — `feature/driver-creation`, after task 4.
  - Build `/drivers/new` with a form action, server-side Zod validation and `use:enhance` pending feedback.
  - Associate labels/errors, preserve keyboard access and announce results. Retain values on failures, including 422/409.
  - On success, stay on the form, confirm creation and clear fields. “View drivers” loads fresh list data.
  - Added validation/action tests and verified success, inline errors, retained values and pending feedback with JavaScript enabled and disabled. Screen-reader testing remains follow-up work. Approximately 19 minutes across implementation and validation follow-up.
- [x] **6. Final documentation and minimal styling** — `docs/final-polish`.
  - Keep README brief: setup, commands, AI use and a decisions link. Update actual gaps and follow-up work.
  - Run format, lint, type, unit and build checks; manually verify the combined flows.
  - Spend at most 2–5 minutes on general styling if time remains. Capture the final UI for review.
  - Format, lint, type checking, 11 unit tests and build passed. Browser checks with a simulated API covered policy failure/retry, pagination, validation, creation and fresh list data, including JavaScript-disabled submissions and conflict value retention. Desktop and mobile form layouts were inspected. Approximately 4 minutes.
  - Remaining: screen-reader and broader accessibility checks, automated end-to-end coverage and the other follow-ups in decisions.md.
- [x] **7. Source readability** — `codex/readability-cleanup`.
  - Add spacing between related sections and minimal comments explaining non-obvious decisions. Ignore generated browser logs.
  - Formatting, lint, type checks, 11 unit tests and build passed. The Svelte autofixer reported no issues or suggestions for both modified components.
