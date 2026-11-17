"""Landfall: sample palette candidates from the hero photo, and check contrast.

Samples the median colour of named regions of the Lisbon hero photo (sky top,
river, sunlit roofs, lit facades, shadowed roofs), then prints WCAG 2.x contrast
ratios for every text and control pair in both palettes.
Usage: python -I tools/palette.py <path to lisbon original>
"""
import sys

from PIL import Image

im = Image.open(sys.argv[1]).convert("RGB")
W, H = im.size


def region(x0, y0, x1, y1):
    """Median colour of a box given in fractions of the photo."""
    box = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H))).resize((60, 60))
    px = list(box.getdata())
    out = []
    for c in range(3):
        vals = sorted(p[c] for p in px)
        out.append(vals[len(vals) // 2])
    return "#%02X%02X%02X" % tuple(out)


samples = {
    "sky top": region(.05, .0, .6, .12),
    "sky mid": region(.05, .25, .6, .4),
    "river": region(.55, .6, .85, .66),
    "roof sunlit": region(.02, .82, .2, .95),
    "roof mid": region(.38, .8, .5, .9),
    "facade lit": region(.4, .7, .55, .78),
    "shadow": region(.55, .83, .62, .9),
}
for k, v in samples.items():
    print("%-12s %s" % (k, v))


def lum(hexc):
    hexc = hexc.lstrip("#")
    rgb = [int(hexc[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in rgb]
    return .2126 * lin[0] + .7152 * lin[1] + .0722 * lin[2]


def ratio(a, b):
    la, lb = sorted([lum(a), lum(b)], reverse=True)
    return (la + .05) / (lb + .05)


PAIRS = {
    "navy": [
        ("ink", "#0B1830", "white", "#FFFFFF"),
        ("ink", "#0B1830", "mist", "#EAF2F4"),
        ("navy", "#0F2747", "white", "#FFFFFF"),
        ("white", "#FFFFFF", "navy", "#0F2747"),
        ("muted", "#4A5A70", "white", "#FFFFFF"),
        ("muted", "#4A5A70", "mist", "#EAF2F4"),
        ("teal", "#0A7C78", "white", "#FFFFFF"),
        ("teal", "#0A7C78", "mist", "#EAF2F4"),
        ("teal bright", "#4FD1C1", "navy", "#0F2747"),
        ("navy", "#0F2747", "teal bright", "#4FD1C1"),
        ("teal bright", "#4FD1C1", "ink", "#0B1830"),
        ("line ctrl", "#7C8A9C", "white", "#FFFFFF"),
    ],
    "harbour": [
        ("ink", "#1A1712", "sand", "#FBF6EF"),
        ("sea", "#173B4F", "sand", "#FBF6EF"),
        ("sand", "#FBF6EF", "sea", "#173B4F"),
        ("white", "#FFFFFF", "sea", "#173B4F"),
        ("muted", "#5E5548", "sand", "#FBF6EF"),
        ("muted", "#5E5548", "shell", "#F3E9DC"),
        ("terracotta", "#A34A26", "sand", "#FBF6EF"),
        ("terracotta", "#A34A26", "white", "#FFFFFF"),
        ("gold", "#E6B56A", "sea", "#173B4F"),
        ("sea", "#173B4F", "gold", "#E6B56A"),
        ("gold", "#E6B56A", "ink", "#1A1712"),
        ("line ctrl", "#8E8373", "white", "#FFFFFF"),
    ],
}
for name, pairs in PAIRS.items():
    print("\n" + name)
    for fn, f, bn, b in pairs:
        print("  %-12s %s on %-12s %s  %.2f:1" % (fn, f, bn, b, ratio(f, b)))
