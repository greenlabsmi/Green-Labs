from pathlib import Path

# 1) Never let weekend pricing replace the homepage highlight cards.
p = Path('script.js')
s = p.read_text()
old = 'highlights: weekend.highlights || data.highlights'
new = 'highlights: data.highlights'
if old not in s and new not in s:
    raise SystemExit('Could not find weekend highlight override')
s = s.replace(old, new)
p.write_text(s)

# 2) Stop pre-event First Friday takeover; use a clean weekend deals popup instead.
p = Path('assets/js/promotions.js')
s = p.read_text()

marker = '    firstFriday: {\n'
if '    weekendHighlights: {' not in s:
    insert = '''    weekendHighlights: {
      enabled: true,
      banner: {
        headline: "✨ WEEKEND HIGHLIGHTS",
        products: "$15 SHAKE OZ · $20 GRIP OZ · 9/$20 DOPE ROPES + MIDWEST",
        offer: "SEE ALL WEEKEND DEALS"
      },
      hero: {
        image: "assets/img/deli-drop-aug-hero.jpg",
        position: "center",
        href: "#deli",
        ariaLabel: "Shop Green Labs deli flower"
      },
      popup: {
        id: "weekend-highlights-2026-08",
        enabled: true,
        frequency: "daily",
        delay: 5000,
        type: "image",
        image: "assets/img/promotions/weekend-highlights.svg",
        video: "",
        poster: "",
        alt: "Green Labs weekend highlight deals",
        href: "#deals",
        ariaLabel: "View all Green Labs weekend deals",
        tabText: "WEEKEND DEALS"
      }
    },

'''
    if marker not in s: raise SystemExit('Could not find First Friday campaign')
    s = s.replace(marker, insert + marker, 1)

s = s.replace('start: "2026-08-28",\n      end: "2026-09-04"', 'start: "2026-09-04",\n      end: "2026-09-04"')
s = s.replace('    4: "thirstyThursday"\n', '    4: "thirstyThursday",\n    5: "weekendHighlights",\n    6: "weekendHighlights",\n    0: "weekendHighlights"\n')
p.write_text(s)
