# Career content TODO — one sitting, and both pages are publishable

Every `TODO(devon)` placeholder rendered on `/career` and `/systems` is listed here. They are
deliberately visible on the page (amber, monospace, dotted underline) so nothing vague ships by
accident. Fill them in, delete the `<Todo>` wrapper, done.

**Rule used while writing:** no invented metrics, no invented employers, no invented dates.
Everything not in this list is sourced from Devon's own résumés.

Find every remaining placeholder at any time:

```bash
grep -rn "Todo>\|TODO(devon)" app components config
```

---

## ⚠︎ 0. THE ONE THAT MATTERS — the 2022 → present gap

The résumé record ends when the Chick-fil-A engagement ends in 2022. Four years of the freshest,
most-scrutinised part of a career is currently empty. It is rendered on `/career` as the **first
and most prominent record** (`engagements[0]` in `app/career/career-data.tsx`, id `current`) with
a muted treatment and a TODO body, so the page is honest about the hole and the timeline can
absorb the entry the moment it exists.

- [ ] Are you still at Big Nerd Ranch? If not, where, and from when?
- [ ] Current title and level.
- [ ] Client / product since the Chick-fil-A engagement ended.
- [ ] What shipped, and **the number that proves it** — same shape as the Apple and Chick-fil-A
      records (`60s → 2s`, `1M → 15M`, `$1M → $5M/day`).
- [ ] What changed about how you work: scope, ownership, people.
- [ ] One sentence on what the last four years taught you.
- [ ] If any of this window is a career break, say so plainly — a stated break reads far better
      than an unexplained gap.

Filling this record is worth more than every other item in this document combined.

## 1. Blocking before this goes to a recruiter

- [x] Public email — `devjbull@gmail.com`, wired into the CTAs and the JSON-LD `Person.email`.
      (The phone number from the résumé is deliberately **not** on the site.)
- [ ] **Résumé PDF.** Drop the file at `public/resume.pdf`, or repoint `profile.resume` in
      `config/profile.ts`. The Résumé CTA is already wired in the masthead and both contact
      panels; right now it 404s.
- [ ] Confirm availability wording — `config/profile.ts` → `availability.state` / `.detail`.
- [ ] Confirm current title. The site says "Solutions Architect, Big Nerd Ranch" from the 2022
      résumé, in the masthead, the fact sheet, and the JSON-LD `jobTitle`.
- [ ] NDA sanity check on naming Apple and Chick-fil-A. Both already appear on the live site, so
      this is presumed fine, but it is worth one deliberate look.

## 2. Employer / fact sheet — `app/career/page.tsx`, `career-data.tsx`

- [ ] Current title (see above) — appears twice, in the employer block and the fact sheet.
- [ ] What you have been building since 2022 (fact-sheet "Clients" row).

## 3. Chick-fil-A record (2020–2022) — `career-data.tsx` → `engagements[1]`

Everything factual here is sourced. Only one gap:

- [ ] Team size, and who you reported to.
- [ ] Confirm the datastore, and whether Go was in this codebase (the "Stack" row).

## 4. Apple record (2018–2020) — `career-data.tsx` → `engagements[2]`

- [ ] Team size, and who you reported to.
- [ ] Confirm datastore, hosting, and CI on this engagement (the "Stack" row).

## 5. How I got here — `career-data.tsx` → `path`

No placeholders; sourced from the résumé (JDB Capital 2010–13, B.A. Economics Kansas 2015,
COO of Haller 2015, Turing 2017, U-Hoops freelance 2017–18, Big Nerd Ranch 2018).

- [ ] Optional: what happened to Haller after the accelerator. One honest clause — "wound down
      after the accelerator", "still running", "sold" — makes the whole chapter land harder.

## 6. Proof of work — `app/career/page.tsx` → evidence section

- [ ] **Publish the voice-cloning draft.** `posts/early-experiments-in-voice-cloning.mdx` has
      `draft: true`. It is the strongest applied-AI evidence available and the systems page
      already leans on that experience. Flip the flag.
- [ ] Confirm the EnzoJS npm link, and whether the side projects (EnzoJS, Unavee, U-Hoops) are
      still worth featuring or should be cut as too old.

## 7. Systems — scenarios — `app/systems/systems-data.tsx` → `scenarios`

Four of the five now cite real, sourced evidence. One gap:

- [ ] Scenario 05 (blind production): one incident you led, with detection and resolution time.

## 8. Systems — decision log — `systems-data.tsx` → `decisions`

Each entry is anchored to real work from the record, but the *framing* is written in your voice
and asserted as your call.

- [ ] **Read all five and confirm they are accurate.** If any is not a call you actually made or
      argued for, change it or cut it. This is the highest-risk content on the site.
- [ ] `DEC-05` (observability): alert volume before and after, if you kept the numbers.

## 9. Systems — stack annotations — `systems-data.tsx` → `stackGroups`

- [ ] **Go** — on the résumé but not attached to any engagement. Which project?
- [ ] **Kubernetes** — same question. Which engagement?
- [ ] Optional: add a "since YYYY" column across all rows. Recruiters screen on years.

## 10. Systems — seniority signals — `systems-data.tsx` → `seniority`

Five of six are sourced. One gap:

- [ ] Mentorship: engineers you have onboarded, mentored, or promoted.

---

## Optional, high leverage

- [ ] Confirm `/profile_pic.jpg` is the headshot you want search engines surfacing — it is the
      `Person.image` in the JSON-LD on `/career`.
- [ ] One sentence of third-party attestation — a client lead's quote — outperforms a paragraph
      of self-description.
- [ ] The "Ships in / Stores in / Runs on / Watches with" rows in the fact sheet come from the
      2022 résumé verbatim. Prune anything you would not want to be interviewed on.

## Also corrected in this branch

The site previously described Devon as an embedded-systems engineer and framed the Apple and
Chick-fil-A engagements as embedded work. That is factually wrong. Removed from
`app/career`, `app/systems`, `app/page.tsx`, `app/layout.tsx`, and `config/site.ts`.
`app/orbital` still contains the phrase "embedded in the real world" in a non-technical sense and
was deliberately left untouched.
