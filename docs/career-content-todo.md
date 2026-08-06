# Career content TODO — one sitting, and both pages are publishable

Every `TODO(devon)` placeholder rendered on `/career` and `/systems` is listed here. They are
deliberately visible on the page (amber, monospace, dotted underline) so nothing vague ships by
accident. Fill them in, delete the `<Todo>` wrapper, done.

**Rule used while writing:** no invented metrics, no invented employers, no invented dates.

Find every remaining placeholder at any time:

```bash
grep -rn "Todo>\|TODO(devon)" app components config
```

---

## ✅ 0. The 2022 → 2026 gap is CLOSED

Superseded by the owner's own update. The record now reads as four engagements under one firm:

| #   | Engagement                                | Period         | Role                                 |
| --- | ----------------------------------------- | -------------- | ------------------------------------ |
| 01  | Apple — internal cloud & developer portal | 2024 → present | Product engineer, React + TypeScript |
| 02  | Apple — third-party cloud resource UI     | 2022 → 2024    | **Sole engineer, two years**         |
| 03  | Chick-fil-A — third-party delivery        | 2020 → 2022    | Project engineering lead             |
| 04  | Apple — chatbot platform                  | 2018 → 2020    | Backend lead                         |

Employer: **Stellar Elements (formerly Big Nerd Ranch), an Amdocs company — July 2018 → present.**

Remaining precision work on the recent eras:

- [ ] Exact start and end **months** for the 2022 → 2024 Apple engagement.
- [ ] Exact start **month** for the 2024 → present Apple engagement.
- [ ] **Current title.** The 2022 résumé says Solutions Architect; the site repeats it in the
      masthead, the fact sheet, the employer block, and the JSON-LD `jobTitle`.
- [ ] One concrete number for the developer-portal work: teams onboarded, providers supported,
      steps removed from a workflow, time saved per request.
- [ ] One concrete number for the two-year solo product: users, teams, resources managed, or
      tickets deflected. This is the single highest-value missing fact left on the page.
- [ ] Team shape on both recent Apple engagements — who you work with, who you report to.
- [ ] Confirm the backend, build tooling, design system, state management, testing, and CI on
      the two recent Apple projects (the "Stack" rows).

## 1. Blocking before this goes to a recruiter

- [x] Public email — `devjbull@gmail.com`, approved, wired into the CTAs and the JSON-LD.
      (The phone number from the résumé is deliberately **not** on the site.)
- [ ] **Résumé PDF.** Drop the file at `public/resume.pdf`, or repoint `profile.resume` in
      `config/profile.ts`. The CTA is wired in the masthead and both contact panels; it 404s now.
- [ ] Confirm availability wording — `config/profile.ts` → `availability.state` / `.detail`.
      Currently "Open to product engineer, senior, and staff roles."
- [ ] Confirm the **Product Engineer** positioning reads right to you. It drives the masthead
      role line, the page titles, the OG copy, and "What I want next".

## 2. Chick-fil-A record (2020–2022)

- [ ] Team size, and who you reported to.
- [ ] Confirm the datastore, and whether Go was in this codebase.

## 3. Apple chatbot record (2018–2020)

- [ ] Team size, and who you reported to.
- [ ] Confirm datastore, hosting, and CI on this engagement.

## 4. How I got here — `career-data.tsx` → `path`

Sourced from the résumé. One optional addition:

- [ ] What happened to Haller after the accelerator. One honest clause — "wound down after the
      accelerator", "still running", "sold" — makes the whole chapter land harder.

## 5. Proof of work — `app/career/page.tsx` → evidence section

- [ ] **Publish the voice-cloning draft.** `posts/early-experiments-in-voice-cloning.mdx` has
      `draft: true`. It is the strongest applied-AI evidence available.
- [ ] Confirm the EnzoJS npm link, and whether EnzoJS / Unavee / U-Hoops are still worth
      featuring or should be cut as too old.

## 6. Systems — scenarios — `app/systems/systems-data.tsx` → `scenarios`

Five of six now cite real, sourced evidence. One gap:

- [ ] Scenario 06 (blind production): one incident you led, with detection and resolution time.

## 7. Systems — decision log — `systems-data.tsx` → `decisions`

Six entries, each anchored to real work from the record, but the _framing_ is written in your
voice and asserted as your call.

- [ ] **Read all six and confirm they are accurate.** If any is not a call you actually made or
      argued for, change it or cut it. This is the highest-risk content on the site.
- [ ] `DEC-05` (observability): alert volume before and after, if you kept the numbers.

## 8. Systems — stack annotations — `systems-data.tsx` → `stackGroups`

- [ ] **Go** — on the résumé but not attached to any engagement. Which project?
- [ ] **Kubernetes** — same question. Which engagement?
- [ ] Optional: add a "since YYYY" column across all rows. Recruiters screen on years.

## 9. Systems — seniority signals — `systems-data.tsx` → `seniority`

Six of seven are sourced. One gap:

- [ ] Mentorship: engineers you have onboarded, mentored, or promoted.

---

## Optional, high leverage

- [ ] Confirm `/profile_pic.jpg` is the headshot you want search engines surfacing — it is the
      `Person.image` in the JSON-LD on `/career`.
- [ ] One sentence of third-party attestation — a client lead's quote — outperforms a paragraph
      of self-description.
- [ ] The "Builds with / Stores in / Runs on / Watches with" rows come from the 2022 résumé.
      Prune anything you would not want to be interviewed on today.

## Also corrected in this branch

The site previously described Devon as an embedded-systems engineer and framed the Apple and
Chick-fil-A engagements as embedded work. That is factually wrong and was removed from
`app/career`, `app/systems`, `app/page.tsx`, `app/layout.tsx`, and `config/site.ts`.
`app/orbital` still contains the phrase "embedded in the real world" in a non-technical sense
and was deliberately left untouched.
