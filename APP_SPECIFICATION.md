# Comprehensive Functional & Architectural Specification: English 6th Grade Unified Digital Coursebook & Companion Platform

**Target Curriculum**: Greek Ministry of Education & Religious Affairs (*ΥΠΑΙΘΑ*) / ITYE "Diophantus" (*Αγγλικά ΣΤ΄ Δημοτικού*)  
**CEFR Target Level**: CEFR A1 / A1+  
**Target Learners**: 11–12 year-old primary school EFL students, classroom teachers, and home tutors  
**Platform Architecture**: Zero-backend, 100% offline-capable, GDPR-compliant client-side web application  
**Primary Source Materials**:
- Student's Book (*Βιβλίο Μαθητή*, 10 Units)
- Activity Book / Workbook (*Τετράδιο Εργασιών*, Units 1–10 + Revisions)
- Teacher's Book (*Βιβλίο Εκπαιδευτικού*, Lesson Plans, Scripts & Complete Keys)
- Coursebook Audio CD & Studio Neural Audio Assets

---

## 1. Executive Vision & Foundational Mandates

### 1.1 The Dual-Role Mandate
The application is engineered to simultaneously fulfill two distinct, non-conflicting operational roles:
1. **Total Printed Book Replacement**: A student or classroom teacher can conduct 100% of their curriculum work without opening the printed *Student's Book* (*Βιβλίο Μαθητή*), the printed *Workbook* (*Τετράδιο Εργασιών*), or using a separate CD player for audio tracks. All texts, readings, dialogues, songs, poems, grammar charts, and exercises are fully digitized into interactive, auto-checking, state-persistent software components.
2. **Augmented Digital Companion**: The application goes far beyond a passive PDF reader by providing an inductive grammar sandbox, dual-engine voice pronunciation, scientifically calibrated distractor quiz applets, vocabulary discovery dossiers, visual glossaries, and writing scaffolds that cannot exist in print.

```
       ┌────────────────────────────────────────────────────────┐
       │     Unified 6th Grade English Digital Platform         │
       └───────────────────────────┬────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌─────────────────────────────────┐       ┌──────────────────────────────────┐
│   TOTAL COURSEBOOK REPLACEMENT  │       │    AUGMENTED DIGITAL COMPANION   │
├─────────────────────────────────┤       ├──────────────────────────────────┤
│ • Complete Student's Book texts │       │ • Dual-engine audio (TTS/Neural) │
│ • Complete Workbook exercises   │       │ • Inductive Grammar Laboratory   │
│ • Integrated listening tracks   │       │ • Interactive Story Dossiers     │
│ • In-situ digital notebook      │       │ • Calibrated Distractor Quizzes  │
│ • Teacher's answer key reveals  │       │ • Scaffolding & Writing Studio   │
└─────────────────────────────────┘       └──────────────────────────────────┘
```

### 1.2 Core Architectural Non-Negotiables
* **100% Offline-First & GDPR Compliance**: The application must run entirely from local files (`file:///` protocol) or static hosting without runtime calls to external CDNs, tracking pixels, telemetry endpoints, or third-party web fonts. All typography (WOFF2) and media must reside within the local application bundle.
* **Dual-Format Data Twins (`.json` + `.js`)**: Because modern browsers enforce strict CORS policies preventing `fetch()` requests on local `file:///` URLs, every structured dataset exists in twin formats: a standard JSON file for programmatic validation/tooling and a JavaScript file that binds to `window.*` for runtime execution.
* **Device Independence & Input Agnosticism**: All interactive components must operate equally well via mouse, touch gesture, keyboard navigation, or stylus/smartboard pointer.
* **Zero JavaScript Errors**: Strict zero-tolerance policy for runtime console exceptions, unhandled promises, or orphaned references.

---

## 2. Information Architecture & Content Decomposition

The application decomposes the Greek 6th Grade curriculum into a hierarchical, modular data graph:

```
Coursebook (English 6th Grade — ΣΤ΄ Δημοτικού)
└── Unit (Units 1 to 10)
    ├── Thematic Anchor & Syllabus Mapping
    │   ├── Unit Tagline & Cross-Curricular Connections
    │   ├── CEFR Communicative Competency Goals
    │   └── Grammatical Structures in Focus
    ├── Student's Book Modules (Lessons 1, 2, 3)
    │   ├── Lead-in / Warm-up Inquiry
    │   ├── Core Readings & Listening Dialogues (Verbatim)
    │   ├── In-Text Reading Comprehension Tasks
    │   ├── Grammar Spotlight & Structural Rules
    │   └── Songs, Rhymes, Literature & Cultural Insights
    ├── Workbook Modules (Lessons 1, 2, 3 + Revision)
    │   ├── Section A: Lexical Exploration Worksheets
    │   ├── Section B: Structural & Grammar Worksheets
    │   ├── Section C: Integrated Skills & Guided Writing
    │   └── Self-Assessment Can-Do Descriptors
    └── Augmented Digital Companion Layer
        ├── Full Lexical Database (Headwords, IPA, Greek, CEFR)
        ├── Interactive Storyboards & Landmark Vector Hotspots
        ├── Inductive Grammar Laboratory & Syntax Builder
        └── Spaced Gamified Quiz Engine with Calibrated Distractors
```

---

## 3. Core Functional Capabilities: Complete Book Replacement

### 3.1 Adaptive Dual-Pane Reading & Workstation Engine
To replicate and surpass the physical classroom experience of having the *Student's Book* open side-by-side with the *Workbook*:

* **Synchronized Split-Screen (Tablet, Laptop & Desktop)**:
  * **Left Pane (The Reader)**: Displays verbatim coursebook readings, comic strips, or dialogues with typographic hierarchy and embedded media triggers.
  * **Right Pane (The Workstation)**: Displays corresponding comprehension questions, vocabulary gap-fills, or grammatical drills.
  * **Interactive Cross-Referencing**: Clicking a highlighted vocabulary word or sentence in the reader highlights the relevant exercise item in the workstation, and vice versa.
* **Single-Stream Responsive Fold (Mobile)**:
  * Automatically transitions to a stacked view with a persistent bottom navigation bar or floating toggle switch ("Read" vs. "Exercises") that remembers exact scroll position and draft state.
* **Interactive Media Sync (Karaoke / Read-Along Mode)**:
  * For every dialogue, story, and listening passage, the app can highlight sentences or speaker turns in real time as the corresponding audio plays.
  * Clicking any line jumps playback directly to that timestamp.
  * Playback controls support three calibrated speeds: Scaffolded (0.8x), Standard (1.0x), and Fluent Challenge (1.2x).

