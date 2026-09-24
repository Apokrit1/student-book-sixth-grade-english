# v2 Review — Dossier vocabulary bindings (Unit 1)
**Reviewer feedback formatted for an LLM (Gemini/Antigravity) to apply. Human-readable, but precise.**
**Scope of this pass:** the four story dossiers in `data/unit1_v2_data.json` (`stories[].landmarks[].word_id` and `stories[].vocabulary_ids`). Other v2 sections (grammar_lab, collocations, crossword, true_false, report_builder) not yet reviewed.

---

## 1. Root cause (fix the cause, not the 16 symptoms)

Each landmark's vocabulary pill is resolved from an integer `word_id` that indexes `vocabulary_data.json`. Those integers are wrong, and they are wrong **by landmark `type`, uniformly across all four dossiers**. This is the signature of a hardcoded `type → word_id` lookup that was populated with incorrect values and then reused for every country:

| Landmark `type` | Assigned `word_id` → word | Correct `word_id` → word |
|---|---|---|
| Coast | 8 → `connect` | **6 → `coast`** |
| Mountain Range / Mountains / Nature | 21 → `natural disaster` | **19 → `mountain`** |
| River / Capital & River | 27 → `plain` | **30 → `river`** |
| Capital City | 5 → `coal mines` | no core-vocab match (see §4) |

There is no consistent numeric offset (6→8 is +2, 30→27 is −3, 22→34 is +12), so this is a wrong lookup table, not an arithmetic slip. Because `word_id` drives **both** the pill label and its audio file, every card is currently also playing the wrong MP3.

**Two structural fixes, in priority order:**

1. **Bind vocab semantically, per landmark, not by type.** Set each landmark's id to the word the landmark actually teaches (tables in §3). A landmark's `type` is a display label, never a vocab key.
2. **Replace the integer `word_id` with a stable string key** (e.g. `"word_key": "coast"`). Integer ids that index a list are exactly why this scrambled: any reordering of `vocabulary_data.json` silently re-corrupts every binding. A string key resolved against `vocabulary_data.json` by `word` (or an explicit `key` field added there) is reorder-proof. Keep the integer only as a fallback if the loader needs it.

All corrected words below already exist in the original 35-word set, so **their MP3s already exist in `assets/audio/` and `assets/audio_neural/` — no new audio generation is needed** for these fixes.

---

## 2. Data-integrity notes before applying

- `data/` holds both `.json` and `.js` copies (`unit1_v2_data.json` + `unit1_v2_data.js`, same for the catalog). The `.js` files are newer than the `.json`. Establish which is the source of truth and regenerate the other from it; do not hand-edit one and leave the other stale, or the app and the review will diverge.
- Apply every fix to the source-of-truth file, then rebuild its twin.

---

## 3. Exact corrections — landmarks (all 16)

`id` = vocabulary_data.json id. Format: `current → CORRECT`.

### Sasha — Ukraine
| Landmark | Pill now | Fix to | Reason |
|---|---|---|---|
| Odessa & Black Sea Coast | 8 `connect` | **6 `coast`** | Card is the Black Sea coast. |
| The Carpathian Mountains | 21 `natural disaster` | **19 `mountain`** | It is a mountain range. |
| River Dnipro | 27 `plain` | **30 `river`** (or **32 `split in`**) | Desc "dividing the country" is the book's collocation *split in two parts (River Dnipro)*; 32 teaches that directly, 30 is the plain-vanilla choice. |
| Chernobyl & Polesie Region | 34 `underwater` | **22 `nuclear power plant`** | The site is a nuclear plant. Also see §4.1 (factual). |

### Christina — Albania
| Landmark | Pill now | Fix to | Reason |
|---|---|---|---|
| Tirana | 5 `coal mines` | — (no core word; see §4) | "Capital" is not in the 35-word set. |
| Adriatic & Ionian Coastline | 8 `connect` | **6 `coast`** | Coastline. |
| Balkan Mountains & Forests | 21 `natural disaster` | **19 `mountain`** | Mountains. (alt: 16 `landscape`) |
| Mother Teresa Memorial | 1 `ancient` | — (no core word; see §4) | `ancient` is factually wrong: 20th-century figure. |

