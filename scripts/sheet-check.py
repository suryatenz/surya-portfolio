"""Open a project card, capture the expand transition, verify the dialog (focus inside,
Esc closes, focus returns to the card) and check the page can't scroll behind it."""
import sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5200"
OUT = sys.argv[2] if len(sys.argv) > 2 else "."

with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h, tag in [(1440, 900, "desk"), (390, 844, "phone")]:
        page = b.new_page(viewport={"width": w, "height": h})
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: m.type == "error" and "403" not in m.text and errors.append(m.text))
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(2500)
        page.evaluate("document.getElementById('work').scrollIntoView()")
        page.wait_for_timeout(1500)
        hit = page.locator(".card__hit").first
        hit.scroll_into_view_if_needed()
        page.wait_for_timeout(800)
        hit.click()
        page.wait_for_timeout(180)
        page.screenshot(path=f"{OUT}/{tag}-sheet-mid.png")
        page.wait_for_timeout(1200)
        page.screenshot(path=f"{OUT}/{tag}-sheet-open.png")
        info = page.evaluate(
            """() => ({ dialog: !!document.querySelector('[role=dialog]'),
                        focusInDialog: !!document.activeElement.closest('[role=dialog]'),
                        label: document.querySelector('[role=dialog]')?.getAttribute('aria-labelledby') })"""
        )
        page.keyboard.press("ArrowRight")
        page.wait_for_timeout(900)
        stepped = page.evaluate(
            """() => ({ hash: location.hash, title: document.querySelector('[role=dialog] h3').textContent,
                        labelled: document.querySelector('[role=dialog]').getAttribute('aria-labelledby') })"""
        )
        print(tag, "after ArrowRight:", stepped)
        page.screenshot(path=f"{OUT}/{tag}-sheet-step.png")
        page.keyboard.press("ArrowLeft")
        page.wait_for_timeout(900)
        y0 = page.evaluate("scrollY")
        page.mouse.wheel(0, 800)
        page.wait_for_timeout(500)
        y1 = page.evaluate("scrollY")
        page.keyboard.press("Escape")
        page.wait_for_timeout(1200)
        after = page.evaluate(
            """() => ({ dialog: !!document.querySelector('[role=dialog]'),
                        focusBack: document.activeElement.classList.contains('card__hit') })"""
        )
        print(tag, info, "page scrolled behind dialog:", y1 != y0, after, "errors:", errors or "none")
        page.close()

        # Deep link straight to a project.
        page = b.new_page(viewport={"width": w, "height": h})
        page.goto(URL + "/#project-owlpost", wait_until="networkidle")
        page.wait_for_timeout(2500)
        print(tag, "deep link opens:", page.evaluate("document.querySelector('[role=dialog] h3')?.textContent"))
        page.close()
    b.close()
