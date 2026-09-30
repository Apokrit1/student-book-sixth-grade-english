# Unit 6 Errata: Me, Myself and My Future Job

Pre-seeded for Unit 6 from the source pack, before the build. Every item is
documented with its pedagogical resolution. Until the teacher directs otherwise, the book's text stands in the pupil narrative with transparent "Book check" annotations.

Books: **SB** = Pupil's Book, **WB** = Workbook, **TB** = Teacher's Book. Pages are printed book pages (with PDF page in brackets); TB references are line numbers in `30_TB_unit.txt`.

| ID | Book, page | Source file | Book says | Problem | Proposed resolution | Pupil annotation ("Book check") | Status |
|---|---|---|---|---|---|---|---|
| E1 | SB Appendix V word list | `02_vocabulary_list.txt` L18-19 | "cheerfulhome" / "economics" | Two distinct vocabulary items accidentally merged in print: *cheerful* (adj) and *home economics* (n) | Separate into two distinct entries: *cheerful* and *home economics* | "Your book prints 'cheerfulhome' and 'economics'. These are two separate words: *cheerful* and *home economics*." | approved |
| E2 | SB Appendix V word list | `02_vocabulary_list.txt` L35 | "hair dresser" | Spaced spelling in print list | Standard British spelling *hairdresser* used (accepting both) | "Both *hairdresser* and *hair dresser* are accepted." | approved |
| E3 | SB Appendix V word list | `02_vocabulary_list.txt` L38 | "jwellery designer" | Misspelling in coursebook Appendix V: missing 'e' in *jewellery* | Correct spelling *jewellery designer* provided with note | "Your book prints 'jwellery designer'. The correct spelling is *jewellery designer*." | approved |
| E4 | SB Appendix V word list | `02_vocabulary_list.txt` L73 | "weather forecaste" | Typo in coursebook Appendix V: extra 'e' / missing 'r' | Correct noun *weather forecaster* (person) | "Your book prints 'weather forecaste'. The person's profession is *weather forecaster*." | approved |
| E5 | SB p.63 (PDF p.80) | `10_SB_unit.txt` L129 | "air traffic controller... co-ordinate" | Hyphenated spelling *co-ordination* / *co-ordinate* | Accept both *coordination* and *co-ordination* | "Both *coordination* and *co-ordination* are standard." | approved |

## Notes for the build agent

- **Student Narrative Verbatim Rule**: Reading texts (Career Day Thessaloniki profiles: Jewellery Designer, Air Traffic Controller, Home Health Nurse, Hairdresser, Ecologist) MUST match the printed page verbatim (A1/A2 level).
- **Audio Architecture**: Three clips per vocabulary item (`word`, `def`, `example`), NEVER a composite 4th clip. Story & dialogue audio with matching `.txt` veracity sidecars.
- **Workbook Scaffolding**: Activities of type `open` must include a `checklist` array.
