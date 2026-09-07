# Verify the Signal index

Use Node and npm with the committed package-lock.json. The professional pages read `content/signal.json`. Keep private drafts and evidence outside this repository. Only approved records belong in that file.

## Run the site

```sh
npm ci
npm run build
npm run start -- --port 3000
```

Open `/`, `/career`, `/work/cloud-console`, `/resume`, and `/lab`. The Matrix animation is opt-in on `/lab`. `/systems` redirects to `/career`. Existing blog URLs and the blog's robots exclusion remain unchanged.

## Check routes and initial HTML

In another terminal, run:

```sh
npm run check:signal -- http://localhost:3000
```

The command exits unsuccessfully for missing routes, broken resume links, absent essential content, obsolete claims, or invalid sitemap targets. It checks the named Christmas light-show post because that existing destination must remain available.

## Check the browser

Install verification tools outside the application. These commands require Google Chrome.

```sh
npm install --prefix /tmp/signal-tooling playwright @axe-core/playwright pdfjs-dist
node scripts/check-signal-browser.mjs http://localhost:3000 /tmp/signal-results /tmp/signal-tooling
```

The script saves screenshots and JSON results. It checks 390, 768, and 1440 CSS-pixel widths, selected WCAG rules, keyboard focus, no-JavaScript reading, local links, and content without graphics. The 720px reflow check represents a 1440px viewport at 200% zoom. It does not automate browser zoom itself or prove screen-reader usability. Inspect the screenshots and test browser zoom separately.

## Update the resume and social card

After you change approved records, build and start the site, then run:

```sh
node scripts/resume-pdf.mjs http://localhost:3000 /tmp/signal-tooling
node scripts/generate-signal-social.mjs
```

Commit `public/resume.pdf`, `content/resume-manifest.json`, and the generated social images with their content change. Restart the production server after generating new public files.

To check the committed PDF's source hash, file hash, and selectable text, run:

```sh
node scripts/resume-pdf.mjs http://localhost:3000 /tmp/signal-tooling check
```

The PDF generator prints `/resume`. That route uses the same records as `/career`. No private DOCX enters the repository or PDF pipeline. Hashes detect stale artifacts. Human review still determines whether a new claim is approved.

## Known baseline lint issue

`npm run lint` now invokes ESLint directly. Next.js 16 removed `next lint`. The pinned Zod development dependency satisfies the installed lint plugin's peer requirement without changing Contentlayer's major version.

Full-repository lint still reports `react-hooks/static-components` in the unchanged `components/mdx-content.tsx` and an unused suppression in `app/tags/[tag]/ListLayout.tsx`. The Signal work does not suppress those checks or change the MDX renderer. Check modified Signal files separately and keep the full-lint failure visible in the PR.

A successful local build or automated accessibility check does not establish real-user performance, indexing, or production readiness. These PRs are alternatives for preview. Do not merge them together.
