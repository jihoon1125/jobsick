# Jobsick 🤒 — CLAUDE.md

AI-powered job posting analysis service for job seekers.
Users paste a job posting URL or text, and the app analyzes
resume fit, company reputation, and salary compatibility.

This is an open-source portfolio project.
The codebase should reflect production-level quality and conventions.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Jotai (client global) + TanStack Query (server data)
- **DB**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (GitHub OAuth)
- **AI**: Claude API (user provides their own API key)
- **Crawling**: Playwright
- **Testing**: Vitest + Testing Library + MSW + Storybook + Playwright E2E
- **Deploy**: Vercel

---

## Folder Structure

All application code lives under `src/`. The project root only
contains config and meta files. Import alias `@/*` resolves to
`./src/*`.

```
src/
├── app/                     # Next.js routing + pages
│   ├── layout.tsx           # Root layout (providers, global UI)
│   ├── page.tsx             # Landing page
│   ├── error.tsx            # Global error boundary
│   ├── not-found.tsx        # 404 page
│   ├── template.tsx         # Page transition wrapper
│   ├── globals.css          # Tailwind + shadcn global styles
│   ├── (auth)/              # Auth routes (not in URL)
│   │   └── login/
│   ├── dashboard/
│   ├── profile/
│   ├── resumes/
│   ├── companies/
│   ├── analyze/
│   └── api/                 # Server-only API routes
│       └── [feature]/route.ts
├── components/
│   ├── ui/                  # shadcn generated — leave as-is
│   ├── common/              # App-wide shared components
│   └── [domain]/            # Domain-specific components
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Browser Supabase client
│   │   ├── server.ts        # Server Supabase client
│   │   └── middleware.ts    # Session refresh helper
│   ├── errors.ts
│   ├── pdf.ts               # Client-side PDF parsing
│   └── utils.ts             # cn, etc.
├── hooks/                   # Shared custom hooks (2+ usages)
├── atoms/                   # Jotai atoms (global client state)
├── types/                   # Global TypeScript types
├── mocks/                   # MSW handlers and server setup
├── i18n/                    # next-intl config
├── messages/                # ko.json, en.json
└── middleware.ts            # Next.js middleware

e2e/                         # Playwright E2E tests
.storybook/                  # Storybook configuration
public/                      # Static assets
```

---

## TypeScript Rules

- Double quotes, 2-space indentation
- Prefer `const` over `let`
- **No `as` type casting** — use type guards to narrow types
- **No `any` or `unknown`**
- Max 80 characters per line

### Naming

```ts
UPPER_SNAKE_CASE  // constants, module-level CSSProperties
camelCase         // variables, regular functions, custom hooks
PascalCase        // components, classes, interfaces, types
kebab-case        // file names, folder names
```

### Function Declarations

```ts
// Module scope → function keyword
function fetchData() {}

// Local scope callbacks → arrow function
const handleClick = () => {};

// React components → always function keyword
function MyComponent({ prop }: Props) {}
```

### Exports / Imports

```ts
// Named exports only
// No export default
// Exception: Next.js required files
// (page.tsx, layout.tsx, error.tsx, not-found.tsx)
export function MyComponent() {}
export const MY_CONSTANT = "value";

// Direct named imports
import { useState } from "react";

// Use @ alias when path crosses more than one parent directory
import { myUtil } from "@/lib/utils";
```

### Type Narrowing

```ts
// Bad — unsafe casting
const el = someValue as SomeType;

// Good — type guard
if (!(someValue instanceof SomeType)) return;
```

---

## Styling Rules

Tailwind CSS is the primary styling tool.
`CSSProperties` is only for values Tailwind cannot express (dynamic runtime values).

```tsx
// Bad: Tailwind can express this
const STYLE: CSSProperties = { display: "flex", gap: "0.5rem" };

// Good: use Tailwind
<div className="flex gap-2" />;

// Good: CSSProperties only for dynamic values
const DYNAMIC_STYLE: CSSProperties = { width: `${value}%` };
```

