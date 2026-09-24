# Next steps: from Unit 1 to Unit 2

Updated 22 Sep 2026 after the skill audit.

## Workspace, before anything else

- **One folder, new windows.** Keep working in `C:\photodentro\antigravity\vocabulary st`.
  Nothing needs carrying over: the skill, the tools, the word lists, the hub and every unit's
  source pack are already there. What must *not* carry over is the Unit 1 conversation, so
  each session starts in a new Antigravity window.
- **Open `vocabulary st` as the workspace root, not `unit1`.** The Unit 1 window was rooted at
  `unit1/`, so the project skill in `vocabulary st/.agents/skills/` sat outside the workspace and
  the agent loaded the global copy in `~/.gemini/config/skills/` instead. The two copies had
  already drifted (the Workbook session edited the global `sync_data_twins.js`). They are
  identical again as of this audit.
- **Then delete the global copy** `C:\Users\apokr\.gemini\config\skills\coursebook-unit-extender`,
  so only one skill exists. The project copy is the one the tests reference.
- Delete `unit1\_to_delete\` when you are happy with Unit 1.

## Session A: extract the shell (new window, root `vocabulary st`)

Paste:
```
Read TASK_extract_shell.md and carry it out exactly. Nothing else in this session.
```
Why: the skill now builds every unit from `templates/unit_shell/`. Without it, a Unit 2 agent
either reads `unit1/` (and Unit 1's countries and lab dialogue leak into Unit 2) or writes a
second app from scratch (and the ten units stop looking alike). The skill tells an agent to
stop if the shell is missing.

Review before Session B: the five commands in the task file all pass, and Unit 1 looks the same
in the browser.

## Session B: Unit 2, Steps 1-9 and 11 (new window)

Paste:
```
Build Unit 2 with the coursebook-unit-extender skill: Steps 1-9 and 11, not Step 10 (the
Workbook gets its own session). Start with the Session Protocol read list.
unit2/ERRATA.md is pre-seeded with six pending items with page references. Ask me about each
one before building the content it touches; until I answer, the book's text stands.
Do not choose words for pictures: I will mark them. List every meaning_gr under "For the
teacher to check" in BUILD_NOTES.md.
```

## Session C: Unit 2, Step 10 Workbook (new window)

Paste:
```
Do Step 10 (Workbook Companion Module) of the coursebook-unit-extender skill for Unit 2, then
re-run Step 11. Answers come only from the Teacher's Book key; where the key and the Workbook
disagree, ask me. unit2/ERRATA.md E4 ("a dozen of eggs") applies to the Workbook too.
```

## Pictures for Unit 2

After Session B, mark the words you want pictured and generate the brief with
`_tools/visual_gloss_brief.html` (defaults: 768 px, CC0/PD/BY/BY-SA, Quality images first).
Keywords, not descriptions; put the anchor place in the hint when the definition names one.

## Unit 2 cautions (in `unit2/ERRATA.md`, all pending)

E1 *pair of snickers* · E2 *unit pice* · E3 *woolen* · E4 *a dozen of eggs* (SB p.32, WB pp.17, 20,
TB key: the partitives lesson teaches the wrong form) · E5 *20 cans of cider* on a child's party
list · E6 *Off the oven* in the model poem. Also: *space shuttle* must not be defined as current
(last flight 2011); *fruit flans* is a natural picture candidate.
