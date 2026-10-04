import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

cur_dir = Path(__file__).parent.resolve()
site_dir = cur_dir.parent.resolve()
out_dir = cur_dir / 'cap'
out_dir.mkdir(parents=True, exist_ok=True)

portal_url = (site_dir / 'portal.html').as_uri()
unit1_v1_url = (site_dir / 'unit1' / 'index.html').as_uri()
unit1_v2_url = (site_dir / 'unit1' / 'v2.html').as_uri()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1600, 'height': 900}, device_scale_factor=2)
        await pg.goto(portal_url)
        await pg.wait_for_timeout(1200)
        await pg.screenshot(path=str(out_dir / 'portal.jpg'), full_page=True, type='jpeg', quality=92)
        
        await pg.goto(unit1_v1_url)
        await pg.wait_for_timeout(1200)
        await pg.screenshot(path=str(out_dir / 'v1.jpg'), full_page=True, type='jpeg', quality=92)
        
        await pg.goto(unit1_v2_url)
        await pg.wait_for_timeout(1200)
        for t in ['stories', 'grammar', 'collocations', 'report', 'challenges', 'worksheets', 'passport']:
            await pg.click(f'[data-tab="{t}"]')
            await pg.wait_for_timeout(700)
            await pg.screenshot(path=str(out_dir / f'{t}.jpg'), full_page=True, type='jpeg', quality=92)
            
        # georgia dossier
        await pg.click('[data-tab="stories"]')
        await pg.wait_for_timeout(400)
        btns = await pg.query_selector_all('#countryPills button')
        for bt in btns:
            if 'Georgi' in (await bt.inner_text()):
                await bt.click()
                await pg.wait_for_timeout(700)
                await pg.screenshot(path=str(out_dir / 'georgia.jpg'), full_page=True, type='jpeg', quality=92)
        await b.close()
        print('All screenshots refreshed in cap/')

if __name__ == '__main__':
    asyncio.run(main())

