# Unit 2 Build Notes: Going Shopping

Written 24 Sep 2026 after the Unit 2 build and verification pass.

## Scope and source

- Unit 2, **Going Shopping**, was built from `unit2/source/` only:
  - `01_syllabus.txt` for lessons, grammar, project and Can-Do statements.
  - `02_vocabulary_list.txt` for the 48 printed vocabulary entries.
  - `10_SB_unit.txt`, `13_SB_grammar_file.txt` and `20_WB_unit.txt` for the Pupil's Book, Grammar File and Workbook.
  - `30_TB_unit.txt` for the verbatim recording scripts and Teacher's Book keys.
- The reusable shell at `.agents/skills/coursebook-unit-extender/templates/unit_shell/` is the code source. Unit 1 content was not used as a template.
- The app is local-first: all runtime data, fonts, SVGs and audio are inside the Unit 2 or shared offline folders. No runtime external network request is required.

## Deliberate departures and adaptations

| Area | Book/source | App decision | Reason |
|---|---|---|---|
| Vocabulary corrections | Appendix V prints `pair of snickers`, `unit pice` and `woolen` | The 48 printed forms remain in the vocabulary headword list; each carries `pending_errata` and an E1-E3 note | No teacher approval was given, so the book remains recognizable and no silent correction was made. |
| Vocabulary definitions | The official list gives headwords only | 48 short, A2-readable English definitions, examples, IPA and Greek meanings were authored for the app; both data twins are synchronized | The defining-vocabulary checker is the app quality gate. Greek meanings and all examples still need teacher review. |
| Dossiers | The source provides separate unit sections, but not reusable modern dossier prose | Three original short reading profiles were written for a supermarket flyer, a department-store choice and a safe toy order | The companion adds a navigable, data-driven modern reading layer without presenting invented prose as book text. Each dossier binds only vocabulary that appears in its narrative. |
| Story artwork | The printed book contains protected illustrations | Three original flat SVGs were created for the three dossier scenes; no book illustration was reproduced | Rights-safe and offline. |
| Listening scripts | `30_TB_unit.txt` contains TAPESCRIPTS | The supermarket, department-store and Father's Day dialogue text was transcribed into the data and voiced from that text | Authentic script wording is retained, including extracted punctuation and formatting such as `$12, 00.`, `honey?` and `Umm...`. No conversational rewrite was made. |
| Listening structure | The Teacher's Book also supplies keys and comprehension material | The app adds true/false checks and pupil-project/target-verb panels around the scripts | The shell provides a useful interactive layer while the recording text remains the source of truth. |
| Grammar | The syllabus specifies countable/uncountable nouns, `a/an`, `some/any`, `a few/few`, `a little/little`, `how much/how many`, senses and adjective order | The Grammar Lab follows those target structures in the book order and adds the order-form calculation used by the online-order project | No unlisted grammar system was introduced. Practice explanations are local deterministic text, not AI output. |
| Workbook answers | The Teacher's Book key is incomplete, extracted or internally inconsistent in places | Closed activities use the extracted key where usable; pending contradictions accept the extracted form and the contextually plausible alternative without claiming that the teacher has approved it | Pupils copying the printed book are not marked wrong while E4, E7, E8, E9 and related decisions remain open. |
| Workbook open tasks | Printed answers are free responses or source OCR is incomplete | Open activities have checklists, word banks, sentence starters and one model text; `getHint()` returns `null` | Scaffolding stays deterministic, printable and offline. No AI or network call is involved. |
| Internet-site project | The source refers to a printed toy webpage, but the extracted pack does not contain its item names, prices or assembly-piece count | The app presents a safe, blank practice order and does not invent those values; it explicitly says not to submit a real order | Prevents false content and follows the Teacher's Book warning to involve parents. |
| Space shuttle | The source uses a space-shuttle toy in an online shop | The app presents it as a toy, not a current space programme, and notes that the last shuttle flight was in 2011 | Factual and age-appropriate context. |
| Fruit flans | The Teacher's Book identifies fruit flans as a good visual-gloss example | `image_prompt` is stored, but no vocabulary image ships until the teacher selects and reviews one | The visual-gloss route is teacher-selected. |
| Alcohol examples | The source includes `cider` in a birthday list and `beer` in a grammar exercise | Printed occurrences remain in the Workbook and are marked with pending suitability notes; the app does not recommend them to pupils | E5 and E10 await a teacher decision. |
| Runtime audio | Earlier units may contain composite full readings | Unit 2 uses separate word, definition and example clips in Google and neural voice sets; the UI queues the three parts with the shared 350 ms pause | Prevents stale composite recordings and matches the shared shell contract. |
| Catalog | Unit 2 was planned in the central catalog | `data/coursebook_catalog.json` and its JS twin now mark Unit 2 ready and link both apps | The central offline hub can open the finished unit. |

