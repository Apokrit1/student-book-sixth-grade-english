# Semantic Lexical Binding Specification (Anti-Scrambling)

## Root Causes of Vocabulary Scrambling (Learned from Unit 1)
In initial automated builds, landmark cards suffered from two major flaws:
1. **Type-based lookup**: Guessing that all "Coast" landmarks map to word 8 or all "Mountains" map to word 21, resulting in cross-country collisions.
2. **Integer list-index instability**: Hardcoding array indices that scrambled whenever the vocabulary list was sorted or updated.

## The Semantic Binding Standard

Every landmark in `stories[].landmarks[]` must adhere to this exact structure:

```json
{
  "name": "Odesa & Black Sea Coast",
  "type": "Coast",
  "word_key": "coast",
  "word_id": 6,
  "desc": "Famous port city with beautiful seaside promenades."
}
```

### Mandatory Rules
1. **Primary String Key (`word_key`)**:
   - `word_key` must be the exact lower-case string of a target vocabulary word in `vocabulary_data.json` (e.g., `"coast"`, `"mountain"`, `"underwater"`).
   - In `app_v2.js`, resolve using `vocabList.find(v => v.word.toLowerCase() === lm.word_key.toLowerCase())`.
2. **Fallback Integer ID (`word_id`)**:
   - Keep `word_id` pointing to the canonical `id` in `vocabulary_data.json`.
3. **Null Pill Rule for Unmatched Landmarks**:
   - If a landmark or personality does not represent an item from the 35 core vocabulary items (e.g. capital cities like Tirana, or modern historical figures like Mother Teresa), set:
     ```json
     "word_key": null,
     "word_id": null
     ```
   - The UI must render the landmark card cleanly without any audio chip or forced irrelevant word.
4. **Story Lexis Ownership Rule**:
   - In `story.vocabulary_ids`, list only the integer IDs of words that **actually appear** in that specific student's narrative text.
   - Cross-dossier leakage (words from Ukraine appearing in Albania's chip bar) is strictly prohibited.
