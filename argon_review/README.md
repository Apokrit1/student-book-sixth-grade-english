# English 6th Grade — Digital Coursebook Platform (*Αγγλικά ΣΤ΄ Δημοτικού*)
## Code Review Bundle: Master Portal & Unit 1 Flagship Implementation

[![Curriculum](https://img.shields.io/badge/Curriculum-Greek_Ministry_of_Education_(DEPPS--APS)-blue.svg)](#)
[![Target Level](https://img.shields.io/badge/CEFR-A1+_%2F_A2-green.svg)](#)
[![Architecture](https://img.shields.io/badge/Architecture-100%25_Offline_%2F_GDPR_Compliant-success.svg)](#)
[![Scope](https://img.shields.io/badge/Review_Scope-Portal_%2B_Unit_1_Flagship-orange.svg)](#)
[![Bundle Size](https://img.shields.io/badge/Size-~1_MB_(Model_Friendly)-purple.svg)](#)

---

## 📌 Review Scope & Model-Friendly Design

This package is a **compact, model-friendly code review bundle** (~1 MB, zero binary audio/video/pdf files) prepared for evaluation by automated AI code reviewers (e.g., Argon, Claude, GPT) and curriculum audit committees.

It showcases the complete architectural pattern of the platform through two key components:
1. **The Master Coursebook CLIL Portal** (`portal.html`, `portal.css`, `portal.js`)
2. **The Flagship Unit 1: *Our Multicultural Class*** (`unit1/index.html`, `unit1/v2.html`, `unit1/photodentro/`)

---

## 1. Executive Summary & Dual-Role Architecture

The platform modernizes the Greek Ministry of Education's 6th Grade Primary English Coursebook (*Αγγλικά ΣΤ΄ Δημοτικού*) into a zero-backend, 100% offline-capable, GDPR-compliant web application.

It simultaneously satisfies two non-conflicting operational roles:
1. **Total Printed Coursebook Replacement**: Students and teachers can conduct 100% of their lessons without opening the printed *Student's Book* or *Workbook*. All reading texts, dialogues, grammar rules, exercises, and answer keys are fully digitized into interactive, auto-evaluating web modules.
2. **Augmented Digital Companion**: Features an inductive grammar laboratory, dual-engine voice pronunciation, formative retrieval quizzes, vocabulary discovery dossiers, and genre-based writing scaffolds.

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
│ • Complete Student's Book texts │       │ • Dual-engine audio architecture │
│ • Complete Workbook exercises   │       │ • Inductive Grammar Laboratory   │
│ • Integrated reading dossiers   │       │ • Interactive Story Dossiers     │
│ • In-situ digital notebook      │       │ • Calibrated Distractor Quizzes  │
│ • Teacher's answer key reveals  │       │ • Scaffolding & Writing Studio   │
└─────────────────────────────────┘       └──────────────────────────────────┘
```

---

## 2. Directory Structure & Key Entry Points

```
argon_review/
├── README.md                      # This review guide
├── package.json                   # NPM configuration & scripts
├── requirements.txt               # Python tool dependencies
├── index.html                     # Root entry redirecting to portal.html
├── portal.html                    # Master Coursebook CLIL Dashboard
├── portal.css                     # Master styling & responsive design tokens
├── portal.js                      # Search controller, filters, and quiz launcher
├── unit_wrapper.html              # Modal iframe wrapper for unit navigation
├── _validate.mjs                  # Offline link & asset integrity verification script
├── APP_SPECIFICATION.md           # Full system architectural specification
├── data/
│   ├── coursebook_catalog.json    # Master 10-unit curriculum metadata schema
│   └── coursebook_catalog.js      # Global JS data twin (window.COURSEBOOK_CATALOG)
├── assets/
│   └── fonts/fonts.css            # Offline typography definitions
└── unit1/                         # Flagship Unit: "Our Multicultural Class"
    ├── index.html                 # Interactive Vocabulary Companion
    ├── app.js                     # Vocabulary logic & learning modes
    ├── style.css                  # Vocabulary design system
    ├── v2.html                    # Student's Book & Workbook Companion
    ├── app_v2.js                  # Coursebook & Workbook application logic
    ├── style_v2.css               # Coursebook & Workbook stylesheet
    ├── verify_offline.js          # Offline & GDPR compliance test harness
    ├── ERRATA.md                  # Curricular errata registry
    ├── data/
    │   ├── vocabulary_data.json   # 35 target headwords with CEFR A2 definitions
    │   ├── vocabulary_data.js     # JS data twin (window.VOCABULARY_DATA)
    │   ├── unit1_v2_data.json     # 4 story dossiers, grammar lab, writing studio
    │   ├── unit1_v2_data.js       # JS data twin (window.UNIT1_V2_DATA)
    │   ├── unit1_workbook_data.json # 5 interactive workbook activities
    │   └── unit1_workbook_data.js # JS data twin (window.UNIT1_WORKBOOK_DATA)
    ├── assets/
    │   └── images_v2/             # 4 SVG vector illustrations for story dossiers
    └── photodentro/               # Integrated Photodentro OER Grammar App
        ├── index.html             # Present Simple vs. Continuous quiz applet
        ├── app.js                 # Photodentro exercise logic
        └── css/                   # Photodentro styling
```

---

## 3. Core Architectural Invariants

### 1. 100% GDPR & Offline Compliance
- **Zero external network requests**: No external CDN calls, no third-party trackers, no analytics.
- **Local typography**: Font styles load locally from [`assets/fonts/fonts.css`](assets/fonts/fonts.css).
- Verified automatically via [`unit1/verify_offline.js`](unit1/verify_offline.js).

### 2. Dual-Format Data Twins (`.json` + `.js`)
- Every JSON dataset has an identical `.js` counterpart assigning its content to a global namespace (e.g., `window.UNIT1_V2_DATA`).
- **Why**: Allows students and teachers to run the application directly over `file:///` protocols from USB drives or local disks without triggering browser Cross-Origin Request Security (CORS) blocks.

### 3. 100% Lexical Ownership
- In [`unit1/data/unit1_v2_data.json`](unit1/data/unit1_v2_data.json), every target vocabulary item assigned to a story dossier appears **verbatim** in the narrative text. There are zero orphaned vocabulary items.

### 4. Inductive Grammar Pedagogy
- The Grammar Lab in [`unit1/v2.html`](unit1/v2.html) guides students to discover grammatical rules (*Present Simple vs. Present Continuous*) through observation of contextual sentences and signal words rather than dry deductive rule memorization.

---

## 4. Quick Start for Reviewers

### Option A: Local Static Server
```bash
# Using Node.js
npx serve -l 8080 .

# Or using Python 3
python -m http.server 8080
```
Open **`http://localhost:8080/portal.html`** in your browser.

### Option B: Direct File System Opening
Because of the dual-format JS data twins architecture, you can open [`portal.html`](portal.html), [`unit1/index.html`](unit1/index.html), or [`unit1/v2.html`](unit1/v2.html) directly in any modern browser using `file:///` with zero server setup.

---

## 5. Verification & Testing

### Asset & Link Integrity
Verify that all referenced assets, scripts, and stylesheets exist and resolve properly:
```bash
node _validate.mjs unit1
# Output: Total: 18 OK: 18 MISSING: 0
```

### Isolated VM Architecture Verification
Runs the unit in an isolated Node.js VM context to verify script execution order and certify zero external HTTP/HTTPS network dependencies:
```bash
cd unit1
node verify_offline.js
cd ..
```