## Audio record

- Vocabulary: 48 entries x 3 parts x 2 voice sets = **288 MP3 clips**, all with matching `.txt` sidecars:
  - `assets/audio/`
  - `assets/audio_neural/`
- Companion recordings:
  - `assets/audio_v2/stories/ffm_flyer_full_story.mp3`
  - `assets/audio_v2/stories/mall_choice_full_story.mp3`
  - `assets/audio_v2/stories/online_order_full_story.mp3`
  - `assets/audio_v2/grammar/supermarket_strawberries.mp3`
  - `assets/audio_v2/grammar/department_store.mp3`
  - `assets/audio_v2/grammar/fathers_day_breakfast.mp3`
- All story/dialogue helper text files and sidecars are in `unit2/data/` and the corresponding audio folders.
- The dialogue generator was run sequentially because its shared temporary merge folder is not safe for parallel processes.

## Visual record

- Shipped original SVGs:
  - `assets/images_v2/ffm_flyer.svg`
  - `assets/images_v2/mall_choice.svg`
  - `assets/images_v2/online_order.svg`
- No candidate or inspection image is inside the Unit 2 folder.
- No visual gloss was selected for a vocabulary headword. The `fruit flans` `image_prompt` is an open teacher decision, not an unfinished generated asset.

## Workbook record

The module contains all 18 source activities in printed order: opening page, A1-A7, B1-B8, C and D.

- Closed activities use sets or `key_answer` data and normalized checking.
- Semi-open activities provide model answers or deterministic local checks.
- Open activities provide checklist reminders, word banks, starters and model text only.
- The app does not store pupil text and does not transmit it.
- A3 preserves the Teacher's Book matching key, including `a dozen of eggs` and `a can of cider`, with the suitability/grammar issues recorded in ERRATA.
- A4 accepts the extracted key forms and the printed `mince` spelling pending review.
- A6 accepts the extracted repeated `d` and the contextually likely `c` for blank 6 pending E7.
- A7 uses the printed e-mail and records the key mismatch (E8).
- B1 records the extracted/contextual answer conflict (E9) rather than silently rewriting it.
- B4 preserves the printed `beer` item and records E10.
- C labels the incomplete Greek-sign extraction and uses only the Teacher's Book key meanings.
- D scaffolds the birthday-party shopping-list portfolio task without presenting alcohol as a required treat.

## Greek, mediation and source-grounding audit fixes (24 Sep 2026)

Four parallel research audits (vocabulary IDs 1-24, IDs 25-48, companion/Workbook wording, source grounding) found app-authored errors; all confirmed items below were fixed. Printed book forms and verbatim scripts were preserved wherever an ERRATA decision is still pending.

