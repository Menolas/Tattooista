---
name: styling
description: CSS/styling workflow for Tattooista. Use when working on styling, visual fixes, responsive layout, colors, spacing, fonts, or any Tailwind/CSS work. Triggers on "style this", "fix the styling", "make it match", "colors", "responsive", "spacing", "visual", "CSS", "Tailwind", or when the developer reports a visual mismatch with the original MERN app.
argument-hint: "component or description of styling work"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent, AskUserQuestion
---

# /styling — CSS/Styling Workflow

Orchestrator for styling work in Tattooista. Enforces: grep original SCSS values first → plan → implement → verify.

## Entry

**No argument** → ask: "What needs styling work?" — END.

**With argument** → proceed.

---

## Step 1: Read Original Styles

**Always do this first, no exceptions.**

1. Find the original SCSS for this component:
   ```
   Grep for component/class names in Client/src/assets/scss/
   ```

2. Read the SCSS file(s) fully.

3. Extract every variable used and grep for its value:
   ```
   Grep for $variable-name in Client/src/assets/scss/
   ```

4. Document what you found:

> **Styling: {component}**
> **SCSS files:** {paths}
> **Key values:**
> - `$variable-name: actual-value`
> - `breakpoint: Xpx`
> - `transition: ...`

If no original SCSS exists (new component, not a migration) → skip to Step 2 with developer's description.

---

## Step 2: Check Existing Tailwind

Read the current Next.js component. Identify:
- What's already styled correctly
- What's missing or wrong
- What hardcoded values need to be replaced with CSS variables

Read `tattooista-next/src/app/globals.css` for existing CSS variables if needed.

> **Current state:** {what's right and what's wrong}
> **Plan:** {what changes are needed}

For simple fixes (1-2 properties) → proceed directly.
For larger work → **HARD STOP**, confirm with developer.

---

## Step 3: Implement

Apply the styling changes.

**Hard rules:**
- **Never hardcode hex values.** Use CSS variables (`var(--color-name)`) or Tailwind tokens.
- **Never write raw CSS class definitions in globals.css.** Use Tailwind utilities.
- **Always use the SCSS variable values from Step 1.** Don't approximate or guess.
- **Quote CSS `url()` paths.** `url('${path}')` — always.
- **Dynamic images use `<img>`**, not `next/image`.
- **Check responsive breakpoints.** Original uses specific px values — match them with Tailwind breakpoints or custom values.

---

## Step 4: Verify

After implementation:

1. Compare the Tailwind output against the original SCSS values documented in Step 1
2. Check that no hardcoded hex values were introduced
3. Check responsive breakpoints are covered
4. Report:

> **Styling done: {component}**
> **Files changed:** {list}
> **SCSS values matched:** {list of verified translations}
> **Responsive:** {breakpoints covered}

---

## Quick Mode

For small fixes (developer says "fix the color on X" or "spacing is off on Y"):

1. Grep the original SCSS value
2. Fix it
3. One-line report: `**Fixed:** {what} — was {wrong}, now {right} (from ${scss-var}: {value})`

No HARD STOPs needed for quick fixes.
