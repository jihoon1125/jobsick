# Jobsick 🤒

AI-powered job posting analysis service for job seekers.

Paste a job posting URL or text, and get a comprehensive analysis — resume matching, company reputation, and salary fit — all in one place.

> **Note:** This is an open-source project. Users provide their own Claude API key.

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Start dev server
npm run dev
```

## Tech Stack

| Category  | Technology                     |
| --------- | ------------------------------ |
| Framework | Next.js 14 (App Router)        |
| Language  | TypeScript (strict)            |
| Styling   | Tailwind CSS + shadcn/ui       |
| State     | Jotai + TanStack Query         |
| Database  | Supabase (PostgreSQL)          |
| Auth      | Supabase Auth (GitHub OAuth)   |
| AI        | Claude API (BYOK)              |
| Crawling  | Playwright                     |
| Testing   | Vitest + Testing Library + MSW |
| Deploy    | Vercel                         |

## Scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start dev server (Turbopack) |
| `npm run build`        | Production build             |
| `npm run lint`         | Run ESLint                   |
| `npm run typecheck`    | Run TypeScript type check    |
| `npm run test`         | Run tests (watch mode)       |
| `npm run test:run`     | Run tests once               |
| `npm run format`       | Format code with Prettier    |
| `npm run format:check` | Check formatting             |

## Project Structure

```
app/                  # Next.js App Router pages & API routes
components/
├── ui/               # shadcn/ui components
├── common/           # Shared (header, footer, spinner, etc.)
├── job/              # Job posting components
├── analysis/         # Analysis result components
└── resume/           # Resume components
lib/                  # Utilities, Supabase clients, error types
hooks/                # Shared custom hooks
atoms/                # Jotai atoms
types/                # Global type definitions
mocks/                # MSW handlers & server
```

## License

MIT
