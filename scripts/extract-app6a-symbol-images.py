"""Extract only S-scheme publication illustrations, by table cell and hierarchy.
PDF source pixels are never generated from the library being tested.
"""
import json
import re
import sys
from pathlib import Path
import pdfplumber

OUT=Path("output/app6a-audit/symbols")
OUT.mkdir(parents=True,exist_ok=True)
catalog=json.loads(Path("output/app6a-audit/after.json").read_text())["rows"]
rows={r["hierarchy"]:{k:v for k,v in r.items() if k!="cases"} for r in catalog if r["id"].startswith("S")}
if "--resume" in sys.argv and (OUT/"references.json").exists():
    for previous in json.loads((OUT/"references.json").read_text()):
        if previous.get("cases"): rows[previous["hierarchy"]]=previous
missing_frame_mark={"S-P-T-----","S-A-MFUL--","S-G-UCDMLA","S-G-UUACRW","S-G-UUACRS","S-G-UUABR-","S-G-UUMRSS"}
categories={"S-G-EW----","S-G-EX----","S-G-IM----","S-S-X-----","S-U-N-----","S-S-E-----","S-S-Z-----"}
# These final rows continue across pages. Coordinates are publication points,
# reviewed against the PDF, not inferred from the implementation under test.
continuations={
    "S-A-WMSA--": [(146,True,578.82,631)],
    "S-G-EXN---": [(260,True,587.3,642),(261,False,143.7,196.5)],
    "S-G-EXML--": [(261,True,658.3,712),(262,False,143.7,196.5)],
    "S-G-IME---": [(265,True,640,700)],
    "S-G-IMC---": [(266,True,639.1,700)],
}
source_conflicts={
    "S-A-WM----": {"N":"Neutral missile cell depicts a blue H aircraft instead of a green missile."},
    "S-A-WMA---": {"F":"Friend cell depicts a green L aircraft; inconsistent with this missile row and its affiliation."},
    "S-A-WMAS--": {"U":"Unknown cell depicts a red M aircraft, not this missile.","F":"Friend cell depicts a green M aircraft, not this missile."},
    "S-A-WMAA--": {"N":"Neutral cell depicts a yellow spacecraft, not this missile."},
    "S-F-A-----": {"H":"Hostile aviation cell depicts an unknown NC ship."},
    "S-F-AFU---": {"F":"Friend fixed-wing utility cell depicts a neutral submarine."},
    "S-U-WMOD--": {"U":"Unknown cell depicts an HZ merchant vessel instead of a neutralized mine."},
    "S-U-NM----": {"H":"Hostile cell depicts an HZ merchant vessel instead of marine life."},
    "S-G-EWMAT-": {"*":"Annex B defines EWMAT as theatre; Annex D uses its hierarchy/code for short range without T. Annex B semantics retained pending authoritative resolution."},
    "S-G-EWMAS-": {"*":"Annex B defines EWMAS as short range; Annex D uses its hierarchy/code for theatre with T. Annex B semantics retained pending authoritative resolution."},
    "S-G-EWMAL-": {"*":"Annex B defines EWMAL as long range; Annex D labels the same code/hierarchy intermediate range."},
    "S-G-EWMAI-": {"*":"Annex B defines EWMAI as intermediate range; Annex D labels the same code/hierarchy long range."},
}
printed_pages={}

def clustered(values):
    result=[]
    for value in sorted(values):
        if result and value-result[-1]<1.5: result[-1]=max(result[-1],value)
        else: result.append(value)
    return result

