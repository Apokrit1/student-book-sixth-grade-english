---
name: distractor
description: Pedagogical rules and best practices for selecting and generating distractors for vocabulary and grammar quizzes.
---

# Distractor Generation and Selection Skill

This skill defines the pedagogical standards for creating multiple-choice distractors in educational apps and quizzes, specifically targeting CEFR A2/A2+ English learners. 

When generating or reviewing quiz data, you MUST apply these principles to ensure high diagnostic value.

## 1. Strict Part-of-Speech (POS) Matching (MANDATORY)
Never mix parts of speech in a multiple-choice question unless explicitly testing grammatical identification. 
- **Verbs** must be distracted by **verbs**.
- **Nouns** must be distracted by **nouns**.
- **Adjectives** must be distracted by **adjectives**.
*Why?* If a sentence gap requires a noun, providing adjective distractors allows the student to bypass lexical knowledge and use grammatical deduction to find the correct answer.

## 2. Semantic Field Consistency (MANDATORY)
Distractors should belong to the same semantic category as the target word.
- **Target:** `beef` (Food/Meat)
  - **Good Distractors:** `lamb`, `mince`, `chicken`
  - **Bad Distractors:** `budget`, `catwalk`, `ancient` (Unrelated semantics)
*Why?* Forcing a choice between semantically related words requires higher-order cognitive processing and deeper lexical retrieval.

## 3. Multi-Unit Pooling (Useful if available)
Instead of strictly pulling distractors from the current unit, pull POS-matched distractors from *previous* units where available. This enforces spaced repetition and increases the difficulty pool without introducing unfamiliar vocabulary.

## 4. External Sources for Distractors
When pulling distractors, you should utilize the provided resources located in the `_tools` directory to ensure vocabulary is appropriate for 6th grade and CEFR A2/A2+ level alignment:
- [`_tools/source/The_Oxford_3000_by_CEFR_level.pdf`](file:///C:/photodentro/antigravity/vocabulary%20st/_tools/source/The_Oxford_3000_by_CEFR_level.pdf)
- [`_tools/source/5th grade_coursebook_cefr.json`](file:///C:/photodentro/antigravity/vocabulary%20st/_tools/source/5th%20grade_coursebook_cefr.json)

## 5. Avoid "Giveaways"
- Do not use distractors that differ significantly in length from the target.
- Do not use distractors with obvious Greek cognates unless testing false friends.
- Do not include emojis or formatting in the distractors that could hint at the answer.

## Implementation Guide
When modifying quiz data (e.g., in Python or JS scripts), replace random pool selection with a filtered approach:
```javascript
// Example implementation logic
const targetWord = vocabulary[targetIndex];
let validDistractors = vocabulary.filter(word => 
    word.pos === targetWord.pos && word.id !== targetWord.id
);
// Randomly select 3 from validDistractors, falling back to external sources if needed
```
Always audit the generated JSON datasets to verify that these rules are upheld.
