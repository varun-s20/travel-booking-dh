"""travel-booking prototype: paste design/tokens.css into assets/global.css.

The build conventions want the tokens pasted, not imported, as the first
:root block of global.css. This keeps the two files identical: it
replaces everything between the "tokens:start" and "tokens:end" comments
in global.css with the token blocks from design/tokens.css (from its
first ":root {" to the end). Edit tokens.css, then run:

    python -I tools/sync_tokens.py          (from the prototype folder)
    python -I tools/sync_tokens.py --check  (fails if they differ)
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKENS = ROOT.parent / "design/tokens.css"
GLOBAL = ROOT / "assets/global.css"
START, END = "/* tokens:start (pasted from design/tokens.css by tools/sync_tokens.py; edit that file) */", "/* tokens:end */"


def main():
    tokens = TOKENS.read_text(encoding="utf-8")
    body = tokens[tokens.index(":root {"):].rstrip() + "\n"
    css = GLOBAL.read_text(encoding="utf-8")
    a, b = css.index(START) + len(START), css.index(END)
    new = css[:a] + "\n" + body + css[b:]
    if "--check" in sys.argv:
        if new != css:
            print("global.css tokens differ from design/tokens.css")
            return 1
        print("tokens in step")
        return 0
    if new != css:
        GLOBAL.write_text(new, encoding="utf-8", newline="\n")
        print("global.css tokens updated")
    else:
        print("no change")
    return 0


if __name__ == "__main__":
    sys.exit(main())
