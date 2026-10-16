---
name: Windfield — Devon Bull
description: A sunlit point landscape with quiet, precise portfolio typography.
colors:
  ink: "#183b32"
  muted: "#31584b"
  ground: "#e7eee3"
  line: "#bdcbb9"
  action-hover: "#315b47"
  selection: "#386653"
  scene-overlay: "#e7eee3f2"
  control-border: "#acc2a6"
  sky-middle: "#e8eddb"
  sky-low: "#c1d3a5"
  sun: "#c8a75a"
  terrain-lit: "#6c8c35"
  terrain-mid: "#477a47"
  terrain-shade: "#22564b"
typography:
  display:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(48px, 5.7vw, 86px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(36px, 4vw, 54px)"
    fontWeight: 500
    lineHeight: 1.09
    letterSpacing: "-0.035em"
  title:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "24px"
    letterSpacing: "-0.02em"
  identity:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    lineHeight: 1.8
  body-hero:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  label:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14px"
  caption:
    fontFamily: "'Helvetica Neue', Helvetica, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "12px"
rounded:
  scene-caption: "8px"
  pill: "99px"
spacing:
  compact: "8px"
  small: "12px"
  inset: "16px"
  control-gap: "20px"
  gutter-min: "24px"
  row: "28px"
  stack: "40px"
  gutter: "clamp(24px, 5vw, 84px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "13px 21px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-motion:
    backgroundColor: "{colors.scene-overlay}"
    textColor: "{colors.ink}"
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
    backgroundColor: "{colors.scene-overlay}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.scene-caption}"
    padding: "12px 16px"
---

# Design System: Windfield — Devon Bull

## Overview

**Creative North Star: "A wider horizon"**

Windfield pairs a sunlit landscape made from points with quiet, precise typography. Pale mineral surfaces, deep pine text, and jade-to-olive terrain leave room for the artwork to breathe. Controls remain small and legible, with open rows directing visitors toward the portfolio's real destinations.

The owner explicitly requested Apple-like typographic restraint and animated dot-matrix art. The implemented system-sans stack is a deliberate expression of that direction. The interface is flat and spacious; perspective, density, and gentle movement give the landscape its depth.

This contract applies only to the finished `/windfield` alternative, evidenced by `app/windfield/page.tsx`, `app/windfield/preview.tsx`, and `app/windfield/preview.module.css`. It does not replace or prescribe changes to the existing homepage, blog, shared global tokens, or the other alternatives. The surface-specific story remains in `.impeccable/surfaces/app-windfield-page-tsx.md`.

**Key Characteristics:**

- Mineral sky, pine typography, and sunlit green points.
- One restrained sans-serif family with tightly tracked headings.
- Open ruled links, pill controls, and no interface shadows.
- Bounded, stoppable motion with a readable static composition.
- A full-width landscape that survives the single-column mobile layout.

## Colors

The palette is a continuous green world: dark pine organizes the interface, while softened greens and a muted gold create daylight in the landscape.

### Primary

- **Deep Pine (`ink`)** anchors text, the filled primary action, visible focus outlines, and the scrollbar thumb.
- **Leaf Hover (`action-hover`)** is the filled action's hover state.
- **Selection Green (`selection`)** pairs with the ground text color for selected copy.

### Secondary

- **Sunlit Olive (`terrain-lit`)**, **Jade (`terrain-mid`)**, and **Pine Shade (`terrain-shade`)** are the three point colors selected by the terrain's light calculation. They are artwork colors, not UI status categories.

### Tertiary

- **Stippled Gold (`sun`)** is reserved for the point-rendered sun in this landscape.

### Neutral

- **Mineral Ground (`ground`)** connects the page, navigation, and top of the sky; it also reverses out of the primary action.
- **Muted Pine (`muted`)** carries body copy, the engineering role, and footer text.
- **Quiet Line (`line`)** separates destination rows and the footer.
- **Mineral Overlay (`scene-overlay`)** protects scene captions and motion controls over the terrain. It is near-opaque, with no backdrop blur.
- **Control Edge (`control-border`)** separates the motion control from the landscape.
- **Pale Daylight (`sky-middle`)** and **Low Meadow (`sky-low`)** continue the canvas's vertical sky gradient below the ground color.

**The Quiet Interface Rule.** Keep interface emphasis in pine and mineral tones; the olive, jade, and gold belong to the living landscape.

## Typography

**Display Font / Body Font:** Helvetica Neue, Helvetica, then the platform sans-serif fallbacks recorded above. There is no separate mono or decorative face in this alternative. Font synthesis is disabled.

**Character:** Compact, closely tracked headings balance generous surrounding space. Body text remains lighter, smaller, and more openly led. The sizes are observed fluid clamps and role-specific values, not a mathematical modular scale.

### Hierarchy

- **Display:** The two-line hero thought uses the display token and balanced wrapping. At the mobile breakpoint it becomes `clamp(42px, 10.8vw, 64px)` with a line height of `1.05`.
- **Headline:** The exploration heading uses the headline token, balanced wrapping, and a maximum width of `410px`. On mobile it is `38px` within `300px`.
- **Title:** Destination names use the title token; they become `22px` on mobile.
- **Identity:** The name uses the identity token; mobile reduces it to `16px`. The subordinate role is regular weight with normal tracking, `12px` on desktop and `11px` on mobile.
- **Body:** The introduction uses the body token within `440px`; the hero uses body-hero within `380px`. Mobile reduces both to `15px`, with the hero measure capped at `290px`.
- **Label:** Desktop navigation and the primary action use the label size. Destination descriptions also use this size with a line height of `1.5`.
- **Caption:** Scene supporting copy, the motion control, and footer use the caption size. Mobile scene supporting copy and the footer study line become `11px`; the scene name is medium weight, `14px` on desktop and `13px` on mobile.

**The One Family Rule.** Preserve the explicitly requested restrained sans-serif voice; hierarchy comes from scale, weight, tracking, and space.

## Layout

The route is full width. Navigation, copy, scene controls, exploration, and footer share the fluid gutter token. The desktop navigation is `100px` high. The hero fills `calc(100svh - 100px)`, bounded between `650px` and `920px`. Copy starts at `8%` of the hero height and is capped at `650px`; at widths of at least `1600px`, it moves to `12%`.

Scene controls align along the bottom of the landscape, `24px` from the edge. The exploration area uses two equal columns, an `8vw` gap, and vertical padding of `100px` above and `110px` below. The introduction and link list stay open rather than entering cards. Destination rows have at least `118px` height. The footer uses the same horizontal alignment and a top rule.

At `700px` and below, gutters become `24px`, navigation becomes `88px` high, the redundant Explore navigation link and navigation arrow disappear, and Writing and Connect remain. The hero becomes `740px` high; its copy sits `36px` from the top with `24px` side insets. Scene controls sit `20px` from the bottom, with a `12px` gap and a caption width cap of `230px`. The exploration grid becomes one column with a `40px` gap and `70px`/`76px` vertical padding. The footer wraps its study description onto a full-width last line.

Spacing is role based: small gaps group labels, wider gaps separate controls, and large section intervals leave room around the landscape. Do not turn the recorded hero dimensions into requirements for unrelated surfaces.

## Elevation & Depth

The interface has no box shadows or backdrop blur. Tonal separation, fine rules, and near-opaque caption surfaces establish readable layers. The artwork supplies depth through perspective, ridge height, increasing point radius, and increasing opacity toward the foreground.

**The Landscape Depth Rule.** Keep interface surfaces flat; let the point field supply the depth.

## Shapes

Actions use pill silhouettes; the scene caption uses gently rounded corners. The landscape and exploration area have no enclosing card frame. Destination rows and the footer use single-pixel rules. Line arrows are inline SVGs with round caps and joins, not text glyphs; navigation and motion icons are `16px`, the primary-action arrow is `18px`, and destination arrows are `22px`.

## Components

### Primary action

A quiet, filled pill directs attention without competing with the artwork. It uses the button-primary tokens, a `20px` icon gap, and at least `48px` height. Hover changes its fill over `0.2s`. On mobile, label size becomes `13px` and padding becomes `12px 18px`.

### Motion control

A near-opaque outlined pill sits on the landscape. It has a single-pixel control edge, a `6px` icon gap, at least `44px` height, and at least `92px` width (`76px` on mobile). Hover restores the solid ground fill. Its visible Play/Pause label and SVG state agree with an accessible action label and `aria-pressed`; a pressed state means the animation is paused. If a canvas context cannot be created, the control is omitted.

### Navigation and footer

The identity is a two-line lockup. Navigation is an inline row, not a menu overlay; links have at least `44px` height, and hover adds an underline offset by `5px`. Desktop navigation gaps are `34px`; mobile uses `18px`. The footer repeats the same plain-link treatment and mobile wrapping described in Layout.

### Destination rows

Each destination is a full-row link with a title, short supporting sentence, and trailing arrow. There is no card fill, radius, or shadow. A top rule begins the list; each row ends with a rule. Hover moves only the arrow `5px` to the right over `0.2s`.

### Scene caption

A small rounded mineral surface holds the scene name and one descriptive sentence. It uses the scene-caption tokens and a `5px` internal gap. Mobile padding becomes `10px 12px`, with the supporting sentence capped at `185px` and a line height of `1.5`. This is an artwork caption, not a reusable eyebrow above section titles.

### Living point landscape

The artwork is generated in canvas; there is no raster artwork or reference comp. A vertical sky gradient places the middle stop at `55%`. A gold sun is stippled on a `4px` grid at `52%` opacity. Terrain uses `76` rows and `130` columns; depth increases point radius from `0.48px` to `2.03px` and opacity from `0.42` to `0.96`. A slow sine wave shifts the ridges, and non-touch pointer movement changes its phase.

Rendering is capped at `30fps` and a device-pixel ratio of `1.5`. The animation clock advances by no more than `0.05s` per drawn frame. Pause preserves elapsed phase; offscreen and hidden-tab states suspend animation. Reduced-motion preference starts the scene paused and removes CSS transitions; the user can deliberately press Play. The canvas is decorative and hidden from the accessibility tree, while the surrounding text and links remain ordinary HTML.

### Focus and reduced motion

All route links and buttons receive a `2px` current-color focus outline offset by `6px`. The first keyboard link reveals “Skip to portfolio links” and targets the exploration section. Reduced-motion CSS removes transitions and sets scroll behavior to auto. No additional hover scaling, parallax controls, or motion styles are established by this build.

## Do's and Don'ts

### Do:

- **Do** keep this contract scoped to the Windfield alternative; preserve the existing homepage and blog identities.
- **Do** keep text and controls readable independently of the canvas animation.
- **Do** use the shared gutter, open destination rows, and restrained type hierarchy.
- **Do** preserve visible keyboard focus, minimum control heights, Play/Pause behavior, and reduced-motion support.
- **Do** treat the sidecar's synthesized tonal ramps as inspection aids; the frontmatter records the actual implemented palette.

### Don't:

- **Don't** replace the owner-pinned sans-serif direction with an invented display-font pairing.
- **Don't** turn scene colors into invented status categories or add shadows to this flat interface.
- **Don't** convert the artwork caption into a general eyebrow pattern.
- **Don't** claim catalog boards or a raster comp informed visual verification: the catalog image fetch returned HTTP 403, and this build used the approved code-first path.
- **Don't** treat the review captures as shipping artwork; they document the generated canvas.
