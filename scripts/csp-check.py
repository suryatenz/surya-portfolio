"""Serve the built site with the production CSP from vercel.json attached, then scroll the
whole page and report any CSP violations or console errors. vite preview ignores
vercel.json, so this is the only local way to prove the policy doesn't break the site."""
import json
import sys
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:5200"
conf = json.load(open("vercel.json", encoding="utf-8"))
csp = next(h["value"] for h in conf["headers"][0]["headers"] if h["key"] == "Content-Security-Policy")
# upgrade-insecure-requests would rewrite http://localhost to https and break the local test.
csp = csp.replace("; upgrade-insecure-requests", "")


def add_csp(route):
    resp = route.fetch()
    headers = dict(resp.headers)
    headers["content-security-policy"] = csp
    route.fulfill(response=resp, headers=headers)


with sync_playwright() as p:
    b = p.chromium.launch()
    for w, h in [(1440, 900), (390, 844)]:
        page = b.new_page(viewport={"width": w, "height": h})
        problems = []
        page.on("console", lambda m: m.type in ("error", "warning") and problems.append(m.text))
        page.on("pageerror", lambda e: problems.append(str(e)))
        page.route(lambda u: u.rstrip("/") == URL.rstrip("/"), add_csp)
        page.goto(URL, wait_until="networkidle")
        page.wait_for_timeout(4500)
        for _ in range(30):
            page.mouse.wheel(0, h)
            page.wait_for_timeout(250)
        page.wait_for_timeout(1500)
        feed = page.locator(".feed li").count()
        fonts = page.evaluate("document.fonts.check('600 40px \"Outfit\"')")
        print(f"{w}px: feed items={feed} fonts={fonts} problems={problems or 'none'}")
        page.close()
    b.close()
