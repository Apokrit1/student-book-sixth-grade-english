---
name: video-pipeline-creator
description: >-
  Builds, generates, and renders high-definition (1080p 60fps) kinetic presentation videos,
  app showcase pitches, and interactive instructional animations using an automated,
  zero-dependency vanilla HTML5/CSS/Playwright/FFmpeg pipeline. Produces both a broadcast-grade
  MP4 video and a standalone zero-install web player (player.html).
---

# Video Pipeline Creator (The Zero-Dependency HTML5 + Playwright Framework)

This skill provides an autonomous, production-grade runbook for any AI agent to create **cinematic software launch videos**, **kinetic typography pitches**, and **interactive instructional animations**.

Unlike heavy Node/React video frameworks (like Remotion) that require massive `node_modules`, complex TypeScript boilerplate, and bundlers, this approach is **100% token-efficient, zero-dependency, and deterministic**.

It produces **two synchronized deliverables from a single codebase**:
1. **Broadcast-Quality Master Video (`.mp4`)**: Rendered via parallel headless Chromium workers and stitched with FFmpeg (CRF 18).
2. **Interactive Standalone Web Player (`player.html`)**: A lightweight (<25 KB), dependency-free web app that scales to any screen, syncs with audio, supports spacebar/arrow scrubbing, and runs everywhere without video buffering.

---

## 1. Pipeline Architecture & Directory Layout

To build a clean video pipeline, create a self-contained directory (e.g., `_video_pipeline/`):

```
_video_pipeline/
├── comp.html         ← Master visual composition: pure deterministic render(t) at 1920x1080
├── player.html       ← Interactive client player (auto-scales, audio sync, keyboard scrubbing)
├── shoot2.py         ← Automated Retina asset capture (Playwright 2x device scale)
├── preview.py        ← Rapid keyframe checker (renders specific timestamps to PNG in seconds)
├── render.py         ← Multi-worker async frame exporter (Playwright + Chromium parallel rendering)
├── music.py          ← Audio synthesis / neural voice mixer (NumPy or pre-recorded clips)
├── cap/              ← Captured screenshots from shoot2.py
├── frames/           ← Rendered f%05d.jpg frames from render.py
└── soundtrack.wav    ← Master audio track (44.1 kHz 16-bit stereo)
```

---

## 2. Core Architectural Principle: Pure Deterministic `render(t)`

The entire animation is governed by a **single mathematical function of time**:

$$\text{Visual State} = \text{render}(t)$$

Where $t$ is the elapsed time in seconds (float).

- At $t=0.0$, the first frame is drawn.
- At $t=14.5$, elements are placed exactly where they belong at 14.5 seconds.
- **No state persists between frames.** Scrubbing backward to $t=2.0$ produces the exact same frame as playing forward to $t=2.0$.

### Essential Animation Math (Include in `<script>` of `comp.html` and `player.html`)

```javascript
const $ = id => document.getElementById(id);
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));

// Normalized progress between timestamp 'a' and 'b' (returns 0.0 -> 1.0)
const P = (t, a, b) => clamp((t - a) / (b - a));

// Standard easing curves
const eo3 = x => 1 - Math.pow(1 - x, 3);          // Cubic ease-out
const eo5 = x => 1 - Math.pow(1 - x, 5);          // Quintic ease-out (snappy pop)
const eio = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; // Ease in-out
const eoBack = x => {                             // Overshoot spring pop
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// Window visibility helper
const inWin = (t, a, b) => t >= a && t < b;
const show = (el, on) => { el.style.display = on ? '' : 'none'; };
```

---

## 3. Kinetic Typography Engine (`kin`)

For punchy kinetic text (headlines, punchlines, subtitles), use a generalized motion helper:

```javascript
/**
 * Kinetic text helper:
 * - Slides up from dy pixels
 * - Applies quintic ease-out
 * - Unblurs dynamically
 * - Holds through duration
 * - Snaps out cleanly
 */
function kin(el, t, a, b, txt, opt = {}) {
  if (!inWin(t, a, b)) {
    el.style.opacity = 0;
    return;
  }
  if (el.textContent !== txt) el.textContent = txt;
  
  const i = eo5(P(t, a, a + (opt.din || 0.28)));     // Ease in
  const o = opt.noOut ? 0 : P(t, b - (opt.dout || 0.14), b); // Ease out
  const dy = (1 - i) * (opt.dy ?? 60) - o * 30;
  
  el.style.opacity = (i * (1 - o)).toFixed(3);
  el.style.transform = `translateY(${dy}px) scale(${(opt.s0 ?? 1) + (1 - (opt.s0 ?? 1)) * i})`;
  el.style.filter = `blur(${((1 - i) * 10 + o * 8).toFixed(1)}px)`;
}
```

---

## 4. The Interactive Web Player (`player.html`)

The interactive player allows anyone (teachers, students, reviewers) to inspect or present the video live in a browser without waiting for an MP4 render.

