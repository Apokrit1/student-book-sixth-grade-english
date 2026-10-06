# Fix-It Report: Unit 1, "Our Multicultural Class"
Site: sixthgrade-english-buddy.lovable.app
Checked: 5 Oct 2026

## Scope and limits of this audit

I read the published pages as text: the hub (`/site/portal.html`), Unit 1 V2 (`/site/unit1/v2.html`), Unit 1 V1 (`/site/unit1/index.html`), the Photodentro quiz (`/site/unit1/photodentro/index.html`) and its credits page, and the vocabulary script (`/site/unit1/vocabulary_unit1_tts.txt`).

I could NOT click, hear audio, or run the scripts. Most of Unit 1's content (listening True/False items, Mr. Badluck, collocations, crossword, Challenge Arena, charades cards, vocabulary table) is built by JavaScript and did not appear in the page text. Your Lovable project was not reachable from my connector, so I could not read the source either.

So the findings below are split:
- **Confirmed**: visible in the page text or the vocabulary file.
- **Verify in browser**: suspected from what the page text shows or omits. Section 3 is a click-through checklist.

---

## 1. Pedagogical inconsistencies (confirmed)

| # | Where | Problem | Fix |
|---|---|---|---|
| P1 | Vocabulary file, item 1 "ancient" | Definition ends "...and no longer in existence", but the example is "The Parthenon is a famous ancient monument in Athens". The Parthenon exists. The V1 flashcard shows a different, shorter definition ("belonging to the distant past") and a different example ("The Parthenon is an ancient monument"). | Use one definition and one example everywhere. Drop "no longer in existence". Re-render the MP3s if they were generated from the longer text. |
| P2 | V1 Definition Challenge and card definitions | English definitions are harder than the words: "thermal power station in which the heat source is a nuclear reactor", "adverse event resulting from natural processes of the Earth", "large natural elevation of the earth's surface rising abruptly", "pulpy flesh". A2 pupils cannot use these to learn the word, and the "match the definition" game becomes a reading test. | Rewrite definitions at A1/A2 level using common words. Rule: definition vocabulary must be easier than the target word. |
| P3 | Item 29 "race" | One definition joins two unrelated senses ("a group of people sharing ethnic heritage, or a running competition"). The example only shows the people sense. In a multiple-choice game this is ambiguous. | Split into two entries, or keep only the sense the coursebook uses. Consider "ethnic group" wording for the multicultural theme. |
| P4 | Item 20 "multicultural" | Example lists pupils from "Ukraine, Georgia, Albania, and Greece". The unit's story class is Ukraine (Sasha), Albania (Christina), Georgia (Georgi) and the UK (Gwen). | Change "Greece" to "the UK" so the example matches the dossiers. |
| P5 | Item 8 "connect" | Example: "You need a Wi-Fi cable or router". Wi-Fi is wireless, so "Wi-Fi cable" is wrong. | "You need a cable or a router to connect your computer to the internet." |
| P6 | Item 26 "peninsula" | Example says the Peloponnese is "connected to mainland Greece by the Isthmus". Greek pupils know the Corinth Canal cuts it. | "The Peloponnese is a large peninsula in southern Greece." |
| P7 | Item 14 "instrument" | Greek meaning gives both scientific and musical senses, but the example shows only the scientific one. | Add a second example or split by sense. |
| P8 | Item 22 "nuclear power plant" | Example calls its electricity "clean", a contested claim presented as fact. | Neutral example: "The nuclear power plant makes electricity for a big city." |
| P9 | Derivative lists | Several are rare or wrong for A2: "anciently", "outgoingness", "landmarking", "comprising (prep)", "pasting (n)". "landscaping" under "landscape" is a different meaning (gardening). | Remove or replace with useful forms (ancient/history, outgoing/shy). |
| P10 | CEFR level labels | Hub says A2 / A2+. V1 header says A1+ / A2. The vocabulary file says A1+. The certificate says A2+. | Pick one level and apply it everywhere. |
| P11 | Lesson labels in V2 | Sections are labelled "Lesson 2", "Lesson 2.4B", "Lesson 1.2C". The Frequency Spectrum (1.2C) sits in the Lesson 2 grammar block. | Use one scheme matching the Pupil's Book, and place each activity under the lesson it practises. |
| P12 | Photodentro quiz level | The credits page identifies it as "multiple choice for younger children". All instructions are in Greek, inside a 6th grade English unit that advertises A2+ goals. | Keep it as a warm-up, label it so, and add English keyword boxes. Do not count it as evidence of A2+ mastery in the Can-Do Passport. |
| P13 | Can-Do Passport | Four statements: geography, grammar, collocations, writing. The unit is mostly listening (Challenge Arena, lab dialogue) and speaking (charades), yet there is no listening or speaking statement, although the portal says it mirrors "Now tick what you can do". | Add "I can understand a short dialogue about computers" and "I can ask and answer 'Are you ...?' about actions". |
| P14 | Can-Do statement 3 vs vocabulary | Statement says "split in two parts", the example says "in two halves". "Temperature drops below zero" and "grow citrus fruit" appear in the statement but not in any vocabulary example. | Reuse the promised collocations in the examples. |

