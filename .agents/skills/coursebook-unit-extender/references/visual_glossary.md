# Visual glosses & scene art: Open-Source Realia + Middle-Grade Graphic Novel

Reference for `SKILL.md` Step 8, item 5. Applies to every unit.

For a concrete item, a picture is a better gloss than any definition, and it is the one
thing a definition cannot do: it reaches the meaning without passing through English or
Greek. The teacher already does this by hand in class, searching the web for a photo of a
*fruit flan* on the projector, because the picture registers instantly and lifts the room.
This makes that a built part of the app for the items he chooses.

Ordering on the card, which is the pedagogical point: **word -> picture -> English
definition -> Greek**. The picture comes before the definition for concrete nouns, so the
pupil links form to meaning directly; the definition is the backup and the Greek is the
last resort, not the first move.

## The Two-Track Visual Rule: Open-Source Realia vs. Graphic Novel Scenes

Searching the web gives a copyrighted photograph. Showing one on the classroom projector
is inside Law 2121/1993 art. 21; **embedding it in an app that is distributed to classes
and other teachers is not**, and no attribution cures that (see
`defining_vocabulary.md`, "Consulting published learner dictionaries", for the same
distinction applied to text).

To make the platform genuinely appealing to 10–12 year old 6th-grade students while maintaining
100% factual and legal integrity, all visuals follow a strict **Two-Track System**:

1. **Track 1 — Real Places, Countries, Landmarks & Real-World Objects (Open-Source Realia)**:
   - **Never generate a picture of a specific real thing.** Not a real country, not a named landmark, not a named machine, not a real person, not a historical event. An image model produces something plausible, and plausible is exactly the failure this whole project exists to correct (the printed book captions a photograph of an MD-11 as a Boeing 747 and tells pupils supersonic aircraft fly at five times the speed of sound).
   - For real countries (e.g., *Ukraine, Albania, Georgia, United Kingdom*), named landmarks, and real-world geography/objects, **always fetch real, freely licensed photographs from Wikimedia Commons** (`scripts/fetch_commons_images.js`) with a pupil-visible CC0 / PD / CC BY / CC BY-SA credit.