### Implementation Checklist for `player.html`:
1. **Responsive Stage Fitting**: Scales the 1920x1080 stage to fit any screen resolution with CSS `transform: scale(k)`.
2. **Audio Sync**: Synchronizes `render(t)` with `<audio id="snd" src="soundtrack.mp3">`.
3. **Controls Bar**: Play/pause button, timecode (`0.0 / 50.0`), scrub bar.
4. **Keyboard Shortcuts**:
   - `Space`: Toggle Play/Pause
   - `ArrowRight`: Step forward +2.0s
   - `ArrowLeft`: Step backward -2.0s
   - `KeyF`: Toggle Fullscreen

```html
<div id="ctl">
  <button id="btn">Play</button>
  <div id="bar"><div id="fill"></div></div>
  <span id="tc">0.0 / 50.0</span>
</div>
<audio id="snd" src="soundtrack.mp3" preload="auto"></audio>

<script>
(function() {
  const st = document.getElementById('stage');
  const snd = document.getElementById('snd');
  const D = 50.0; // Total duration in seconds

  function fit() {
    const k = Math.min(innerWidth / 1920, innerHeight / 1080);
    st.style.transform = `translate(${(innerWidth - 1920 * k) / 2}px, ${(innerHeight - 1080 * k) / 2}px) scale(${k})`;
  }
  window.addEventListener('resize', fit);
  fit();

  function loop() {
    const t = Math.min(D, snd.currentTime);
    render(t);
    document.getElementById('fill').style.width = (t / D * 100) + '%';
    document.getElementById('tc').textContent = t.toFixed(1) + ' / ' + D.toFixed(1);
    if (!snd.paused) requestAnimationFrame(loop);
  }

  function toggle() {
    if (snd.paused) {
      if (snd.ended || snd.currentTime >= D - 0.05) snd.currentTime = 0;
      snd.play();
      document.getElementById('btn').textContent = 'Pause';
      requestAnimationFrame(loop);
    } else {
      snd.pause();
      document.getElementById('btn').textContent = 'Play';
    }
  }

  document.getElementById('btn').onclick = e => { e.stopPropagation(); toggle(); };
  st.onclick = toggle;
  document.getElementById('bar').onclick = e => {
    const r = e.currentTarget.getBoundingClientRect();
    snd.currentTime = (e.clientX - r.left) / r.width * D;
    loop();
  };

  window.addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); toggle(); }
    if (e.code === 'ArrowRight') { snd.currentTime = Math.min(D, snd.currentTime + 2); loop(); }
    if (e.code === 'ArrowLeft') { snd.currentTime = Math.max(0, snd.currentTime - 2); loop(); }
    if (e.code === 'KeyF') {
      document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
    }
  });
})();
</script>
```

---

## 5. Automated High-DPI Screen Capture (`shoot2.py`)

Never manually capture screenshots for app pitches. Automate with Playwright at **Retina 2x resolution**:

```python
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

cur_dir = Path(__file__).parent.resolve()
site_dir = cur_dir.parent.resolve()
out_dir = cur_dir / 'cap'
out_dir.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        # Note: device_scale_factor=2 gives crystal-clear 4K-density assets for 1080p compositions
        pg = await b.new_page(viewport={'width': 1600, 'height': 900}, device_scale_factor=2)
        
        # 1. Capture landing portal
        await pg.goto((site_dir / 'portal.html').as_uri())
        await pg.wait_for_timeout(1200)
        await pg.screenshot(path=str(out_dir / 'portal.jpg'), full_page=True, type='jpeg', quality=92)
        
        # 2. Capture app tabs programmatically
        await pg.goto((site_dir / 'unit1' / 'v2.html').as_uri())
        await pg.wait_for_timeout(1200)
        for tab in ['stories', 'grammar', 'collocations', 'report', 'challenges', 'worksheets']:
            await pg.click(f'[data-tab="{tab}"]')
            await pg.wait_for_timeout(700)
            await pg.screenshot(path=str(out_dir / f'{tab}.jpg'), full_page=True, type='jpeg', quality=92)
            
        await b.close()
        print('Captured all Retina assets to cap/')

if __name__ == '__main__':
    asyncio.run(main())
```

---

## 6. Fast Keyframe Verification (`preview.py`)

Do NOT render 1,500 frames just to check if second 12 looks right. Render a handful of chosen timestamps:

```python
import asyncio, sys
from pathlib import Path
from playwright.async_api import async_playwright

# Usage: python preview.py 1.0,5.0,12.5,24.0
ts = [float(x) for x in sys.argv[1].split(',')]
cur_dir = Path(__file__).parent.resolve()
comp_url = (cur_dir / 'comp.html').as_uri()
out_dir = cur_dir / 'qa'
out_dir.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1920, 'height': 1080})
        await pg.goto(comp_url)
        await pg.wait_for_timeout(1500)
        # Pre-decode images so no missing textures appear
        await pg.evaluate("()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>0)))")
        
        for t in ts:
            await pg.evaluate(f'render({t})')
            await pg.wait_for_timeout(150)
            out_path = out_dir / f'pv_{t:05.2f}.png'
            await pg.screenshot(path=str(out_path))
            print(f'Rendered preview frame at t={t:05.2f} -> {out_path.name}')
            
        await b.close()

if __name__ == '__main__':
    asyncio.run(main())
```

