# Implementation Plan: Version 2 (v2) Modernized Educational Platform & Multi-Unit Hub

Reframing and modernizing the 20-year-old 6th Grade Primary School English Coursebook (*"English 6th Grade" — Unit 1: Our Multicultural Class*) into a state-of-the-art A2/A2+ digital companion, with dedicated printable worksheets for every activity, additional voice/visual generation, and an extensible multi-unit architecture for the entire 10-chapter curriculum.

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions for Approval:**
> 1. **Extensible Coursebook Portal (Homepage Hub):** A top-level portal (`portal.html` / `hub`) linking to the 10 units of the 6th Grade coursebook, with Unit 1 featured as the flagship, fully realized v2 implementation.
> 2. **Coexistence of v1 and v2:** Version 1 (`index.html` — quick vocabulary companion & audio lab) remains completely functional and untouched. Version 2 (`v2.html` — modernized interactive CLIL experience) operates alongside it, sharing all existing 280 MP3s and 35 SVGs while generating additional contextual media.
> 3. **Printable Worksheets for Every Activity:** In addition to interactive web activities, every module will feature a dedicated, high-contrast, classroom-ready printable worksheet (A4/Letter) for physical student portfolios.
> 4. **Modernization of 2006 Context:** Replacing obsolete references with contemporary, culturally respectful contexts (e.g., modern digital literacy, contemporary geography, dynamic intercultural dialogues) while maintaining strict alignment with the official curriculum's grammar, functions, and exam requirements.

---

## Pedagogical Foundation & Modern A2 Coursebook Inspiration

