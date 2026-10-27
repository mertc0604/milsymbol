// Usage: pdftotext -layout APP_6_A_.pdf app6a.txt
//        node scripts/extract-app6a.mjs app6a.txt
// Emits a reviewed-source candidate, not an automatic replacement for the catalog.
import fs from "node:fs";
import nato from "stanag-app6";

const text = fs.readFileSync(process.argv[2], "utf8");
const rows = [];
// Function code columns may contain digits (supply classes US S1-- … S9--).
const rowPattern =
  /^(\d\.X[\d.]*?)\s+([SG])\s+([A-Z*\-]+)\s+([A-Z\-]+)\s+([A-Z*\-]+)\s+([A-Z0-9\-]+)\s+([A-Z0-9\-]+)\s+([A-Z0-9\-]+)\s+([A-Z*\-]+)\s+([A-Z*\-]+)\s+([A-Z*\-]+)\s+(.+)/;
for (const [pageIndex, page] of text.split("\f").entries()) {
  if (!page.includes("TABLE B-")) continue;
  const footer = [...page.matchAll(/^\s*(\d{2,3})\s*$/gm)].at(-1);
  let previous;
  let nameColumn;
  for (const line of page.split("\n")) {
    const match = line.match(rowPattern);
    if (match) {
      const [, hierarchy, scheme, affiliation, dimension, status, a, b, c, modifier, , , name] =
        match;
      previous = undefined;
      if (dimension === "-" || dimension.length !== 1) continue;
      let code = a + b + c;
      let note = "";
      if (hierarchy === "1.X.3.1.1.8.7" && code === "UCRLL--") {
        code = "UCRL--";
        note =
          "Publication prints seven function characters (UCRLL--); normalized to the six-character light reconnaissance code UCRL--.";
      }
      if (code.length !== 6)
        throw new Error(
          `Invalid function code on PDF page ${pageIndex + 1}: ${code}`
        );
      previous = {
        id: `${scheme}-${dimension}-${code}`,
        hierarchy,
        name,
        modifier,
        page: Number(footer?.[1]),
        pdfPage: pageIndex + 1,
        ...(/^[A-Z]$/.test(affiliation) ? { affiliation } : {}),
        ...(/^[A-Z]$/.test(status) ? { status } : {}),
        ...(note ? { note } : {})
      };
      nameColumn = line.lastIndexOf(name);
      rows.push(previous);
    } else if (
      previous &&
      line.trim() &&
      line.search(/\S/) >= nameColumn - 2 &&
      !/^\s*\d+\s*$/.test(line)
    ) {
      previous.name += " " + line.trim();
    } else if (line.trim()) {
      previous = undefined;
    }
  }
}

// Reuse only the existing renderer's single-glyph tactical points, intersected
// with the APP-6A publication. Never import APP-6B catalog entries into APP-6A.
const renderer = fs.readFileSync(
  new URL("../src/lettersidc/sidc/tactical-points-app6.js", import.meta.url),
  "utf8"
);
const tacticalIds = new Set(
  [...renderer.matchAll(/sidc\["(G-[A-Z]-[A-Z-]{6})"\]/g)].map((m) => m[1])
);
const symbols = rows.filter((row) => {
  // SPM--- also names a non-drawable ammunition category. Its children have
  // unambiguous codes. OXRD-- means both DLRP and Diversions: do not guess.
  if (row.hierarchy === "2.X.2.4.1.15" || row.id === "G-C-OXRD--") return false;
  return row.id[0] === "S" || tacticalIds.has(row.id);
});
const unique = new Map();
for (const row of symbols) {
  if (unique.has(row.id)) {
    throw new Error(`Duplicate publication SIDC ${row.id}`);
  }
  unique.set(row.id, row);
}
// Diagnostic only: APP-6B's geometry field highlights point candidates that
// require manual review; it does not determine APP-6A membership or names.
const bPoints = new Set();
function walk(node) {
  if (!node || typeof node !== "object") return;
  for (const item of node.mainIcon || [])
    if (item.geometry === "POINT")
      bPoints.add(
        `${item.codingscheme}-${item.battledimension}-${item.functionid}`
      );
  for (const [key, child] of Object.entries(node))
    if (key !== "mainIcon") walk(child);
}
walk(nato.app6b);
console.error(
  JSON.stringify(
    {
      war: symbols.filter((x) => x.id[0] === "S").length,
      tactical: symbols.filter((x) => x.id[0] === "G").length,
      excludedPointCandidates: rows.filter(
        (r) => r.id[0] === "G" && bPoints.has(r.id) && !unique.has(r.id)
      )
    },
    null,
    2
  )
);
if (process.argv.includes("--codes")) {
  console.log(
    "// APP-6A point-symbol keys, generated from app6a-catalog.js.\nexport const app6aCodes = new Set(`\n" +
      symbols.map((row) => row.id).join("\n") +
      "\n`.trim().split(/\\s+/));"
  );
} else {
  console.log(
    "// APP-6A (October 1998), Annex B. See docs/app6a.md for scope and errata.\nexport const app6aCatalog = " +
      JSON.stringify(symbols, null, 2) +
      ";"
  );
}
