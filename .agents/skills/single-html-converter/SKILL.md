---
name: single-html-converter
description: Modernize a legacy static web app (Flash/AS3 + CreateJS/Animate exports, Muse/Scenario-generated HTML, jQuery-era code) into clean modern HTML/CSS/vanilla-JS, and/or convert a multi-file app into ONE self-contained .html with no dependencies. Use when the user asks to "modernize/rewrite/port legacy code", "convert Flash to HTML", "replace CreateJS/jQuery", "single html file", "one file", "no dependencies", "standalone/portable app", base64 font/image embedding, inlining CSS/JS, or fixing mojibake from such a conversion. Use ONLY for static front-end apps, not for build-tool (webpack/vite) bundling or server apps.
---

# Legacy app modernization → single-file HTML

Two phases, in this order. Phase A rebuilds the app as modern clean code;
Phase B bundles the result into one portable file. Both are reusable for any
static app; the recipes were proven on a Photodentro educational app built from
a Flash `.fla` source (CreateJS/Animate export) with a Muse/Scenario-generated
credits page.

---

# Phase A — Modernization

## A0. Classify the legacy stack before touching anything

Look for these markers (check the file, don't assume):

| Marker                                              | Means                                  | Replace with                                  |
| --------------------------------------------------- | -------------------------------------- | --------------------------------------------- |
| `*.fla`, `*.swf`, `lib.Symbol23`, `cjs.MovieClip`, `createjs.Stage` | Flash/AS3 → CreateJS/Animate export | Native DOM + CSS (see A3)                     |
| Muse/Scenario export: `u###` ids, `?crc=` image srcs, `__Roboto Condensed_5` font names, absolute-positioned divs | WYSIWYG generator output | Semantic HTML + grid/flex CSS                 |
| jQuery `$('#id')`, `.on(`, `$.ajax`                  | jQuery era                              | Vanilla DOM, `fetch`, event delegation        |
| `document.write`, `eval(`, `var` globals, prototype chains | Pre-ES5 script                      | `const`/`let`, modules, strict mode           |
| `__dirname`/`require`, `import` from CDN, `<script src="//cdn…">` | Bundler/CDN deps                  | Inline everything (Phase B)                   |

Keep the original source files untouched (the `.fla` is the content source of
truth). Deliver the modern version as **new** files next to them.

## A1. Extract the CONTENT first, then rewrite the ENGINE

The pedagogical content (question banks, sentences, answer options, licenses,
credits, glossary) is the product. Port it **verbatim** — do not "fix" data
while porting. Only the interaction layer gets rewritten.

- Copy the data arrays literally (here: 27 `[ sentence | correct | wrong ]`
  triples, including original quirks like the mismatched `are waking` — keep
  them; fixing content is a separate, user-approved task).
- Extract the visual identity from the legacy object: palette, fonts, the
  original illustration/screens (Flash symbols) become CSS shapes, SVG, or
  embedded images.
- Write the content list down before coding so nothing silently disappears.

## A2. Feature-parity checklist (build it, then tick it)

Before declaring the rewrite done, verify every legacy feature is reproduced:

- [ ] every question/item from the original is present
- [ ] both answer options per item, randomized
- [ ] scoring, counters, and per-round progression
- [ ] "show answers" reveal path, not just the check path
- [ ] new round / try again resets state correctly
- [ ] help modal content preserved
- [ ] credits + license text preserved (CC BY-NC-SA 4.0 attribution intact)

## A3. AS3/CreateJS → modern DOM mapping

| Legacy (AS3/CreateJS)                  | Modern equivalent                                   |
| -------------------------------------- | --------------------------------------------------- |
| `addEventListener(MouseEvent.CLICK, …)` | `addEventListener('click', …)`                      |
| `ENTER_FRAME` / `Ticker` loop         | `requestAnimationFrame` or CSS animation/transition  |
| `Tween` / `gotoAndPlay(frame)`         | CSS transition + state classes (`is-correct`, `is-wrong`) |
| `MovieClip` timeline + nested symbols | one DOM element per state, toggled with classes     |
| `TextField`                           | real text nodes (`textContent`, never `innerHTML` for data) |
| `Sprite`/`addChild`                   | DOM insertion (`append`, `replaceChildren`)          |
| `removeEventListener`                 | `AbortController` + `signal`                         |
| `stage.scaleMode`                     | CSS `clamp()` / `%` / `vw` units                     |
| bitmap `&crc=` assets                 | inline SVG / CSS / embedded data URIs               |
| `Event.REMOVE` + `dispatchEvent`      | `CustomEvent` + `addEventListener`                   |

The classic architecture that falls out of this: **one DOM node per state,
classes as the state machine, CSS as the animator.** Never a JS-driven
per-frame redraw loop for UI that CSS can express.

## A4. Muse/Scenario export → clean modern markup

Do **not** port the generated CSS/markup. Rebuild from the *content*:

- `u###` ids → semantic classes (`.credits__heading`, `.credits__section`, `.who`).
- Absolutely positioned divs → CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(420px, 1fr))`) or Flexbox.
- `?crc=1234567` query strings → clean paths, or data URIs in Phase B.
- `font-family:'__Roboto Condensed_5'` → real font stack.
- Keep the generator's huge inline reset out of the app; use one small reset.
- Keep the original page's *information architecture* (what's a heading, what's a
  meta row, what's a person) — only the delivery mechanism changes.

## A5. Modern-code standards (the house rules for the rewrite)

- **Semantic HTML**: `<header> <main> <section> <ol> <li> <button type="button"> <footer>`;
  `<progress>` for progress bars; `hidden` attribute instead of display hacks.
- **No dependencies**: vanilla ES2019+, no framework, no CDN.
- **`const`/`let`** only; `'use strict'`; small pure functions; event delegation
  on the list container instead of per-item listeners.
- **No `innerHTML` for data**: build nodes with `document.createElement` and
  `textContent`; escape anything interpolated.
- **Accessibility**: `aria-live="polite"` on score/result, `role="dialog"`
  + `aria-modal="true"` + `aria-labelledby` on modals, `aria-pressed` on
  toggle-style options, `aria-describedby` linking a question to its feedback,
  `aria-label` on icon buttons, Escape closes modals, focus moves to the
  relevant element on check/close, visible `:focus-visible` ring.
- **i18n**: `lang` on the root and on mixed-language nodes (`lang="en"` for the
  English grammar cards inside a Greek UI).
- **Responsive**: fluid type with `clamp()`, auto-fit grids, breakpoints ~900px
  and ~620px.
- **Motion**: honor `@media (prefers-reduced-motion: reduce)`.
- **Robustness**: no `null` derefs on missing elements; `hidden` state managed
  in one place.

## A6. Aesthetic — Photodentro kid-friendly design language

Keep the original object's palette; modernize the presentation around it.

- **Palette** (`:root` custom properties): calm blue `#37738C` (`-600 #2C5F75`,
  `-100 #E8F1F6`), soft green `#7DBE67` (`-600 #4E8A42`, `-100 #EFF6EA`),
  sunshine yellow `#EACB4F` (`-600 #B28A12`, `-100 #FBF3CE`), cream
  `#FAF7DC` / `#FDFBE2`, ink `#2F4555`, soft ink `#6B7C89`, line `#DFE7E9`;
  radius 20px / 13px; `--shadow: 0 12px 32px rgba(47,69,85,.12)`.
