import asyncio,os
from playwright.async_api import async_playwright
FPS=30; DUR=50; NF=FPS*DUR; W=6
os.makedirs('/home/claude/work/frames',exist_ok=True)
async def worker(b,k):
    pg=await b.new_page(viewport={'width':1920,'height':1080})
    await pg.goto('file:///home/claude/work/comp/comp.html'); await pg.wait_for_timeout(2000)
    # preload images
    await pg.evaluate("""()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>0)))""")
    for f in range(k,NF,W):
        await pg.evaluate(f'render({f/FPS})')
        await pg.evaluate("()=>Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>0)))")
        await pg.screenshot(path=f'/home/claude/work/frames/f{f:05d}.jpg',type='jpeg',quality=93)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await asyncio.gather(*[worker(b,k) for k in range(W)])
        await b.close()
asyncio.run(main())
