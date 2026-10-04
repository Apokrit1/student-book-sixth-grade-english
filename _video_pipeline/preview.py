import asyncio, sys, os
from pathlib import Path
from playwright.async_api import async_playwright

ts = [float(x) for x in sys.argv[1].split(',')]
cur_dir = Path(__file__).parent.resolve()
comp_url = (cur_dir / 'comp.html').as_uri()
out_dir = cur_dir / 'workspace' / 'qa'
out_dir.mkdir(parents=True, exist_ok=True)

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1920, 'height': 1080})
        await pg.goto(comp_url)
        await pg.wait_for_timeout(1500)
        await pg.evaluate("()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>0)))")
        for t in ts:
            await pg.evaluate(f'render({t})')
            await pg.wait_for_timeout(150)
            out_path = out_dir / f'pv_{t:05.2f}.png'
            await pg.screenshot(path=str(out_path))
            print(f'Rendered preview frame at t={t:05.2f} -> {out_path.name}')
        await b.close()

asyncio.run(main())

