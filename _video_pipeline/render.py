import asyncio, os
from pathlib import Path
from playwright.async_api import async_playwright

FPS = 30
DUR = 50
NF = FPS * DUR
W = 6

cur_dir = Path(__file__).parent.resolve()
frames_dir = cur_dir / 'frames'
frames_dir.mkdir(parents=True, exist_ok=True)
comp_url = (cur_dir / 'comp.html').as_uri()

async def worker(b, k):
    pg = await b.new_page(viewport={'width': 1920, 'height': 1080})
    await pg.goto(comp_url)
    await pg.wait_for_timeout(2000)
    # preload images
    await pg.evaluate("()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>0)))")
    for f in range(k, NF, W):
        await pg.evaluate(f'render({f/FPS})')
        await pg.evaluate("()=>Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>0)))")
        out_frame = frames_dir / f'f{f:05d}.jpg'
        await pg.screenshot(path=str(out_frame), type='jpeg', quality=93)
        if f % 150 == k:
            print(f'Progress: frame {f}/{NF} ({f/NF*100:.1f}%)')
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

