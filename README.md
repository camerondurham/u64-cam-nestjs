# u64.cam - Personal Portfolio Website

A **Next.js 15** personal portfolio website using the **App Router** architecture with static site generation. Built for performance and simplicity.

## Architecture Overview

This is a **static site generator** built with Next.js that:
- Uses **App Router** (file-system based routing)
- Generates **static HTML** at build time (no server required)
- Processes **Markdown content** with YAML frontmatter
- Deploys as **static files** to any web server

### Key Technologies
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Markdown** processing with `gray-matter` and `remark`
- **Static export** for deployment

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/                    # App Router (defines routes)
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page (/)
│   ├── posts/             # Blog posts (/posts)
│   ├── projects/          # Projects (/projects)
│   └── api/               # API routes (build-time only)
├── content/               # Markdown content
│   ├── posts/            # Blog post .md files
│   ├── projects/         # Project .md files
│   └── photos/           # Photo metadata
├── components/           # Reusable React components
├── lib/                  # Utility functions
│   └── markdown.ts       # Markdown processing
├── public/              # Static assets
└── out/                 # Generated static site
```

## Content Management

### Adding Blog Posts
1. Create a new `.md` file in `content/posts/`
2. Add YAML frontmatter:
```markdown
---
title: "Your Post Title"
date: "2024-01-01"
description: "Post description"
---

# Your content here
```

### Adding Projects
1. Create a new `.md` file in `content/projects/`
2. Add frontmatter with optional `extra.link_to` field:
```markdown
---
title: "Project Name"
description: "Project description"
weight: 1
extra:
  link_to: "https://github.com/user/repo"
---

Project details...
```

## Development

### File-System Routing
- `app/page.tsx` → `/` (home page)
- `app/posts/page.tsx` → `/posts` (blog listing)
- `app/posts/[slug]/page.tsx` → `/posts/my-post` (individual post)
- `app/projects/page.tsx` → `/projects` (projects listing)

### Server vs Client Components
- **Server Components** (default): Run at build time, can access filesystem
- **Client Components** (`'use client'`): Run in browser for interactivity
- This project primarily uses Server Components for static generation

### Styling
- **Tailwind CSS** for utility-first styling
- **Typography plugin** for markdown content
- Global styles in `app/globals.css`

## Deployment

### Static Export
The site builds to static files in the `out/` directory:
```bash
npm run build  # Generates static files
```

### Hosting Options
- **GitHub Pages** (current setup)
- **Netlify** / **Vercel** 
- Any static file server (nginx, Apache, S3, etc.)

No server-side runtime required - just serve the static files.

## Configuration

### `next.config.js`
```javascript
const nextConfig = {
  output: 'export',        // Enable static export
  trailingSlash: true,     // Add trailing slashes
  images: {
    unoptimized: true      // Required for static export
  }
}
```

### Environment
- **Development**: Hot reload with Turbopack
- **Production**: Static HTML generation
- **TypeScript**: Full type checking

## Learn More

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Static Exports Guide](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Detailed development guide
