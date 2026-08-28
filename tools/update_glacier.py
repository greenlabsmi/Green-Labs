from pathlib import Path

path = Path("script.js")
text = path.read_text()

old = '''    strains: [
      {
        name: "Blast Chiller",
        thc: "30.7%",
        image: "./assets/img/brands/glacier/blast-chiller-deli.png"
      },
      {
        name: "Green Crack",
        thc: "27%",
        image: "./assets/img/brands/glacier/green-crack-deli.png"
      }
    ]'''

new = '''    strains: [
      {
        name: "Green Crack",
        thc: "27%",
        image: "./assets/img/brands/glacier/green-crack-deli.png"
      },
      {
        name: "Super Boof",
        image: "./assets/img/brands/glacier/super-boof-deli.png"
      },
      {
        name: "Blueberry Muffin",
        image: "./assets/img/brands/glacier/blueberry-muffin-deli.png"
      },
      {
        name: "Freezer Jam",
        image: "./assets/img/brands/glacier/freezer-jam-deli.png"
      }
    ]'''

if old not in text:
    raise SystemExit("Expected Glacier strain block was not found; refusing to modify script.js")

path.write_text(text.replace(old, new, 1))