- **Type**: `'Roboto Condensed','Segoe UI',Arial,sans-serif`.
- **Surfaces**: white cards, 2px `--line` border, category encoded by an
  8px left accent (`border-left:8px solid var(--green|--blue)`).
- **Controls**: pill buttons (`border-radius:999px`); primary = green with hard
  bottom shadow `0 4px 0 var(--green-600)` (pressable); ghost = white with
  grey underline shadow; hover lifts `translateY(-2px)`, press `translateY(0)`.
- **Modals**: fixed inset-0 grid, backdrop `rgba(35,45,55,.55)`, panel
  `max-height:86vh; overflow:auto`, 0.22s rise-in, top-right × button.
- **Feedback**: correct = green + `::after{content:'✓'}`, wrong = red +
  `::after{content:'✕'}`; result banner in sun/green/red/blue variants.
- **Header**: sticky gradient bar `linear-gradient(120deg,#3A7B94,#2F6B86 60%,#37738C)`.

---

# Phase B — Single-file bundling

Goal: one `.html` that works by double-click, with no sibling folders and no CDN.

## B0. Inventory before promising anything

- List files; find what the entry HTML actually references (`<link>`,
  `<script src>`, CSS `url()`, JS `window.open`/`location`).
- Legacy exports may be present but unused (the CreateJS `index.js`, the
  `wlibs/` folder) — leave them alone; only the modern app gets bundled.
- Grep JS for runtime paths and rewrite them to in-page modals.
- Ask the user 3 decisions (do not assume):
  1. **Fonts**: base64-embed the *used* subset (large, identical look),
     system-font fallback (tiny), or keep external `fonts/` links.
  2. **Secondary pages** (credits/about): inline as in-page modal
     (recommended), remove, or keep external.
  3. **Output filename**: prefer a NEW file (e.g. `quiz.html`) so the
     multi-file version stays untouched.
- Typical size: ~600 KB of TTF → ~800 KB base64 → output ~900 KB. Fine to
  distribute anywhere.

## B1. Build a template with placeholders

Copy the modern entry HTML, replace every external reference:

- `<link rel="stylesheet" href="css/style.css">` → `<style>@@CSS@@</style>`
- `<script src="app.js"></script>` → `<script>@@JS@@</script>`
- `@font-face src:url('fonts/X.ttf')` → `src:url('data:font/ttf;base64,@@FONT_X@@') format('truetype')`
- `<img src="img/x.jpg">` → `src="data:image/jpeg;base64,@@IMG_X@@"` (png → `image/png`)
- JS that opened external pages (`window.open('credits/index.html', …)`) →
  `creditsModal.hidden = false;`
