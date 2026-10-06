# Unit 1 — Fix-It / QA Report
## Sixth Grade English Buddy — Our Multicultural Class

**Audit date:** 5 October 2026  
**Application:** Sixth Grade English Buddy  
**Unit audited:** Unit 1 — *Our Multicultural Class*  
**Versions reviewed:** Version 1, Version 2, Workbook activities, vocabulary data, portal links, and related Unit 1 assets

---

## 1. Executive Summary

The Unit 1 implementation has a strong overall concept: it attempts to turn the official Unit 1 material into a coherent digital learning environment combining vocabulary, grammar, listening, geography, writing, printable worksheets, and learner reflection.

The principal problems are not cosmetic. The most important issues concern:

1. **Grammar answer validation** that accepts answers using the wrong tense in exercises designed to test Present Simple vs Present Continuous.
2. **Open-writing assessment logic** that uses broad substring matching and therefore produces false positive evidence of achievement.
3. **Inconsistent CEFR labelling**, with A1/A1+, A1+/A2, and A2+ appearing in different parts of the system.
4. **An unjustifiably strong “mastery” / “A2+ certificate” claim** based largely on self-ticking and automated heuristics.
5. **Insufficient distinction between official Unit 1 content and teacher-created extension/CLIL material.**
6. **A number of lexical, factual, sociocultural, and terminology issues** that should be corrected before the resource is presented as a polished curriculum companion.

### Overall judgement

**Unit 1 V2 should not yet be treated as assessment-ready.**

It can function as a practice/enrichment environment, but the assessment language and answer-checking logic need correction before the app makes claims about mastery, CEFR achievement, or formal formative assessment.

---

# 2. Priority Summary

| ID | Area | Severity | Finding |
|---|---|---:|---|
| U1-01 | Grammar validation | **Critical** | B1-I accepts Present Simple answers in a Present Continuous exercise |
| U1-02 | Grammar validation | **Critical** | B2 accepts Present Simple in a clearly current-action context |
| U1-03 | CEFR | **Critical** | Unit/course uses inconsistent A1/A1+, A1+/A2 and A2+ labels |
| U1-04 | Assessment logic | **Critical** | Open-writing checklist uses broad substring keywords and can generate false positives |
| U1-05 | Assessment claims | **Critical** | “Certificate of Unit Mastery” / “A2+ learning milestones” overstate what the system establishes |
| U1-06 | Workbook fidelity | **High** | A3 word-bank/task structure is broader than the implemented four-item activity |
| U1-07 | Curriculum alignment | **High** | V2 introduces substantial extension/CLIL content without consistently distinguishing it from core Unit 1 |
| U1-08 | Grammar scope | **High** | V2’s mastery system is broader than the source progression and risks conflating practice with assessment |
| U1-09 | Language/facts | **High** | Tbilisi, Moldova/Dnipro presentation and other lexical/factual forms require review |
| U1-10 | Sociocultural language | **High** | “different countries and races” is pedagogically dated and should be revised |
| U1-11 | Validation policy | **High** | Several answer sets accept alternatives that are semantically possible but pedagogically wrong for the target exercise |
| U1-12 | Writing scope | **Medium** | Five-paragraph report builder is more ambitious than the core Unit 1 writing requirement |
| U1-13 | Vocabulary | **Medium** | V2’s 35-item lexical universe needs explicit core/extension labelling |
| U1-14 | Geography | **Medium** | Some definitions/examples require tighter disciplinary review |
| U1-15 | Technical regression | **Pending** | Full live click-through of every audio/image/print/modal path could not be completed |

---

# 3. Detailed Findings

## U1-01 — B1-I accepts the wrong tense
**Severity: Critical**

### Location
Unit 1 Workbook data, activity **B1-I**  
File:

`public/site/unit1/data/unit1_workbook_data.js`

### Problem

The activity is explicitly designed around:

> “What are they doing now?”

and targets the **Present Continuous**.

However, several answer arrays accept Present Simple alternatives.

Example:

```text
accepted:
"is looking after",
"looks after",
"'s looking after"
```

Therefore the checker can accept:

> Mr Papadopoulos **looks after** the baby.

as correct in an exercise intended to elicit:

> Mr Papadopoulos **is looking after** the baby.

The same problem occurs with other items, for example:

```text
"is talking"
"talks"
"'s talking"
```

and:

```text
"is writing"
"writes"
"'s writing"
```

### Why this matters

This is not simply generous answer handling. It changes the grammatical construct being assessed.

A pupil can obtain a correct score without demonstrating knowledge of the target tense.

### Fix

For a closed grammar exercise, restrict accepted answers to the target structure:

