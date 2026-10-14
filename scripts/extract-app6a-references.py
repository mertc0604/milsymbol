"""Extract publication rows, not renderer-derived expectations. Requires pdfplumber.
Usage: python scripts/extract-app6a-references.py /path/to/APP_6_A_.pdf
The source PDF and generated crops remain local and are not redistributed.
"""
import json
import re
import sys
from pathlib import Path
import pdfplumber

out = Path("output/app6a-audit")
(out / "references").mkdir(parents=True, exist_ok=True)
references = {}
with pdfplumber.open(sys.argv[1]) as pdf:
    for index in range(133, 353):
        page = pdf.pages[index]
        words = page.extract_words()
        # Some long hierarchy identifiers wrap after the final dot (e.g. .6.1. / 10).
        for word in words:
            if re.fullmatch(r"[12]\.X(?:\.\d+)+\.", word["text"], re.I):
                continuation = next((candidate for candidate in words if re.fullmatch(r"\d+", candidate["text"]) and abs(candidate["x0"]-word["x0"]) < 3 and 0 < candidate["top"]-word["top"] < 18), None)
                if continuation:
                    word["text"] += continuation["text"]
        title = " ".join(w["text"] for w in words[:35])
        if not ("TABLE D-" in title or "TABLE E-" in title):
            continue
        anchors = [w for w in words if re.fullmatch(r"[12]\.X(?:\.\d+)+", w["text"], re.I) and w["x0"] > 130]
        for n, anchor in enumerate(anchors):
            hierarchy = anchor["text"].upper()
            if hierarchy in references:
                continue
            top = max(0, anchor["top"] - 5)
            bottom = anchors[n+1]["top"] - 6 if n+1 < len(anchors) else min(page.height-60, 730)
            if bottom <= top:
                continue
            filename = f"{hierarchy}.png"
            # Include description, hierarchy, all affiliations and both frame modes.
            page.crop((55, top, min(page.width-30, 560), bottom)).to_image(resolution=140).save(out / "references" / filename)
            shapes = [s for s in page.curves if s["x0"] > 310 and top <= s["top"] < bottom and s.get("fill")]
            colors = sorted(set(str(s.get("non_stroking_color")) for s in shapes))
            frame = "".join(w["text"] for w in words if 299 <= w["x0"] <= 305 and top <= w["top"] < bottom and w["text"] in ["F", "O", "U"])
            references[hierarchy] = {"pdfPage": index+1, "image": f"references/{filename}", "vectorColors": colors, "frame": frame if frame in ["F", "FO", "UF"] else None, "method": "Hierarchy-matched row crop; visual review required"}
        page.close()
        if index % 20 == 0:
            print(f"PDF page {index+1}: {len(references)} rows", flush=True)
(out / "references.json").write_text(json.dumps(references, indent=2))
print(f"Extracted {len(references)} reference rows")
