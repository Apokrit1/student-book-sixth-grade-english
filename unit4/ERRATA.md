# Unit 4 Errata: The History of the Aeroplane

Pre-seeded for Unit 4 from the source pack, before the build. Every item is
documented with its pedagogical resolution. Until the teacher directs otherwise, the book's text stands in the pupil narrative with transparent "Book check" annotations.

Books: **SB** = Pupil's Book, **WB** = Workbook, **TB** = Teacher's Book. Pages are printed book pages (with PDF page in brackets); TB references are line numbers in `30_TB_unit.txt`.

| ID | Book, page | Source file | Book says | Problem | Proposed resolution | Pupil annotation ("Book check") | Status |
|---|---|---|---|---|---|---|---|
| E1 | SB Appendix V word list | `02_vocabulary_list.txt` L8, L49 | "airhostess" | Dated gendered term; modern aviation standard is *flight attendant* or *cabin crew* | annotate: card shows headword with modern usage note | "Your book uses *airhostess*. Today, airlines usually say *flight attendant* or *cabin crew*." | approved |
| E2 | SB p.38 (PDF p.55) | `10_SB_unit.txt` L80, L102 | "Fleet Air Museum" (Q1) / "Fleet Arm Museum" (email) | Inconsistent museum name in coursebook; actual institution is the *Fleet Air Arm Museum* at RNAS Yeovilton (TB p.46 confirms) | annotate: preserve email text verbatim, add Book Check note | "Your book mentions 'Fleet Air Museum' and 'Fleet Arm Museum'. The official name is the Fleet Air Arm Museum near Yeovilton." | approved |
| E3 | SB p.43 (PDF p.60) | `10_SB_unit.txt` L389, L400 | "These planes can fly up to five times the speed of sound... The Concorde" | Concorde flew at Mach 2.04 (~1,354 MPH, twice the speed of sound), not Mach 5 (hypersonic / 3,500 MPH) | annotate: keep student text verbatim; show clear Book Check note | "Your book says: 'five times the speed of sound'. In fact, Concorde flew at about twice the speed of sound." | approved |
| E4 | SB p.45 (PDF p.62) vs TB p.50 | `10_SB_unit.txt` L520, `30_TB_unit.txt` L622 | "Born in Kiev, Ukraine" (SB) vs "He was born in Kiev, Russia" (TB key) | In 1889 Kyiv was in the Russian Empire, but it is the capital of Ukraine. SB text is historically respectful | keep SB text ("Born in Kiev, Ukraine") in biography workshop; note in teacher notes | "Born in Kyiv, Ukraine (which was part of the Russian Empire in 1889)." | approved |
| E5 | SB p.47 (PDF p.64), Ex. B | `10_SB_unit.txt` L639 | "two French bothers who (invent)" | Typo in coursebook: *bothers* instead of *brothers* | annotate in exercise: show *bothers [brothers]* | "Your book prints 'bothers'. The word is 'brothers'." | approved |
| E6 | WB p.26 (PDF p.33), Down 3 | `20_WB_unit.txt` L58 | "A Concorde flies 5 times up the ................ of sound." | Grammatical awkwardness ("5 times up the...") and repeats the Concorde Mach 5 error | keep clue for crossword answer *speed*; annotate | "Your book says '5 times up the speed of sound'. In fact, Concorde flew at about twice the speed of sound." | approved |
| E7 | TB p.51 key to WB Ex. 3 | `30_TB_unit.txt` L735 | "7. landing gea" | Typo in Teacher's Book answer key: missing terminal 'r' | fix key to *landing gear* in accepted answer set | N/A (Teacher's Book key typo) | approved |

## Notes for the build agent

- **Student Narrative Verbatim Rule**: Pupils follow along in their printed books. Reading texts (the Wright Brothers story, the Fleet Air Arm email, the Air-Pocket dialogue, the Brueghel poem, the Montgolfier brothers passage) MUST match the printed page verbatim (A1/A2 level). Never rewrite into adult/C1 prose.
- **Audio Architecture**: Three clips per vocabulary item (`word`, `def`, `example`), NEVER a composite 4th clip. Story & dialogue audio with matching `.txt` veracity sidecars.
- **Workbook Scaffolding**: Activities of type `open` must include a `checklist` array.