```javascript
accepted = [
  "is looking after",
  "'s looking after"
]
```

Reject:

```text
looks after
```

Apply the same policy throughout B1-I.

---

## U1-02 — B2 accepts Present Simple where Present Continuous is the target
**Severity: Critical**

### Location
Workbook activity **B2**

### Problem

For the item:

> “but tonight I ______ parsley as well.”

the data accepts:

```text
"am putting"
"'m putting"
"put"
"I'm putting"
"I am putting"
```

The form:

> **put**

should not be accepted here if the purpose of the item is to distinguish a habitual action from an action occurring on this particular occasion.

### Fix

Use:

```javascript
accepted = [
  "am putting",
  "'m putting",
  "I'm putting",
  "I am putting"
]
```

Do not include:

```text
put
```

### General rule

Where an exercise has an explicit grammar target, the checker must test the target form, not merely accept another grammatically possible sentence.

---

# 4. U1-03 — CEFR labelling is inconsistent
**Severity: Critical**

Different parts of the project use different level descriptions.

### Catalogue

The course catalogue identifies:

> CEFR A1 / A1+

### V1 interface

The interface displays:

> CEFR A1+ / A2

### V2 data

The V2 data contains:

```text
"cefr_level": "A2+"
```

### Certificate

The certificate says that the pupil has achieved:

> “all CEFR A2+ learning milestones”

### Problem

The application therefore presents at least three different interpretations of the target level.

This makes the educational positioning unclear and weakens the validity of the assessment language.

### Fix

Choose one defensible formulation and use it consistently.

A conservative option would be:

> **Target level: A1+**

or:

> **Target level: A1+ / developing A2**

The chosen level should be used consistently in:

- portal
- V1
- V2
- worksheets
- certificate/learner record
- metadata

---

# 5. U1-04 — Open-writing assessment generates false positives
**Severity: Critical**

### Location
V2 writing/checklist logic in `app_v2.js`

### Problem

The automatic checklist uses direct substring matching, conceptually like:

```javascript
text.includes(keyword)
```

C2 contains very broad keywords such as:

```text
"in"
"at"
"town"
"island"
"city"
"village"
"greece"
"hotel"
```

The timetable activity similarly includes:

```text
"on"
"have"
"every"
"week"
"classes"
"lessons"
```

### Why this matters

A single occurrence of a common function word can trigger evidence for an entire pedagogical criterion.

For example:

> “I live in Athens.”

contains **in** and can therefore be treated as location evidence.

Likewise, a paragraph containing **on** can trigger routine-expression evidence.

This is not reliable assessment.

### Fix

Do not assess open writing by raw substring presence.

At minimum:

- use word-boundary matching;
- eliminate very common function words as standalone evidence;
- require contextual phrases;
- distinguish vocabulary evidence from grammatical evidence;
- never report “mastery” from a binary keyword tick.

A better criterion would be something like:

```text
location evidence:
- "in Athens"
- "in Greece"
- "at a hotel"
- "in a small town"
```

rather than simply:

```text
"in"
"at"
```

### Recommended UI language

Replace:

> Criterion achieved

with:

> **Possible evidence detected**

For open writing, the final judgement should remain teacher-mediated.

---

# 6. U1-05 — “Mastery” and certificate claims are too strong
**Severity: Critical**

### Location
V2 Passport / certificate

The system includes:

> “Certificate of Unit Mastery”

and states that the learner:

> “has successfully achieved all CEFR A2+ learning milestones”

### Problem

Four self-ticked checkboxes do not establish CEFR mastery.

Similarly:

- self-report is not the same as demonstrated performance;
- keyword detection is not the same as reliable writing assessment;
- a few game scores are not sufficient evidence of overall Unit mastery.

### Fix

Rename the system to something such as:

> **Unit 1 Learning Record**

or:

> **Can-Do Reflection**

Use more defensible states:

- Not yet
- Developing
- I can do this independently

Replace certificate wording with:

> “The learner has completed the Unit 1 learning and reflection activities.”

Avoid official-sounding claims that imply external certification.

---

# 7. U1-06 — A3 task/word-bank structure is inconsistent
**Severity: High**

### Location
Workbook activity **A3**

The data contains an eight-item word bank:

```text
Maths
Science
Geography
Music
English
History
Art
Physical Education
```

but the implemented activity includes only four visual answer items:

```text
Maths
Science
Geography
Music
```

### Problem

The interface therefore suggests a larger matching exercise than the student actually completes.

The relationship between:

**word bank → visual prompts → expected answers**

is not sufficiently clear.

### Fix

Either:

