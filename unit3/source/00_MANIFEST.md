# Unit 3: Imaginary Creatures — source pack

Built by `_tools/build_source_packs.py` from the three official books. Text is extracted, not rewritten.
Read these files instead of the full books. Everything a unit build needs is here or in the shared files listed below.

## Files

| File | Contents | Characters |
|---|---|---|
| `01_syllabus.txt` | Lessons, skills, functions, structures, project, can-do statements | 5,449 |
| `02_vocabulary_list.txt` | Official word list, 54 lines | 841 |
| `10_SB_unit.txt` | Pupil's Book unit pages | 50,537 |
| `11_SB_its_your_choice.txt` | Differentiated tasks (Appendix I) | 2,648 |
| `12_SB_resource_materials.txt` | Resource materials (Appendix II) | 1,113 |
| `13_SB_grammar_file.txt` | Grammar summary (Appendix III) | 2,108 |
| `20_WB_unit.txt` | Workbook unit pages | 26,513 |
| `30_TB_unit.txt` | Teacher's Book guide, pp.33-43: aims, procedure, **recording scripts**, keys | 33,888 |
| `31_TB_its_your_choice_key.txt` | Keys to Appendix I | 2,063 |
| `32_TB_extra_activities.txt` | Extra activities tagged for this unit | 686 |

## Shared files that apply (in `../../_shared_source/`)

- `TB_revision_test_1-3_*.txt` (revision test covering this unit, with key)
- `WB_review_1-5.txt` and `WB_keys_check_yourself_1-5.txt`
- `TB_00_methodology_and_portfolio_p001-015.txt` (portfolio task for every unit is listed on pp.13-14)
- `SB_appendix_IV_irregular_verbs.txt`, `SB_appendix_VI_maps.txt` if the unit needs them

## Rules for the build agent

- **Recording scripts** are in `30_TB_unit.txt` (search `TAPESCRIPT` / `RECORDING SCRIPT`). Use them verbatim for listening tasks.
- **Where the book contradicts itself** (script vs. key, as in Unit 1 'saving'/'printing'), do not resolve it yourself: it is an `ERRATA.md` item. Ask the teacher (SKILL.md, "Book Errors").
- **Printed errors** in the vocabulary list are flagged in the CHECK section of `02_vocabulary_list.txt`. Each one is an `ERRATA.md` item: the app follows the resolution the teacher approved and shows a "Book check" note, because pupils keep the printed book as their reference. Nothing is corrected silently.
- **Dated or wrong facts** (place names, technology, hazards, anything unsuitable for 11-year-olds) are `ERRATA.md` items too: quote the page, propose keep / annotate / teacher note / replace, and wait for the teacher's decision. Until then the book's text stands.

## Known print errors in this unit's word list (ERRATA candidates, not fixes)

- orge  ->  typo in book: ogre
