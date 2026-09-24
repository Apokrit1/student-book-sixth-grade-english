import asyncio
from playwright.async_api import async_playwright
O='/home/claude/work/cap/'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pg=await b.new_page(viewport={'width':1600,'height':900},device_scale_factor=2)
        await pg.goto('file:///home/claude/site/portal.html'); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=O+'portal.png',full_page=True)
        await pg.goto('file:///home/claude/site/unit1/index.html'); await pg.wait_for_timeout(1200)
        await pg.screenshot(path=O+'v1.png',full_page=True)
        await pg.goto('file:///home/claude/site/unit1/v2.html'); await pg.wait_for_timeout(1200)
        for t in ['stories','grammar','collocations','report','challenges','worksheets','passport']:
            await pg.click(f'[data-tab="{t}"]'); await pg.wait_for_timeout(700)
            await pg.screenshot(path=O+f'{t}.png',full_page=True)
        # georgia dossier
        await pg.click('[data-tab="stories"]'); await pg.wait_for_timeout(400)
        btns=await pg.query_selector_all('#countryPills button')
        for bt in btns:
            if 'Georgi' in (await bt.inner_text()):
                await bt.click(); await pg.wait_for_timeout(700)
                await pg.screenshot(path=O+'georgia.png',full_page=True)
        await b.close()
asyncio.run(main())
