# Contributing to Jobsick 🤒

First off, thank you for considering contributing to Jobsick!
This project exists to help job seekers, and every contribution matters.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Commit Convention](#commit-convention)
- [Branch Strategy](#branch-strategy)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be respectful. Be constructive. We're all here to help job seekers.

- Use welcoming and inclusive language
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm
- Git
- A Claude API key (get one at [console.anthropic.com](https://console.anthropic.com))
- A Supabase account (free tier is fine)

### Development Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/jobsick.git
cd jobsick

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.local.example .env.local
# Fill in your own keys in .env.local

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## How to Contribute

### 1. Find something to work on

- Check [Issues](https://github.com/jihoon1125/jobsick/issues)
- Look for `good first issue` label if you're new
- Look for `help wanted` label for open tasks
- Or propose something new

### 2. Comment on the issue

Before starting work, comment on the issue to let others know
you're working on it. This avoids duplicate work.

### 3. Create a branch

```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-feature-name
```

### 4. Make your changes

Follow the coding standards in [CLAUDE.md](./CLAUDE.md).

### 5. Test your changes

```bash
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run format:check  # Prettier
npm run test:run      # Vitest
```

All checks must pass before submitting a PR.

### 6. Submit a Pull Request

Push your branch and open a PR against `dev` (not `main`).

---

## Pull Request Process

1. **Target branch**: Always PR into `dev`, never `main`
2. **Title**: Follow commit convention (e.g. `feat: add job crawling`)
3. **Description**: Fill out the PR template
4. **Size**: Keep PRs small and focused (one feature or bug)
5. **CI**: All GitHub Actions checks must pass
6. **Review**: PRs will be reviewed and merged by maintainers

### PR Template

When you open a PR, use this format:

```
## What does this PR do?
A brief description of the change.

## Why?
Context and motivation.

## How to test?
Steps to verify the change works.

## Screenshots (if UI change)
Before / After screenshots.

## Checklist
- [ ] Tests added or updated
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Prettier formatted
```

---

## Commit Convention

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
docs: update README setup instructions

# Bad
git commit -m "fix"
git commit -m "update stuff"
```

---

## Branch Strategy

```
main          → production (protected)
dev           → development integration (default PR target)
feat/<name>   → new features
fix/<name>    → bug fixes
chore/<name>  → config, tooling, docs
```

---

## Coding Standards

Please read [CLAUDE.md](./CLAUDE.md) for the full coding standards.

Key points:

- TypeScript strict mode — no `any`, no `as` casting
- Named exports only (no `export default` except Next.js files)
- Max 80 characters per line
- Double quotes, 2-space indentation
- Test files next to source files (`job-card.test.tsx`)
- Comments explain **why**, not what

---

## Reporting Bugs

Found a bug? Please open an issue with:

- **Title**: Clear, concise description
- **Steps to reproduce**: Numbered list
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: OS, Node version, browser
- **Screenshots**: If applicable

Use the `bug` label.

---

## Suggesting Features

Have an idea? Open an issue with:

- **Title**: Clear description of the feature
- **Problem**: What problem does this solve?
- **Proposed solution**: How you think it should work
- **Alternatives**: Other approaches you considered

Use the `enhancement` label.

---

## Questions?

Feel free to open a Discussion or reach out via Issues.

Thanks for contributing! 🤒
