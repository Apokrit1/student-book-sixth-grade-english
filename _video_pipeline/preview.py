import asyncio,sys
from playwright.async_api import async_playwright
ts=[float(x) for x in sys.argv[1].split(',')]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1920,'height':1080})
        await pg.goto('file:///home/claude/work/comp/comp.html'); await pg.wait_for_timeout(1500)
        for t in ts:
            await pg.evaluate(f'render({t})'); await pg.wait_for_timeout(120)
            await pg.screenshot(path=f'/home/claude/work/pv_{t:05.2f}.png')
        await b.close()
asyncio.run(main())
