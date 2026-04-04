# Jobsick 🤒 — CLAUDE.md

AI-powered job posting analysis service for job seekers.
Analyzes resume fit, company reputation, and salary compatibility
from a job posting URL or text input.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Jotai (client global) + TanStack Query (server data)
- **DB**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (GitHub login)
- **AI**: Claude API (user provides their own API key)
- **Crawling**: Playwright
- **Testing**: Vitest + Testing Library + MSW
- **Deploy**: Vercel

---

## Folder Structure

```
app/
├── layout.tsx
├── page.tsx
├── error.tsx
├── not-found.tsx
├── (auth)/
│   └── login/
│       └── page.tsx
├── dashboard/
│   ├── layout.tsx
│   └── page.tsx
├── analyze/
│   └── page.tsx
└── api/
    ├── analyze/
    │   └── route.ts
    └── crawl/
        └── route.ts

components/
├── ui/                  # shadcn components
├── shared/              # shared components (header, footer, etc.)
├── job/                 # job posting related
├── analysis/            # analysis result related
└── resume/              # resume related

lib/
├── supabase/
│   ├── client.ts        # browser client
│   └── server.ts        # server client
├── errors.ts            # error types
└── utils.ts             # common utils

hooks/                   # shared custom hooks
atoms/                   # Jotai atoms
types/                   # global type definitions
mocks/                   # MSW handlers
```

---

## TypeScript Rules

- Double quotes, 2-space indentation
- Prefer `const` over `let`
- **No `as` type casting** — use type guards to narrow
- **No `any` or `unknown`**
- Max 80 characters per line

### Naming Conventions

```ts
UPPER_SNAKE_CASE; // constants, CSSProperties
camelCase; // variables, regular functions
PascalCase; // components, classes, interfaces, types
```

### Function Declarations

```ts
// Module scope → function keyword
function fetchJobAnalysis() {}

// Local scope callbacks → arrow function
const handleClick = () => {};

// React components → always function keyword
function JobCard({ job }: Props) {}
```

### Export / Import

```ts
// Named exports only
// No export default
// (except Next.js required files: page.tsx, layout.tsx, error.tsx)
export function JobCard() {}
export const API_BASE_URL = "https://...";

// Direct imports
import { useState } from "react";

// Use @ alias when traversing more than one parent directory
import { useJobAnalysis } from "@/hooks/use-job-analysis";
```

### Type Narrowing

```ts
// Bad
const el = document.getElementById("root") as HTMLElement;

// Good
const el = document.getElementById("root");
if (!(el instanceof HTMLElement)) return;
```

---

## Styling Rules

Tailwind CSS is the default.
Use `CSSProperties` only for dynamic values Tailwind cannot express.

```tsx
// Bad: Tailwind can handle this
const CARD_STYLE: CSSProperties = { display: "flex", gap: "0.5rem" };

// Good
<div className="flex gap-2" />;

// Good: dynamic value only
const PROGRESS_STYLE: CSSProperties = { width: `${score}%` };
```

- `CSSProperties` → module-level `UPPER_SNAKE_CASE` constant only
- No inline style objects in JSX
- Prefer semantic classes (`text-xs`) over arbitrary values (`text-[11px]`)
- No CSS module files

---

## Next.js App Router Rules

### Server / Client Components

```tsx
// Server Component (default)
// Can be async, safe for API keys, direct DB access
export default async function JobListPage() {
  const jobs = await fetchJobs();
  return <JobList jobs={jobs} />;
}

// Client Component
("use client");
export function JobCard({ job }: Props) {
  const [saved, setSaved] = useState(false);
  return <div onClick={() => setSaved(true)}>{job.title}</div>;
}
```

### Server Components Only

- Direct DB queries (Supabase server client)
- Claude API calls
- Access to `process.env.SECRET_*`
- Crawling (Playwright)

### Client Components Only

- `useState`, `useEffect`, `useCallback`
- Click/input interactions
- TanStack Query hooks
- Jotai hooks
- Browser APIs

### API Routes

```ts
// app/api/analyze/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await analyzeJob(body);
    return Response.json({ result });
  } catch (error) {
    if (isAppError(error)) {
      return Response.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }
    console.error("[analyze]", error);
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

One component does one thing.
Never mix data fetching + transformation + rendering.

### Composition over Configuration

```tsx
// Bad
<JobCard hasScore hasBadge isCompact />

// Good
<JobCard>
  <JobCardHeader />
  <JobCardScore score={85} />
  <JobCardBadge label="Recommended" />
