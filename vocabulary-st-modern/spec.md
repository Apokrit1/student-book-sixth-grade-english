# English 6th Grade Modern Portal — Design Specification

## Project Context

**Brand**: English 6th Grade (ΣΤ΄ Δημοτικού) — Digital Coursebook Companion for the Greek Ministry of Education (DEPPS-APS / ITYE Diophantus).

**Audience**: 11–12 year old EFL Primary Learners and their classroom teachers. Reading level CEFR A1 / A1+.

**Mission**: Modernize a 20-year-old coursebook into an interactive learning space — CLIL stories, inductive grammar labs, dual-engine neural audio, printable worksheets, and a 1080p video launch pipeline.

**Mood**: A schoolbook that learned how to smile. Hand-drawn warmth meets confident modern layout. Feels like a friendly notebook that grew up — not a sterile SaaS dashboard.

---

## Visual Direction: Modern Educational Playful

Bright, kid-friendly, hand-drawn illustration feel; bouncy motion; rounded shapes; warm earthy palette (terracotta, sage, mustard, cream). Optimistic without being babyish.

The portal must feel:
- **Bespoke**, not generic — bespoke illustrations, hand-shaped CSS, custom typography
- **Alive** — micro-motion on every interaction, but never distracting
- **Approachable** — a 6th grader must feel invited; a teacher must feel respected

---

## Color Palette (No Blue, No Purple)

| Token | Hex | Role |
|---|---|---|
| `--clay` | `#C8553D` | Primary terracotta — CTAs, links, brand |
| `--clay-soft` | `#E0836E` | Hover state for clay |
| `--sage` | `#7A9471` | Secondary — V2 Ready badge, accents |
| `--sage-deep` | `#4F6A4A` | Pressed states |
| `--cream` | `#FAF3E7` | Page background |
| `--paper` | `#FFFDF8` | Card surface |
| `--ink` | `#2D2A26` | Body text |
| `--charcoal` | `#1B1916` | Display headlines |
| `--mustard` | `#D4A24C` | Featured accent, sparkle highlights |
| `--blush` | `#F4C6B8` | Soft fills, illustration washes |
| `--dust` | `#C8B79C` | Hairline borders, secondary lines |

---

## Typography

- **Display / Headline**: **Fraunces** — variable serif with optical sizing; weight 700–900, opsz 144, wght 800, SOFT 100. Warm, scholarly, slightly chunky. Used at 4rem+ for the hero.
- **Subhead / Section**: **Fraunces** weight 600, italic for editorial flourishes.
- **Body**: **Inter** — clean sans, weight 400/500/600. Optical size, very readable at 16px.
- **Mono / Accent**: **JetBrains Mono** — only for term pills / chapter markers.

**Type scale** (modular ratio 1.333):
- Hero display: clamp(3.2rem, 7vw, 6.8rem)
- H2: clamp(2rem, 4vw, 3.2rem)
- H3: 1.5rem
- Body: 1.0625rem (17px)
- Small: 0.85rem

**Letter-spacing**: tight (-0.02em) on display, normal (0) on body.

---

## Layout & Grid

- **Max content width**: 1280px, generous 32–48px gutters
- **Spacing scale**: 4 / 8 / 12 / 20 / 32 / 48 / 72 / 112 px
- **Section rhythm**: ~120px vertical breathing room on desktop, 64px mobile
- **Hero**: type-led, asymmetric. Headline left ~60%, illustration right ~40% on desktop. Stacks vertically on mobile.
- **Cards**: 12-col grid (auto-fit, min 320px). Cards lift 8px and tilt slightly on hover; inner SVG marks wiggle.

---

## Hero Section — Type-Led with Subtle Motion

- **Massive serif headline** spanning 2 lines: "A 20-year-old coursebook, / *relearned*."
- **Subhead**: One-line thesis in a slightly italic Fraunces.
- **Primary CTA** (terracotta pill): "Launch Unit 1 →" with a hand-drawn arrow SVG.
- **Secondary CTA** (ghost): "See all 10 units ↓".
- **Background**: soft cream → blush radial wash. Floating hand-drawn shapes (asterisk, sparkle, dotted loop) drift with a 14-second cubic-bezier ease.
- **Right side**: full-bleed illustrated card "stack" of coursebook pages with flags peeking out (Unit 1 reference). Slight parallax on scroll.
- **No video.** Subtle motion only (CSS keyframes).

---

## Unit Grid — Filterable + Animated

- **Filter chips** at the top: All · Term 1 · Term 2 · Term 3 · 🟢 v2 Ready · Grammar: Present Simple · Grammar: Past · etc.
- **Animated entrance**: cards stagger in with `IntersectionObserver` + cubic-bezier overshoot (cubic-bezier(0.34, 1.56, 0.64, 1)).
- **Card anatomy**:
  - Unit number in display serif (Fraunces) on a hand-drawn circular badge
  - Title in Fraunces 600
  - Tagline in Inter
  - 3–4 metadata pills (sage for "ready", mustard for "featured")
  - Two-button row: V2 (primary terracotta) + V1 (ghost)
  - A hand-drawn flag / icon top-right per unit
- **Hover**: card lifts 8px, inner illustration tilts 2°, badge wiggles.

---

## Teacher Framework Card

- Cream panel with hand-drawn frame (SVG border-path). Three pillars inside, each with a different illustration mark (asterisk, sparkles, checkmark).
- Softer than unit cards; centered; gives breathing room.

---

## Background & Decoration

- **Floating hand-drawn SVG glyphs** in fixed background: small asterisks, sparkles, dotted loops. They drift slowly with parallax.
- **Cream paper grain** via subtle SVG noise filter (opacity 0.04) on body background.
- **No glassmorphism, no neon glows, no dark mode.**

---

## Motion

- **Easing**: `cubic-bezier(0.34, 1.56, 0.64, 1)` for springy interactions (overshoot).
- **Easing**: `cubic-bezier(0.4, 0.0, 0.2, 1)` for state transitions.
- **Cards**: stagger 60ms each on scroll-in. Duration 700ms.
- **CTA hover**: scale 1.03, shadow shift, 200ms.
- **Background glyphs**: 14s linear infinite rotation + drift.

All motion respects `prefers-reduced-motion: reduce`.

---

## Tech Stack

- HTML5, vanilla CSS (no framework), tiny JS (~80 lines) for filtering + scroll animation.
- Inline critical CSS in `<style>` for performance.
- Fonts: Google Fonts (Fraunces variable + Inter variable).
- No external icon library. All icons are inline SVG (hand-drawn feel).
- Responsive mobile-first; breakpoints 640 / 1024 / 1280.

---

## Asset Plan

- `imgs/hero_illustration.png` — hand-drawn style classroom with flags (warm tones, no blue/purple)
- `imgs/unit1_featured.png` — multicultural kids illustration for featured Unit 1 card
- `imgs/teacher_illus.png` — teacher at chalkboard (warm chalk on sage)
- All decorative marks are inline SVG.

---

## What This Preview Includes

1. Hero section (new type-led design)
2. Featured Unit 1 card with generated illustration
3. Three sample additional unit cards with SVG marks
4. Filter chip row (interactive — works in preview)
5. Teacher framework card (cream panel)

It does **not** include: full 10-unit grid rendering, video pipeline section, footer rebuild, mobile deep polish. Those are scope of the full build pending user approval.