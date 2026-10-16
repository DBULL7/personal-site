---
name: "Tidal — Devon Bull (/tidal only)"
description: "A route-scoped portfolio study: quiet pearl space and a live ocean of points."
colors:
  ink: "#163d49"
  muted: "#3d5f68"
  ground: "#edf4f3"
  line: "#bbd1d2"
  primary-hover: "#376471"
  selection: "#4b7c87"
  scene-overlay: "#edf4f3ef"
  control-border: "#afc9ce"
  sky-middle: "#e5efef"
  sea-ground: "#a7cbd0"
  moon: "#87aeb9"
  reflection: "#e1f0eb"
  wave-crest: "#427f8e"
  wave-current: "#286070"
typography:
  display:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(48px, 5.4vw, 80px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  display-compact:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(40px, 10.2vw, 58px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(36px, 4vw, 54px)"
    fontWeight: 500
    lineHeight: 1.09
    letterSpacing: "-0.035em"
  headline-compact:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "38px"
    fontWeight: 500
    lineHeight: 1.09
    letterSpacing: "-0.035em"
  body:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    lineHeight: 1.8
  body-compact:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "15px"
    lineHeight: 1.8
  hero-body:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  hero-body-compact:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "15px"
    lineHeight: 1.65
  title:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "24px"
    letterSpacing: "-0.02em"
  title-compact:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "22px"
    letterSpacing: "-0.02em"
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
  identity-compact:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    letterSpacing: "-0.02em"
rounded:
  panel: "8px"
  pill: "99px"
spacing:
  icon-gap: "6px"
  compact-gap: "12px"
  link-gap: "20px"
  page-inset-min: "24px"
  row-block: "28px"
  compact-section-gap: "40px"
  page-inset: "clamp(24px, 5vw, 84px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "13px 21px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-compact:
    padding: "12px 18px"
  motion-control:
    backgroundColor: "{colors.scene-overlay}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "10px 13px"
  motion-control-hover:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
  scene-caption:
    backgroundColor: "{colors.scene-overlay}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "12px 16px"
  navigation:
    backgroundColor: "{colors.ground}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    height: "100px"
    padding: "0 clamp(24px, 5vw, 84px)"
  navigation-compact:
    height: "88px"
    padding: "0 24px"
  destination-row:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "28px 0"
  footer:
    textColor: "{colors.muted}"
    typography: "{typography.caption}"
    padding: "28px clamp(24px, 5vw, 84px)"
---

# Design System: Tidal — Devon Bull

## Overview

**Creative North Star: "Tidal — an ocean of individual points, moving as one"**

Tidal pairs restrained portfolio typography with an expansive, procedural ocean. Cool pearl space holds the introduction; teal points, a dotted moon, and a narrow reflected current create depth without competing with the text. The atmosphere is calm and curious, grounded in Devon Bull’s verified software-engineering identity.

This system has authority only over `/tidal`: `app/tidal/page.tsx`, `app/tidal/preview.tsx`, and `app/tidal/preview.module.css`. The original homepage, blog, global theme tokens, and shared components retain their incumbent authority. The system sans stack is the explicitly recorded translation of the user’s Apple-like direction for this preview; it is not a new site-wide font mandate.

**Key Characteristics:**

- Pearl ground, dark teal text, and restrained blue-green water.
- Large, centered display copy with generous open space; compact functional navigation.
- Live canvas art with a readable static state and an explicit motion control.
- Flat pill controls, a soft caption panel, and open destination rows separated by fine rules.

Evidence: the finished route source and the supplied [desktop](.impeccable/review/desktop.png) and [mobile](.impeccable/review/mobile.png) captures. The [direction contract](.impeccable/surfaces/app-tidal-page-tsx.md) records the user-pinned Tidal world, acknowledged seed 18599330, and approved code-first path. No separate comp or unavailable catalog-board comparison is asserted. [PRODUCT.md](PRODUCT.md) supplies the durable identity, content, route-isolation, and reduced-motion constraints. All shipping artwork is generated live; review PNGs are validation evidence.

## Colors

The palette combines cool pearl surfaces, dark teal typography, and quiet blue-green water. Frontmatter owns the exact values; the names below identify their application.

The sidecar’s eight-step OKLCH ramps are generated swatch aids, not additional shipping colors or an implemented tonal scale.

### Primary

- **Deep Teal Ink** (`ink`) carries headings, identity, primary-button fill, control text, arrows, and keyboard outlines.
- **Lifted Teal** (`primary-hover`) lightens the primary action on hover.
- **Selection Teal** (`selection`) pairs with pearl foreground for selected text.

### Secondary

- **Tidal Current** (`wave-current`) supplies most ocean points; **Wave Crest** (`wave-crest`) marks higher wave phases.
- **Moon Blue** (`moon`) supplies the dotted moon. **Moonlit Reflection** (`reflection`) makes the reflected lane with translucent pale points.
- **Sea Ground** (`sea-ground`) closes the vertical sky-to-water gradient.

### Neutral

- **Pearl Ground** (`ground`) covers the page, navigation, hero fallback, and primary-action text.
- **Quiet Teal** (`muted`) supports descriptions and footer text.
- **Mist Rule** (`line`) separates destination rows and the footer.
- **Pearl Overlay** (`scene-overlay`) backs the scene caption and motion control while retaining a trace of the ocean beneath.
- **Control Edge** (`control-border`) outlines the motion pill. **Sky Mist** (`sky-middle`) softens the middle of the canvas gradient.

**The Quiet Sky Rule.** Keep primary copy and its action legible in the pale sky; use the ocean’s stronger tones in the artwork rather than as competing text accents.

## Typography

**Display and body font:** the frontmatter’s Helvetica Neue–led system sans stack, inherited from the route wrapper. No webfont is loaded for this route, and font synthesis is disabled. This is the explicitly recorded Apple-like translation for `/tidal`; do not infer a general license for system display typography elsewhere.

The hierarchy is compact and unornamented. Headlines use medium weight and tight tracking; body text has more line spacing and a quieter color. There is no separate label or monospace family.

### Hierarchy

- **Display / display-compact:** the centered, two-line hero heading. Desktop and compact sizes, weight, line height, and tracking are normative in frontmatter. Headline wrapping is balanced.
- **Headline / headline-compact:** the lower introduction. Its effective width cap is 400px at both sizes, constrained by the available column; the source uses balanced wrapping and preserved line breaks.
- **Body / body-compact:** the lower introduction paragraph, up to 440px wide.
- **Hero-body / hero-body-compact:** the short centered introduction, up to 365px on desktop and 270px on compact screens, with pretty wrapping and margins of 22px above / 24px below.
- **Title / title-compact:** open destination-row labels. Their supporting descriptions use 14px text and 1.5 line height, with 8px of separation.
- **Label:** desktop navigation and primary action. Compact navigation uses 12px; the compact primary action uses 13px.
- **Caption:** scene explanation, motion-control label, and desktop footer. Compact scene text and the footer attribution use 11px; the scene description has 1.5 line height.
- **Identity / identity-compact:** the name. Its secondary professional line is 12px on desktop / 11px on compact screens at weight 400 and zero tracking. The scene title uses medium weight at 14px / 13px.

**The Measured Type Rule.** Use size, weight, and spacing to establish hierarchy within the recorded sans family; preserve the compact overrides instead of shrinking the desktop composition uniformly.

## Layout

The route is a full-width page with a navigation band, immersive hero, lower introduction and destination links, then a ruled footer. Shared site navigation is suppressed only at the exact `/tidal` pathname by `components/site-header.tsx`. The route wrapper owns its colors and clipping; it does not redefine global theme tokens.

The horizontal page inset follows `spacing.page-inset`. Navigation is 100px tall. The hero uses `height: calc(100svh - 100px)`, bounded by a 650px minimum and 920px maximum. Its effective copy position is centered, 24px from either side and 5% from the top, with no width cap. The scene footer sits 24px above the bottom and aligns to the page inset. The supplied desktop capture is 1440px wide with a 900px hero.

The lower section uses columns in a 1:1.2 ratio, a 12vw gap, and padding of 100px above / 110px below. Its fragment target has a 30px scroll margin. Destination rows remain open to the page ground. The footer uses a horizontal flex layout with a fine top rule.

At **700px and below**, the navigation becomes 88px tall with a fixed 24px side inset. The first navigation link (Explore) and navigation arrows are hidden; Writing and Connect remain. The hero is exactly 730px tall, with no minimum/maximum bounds, and the centered copy begins 30px from its top. The scene footer uses a 20px bottom inset and 12px gap; its caption is capped at 230px, with the explanatory text capped at 185px. The motion control narrows while retaining its minimum touch height.

The compact lower section becomes one column, uses a 40px gap and padding of 70px above / 76px below. The footer wraps its attribution onto a full-width final row and keeps the right-hand contact link aligned right. The supplied compact capture is 390px wide.

Canvas geometry uses **width below 700px** for its compact branch, distinct from the inclusive CSS query. Its moon center is 73% across / 33% down on wider scenes, and 74% across / 43% down on compact scenes. The radius is the smaller of 66px and 9% of width on wider scenes / 11.5% on compact scenes. These are artwork geometry, not generic layout tokens.

Only effective declarations are recorded. Earlier left-aligned hero values, the earlier 740px compact height, earlier column proportions, the 300px compact heading cap, and the 1600px copy-offset override are superseded by later rules in the stylesheet; they are not alternative supported layouts.

## Elevation & Depth

The interface has no box shadows, text shadows, or backdrop blur. Its controls are flat; the scene caption and motion control gain separation through the translucent pearl overlay. Fine strokes organize the lower content. The artwork creates depth by increasing point size and opacity toward the foreground, warping projected rows into waves, and introducing a pale reflected lane.

**The Point Depth Rule.** Build depth with the ocean’s projection, density, transparency, and tonal change; the surrounding interface remains flat.

## Shapes

The primary action and motion control use the pill radius. The caption uses the smaller panel radius. Destination rows and page sections remain open rectangles with straight dividing rules. Arrows use inline stroked SVG with rounded stroke caps and joins, not text glyphs. Scene geometry comes from circular moon dots and elliptical water points.

## Components

### Primary action

A compact filled pill anchors the open sky. It uses ink fill, pearl text, a 20px icon gap, an 18px inline arrow, and a minimum height of 48px. Its padding and color variants are in frontmatter. The background transitions over 0.2 seconds; compact text is 13px. It is an anchor to the existing portfolio section, not a form button.

### Keyboard focus and skip link

Every route anchor and button receives a visible 2px solid ink outline offset by 6px. The explicit ink color is the corrected final source; do not infer the outline from a control’s foreground. The skip link is positioned above the viewport until focused, then appears 12px from the top and 20px from the left with 14px padding, ink fill, and pearl text. It targets the lower portfolio links.

### Navigation and footer

Navigation pairs the two-line identity with a compact link group: 34px desktop gaps / 18px compact gaps, with links at least 44px tall. Hover underlines sit 5px below the text. The header is in document flow rather than sticky. The footer repeats the identity and contact destination with smaller typography; its links retain the same minimum height, hover underline, and focus treatment. External destinations retain the existing GitHub and LinkedIn URLs, with writing linked to `/blog` and identity to `/`.

### Scene caption and motion control

The caption is a soft pearl panel with a 5px gap between its title and explanation. Compact padding becomes 10px vertically / 12px horizontally. The adjacent motion pill has a 1px control-edge stroke, a 6px icon gap, a 16px inline SVG, and a minimum height of 44px. Its minimum width is 92px on desktop / 76px in compact layout; compact padding is 10px. Hover makes its background fully opaque.

The control shows Play while paused and Pause while running; `aria-pressed` equals the paused state and its accessible label names the operation. It is hidden if no 2D canvas context is available. The initial state is paused until the media preference is read; normal preference starts motion and reduced motion leaves it paused. Manual playback remains available.

### Destination rows

Each destination is a single link with left-aligned title and description plus a 22px inline arrow at the right. Rows have a minimum height of 118px, a 20px internal gap, frontmatter padding, and a bottom rule; the first also has a top rule. Hover moves the arrow 5px right over 0.2 seconds. There are no elevated cards, tags, text inputs, or form fields on this route.

### Procedural ocean

The decorative canvas is hidden from assistive technology and sits behind the semantic hero. A vertical gradient moves from pearl through sky mist at 48% to sea ground. The moon uses a 4px dot grid and 0.7px dot radius with opacity 0.38 on wider screens / 0.55 on compact screens. The ocean draws 80 rows by 140 columns; ellipses grow toward the viewer and use current, crest, or reflection colors. This is live drawing code, not an image asset.

The animation targets 30 drawn frames per second, caps device-pixel ratio at 1.5, and caps each elapsed-time increment at 0.05 seconds. It preserves elapsed time through Play/Pause, redraws on resize, and stops scheduling drawing while offscreen or the document is hidden. Pointer input ignores touch; only vertical pointer position affects the water geometry, by up to approximately 1.5px at the foreground. The source records horizontal position but does not use it, so no horizontal-current interaction is promised.

Reduced-motion preference starts the ocean paused and disables CSS transitions and smooth scrolling within the route. Explicit user playback can restart the canvas. No extra entrance animation, blur, camera zoom, or continuous DOM animation is part of this system.

## Do's and Don'ts

### Do:

- **Do** keep this system scoped to `/tidal` and preserve the original homepage’s visual authority.
- **Do** retain clear space around the hero copy, primary action, and moon at both captured sizes.
- **Do** preserve explicit dark teal keyboard focus, semantic links, the skip link, and controls at least 44px tall.
- **Do** retain the static ocean when paused or reduced motion is requested, with a manual Play control.
- **Do** use the effective final CSS values and the actual public portfolio destinations.

### Don't:

- **Don’t** turn this preview’s palette or system font into a global homepage redesign.
- **Don’t** replace the live procedural ocean with a shipping raster or imply the review captures are source artwork.
- **Don’t** hide the artwork when motion is paused or add touch-driven parallax that the source does not implement.
- **Don’t** introduce invented employers, project results, testimonials, metrics, or availability.
- **Don’t** treat shadowed CSS declarations or unavailable catalog boards as evidence of the finished design.
