# English 6th Grade — The Modernized Coursebook · Design Spec (rev 4)

## Bio-Warm 2026 retheme

This rev replaces the previous earth-tone palette with the **Bio-Warm 2026** color system, the dominant typology of contemporary edtech (Duolingo 2025, Brilliant, Khanmigo). It also swaps the editorial serif headlines for a chunky modern display sans.

**Why this works for a 6th-grade coursebook:**
- The chartreuse → gold → coral arc reads as **energy + growth + warmth** — perfect for a school context without being childish.
- Single saturated hero color (coral) plus a dynamic gradient keeps CTAs and primary actions instantly recognizable — same pattern as Duolingo's feather green.
- Chunky modern sans headlines (Bricolage Grotesque) feel confident and contemporary; the body stays Inter for legibility.
- No "earth tone" reads, no brown / ochre / yellow-monoculture.

---

## Project Context (unchanged)

**The site is the coursebook.** It replaces the printed textbook. Every lesson, every unit, every reading, every listening, every grammar target.

**The Companion is the vocabulary layer.** Vocabulary + activities on vocabulary. The **only place Greek lexical items are allowed and practiced**.

---

## The Bio-Warm 2026 Color System

| Token | Hex | Role |
|---|---|---|
| `--lime` | `#B6E528` | Energy · secondary CTA · "active" filter · accent on hover |
| `--lime-deep` | `#8FB81E` | Pressed lime |
| `--lime-tint` | `#EEF9C9` | Soft fills, success banners |
| `--gold` | `#FFC800` | Highlight · progress · "warm" emphasis |
| `--gold-deep` | `#D9A800` | Pressed gold |
| `--coral` | `#FF6B47` | **Hero color** · primary CTA · active state |
| `--coral-deep` | `#E84F2E` | Pressed coral · shadow underneath coral buttons |
| `--coral-tint` | `#FFE2D7` | Soft fills |
| `--hot-pink` | `#FF5C99` | Secondary accent · streak / celebration |
| `--sky` | `#3DA9FC` | Cool contrast accent · links · hints |
| `--snow` | `#FFFFFF` | Card surface |
| `--cream` | `#FFF8E8` | Page background (warm off-white) |
| `--ink` | `#0F172A` | Display text (near-black, slight cool tint) |
| `--ink-soft` | `#475569` | Body text |
| `--ink-muted` | `#94A3B8` | Captions, helper text |
| `--border` | `#E2E8F0` | 2–3px chunky borders |
| `--shadow-coral` | `rgba(232, 79, 46, 0.35)` | Chunky button shadow underneath coral |

**The "bio-warm arc"** — chartreuse → gold → coral — is the signature gradient. It can flow through:
- The hero underline (animated, drawing from left to right on load)
- Active filter chips
- Hover glows on cards
- Streak / progress accents
- The featured Unit 1 illustration overlay

**Card borders:** 2–3px solid (not hairlines). The Duolingo pattern — thick borders read as confident and tactile.

**Buttons:** 4px chunky bottom shadow in `--coral-deep`. The "tactile press" affordance.

---

## Typography (revised)

- **Display headlines**: **Bricolage Grotesque** — variable width + weight, free on Google Fonts. Chunky, modern, slightly humanist. Set at 64–96px, weight 700–800, width 100, slight negative letter-spacing.
- **Section titles**: **Bricolage Grotesque** weight 700, width 100, 36–56px
- **Body**: **Inter** — clean sans, weight 400/500/600, 17px base, line-height 1.6
- **Greek text in the Companion**: **Bricolage Grotesque Italic** — same family as English, italicized to read as the second language
- **Mono / labels**: **JetBrains Mono** — for unit numbers, page references, term pills

---

## Visual treatment changes from rev 3

- Page background: warm off-white `#FFF8E8` (was cream)
- Cards: pure white `#FFFFFF` with **2.5px solid coral borders** (was 2px dashed dust)
- Buttons: coral fill with **4px chunky shadow** in `--coral-deep` (the Duolingo "tactile press")
- Hero underline: **animated gradient** chartreuse → gold → coral (was single mustard squiggle)
- Filter chips: gradient active state (was solid coral)
- Vocabulary tables: each row has a **left-edge gradient strip** (lime → gold → coral) instead of dashed border
- Background glyphs: chunky asterisks, sparkles, dotted loops in lime, gold, coral (no more brown/ochre)
- Paper grain: very subtle, almost invisible
- Dashed lines: replaced with **solid chunky borders** throughout

---

## Hero (revised)

- **Brand strip**: `Photodentro · English 6th Grade` + sub-brand `THE COURSEBOOK · modernized` (Bricolage Grotesque, weight 700)
- **Headline** (2 lines):
  - "The coursebook."
  - "**Modernized.**" (coral italic, with animated gradient underline)
- **Subhead**: same as rev 3, but in Inter at 1.2rem
- **CTAs**:
  - Primary (coral with 4px shadow): "Open the coursebook →"
  - Ghost (2.5px solid border): "What's the Companion?"
- **Right side**: open book art — left page is coursebook lesson (white card with chunky border + lesson pieces), right page is Companion vocabulary (white card with chunky coral border + vocab rows). Background of the art is a soft warm cream with a floating lime/coral/gold gradient.

---

## The Two Things explainer (revised)

Same content as rev 3, but:
- Coursebook card: white surface, chunky ink border
- Companion card: white surface, chunky coral border
- "v1 · the site" tag uses JetBrains Mono on lime-tint
- "v2 · vocabulary only" tag uses JetBrains Mono on coral
- Closing line: italic Bricolage Grotesque in coral

---

## Unit cards (revised split layout)

- **v1 side (Coursebook)**: white background, 2.5px ink border, mono labels
- **v2 side (Companion)**: white background, 2.5px coral border
- **Fold**: replaced with a 4px-wide vertical gradient bar (lime → gold → coral)
- **Vocabulary table**: each row has a 4px-wide left gradient strip; rows use a cream tint background instead of dashed borders

---

## Motion

- Bouncy spring easing on all hover lifts
- Hero underline: draws from left to right on load (1.2s, ease-out)
- Background glyphs: 12–20s drift
- Hover on card: card lifts 6px, border color shifts from ink to coral, lime glow shadow

---

## Iteration history

- **rev 1**: "Modern Educational Playful" style chosen. Generic 10-unit coursebook grid.
- **rev 2**: User clarified v1/v2 duality — v1 = legacy coursebook, v2 = vocabulary companion.
- **rev 3**: User clarified the site **is** the modernized coursebook. Companion = vocabulary layer where Greek is allowed.
- **rev 4 (current)**: User asked for a **bold modern** palette. Picked **Bio-Warm 2026** (chartreuse → gold → coral) + **Bricolage Grotesque** for modern display sans headlines.