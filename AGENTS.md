## Project Configuration

- **Language**: TypeScript
- **Package Manager**: pnpm
- **Add-ons**: prettier, eslint, vitest, ai-tools

---

## Verification before commits

- Do not rush to commit. First understand the change, its requirements and the purpose of every required check or tool.
- Before committing, verify the relevant behaviour and complete the required checks. Investigate failures, unexpected results and missing tools; do not treat an unrun check as passed or assume another check is equivalent.
- If a required check cannot be completed, leave the work uncommitted and explain the blocker and what remains to be verified. Discuss any proposed exception with the user before committing.
- Report the evidence and any remaining uncertainty accurately. Do not claim absolute certainty from tests alone.

---

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

If the Svelte MCP tools are not exposed in the current session, check whether the official `@sveltejs/mcp` server is installed locally and can be run over stdio. It may need network access to start. Before sending project source to an external service, obtain explicit user authorization for the files and destination; approval to run the server alone does not necessarily cover sharing source. If a required check remains blocked, follow the verification-before-commits instructions above.

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
