"""Landfall prototype: hero image derivatives.

Reads the downloaded Unsplash originals (path given on the command line) and
writes WebP width derivatives plus one JPEG fallback into assets/images/hero/,
never upscaling, then prints a manifest of real sizes for the HTML.
Usage: python -I tools/images.py <folder with full-*.jpg>
"""
import json
import os
import sys

from PIL import Image

SRC = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "images", "hero")
os.makedirs(OUT, exist_ok=True)

# Unsplash photo id -> file name (what the photo shows), widths for a full-bleed hero.
PHOTOS = {
    "1653580978823-2f087049fa04": "lisbon-alfama-river",
    "1580737157337-80734f341721": "cape-town-waterfront",
    "1664995190172-63cacb7b39e5": "new-york-harbour",
}
WIDTHS = [960, 1600, 2400]

manifest = {}
for pid, name in PHOTOS.items():
    im = Image.open(os.path.join(SRC, "full-" + pid + ".jpg")).convert("RGB")
    w, h = im.size
    entry = {"width": w, "height": h, "webp": []}
    for tw in WIDTHS:
        if tw > w:
            continue
        th = round(h * tw / w)
        im.resize((tw, th), Image.LANCZOS).save(
            os.path.join(OUT, "%s-%d.webp" % (name, tw)), "WEBP", quality=78, method=6)
        entry["webp"].append(tw)
    fw = 1600
    im.resize((fw, round(h * fw / w)), Image.LANCZOS).save(
        os.path.join(OUT, "%s-%d.jpg" % (name, fw)), "JPEG", quality=80, optimize=True, progressive=True)
    manifest[name] = entry

print(json.dumps(manifest, indent=1))
