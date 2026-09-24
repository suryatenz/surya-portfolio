"""Scroll through the site like a visitor, screenshot each scene, and report console errors."""
import sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5200"
OUT = sys.argv[2] if len(sys.argv) > 2 else "review"
VIEWS = {"desk": (1440, 900), "phone": (390, 844)}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for vname, (w, h) in VIEWS.items():
        ctx = browser.new_context(viewport={"width": w, "height": h}, device_scale_factor=1)
        page = ctx.new_page()
        errors = []
        page.on("console", lambda m: m.type == "error" and errors.append(m.text))
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(1200)
        page.screenshot(path=f"{OUT}/{vname}-00-loader.png")
        page.wait_for_timeout(3200)
        total = page.evaluate("document.documentElement.scrollHeight")
        page.mouse.move(w * 0.6, h * 0.4)
        i, y = 1, 0
        step = h * (0.9 if vname == "desk" else 1.1)
        while y < total and i < 40:
            page.screenshot(path=f"{OUT}/{vname}-{i:02d}.png")
            page.mouse.wheel(0, step)
            page.wait_for_timeout(1300)
            y = page.evaluate("window.scrollY")
            total = page.evaluate("document.documentElement.scrollHeight")
            i += 1
            if y + h >= total - 2:
                page.wait_for_timeout(1200)
                page.screenshot(path=f"{OUT}/{vname}-{i:02d}-end.png")
                break
        overflow = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        print(vname, "shots:", i, "height:", total, "h-overflow:", overflow)
        print(vname, "errors:", errors or "none")
        ctx.close()
    browser.close()