### Georgi — Georgia
| Landmark | Pill now | Fix to | Reason |
|---|---|---|---|
| Batumi & Black Sea Coast | 8 `connect` | **6 `coast`** (or **4 `citrus fruit`**) | Coast; citrus is the narrative's Batumi hook. |
| The Caucasus Peaks | 21 `natural disaster` | **19 `mountain`** | Mountains. |
| T'bilisi Old Town | 5 `coal mines` | **1 `ancient`** | "Ancient capital" is in the narrative; `ancient` fits here (unlike Albania). |
| Colchis Lowlands | 1 `ancient` | **13 `golden fleece`** | The Argonauts/Colchis myth is the whole point of this card. (alt: 27 `plain` for "lowlands") |

### Gwen — United Kingdom
| Landmark | Pill now | Fix to | Reason |
|---|---|---|---|
| River Thames & London | 27 `plain` | **30 `river`** | It is a river. |
| Channel Tunnel | 6 `coast` | **34 `underwater`** (or **8 `connect`**) | Desc "underwater railway tunnel linking the UK to Europe" = `underwater` + `connect`. |
| Scottish Highlands & Welsh Peaks | 21 `natural disaster` | **19 `mountain`** | Mountains. |
| English Rolling Plains | 25 `paste` | **27 `plain`** | Plains. |

---

## 4. Landmark types with no core-vocabulary match

`Capital City`, `Culture` (Mother Teresa), `Nature`, `Undersea Link`, `Mythological Valley` do not map to any of the 35 target words, so Gemini forced an unrelated (and sometimes factually wrong) pill onto them. Do **not** force a core-vocab pill onto a card that doesn't teach one. Pick one policy and apply it consistently:

- **Preferred:** allow a landmark to have no vocab pill. Render the card without the audio chip when `word_key` is null.
- **Or:** give these cards a genuinely related word even if it's outside the core 35 (e.g. Tirana → `capital`, Mother Teresa → `humanitarian`), and generate the matching audio asset for it (this is a legitimate use of the "generate when needed" allowance — flag such words as `generated: true`).

Do not leave `ancient` on the Mother Teresa card under any policy; it teaches a false association.

**4.1 Chernobyl factual/register fix (separate from the id bug):** `type: "Environmental History"`, desc *"driving modern green transition"* over-editorialises a 1986 nuclear accident for 11–12 year-olds, and the old screenshot pill `natural disaster` mislabels a technological accident as natural. After setting the pill to `22 nuclear power plant`, revise the desc to something factual and age-appropriate, e.g.: *"Site of a serious nuclear accident in 1986; the surrounding zone is now a wildlife reserve."*

---

## 5. Exact corrections — `vocabulary_ids` per story

These arrays currently include words that never appear in the story's narrative (cross-dossier leakage) and omit the story's real key lexis. Corrected sets, derived from each narrative in `unit1_v2_data.json`:

| Story | Current | Remove (not in narrative) | Add (key lexis present) | Suggested corrected set |
|---|---|---|---|---|
| Ukraine | 2,5,8,21,25,27,34,3 | 5 coal mines, 8 connect, 21 natural disaster, 25 paste, 34 underwater | 6 coast, 19 mountain, 30 river, 22 nuclear power plant, 12 flow, 24 outgoing | **2,3,6,12,19,22,24,27,30,32** |
| Albania | 1,2,5,8,27,21 | 5 coal mines, 8 connect, 27 plain | 6 coast, 11 earthquake, 33 temperature, 19 mountain | **1,2,6,11,17,19,21,33** |
| Georgia | 1,7,8,9,10,21,5 | 7 comprise, 8 connect, 10 copy, 21 natural disaster | 4 citrus fruit, 13 golden fleece, 17 mild, 19 mountain, 33 temperature, 6 coast | **1,4,5,6,9,13,17,19,33** |
| UK | 5,6,21,25,27,2 | 5 coal mines, 21 natural disaster, 25 paste, 2 border | 34 underwater, 8 connect, 19 mountain, 30 river, 12 flow, 20 multicultural, 16 landscape | **8,12,16,17,19,20,27,30,34** |

(Treat the suggested sets as the target; trim to whatever count the UI shows, keeping the highest-salience words.)

---

## 6. Regression guard

Add an assertion that runs on the data at build/test time:

1. For every `landmark.word_key` (or `word_id`), the resolved word must exist in `vocabulary_data.json`.
2. Every landmark word must be a member of that story's `vocabulary_ids`/`word_keys` set (a landmark can only teach a word the dossier owns). This single check would have caught all 16 errors.
3. Every resolved word must have a matching audio file present in `assets/audio*`; if `generated: true`, it must resolve in `assets/audio_v2/`.