with pdfplumber.open(sys.argv[1]) as pdf:
    for page_index in range(135,268):
        page=pdf.pages[page_index]; words=page.extract_words()
        footer=next((w for w in words if w["text"].isdigit() and 280<w["x0"]<320 and w["top"]>690),None)
        if footer: printed_pages[page_index+1]=int(footer["text"])
        if "TABLE D-" not in " ".join(w["text"] for w in words[:35]): continue
        for word in words:
            if re.fullmatch(r"1\.X(?:\.\d+)+\.",word["text"]):
                suffix=next((w for w in words if re.fullmatch(r"\d+",w["text"]) and abs(w["x0"]-word["x0"])<3 and 0<w["top"]-word["top"]<18),None)
                if suffix: word["text"]+=suffix["text"]
        frame_header=next((w for w in words if w["text"]=="F" and 280<w["x0"]<307 and 90<w["top"]<130),None)
        if not frame_header: continue
        # Both publication table layouts have 57.6 pt affiliation columns.
        left=310 if frame_header["x0"]>296 else 299.2
        right=left+56.8
        outer=clustered(e["top"] for e in page.edges if abs(e["top"]-e["bottom"])<.2 and e["x0"]<100 and e["x1"]>left+220)
        inner=clustered(e["top"] for e in page.edges if abs(e["top"]-e["bottom"])<.2 and e["x0"]<=left+.2 and e["x1"]>=right-.2)
        for anchor in words:
            row=rows.get(anchor["text"])
            if not row or anchor["x0"]<200 or row.get("cases"): continue
            row_lines=clustered(e["top"] for e in page.edges if abs(e["top"]-e["bottom"])<.2 and e["x0"]<=anchor["x0"]+.1 and e["x1"]>=left-18 and e["x0"]<left-20)
            above=[y for y in row_lines if y<anchor["top"]]; below=[y for y in row_lines if y>anchor["bottom"]]
            code_words=[w for w in words if left<w["x0"]<right and w["text"].startswith("S") and anchor["bottom"]<w["top"]<anchor["top"]+170]
            if not above: row["extractionError"]="Unresolved table row"; continue
            top=max(above)
            bottom=min(below) if below else (min(w["top"] for w in code_words)+24 if code_words else None)
            if bottom is None: row["extractionError"]="Unresolved table row"; continue
            frame="".join(w["text"] for w in words if abs(w["x0"]-frame_header["x0"])<3 and top<w["top"]<bottom and w["text"] in ["U","F","O"])
            if not frame and row["id"] in missing_frame_mark:
                frame="F";row["frameNote"]="Frame-column letter omitted in publication; framed illustration used (503.3)."
            if row["id"] in categories:
                row["extractionError"]="Publication taxonomy heading: gray cells, no symbol illustration. No visual conformance claim is possible."
                row["sourceOnlyCategory"]=True; continue
            if frame not in ["F","FO","UF"]: row["extractionError"]=f"Unresolved frame prescription: {frame}"; continue
            boundaries=clustered([top]+[y for y in inner if top+2<y<bottom-2]+[bottom])
            modes=[True,False] if frame=="FO" else [frame=="F"]
            if len(boundaries)<len(modes)+2 and code_words:
                # Some final rows have no table-border drawing operators. Use
                # the observed SIDC text boundary, never a renderer-derived box.
                end=min(w["top"] for w in code_words)-4
                boundaries=[top+(end-top)*i/len(modes) for i in range(len(modes)+1)]+[bottom]
                row["cropNote"]="Final-row boundary recovered from source SIDC text."
            if len(boundaries)<len(modes)+2: row["extractionError"]="Missing illustration/code cell boundary"; continue
            cases=[]
            for index,framed in enumerate(modes):
                for column,affiliation in enumerate(["U","F","N","H"]):
                    box=(left+57.6*column+1.4,boundaries[index]+1.5,right+57.6*column-1.4,boundaries[index+1]-1.5)
                    key=f"{row['id']}-{affiliation}-{'framed' if framed else 'unframed'}"
                    page.crop(box).to_image(resolution=288).original.convert("RGB").save(OUT/(key+"-source.png"))
                    cases.append({"key":key,"affiliation":affiliation,"frame":framed,"pdfPage":page_index+1,"crop":box,"sourceImage":key+"-source.png"})
            row.update({"framePrescription":frame,"cases":cases})
        page.close()
        if page_index%20==0: print(f"PDF {page_index+1}",flush=True)
    for row in rows.values():
        if row["id"] not in continuations: continue
        cases=[]
        for page_number,framed,top,bottom in continuations[row["id"]]:
            page=pdf.pages[page_number-1]
            for column,affiliation in enumerate(["U","F","N","H"]):
                box=(311.4+57.6*column,top,365.4+57.6*column,bottom)
                key=f"{row['id']}-{affiliation}-{'framed' if framed else 'unframed'}"
                page.crop(box).to_image(resolution=288).original.convert("RGB").save(OUT/(key+"-source.png"))
                cases.append({"key":key,"affiliation":affiliation,"frame":framed,"pdfPage":page_number,"crop":box,"sourceImage":key+"-source.png"})
        row.pop("extractionError",None)
        row.update({"cases":cases,"framePrescription":"FO" if len(cases)==8 else "F","cropNote":"Reviewed page-continuation cells; each image retains its actual PDF page and crop coordinates."})
    for row in rows.values():
        if row["id"] in categories:
            row.pop("cases",None)
            row["sourceOnlyCategory"]=True
            row["extractionError"]="Publication taxonomy heading: gray cells, no symbol illustration. No visual conformance claim is possible."
        for case in row.get("cases",[]):
            case["printedPage"]=printed_pages.get(case["pdfPage"])
            conflicts=source_conflicts.get(row["id"],{})
            conflict=conflicts.get(case["affiliation"],conflicts.get("*"))
            if conflict: case["sourceConflict"]=conflict
result=list(rows.values())
(OUT/"references.json").write_text(json.dumps(result,indent=2))
print(f"Source: {sum(bool(r.get('cases')) for r in result)}/{len(result)} S symbols; {sum(len(r.get('cases',[])) for r in result)} image cells")
print("Missing:",[(r['id'],r.get('extractionError')) for r in result if not r.get('cases')])
