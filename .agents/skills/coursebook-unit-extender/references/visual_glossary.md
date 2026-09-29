# Visual glosses: generated pictures as a third gloss channel

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

## Generate, do not search

Searching the web gives a copyrighted photograph. Showing one on the classroom projector
is inside Law 2121/1993 art. 21; **embedding it in an app that is distributed to classes
and other teachers is not**, and no attribution cures that (see
`defining_vocabulary.md`, "Consulting published learner dictionaries", for the same
distinction applied to text). Generated images avoid the problem entirely and give
something a photo set cannot: one consistent visual language across ten units.

## The accuracy line

**Never generate a picture of a specific real thing.** Not a named landmark, not a named
machine, not a real person, not a historical event, not a particular place. An image model
produces something plausible, and plausible is exactly the failure this whole project
exists to correct: the printed book captions a photograph of an MD-11 as a Boeing 747 and
tells pupils supersonic aircraft fly at five times the speed of sound. Do not add a second
generation of that error in better resolution.

| item type | treatment |
|---|---|
| generic concrete noun (*citrus fruit, oil well, coal mine, plain, peninsula*) | generate |
| generic action or scene (*printing a page, searching, a flooded street*) | generate |
| abstract quality (*brave, outgoing, multicultural*) | generate only as a situation a pupil can read, or leave with no image |
| a named landmark, city, building or monument | **no generated image.** Use a public-domain or CC-licensed photograph with its licence and author recorded in `BUILD_NOTES.md`, or no image |
| a named machine, aircraft, ship or vehicle type | **no image.** Accuracy cannot be verified and the book's own error is the warning |
| a real person, living or dead | **no image** (see Rights in SKILL.md) |
| a branded character, logo or product | **no image** (see Rights) |
| anything where being wrong would teach something false | no image; say so in `BUILD_NOTES.md` |

*Golden fleece* and other myth items are fine: they depict a story, not a fact.

## Credits are pupil-visible, and they teach something

Where a public-domain or CC photograph is used, show the credit on the card itself, small
but legible: author, title, licence. Do not bury it in `BUILD_NOTES.md` alone. Two
reasons. It is the licence condition. And it puts a worked example of licensing in front
of eleven-year-olds every time they meet one of these pictures, which is worth a few
minutes of a lesson: why this photograph may be reused and a picture off a web search may
not, and what "BY", "SA" and "NC" ask of the person reusing it. Generated images carry
"illustration generated for this coursebook" in the same slot, so the pupil sees the
distinction between a photograph someone took and licensed, and a picture a machine made.

## Style contract

One visual language for all ten units, or the coursebook looks like a scrapbook.

- Flat vector-style illustration, clean shapes, minimal detail, no photorealism.
- Plain white or very light single-colour background. No scenery behind the subject unless
  the scenery *is* the subject.
- One subject per image, centred, filling most of the frame.
- Square, 1:1. Delivered at 768x768, stored as `.webp`, target under 90 KB each.
- A warm, saturated palette consistent across units. Record the exact palette in the
  project's design notes on the first unit that generates images, and reuse it.
- **No text anywhere in the image.** Image models garble letters, the card already carries
  the word, and text would need translating.
- No people's faces where a hand or a silhouette will do. Where people are needed, keep
  them diverse and generic; this is a unit about a multicultural class.
- Age-appropriate throughout: nothing frightening. Natural disasters are shown by their
  aftermath on objects (a flooded street, a cracked road), never with people in danger.

## Print requirements

The worksheets are printed on a school photocopier, often in grayscale, sometimes on a
machine short of toner. This constrains the style more than the screen does:

- The subject must stay legible with colour removed: test each image converted to
  grayscale.
- High contrast between subject and background, distinct outlines.
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
