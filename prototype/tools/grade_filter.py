"""travel-booking: print the SVG colour-grade filter for each palette.

The grade is a split tone: the photo keeps most of its colour, then a
gradient map built from the palette (ink in the shadows, the deep colour
in the low mids, a cool mid, the warm light, the ground in the highlights)
is mixed over it. Doing it as an SVG filter keeps one set of image files
for both palette versions; the active palette picks the filter through
--fx-grade in tokens.css.

Run:  python -I tools/grade_filter.py   (prints the <filter> elements to
paste into the header sprite). Tune STOPS or STRENGTH here, never by hand
in the SVG.
"""

PALETTES = {
    # Night navy (revision 2026-11-11, the default): the sea goes to deep navy, the
    # haze over the coast to a pale teal, the highlights stay white. Harbour gold left
    # Overwing on 2026-11-11 (redesign note), so its filter is gone.
    "navy": {
        # critic 11 Nov: at 0.42 the coast went cold and grey; now most of the photo's own light stays
        "strength": 0.2, "saturate": 0.96,
        "stops": [(0.00, "#06142A"), (0.28, "#0D2B4C"), (0.52, "#3F7F88"),
                  (0.76, "#BFDCDF"), (0.90, "#E9F4F5"), (1.00, "#FFFFFF")],
    },
    # Cabin dawn: the photo it was sampled from, only pulled together.
    "cabin": {
        "strength": 0.18, "saturate": 0.96,
        "stops": [(0.00, "#121D20"), (0.30, "#1F3B41"), (0.55, "#6E8E93"),
                  (0.76, "#D9C3C2"), (0.90, "#F3E4E2"), (1.00, "#FFFBFA")],
    },
}
SAMPLES = 21  # evenly spaced table entries; feFuncX tables must be even


def hex_rgb(h):
    return [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]


def sample(stops, x):
    for (a, ca), (b, cb) in zip(stops, stops[1:]):
        if a <= x <= b:
            t = (x - a) / (b - a)
            ra, rb = hex_rgb(ca), hex_rgb(cb)
            return [ra[i] * (1 - t) + rb[i] * t for i in range(3)]
    return hex_rgb(stops[-1][1])


def filter_svg(name, p):
    xs = [i / (SAMPLES - 1) for i in range(SAMPLES)]
    rows = [sample(p["stops"], x) for x in xs]
    chan = [" ".join(f"{r[c]:.3f}" for r in rows) for c in range(3)]
    k = p["strength"]
    return (
        f'<filter id="fx-grade-{name}" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">'
        f'<feColorMatrix in="SourceGraphic" type="saturate" values="{p["saturate"]}" result="base"/>'
        f'<feColorMatrix in="SourceGraphic" type="saturate" values="0" result="grey"/>'
        f'<feComponentTransfer in="grey" result="map">'
        f'<feFuncR type="table" tableValues="{chan[0]}"/>'
        f'<feFuncG type="table" tableValues="{chan[1]}"/>'
        f'<feFuncB type="table" tableValues="{chan[2]}"/>'
        f'</feComponentTransfer>'
        f'<feComposite in="base" in2="map" operator="arithmetic" k1="0" k2="{1 - k:.2f}" k3="{k:.2f}" k4="0"/>'
        f'</filter>'
    )


if __name__ == "__main__":
    for n, p in PALETTES.items():
        print(filter_svg(n, p))
