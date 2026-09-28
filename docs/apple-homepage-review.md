# Homepage review and agent-readable content

Reviewed September 28, 2026. The Apple PRs are a dependency stack, not four alternatives.

| PR | Contribution | Disposition |
| --- | --- | --- |
| [117](https://github.com/DBULL7/personal-site/pull/117) | Quiet canvas, system typography, simpler header | Preserve and consolidate; repair lint rather than removing it. |
| [118](https://github.com/DBULL7/personal-site/pull/118) | Identity, role, introduction | Preserve; shorten the first viewport and connect it to real destinations. Its original `#work` link only becomes usable with 119. |
| [119](https://github.com/DBULL7/personal-site/pull/119) | Four career engagements, explicit employer/client relationship | Preserve on `/work`; preview two engagements on the homepage. |
| [120](https://github.com/DBULL7/personal-site/pull/120) | Consistent writing and tag pages | Preserve; restore missing typography styles and prevent direct access to drafts. |

The replacement branch contains the original stack's commits. Superseding its PRs does not discard the work. Other experiments and dependency PRs are outside this review.

## Findings and repairs

- **P1 — Published URL access to drafts.** `app/blog/[slug]/page.tsx` used every Contentlayer post for lookup and static parameters. `/blog/hello` returned 200 even though `draft: true` hid it from the index. This was inherited behavior, particularly important to repair before opening crawler access. Public lists, routes, sitemap, and exports now use one filtered collection. Unknown/draft article URLs return 404.
- **P2 — Writing styles were ineffective.** `app/globals.css` imported Tailwind 4 but did not register the typography plugin. The JavaScript Tailwind config was not loaded. The refreshed article used `prose-*` classes, yet a rendered H2 computed to 16px with no top margin. Explicit plugin registration produces a 28px heading and 40px top margin. Explicit class-based dark variants also align utilities with the theme toggle.
- **P2 — Useful content was undiscoverable.** `public/robots.txt` disallowed `/blog`, while the static sitemap listed only the homepage with a 2023 timestamp. Generated metadata routes now allow published writing and enumerate actual public pages, without inventing modification dates.
- **P2 — Lint was bypassed.** PR 117 removed ESLint from the commit hook. The actual problems were an incompatible Zod peer resolution and a legacy config adapter around Next 16's native flat config. The replacement pins a compatible Zod major through a direct development dependency, loads the flat config, uses `eslint .`, and restores the hook. One local exception documents Contentlayer's memoized component hook, which the new static-component rule cannot recognize.
- **P2 — The first visit demanded too much scrolling.** A viewport-height identity section led into four large, similarly structured résumé sections. The homepage now introduces the person, previews two engagements, and links to public writing. Full work detail remains ordinary server-rendered HTML with stable anchors.

## Visual hierarchy assessment of the original stack

| Dimension | Rating | Observation and change |
| --- | --- | --- |
| Entry point | Pass | The name was unambiguous. Preserve it and put the employer alongside the role. |
| Eye flow | Major issue | Repeated full-width work chapters dominated the journey. Use short previews, a dedicated work destination, writing, and contact links. |
| Weight | Minor issue | Every engagement had comparable visual weight regardless of the reader's intent. Highlight two examples and keep all four accessible. |
| Emphasis | Minor issue | Work and Blog were small, equally weighted links after a large empty first fold. Give work the primary action and retain a clear writing link. |

Apple's restraint is useful here: strong type, generous space, simple navigation, and clear content. Product-page spectacle would need genuine artifacts of the work to justify it. Client names and large black sections alone do not provide that evidence.

## Human and agent entry points

| URL | Purpose |
| --- | --- |
| `/` | Concise introduction, selected work, writing, contact. |
| `/work#<engagement-id>` | Complete public responsibilities and history; stable citation targets. |
| `/profile.json` | Versioned structured profile with separate employer/client fields, source URLs, and public writing metadata. |
| `/profile.md` | The same career content as readable Markdown. |
| `/llms.txt` | Supplemental index of public resources. This is a discovery convenience, not a promise that every agent uses it. |
| `/sitemap.xml` | Generated list of real public HTML pages. |

The homepage also includes `ProfilePage`/`Person` JSON-LD and links to the structured exports. HTML, JSON, and Markdown derive from `config/profile.ts`; writing metadata derives from published Contentlayer posts. No browser JavaScript, API key, database, or model call is required to read this content.

Keep work details: they are the useful evidence for both readers and agents. Keep the homepage brief and let the work page carry depth. A downloadable résumé PDF is also worth adding once there is a maintained résumé source; none is tracked here. The work page has print styling, but is not presented as a complete résumé. The existing career claims were carried forward, not independently verified or refreshed from a résumé during this review.

## Where Jev fits next

TypeSafe documents Jev as a model that returns typed decisions, scores, and probabilities, rather than generated prose. Its passage-classification cookbook places it after retrieval and before an answering model. Citation checking is another possible stage. It does not replace content ingestion, storage, retrieval, or the answer generator. Sources: [Introduction](https://docs.typesafe.ai/introduction), [Passage classification](https://docs.typesafe.ai/cookbooks/classifying_rag_passages), [Citation checking](https://docs.typesafe.ai/cookbooks/citation_check).

Proposed experiment, not implemented in this PR:

1. Make a small question set with expected source IDs: employer versus client, solo ownership, delivery leadership, cloud tools, career periods, and questions the site cannot answer. Include misleading premises and unsupported requests.
2. Establish a baseline using the public records directly. Four engagements and one published article do not yet justify a vector database. Try exact/keyword retrieval first; add embeddings only if evaluation exposes a retrieval gap.
3. Run Jev on each shortlisted question/passage pair to assess relevance, answer evidence, and contradictory premises. Choose thresholds using labeled examples. Compare against the baseline on retrieval accuracy, abstention, latency, and cost.
4. Optionally generate an answer from the accepted sources with an independently selected text model. Return citation URLs and abstain when evidence is insufficient. Compare this with simply returning relevant excerpts and links.
5. Before a public endpoint, choose its deployment workspace and credential source, then add request limits, timeouts, caching, and a useful no-model fallback. Do not put credentials in client code. Treat retrieved material as data; Jev scoring is not a security boundary.

The acceptance question is whether this improves answers about the actual public portfolio. It is not whether the demo can produce a plausible answer. TypeSafe also publishes [known model limitations](https://docs.typesafe.ai/model-jaggedness/jev-1.13); confidence should be evaluated on this corpus, not treated as a guarantee.

## Validation

The review reproductions and browser inspection used the actual branch at desktop and mobile widths. Automated public-site tests check endpoint MIME types, work citation anchors, employer relationships, server-rendered discovery, sitemap inclusion, and draft/unknown-route exclusion.

Run `npm run build`, start the production server on port 3100, then run `npm run test:public-site`. Set `PUBLIC_SITE_TEST_URL` for another local port. Run `npm run lint` and `tsc --noEmit` for static checks. The existing npm lockfile is retained to avoid coupling this review to a package-manager migration.