### 3.2 Polymorphic Interactive Exercise Engine
The app must automatically evaluate, scaffold, and preserve answers for all exercises found in both books. The engine supports the following interactive task typologies:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Polymorphic Exercise Archetypes                      │
├────────────────────────────┬───────────────────────────────────────────┤
│ Type                       │ Behavioral Mechanics                      │
├────────────────────────────┼───────────────────────────────────────────┤
│ 1. Inline Cloze / Gap-Fill │ Typed text or drop-down selection;        │
│                            │ case-insensitive; trims whitespace;       │
│                            │ accepts valid grammatical alternates.    │
├────────────────────────────┼───────────────────────────────────────────┤
│ 2. Word-Bank Drag & Drop   │ Interactive chip rack; chips snap into    │
│                            │ empty slots; tap-to-place on touch;       │
│                            │ returned chips return to the pool.        │
├────────────────────────────┼───────────────────────────────────────────┤
│ 3. Two-Column Matching     │ Click/tap left item then right item to    │
│                            │ draw SVG connecting vectors; supports     │
│                            │ 1-to-1 and 1-to-many associations.        │
├────────────────────────────┼───────────────────────────────────────────┤
│ 4. Matrix Categorization   │ Multi-column sort bins (e.g., Film vs.    │
│                            │ Book vs. Both); drag or select-destination│
│                            │ placement.                                │
├────────────────────────────┼───────────────────────────────────────────┤
│ 5. Scrambled Syntax        │ Interactive reordering of jumbled words   │
│                            │ to build grammatically valid sentences.   │
├────────────────────────────┼───────────────────────────────────────────┤
│ 6. Dialogue Turn Ordering  │ Drag-and-drop conversational blocks into  │
│                            │ chronological sequence with audio check.  │
├────────────────────────────┼───────────────────────────────────────────┤
│ 7. Multiple Choice / T-F   │ Single-select or multi-select with        │
│                            │ mandatory textual evidence justification.  │
├────────────────────────────┼───────────────────────────────────────────┤
│ 8. Open Guided Writing     │ Rich input area with dynamic checklist,   │
│                            │ word-count milestones, and model overlay. │
└────────────────────────────┴───────────────────────────────────────────┘
```

#### Exercise Feedback & Evaluation Mechanics:
* **Immediate Verification Mode**: Student clicks "Check Answers"; correct answers lock in green, incorrect answers trigger a subtle shake animation and highlight in amber, inviting a retry.
* **Smart Hint Cascade**:
  * *Hint 1*: Highlighting the paragraph or clue in the reading passage where the answer is found.
  * *Hint 2*: Revealing the first letter of the target word or eliminating one distractor.
  * *Hint 3*: Full explanation / Teacher's Book rationale.
* **Persistent Attempt History**: The app tracks first-attempt accuracy separately from final accuracy, enabling true formative assessment.

### 3.3 Integrated Audio & Listening Laboratory
No physical CD or external media player is required:
* Every exercise requiring audio features a native, accessible player docked directly into the exercise frame.
* **Dual Audio Tracks**: Authentic CD recordings and studio-grade neural narrations are both available.
* **Transcript Reveal**: In student mode, transcripts are locked until the activity is submitted. In teacher mode, transcripts can be toggled on demand with vocabulary glosses highlighted.
* **Section Looping & Repetition**: Allows the student to loop a 5-second segment of a listening test up to 3 times to train auditory processing.

### 3.4 Personal Student Marginalia & Annotation Layer
To replicate the tactile utility of a printed workbook:
* **Highlighter Tool**: Allows selecting text within any reading passage to apply color-coded highlights (Yellow = Vocabulary, Blue = Grammar Pattern, Green = Fact/Key Point).
* **Margin Sticky Notes**: Students can pin personal notes or Greek translations to any paragraph or exercise.
* **State Persistence**: Highlights, notes, and completed answers are immediately written to browser storage (`IndexedDB` / `localStorage`) and survive browser restarts.

---

## 4. Core Functional Capabilities: Augmented Digital Companion

### 4.1 The Comprehensive Lexical Laboratory
For every unit (40–55 official headwords per unit, matching Appendix V):
* **Bilingual Lexical Anatomy**:
  * Headword + Part of Speech + Complete IPA phonetic transcription.
  * Context-specific Greek translation curated specifically for 6th-grade learners.
  * English Definition strictly restricted to CEFR A1/A1+ defining vocabulary (max 18 words, zero circular definitions, zero target word leaks).
  * Contextual Example Sentence demonstrating authentic grammatical usage.
* **Dual-Engine Audio Reproduction**:
  * Two distinct voice outputs for every headword, definition, and example sentence:
    1. *Classic Voice* (Standard clear articulation).
    2. *Neural Voice* (High-fidelity British English accent via Microsoft Edge Neural synthesis).
  * Composite chained playback: Plays `Word -> [350ms pause] -> Definition -> [350ms pause] -> Example Sentence`.
* **Collocation & Morphology Explorer**:
  * Demonstrates word families (e.g., *direct -> director -> direction -> directly*).
  * Highlights high-frequency collocations (*hit the shelves*, *sold out*, *breaking news*).

### 4.2 Interactive Story Dossiers & Visual Landmark Hotspots
* **Narrative Immersion**: Reading texts are restructured into interactive chapters accompanied by vector artwork.
* **100% Lexical Ownership**: Every vocabulary item in the unit is explicitly partitioned among the unit's stories. No word is left an orphan without contextual grounding.
* **Landmark Hotspots**: Vector artwork contains interactive hotspots mapped to key objects (e.g., *director's chair*, *podium*, *ticket booth*). Clicking a hotspot triggers an audio pronunciation, displays the word card, and cites its appearance in the narrative.

### 4.3 Inductive Grammar Studio
Replaces static grammar boxes with interactive discovery:
* **Rule Formulator**: Students manipulate example sentences, dragging auxiliary verbs (*is / are*) and past participles to formulate passive structures, observing how meaning transforms in real time.
* **Tense Contrast Slider**: A visual time-scrubber allowing students to move between *Past Simple*, *Present Perfect*, and *Past Perfect*, with color-coded verb inflections updating synchronously with time markers (*yesterday*, *already*, *before that*).
* **Participial Adjective Classifier**: Interactive sorting mechanism teaching the fundamental distinction between `-ed` (emotional state) and `-ing` (cause of feeling).

### 4.4 Gamified Assessment & Calibrated Distractor Engine
* **The Four-Option Distractor Standard**:
  * Every vocabulary challenge presents 4 options strictly compliant with the `.agents/rules/distractor.md` protocol:
    1. Strict Part-of-Speech matching (all nouns, all verbs, or all adjectives).
    2. Same semantic field / CEFR band.
    3. Plausible false friends or common Greek learner errors.
    4. Zero grammatical giveaways (e.g., matching plural forms or indefinite articles).
* **Spaced Repetition & Error Bank**:
  * Items answered incorrectly during any session are automatically collected into the unit's "Error Bank" for targeted re-testing before unit mastery is awarded.
* **Can-Do Self-Assessment**:
  * Interactive radar chart / checklist mirroring the Greek curriculum's *Self-Assessment* grids, asking students to reflect on concrete communicative competencies.

### 4.5 Guided Writing Studio & Project Scaffolder
* **Deconstructed Model Analysis**: Students examine a model text (e.g., film review, eco-poster, historical letter) by clicking color-coded lenses: Introduction, Plot Overview, Critical Evaluation, and Recommendation.
* **Sentence Starter Rack**: Drag-and-drop introductory phrases (*In my opinion*, *The story is set in*, *What I liked most was*).
* **Pre-Flight Submission Checklist**: Interactive rubric requiring students to verify capitalization, punctuation, paragraphing, and inclusion of required grammatical structures before finalizing their work.

---

## 5. Operational Modes & Role-Based Workflows

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Three Specialized Operating Modes                    │
├────────────────────────────────────────────────────────────────────────┤
│  1. Student Self-Study Mode (Default)                                  │
│     • Formative feedback enabled (retry wrong answers)                 │
│     • Audio assistance and scaffolded hints accessible                 │
│     • Personal progress tracking & gamified mastery streaks            │
├────────────────────────────────────────────────────────────────────────┤
│  2. Teacher Classroom & Smartboard (IWB) Mode                          │
│     • Instant "Reveal All Answers" toggle for whole-class review       │
│     • High-contrast display scaling for front-of-class visibility      │
│     • Integrated countdown activity timer and random student picker    │
│     • Masking tool to cover/uncover sections of reading passages       │
├────────────────────────────────────────────────────────────────────────┤
│  3. Homework & Assessment Mode                                         │
│     • Hints and instant verifications disabled                         │
│     • Single-attempt submission recording                              │
│     • Generates a signed, verifiable JSON report or printable PDF      │
│       summary for teacher inspection without requiring a central server│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Cross-Device Responsive Behavioral Model

The platform adapts dynamically across screen geometries and interaction styles:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Device / Viewport   │ Architectural Adaptation                          │
├─────────────────────┼───────────────────────────────────────────────────┤
│ Smartboard / IWB    │ Oversized touch targets (minimum 64x64px);        │
│ (1920x1080 Touch)   │ high-contrast typography; interactive annotation  │
│                     │ overlay; docked bottom-bar controls for teacher.  │
├─────────────────────┼───────────────────────────────────────────────────┤
│ Desktop / Laptop    │ True dual-pane layout: source reading permanently │
│ (1200px - 1920px)   │ visible alongside active interactive worksheets;  │
│                     │ full keyboard shortcut navigation support.        │
├─────────────────────┼───────────────────────────────────────────────────┤
│ Tablet / Chromebook │ Flexible dual-pane or collapsible split;          │
│ (768px - 1024px)    │ full touch-gesture support (drag, drop, swipe);   │
│                     │ on-screen keyboard friendly viewports.            │
├─────────────────────┼───────────────────────────────────────────────────┤
│ Smartphone          │ Linear progressive stack; floating audio mini-bar;│
│ (360px - 480px)     │ bottom-sheet modals for vocabulary lookups;       │
│                     │ tap-to-select alternative to drag-and-drop.       │
└─────────────────────┴───────────────────────────────────────────────────┘
```

