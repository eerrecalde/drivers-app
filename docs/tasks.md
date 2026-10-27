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
- [ ] **5. Accessible creation form** — `feature/driver-creation`, after task 4.
  - Build `/drivers/new` with a form action, server-side Zod validation and `use:enhance` pending feedback.
  - Associate labels/errors, preserve keyboard access and announce results. Retain values on failures, including 422/409.
  - On success, stay on the form, confirm creation and clear fields. “View drivers” loads fresh list data.
  - Add validation/action unit tests; manually verify success and failure with JavaScript enabled and disabled.
- [ ] **6. Final documentation and minimal styling** — `docs/final-polish`.
  - Keep README brief: setup, commands, AI use and a decisions link. Update actual gaps and follow-up work.
  - Run format, lint, type, unit and build checks; manually verify the combined flows.
  - Spend at most 2–5 minutes on general styling if time remains. Capture the final UI for review.

## Handoff notes

Task 4 completed on `feature/policy-loading` (approximately 4 minutes of implementation and verification). Format/lint, type checking, tests and build passed; Svelte autofixer reported no issues or suggestions. A local simulated API and browser check verified drivers appear before delayed policies, a non-JSON failure, retry at the same URL with drivers and scroll preserved, and successful policy and empty results. Unit tests cover batched IDs, all pages, empty lists and failures. The simulation does not replace live-service or broader accessibility testing.

Task 4.b completed on `feature/default-drivers`: the starter page and examples were removed, and `/` redirects to `/drivers`. See the verification results above.

Next: **task 5**, accessible creation form.

After each task, tick it off and replace these notes with checks/results, time spent and the next task or blocker. Use `git log` for commit references. Leave unfinished work unchecked when the timebox ends.
