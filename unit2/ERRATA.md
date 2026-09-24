# Unit 2 Errata: Going Shopping

Pre-seeded by the reviewer on 22 Sep 2026 from the source pack, before the build. Every item is
**pending**: the build agent asks the teacher about each one (SKILL.md, "Book Errors") and changes
the status only on the teacher's answer. Until then the book's text stands in the app.

Books: **SB** = Pupil's Book, **WB** = Workbook, **TB** = Teacher's Book. Pages are PDF pages as
printed in the source-pack headers; TB references are line numbers in `30_TB_unit.txt`.

| ID | Book, page | Source file | Book says | Problem | Proposed resolution | Pupil annotation ("Book check") | Status |
|---|---|---|---|---|---|---|---|
| E1 | SB Appendix V word list; SB p.38 (PDF), writing task | `02_vocabulary_list.txt`, `10_SB_unit.txt` L476 | "a pair of snickers" | typo: *sneakers*. Snickers is a chocolate bar, and the same list of things to describe includes a dessert, so pupils may read it as the sweet | annotate: vocabulary card shows *a pair of sneakers* with a note | "Your book says *snickers*. The word is *sneakers*: sports shoes. Snickers is a chocolate bar!" | pending |
| E2 | SB Appendix V word list | `02_vocabulary_list.txt` | "unit pice" | typo: *unit price*. The unit page itself (SB p.39) prints "Unit Price" correctly, so only the list is wrong | replace in the vocabulary app, with a short note on the card | "Your book's word list says *unit pice*. The word is *unit price*." | pending |
| E3 | SB Appendix V word list | `02_vocabulary_list.txt` | "woolen" | US spelling in a British-English book; the unit page (SB p.38) prints "woollen" | replace with *woollen*; note optional | "Your word list says *woolen* (American spelling). In British English: *woollen*." | pending |
| E4 | SB p.32 shopping list; WB p.17 matching; WB p.20 dialogue; TB key | `10_SB_unit.txt` L143, `20_WB_unit.txt` L93, L246, `30_TB_unit.txt` L723 | "a dozen of eggs" | grammar: *a dozen eggs*. "A dozen of" is used only before a determiner ("a dozen of the eggs"). This sits inside the partitives lesson, so the book teaches the wrong form | annotate on every occurrence; Workbook checker **accepts both** "a dozen eggs" and the book's "a dozen of eggs" so a pupil copying the book is not marked wrong | "Your book says *a dozen of eggs*. We say *a dozen eggs*." | pending |
| E5 | SB p.32 "Mary's shopping list for her birthday party"; TB | `10_SB_unit.txt` L140, `30_TB_unit.txt` L280, L724 | "20 cans of cider" | suitability: an alcoholic drink, in quantity, on a child's birthday-party list | teacher's choice: keep; teacher note only; or replace in the app with a soft drink (e.g. *lemonade*) with a Book check note. The WB p.17 matching item "a can of / cider" is a language exercise and could stay | if replaced: "Your book says *cider*. Cider has alcohol, so our party list has lemonade." | pending |
| E6 | SB p.38 model poem, writing task | `10_SB_unit.txt` ~L480 | "Off the oven, it looks fresh and smells nice" | non-standard English: *Out of the oven* / *Fresh from the oven*. It is the model pupils imitate | annotate beside the model poem | "Your book says *Off the oven*. We say *Out of the oven*." | pending |

## Notes for the build agent

- **space shuttle** (word list; SB p.39, a toy in an online shop) is not an error: it is a toy.
  The *definition* must not present the Space Shuttle as current: the last flight was in 2011.
- **fruit flans** is on the list: the teacher uses it as his example of a word best glossed by a
  picture. Offer it for a visual gloss.
- "2 pounds of pork chops" (SB p.32) sits beside "£1 = 100p" on the same page: *pound* as weight
  and as money. Not an error, but worth a teacher note.
