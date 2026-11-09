import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        with open('assets/icons/dynamix.svg', 'r') as f:
            svg_content = f.read()

        for size in [192, 512]:
            await page.set_viewport_size({'width': size, 'height': size})
            html = f"""<!DOCTYPE html>
<html>
<head><style>html, body {{ margin:0; padding:0; overflow:hidden; background:transparent; }}</style></head>
<body>
<div style="width:{size}px;height:{size}px;">
{svg_content.replace('width="72" height="72"', f'width="{size}" height="{size}"')}
</div>
</body>
</html>"""
            await page.set_content(html)
            await page.screenshot(path=f'assets/icons/icon-{size}.png', omit_background=True)
            print(f"Generated assets/icons/icon-{size}.png")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(run())
