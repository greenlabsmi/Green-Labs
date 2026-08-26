from pathlib import Path
import re

HTML_PATH = Path("firstfriday/index.html")
CSS_PATH = Path("firstfriday/first-friday.css")
JS_PATH = Path("firstfriday/first-friday.js")
MARKER = "FF-MODULAR-2026-08-26"

html = HTML_PATH.read_text(encoding="utf-8")

if MARKER in html:
    print("First Friday modular refactor already applied.")
    raise SystemExit(0)

# --- 1. Extract the page-level inline stylesheet exactly as-is. ---
style_matches = list(re.finditer(r"<style(?P<attrs>[^>]*)>(?P<css>.*?)</style>", html, flags=re.S | re.I))
if len(style_matches) != 1:
    raise SystemExit(f"Expected exactly one inline <style> block, found {len(style_matches)}")

style_match = style_matches[0]
css = style_match.group("css").strip("\n") + "\n"
CSS_PATH.write_text(
    "/* Green Labs First Friday — extracted from index.html on 2026-08-26. */\n"
    "/* Keep page-specific styling here so index.html stays easy to maintain. */\n\n"
    + css,
    encoding="utf-8",
)

css_link = '<link rel="stylesheet" href="./first-friday.css?v=20260826">'
html = html[: style_match.start()] + css_link + html[style_match.end() :]

# --- 2. Extract every inline script, preserving its original order. ---
# External scripts (e.g. featured-brand-game.js) remain exactly where they are.
inline_script_pattern = re.compile(
    r"<script(?P<attrs>(?![^>]*\\bsrc\\s*=)[^>]*)>(?P<js>.*?)</script>",
    flags=re.S | re.I,
)

scripts = []

def collect_script(match):
    attrs = match.group("attrs").strip()
    # Do not move JSON/data script blocks; there currently are none, but this
    # guard makes the refactor safe if one is added later.
    if attrs and re.search(r'type\\s*=\\s*["\\\'](?:application|importmap)', attrs, flags=re.I):
        return match.group(0)
    scripts.append(match.group("js").strip("\n"))
    return ""

html = inline_script_pattern.sub(collect_script, html)

if not scripts:
    raise SystemExit("No inline JavaScript blocks found; refusing to rewrite HTML.")

js_header = (
    "// Green Labs First Friday — extracted from index.html on 2026-08-26.\n"
    "// Page behavior only. The featured Batch game remains modular in assets/js/featured-brand-game.js.\n\n"
)
JS_PATH.write_text(js_header + "\n\n".join(scripts) + "\n", encoding="utf-8")

# Load consolidated page behavior at the end of body so the DOM is available.
js_tag = '<script src="./first-friday.js?v=20260826"></script>'
body_close = html.rfind("</body>")
if body_close == -1:
    raise SystemExit("Could not find </body>; refusing to rewrite HTML.")
html = html[:body_close] + f"  {js_tag}\n" + html[body_close:]

# Add a small marker near the document header for idempotence and easy auditing.
html = html.replace(
    "<html lang=\"en\">",
    f'<html lang="en">\n<!-- {MARKER} -->',
    1,
)

HTML_PATH.write_text(html, encoding="utf-8")

# --- 3. Sanity checks before the workflow is allowed to commit anything. ---
updated_html = HTML_PATH.read_text(encoding="utf-8")
updated_css = CSS_PATH.read_text(encoding="utf-8")
updated_js = JS_PATH.read_text(encoding="utf-8")

checks = {
    "HTML references extracted CSS": "./first-friday.css?v=20260826" in updated_html,
    "HTML references extracted JS": "./first-friday.js?v=20260826" in updated_html,
    "Main inline style removed": "<style" not in updated_html.lower(),
    "First Friday title preserved": "FIRST FRIDAY" in updated_html,
    "Event details preserved": 'id="event-details"' in updated_html,
    "Lemon Wookie preserved": "Lemon Wookie" in updated_html,
    "Batch showcase preserved": "ff-batch-showcase" in updated_html,
    "Featured Batch game external script preserved": "featured-brand-game.js" in updated_html,
    "Countdown CSS preserved": ".ff-countdown" in updated_css,
    "Batch button CSS preserved": ".fb-operation-button" in updated_css,
    "Countdown JS preserved": "updateEventStatus" in updated_js,
    "Calendar JS preserved": "first-friday-green-labs.ics" in updated_js,
    "Native maps JS preserved": "maps.apple.com" in updated_js,
}

failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("Refactor sanity check failed: " + "; ".join(failed))

print("First Friday modular refactor completed successfully.")
print(f"HTML: {HTML_PATH.stat().st_size:,} bytes")
print(f"CSS:  {CSS_PATH.stat().st_size:,} bytes")
print(f"JS:   {JS_PATH.stat().st_size:,} bytes")
