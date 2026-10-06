# English 6th Grade — The Modernized Coursebook · Design Spec (rev 3)

## Project Context

**English 6th Grade (ΣΤ΄ Δημοτικού)** — official curriculum of the Greek Ministry of Education (DEPPS-APS / ITYE Diophantus).

**The site is the coursebook.** It is not a reference to a PDF. The site itself replaces the printed textbook and teaches the entire syllabus — every lesson, every reading, every listening task, every grammar target, every cultural and cross-curricular thread.

**The Companion is the vocabulary layer.** A focused, vocabulary-only module that lives next to each unit. It is the **only place where Greek lexical items are allowed and practiced**. The rest of the coursebook is fully in English, by design. The Companion is the bridge that lets a Greek-speaking learner map new English words onto the Greek they already know.

---

## Two things, one site

| | What it is | Where it lives |
|---|---|---|
| **The Coursebook** | The whole year of English 6, fully online. Every unit, every lesson. Grammar, reading, listening, culture, cross-curricular links, worksheets. 100% in English. | This site. Every page is a lesson. |
| **The Companion** | A vocabulary-only layer attached to each unit. The **only** place Greek lexical items appear and are practiced. Vocabulary + activities on vocabulary. Greek translations, Greek-friendly prompts, lexical-pairing drills. | `unit*/index.html` (vocab lab per unit) |

**Brand promise:** *The Coursebook teaches English in English. The Companion is the one place Greek belongs.*

---

## Concept: One Modernized Coursebook, with a Vocabulary Companion

The page positions the site as the **modernized coursebook itself** — not a complement to a printed book, but the coursebook. Every unit card shows a real lesson the student will do in the browser.