- MIME types: `font/ttf`, `image/jpeg`, `image/png`, `image/svg+xml` (inline SVG
  markup is often better than a data URI).

Use unique `@@NAME@@` placeholders (uppercase, double-at) that cannot occur in
real content.

**Order matters when a CDN block sits next to the local stylesheet.** If you
delete a "Google Fonts" / "CDN" comment block, check that it does not also
contain the local `<link rel="stylesheet">` — deleting it first leaves nothing
for the later "replace the stylesheet link with `<style>`" step to match, and
the CSS silently vanishes (the page then renders unstyled). Insert the inline
`<style>` block FIRST, then remove the CDN lines.

**Never** write megabytes of base64 with a file-write tool — inject it with the
substitution script (B2).

### Modal boilerplate (accessibility-correct, proven pattern)

```html
<div class="modal" id="creditsModal" role="dialog" aria-modal="true"
     aria-labelledby="creditsTitle" hidden>
  <div class="modal__backdrop" data-close></div>
  <div class="modal__panel" role="document">
    <button type="button" class="modal__x" data-close aria-label="Κλείσιμο">×</button>
    <h2 class="modal__title" id="creditsTitle">…</h2>
    …
    <div class="modal__foot"><button class="btn btn--primary" data-close>OK</button></div>
  </div>
</div>
```

```js
const m = document.getElementById('creditsModal');
openBtn.addEventListener('click', () => { m.hidden = false; });
m.addEventListener('click', e => {
  if (e.target === m || e.target.closest('[data-close]')) m.hidden = true;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !m.hidden) m.hidden = true;
});
```

Put auxiliary modals in a **separate `<script>` after** the app script so a later
`const` binding resolves at click-time.

## B2. Inject assets (Windows PowerShell 5.1 — encoding rules!)

⚠️ **Windows PowerShell 5.1 reads BOM-less UTF-8 as the ANSI codepage
(Windows-1253 on Greek-locale systems).** Greek text becomes mojibake
(`Ξβ€Ξ…`) and the browser shows garbage. ALWAYS read text with explicit
UTF-8, never bare `Get-Content -Raw`:

```powershell
$enc = New-Object System.Text.UTF8Encoding($false)
$template = [IO.File]::ReadAllText($templatePath, [Text.Encoding]::UTF8)
$css = [IO.File]::ReadAllText("$root\css\style.css", [Text.Encoding]::UTF8)
$js  = [IO.File]::ReadAllText("$root\app.js", [Text.Encoding]::UTF8)
# binary → base64
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($path))
# substitute with plain .Replace (not -regex), then fail loudly on leftovers
$out = $out.Replace('@@CSS@@', $css) …
if ($out -match '@@') { throw 'Unresolved placeholder remains' }
[IO.File]::WriteAllText($outPath, $out, $enc)   # UTF-8 without BOM
```

## B3. Verify (all mandatory)

1. `if ($out -match '@@')` threw → no placeholders left.
2. `Select-String -Pattern '(src|href)="(?!data:|http)'` → zero local file refs.
3. Extract each inline `<script>(.*?)</script>` block and run `node --check`
   (PS: `[regex]::Matches($out, '(?s)<script>(.*?)</script>')`).
4. **Prove the CSS and fonts actually landed** — a "no leftover references"
   check is NOT enough, because a wrongly deleted `<link>` looks identical to a
   correctly inlined one. Assert positively:
   `$out.Contains('<style>')`, `$out.Contains('data:font/woff2')`, a known app
   selector (e.g. `.cyber-app`), and `<style>` braces balanced.
5. **Byte-level asset check**: decode every embedded data URI and compare its
   length against the source file, per item (not just as a set — a set compare
   hides a swapped mapping). Expected diffs: an asset deliberately used twice
   (e.g. the same photo in a placeholder `<img>`) and unreferenced files in the
   source folder.
6. **Mojibake check**: `$out.Contains('<one known Greek/native word>')` is
   `$true` and a mojibake pattern like `ΞβΞ` is `$false`. Greek console output
   still LOOKS garbled in a 1252/1253 terminal — that is display-only; trust
   the Contains() result. When passing non-ASCII literals to the shell, write
   the check to a UTF-8 `.ps1` and run it via `Invoke-Expression` — inline
   non-ASCII in the command line gets mangled, and `[char]0x39A + [char]0x39B`
   adds *numbers*, so use `-join @(...)` to build a string.
7. **Render it**: headless Chrome screenshot, then look at the image.
   `& $chrome --headless --disable-gpu --no-sandbox --window-size=1400,1000 --screenshot=$shot $url`
   (if `--headless=new` yields no file, use the classic `--headless` flag).
8. User reloads with **Ctrl+F5** (data-URI fonts cache aggressively).

## B4. Report

State: total size, what was embedded, what stayed external (if anything),
modernization decisions made, and the verification results. Leave the original
multi-file app and the legacy sources untouched.