</JobCard>
```

### Props Interface

```tsx
// Use Props inside the file (not ComponentNameProps)
interface Props {
  jobId: string;
  onAnalyze: (id: string) => void;
}
export function JobCard({ jobId, onAnalyze }: Props) {}
```

### No Logic Inside JSX

```tsx
// Bad
return (
  <div>
    {jobs
      .filter((j) => j.score > 80)
      .map((j) => (
        <JobCard key={j.id} job={j} />
      ))}
  </div>
);

// Good
const highScoreJobs = jobs.filter((j) => j.score > 80);
const jobCards = highScoreJobs.map((j) => <JobCard key={j.id} job={j} />);
return <div>{jobCards}</div>;
```

### Forbidden Patterns

```tsx
// No forwardRef → use explicit ref prop
interface Props {
  inputRef?: React.RefObject<HTMLInputElement>;
}
export function Input({ inputRef }: Props) {
  return <input ref={inputRef} />;
}

// No index as key
jobs.map((job, i) => <JobCard key={i} />); // Bad
jobs.map((job) => <JobCard key={job.id} />); // Good

// No unknown props spread
export function Card({ ...props }) {
  // Bad
  return <div {...props} />;
}
```

---

## State Management

```
Jotai        → global client state
               (logged-in user, API key, resume)
TanStack     → server data
               (job analysis, reputation, saved list)
useState     → local state within a single component
```

### Jotai

```ts
// atoms/index.ts
import { atom } from "jotai";

export const userAtom = atom<User | null>(null);
export const apiKeyAtom = atom<string>("");
export const resumeAtom = atom<Resume | null>(null);
```

### TanStack Query

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["job-analysis", jobId],
  queryFn: () => fetchJobAnalysis(jobId),
  staleTime: 1000 * 60 * 10, // 10 min cache
});

const { mutate, isPending } = useMutation({
  mutationFn: (url: string) => analyzeJob(url),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["jobs"] });
  },
});
```

---

## Custom Hook Rules

```tsx
// Separate data hooks from UI hooks
function useJobAnalysis(jobId: string) {} // data only
function useJobCardExpanded() {} // UI state only

// Used in one place → same file, below the component
// Used in multiple places → hooks/ directory

// Return stable references
function useJobFilter() {
  const [filter, setFilter] = useState("all");
  const updateFilter = useCallback((f: string) => {
    setFilter(f);
  }, []);
  return { filter, updateFilter };
}
```

---

## Performance Rules

```tsx
// React.memo — prevent unnecessary re-renders
const JobCard = React.memo(function JobCard({ job }: Props) {
  return <div>{job.title}</div>;
});

// useCallback — only when passing to memo'd children
const handleAnalyze = useCallback((id: string) => {
  analyzeJob(id);
}, []);

// useMemo — only when passing objects to memo'd children
const options = useMemo(() => ({ status: "active", minScore: 80 }), []);

// key to force remount
<JobPanel key={selectedJobId} jobId={selectedJobId} />;
```

---

## useReducer

Use when 3+ related states exist:

```tsx
type AnalysisState =
  | { status: "idle" }
  | { status: "crawling" }
  | { status: "analyzing" }
  | { status: "success"; data: AnalysisResult }
  | { status: "error"; message: string };

type Action =
  | { type: "START_CRAWL" }
  | { type: "START_ANALYZE" }
  | { type: "SUCCESS"; data: AnalysisResult }
  | { type: "ERROR"; message: string };

function reducer(state: AnalysisState, action: Action): AnalysisState {
  switch (action.type) {
    case "START_CRAWL":
      return { status: "crawling" };
    case "START_ANALYZE":
      return { status: "analyzing" };
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
// Always return cleanup
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/analyze", { signal: controller.signal })
    .then((r) => r.json())
    .then(setData)
    .catch((err) => {
      if (err.name === "AbortError") return;
    });

  return () => controller.abort();
}, [jobId]);

// useLayoutEffect — only when DOM measurement is needed
useLayoutEffect(() => {
  const { width } = ref.current.getBoundingClientRect();
  setWidth(width);
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

export class CrawlError extends AppError {
  constructor(url: string) {
    super(`Crawling failed: ${url}`, "CRAWL_FAILED", 422);
  }
}

export class AnalysisError extends AppError {
  constructor(message: string) {
    super(message, "ANALYSIS_FAILED", 500);
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
```

### Principles