---

## 7. Data Models & Interface Contracts

### 7.1 Unified Unit Master Schema (`unitN_v2_data.json` / `.js`)
```typescript
interface UnitMasterData {
  unit_id: number;
  unit_title: string;
  theme: string;
  cefr_target: "A1" | "A1+";
  curriculum_standards: string[];
  
  // Section 1: Core Coursebook Materials
  student_book: {
    lessons: Array<{
      lesson_id: number;
      lesson_title: string;
      reading_passage: {
        title: string;
        text: string;
        audio_src: string;
        audio_neural_src: string;
        timestamps: Array<{ sentence_index: number; start_ms: number; end_ms: number }>;
      };
      comprehension_tasks: Exercise[];
    }>;
  };

  // Section 2: Complete Workbook Tasks
  workbook: {
    section_a_vocabulary: Exercise[];
    section_b_grammar: Exercise[];
    section_c_writing: {
      prompt: string;
      model_text: string;
      scaffolding_checklist: string[];
    };
    self_assessment: Array<{ id: string; descriptor: string; level: string }>;
  };

  // Section 3: Digital Companion Augmentations
  companion: {
    vocabulary: Array<{
      id: number;
      word: string;
      ipa: string;
      part_of_speech: string;
      meaning_gr: string;
      definition_en: string;
      example: string;
      topic: string;
      cefr_level: string;
      audio: {
        classic: { word: string; def: string; example: string };
        neural: { word: string; def: string; example: string };
      };
    }>;
    story_dossiers: Array<{
      id: string;
      title: string;
      vector_artwork_src: string;
      narrative_text: string;
      owned_vocabulary_ids: number[];
      hotspots: Array<{ x_pct: number; y_pct: number; target_vocab_id: number; label: string }>;
    }>;
    grammar_lab: {
      rule_title: string;
      interactive_formula: string;
      explanation_en: string;
      explanation_gr: string;
      sandbox_type: "passive_builder" | "time_slider" | "comparison_scale";
    };
    definition_challenge: Array<{
      id: number;
      target_word: string;
      clue: string;
      options: [string, string, string, string];
      correct_index: number;
    }>;
  };
}
```