- `CSSProperties` → module-level `UPPER_SNAKE_CASE` constant only
- No inline style objects in JSX (creates new object every render)
- Prefer semantic scale classes (`text-xs`) over arbitrary values (`text-[11px]`)
- No CSS module files

---

## Next.js App Router Rules

### Server vs Client Components

```tsx
// Server Component (default)
// Use for: data fetching, DB access, secret env vars
export default async function Page() {
  const data = await fetchFromDB();
  return <Component data={data} />;
}

// Client Component
// Declare 'use client' at the very top of the file
("use client");
export function InteractiveComponent() {
  const [state, setState] = useState(false);
  return <div onClick={() => setState(true)} />;
}
```

### Server Components — Do

- Direct DB queries via Supabase server client
- External API calls (Claude API, crawling)
- Access secret environment variables
- `async/await` data fetching

### Client Components — Do

- `useState`, `useEffect`, `useCallback`, `useMemo`
- User interactions (clicks, inputs, forms)
- TanStack Query hooks
- Jotai hooks
- Browser APIs

### API Routes

```ts
// app/api/[feature]/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    // validate input with Zod
    // process request
    return Response.json({ data });
  } catch (error) {
    if (isAppError(error)) {
      return Response.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }
    console.error("[route-name]", error);
    return Response.json(
      { error: "Internal server error", code: "INTERNAL" },
      { status: 500 }
    );
  }
}
```

---

## Component Rules

### Single Responsibility

One component does exactly one thing.
If a component fetches data, transforms it, AND renders it — split it.

### Composition over Configuration

```tsx
// Bad: boolean flags controlling behavior
<Card hasBadge hasFooter isCompact title="..." />

// Good: explicit composition
<Card>
  <CardHeader />
  <CardBadge />
  <CardFooter />
</Card>
```

### Props Interface

```tsx
// Always name it Props (not ComponentNameProps)
interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function MyComponent({ value, onChange }: Props) {}
```

### No Logic Inside JSX

```tsx
// Bad: logic inside return
return (
  <ul>
    {items
      .filter((i) => i.active)
      .map((i) => (
        <Item key={i.id} item={i} />
      ))}
  </ul>
);

// Good: extract before return
const activeItems = items.filter((i) => i.active);
const itemElements = activeItems.map((i) => <Item key={i.id} item={i} />);

return <ul>{itemElements}</ul>;
```

### Forbidden Patterns

```tsx
// No forwardRef → explicit ref prop instead
interface Props {
  containerRef?: React.RefObject<HTMLDivElement>;
}
export function MyComponent({ containerRef }: Props) {
  return <div ref={containerRef} />;
}

// No array index as key
items.map((item, i) => <Row key={i} />); // Bad
items.map((item) => <Row key={item.id} />); // Good

// No spreading unknown props onto DOM elements
export function Card({ ...props }) {
  // Bad
  return <div {...props} />;
}

// No cloneElement
// No React.forwardRef
```

---

## State Management

```
Jotai        → global client state that persists across pages
               (auth user, user preferences, form drafts)

TanStack     → server-derived data
Query          (fetched lists, analysis results, cached responses)

useState     → local UI state within a single component

useReducer   → local state with 3+ related pieces
               or complex state transitions
```

### Jotai Atoms

```ts
// atoms/index.ts
// Keep atoms minimal — only truly global state
import { atom } from "jotai";

export const userAtom = atom<User | null>(null);
```

### TanStack Query

```tsx
// Always set staleTime to avoid unnecessary refetches
const { data, isLoading, error } = useQuery({
  queryKey: ["resource", id],
  queryFn: () => fetchResource(id),
  staleTime: 1000 * 60 * 5, // 5 minutes
});

// Invalidate related queries on mutation success
const { mutate } = useMutation({
  mutationFn: createResource,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["resource"] });
  },
});
```

---

## Custom Hook Rules