```
1. Never ignore errors — always catch
2. Separate user-facing messages from internal logs
3. Expected errors → AppError subclass
4. Unexpected errors → console.error + generic message
5. Never expose stack traces in API Routes
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
Good code doesn't need comments.
Needing a comment signals unclear code.
Fix naming before reaching for a comment.

What (what the code does) → no comment, express via naming
Why  (why it's done this way) → comment required
```

### When NOT to Comment

```tsx
// Bad: obvious from the code
// get user
const user = getUser();

// Bad: self-explanatory
// filter jobs with score above 80
const filtered = jobs.filter((j) => j.score >= 80);
```

### When to Comment

```tsx
// Good: explains why
// Without 100ms delay, Supabase session refresh causes
// expired token due to server/client timing mismatch
await new Promise((resolve) => setTimeout(resolve, 100));

// Good: business rule
// Show "Highly Recommended" badge only for scores >= 85
// Threshold agreed upon with product team
const RECOMMEND_THRESHOLD = 85;

// Good: complex regex
// Wanted job URL pattern: /wd/{number}
const WANTED_URL_PATTERN = /\/wd\/(\d+)/;

// Good: temporary code
// TODO: replace with Playwright crawling
const jobData = await fetchJobByText(text);

// Good: external issue reference
// Workaround for Supabase session timing bug
// https://github.com/supabase/supabase/issues/123
```

### JSDoc — Public Functions and Hooks Only

```tsx
/**
 * Calculates skill matching score between a job posting and resume.
 * @param jobSkills - skills required by the job posting
 * @param resumeSkills - skills listed in the resume
 * @returns matching score between 0 and 100
 */
export function calculateSkillScore(
  jobSkills: string[],
  resumeSkills: string[]
): number {}

/**
 * Hook for fetching job analysis results.
 * Caches Claude API response for 10 minutes.
 */
export function useJobAnalysis(jobId: string) {}
```

### TODO Format

```ts
// TODO: to be done later
// FIXME: known bug
// HACK: temporary workaround (must explain why)
// NOTE: important context
// WARN: caution
```

---

## Testing Rules

### Unit Tests

```tsx
// components/job/job-card.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { JobCard } from "./job-card";

describe("JobCard", () => {
  it("renders company name and position", () => {
    render(
      <JobCard
        job={{
          id: "1",
          company: "Toss",
          title: "Frontend Engineer",
        }}
      />
    );
    expect(screen.getByText("Toss")).toBeInTheDocument();
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
  });
});
```

### API Mocking (MSW)

```ts
// mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/analyze", () => {
    return HttpResponse.json({
      score: 85,
      summary: "Strong tech stack match",
    });
  }),
];
```

### Test File Location

Place test files next to the component:

```
components/job/
├── job-card.tsx
└── job-card.test.tsx
```

### When to Write Tests

```
Implement feature → write tests immediately
Never batch tests to write later
```

### Test Priority

```
1st: Business logic (score calculation, matching logic)
2nd: Key components (JobCard, AnalysisResult)
3rd: API Routes
4th: E2E — critical flows only (Playwright)
```

---

## Supabase Rules

```ts
// lib/supabase/client.ts — browser
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts — server components & API Routes
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
NEXT_PUBLIC_*  → accessible on client (safe to expose)
others         → server only (API keys, secrets)
```

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Never prefix with NEXT_PUBLIC_
CLAUDE_API_KEY=...
```

---

## Animation Rules

```
transform, opacity → allowed (GPU composited)
width, height, top, left → never animate (triggers layout)
```

---

## Git Convention

### Commit Messages

```
<type>: <subject>

feat     new feature
fix      bug fix
refactor code improvement without behavior change
style    formatting, no logic change
test     add or update tests
chore    build, config changes
docs     documentation
perf     performance improvement
```

```bash
# Good
feat: add job posting URL crawling
fix: fix score calculation bug
test: add unit tests for useJobAnalysis hook

# Bad
git commit -m "fix"
git commit -m "update"
```

### Branch Strategy

```
main         → production (auto deploy via Vercel)
dev          → development integration
feat/<name>  → feature development
fix/<name>   → bug fix
chore/<name> → config, docs
```

### Workflow

```bash
git checkout dev
git pull origin dev
git checkout -b feat/job-crawling

# after work
git add .
git commit -m "feat: add job posting URL crawling"
git push origin feat/job-crawling
# PR → merge into dev
# when feature complete → PR dev → main
```

### PR Rules

```
- Keep PRs small (one feature or bug per PR)
- PR title follows commit message format
- No direct push to main
- dev → main only when feature is complete
```
