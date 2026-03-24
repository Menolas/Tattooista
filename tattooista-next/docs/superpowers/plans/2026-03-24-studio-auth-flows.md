# Studio Auth Flows — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate auth flows for studio owners (platform level) vs studio visitors (studio level), replacing the current generic signup with a "Create Studio" flow that creates User + Studio + Membership in one action.

**Architecture:** Platform landing (no studio context) shows "Create Studio" CTA and "Already have a studio? Log in". Studio-level pages (with studio context) show no signup — visitors browse freely. Studio owner login on the platform level redirects to their studio's admin. The existing `createStudioWithDefaults()` in `src/lib/studio.ts` already handles the transactional Studio + Membership + defaults creation.

**Tech Stack:** Next.js 16 App Router, NextAuth v5 beta, Prisma, Zod, react-hook-form, Tailwind CSS

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/lib/validations/auth.ts` | Modify | Add `createStudioSchema` (studio name + email + password) |
| `src/lib/actions/auth.ts` | Modify | Add `createStudio` server action (User + Studio + Membership in one go) |
| `src/components/forms/create-studio-form.tsx` | Create | "Create Studio" form component |
| `src/components/forms/owner-login-form.tsx` | Create | Owner login form (email + password → redirect to studio admin) |
| `src/app/(public)/page.tsx` | Modify | Replace `AuthToggleForm` in no-studio block with platform landing |
| `src/app/(auth)/login/page.tsx` | Modify | Context-aware: platform login vs studio login |
| `src/app/(auth)/register/page.tsx` | Modify | Redirect to `/` (create-studio is the new signup) |
| `src/proxy.ts` | Modify | Block `/register` and `/login` on studio subdomains for visitors |
| `src/components/shared/header.tsx` | Modify | Hide "Log In" button for non-authenticated studio visitors |

---

### Task 1: Add `createStudioSchema` validation

**Files:**
- Modify: `src/lib/validations/auth.ts`

- [ ] **Step 1: Add the schema and type**

Add to `src/lib/validations/auth.ts`:

```typescript
export const createStudioSchema = z
  .object({
    studioName: z
      .string()
      .min(2, "Studio name must be at least 2 characters")
      .max(100, "Studio name is too long"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type CreateStudioInput = z.infer<typeof createStudioSchema>
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd tattooista-next && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to auth.ts

- [ ] **Step 3: Commit**

```bash
git add src/lib/validations/auth.ts
git commit -m "feat: add createStudioSchema validation for studio creation flow"
```

---

### Task 2: Add `createStudio` server action

**Files:**
- Modify: `src/lib/actions/auth.ts`

This action does everything atomically in a single transaction:
1. Validate input
2. Check email not taken
3. Generate slug from studio name, check slug not taken
4. Hash password
5. **In one $transaction:** Create User + Studio + Membership + defaults + verification token
6. Send verification email (outside transaction — email failure shouldn't roll back DB)
7. Return success with studio slug

- [ ] **Step 1: Refactor `createStudioWithDefaults` to accept a transaction**

In `src/lib/studio.ts`, change the function signature to accept an optional transaction client so it can participate in an outer transaction:

```typescript
import { PrismaClient } from "@prisma/client"

type TxClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0]

export async function createStudioWithDefaults(
  ownerId: string,
  input: StudioCreationInput,
  tx?: TxClient
) {
  const client = tx ?? prisma

  const existing = await client.studio.findUnique({
    where: { slug: input.slug },
  })
  if (existing) {
    throw new Error(`Slug "${input.slug}" is already taken`)
  }

  const studio = await client.studio.create({
    data: {
      name: input.name.trim(),
      slug: input.slug,
      logo: input.logo ?? null,
    },
  })

  await client.studioMembership.create({
    data: {
      userId: ownerId,
      studioId: studio.id,
      role: "OWNER",
    },
  })

  await client.page.createMany({
    data: [
      { studioId: studio.id, name: "about", isActive: true },
      { studioId: studio.id, name: "contacts", isActive: true },
    ],
  })

  await client.tattooStyle.create({
    data: {
      studioId: studio.id,
      value: "Other",
      nonStyle: true,
    },
  })

  return studio
}
```

When called without `tx`, it uses the default prisma client (backwards compatible). When called with `tx`, it participates in the outer transaction. Remove the old `prisma.$transaction` wrapper since the caller now controls the transaction boundary.

- [ ] **Step 2: Add the `createStudio` action**

Add to `src/lib/actions/auth.ts`:

```typescript
import { createStudioSchema } from "@/lib/validations/auth"
import { createStudioWithDefaults } from "@/lib/studio"
import { generateSlug, validateSlug } from "@/lib/slug"
```

Then the action:

```typescript
export async function createStudio(formData: FormData) {
  const rawData = {
    studioName: formData.get("studioName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  }

  const validationResult = createStudioSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0].message }
  }

  const { studioName, email, password } = validationResult.data

  // Generate and validate slug before hitting the DB
  const slug = generateSlug(studioName)
  const slugValidation = validateSlug(slug)
  if (!slugValidation.valid) {
    return { error: `Studio name produces an invalid URL. Try a longer or different name.` }
  }

  // Hash password before the transaction (CPU-intensive, don't hold tx open)
  const hashedPassword = await bcrypt.hash(password, 12)

  // Atomic: create User + Studio + Membership + defaults + verification token
  let verificationToken: string
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Check email not taken
      const existingUser = await tx.user.findUnique({
        where: { email },
      })
      if (existingUser) {
        throw new Error("An account with this email already exists. If you already have a studio, please sign in instead.")
      }

      // Check slug not taken
      const existingStudio = await tx.studio.findUnique({
        where: { slug },
      })
      if (existingStudio) {
        throw new Error(`The URL "${slug}" is already taken. Try a different studio name.`)
      }

      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          displayName: studioName,
          isActivated: false,
        },
      })

      // Create studio with defaults (Studio + Membership + pages + default style)
      await createStudioWithDefaults(user.id, { name: studioName, slug }, tx)

      // Create verification token
      const token = crypto.randomBytes(32).toString("hex")
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

      await tx.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      })

      return { slug, token }
    })

    verificationToken = result.token
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "Failed to create studio. Please try again." }
  }

  // Send email outside transaction — failure here doesn't roll back the DB
  await sendVerificationEmail(email, verificationToken)

  return {
    success: true,
    slug,
    message: "Studio created! Please check your email to verify your account.",
  }
}
```

Note: `displayName` is set to `studioName` for now — owner can change it later in their profile. No separate "name" field needed.

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd tattooista-next && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/actions/auth.ts
git commit -m "feat: add createStudio server action — creates User + Studio + Membership"
```

---

### Task 3: Create the "Create Studio" form component

**Files:**
- Create: `src/components/forms/create-studio-form.tsx`

This is a client component with: studio name, email, password, confirm password. On success, shows verification message with the studio URL they'll get.

- [ ] **Step 1: Create the form component**

Create `src/components/forms/create-studio-form.tsx`:

```typescript
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createStudioSchema, type CreateStudioInput } from "@/lib/validations/auth"
import { createStudio } from "@/lib/actions/auth"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle } from "lucide-react"
import { generateSlug } from "@/lib/slug"

export function CreateStudioForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<{ slug: string } | null>(null)

  const form = useForm<CreateStudioInput>({
    resolver: zodResolver(createStudioSchema),
    defaultValues: { studioName: "", email: "", password: "", confirmPassword: "" },
  })

  const studioName = form.watch("studioName")
  const previewSlug = studioName ? generateSlug(studioName) : ""

  async function onSubmit(data: CreateStudioInput) {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const formData = new FormData()
      formData.append("studioName", data.studioName)
      formData.append("email", data.email)
      formData.append("password", data.password)
      formData.append("confirmPassword", data.confirmPassword)
      const result = await createStudio(formData)
      if (result.error) {
        setServerError(result.error)
        return
      }
      setSuccessData({ slug: result.slug! })
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (successData) {
    return (
      <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Studio created!</strong>
          <p className="mt-2">
            Your studio URL will be: <strong>{successData.slug}.tattooista.com</strong>
          </p>
          <p className="mt-2">
            We&apos;ve sent a verification email to your address. Please check your inbox
            and click the link to activate your account, then you can log in and start
            setting up your studio.
          </p>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="studioName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Studio Name</FormLabel>
              <FormControl>
                <Input placeholder="My Tattoo Studio" {...field} />
              </FormControl>
              {previewSlug && previewSlug.length >= 3 && (
                <p className="text-xs text-muted-foreground">
                  Your URL: {previewSlug}.tattooista.com
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" inputMode="email" autoComplete="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && (
          <p className="text-destructive text-sm text-center">{serverError}</p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <><LoadingSpinner size="sm" className="mr-2" />Creating studio...</>
          ) : "Create Studio"}
        </Button>
      </form>
    </Form>
  )
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd tattooista-next && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/forms/create-studio-form.tsx
git commit -m "feat: add CreateStudioForm component"
```

---

### Task 4: Create the owner login form

**Files:**
- Create: `src/components/forms/owner-login-form.tsx`

This is the platform-level login for returning studio owners. On success, it looks up the user's studio membership server-side and redirects to `?studio={slug}`.

- [ ] **Step 1: Add `getMyStudioSlug` server action (session-based, no userId param)**

Add to `src/lib/actions/auth.ts`:

```typescript
export async function getMyStudioSlug() {
  const session = await auth()
  if (!session?.user?.id) return null

  const membership = await prisma.studioMembership.findFirst({
    where: { userId: session.user.id, role: "OWNER" },
    include: { studio: { select: { slug: true } } },
  })
  return membership?.studio.slug ?? null
}
```

Note: uses `auth()` from the same file to read the session server-side. No userId parameter exposed to the client — prevents information disclosure.

- [ ] **Step 2: Create the form component**

Create `src/components/forms/owner-login-form.tsx`:

```typescript
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { login, getMyStudioSlug } from "@/lib/actions/auth"
import { LoadingSpinner } from "@/components/shared/loading-spinner"
import Link from "next/link"

export function OwnerLoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginInput) {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const formData = new FormData()
      formData.append("email", data.email)
      formData.append("password", data.password)
      const result = await login(formData)
      if (result.error) {
        setServerError(result.error)
        return
      }

      // Find their studio server-side (reads session internally) and redirect
      // TODO: when custom domains are live, redirect to subdomain URL instead
      const slug = await getMyStudioSlug()
      if (slug) {
        window.location.href = `/?studio=${slug}`
      } else {
        // User exists but has no studio — shouldn't happen normally
        window.location.href = "/"
      }
    } catch {
      setServerError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="text" inputMode="email" autoComplete="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link href="/reset-password" className="text-sm text-muted-foreground hover:text-primary">
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {serverError && (
          <p className="text-destructive text-sm text-center">{serverError}</p>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <><LoadingSpinner size="sm" className="mr-2" />Signing in...</>
          ) : "Sign in"}
        </Button>
      </form>
    </Form>
  )
}
```

- [ ] **Step 3: Verify no TypeScript errors**

Run: `cd tattooista-next && npx tsc --noEmit --pretty 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add src/lib/actions/auth.ts src/components/forms/owner-login-form.tsx
git commit -m "feat: add OwnerLoginForm — login redirects to owner's studio"
```

---

### Task 5: Replace platform landing page (no-studio block)

**Files:**
- Modify: `src/app/(public)/page.tsx`

Replace the `AuthToggleForm` block (lines 46-57) with the platform landing that shows "Create Studio" and "Already have a studio? Log in".

- [ ] **Step 1: Update the no-studio block**

Replace the current no-studio return block in `page.tsx` with:

```typescript
import { CreateStudioForm } from "@/components/forms/create-studio-form"
import { OwnerLoginForm } from "@/components/forms/owner-login-form"
```

Remove the `AuthToggleForm` import.

Replace the `if (!data)` block:

```typescript
if (!data) {
  return <PlatformLanding />
}
```

Add a new client component at the bottom of the file (or as a separate component — but since it's only used here, inline is fine as a separate component file):

Actually, since page.tsx is a server component and we need state for toggling, create a client component.

- [ ] **Step 2: Create platform landing component**

Create `src/components/platform-landing.tsx`:

```typescript
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateStudioForm } from "@/components/forms/create-studio-form"
import { OwnerLoginForm } from "@/components/forms/owner-login-form"

export function PlatformLanding() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Tattooista</h1>
          <p className="mt-2 text-muted-foreground">
            {showLogin
              ? "Sign in to your studio"
              : "Create your tattoo studio in minutes"}
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {showLogin ? "Welcome back" : "Create your studio"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showLogin ? (
              <>
                <OwnerLoginForm />
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Don&apos;t have a studio yet?{" "}
                  <button
                    type="button"
                    onClick={() => setShowLogin(false)}
                    className="text-primary hover:underline"
                  >
                    Create one
                  </button>
                </p>
              </>
            ) : (
              <>
                <CreateStudioForm />
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have a studio?{" "}
                  <button
                    type="button"
                    onClick={() => setShowLogin(true)}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update page.tsx**

In `src/app/(public)/page.tsx`:

Remove the `AuthToggleForm` import. Add:
```typescript
import { PlatformLanding } from "@/components/platform-landing"
```

Replace the `if (!data)` block (lines 46-57) with:
```typescript
if (!data) {
  return <PlatformLanding />
}
```

- [ ] **Step 4: Verify it compiles**

Run: `cd tattooista-next && npx tsc --noEmit --pretty 2>&1 | head -20`

- [ ] **Step 5: Commit**

```bash
git add src/components/platform-landing.tsx src/app/\(public\)/page.tsx
git commit -m "feat: replace generic auth form with Create Studio / Owner Login landing"
```

---

### Task 6: Hide auth routes on studio subdomains

**Files:**
- Modify: `src/proxy.ts`

Studio visitors should NOT see `/login` or `/register`. If someone visits `demo.tattooista.com/login`, redirect them to `/` (the studio's public home). Only allow auth routes when there's no studio context (platform level).

Exception: `/register` is always blocked on studio subdomains. `/login` is blocked only for unauthenticated studio visitors — studio owners who are already logged in can still access `/admin` (handled by existing admin route protection). But there's no reason for `/login` to exist on the studio subdomain either — owners log in on the platform level and get redirected to their studio. So we block both.

- [ ] **Step 1: Update proxy route protection**

In `src/proxy.ts`, after tenant resolution and before route protection, add logic:

```typescript
// If we're on a studio context, block auth routes for visitors
// Studio owners log in on the platform level and get redirected here
if (slug && isAuthRoute) {
  return NextResponse.redirect(new URL("/", nextUrl))
}
```

This goes right after the `if (slug)` tenant resolution block and before the existing route protection section. This is safe because:
- Studio owners log in at the platform level (no subdomain) → get redirected to `?studio=slug`
- Once they have a session, they can access `/admin` directly (session cookie is cross-path)
- The `/api/auth/*` callbacks are already whitelisted as public routes and won't be affected

- [ ] **Step 2: Test locally**

Visit `http://localhost:3000/?studio=demo` — should show studio home.
Visit `http://localhost:3000/login?studio=demo` — should redirect to `/?studio=demo`.
Visit `http://localhost:3000/login` (no studio) — should show platform login.

- [ ] **Step 3: Commit**

```bash
git add src/proxy.ts
git commit -m "feat: block auth routes on studio subdomains — visitors browse freely"
```

---

### Task 7: Hide login button in studio header for visitors

**Files:**
- Modify: `src/components/shared/header.tsx`

Currently the header shows a "Log In" button for unauthenticated users. On a studio's public site, visitors don't need to see this — remove it. Only show login/admin/profile/logout for authenticated studio owners.

- [ ] **Step 1: Remove the login button for non-authenticated users**

In `header.tsx`, the desktop section (lines 212-226) shows a "Log In" button when there's no session. Replace the entire `{session?.user ? (...) : (...)}` ternary in the desktop right section (lines 181-226) with just the authenticated block — no else clause for visitors:

```typescript
{session?.user && (
  <>
    <Link
      href="/admin/profile"
      className="w-[50px] h-[50px] rounded-full overflow-hidden"
    >
      <Avatar className="w-full h-full">
        <AvatarImage
          src={session.user.avatar ? `/users/${session.user.id}/avatar/${session.user.avatar}` : undefined}
          alt={session.user.displayName}
          className="object-cover"
        />
        <AvatarFallback>
          {session.user.displayName?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Link>
    <button
      onClick={handleLogout}
      className="flex items-center gap-4 text-foreground font-normal border-none bg-transparent hover:[&_img]:scale-[1.2] transition-all duration-300"
    >
      <img
        src="/icons/logout.svg"
        alt="Log Out"
        className="w-[40px] h-[40px] transition-transform duration-300"
        style={{ filter: "brightness(0) invert(1)" }}
      />
      Log Out
    </button>
  </>
)}
```

Do the same for the mobile menu section (lines 250-285):

```typescript
{session?.user && (
  <li className="border-t border-foreground/10 pt-4 mt-2">
    <div className="flex flex-col gap-4">
      {isAdmin && (
        <Link href="/admin" onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal">
          Admin
        </Link>
      )}
      <Link href="/admin/profile" onClick={() => setIsMenuOpen(false)}
        className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal">
        Profile
      </Link>
      <button
        onClick={() => { setIsMenuOpen(false); handleLogout() }}
        className="flex items-center gap-2 py-2 text-[20px] text-foreground font-normal bg-transparent border-none">
        Log Out
      </button>
    </div>
  </li>
)}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `cd tattooista-next && npx tsc --noEmit --pretty 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/header.tsx
git commit -m "feat: hide login button from studio visitors — only show auth UI for owners"
```

---

### Task 8: Clean up old register page

**Files:**
- Modify: `src/app/(auth)/register/page.tsx`
- Modify: `src/app/(auth)/login/page.tsx`

The old `/register` route is no longer needed — studio creation happens on the platform landing. Redirect `/register` to `/`. Update `/login` to use the owner login form when accessed on platform level.

- [ ] **Step 1: Replace register page with redirect**

Replace `src/app/(auth)/register/page.tsx`:

```typescript
import { redirect } from "next/navigation"

export default function RegisterPage() {
  redirect("/")
}
```

- [ ] **Step 2: Update login page to use OwnerLoginForm**

Replace `src/app/(auth)/login/page.tsx`:

```typescript
import { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OwnerLoginForm } from "@/components/forms/owner-login-form"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign In — Tattooista",
  description: "Sign in to your Tattooista studio account.",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Tattooista</h1>
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <OwnerLoginForm />
            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have a studio yet?{" "}
              <Link href="/" className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify no TypeScript errors**

Run: `cd tattooista-next && npx tsc --noEmit --pretty 2>&1 | head -20`

- [ ] **Step 4: Commit**

```bash
git add src/app/\(auth\)/register/page.tsx src/app/\(auth\)/login/page.tsx
git commit -m "feat: register redirects to landing, login uses OwnerLoginForm"
```

---

### Task 9: Remove unused `AuthToggleForm` (if no longer referenced)

**Files:**
- Delete: `src/components/forms/auth-toggle-form.tsx` (if unused)

- [ ] **Step 1: Check for remaining references**

Run: `grep -r "auth-toggle-form\|AuthToggleForm" src/ --include="*.tsx" --include="*.ts"`

If no results, delete the file.

- [ ] **Step 2: Delete if unused**

```bash
rm src/components/forms/auth-toggle-form.tsx
```

- [ ] **Step 3: Also check if old `register` action is still needed**

The `register` action in `src/lib/actions/auth.ts` creates a bare User with no studio. It may still be useful for future "add staff member" flows, so leave it for now but it's no longer called from any UI.

- [ ] **Step 4: Commit**

```bash
git rm src/components/forms/auth-toggle-form.tsx
git commit -m "chore: remove unused AuthToggleForm component"
```

---

## Summary of user-visible changes

| Before | After |
|--------|-------|
| Platform landing shows generic login/register toggle | Platform landing shows "Create Studio" form + "Already have a studio? Sign in" |
| Register creates a bare User account | "Create Studio" creates User + Studio + Membership + defaults in one action |
| Login redirects to `/` (studio home or platform landing) | Login finds owner's studio and redirects to their studio |
| Studio visitors see "Log In" in header | Studio visitors see no auth UI — they browse freely |
| `/register` on studio subdomain shows signup form | `/register` and `/login` on studio subdomain redirect to `/` |