## 2. Claims that may be wrong or overstated

| # | Claim | Issue | Fix |
|---|---|---|---|
| C1 | "280+ Neural AI Audios" (hub) vs "280 Pre-recorded MP3s (2 Voices)" (V1) | 35 words with word, definition and example per voice gives 210, not 280. The other 70 are unexplained. | Check the audio folder count and state what the files are. |
| C2 | "27 Contrast Sentences, 5-Sentence Rounds" (V2) | 27 is not divisible by 5, so the last round has 2 sentences. | Confirm the quiz handles a short final round, or use 25 or 30 sentences. |
| C3 | "100% Offline & GDPR Compliant" (V2) | The site is a web app, and V2 offers a "Classic Google TTS" voice. If that option calls a Google endpoint at runtime it is not offline and has GDPR implications for minors. If it plays pre-rendered MP3s, say so. | Check the Network tab while the Google voice plays. Adjust the claim to match. |
| C4 | "Official modern digital companion", "Greek Ministry of Education • DEPPS-APS Curriculum" (hub) | Reads as an official Ministry product. The Photodentro item is CC BY-NC-SA 4.0 (credits page): attribution required, same licence for derivatives, no commercial use. | Reword as an unofficial companion. Show the licence and credits link on V2's embedded quiz and in the hub footer. |
| C5 | Teacher note on Christina (Albania) | Keeps the coursebook line that tsunamis "happen along the South coast". Faithful to the book, but it states the hazard strongly. | Keep the book wording, add a teacher note: "can happen; rare". |

## 3. Possibly non-working items (verify in browser)

These looked empty or placeholder-like in the page text. They may be filled by JavaScript, so treat each as a test, not a confirmed defect.

| # | Item | What I saw | Test |
|---|---|---|---|
| W1 | V2 Photodentro embedded frame | Iframe source shows `about:blank` | Click "Play Interactive Quest (In-App)". Does the quiz load inside the page? Does "New Tab" work? (The standalone page loads fine.) |
| W2 | V1 vocabulary table | Header present, no rows | Open "Table Companion". Are 35 rows shown with working audio buttons? |
| W3 | V1 TTS script panel | Shows "Loading script..." | Does real text replace it? |
| W4 | V1 "Download JSON Data" | No link target visible | Click it. Does a file download? |
| W5 | V1 flashcard | "Category" label with no value | Remove the label if cards show no category. |
| W6 | V2 crossword | Clue lists empty; counter says "Solved: 0 / 12" but the teacher note lists 7 answers | Count clues and answers. Confirm 12. Test each Reveal button. |
| W7 | V2 Collocation matcher | No items visible | Do both lists appear? Does a wrong pair give feedback? |
| W8 | V2 Listening check | "Score 0 / 5", no statements | Are 5 statements shown? Is statement 2's key "printing"? |
| W9 | V2 Mr. Badluck, Frequency Spectrum, Charades | Content not visible | Check each routine/today pair really contrasts Present Simple and Present Continuous. |
| W10 | V2 Challenge Arena (4 games) | "Score 0 / 0", no questions visible | Play each mode. Check distractors and that Fact-Buster statements are factually correct. |
| W11 | V2 Report Builder | Preview shows "Report on Greece" | Type another country. Does the preview update and does Print give clean A4? |
| W12 | Audio sync | Written text differs from script (see P1) | Play "ancient" in both voices. Compare spoken words with on-screen text for several words. |
| W13 | Speed control | 0.8x / 1.0x / 1.2x | Check speeds apply to the pre-rendered MP3s, not only the TTS fallback. |
| W14 | Hub home page | `/` shows only "Quick Quizzes" and one link | Add a direct Unit 1 link on the first page. |

## 4. Suggested order of work

1. Content fixes needing no code: P1, P4, P5, P6, P8. Then regenerate affected audio.
2. Pedagogy rewrite: P2, P3, P9, P10, P11, P13.
3. Browser verification: W1 to W14, with a screenshot of each failure.
4. Claims and licensing: C1 to C4 before any conference presentation.

## 5. What I could not see

The wording of the listening statements, Mr. Badluck sentences, crossword clues, collocation pairs, Arena questions and charade cards. If you paste the data arrays from the source, I can check every item and answer key and extend this report.