1. faithfully implement the original four-item task with an appropriate four-item answer bank, or
2. explicitly label an eight-item version as an **extension activity**.

Do not present an expanded task as though it were the original workbook activity.

---

# 8. U1-07 — V2 blurs core curriculum and extension material
**Severity: High**

The official Unit 1 progression is broadly organised around:

- multicultural/newcomer context;
- countries, nationalities and geography;
- school subjects/projects;
- Present Simple and Present Continuous;
- listening;
- country-report writing.

V2 adds:

- extended geography terminology;
- collocation games;
- a clue/crossword system;
- a four-mode challenge arena;
- a five-paragraph report builder;
- an extensive learner passport/certificate system;
- substantial additional vocabulary;
- extra CLIL facts.

The issue is not enrichment itself.

The issue is the presentation of enrichment as though it were automatically part of the official core.

### Fix

Label activities consistently:

**CORE** — directly from the official coursebook/workbook

**PRACTICE** — digital adaptation of official material

**EXTENSION** — teacher-created enrichment

This would substantially improve curricular transparency.

---

# 9. U1-08 — V2 grammar scope risks conflating practice with assessment
**Severity: High**

The application contains a large number of grammar interactions and then uses the results in a broader “mastery” structure.

The risk is that:

> successful completion of isolated game items

is treated as evidence that the learner has mastered:

> Present Simple vs Present Continuous

as a communicative ability.

### Fix

Separate:

**Practice**

from:

**Assessment evidence**

For example:

```text
Practice score: 8/10
```

should not automatically become:

```text
Grammar mastery achieved
```

A stronger structure would include:

- practice score;
- retry history;
- contextual production;
- teacher observation;
- Can-Do reflection.

---

# 10. U1-09 — Lexical/factual forms need review
**Severity: High**

Several items require language or factual review.

## Tbilisi

The data contains:

> `T’blisi`

Use:

> **Tbilisi**

## Moldova

The Ukraine narrative uses:

> “Moldavia”

Modern English normally uses:

> **Moldova**

Because this originates in the textbook tradition, the best solution may be to preserve source fidelity while modernising the displayed terminology where appropriate.

## Dnipro / Dnipo

The source-derived text uses:

> “Dnipo”

Modern English uses:

> **Dnipro**

This should be handled as a source-fidelity decision rather than silently changed without explanation.

### Recommended solution

For source-faithful activities, retain original wording if required.

For teacher-created extensions, use contemporary standard English.

---

# 11. U1-10 — Sociocultural wording should be modernised
**Severity: High**

The Gwen narrative uses wording equivalent to:

> “different countries and races”

This is not ideal for a modern primary-school resource.

### Fix

Prefer:

> **people from different countries, cultures and backgrounds**

This preserves the intended teaching point about multiculturalism without making “race” the default organising category.

---

# 12. U1-11 — Answer validation needs a consistent policy
**Severity: High**

Several data entries intentionally accept multiple forms, including some forms that change the target of the exercise.

For example, the workbook often contains:

```text
key_answer
```

plus a broader:

```text
accepted
```

array.

Broad acceptance is appropriate only when the alternative is pedagogically equivalent.

It is **not** appropriate when the exercise is explicitly testing:

- tense;
- agreement;
- negative formation;
- question formation;
- a particular lexical item;
- a particular structural form.

### Fix

Define a validation policy.

#### Accept
- spelling/case variations that do not alter the target;
- contractions vs full forms;
- clearly equivalent lexical forms where the activity does not target a specific word.

#### Reject
- a different tense;
- a different grammatical structure;
- an answer that bypasses the target skill;
- an answer that changes meaning.

---

# 13. U1-12 — Five-paragraph report builder is more ambitious than the core task
**Severity: Medium**

The V2 application presents:

> **The 5-Paragraph Country Report Builder**

This is a useful extended-writing scaffold, but it is substantially more ambitious than a minimal Unit 1 country report.

### Problem

Pupils may reasonably infer that a five-paragraph formal report is the minimum Unit 1 expectation.

### Fix

Rename to:

> **Country Report Builder — Extended Writing**

Provide a simpler:

> **Core Country Report**

before the extension mode.

This preserves the useful scaffold without redefining the unit workload.

---

# 14. U1-13 — The 35-item vocabulary set needs explicit status labels
**Severity: Medium**

V2 contains a substantial vocabulary universe, including geography, science, technology, society, weather and industry terms.

The issue is not the number of words.

The issue is whether a pupil can tell which items are:

- required;
- practice;
- enrichment;
- incidental CLIL language.

### Fix

Add a field to the vocabulary data:

```javascript
status: "core"
```

or:

```javascript
status: "extension"
```

Then make:

> **Core Vocabulary**

the default student view.

---

# 15. U1-14 — Geography definitions need disciplinary review
**Severity: Medium**

Several geography definitions and examples are educationally usable but should be checked for precision before being presented as authoritative definitions.

Particular attention should be paid to:

- peninsula;
- bay;
- gulf;
- plain;
- landscape;
- underwater;
- river-related terminology.

### Fix

Use either:

- concise school-level definitions adapted to the coursebook, or
- authoritative disciplinary definitions that are simplified without becoming inaccurate.

Do not mix highly simplified dictionary-style definitions with claims of formal mastery without review.

---

# 16. U1-15 — Full live technical regression remains necessary
**Severity: Pending**

The project source contains a large number of:

- audio assets;
- image assets;
- modal interfaces;
- print functions;
- restart buttons;
- quiz systems;
- workbook filters;
- tab navigation;
- report previews;
- certificate logic.

The published Unit 1 pages returned a cache-miss during external live browser access, so a complete reproducible click-through of every control could not be certified.

### Therefore

The following should remain explicitly marked **pending technical verification**, rather than being reported as broken without reproduction:

- individual audio files;
- individual image paths;
- all print functions;
- modal open/close flows;
- restart behaviour;
- score/streak resets;
- workbook filtering;
- report preview;
- certificate printing;
- persistence/reload behaviour.

---

# 17. Recommended Fix Order

## Phase 1 — Must fix before classroom assessment use

1. Correct B1-I grammar validation.
2. Correct B2 grammar validation.
3. Audit all grammar validators for the same problem.
4. Replace substring-based writing assessment.
5. Remove A2+ mastery/certificate claims.
6. Standardise CEFR labelling.
7. Separate Core from Extension.
8. Resolve A3 task/word-bank mismatch.

## Phase 2 — Quality and curriculum alignment

9. Correct/standardise Tbilisi.
10. Review Moldova/Dnipo wording.
11. Modernise the multiculturalism wording.
12. Review geography definitions.
13. Reframe the Can-Do passport.
14. Reframe the five-paragraph report as extension.
15. Tag vocabulary items as Core or Extension.

## Phase 3 — Regression testing

For every activity:

```text
Load
→ enter a known correct answer
→ enter a known wrong answer
→ reset
→ repeat
→ print
→ reload
```

Special attention should be paid to:

- tense validators;
- score counters;
- streak counters;
- audio;
- print worksheets;
- modal dialogs;
- tab switching;
- restart buttons;
- workbook filters;
- Can-Do state;
- report preview.

---

# 18. Suggested Target Architecture for Unit 1 V2

A cleaner structure would be:

## Core Unit 1

### 1. Countries & Geography
Countries, nationalities, maps, landforms

### 2. School Subjects & Projects
School subjects, project vocabulary, listening

### 3. Present Simple vs Present Continuous
Habits/routines vs actions happening now

### 4. Listening
School computer-lab/project listening tasks

### 5. Country Report
A manageable Unit 1 writing task

### 6. Can-Do Reflection
Self-assessment without false mastery certification

---

## Extension Lab

Place the more ambitious material here:

- collocations;
- geography clue challenges;
- additional CLIL facts;
- expanded vocabulary;
- five-paragraph report;
- extra challenge games.

This preserves the richer V2 environment without obscuring the official Unit 1 scope.

---

# 19. Final Assessment

The application has a good pedagogical concept and a substantial amount of useful material.

However, its current assessment layer is stronger in **appearance** than in **measurement validity**.

The most serious defect is the grammar validation:

> a pupil can submit the wrong tense and still receive a correct result.

The second major defect is the open-writing detection:

> broad keyword matches can be interpreted as evidence of achievement when they are not meaningful evidence.

The third is the assessment/CEFR framing:

> the system can move from a game or checklist directly to “A2+ mastery” and a certificate.

These should be corrected before the application is presented as an assessment-oriented companion.

As a **practice and enrichment platform**, Unit 1 is promising.

As a **reliable assessment system**, it requires another QA/fix cycle.

---

## Sources / basis of review

The audit considered:

- Unit 1 project source and data files in the Lovable project.
- Unit 1 V1 and V2 interfaces and scripts.
- Unit 1 workbook data and answer structures.
- Official Greek 6th-grade English coursebook/workbook material available through the Greek educational ebook repository (ebooks.edu.gr).
- The official Unit 1 learning/self-assessment framing and course structure.

**Important verification note:** individual live audio/image/print interactions were not marked as broken unless a source-level defect or reproducible evidence supported the finding. The published pages returned a cache-miss during the external live browser check, so those interactions require a separate browser regression pass.
