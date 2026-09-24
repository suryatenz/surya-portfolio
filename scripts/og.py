"""Render scripts/og.html to public/og.png (1200x630 link-preview image)."""
from pathlib import Path
from playwright.sync_api import sync_playwright

here = Path(__file__).parent
with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page(viewport={"width": 1200, "height": 630})
    page.goto((here / "og.html").as_uri(), wait_until="networkidle")
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(500)
    page.locator(".og").screenshot(path=str(here.parent / "public" / "og.png"))
    b.close()
print("wrote public/og.png")
