# Career content TODO — one sitting, and both pages are publishable

Every `TODO(devon)` placeholder rendered on `/career` and `/systems` is listed here.
They are deliberately visible on the page (amber, monospace, dashed underline) so nothing
vague ships by accident. Fill these in, delete the `<Todo>` wrapper, and the pages are done.

**Rule used while writing:** no invented metrics, no invented employers, no invented dates.
Where a fact was unknown it became a placeholder instead of a plausible-sounding sentence.

Search for remaining placeholders at any time:

```bash
grep -rn "Todo>\|TODO(devon)" app components config
```

---

## 0. Blocking — must be real before this goes to a recruiter

- [ ] **Public contact email.** `config/profile.ts` → `email`. Currently `devon@devonbull.com`,
      which is a *guess*. The mailto CTA on both pages and the JSON-LD `Person.email` use it.
- [ ] **Résumé PDF.** Drop the file at `public/resume.pdf` (or repoint `profile.resume`).
      The Résumé CTA is already wired on both pages and in the masthead.
- [ ] **Availability wording.** `config/profile.ts` → `availability.state` / `availability.detail`.
      Confirm the status is accurate and how you want contract-to-hire framed.

## 1. Employer / firm — `app/career/page.tsx`, `app/career/career-data.tsx`

- [ ] Name of the consulting firm, and whether you can name it publicly.
- [ ] Your title progression there, with promotion dates.
- [ ] Start month/year of tenure (drives "Tenure" in the at-a-glance table).
- [ ] Any other clients you are contractually allowed to name.
- [ ] Embedded language + toolchain for the "Ships in" row: C, C++, Rust, Embedded Linux, RTOS?

## 2. Apple engagement — `career-data.tsx` → `engagements[0]`

- [ ] Period: start → end, month and year.
- [ ] Your title on the engagement, and whether you were IC or lead.
- [ ] Team size, and who you reported to.
- [ ] The deliverable in one sentence, at whatever detail the NDA allows
      ("firmware for X", "test harness for Y").
- [ ] **One number.** Devices covered, tests added, build time cut, defects caught, latency moved.
      This is the single highest-value line on the whole page.
- [ ] Anything that outlived the engagement — a tool, a doc, a process the team kept using.
- [ ] The specific tradeoff you remember arguing about, and which way it went.
- [ ] Stack: languages, RTOS/OS, build system, debugger, CI, hardware-in-the-loop setup.

## 3. Chick-fil-A engagement — `career-data.tsx` → `engagements[1]`

- [ ] Period: start → end, month and year.
- [ ] Your title on the engagement, IC or lead.
- [ ] Team size, and who you reported to.
- [ ] What the system actually did in a restaurant, in one sentence a non-engineer understands.
- [ ] Scale: locations, devices, or transactions touched.
- [ ] The operational win: downtime avoided, manual steps removed, support tickets reduced.
- [ ] The failure mode you designed for, and how you proved it worked.
- [ ] Stack: device platform, protocol (BLE/MQTT/serial/HTTP), backend services, OTA path.

## 4. Platform & product engagements — `career-data.tsx` → `engagements[2]`

- [ ] Rough date range for the non-embedded work.
- [ ] Title(s), and whether you owned architecture on any of them.
- [ ] Typical team shape: engineers, PM, designer, client stakeholders.
- [ ] One named system you can point at, plus the number that proved it worked.

## 5. Founder chapter — `career-data.tsx` → `founder`

- [ ] Company name.
- [ ] Founded → exit or wind-down, with years.
- [ ] What the product was, who paid for it, and the one metric you watched.
- [ ] Headcount at peak, and what you personally owned.
- [ ] How it ended: acquired, wound down, still running, sold.

> This section is written to be a differentiator. It is currently the thinnest part of the page
> because it is the part I could not source. Filling it is worth more than everything else here.

## 6. Written proof — `app/career/page.tsx` → evidence section

- [ ] Two or three public artifacts: an open-source repo, a talk, a patent, a shipped device
      anyone can buy. The three most recent field notes are pulled in automatically from
      Contentlayer — no action needed there.

## 7. Systems — scenario evidence — `app/systems/systems-data.tsx` → `scenarios`

- [ ] `01` Hardware/cloud contract: the engagement where you did this, and what integration
      week looked like as a result.
- [ ] `02` Field failure: the specific field failure you chased down, and how you caught it.
- [ ] `03` Blind production: an incident you led or were point on — detection time, resolution,
      what changed afterwards.
- [ ] `04` Slow delivery: before/after numbers on a pipeline or release process you fixed.
- [ ] `05` AI reality check: already backed by the published voice-cloning field note.

## 8. Systems — decision log — `systems-data.tsx` → `decisions`

The reasoning in each entry is your engineering position and needs no sourcing. What is missing
is the project each call came from.

- [ ] `DEC-01` Postgres vs DynamoDB: which engagement, and the traffic shape.
- [ ] `DEC-03` Local-first devices: which deployment, and the offline duration you designed for.
- [ ] `DEC-04` Kubernetes: which engagement raised it, and which way the client went.
- [ ] `DEC-05` Observability: alert volume before/after, if you have the numbers.
- [ ] Review all five for accuracy — these are written in your voice and asserted as your calls.
      If any is not actually a call you made, change it or cut it.

## 9. Systems — stack annotations — `systems-data.tsx` → `stackGroups`

- [ ] Embedded C/C++ row: exact languages, RTOS or embedded Linux, and years on each.
- [ ] Device ↔ cloud protocols row: which protocols you actually shipped
      (BLE, MQTT, serial, gRPC, plain HTTPS).
- [ ] Hardware-in-the-loop row: the rig you used or built, and what it caught.
- [ ] Optional: add a "since YYYY" column across all rows. Recruiters screen on years.

## 10. Systems — seniority signals — `systems-data.tsx` → `seniority`

- [ ] Ownership: the largest system you have been the named owner of.
- [ ] Mentorship: engineers you have onboarded, mentored, or promoted.
- [ ] Incident response: an incident you led, with detection and resolution time.
- [ ] Architecture: a design doc or ADR you can share or paraphrase.

---

## Optional but high leverage

- [ ] A headshot for the JSON-LD `Person.image` — currently pointing at `/profile_pic.jpg`.
      Confirm that file is the one you want a search engine surfacing.
- [ ] A one-line reference or quote from a client lead. One sentence of third-party
      attestation outperforms a paragraph of self-description.
- [ ] Total years of professional engineering experience, stated once near the top.