---

## 7. Multi-Worker Parallel Frame Exporter (`render.py`)

Rendering 1,500 frames sequentially in Chromium takes ~45 minutes. With **6 parallel asynchronous workers striding across the timeline**, rendering drops to **under 8 minutes**:

```python
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

FPS = 30
DUR = 50            # Total seconds
NF = FPS * DUR      # 1,500 frames
W = 6               # 6 parallel Chromium workers

cur_dir = Path(__file__).parent.resolve()
frames_dir = cur_dir / 'frames'
frames_dir.mkdir(parents=True, exist_ok=True)
comp_url = (cur_dir / 'comp.html').as_uri()

async def worker(b, k):
    pg = await b.new_page(viewport={'width': 1920, 'height': 1080})
    await pg.goto(comp_url)
    await pg.wait_for_timeout(2000)
    await pg.evaluate("()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>0)))")
    
    # Stride across frames: worker 0 renders [0, 6, 12...], worker 1 renders [1, 7, 13...]
    for f in range(k, NF, W):
        await pg.evaluate(f'render({f / FPS})')
        await pg.evaluate("()=>Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>0)))")
        out_frame = frames_dir / f'f{f:05d}.jpg'
        await pg.screenshot(path=str(out_frame), type='jpeg', quality=93)
        if f % 150 == k:
            print(f'Progress: frame {f}/{NF} ({f / NF * 100:.1f}%)')
            
    await pg.close()

async def main():
    print(f'Starting render of {NF} frames with {W} parallel workers...')
    async with async_playwright() as p:
        b = await p.chromium.launch()
        await asyncio.gather(*[worker(b, k) for k in range(W)])
        await b.close()
    print('Render complete!')

if __name__ == '__main__':
    asyncio.run(main())
```

---

## 8. Final Master Video Stitching (FFmpeg)

Once all frames are exported into `frames/` and `soundtrack.wav` (or `soundtrack.mp3`) is ready, join them into a broadcast-grade CRF 18 MP4:

```bash
ffmpeg -framerate 30 -i frames/f%05d.jpg -i soundtrack.wav \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -movflags +faststart -shortest output_master.mp4
```

- **`-crf 18`**: Visually lossless compression for crystal-clear text and UI screenshots.
- **`-pix_fmt yuv420p`**: Required for compatibility with iOS, Safari, QuickTime, and Android.
- **`-movflags +faststart`**: Moves the MP4 index (`moov` atom) to the front of the file, allowing instant playback streaming on the web without downloading the whole file first.

---

## 9. The Data-Driven Template Pattern (Instructional Animations)

When creating grammar tutorials, flashcard walkthroughs, or vocabulary drills, **do not write custom HTML for each animation**. Use the data-driven pattern to achieve **extreme token efficiency** (<100 tokens per prompt):

### Master Data Structure (`script.json`):
```json
[
  {
    "time": [0, 4.5],
    "kick": "Grammar Lab · Present Simple",
    "headline": "Habits & Permanent States",
    "example": "He plays tennis every Saturday.",
    "voice_audio": "audio/clip_01.mp3",
    "theme_color": "#dd6b20"
  },
  {
    "time": [4.5, 9.0],
    "kick": "Grammar Lab · Present Continuous",
    "headline": "Actions Happening Right Now",
    "example": "He is playing tennis right now!",
    "voice_audio": "audio/clip_02.mp3",
    "theme_color": "#319795"
  }
]
```

The master template iterates over `DATA` and updates DOM elements dynamically based on `inWin(t, item.time[0], item.time[1])`. The AI only needs to output the JSON array.

---

## 10. Agent Step-by-Step Execution Protocol

When asked to create a video or animation pipeline from scratch:

1. **Step 1: Capture Assets (`shoot2.py`)**
   - Identify which app pages, tabs, or textbook scans need to be displayed.
   - Run Playwright with `device_scale_factor=2` to collect high-DPI screenshots in `cap/`.
2. **Step 2: Script the Audio Track (`music.py` or Voice Clips)**
   - Determine total duration $D$ (e.g., 30s or 50s).
   - Lay down voice cues and background audio timestamps.
3. **Step 3: Construct Visual Composition (`comp.html`)**
   - Create HTML layout at fixed 1920x1080.
   - Define scenes with time windows: `[a, b]`.
   - Implement `render(t)` using `kin()`, `P()`, and easing functions.
4. **Step 4: Verify with `preview.py`**
   - Sample key transitions: `python preview.py 2.0,10.5,24.0,45.0`.
   - Inspect output PNGs in `qa/`.
5. **Step 5: Export Full Video (`render.py` + FFmpeg)**
   - Run 6 parallel workers to export JPEG frames.
   - Execute FFmpeg join command to generate master MP4.
6. **Step 6: Ship the Interactive Web Player (`player.html`)**
   - Copy `comp.html` logic to `player.html`.
   - Include auto-scale CSS transform, play/pause controls, and audio sync.
   - Link both the MP4 and `player.html` on the website or portal hub!
