# Unit 1 v2 — Final Fix Goal (apply all)
Complete, self-contained instruction set for the build agent. This single document supersedes the earlier `v2_review_dossiers.md` and `v2_review_part2.md`; everything from both is folded in here. Apply every item, then verify with §K.

**Source of truth:** `data/` holds paired `.json` and `.js` files (`unit1_v2_data.*`, `coursebook_catalog.*`), and the `.js` copies are currently newer. Apply each fix to whichever file the app actually loads, then regenerate its twin so the two never diverge. Do not hand-edit one and leave the other stale.

**Priority (if you run low on context, do it in this order):**
1. **Must-fix — teach something false:** A (vocabulary bindings), B (frequency example), C (lab listening activity), D (crossword + SOUTH clue).
2. **Modernization:** E (romanization), G (Chernobyl wording), H (Albania tsunami teacher note).
3. **Polish:** F (collocation), I (catalog), J (narrative refinements). Then run K (regression checks).

Severity tags inline: **[HARD]** false content · **[MOD]** modernization · **[SOFT]** polish.

---

## A. Dossier vocabulary bindings (data/unit1_v2_data.json → stories[])

Two structural fixes, then the exact values.

**A1. Bind the pill per landmark, semantically — not by landmark `type`.** The current `type → word_id` mapping is wrong and reused across all four countries. Set each landmark's word to the vocabulary item it actually depicts.

**A2. Replace the integer `word_id` with a stable string key** (e.g. `"word_key": "coast"`) resolved against `vocabulary_data.json` by word. Integer list-indices are why this scrambled; a reorder of the vocab file must not re-corrupt bindings. Keep the integer only as a fallback if the loader needs it. The pill's audio must resolve from the same key, so label and sound always agree.

**A3. Corrected landmark words** (id → word in vocabulary_data.json):

- **Ukraine:** Odessa & Black Sea Coast → `coast` (6) · The Carpathian Mountains → `mountain` (19) · River Dnipro → `split in` (32) *(preferred, matches "dividing the country"; else `river` 30)* · Chernobyl & Polesie Region → `nuclear power plant` (22)
- **Albania:** Tirana → **no pill** (see A5) · Adriatic & Ionian Coastline → `coast` (6) · Balkan Mountains & Forests → `mountain` (19) · Mother Teresa Memorial → **no pill** (never `ancient`; she is a 20th-century figure)
- **Georgia:** Batumi & Black Sea Coast → `coast` (6) *(or `citrus fruit` 4)* · The Caucasus Peaks → `mountain` (19) · T'bilisi Old Town → `ancient` (1) · Colchis Lowlands → `golden fleece` (13)
- **UK:** River Thames & London → `river` (30) · Channel Tunnel → `underwater` (34) *(or `connect` 8)* · Scottish Highlands & Welsh Peaks → `mountain` (19) · English Rolling Plains → `plain` (27)

**A4. Corrected per-story `vocabulary_ids`** (were leaking words from other dossiers). Use these sets:
- Ukraine: `2,3,6,12,19,22,24,27,30,32`
- Albania: `1,2,6,11,17,19,21,33`
- Georgia: `1,4,5,6,9,13,17,19,33`
- UK: `8,12,16,17,19,20,27,30,34`

**A5. Landmarks with no core-vocabulary match** (Tirana/Capital, Mother Teresa/Culture): render the card with no audio vocab pill when its `word_key` is null. Do not force an unrelated word onto them.

All A3 words already exist in the 35-word set, so their MP3s are already in `assets/audio*`. No new audio needed for these.

---

## B. Grammar Lab — fix the "Never" frequency example
In `grammar_lab.frequency_spectrum`, the "Never" row currently reads *"Ukraine never borders the Aegean Sea."* This misuses a frequency adverb on a permanent fact. Replace with a repeatable action:
`{ "adverb": "Never", "percent": 0, "example": "It never snows in the Sahara Desert." }`

