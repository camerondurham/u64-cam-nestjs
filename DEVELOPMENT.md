# Development Guide

## Next.js Architecture Overview

This is a **Next.js 15** application using the **App Router** architecture with static site generation. As a backend engineer, here are the key concepts:

### App Router vs Pages Router
- Uses **App Router** (not the legacy Pages Router)
- File-system based routing in the `app/` directory
- Each folder = route segment, special files define behavior:
  - `page.tsx` = page component
  - `layout.tsx` = shared layout
  - `loading.tsx` = loading UI
  - `error.tsx` = error UI

### Static Site Generation (SSG)
- Configured for static export (`output: 'export'`)
- Generates static HTML at build time
- No server-side rendering or API routes in production
- Similar to Jekyll/Hugo but with React

## Directory Structure

```
├── app/                    # App Router (defines routes)
│   ├── layout.tsx         # Root layout (wraps all pages)
│   ├── page.tsx           # Home page (/)
│   ├── posts/             # Blog route (/posts)
│   │   ├── page.tsx       # Posts listing page
│   │   └── [slug]/        # Dynamic route for individual posts
│   │       └── page.tsx   # Individual post page
│   ├── projects/          # Projects route (/projects)
│   └── api/               # API routes (build-time only)
├── content/               # Markdown content (data layer)
│   ├── posts/            # Blog post .md files
│   ├── projects/         # Project .md files
│   └── photos/           # Photo metadata
├── components/           # Reusable React components
├── lib/                  # Utility functions
│   └── markdown.ts       # Markdown processing logic
├── public/              # Static assets
└── out/                 # Generated static site (after build)
```

## Data Flow

### 1. Content Layer (`content/`)
Markdown files with YAML frontmatter:
```markdown
---
title: "My Post"
date: "2024-01-01"
description: "Post description"
---

# Post Content
```

### 2. Processing Layer (`lib/markdown.ts`)
- Reads markdown files from `content/`
- Parses YAML frontmatter using `gray-matter`
- Converts markdown to HTML using `remark`
- Provides type-safe interfaces (`PostData`, `ProjectData`)

### 3. Presentation Layer (`app/`)
- React components consume processed data
- Server Components fetch data at build time
- Static HTML generated for each route

## Key Concepts for Backend Engineers

### Server Components vs Client Components
- **Server Components** (default): Run at build time, can access filesystem
- **Client Components** (`'use client'`): Run in browser, handle interactivity
- This app primarily uses Server Components for static generation

### Route Handlers (`app/api/`)
- Similar to Express.js routes but for Next.js
- Only run at build time in static export mode
- Used for generating RSS feeds, sitemaps, etc.

### Dynamic Routes
- `[slug]` folders create dynamic routes
- `params.slug` contains the dynamic segment
- Used for individual blog posts and projects

## Development Workflow

### Local Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Content Management
1. Add markdown files to `content/posts/` or `content/projects/`
2. Include required frontmatter fields
3. Files automatically appear on site after restart

### Adding New Routes
1. Create folder in `app/`
2. Add `page.tsx` for the route component
3. Optionally add `layout.tsx` for route-specific layout

### Styling
- **Tailwind CSS** for utility-first styling
- **Typography plugin** for markdown content styling
- Global styles in `app/globals.css`

## Build Process

### Static Export
```bash
npm run build        # Generates static files in `out/`
```

### Deployment
- Static files in `out/` can be served by any web server
- No Node.js runtime required in production
- Configured for GitHub Pages deployment

## Configuration Files

### `next.config.js`
```javascript
const nextConfig = {
  output: 'export',        // Static export mode
  trailingSlash: true,     // Add trailing slashes to URLs
  images: {
    unoptimized: true      // Disable image optimization for static export
  }
}
```

### `package.json` Scripts
- `dev`: Development server with Turbopack (faster builds)
- `build`: Production build and static export
- `lint`: ESLint code quality checks

## Common Patterns

### Data Fetching in Server Components
```typescript
// app/posts/page.tsx
import { getAllPosts } from '@/lib/markdown'

export default function PostsPage() {
  const posts = getAllPosts('posts')  // Runs at build time
  return (
    <div>
      {posts.map(post => (
        <article key={post.slug}>{post.title}</article>
      ))}
    </div>
  )
}
```

### Dynamic Route Parameters
```typescript
// app/posts/[slug]/page.tsx
interface Props {
  params: { slug: string }
}

export default function PostPage({ params }: Props) {
  const post = getPostData('posts', params.slug)
  return <article>{post.content}</article>
}
```

### Metadata Generation
```typescript
export async function generateMetadata({ params }: Props) {
  const post = await getPostData('posts', params.slug)
  return {
    title: post.title,
    description: post.description
  }
}
```

## Troubleshooting

### Common Issues
1. **Build failures**: Check markdown frontmatter syntax
2. **Missing pages**: Ensure `page.tsx` exists in route folders
3. **Styling issues**: Verify Tailwind classes and CSS imports
4. **Type errors**: Check TypeScript interfaces in `lib/markdown.ts`

### Debug Mode
- Use `console.log` in Server Components (shows in build output)
- Use browser dev tools for Client Components
- Check `.next/` directory for generated files during development
