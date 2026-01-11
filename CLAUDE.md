# Personal Site - Devon Bull

## Project Overview
Personal portfolio and blog site for Devon Bull, a Senior Software Engineer.

## Tech Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4, Radix UI
- **Content:** Contentlayer2 with MDX for blog posts
- **Icons:** Font Awesome
- **Theming:** next-themes (dark/light mode)
- **Language:** TypeScript (strict mode)

## Project Structure
```
app/                  # Next.js App Router pages
  blog/               # Blog listing and [slug] pages
  tags/               # Tag listing and filtering
components/           # React components
  ui/                 # shadcn/ui components
posts/                # MDX blog posts
public/               # Static assets
config/               # Site configuration
lib/                  # Utility functions
```

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs contentlayer first)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix lint issues with Prettier and ESLint

## Code Style
- Prettier for formatting (configured in .prettierrc.json)
- ESLint with Next.js and Prettier configs
- Husky + lint-staged for pre-commit hooks
- Path aliases: `@/*` maps to project root

## Key Patterns
- Page metadata exported from page.tsx files
- Tiles component for skill badges on home page
- Matrix rain canvas animation as background effect
- Blog posts use MDX with frontmatter (title, date, tags, summary)

---

## Potential Updates

### Bug Fixes
- [ ] Fix "Postgress" typo → should be "Postgres" (app/page.tsx:61)

### Content
- [ ] Add more blog posts
- [ ] Add a Projects section to showcase work
- [ ] Add an About page with more detailed bio
- [ ] Update profile description beyond "I'm a Software Engineer"

### Features
- [ ] Add contact form or email link
- [ ] Add resume/CV download option
- [ ] Add TypeScript and Express.js custom icons (noted in TODO comment)
- [ ] Add RSS feed for blog
- [ ] Add search functionality for blog posts
- [ ] Add reading time estimate to blog posts

### UI/UX
- [ ] Improve tile grid layout (last row alignment when not full)
- [ ] Add hover animations to skill tiles
- [ ] Add page transitions
- [ ] Improve mobile navigation
- [ ] Add "scroll to top" button on long pages

### Performance & SEO
- [ ] Add OpenGraph images for social sharing
- [ ] Add structured data (JSON-LD) for better SEO
- [ ] Consider lazy loading matrix rain on mobile for performance
- [ ] Add sitemap.xml generation

### Technical Debt
- [ ] Remove unused `test.tsx` component if not needed
- [ ] Consider migrating from Font Awesome to Lucide (already installed)
- [ ] Add unit tests