### 7.2 Polymorphic Exercise Schema (`Exercise`)
```typescript
interface Exercise {
  id: string;
  source: "student_book" | "workbook";
  exercise_number: string; // e.g., "A3", "B2"
  title: string;
  instruction: string;
  type: "gap_fill" | "drag_drop" | "matching" | "categorize" | "reorder" | "multiple_choice";
  audio_attachment?: string;
  items: Array<{
    item_id: number;
    prompt: string;
    target_answer: string | string[];
    distractors?: string[];
    options?: string[];
    hint?: string;
  }>;
}
```

### 7.3 Student Progress & Persistence Schema (`localStorage` / `IndexedDB`)
```typescript
interface UserWorkspaceState {
  version: "2.0";
  last_active_unit: number;
  settings: {
    audio_engine: "neural" | "classic";
    playback_speed: number;
    role_mode: "student" | "teacher" | "homework";
  };
  units: Record<number, {
    completed_exercises: Record<string, {
      user_answers: Record<string, string>;
      is_completed: boolean;
      score: number;
      first_try_accuracy: number;
      attempts: number;
    }>;
    vocabulary_mastery: Record<number, {
      correct_streak: number;
      last_reviewed: string;
      in_error_bank: boolean;
    }>;
    marginalia: {
      highlights: Array<{ text: string; color: string; paragraph_index: number }>;
      notes: Array<{ note_id: string; target_id: string; content: string }>;
    };
    writing_drafts: Record<string, string>;
  }>;
}
```

---

## 8. Quality Assurance, Pedagogical Compliance & Verification

To guarantee institutional rigor, the application must pass automated quality gates:
1. **CEFR Lexical Auditor**: Every definition in the lexical dataset is checked against the Cambridge English / Oxford 3000 CEFR A1/A1+ lexicon. Any word above A1+ triggers a build failure.
2. **Pedagogical Distractor Validation**: Automatic audit verifies that all quiz distractors match the part of speech of the target word and do not include the headword stem.
3. **Data Twin Parity Engine**: Compares every JSON dataset with its corresponding JavaScript twin to ensure byte-level semantic identity.
4. **Air-Gap Network Verification**: Runs in a sandboxed headless browser with external network connections severed. Any attempt to fetch an external resource (`http://`, `https://`, Google Fonts, CDNs) fails the automated test suite.

---

## 9. Summary: How This Specification Transforms the Classroom

| Dimension | Physical Coursebook Only | Generic PDF / Web Viewer | Unified Digital Platform (This Spec) |
|---|---|---|---|
| **Portability** | Heavy textbook + workbook + notebook + CD player | Static PDF requiring external tools | Single zero-install responsive web app |
| **Feedback** | Delayed (must wait for teacher to grade in class) | None (read-only PDF) | Instant, formative, step-by-step scaffolding |
| **Audio** | Dependent on teacher CD player or broken links | Often missing or detached | In-situ dual-engine audio with karaoke highlighting |
| **Differentiation** | One-size-fits-all printed page | Passive zoom | Adjustable playback speed, hint tiers, dyslexia-friendly fonts |
| **Assessment** | Manual paper tests | Manual paper tests | Automatic error tracking, spaced repetition, CEFR radar |