- Greek glosses corrected: beef accent (`βόειο`), catwalk (`πασαρέλα`), cute (`χαριτωμένος, γλυκός`), dairy (added shop sense `γαλακτοπωλείο`), delicious (dropped false superlative), department store (`πολυκατάστημα`), elegant (dropped `κοσμίος`), fashion model (`μοντέλο`), flavour (dropped `άρωμα`), flyer (`φυλλάδιο`), fruit flans (`τάρτα φρούτων`), lamb ribs (`αρνίσια παϊδάκια`), muffins accent (`μάφιν`), pastry (`ζύμη, γλυκό`), pork chops (`χοιρινές μπριζόλες`), poultry (`πουλερικά`), space shuttle gender (`διαστημικό`), suit narrowed to the verb sense (`ταιριάζει`), tempting (`δελεαστικός, ελκυστικός`), track suit (`αθλητική φόρμα`), treat (`κέρασμα, λιχουδιά`), woolen (`μάλλινος`).
- E1 (`pair of snickers`): the printed headword is kept, but the app gloss no longer teaches the false chocolate-bar reading; it now uses the intended shoe sense (`sports-shoe` gloss, shoe example). Full headword replacement still needs teacher approval.
- E2 (`unit pice`): the printed headword is kept; the pupil example now uses price wording instead of repeating the typo.
- Mall story rewritten against the fashion-show table and listening facts: jeans instead of jacket, table adjectives (`baggy`, `tight`, `loose`), `silk`/`skirt`/`track suit` as table items, `woolen`/`woollen` spelling note, receipts as pre-listening material, black shirt rejected for colour/price, green T-shirt chosen for feel and jacket match. Removed: silk scarf, woolen hat, per-item prices, receipt subtotal/total, seller-shoes line, too-tight black shirt. `subtotal`/`total` ownership moved fully to the online-order story.
- FFM story (restored per teacher request): the app-written paraphrase was replaced with the Pupil's Book flyer paragraphs A-C verbatim (`10_SB_unit.txt` L82-93; only print hyphenation normalized). Its landmarks and word ownership were rebound to words actually in the flyer (`pastry`, `beef`, `organic products`); `bakery`, `budget` and `flyer` ownership moved out since those words are not in the flyer text. The recording was re-voiced from the restored text.
- Online story: budget reframed as explicit teacher scaffolding, not a printed order-form field.
- Breakfast recording: added the father's verbatim closing line (`Sniff, sniff! Mmm! Coffee? It smells nice!`) with a male voice; regenerated.
- Workbook: B4 item 10 key corrected to `many` per the Teacher's Book key; B1 blank 6 stem corrected to the printed dialogue; A6 gained full dialogue context and blank 6 moved to the customer turn; A4 split into one gap per blank; B7 converted to visible choose-the-correction rows with the supplied example labelled; B8 model speaker fixed; A3 instruction trimmed of the invented key clause; opening-page schema cleaned.
- E11 added: the script's printed `$12, 00.` is kept verbatim pending teacher approval.
- Audio regenerated for every changed text: vocabulary IDs 27/47, all three story narrations, and the breakfast dialogue. Definition/example wording for ID 27 was adjusted twice to stay inside the CEFR checker word lists.

## For the teacher to check

1. Decide all ERRATA items E1-E11 in `unit2/ERRATA.md`; no approval has been assumed.
2. Review all 48 `meaning_gr` values and the app-authored English definitions/examples.
3. Decide whether to replace, annotate or retain the alcohol examples in the Workbook.
4. Decide whether to ship a visual gloss for `fruit flans` and approve its wording/licence/source.
5. Supply or approve the missing Internet-site item names, prices and assembly-piece count if the original webpage should be reconstructed rather than left as a safe blank model.
6. Confirm the currency handling: the verbatim department-store recording uses dollars, while the book context and examples use pounds/euros; no conversion was made.
7. Spot-check the neural recordings with headphones, especially the long department-store dialogue.

## Verification results

Run from `unit2/` on 24 Sep 2026:

- `node test_v2.js`: **1,135 passed, 0 failed** (count shifted after `subtotal`/`total` left mall-story ownership and the FFM story was rebound to flyer-text words).
- `node verify_offline.js`: **41 passed, 0 failed**.
- `node ../.agents/skills/coursebook-unit-extender/templates/test_unit.template.js 2`: **110 passed, 0 failed**.
- `node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab data/vocabulary_data.json --set both --check`: **all 288 clips and sidecars clean**.
- `python3 ../_tools/check_definitions.py unit2`: **48/48 clean**, average 6.8 words, 0 hard/long/circular/target-word violations.
- `python3 ../_tools/check_definitions.py unit2 --field example`: **48/48 clean**, average 6.0 words.
- `node --check app.js`, `node --check app_v2.js`, `node --check verify_offline.js`: passed.
- Offline Chrome smoke test for `index.html`: 48 rows, 6 vocabulary modes, no page errors.
- Offline Chrome smoke test for `v2.html`: 9 non-empty tabs, no page errors; Chrome emitted only background GCM registration diagnostics.

## Proposed skill changes

1. Add a standard post-build checklist item to compare every extracted Teacher's Book key against the printed Workbook dialogue, even when the app has a fallback accepted-answer set.
2. Add a standard “source image absent from extraction” teacher-note pattern, so a missing image is not mistaken for permission to invent content.
3. Keep the separate `tests/test_v<N>.js` and shared-template split: the Unit 2-specific suite checked content ownership, exact word order and pending errata; the shared template checked common shell, twin, offline and Workbook invariants.
4. Add an automated browser-smoke command to the shared workflow for both `file://` apps, including all companion tabs and local image completion.
