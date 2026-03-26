---
name: migrate
description: MERN to Next.js migration workflow. Use when migrating a component, page, or feature from the original React/Redux/SCSS app to the Next.js app. Triggers on "migrate", "port", "move X from the old app", "build the X page", or any reference to reproducing MERN functionality.
argument-hint: "component or page name"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent, AskUserQuestion
---

# /migrate — MERN → Next.js Migration

Orchestrator for migrating components from the original MERN app (`Client/`) to the Next.js app (`tattooista-next/`). Enforces: read original first → plan → implement → review.

## Entry

**No argument** → ask: "What component or page are you migrating?" — END.

**With argument** → proceed to Phase 1.

---

## Phase 1: Context Gathering

Run tt-context agent to analyze the original MERN implementation:

```
Agent(subagent_type="tt-context", prompt="component: {argument}\ncontext: {any additional context from developer}")
```

**Output:** Present the migration brief to the developer. Wait for confirmation before proceeding.

> **Migration: {component}**
> [Summary of what tt-context found — original files, key behaviors, data flow]
> Ready to plan the implementation?

**HARD STOP.** Wait for developer.

---

## Phase 2: Architecture

Run tt-architect agent with the context brief:

```
Agent(subagent_type="tt-architect", prompt="task: Migrate {component} from MERN to Next.js\ncontext_brief: {tt-context output}\nrequirements: {any requirements from developer}")
```

**Output:** Present the implementation plan to the developer.

> **Plan: {component}**
> [Summary — files to create/modify, build steps, key decisions]
> Proceed with implementation?

**HARD STOP.** Wait for developer. Developer may adjust the plan.

---

## Phase 3: Implement

Follow the build steps from the plan, one at a time.

**Per step:**
1. Read any existing file before modifying it
2. Implement the change
3. Brief status: `**Step {N}/{total}:** {what was done}`

**Rules during implementation:**
- SCSS values → grep for actual values before writing Tailwind classes
- Images from DB → use `<img>` not `next/image`
- CSS `url()` → always quote the path
- Public pages → use `params.slug` not `getTenantContext()`
- Every Prisma query → include `studioId`
- Every server action → auth + studio role check
- Links → include `/${slug}/` prefix
- FileReader → `Array.from()` before resetting input
- Client-side state for tab/filter switching (not URL navigation)

---

## Phase 4: Review

After implementation is complete, run tt-code-review:

```
Agent(subagent_type="tt-code-review", prompt="scope: {list of files created/modified}\ncontext: Migration of {component} from MERN app")
```

**Output:** Present review findings.

> **Review: {component}**
> [Summary — blocking/warning/info counts]
> [Any blocking issues listed]

If blocking issues found → fix them, then re-run review on the fixed files.

If clean → report to developer:

> **Migration complete: {component}**
> Files: {list}
> Ready for your review.

---

## Mid-Flow Requests

Developer raises something new → note it, finish current phase first. Don't context-switch mid-implementation.

## Session Resume

If the conversation restarts mid-migration, ask the developer what phase they're in and resume from there. Don't re-run completed phases.
