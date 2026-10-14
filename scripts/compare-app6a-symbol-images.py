"""Compare all extracted S-symbol image pairs; scores are review triage only."""
import json
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image,ImageDraw
from app6a_image_metrics import normalize,compare
OUT=Path("output/app6a-audit/symbols")
rows=json.loads((OUT/"inputs.json").read_text());failures=[]
previous={};last_run=0
if "--resume" in sys.argv and (OUT/"comparison.json").exists():
    last_run=(OUT/"comparison.json").stat().st_mtime
    previous={c["key"]:c for r in json.loads((OUT/"comparison.json").read_text())["rows"] for c in r.get("cases",[])}
def compare_case(case):
        old=previous.get(case["key"])
        files=[case["sourceImage"]]+[v["image"] for v in case["variants"]]
        if old and old.get("comparison") and all((OUT/f).stat().st_mtime<last_run for f in files):
            case["comparison"]=old["comparison"]
            if old.get("error"): case["error"]=old["error"]
            return
        key=case["key"];expected=normalize(Image.open(OUT/case["sourceImage"]))
        if expected is None:
            case["error"]="Empty publication cell";failures.append(key);return
        expected.save(OUT/(key+"-expected.png"));candidates=[]
        for variant in case["variants"]:
            actual=normalize(Image.open(OUT/variant["image"]))
            if actual is None: actual=Image.new("RGB",expected.size,"white");case["error"]="Renderer produced an empty icon"
            score,color,overlay=compare(expected,actual)
            candidates.append((score,color,variant,actual,overlay))
        score,color,variant,actual,overlay=max(candidates,key=lambda item:item[0])
        actual.save(OUT/(key+"-actual.png"));overlay.save(OUT/(key+"-difference.png"))
        if (OUT/(key+"-baseline.png")).exists():
            before=normalize(Image.open(OUT/(key+"-baseline.png")))
            if before is None: before=Image.new("RGB",expected.size,"white")
            before.save(OUT/(key+"-before.png"))
            before_score,before_color,_=compare(expected,before)
        else: before_score=before_color=None
        case["comparison"]={"outlineSimilarity":round(score,4),"colorMAE":round(color,4),"strokeWidth":variant["strokeWidth"],"beforeOutlineSimilarity":before_score,"beforeColorMAE":before_color,"status":"visual-review-required"}
with ThreadPoolExecutor(max_workers=8) as pool:
    for count,_ in enumerate(pool.map(compare_case,[c for r in rows for c in r.get("cases",[])]),1):
        if count%400==0: print(f"Compared {count} pairs",flush=True)
result={"scope":"S only — excludes G tactical graphics","method":"Independent APP-6A PDF cells; four affiliations; only F/FO/UF frame modes illustrated in the publication. Tight foreground crop, aspect-preserving 256px normalization; disclosed best stroke width 1–4; 2px edge tolerance. Color error reported separately. Before uses the preserved pre-fix snapshot at stroke 3. Scores are triage, not automatic conformance certification.","rows":rows}
(OUT/"comparison.json").write_text(json.dumps(result,indent=2))
print(f"Compared {sum(len(r.get('cases',[])) for r in rows)} publication pairs for {len(rows)} S symbols. Empty cells: {failures}")
# Review every distinct symbol in the friend variant, worst similarities first.
ordered=[]
for row in rows:
    case=next((c for c in row.get("cases",[]) if c["affiliation"]=="F" and c.get("comparison")),None)
    if case: ordered.append((row,case))
ordered.sort(key=lambda item:item[1]["comparison"]["outlineSimilarity"])
for start in range(0,len(ordered),24):
    sheet=Image.new("RGB",(1200,1440),"#edf1f4");draw=ImageDraw.Draw(sheet)
    for pos,(row,case) in enumerate(ordered[start:start+24]):
        x=pos%3*400;y=pos//3*180;draw.text((x+8,y+5),f"{row['id']} {case['comparison']['outlineSimilarity']:.0%} PDF {case['pdfPage']}",fill="black")
        for offset,suffix in [(0,"expected"),(190,"actual")]:
            im=Image.open(OUT/(case["key"]+"-"+suffix+".png"));im.thumbnail((150,150));sheet.paste(im,(x+15+offset,y+25))
    sheet.save(OUT/f"review-{start//24+1}.png")