The Companion is presented as a focused, clearly-bounded feature: a vocabulary companion. It is *not* a replacement for anything; it is the bridge between Greek (what they know) and English (what they're learning). Greek appears nowhere else.

This shift changes everything:

- The site no longer references PDFs. The coursebook lives here.
- Vocabulary work is presented as a *Greek-English bridge*, with the Greek explicitly visible.
- The Companion feels like a focused sub-product, with its own scope and identity.

---

## Visual Direction: Modern Educational Playful

Bright, hand-drawn illustration feel; bouncy motion; rounded shapes; warm earthy palette.

Two-tone visual identity reinforces the duality:

- **Coursebook** = cream/paper/warm-ink, dashed lines, "official" feel — feels like a textbook that's been modernized
- **Companion** = paper-white/terracotta, sage accents, hand-drawn sparkles — feels like a vocabulary notebook with a friendly Greek-English translator

Greek text uses a clean serif (Fraunces italic) inside the Companion — the Greek letters feel like a respected old friend, not an intrusion.

---

## Color Palette (No Blue, No Purple)

| Token | Hex | Role |
|---|---|---|
| `--clay` | `#C8553D` | Companion primary — CTAs, "v2" tags, vocabulary cards |
| `--clay-soft` | `#E0836E` | Hover state |
| `--sage` | `#7A9471` | Secondary accent |
| `--sage-deep` | `#4F6A4A` | Pressed states |
| `--paper` | `#FFFDF8` | Companion / vocabulary card surface |
| `--paper-cream` | `#F6EFDF` | Coursebook lesson surface (cream + ruled lines) |
| `--cream` | `#FAF3E7` | Page background |
| `--ink` | `#2D2A26` | Body text |
| `--charcoal` | `#1B1916` | Display headlines |
| `--mustard` | `#D4A24C` | Companion "Greek allowed" highlight |
| `--blush` | `#F4C6B8` | Soft fills |
| `--dust` | `#C8B79C` | Hairlines, ruled lines |

---

## Typography

- **Display**: **Fraunces** variable serif, weight 700–900, opsz 144, SOFT 100
- **Body**: **Inter** — clean sans, weight 400/500/600
- **Greek text in the Companion**: **Fraunces Italic** — same family as English, just italicized to read as "the other language"
- **Mono / labels**: **JetBrains Mono** — for unit numbers, page refs, term pills

---

## Hero Section — Type-led with subtle motion

- **Brand strip**: `Photodentro · English 6th Grade` + sub-brand `THE COURSEBOOK` (no longer "The Companion" as the headline product)
- **Headline** (3 lines):
  - "The coursebook."
  - "**Modernized.**" (clay italic, with mustard squiggle underline)
- **Subhead**: *Every lesson from the official 2006 syllabus, now taught in the browser — and a Companion where Greek vocabulary belongs.*
- **CTAs**:
  - Primary (clay): "Open the coursebook →"
  - Ghost: "What's the Companion?"
- **Right side**: A visual of an open book — left page shows a coursebook lesson header (warm cream, ruled lines, "Unit 01 · pp. 4–15"); right page shows the Companion's vocabulary list with Greek + English pairs (paper white, sage accents, small sparkles).
- **Background**: cream → blush radial wash with drifting asterisks, sparkles, dotted loops.

---

## "The Two Things" Explainer Card

A short section directly under the hero that makes the concept explicit:

> **The Coursebook** is the full English 6th Grade syllabus — every lesson, every unit, every reading, every grammar target, every listening task, every worksheet. It is taught in English. Always.
>
> **The Companion** is the vocabulary layer for each unit. Vocabulary items, vocabulary activities, and the **only** place Greek lexical items are allowed. This is where you connect new English words to the Greek you already speak.
>
> No Greek anywhere else. The Companion is the bridge.

Visual: two stacked paper-notebook blocks side by side:
- **Left** (cream, ruled, mono labels): The Coursebook — list of lesson components
- **Right** (paper, clay border): The Companion — sample vocabulary list with Greek/English pairs

A `+` symbol joins them. Closing line in italic Fraunces: *"Two tools. One syllabus. Greek belongs in the Companion."*

---

## Unit Grid — Split Cards (the centerpiece)

Each unit card is split into two halves separated by a dashed fold-mark.

### Left half — **The Coursebook**
- Cream/paper background, ruled notebook lines, dashed red margin
- Unit number in mono (`UNIT 01`)
- Lesson title
- Page reference (`pp. 4–15`)
- 3–4 lesson components (Grammar · Reading · Listening · Culture · CLIL)
- Primary CTA: "Open this lesson →" → `unit*/v2.html`

### Right half — **The Companion**
- Paper-white background, clay border
- "THE COMPANION" badge
- 4–6 sample vocabulary pairs (English + Greek, in a clean two-column layout)
- A subtle "Ελληνικά επιτρέπονται εδώ" hint (Greek allowed here)
- Secondary CTA: "Open Companion →" → `unit*/index.html`

On hover: the Companion half lifts 6px; the Coursebook half stays planted.

**Vocabulary pair treatment** (this is the visual heart of the new concept):

```
┌─────────────────────────────┐
│  country          χώρα      │
│  classmate      συμμαθητής   │
│  greeting    χαιρετισμός    │
│  introduce       συστήνω     │
└─────────────────────────────┘
```

English on the left in Fraunces 600 (Inter actually, for the table). Greek on the right in **Fraunces italic** — same typeface, just italicized. The Greek is positioned as the equal partner to the English, not as a translation footnote.

---

## Teacher Section

Same cream-pillared structure. Adds:

> *Greek lexical items only appear in the Companion. The Coursebook is 100% in English. This separation matters for immersion and for assessment.*

---

## Background & Decoration

- Cream paper grain (SVG noise, 4.5% opacity)
- Floating hand-drawn glyphs (asterisks, sparkles, dotted loops) drift with parallax
- Coursebook side of unit cards: ruled notebook lines
- Companion side of unit cards: subtle blush radial wash in top-right

---

## Motion

- Springy overshoot easing on Companion card lifts (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Standard state-transition easing (`cubic-bezier(0.4, 0.0, 0.2, 1)`)
- Background glyphs: 14–22s linear infinite drift
- Vocabulary pairs stagger in on hover

All motion respects `prefers-reduced-motion: reduce`.

---

## Tech Stack

- HTML5, vanilla CSS, minimal JS
- Google Fonts: Fraunces variable + Inter variable + JetBrains Mono
- Inline critical CSS, all SVG inline

---

## Asset Plan

- `imgs/hero_illustration.jpg` — six 6th graders with flags (warm tones)
- `imgs/unit1_featured.jpg` — three kids with flags
- `imgs/teacher_illus.jpg` — teacher at chalkboard

(Generated already; kept in palette.)

---

## What This Preview Includes

1. Brand strip + "The Coursebook" identity
2. Hero with corrected positioning (the site IS the coursebook)
3. "The Two Things" explainer with sample Greek-English vocabulary pairs
4. Featured Unit 1 split card with real Greek vocabulary pairs
5. Three compact sample units with split cards + vocabulary pairs
6. Filter chip row
7. Teacher pillars card
8. Footer

Not in preview (reserved for full build): all 10 unit cards rendered, full vocabulary lists per unit, mobile deep polish, real coursebook catalog data wiring, accessibility audit.

---

## Iteration history

- **rev 1**: "Modern Educational Playful" style chosen. Generic 10-unit coursebook grid.
- **rev 2**: User clarified v1/v2 duality — v1 = legacy coursebook, v2 = vocabulary companion. Reframed as "The Companion sits beside the printed book."
- **rev 3 (current)**: User corrected that the site **is** the modernized coursebook itself, not a complement to a printed book. The Companion is the vocabulary layer where Greek is allowed. PDFs are out of the picture. The site teaches the whole syllabus.