// Capture BEFORE before changing the renderer; build AFTER after the fix.
// node --import=data:text/javascript,globalThis.__version__=%223.0.5%22 scripts/audit-app6a.mjs snapshot before
import fs from "node:fs";
import path from "node:path";
import ms from "../index.js";
import { app6aCatalog } from "../studio/app6a-catalog.js";

const output = path.resolve("output/app6a-audit");
fs.mkdirSync(output, { recursive: true });
const [command, phase] = process.argv.slice(2);
if (command === "snapshot") {
  if (!["before", "after"].includes(phase)) throw new Error("Use snapshot before|after");
  const target = path.join(output, `${phase}.json`);
  if (phase === "before" && fs.existsSync(target)) throw new Error("Before snapshot already exists; preserve the evidence or choose a new audit directory.");
  const rows = app6aCatalog.map(entry => ({ ...entry, cases: (entry.affiliation ? [entry.affiliation] : ["U", "F", "N", "H"]).flatMap(affiliation => [true, false].map(frame => {
    const sidc = entry.id[0] + affiliation + entry.id[2] + (entry.status || "P") + entry.id.slice(4) + entry.modifier.replaceAll("*", "-") + "---";
    const symbol = new ms.Symbol(sidc, { standard: "APP6A", frame, fill: true, size: 70, infoFields: false, strokeWidth: 3 });
    const parts = symbol.drawInstructions.flat(Infinity).filter(Boolean);
    return { affiliation, frame, sidc, valid: symbol.isValid(), svg: symbol.asSVG(), fills: [...new Set(parts.filter(p => p.icon && p.fill).map(p => p.fill))], labels: parts.filter(p => p.icon && p.type === "text").map(p => p.text), colors: symbol.getColors() };
  })) }));
  fs.writeFileSync(target, JSON.stringify({ capturedAt: new Date().toISOString(), rows }));
  console.log(`${phase}: ${rows.length} symbols / ${rows.reduce((sum,row)=>sum+row.cases.length,0)} render cases`);
} else if (command === "report") {
  const before = JSON.parse(fs.readFileSync(path.join(output, "before.json")));
  const after = JSON.parse(fs.readFileSync(path.join(output, "after.json")));
  const references = JSON.parse(fs.readFileSync(path.join(output, "references.json")));
  const expected = JSON.parse(fs.readFileSync("scripts/app6a-expectations.json"));
  const normalize = value => String(value).replace(/\s/g, "").replace(/^white$/, "rgb(255,255,255)");
  const palette = {U:"rgb(255,255,128)",F:"rgb(128,224,255)",N:"rgb(170,255,170)",H:"rgb(255,128,128)"};
  const checks = (row) => {
    const rules = expected[row.id];
    if (!rules) return [];
    return row.cases.flatMap(c => {
      const failures = [];
      const identity = { U: "Unknown", F: "Friend", N: "Neutral", H: "Hostile" }[c.affiliation];
      if (rules.label && !c.labels.includes(rules.label)) failures.push(`label ${rules.label}`);
      const fills = c.fills.map(normalize);
      if (rules.opaque && !fills.includes(c.frame ? "rgb(255,255,255)" : palette[c.affiliation])) failures.push(c.frame ? "opaque white icon" : "identity-colored icon");
      if (rules.white && c.frame && !fills.includes("rgb(255,255,255)")) failures.push("opaque white icon");
      if (rules.identity && normalize(c.frame ? c.colors.fillColor[identity] : c.colors.iconFillColor[identity]) !== palette[c.affiliation]) failures.push("publication affiliation palette");
      if (!c.valid) failures.push("valid rendering");
      return failures.map(failure => `${c.affiliation}/${c.frame ? "framed" : "unframed"}: ${failure}`);
    });
  };
  const baseline = new Map(before.rows.map(row => [row.id,row]));
  // Current audit scope is explicitly S-scheme only, per the user's request.
  const rows = after.rows.filter(row => row.id.startsWith("S")).map(row => {
    const old = baseline.get(row.id);
    return { ...row, before: old?.cases || [], reference: references[row.hierarchy] || null, rules: expected[row.id] || null, failuresBefore: old ? checks(old) : [], failuresAfter: checks(row), changed: !old || row.cases.some(c => c.svg !== old.cases.find(b=>b.affiliation===c.affiliation && b.frame===c.frame)?.svg) };
  });
  const summary = { symbols: rows.length, cases: rows.reduce((sum,row)=>sum+row.cases.length,0), referenceRows: rows.filter(r => r.reference).length, reviewedRules: rows.filter(r => r.rules && !r.rules.conflict).length, changedSymbols: rows.filter(r => r.changed).length, failuresBefore: rows.reduce((n,r) => n+r.failuresBefore.length,0), failuresAfter: rows.reduce((n,r) => n+r.failuresAfter.length,0), invalid: rows.flatMap(r => r.cases).filter(c=>!c.valid).length };
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify({ summary, rows }));
  fs.copyFileSync("scripts/app6a-audit.html", path.join(output, "index.html"));
  const served = "dist/studio/audit";
  fs.mkdirSync(served, {recursive:true});
  for (const name of ["report.json", "index.html", "references"]) fs.cpSync(path.join(output, name), path.join(served, name), {recursive:true});
  if (fs.existsSync(path.join(output,"symbols/comparison.json"))) {
    fs.copyFileSync("scripts/app6a-symbol-audit.html",path.join(output,"symbols/index.html"));
    fs.cpSync(path.join(output,"symbols"),path.join(served,"symbols"),{recursive:true});
  }
  console.log(summary);
} else throw new Error("Use snapshot before|after or report");
