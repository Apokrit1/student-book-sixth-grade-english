# Unit 5 Errata: Travelling Through Time

Pre-seeded for Unit 5 from the source pack, before the build. Every item is
documented with its pedagogical resolution. Until the teacher directs otherwise, the book's text stands in the pupil narrative with transparent "Book check" annotations.

Books: **SB** = Pupil's Book, **WB** = Workbook, **TB** = Teacher's Book. Pages are printed book pages (with PDF page in brackets); TB references are line numbers in `30_TB_unit.txt`.

| ID | Book, page | Source file | Book says | Problem | Proposed resolution | Pupil annotation ("Book check") | Status |
|---|---|---|---|---|---|---|---|
| E1 | SB Appendix V word list | `02_vocabulary_list.txt` L13-14 | "bell bottomed" / "pants" | Line wrap in printed Appendix V splitting the entry across two lines | Merge as single lexical item: *bell-bottomed pants* | "Your book prints 'bell bottomed' and 'pants' on separate lines. The single phrase is 'bell-bottomed pants'." | approved |
| E2 | SB Appendix V word list | `02_vocabulary_list.txt` L44 | "pony tail" | Two-word spelling in print list | App recognizes standard compound *ponytail* (and accepts both) | "Both *ponytail* and *pony tail* are accepted." | approved |
| E3 | TB p.51 (PDF p.56) | `30_TB_unit.txt` L323 | "Convent Garden" | Typo in Teacher's Book script for *Covent Garden* | Keep standard *Covent Garden* | "The historic market and Tube station are named Covent Garden." | approved |
| E4 | SB p.53 (PDF p.70) | `10_SB_unit.txt` L324 | Song "Yesterday" by The Beatles | Song lyrics in printed coursebook | Educational pedagogical activities: focus on 1960s culture, past habits with *used to*, and mood reflection | "Play the song 'Yesterday' from a licensed classroom source." | approved |
| E5 | WB p.36 (PDF p.43) Ex. 4 | `20_WB_unit.txt` L121 | "Don't lean ___________" | Sign prompt from train/bus rules | Accepted answer: "against the door" or "out of the window" | "Signs on trains: 'Don't lean against the door' or 'Do not lean out of the window'." | approved |

## Notes for the build agent

- **Student Narrative Verbatim Rule**: Pupils follow along in their printed books. Reading texts (Anastasia's grandmother's diary, the Omnibus rules, Joe's letter about the London Transport Museum) MUST match the printed page verbatim (A1/A2 level).
- **Audio Architecture**: Three clips per vocabulary item (`word`, `def`, `example`), NEVER a composite 4th clip. Story & dialogue audio with matching `.txt` veracity sidecars.
- **Workbook Scaffolding**: Activities of type `open` must include a `checklist` array.
