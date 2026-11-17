"""travel-booking prototype: text contrast against the pixels really behind it.

Input: a JSON of text boxes per capture ({capture: {name: [x, y, w, h,
"rgb(r, g, b)", size, weight]}}) and, per capture, a screenshot taken
with every text colour, icon and glyph set to transparent, saved as
bg-<capture>.png in the same folder as the JSON. For each box it reads
every background pixel and reports the worst and median contrast against
the text colour, and whether it passes (4.5:1, or 3:1 for large text:
24px and up, or 18.66px and up at 700).

Run:  python -I tools/sample_contrast.py <samples.json>
"""
import json
import re
import statistics
import sys
from pathlib import Path

from PIL import Image


def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def lum(rgb):
    r, g, b = rgb[:3]
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def main(path):
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    folder = Path(path).parent
    worst_all = []
    for cap, boxes in data.items():
        name = cap.replace("-scrolled-1440", "-scrolled-1440")
        img = Image.open(folder / f"bg-{name}.png").convert("RGB")
        W, H = img.size
        print(f"\n== {cap} ({W}x{H})")
        for key, box in boxes.items():
            x, y, w, h, color, size, weight = box[:7]
            # an optional 8th value is the element's opacity: the text is
            # then blended over each pixel before the ratio is taken
            alpha = float(box[7]) if len(box) > 7 else 1.0
            fg = tuple(int(v) for v in re.findall(r"\d+", color)[:3])
            x0, y0 = max(0, x), max(0, y)
            x1, y1 = min(W, x + w), min(H, y + h)
            if x1 <= x0 or y1 <= y0:
                continue
            px = list(img.crop((x0, y0, x1, y1)).getdata())
            rs = [ratio(tuple(fg[i] * alpha + p[i] * (1 - alpha) for i in range(3)), p) for p in px]
            px_size = float(size.rstrip("px"))
            large = px_size >= 24 or (px_size >= 18.66 and int(weight) >= 700)
            need = 3.0 if large else 4.5
            worst, med = min(rs), statistics.median(rs)
            ok = "pass" if worst >= need else "FAIL"
            worst_all.append((worst, cap, key))
            print(f"  {key:13s} {size:>9s}/{weight}  worst {worst:5.2f}  median {med:5.2f}  need {need}  {ok}")
    print("\nlowest five:", sorted(worst_all)[:5])


if __name__ == "__main__":
    main(sys.argv[1])