```tsx
// Separate concerns: data hooks vs UI hooks
function useResourceData(id: string) {} // fetching only
function useResourceSelection() {} // UI state only

// Co-locate with component if used in one place only
// Move to hooks/ only when used in 2+ places

// Always return stable references
function useFilter() {
  const [value, setValue] = useState("");
  const update = useCallback((v: string) => setValue(v), []);
  return { value, update }; // update is stable
}
```

---

## Performance Rules

```tsx
// React.memo — wrap components that receive stable props
const MyComponent = React.memo(function MyComponent({ value }: Props) {
  return <div>{value}</div>;
});

// useCallback — only when passing to React.memo children
const handleAction = useCallback(() => {
  doSomething();
}, [dependency]);

// useMemo — only when passing objects to React.memo children
const config = useMemo(() => ({ key: value }), [value]);

// Do NOT use useCallback/useMemo elsewhere
// The overhead often outweighs the benefit

// Use key prop to force remount when identity changes
<Panel key={selectedId} id={selectedId} />;
```

---

## useReducer

Replace multiple related `useState` calls with `useReducer`:

```tsx
// Signal: 3+ pieces of state that change together
// or next state depends on multiple current values

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: Result }
  | { status: "error"; message: string };

type Action =
  | { type: "START" }
  | { type: "SUCCESS"; data: Result }
  | { type: "ERROR"; message: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START":
      return { status: "loading" };
    case "SUCCESS":
      return { status: "success", data: action.data };
    case "ERROR":
      return { status: "error", message: action.message };
  }
}
```

---

## useEffect Rules

```tsx
// Always return cleanup for subscriptions, timers, requests
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/data", { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((err) => {
      if (err.name === "AbortError") return;
      setError(err);
    });

  return () => controller.abort();
}, [id]);

// useLayoutEffect — only for DOM measurement before paint
useLayoutEffect(() => {
  const { height } = ref.current.getBoundingClientRect();
  setHeight(height);
}, []);
```

---

## Error Handling

### Error Types

```ts
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Create specific subclasses for expected error cases
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
```

### Principles

```
1. Never silently ignore errors
2. User-facing message vs internal log — always separate
3. Expected errors → typed AppError subclass
4. Unexpected errors → console.error + generic user message
5. Never expose stack traces or internal details to clients
6. Validate all external input with Zod in API routes
```

### Global Error Boundary

```tsx
// app/error.tsx
"use client";

interface Props {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-destructive">{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Comment Rules

### Philosophy

```
Good code explains itself through naming.
Comments explain WHY, never WHAT.
If you need a comment to explain what code does,
rename the variable or extract a function first.
```

### When NOT to Comment

```tsx
// Bad: restates the code
// increment count
count++;

// Bad: describes what is obvious
// filter active items
const active = items.filter((i) => i.active);
```

### When to Comment

```tsx
// Good: explains non-obvious reasoning
// Delay needed — auth state not propagated synchronously
// across server/client boundary at this point
await new Promise((resolve) => setTimeout(resolve, 100));

// Good: documents a business rule with context
// Free tier is limited to 3 analyses per day
// Agreed with product on 2024-01-15
const FREE_TIER_LIMIT = 3;

// Good: non-obvious regex
// Matches job posting IDs in the format: /jobs/12345
const JOB_ID_PATTERN = /\/jobs\/(\d+)/;

// Good: known issue or workaround
// TODO: replace with streaming response once stable
const result = await fetchFullResponse();

// Good: links to external context
// Workaround for upstream bug:
// https://github.com/org/repo/issues/123
```

### JSDoc

Only for exported functions and hooks in `lib/` and `hooks/`:

```tsx
/**
 * Calculates the match score between two skill sets.
 * Returns a value between 0 and 100.
 */
export function calculateMatchScore(
  required: string[],
  available: string[]
): number {}
```

### Tags

```ts
// TODO: planned work
// FIXME: known bug that needs fixing
// HACK: intentional workaround — must explain why
// NOTE: important context for future readers
// WARN: dangerous code — explain the risk
```

---

## Testing Rules

### Philosophy

```
Test behavior, not implementation.
Ask "what does the user experience?" not "what does the code do?"
Tests should give confidence to refactor freely.
```

### File Co-location

```
Every source file has its test next to it:

components/[domain]/
├── my-component.tsx
├── my-component.test.tsx    # Vitest + Testing Library
└── my-component.stories.tsx # Storybook

lib/
├── my-util.ts
└── my-util.test.ts
```

### Unit / Component Tests (Vitest + Testing Library)

```tsx
// my-component.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MyComponent } from "./my-component";

describe("MyComponent", () => {
  it("renders correctly with required props", () => {
    render(<MyComponent value="test" />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });

  it("calls onChange when user interacts", async () => {
    const onChange = vi.fn();
    render(<MyComponent value="" onChange={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledOnce();
  });
});
```

### API Mocking (MSW)

```ts
// mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/[route]", () => {
    return HttpResponse.json({ data: "mocked response" });
  }),
];

// Override handlers in specific tests when needed
server.use(
  http.post("/api/[route]", () => {
    return HttpResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  })
);
```

### Storybook Stories

Every component must have a Story file.
Cover all meaningful visual states:

```tsx
// my-component.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./my-component";

const meta: Meta<typeof MyComponent> = {
  component: MyComponent,
};
export default meta;

type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: { value: "default" },
};

export const Loading: Story = {
  args: { isLoading: true },
};

export const Empty: Story = {
  args: { value: "" },
};

export const Error: Story = {
  args: { error: "Something went wrong" },
};
```

### E2E Tests (Playwright)

Add E2E tests when a complete user flow is implemented.
Test critical paths only — not every edge case.

```ts
// e2e/[flow-name].test.ts
import { test, expect } from "@playwright/test";

test("[user flow description]", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "..." }).click();
  await expect(page.getByText("...")).toBeVisible();
});
```

Critical flows to cover:

- Authentication (login, logout)
- Core feature flow (input → analysis → result)
- Error states (invalid input, API failure)

### Test Priority

```
1st: Business logic and utilities (pure functions)
2nd: Component behavior (interactions, state changes)
3rd: API Routes (with MSW mocking)
4th: E2E critical flows only
```

### When to Write Tests

```
Write tests alongside the feature — not after.
If you implement a component, write its Story and test in the same commit.
If you implement a user flow, write its E2E test when the flow is complete.
```

---

## Supabase Rules

```ts
// lib/supabase/client.ts — browser only
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts — server components and API routes only
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
}
```

---

## Environment Variables

```
NEXT_PUBLIC_*  → exposed to client bundle (only non-sensitive values)
others         → server-only (API keys, secrets — never prefix with NEXT_PUBLIC_)
```

Validate all required env vars at startup using Zod.

---

## Animation Rules

```
Animate with transform and opacity only (GPU composited).
Never animate layout properties: width, height, top, left, margin.
Layout animations trigger reflow on every frame — avoid them.
```

---

## Git Convention

### Commit Messages

```
<type>: <concise subject in imperative mood>

Types:
feat     new feature
fix      bug fix
refactor code change without behavior change
style    formatting only
test     add or update tests
chore    build, config, tooling
docs     documentation only
perf     performance improvement
```

```bash
# Good — imperative, specific
feat: add job posting URL input with validation
fix: resolve score calculation rounding error
test: add unit tests for match score utility
chore: configure Storybook for Next.js

# Bad — vague, past tense
fix: fixed stuff
update: changes
```

### Branch Strategy

```
main        → production (Vercel auto-deploy)
dev         → integration branch
feat/<n>    → new feature
fix/<n>     → bug fix
chore/<n>   → tooling, config, docs
```

### Workflow

```bash
git checkout dev
git pull origin dev
git checkout -b feat/feature-name

# make changes, then:
git add .
git commit -m "feat: add feature description"
git push origin feat/feature-name
# open PR → dev
# when stable → dev → main
```

### PR Rules

```
- One PR per feature or bug fix
- Title follows commit message format
- All CI checks must pass before merge
- No direct push to main
```
