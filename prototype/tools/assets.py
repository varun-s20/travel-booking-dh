"""travel-booking prototype: prepare media and fonts for assets/.

What it does, and why:
- Crops the hero photo's dark lower-right corner (the camera's own window
  frame) and writes WebP width derivatives plus one JPEG fallback into
  assets/images/hero/, with a manifest of real sizes for srcset.
- Copies the three self-hosted Calibre woff2 files from the project's
  fonts/calibre/ into assets/fonts/ (Calibre ships in 200, 400, 700 only).
The colour grade is not baked in: it is an SVG filter per palette (see
tools/grade_filter.py), so both palette versions share these files.

Run from the prototype folder:  python -I tools/assets.py
Needs Pillow. Never upscales. Rerunning changes nothing if inputs match.
"""
import json
import shutil
import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent          # prototype/
PROJECT = ROOT.parent                                   # projects/travel-booking/

HERO_SRC = ROOT / "assets/images/audition/wing-over-pastel-clouds.jpg"
HERO_OUT = ROOT / "assets/images/hero"
HERO_NAME = "wing-over-clouds"
# The source is 2400x1600. Its bottom-right corner shows the camera's own
# window frame as a dark wedge; 60px off the right and bottom removes it.
HERO_CROP = (0, 0, 2340, 1540)
# Widths fitted to the window row: 358px wide at 390 (x2 = 716, so 800),
# about 1300 at 1440 with the drift margin (x2 = 2600, capped by the source).
HERO_WIDTHS = (800, 1200, 1600, 2340)

FONTS_SRC = PROJECT / "fonts/calibre"
FONTS_OUT = ROOT / "assets/fonts"
FONT_FILES = ("Calibre-Thin.woff2", "Calibre-Regular.woff2", "Calibre-Bold.woff2")


def hero():
    HERO_OUT.mkdir(parents=True, exist_ok=True)
    im = Image.open(HERO_SRC).convert("RGB").crop(HERO_CROP)
    manifest = {"name": HERO_NAME, "width": im.width, "height": im.height, "files": []}
    for w in HERO_WIDTHS:
        if w > im.width:
            continue
        h = round(im.height * w / im.width)
        out = HERO_OUT / f"{HERO_NAME}-{w}.webp"
        im.resize((w, h), Image.LANCZOS).save(out, "WEBP", quality=82, method=6)
        manifest["files"].append({"file": out.name, "width": w, "height": h})
    fallback = HERO_OUT / f"{HERO_NAME}.jpg"
    fw = 1600
    im.resize((fw, round(im.height * fw / im.width)), Image.LANCZOS).save(
        fallback, "JPEG", quality=84, optimize=True, progressive=True)
    manifest["fallback"] = {"file": fallback.name, "width": fw, "height": round(im.height * fw / im.width)}
    (HERO_OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest


def fonts():
    FONTS_OUT.mkdir(parents=True, exist_ok=True)
    copied = []
    for name in FONT_FILES:
        src, dst = FONTS_SRC / name, FONTS_OUT / name
        if not dst.exists() or dst.read_bytes() != src.read_bytes():
            shutil.copyfile(src, dst)
        copied.append(name)
    return copied


if __name__ == "__main__":
    m = hero()
    f = fonts()
    print(json.dumps({"hero": m, "fonts": f}, indent=2))
    sys.exit(0)
