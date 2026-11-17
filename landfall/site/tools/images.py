"""Landfall (working name, a placeholder): image derivatives and manifest.

1. Crops each original in assets-src/<topic>/ to its slot's aspect ratio
   around a focal point and writes WebP width derivatives plus one JPEG
   fallback into public/images/<topic>/, never upscaling.
2. Scans public/images/ and writes lib/images.manifest.json with the real
   size of every derivative, which components/ui/Photo.tsx reads. Image
   sizes are never typed by hand.
Hero and destination files came already cut from landfall/prototype/
(tools/images.py there); this script only lists them.
Usage, from landfall/site/: python -I tools/images.py
Add a group's photos to CROPS with its topic folder, aspect and focal point.
"""
import json
import os
import re

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.dirname(HERE)
SRC = os.path.join(SITE, "assets-src")
PUB = os.path.join(SITE, "public", "images")

# topic/name: (aspect w, aspect h, focal x %, focal y %, widths, fallback width)
CROPS = {
    # Home, How Landfall books (spec 2b: 4:3, radius 16)
    "promo/ferry-deck-puget-sound": (4, 3, 62, 50, [480, 800, 1200], 800),
    "promo/lighthouse-pier-namerikawa": (4, 3, 50, 55, [480, 800, 1200], 800),
    "promo/utrecht-canal-dining": (4, 3, 50, 55, [480, 800, 1200], 800),
    # Group H: hotel and room photos (stand-ins for Duffel's in the demo), 3:2 for the grid, cards and rails
    **{"hotels/" + n: (3, 2, 50, fy, [480, 800, 1200, 1600], 800) for n, fy in [
        ("cl-roof-terrace", 58), ("cl-rooftops", 62), ("cl-lane", 55), ("cl-courtyard", 62), ("cl-courtyard-night", 50),
        ("cl-lounge", 55), ("cl-window-river", 52), ("cl-courtyard-double", 52), ("cl-suite-bridge-view", 44), ("cl-bathroom", 62),
        ("cv-riverfront", 50), ("cv-lobby", 50), ("cv-double", 55), ("cv-twin", 50),
        ("pq-courtyard", 58), ("pq-garden-double", 50), ("pq-twin", 62),
        ("lr-hilltop", 60), ("lr-double", 50), ("lr-triple", 50),
        ("rl-street", 55), ("rl-loft", 50), ("rl-kitchen", 62), ("rl-stair", 58),
        ("at-facade", 50), ("at-double", 50), ("at-twin", 50),
        ("hk-skytree-window", 50), ("hk-double", 50), ("hk-river-twin", 55),
        ("hh-rooftop-view", 50), ("hh-facade", 50), ("hh-loft-king", 50), ("hh-loft-double", 50)]},
    # Group H: About banner (21:9), 404 and Contact (3:2), the image rule
    "pages/harbour-first-light": (21, 9, 50, 55, [800, 1200, 1600], 1200),
    "pages/quay-colunas": (3, 2, 50, 42, [800, 1400, 2000], 1400),
    "pages/harbour-dawn-boats": (3, 2, 50, 55, [480, 800, 1200], 800),
    # Round 3, Developer A: the Lisbon fares banner (3:2, uncropped, the banner places it by object-position)
    "home/lisbon-cais-sodre": (3, 2, 50, 50, [480, 800, 1200, 1600, 2000], 1200),
    # Round 3, Developer A: city water photos for the home rails, banners and the route board (4:3, the image rule)
    **{"home/" + n: (4, 3, fx, fy, [480, 800, 1200, 1600], 800) for n, fx, fy in [
        ("barcelona-sea", 50, 55), ("paris-pont-neuf", 50, 58), ("amsterdam-canal", 50, 62), ("singapore-bay", 50, 55),
        ("sydney-harbour", 50, 52), ("athens-mikrolimano", 50, 50), ("bangkok-river", 50, 58), ("miami-beach", 50, 55),
        ("toronto-lake", 50, 55), ("los-angeles-pier", 50, 55), ("cancun-sea", 50, 50), ("rio-sugarloaf", 50, 55), ("buenos-aires-madero", 50, 55),
        ("copenhagen-nyhavn", 50, 55), ("reykjavik-harpa", 50, 55), ("dubai-marina", 50, 55), ("marrakech-riad-pool", 50, 60), ("nairobi-park", 50, 55)]},
}


def crop(im, aw, ah, fx, fy):
    w, h = im.size
    if w / h > aw / ah:
        nw, nh = round(h * aw / ah), h
    else:
        nw, nh = w, round(w * ah / aw)
    left = min(max(round(w * fx / 100 - nw / 2), 0), w - nw)
    top = min(max(round(h * fy / 100 - nh / 2), 0), h - nh)
    return im.crop((left, top, left + nw, top + nh))


for key, (aw, ah, fx, fy, widths, fbw) in CROPS.items():
    topic, name = key.split("/")
    src = os.path.join(SRC, topic, name + ".jpg")
    if not os.path.exists(src):
        continue
    os.makedirs(os.path.join(PUB, topic), exist_ok=True)
    im = crop(Image.open(src).convert("RGB"), aw, ah, fx, fy)
    for tw in widths:
        if tw > im.width:
            continue
        im.resize((tw, round(im.height * tw / im.width)), Image.LANCZOS).save(
            os.path.join(PUB, topic, "%s-%d.webp" % (name, tw)), "WEBP", quality=78, method=6)
    fw = min(fbw, im.width)
    im.resize((fw, round(im.height * fw / im.width)), Image.LANCZOS).save(
        os.path.join(PUB, topic, "%s-%d.jpg" % (name, fw)), "JPEG", quality=80, optimize=True, progressive=True)

manifest = {}
pat = re.compile(r"^(.*)-(\d+)\.(webp|jpg)$")
for topic in sorted(os.listdir(PUB)):
    folder = os.path.join(PUB, topic)
    if not os.path.isdir(folder):
        continue
    for f in sorted(os.listdir(folder)):
        m = pat.match(f)
        if not m:
            continue
        name, _, ext = m.groups()
        w, h = Image.open(os.path.join(folder, f)).size
        e = manifest.setdefault(topic + "/" + name, {"webp": [], "fallback": None})
        if ext == "webp":
            e["webp"].append([w, h])
        else:
            e["fallback"] = {"src": "/images/%s/%s" % (topic, f), "w": w, "h": h}
for e in manifest.values():
    e["webp"].sort()
with open(os.path.join(SITE, "lib", "images.manifest.json"), "w") as fh:
    json.dump(manifest, fh, indent=1)
print(len(manifest), "images in the manifest")
