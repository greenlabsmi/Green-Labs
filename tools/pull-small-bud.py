from pathlib import Path

# Remove Small Bud Deli from current weekend deal data until inventory arrives.
p = Path('deals.json')
s = p.read_text()
for needle in [
    '"Small Bud Deli — $10 per Eighth or $30 per Half",',
    ',"Small Bud Deli — $10 per Eighth or $30 per Half"',
    '"Small Bud Deli — $10 per Eighth or $30 per Half"'
]:
    s = s.replace(needle, '')
# Remove unused weekend highlight tile too, if present.
import re
s = re.sub(r'\s*"small-bud-deli"\s*:\s*\{[^{}]*\},?', '', s)
s = s.replace('"scroll":["small-bud-deli",', '"scroll":[')
p.write_text(s)

# Remove the Small Bud line from the clean weekend popup asset.
p = Path('assets/img/promotions/weekend-highlights.svg')
if p.exists():
    s = p.read_text()
    s = re.sub(r'\s*<[^>]*>[^<]*Small Bud[^<]*</[^>]+>', '', s, flags=re.I)
    p.write_text(s)
