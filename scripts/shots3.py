"""Pit Wall screenshots with list endpoints rewritten to their trailing-slash form
(the app's /api/seasons and /api/drivers 307-redirect, which the browser rejects under CORS)."""
import re
from playwright.sync_api import sync_playwright

SHOTS = [
    ("pitwall", "http://localhost:5191/", 7000, None),
    ("pitwall-drivers", "http://localhost:5191/drivers", 6000, None),
    ("pitwall-predict", "http://localhost:5191/predict", 5000, "predict"),
]
LIST = re.compile(r"/api/(seasons|drivers|circuits)(\?.*)?$")


def fix(route):
    url = route.request.url
    m = LIST.search(url)
    if m:
        url = url.replace(f"/api/{m.group(1)}", f"/api/{m.group(1)}/", 1)
    resp = route.fetch(url=url)
    headers = dict(resp.headers)
    headers["access-control-allow-origin"] = "*"
    route.fulfill(response=resp, headers=headers)


with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, url, wait, action in SHOTS:
        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        page.route("http://localhost:8000/api/**", fix)
        page.goto(url, wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(wait)
        if action == "predict":
            try:
                page.get_by_text("2023", exact=True).first.click()
                page.wait_for_timeout(2500)
                page.locator("button, [role=button]").filter(has_text=re.compile("Grand Prix|GP")).first.click()
                page.wait_for_timeout(3000)
            except Exception as e:
                print("predict clicks partial:", e)
        page.screenshot(path=f"public/shots/{name}.png")
        print("ok", name)
        ctx.close()
    browser.close()