2. **Track 2 — Classroom Scenes, Dialogues, Character Stories & Generic Actions (Middle-Grade Graphic Novel Style)**:
   - For fictional classroom scenes, listening dialogues (e.g., *At the School Computer Lab*), comic vignettes (e.g., *Mr. Badluck's Day*), and generic actions, **use the `image-generator` subagent with the Middle-Grade Graphic Novel design language**:
     > *"Middle-grade graphic novel style illustration ... 10-11 year old students in cool casual clothes (hoodies, t-shirts, sneakers) ... Expressive inked line art, cel-shaded color palette, dynamic perspective, teen comic book aesthetic, no toddler tropes, no text."*

| item type | treatment |
|---|---|
| real countries, named landmarks, cities, rivers, mountains, coastlines (*Ukraine Carpathians, Albania Ionian Coast, Tbilisi Georgia, River Thames London, Mount Olympus*) | **no generated image.** Use a public-domain or CC-licensed photograph from Wikimedia Commons (`scripts/fetch_commons_images.js`) with its licence and author shown in a pupil-visible credit and recorded in `BUILD_NOTES.md` |
| classroom scenes, dialogues, character stories & situational vignettes (*elementary classroom, school computer lab, Mr. Badluck's day*) | **generate with `image-generator` in the Middle-Grade Graphic Novel style** (expressive inked line art, cel-shaded color palette, dynamic perspective, 10–11 year old students in cool casual hoodies/t-shirts/sneakers, teen comic book aesthetic, no toddler tropes, no text) |
| generic concrete noun (*citrus fruit, oil well, coal mine, plain, peninsula*) | prefer Wikimedia Commons real photography where clear; otherwise generate in graphic novel / clean vector style |
| a named machine, aircraft, ship or vehicle type | **real Wikimedia Commons photograph only** (or no image if accuracy cannot be verified; the book's own error is the warning) |
| a real person, living or dead | **real Wikimedia Commons photograph/portrait only, or no image** (never generate a real person; see Rights in SKILL.md) |
| a branded character, logo or product | **no image** (see Rights) |
| anything where being wrong would teach something false | no image; say so in `BUILD_NOTES.md` |

*Golden fleece* and other myth items are fine: they depict a story, not a fact (use classical Wikimedia Commons artwork or graphic novel illustration).

## Credits are pupil-visible, and they teach something

Where a public-domain or CC photograph is used, show the credit on the card itself, small
but legible: author, title, licence. Do not bury it in `BUILD_NOTES.md` alone. Two
reasons. It is the licence condition. And it puts a worked example of licensing in front
of eleven-year-olds every time they meet one of these pictures, which is worth a few
minutes of a lesson: why this photograph may be reused and a picture off a web search may
not, and what "BY", "SA" and "NC" ask of the person reusing it. Generated images carry
"Graphic novel illustration generated for this coursebook" in the same slot, so the pupil sees the
distinction between a photograph someone took and licensed, and a picture a machine made.

## Style contract (Generated Graphic Novel Scenes)

One visual language for all ten units, tailored to 10–12 year old 6th-grade students:

- **Middle-grade graphic novel style**: expressive inked line art, cel-shaded color palette, dynamic perspective, teen comic book aesthetic.
- **Age-authentic characters**: 10–11 year old students in cool casual clothes (hoodies, t-shirts, sneakers) sitting at wooden desks or collaborating in labs, with stylish, engaging teachers. **Strictly no toddler tropes** (no kindergarten "ABC 123" chalkboards, no babyish clip-art, no single-emoji placeholder boxes).
- **Bio-Warm 2026 palette harmony**: warm coral (`#FF6B47`), gold (`#FFC800`), lime (`#B6E528`), teal, and deep ink (`#0F172A`) outlines matching `vocabulary-st-modern`.
- Delivered as `.webp` (or `.jpg` for hero banners), target under 90 KB each for unit assets.
- **No text anywhere in the image.** Image models garble letters, the card already carries
  the word, and text would need translating.
- Age-appropriate throughout: nothing frightening. Natural disasters are shown by their
  aftermath on objects (a flooded street, a cracked road), never with people in danger.

## Print requirements

The worksheets are printed on a school photocopier, often in grayscale, sometimes on a
machine short of toner. This constrains the style more than the screen does:

- The subject must stay legible with colour removed: test each image converted to
  grayscale.
- High contrast between subject and background, distinct inked outlines.
- No dark full-bleed backgrounds: they print muddy and drink toner.
- Print size is small, around 35 mm square on the worksheet, so detail that only reads at
  768 px is wasted.

## Data fields

In `data/vocabulary_data.json`, per item, all optional:

```json
"image_prompt": "a single whole orange and a halved lemon on a white background, flat vector illustration",
"image": "assets/images_v2/vocab/04_citrus_fruit.webp",
"image_alt": "An orange and a cut lemon",
"image_source": "generated"
```

- `image_prompt` present is the teacher's mark that this item gets a picture. No prompt,
  no picture: the agent does not decide which items are illustrated.
- `image_alt` is a plain-English one-liner, at or below the unit's CEFR level. It is read
  by screen readers and shown if the file is missing, so it is a gloss in its own right
  and follows the rules in `defining_vocabulary.md`.
- `image_source` is `generated`, or the licence and author for a public-domain or CC
  photograph (`"CC BY-SA 4.0, <author>, <title>"`), recorded in `BUILD_NOTES.md` as well.
- Files live in `assets/images_v2/vocab/<padId>_<slug>.webp`. Offline like everything else:
  local files only, no remote URLs, ever.

## Tests

- Every item with an `image` has the file present, non-empty, and under 120 KB.
- Every item with an `image` has a non-empty `image_alt`.
- No item has an `image` without an `image_prompt` or an `image_source`.
- No runtime file references a remote image URL.
- The teacher reviews every generated image before it ships. An image an image model
  produced and nobody looked at is not evidence of anything.

## Fetching from Wikimedia Commons

Real photographs and artworks come from Commons, which accepts only freely licensed files.
`_tools/visual_gloss_brief.html` writes the agent brief from a word list; the rules it
encodes are these.

- **Licence policy: CC0, public domain, CC BY and CC BY-SA.** BY-SA is the Commons default,
  so excluding it empties most searches: in the first Unit 1 pass, 12 of 14 items came back
  empty, and share-alike was the main reason. Scaling and format conversion are technical
  modifications under the CC 4.0 licences and do not create adapted material, and placing an
  unmodified picture in the app or on a worksheet does not make the app or worksheet
  share-alike. A crop may count as an adaptation; the cropped file is then BY-SA itself,
  which is fine, and `image_modified` says so. Reject GFDL-only files and anything whose
  licence fields are missing or contradictory. (This is a working reading of the licences,
  not legal advice.)
- **Queries are keywords, not descriptions.** Commons search ANDs every word against titles
  and descriptions, so "oranges and lemons whole and halved" returns nothing. One to three
  keywords, the way Commons titles files. Ladder: the query with `incategory:"Quality
  images"`, then without it, then `incategory:"<English plural>"` (curated categories such
  as `Pumpjacks` beat full-text search), then one synonym, then stop.
- **Anchor rule.** If the item's definition names a specific place or thing ("like Mount
  Olympus", "like the Peloponnese"), the picture shows that very place or thing, or the item
  stays empty. A picture beside "like Mount Olympus" is read as Mount Olympus. For regions
  and landforms, NASA and ESA satellite imagery is public domain or CC BY and usually exact.
- **Scratch stays outside the unit.** Candidates, grayscale tests and helper code go in
  `../_scratch/`, deleted afterwards. If fetching needs code, it becomes one reusable script
  in this skill's `scripts/`, like the audio generator, never a set of one-offs in the unit.
- Send an identifying User-Agent, one request at a time (Wikimedia API etiquette).
- `verify_offline.js` may exempt licence URLs, which are text and never fetched, but only by
  exact prefix (`^https://creativecommons\.org/`), not by substring.
