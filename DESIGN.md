---
name: "Afterlight — Devon Bull"
description: "The finished visual system for the isolated /afterlight portfolio preview."
colors:
  ink: "#e9f4f7"
  muted: "#a5beca"
  ground: "#050810"
  line: "#263747"
  headline-cyan: "#87dce5"
  action-cyan: "#a4e6ec"
  action-ink: "#07141c"
  explore-ground: "#0a101b"
  caption-ground: "#0a1423f5"
  caption-ink: "#d8f4f7"
  control-line: "#45616f"
  selection-cyan: "#8adbe6"
  lattice-cyan: "#278aab"
  lattice-ice: "#96f9fa"
  lattice-magenta: "#df77db"
  horizon-cyan: "#71d8e3"
typography:
  display:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(58px, 6.3vw, 96px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  display-mobile:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(46px, 11.5vw, 68px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(36px, 4vw, 54px)"
    fontWeight: 500
    lineHeight: 1.09
    letterSpacing: "-0.035em"
  headline-mobile:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "38px"
    fontWeight: 500
    lineHeight: 1.09
    letterSpacing: "-0.035em"
  title:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    letterSpacing: "-0.02em"
  title-mobile:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    lineHeight: 1.8
  body-mobile:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "15px"
    lineHeight: 1.8
  hero-body:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  hero-body-mobile:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "15px"
    lineHeight: 1.65
  description:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14px"
    lineHeight: 1.5
  label:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14px"
  caption:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "12px"
  identity:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    letterSpacing: "-0.02em"
rounded:
  caption: "8px"
  pill: "99px"
spacing:
  small: "8px"
  compact: "12px"
  control-gap: "20px"
  gutter: "24px"
  row: "28px"
  mobile-section-gap: "40px"
components:
  button-primary:
    backgroundColor: "{colors.action-cyan}"
    textColor: "{colors.action-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "13px 21px"
  button-motion:
    backgroundColor: "{colors.caption-ground}"
    textColor: "{colors.caption-ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "10px 13px"
  button-motion-hover:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
  navigation:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "100px"
    padding: "0 clamp(24px, 5vw, 84px)"
  destination-row:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "28px 0"
  scene-caption:
    backgroundColor: "{colors.caption-ground}"
    textColor: "{colors.caption-ink}"
    rounded: "{rounded.caption}"
    padding: "12px 16px"
  footer:
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
    padding: "28px clamp(24px, 5vw, 84px)"
---

# Design System: Afterlight — Devon Bull

## Overview

**Creative North Star: "Afterlight"**

Afterlight is an illuminated perspective landscape with restrained portfolio typography. An ink-dark field holds ice-white and cyan text; a curved lattice of small cyan points carries depth, with magenta confined to the artwork. The owner’s Apple-like restraint and Tron-inspired point-grid direction are the confirmed visual commitments.

This document applies only to the finished `/afterlight` preview and its local components. It does not authorize changes to the incumbent homepage, blog, shared theme, or other preview concepts. Its source is the effective cascade in `app/afterlight/preview.module.css`, the canvas and components in `app/afterlight/preview.tsx`, and the desktop and mobile review captures. The existing system sans stack is recorded for this scoped, approved implementation; it is not a default display-font prescription for unrelated surfaces.

**Key Characteristics:**
- Dark tonal surfaces, luminous type, and restrained cyan controls.
- A full-width perspective lattice drawn live from points, without raster imagery.
- Large, tightly tracked headings and short, readable supporting copy.
- Open link rows, compact edge navigation, and stoppable motion.

## Colors

The palette combines a near-black blue ground with cold, luminous accents; the frontmatter owns exact values.

### Primary

- **Headline Cyan** highlights the second line of the hero title.
- **Action Cyan** is the solid primary-link fill, paired with **Action Ink** for its text and arrow.
- **Lattice Cyan**, **Lattice Ice**, and **Horizon Cyan** belong to the drawn perspective scene.
- **Selection Cyan** provides the local text-selection highlight against the dark ground.

### Secondary

- **Lattice Magenta** marks a sparse, repeating set of point columns in the scene. It is not used for navigation or calls to action.

### Neutral

- **Ground** anchors the hero, navigation, and footer; **Explore Ground** lifts the lower content section by tone.
- **Ink** carries main content and **Muted** supports descriptions and utility text.
- **Line** divides destination rows and the footer. **Control Line** outlines the motion control.
- **Caption Ground** is the near-opaque dark plate shared by the scene caption and motion control; **Caption Ink** keeps their small text legible over the point field.

**The Luminous Hierarchy Rule.** Keep interface text and controls in the ice-and-cyan family; magenta belongs to the point lattice.

The sidecar’s eight-step OKLCH strips are generated palette previews, not additional shipped color tokens.

## Typography

**Display Font:** Helvetica Neue, followed by Helvetica and the platform sans fallbacks listed in the frontmatter.
**Body Font:** The same stack. There is no separate mono or decorative face.

**Character:** Large, compact headings carry the visual identity while supporting prose stays modest and loose enough to read. This is a record of the approved preview’s existing stack, not a new global font policy.

### Hierarchy

- **Display:** The `display` role is the hero’s two-line title; `display-mobile` replaces its size and leading at the compact breakpoint. The emphasized line changes color, not font or weight.
- **Headline:** The `headline` role introduces the lower section, with `headline-mobile` on compact screens. Its measure is limited (410px desktop, 300px mobile).
- **Title:** The `title` role names destination links, with `title-mobile` on compact screens.
- **Body:** The `body` role supports the lower introduction, with a constrained measure (440px). `hero-body` uses tighter leading and a shorter measure (330px desktop, 280px mobile). Mobile variants reduce the body size without reducing leading ratios.
- **Description:** The `description` role supports each destination title.
- **Label / Caption:** The `label` and `caption` roles serve controls, navigation, and footer metadata. Compact navigation and footer metadata reduce further as described below. Labels stay in ordinary sentence case.
- **Identity:** The `identity` role is the strongest small text; the profession line is smaller and muted (12px desktop, 11px mobile).

**The Quiet Type Rule.** Use size, spacing, and the observed medium weights to establish hierarchy; keep interface labels in sentence case.

## Layout

The page uses a full-width dark canvas with a shared fluid horizontal gutter (`clamp(24px, 5vw, 84px)`). Navigation is an edge-to-edge flex row. The hero occupies the available small viewport height below navigation (`calc(100svh - 100px)`), bounded by a minimum (650px) and maximum (920px).

The hero copy is positioned above the scene at the shared left gutter, with its final top offset (13%) and a maximum width (700px). This later declaration overrides the earlier wide-screen offset; the source’s 1600px media query has no effective layout change. Caption and motion control sit at opposite lower edges with a shared bottom inset (24px).

The lower section uses equal columns with a fluid gap (8vw) and generous vertical padding (100px above, 110px below). Destination links remain open rows separated by fine rules, with a minimum row height (118px). The footer aligns identity, scene credit, and connection link across one row.

At the compact breakpoint (700px and below), gutters settle at (24px), navigation height becomes (88px), and the Explore navigation item and small navigation arrow are hidden. The remaining links keep their touch targets; navigation labels reduce to (12px) and the identity to (16px). The hero has a fixed height (760px), the copy begins (36px) below its top, and the scene remains full width. The primary link’s label and padding reduce (13px; 12px 18px) while its minimum height remains unchanged.

The lower section becomes one column, with a section gap (40px) and padding (70px 24px 76px). The caption and motion control stay side by side with reduced insets and padding. The footer wraps its credit to a full-width last row; its padding becomes (22px 24px). These observations define this preview’s responsive behavior, not a breakpoint policy for the incumbent site.

## Elevation & Depth

There are no box shadows, backdrop blurs, or raised card effects in this preview. The lower section separates from the hero by background tone; the caption’s opaque plate protects small text. Perspective belongs to the decorative canvas: point rows spread and grow toward the foreground, bend into walls, and fade toward the horizon.

**The Point Depth Rule.** Create the scene’s depth through perspective, point spacing, point size, and opacity; interface surfaces use tonal separation and fine rules.

The drawing uses bounded animation (30 frames per second, device pixel ratio capped at 1.5). Time advances the lattice, and non-touch pointer movement shifts its horizontal vanishing point. Motion pauses offscreen and when the document is hidden, preserves elapsed time when manually paused, and follows changes to the reduced-motion preference. Reduced motion starts with a still scene; an explicit Play action can start it. The small interface transitions are removed under reduced motion.

## Shapes

Solid and outlined controls use the `pill` radius. The scene caption uses the smaller `caption` radius. Navigation, destination rows, the full-width content section, and footer remain unboxed. Fine borders provide structure; they do not enclose every content block.

Arrows and play/pause symbols are inline SVG geometry. The point field uses small circular marks and one fine vertical horizon stroke. There are no shipping raster assets or image-composition dependencies.

## Components

### Primary link

A compact luminous pill leads into the lower portfolio links. It uses the frontmatter’s `button-primary` treatment, a minimum height (48px), and an arrow separated from its label by a deliberate gap (20px). The arrow is smaller than the destination-row arrows (18px).

The final fill is unchanged on hover: an earlier hover color is overridden by a later important declaration. That inactive hover value is excluded from the tokens. Links and buttons use an explicit Ink focus outline (2px, offset 6px), keeping the keyboard indicator light regardless of the component’s text color.

### Motion control

A small outlined pill shares the caption’s dark plate and pale text. Its minimum target is (92px by 44px), narrowing to (76px by 44px) on compact screens. Hover changes the plate to Ground and the text to Ink. Play and Pause swap inline SVG geometry and accessible labels; the pressed state means the scene is paused. If the canvas context is unavailable, the motion control is omitted.

### Navigation

The identity is a two-line text link. The desktop navigation uses open text links with a minimum target height (44px), a gap (34px), and an inline arrow for the external connection. Compact navigation reduces the gap (18px). Hover underlines the link with a small offset (5px); keyboard focus uses the local outline geometry. The shared incumbent header is suppressed on `/afterlight` only.

### Destination rows

Each open row pairs a title and short description with an arrow. The first row begins with a top rule and every row ends with a bottom rule. Hover shifts only the arrow horizontally (5px over 0.2s); reduced motion removes that transition. The whole row is the link, preserving a generous target without a separate small icon button.

### Scene caption

A compact, softly rounded dark plate contains the scene name and a short descriptive sentence. It uses stacked text with a small gap (5px). Compact screens reduce its padding (10px 12px), cap the plate width (230px), and constrain the description (185px) so it shares the lower edge with the motion control.

### Footer and keyboard entry

The footer repeats the subdued open-link language and fine top rule. Its links keep a minimum target height (44px). A skip link appears at the upper left on keyboard focus and moves directly to the portfolio-link section. Text, destinations, and controls remain ordinary HTML; the canvas is hidden from assistive technology.

The sidecar contains six self-contained HTML/CSS specimens of these observed components. They represent appearance and CSS states; the actual canvas and playback state remain implemented in React. There are no input fields or filter chips to document.

## Do's and Don'ts

### Do:
- **Do** keep this system scoped to `/afterlight`; preserve the incumbent homepage’s authority.
- **Do** preserve the owner’s restrained typography and Tron-inspired point-grid perspective.
- **Do** keep real links and readable text independent of the decorative canvas.
- **Do** keep the scene usable as a still image and expose its play/pause control.
- **Do** retain reduced-motion support, touch-sized controls, and keyboard access.
- **Do** resolve final CSS overrides before recording or extending a token.

### Don't:
- **Don't** move magenta from the lattice into ordinary interface labels or action fills.
- **Don't** replace the live point geometry with raster art or imply that unavailable catalog boards were viewed.
- **Don't** turn this preview’s composition or scoped system-font choice into a rule for other routes.
- **Don't** inherit inactive draft values as reusable design rules.