---

## C. School Computer Lab — rebuild as the authentic LISTENING activity
This is a **listening task** in the coursebook (Lesson 2, "At the School Lab"): pupils hear a short classroom dialogue, fill a Pupil/Subject table, then judge true/false statements. Gemini's version invented free-standing sentences (Sophia "writing code", added a non-book pupil "Alex") and lost the listening structure and the verbs `print`/`copy`. Rebuild it from the verbatim teacher's-book source below.

**C1. Verbatim recording script** (Teacher's Book, Lesson 2 — this is the audio to voice/generate):
> **Teacher:** Good, you all look very busy today! Maria, what are you doing?
> **Maria:** I'm working on a project on music. I am searching for some information on traditional musical instruments of Greece.
> **Teacher:** And you, Markos?
> **Markos:** Well, I'm doing a Geography project on India. I'm printing some photos of New Delhi, the capital. Look! Here's a good one of the Taj Mahal, the landmark of New Delhi. I can copy it and paste it in my document.
> **Teacher:** What are you doing, girls?
> **Anne:** We are doing a Science project on molecular structure. Look at these molecules. They are moving around.
> **Sophia:** Oh yes! They look so spectacular! I am printing the picture to use it in our project!
> **Teacher:** Good work, girls!

Between search, print, copy, paste this script carries all four core computer verbs.

**Source correction to apply:** the printed teacher's book is internally inconsistent — the recording script says Markos "I'm **saving** some photos", but its own answer key (item 2) corrects a statement with "he is **printing** some photos". The app has no `save` vocab item, and the answer key uses `print`, so **resolve to "printing"** (as written in the script above). Document this as a deliberate fix.

**C2. Table key** ("Who is working on what?"):
- Maria → a **music** project
- Markos → a **geography** project about India
- Anne & Sophia → a **science** project about molecular structure

**C3. True/False listening check** (statements pupils tick against what they hear; keep as the comprehension step):
1. Maria is searching for information on musical instruments. → **TRUE**
2. Markos is searching for photos of New Delhi. → **FALSE** (he is printing them)
3. Markos is copying a photo of the Taj Mahal. → **TRUE**
4. Sophia is printing a text for the science project. → **FALSE** (she is printing a *picture*, not a text)
5. Anne is pasting a photo of molecular structure. → **FALSE** (Markos does the pasting; Anne is observing molecules)

Keep it a listening activity (play script → fill table → tick statements). Surface modernization is fine; do not alter who does what or drop any of the four verbs.

**C4. Additional teacher-book material available for enrichment** (optional, from the same lesson): background notes on India and the Taj Mahal (usable as a "Did you know?" on Markos's card), and a **Charades** Present-Continuous game (one pupil mimes, the group asks "Are you …?" / "Yes, I am / No, I'm not") — a ready-made interactive for the Grammar Lab. Say the word if you want these written up as their own module items.

---

## D. Crossword — remove it, or convert to "Guess the word from its definition"
The `crossword` object has no grid geometry and cannot render as a real interlocking crossword. Do **not** attempt to build a crossword grid. Choose one:
- **Preferred:** convert it to a *Guess the word from its definition* activity. Reuse the existing 12 clues as the definitions and the existing answers as the words to guess (student reads/hears the definition, types or selects the word). Keep the audio-hint hook.
- **Or:** remove the crossword feature entirely.
Either way, also fix the wrong clue before reuse: `SOUTH` currently reads *"pointing toward the equator"* → change to *"The compass direction opposite of North."*

---

## E. Romanization — modern, most-accepted forms
Apply in both narrative text and the structured fields (`capital`, `hometown`) and in landmark names. Ukraine spellings are sensitive; use the most widely accepted form:
- **Kiev → Kyiv** (narrative + `capital`)
- **Odessa → Odesa** (narrative + `hometown` + landmark name "Odessa & Black Sea Coast" → "Odesa & Black Sea Coast")
- **Chernobyl: keep as "Chernobyl"** — it is the most globally accepted name for the site/event. (The Ukrainian form "Chornobyl" is not yet as widely recognized; do not change unless instructed.)
- **T'bilisi → Tbilisi** (narrative + `capital`) — drop the scholarly apostrophe.

---

## F. Collocations — minor consistency
`collocations` "search for" entry: `partner` is `"online information"` but the example says "information". Align them (set `partner` to `"information"`, or add "online" to the example sentence).

---

## G. Chernobyl card — factual/register wording
After setting its pill to `nuclear power plant`, revise the desc *"Historic nuclear power plant site, driving modern green transition."* to something factual and age-appropriate for 11–12s, e.g.: *"Site of a serious nuclear accident in 1986; the surrounding zone is now a wildlife reserve."*

---

## H. Albania "tsunami" — add a teacher note (do not change the pupil's book)
The original coursebook states that Albania "often" has earthquakes **or tsunamis** along its south coast (Lesson 1 quiz item 4 and the Albania text). This is inaccurate: Albania is genuinely earthquake-prone (e.g. the 2019 Durrës M6.4 quake), but damaging tsunamis in the Adriatic/Ionian are rare and not a frequent hazard. The word "often ... tsunamis" overstates the risk.

Add a **teacher note** (in the teacher-facing guidance / teacher's-book layer of v2 — create the section if none exists) reading approximately:
> Fact-check: The 2006 coursebook lists tsunamis alongside earthquakes as a frequent problem on Albania's south coast. Earthquakes are a real and frequent hazard in Albania and Greece; damaging tsunamis in the Adriatic and Ionian Seas are rare. Use this as a short critical-thinking moment: ask pupils which of the two is the everyday risk here, and why a 20-year-old textbook fact is worth checking.

Keep this teacher-only; the pupil-facing v2 narrative already omits the tsunami claim, which is correct.

---

## I. Catalog — verify Units 2–10 (teacher action, not a build fix)
`coursebook_catalog.json` unit titles and `grammar` fields for Units 2–10 were generated, not confirmed. Flag for the teacher to check against the physical book before those units drive real builds. Ensure `planned` cards render without dead `v1_url`/`v2_url` links.

---

## J. Minor narrative refinements (optional, [SOFT])
- **Ukraine narrative:** "Summers are warm across the greater part of the country and cool along the Black Sea." The Black Sea coast (Odesa) has warm summers, so "cool along the Black Sea" is wrong. Change to "…and pleasantly mild along the Black Sea coast," or drop the clause.
- **UK narrative:** "the North Sea … separates us from mainland Europe." Leave as-is — this is faithful to the original coursebook wording. (Precise geography would credit the English Channel in the south, but fidelity to the book wins here. No change.)
- **True/False item 1:** "Ukraine is the second largest country in Europe (TRUE)" is consistent with the narrative and fine. Only if you want the sharper formulation, change both the item and the narrative to "the largest country lying entirely within Europe." Otherwise leave.
- **Guess-the-word answers (from §D):** several answers (FORESTS, EAST, WEST, NORTH, SOUTH, LANDFORMS, CAPITAL) are geography terms outside the 35-word core set. Label the activity "geography terms," not "unit vocabulary," so it isn't mistaken for a core-vocab review.

---

## K. Regression checks to add
1. Every landmark `word_key`/`word_id` resolves in `vocabulary_data.json`, and is a member of that story's `vocabulary_ids`. (Would have caught all 16 binding errors.)
2. Every `frequency_spectrum` and lab-activity example is a repeatable action, not a stative fact (heuristic: lexical action verb, not "border/be").
3. The four computer-lab verbs `search, print, copy, paste` each appear at least once in the lab activity.
4. Every resolved vocab word has a matching audio file in `assets/audio*` (or `assets/audio_v2*` if `generated: true`).
5. `.json` and `.js` twins are byte-consistent after the build step.