Modern CEFR A2/A2+ young learner platforms (*Cambridge Think, National Geographic Our World, Oxford Solutions, Express Digibooks*) move away from flat vocabulary lists toward **blended, task-based contextualization**:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    MODERN A2 PEDAGOGICAL PILLARS (v2)                           │
├──────────────────────────┬──────────────────────────┬───────────────────────────┤
│ 🌍 CONTEXTUAL CLIL       │ 🧪 INDUCTIVE GRAMMAR     │ 📝 DUAL-MODE OUTPUT       │
│ Geography, Culture, &    │ Grammar in action        │ Interactive digital task  │
│ Real-World Empathy       │ (Habits vs. Right Now)   │ + Printable physical sheet│
├──────────────────────────┼──────────────────────────┼───────────────────────────┤
│ 🧩 LEXICAL CHUNKS        │ ✍️ GENRE WRITING         │ 🎖️ LEARNER AUTONOMY      │
│ Collocations & Word      │ Guided 5-paragraph       │ "Can-Do" CEFR descriptors │
│ Partnerships             │ report building          │ & progress tracking       │
└──────────────────────────┴──────────────────────────┴───────────────────────────┘
```

---

## Proposed Changes & Module Architecture

### 1. Extensible Coursebook Hub (`portal.html` & shared assets)
- **Goal:** Provide a modern landing homepage for the entire 10-unit curriculum, allowing seamless navigation to Unit 1 (v1 & v2) and laying the structural groundwork for Units 2–10 (*Going shopping, Imaginary creatures, History of aeroplane, Travelling through time, Future jobs, Sports, Music & money, Earth Day, Time for fun*).
- **Files:**
  - `portal.html`: Coursebook overview, unit roadmap, CEFR A2 learning standards.
  - `data/coursebook_catalog.json`: Metadata, learning targets, grammar syllabus, and asset links for all 10 units.

---

### 2. Version 2 Main Interface (`v2.html`, `app_v2.js`, `style_v2.css`)

#### Module 1: The Newcomers' Story Dossiers (Intercultural CLIL Lab)
- **Concept:** Replaces flat vocabulary with rich, modern story profiles for **Sasha (Ukraine)**, **Christina (Albania)**, **Georgi (Georgia)**, and **Gwen (UK)**.
- **Modernization:** Highlights modern European multicultural life, contemporary geography, and cultural contributions.
- **Interactive Features:**
  - Story audio narrator (dual Sonia Neural AI voice + text highlight).
  - Interactive map pins linking directly to landforms, rivers, mountains, and capital cities.
- **Printable Worksheet 1:** *Country Dossier Reading & Comprehension Sheet* (Text, map reading task, True/False geography quiz, and personal reflection).

#### Module 2: The Grammar Lab ("Habits & Routines vs. Right Now")
- **Concept:** Implements the core grammar syllabus of Unit 1: **Present Simple with Adverbs of Frequency** (*always, usually, often, sometimes, rarely, never*) vs. **Present Continuous** (*actions happening right now in the school lab*).
- **Interactive Activities:**
  - *"At the Modern School Lab":* Interactive STEM lab scene (coding, 3D printing, web research) contrasting what pupils *do every day* with what they *are doing now*.
  - *"Mr. Badluck’s Day" Interactive Comic:* Drag-and-drop verb conjugation contrasting routine vs. present disaster.
  - *Frequency Adverb Spectrum:* Dragging sentences onto an interactive 0%–100% dial.
- **Printable Worksheet 2:** *Grammar in Action: Routines vs. Present Continuous Worksheet* (Verb conjugation drills, frequency adverb ordering, and "My Typical Day vs. Today" creative writing).

#### Module 3: Collocation & Geography Crossword Quest
- **Concept:** Focuses on lexical partnerships rather than isolated single words.
- **Interactive Activities:**
  - *Collocation Matcher:* Drag-and-connect cards (*share* $\leftrightarrow$ *borders*, *temperature drops* $\leftrightarrow$ *below zero*, *grow* $\leftrightarrow$ *citrus fruit*, *split in* $\leftrightarrow$ *two parts*).
  - *Interactive Crossword Puzzle:* Digital reproduction of Lesson 3's crossword (p. 11) with instant audio hints.
- **Printable Worksheet 3:** *Vocabulary & Collocations Challenge Sheet* (Crossword puzzle, collocation matching columns, and word-partnership gap-fills).

#### Module 4: The 5-Paragraph Country Report Builder
- **Concept:** Guided writing workshop teaching structured genre writing (Intro/Borders $\rightarrow$ Landscape $\rightarrow$ Weather $\rightarrow$ People/Culture $\rightarrow$ Opinion).
- **Interactive Activities:**
  - Step-by-step interactive sentence builder with conjunction joining (*and, but, so*).
  - Choice to write about Greece (curriculum project) or choose another European country.
- **Printable Worksheet 4:** *My European Project: Country Report Portfolio Sheet* (Pre-formatted writing template with guided paragraph prompts, student self-check rubric, and photo/drawing box).

#### Module 5: Contextual Audio Challenge Suite
- **Concept:** Expanding beyond v1's 2 quizzes into a full 4-mode gamified ear-training suite:
  1. *Spoken Word $\rightarrow$ Greek Meaning*
  2. *Spoken Word $\rightarrow$ English Definition*
  3. *Contextual Sentence Gap-Fill:* Listen to authentic sentence with word missing $\rightarrow$ select correct lexical item.
  4. *Geography Fact-Buster (True/False):* Fast-paced fact verification from the unit texts.
- **Printable Worksheet 5:** *Unit 1 Comprehensive Listening & Vocabulary Quiz Sheet* (Classroom test format with teacher scoring key).

#### Module 6: Learner Autonomy & "Can-Do" Passport
- **Concept:** Digital implementation of the unit's *10-λογος για την αυτονόμηση του μαθητή* and CEFR self-assessment checklist.
- **Interactive Feature:** Visual badge unlocker rewarding learners as they master each unit module.
- **Printable Output:** *Unit 1 Junior Linguist & Geographer Achievement Certificate*.

---

### 3. Additional Asset Generation Plan

| Asset Type | Target Situation / Context | Generation Tool | Output Location |
| :--- | :--- | :--- | :--- |
| **Audio (Speech)** | Sasha, Christina, Georgi, and Gwen complete story narrations | `node-edge-tts` (Sonia Neural AI) | `assets/audio_v2/stories/` |
| **Audio (Speech)** | Computer Lab dialogs and Mr. Badluck story prompts | `node-edge-tts` (Guy / Sonia Neural) | `assets/audio_v2/grammar/` |
| **Visuals (SVG/Image)** | Modern School Lab scene, Mr. Badluck comic panels, Newcomer badges | Node SVG generator & vector design | `assets/images_v2/` |
| **Data Schema** | Extended Unit 1 metadata (stories, collocations, grammar pairs) | JSON script | `data/unit1_v2_data.json` |

---

## Verification & Testing Plan

### Automated Tests
- Create `test_v2.js` to verify:
  - All core endpoints (`portal.html`, `v2.html`, `style_v2.css`, `app_v2.js`).
  - All generated v2 audio MP3 files load with status 200 and valid MIME types.
  - All SVG visual assets render without parse errors.
  - JSON schemas for `coursebook_catalog.json` and `unit1_v2_data.json` validate strictly.

### Manual & Pedagogical Verification
- Test all 5 printable worksheets via browser print preview (`Ctrl+P`) ensuring:
  - High-contrast black & white ink-friendly design.
  - Clean margins fitting single/double A4 pages without awkward page break cuts (`break-inside: avoid`).
  - Student name, class, and date fields on every sheet.
- Validate cross-navigation between `index.html` (v1), `v2.html` (v2), and `portal.html` (hub).
- Verify interactive activities across mobile, tablet, and desktop viewports.
