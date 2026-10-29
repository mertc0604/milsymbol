import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import legacyStandards from "mil-std-2525";
import modernStandards from "milstandard-e";
import natoStandards from "stanag-app6";
import { app6aCatalog } from "../studio/app6a-catalog.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "studio");
const publicBuild = process.argv.includes("--public");
// Public builds use a separate, allow-listed output; never copy local PDF audits.
const output = path.join(root, "dist", publicBuild ? "studio-public" : "studio");

const isSelectable = (value = "") => {
  const normalized = String(value).toLowerCase();
  return (
    !normalized.includes("{disused}") &&
    !normalized.includes("reserved for future") &&
    !normalized.includes("version extension flag")
  );
};

function normalizeModern(dataset) {
  const icons = [];
  const modifiers = {};
  const common = { modifier1: [], modifier2: [] };

  for (const [key, symbolSet] of Object.entries(dataset)) {
    if (!symbolSet || typeof symbolSet !== "object") continue;
    const symbolSetCode = symbolSet.symbolset || (key === "common" ? "" : key);
    const category = symbolSet.name || "Common";

    if (Array.isArray(symbolSet.mainIcon)) {
      for (const item of symbolSet.mainIcon) {
        const geometry = item["Geometric Rendering"];
        const name =
          item["Entity Subtype"] || item["Entity Type"] || item.Entity;
        if (
          !name ||
          !isSelectable(name) ||
          (geometry && String(geometry).toLowerCase() !== "point")
        )
          continue;
        icons.push({
          id: `${symbolSetCode}-${item.Code}`,
          symbolSet: symbolSetCode,
          category,
          code: String(item.Code || "000000")
            .padEnd(6, "0")
            .slice(0, 6),
          name: String(name).trim(),
          path: [item.Entity, item["Entity Type"], item["Entity Subtype"]]
            .filter(Boolean)
            .map((part) => String(part).trim()),
          remarks: String(item.Remarks || "").trim()
        });
      }
    }

    const target =
      key === "common"
        ? common
        : (modifiers[symbolSetCode] ||= { modifier1: [], modifier2: [] });
    for (const field of ["modifier1", "modifier2"]) {
      for (const item of symbolSet[field] || []) {
        const label =
          item[field === "modifier1" ? "First Modifier" : "Second Modifier"] ||
          item["First Modifier"];
        if (!label || !item.Code || !isSelectable(label)) continue;
        target[field].push({
          code: String(item.Code),
          name: String(label).trim(),
          category: String(item.Category || "Other").trim(),
          remarks: String(item.Remarks || "").trim(),
          common: key === "common"
        });
      }
    }
  }

  return { icons, modifiers, common };
}

function normalizeLegacy(dataset) {
  const icons = [];
  const walk = (node, group = []) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node.mainIcon)) {
      const category = node.name || group.at(-1) || "Other";
      for (const item of node.mainIcon) {
        const geometry = item.geometry;
        const name = item.name || item.names?.filter(Boolean).at(-1);
        if (
          !name ||
          !isSelectable(name) ||
          (geometry && String(geometry).toUpperCase() !== "POINT")
        )
          continue;
        icons.push({
          id: `${item.codingscheme}-${item.battledimension}-${item.functionid}`,
          category,
          code: item.functionid || "------",
          codingScheme: item.codingscheme || "S",
          battleDimension: item.battledimension || "G",
          name: String(name).trim(),
          path: (item.names || [name])
            .filter(Boolean)
            .map((part) => String(part).trim()),
          remarks: String(item.remarks || "").trim()
        });
      }
    }
    for (const [key, child] of Object.entries(node)) {
      if (
        key === "mainIcon" ||
        key === "name" ||
        !child ||
        typeof child !== "object"
      )
        continue;
      walk(child, [...group, node.name || key]);
    }
  };
  walk(dataset);
  return { icons, modifiers: {}, common: { modifier1: [], modifier2: [] } };
}

const data = {
  generatedAt: new Date().toISOString(),
  aliases: { app6e: "2525e" },
  standards: {
    app6a: {
      icons: app6aCatalog.filter((item) => item.id.startsWith("S")).map((item) => {
        const code = item.id.slice(4);
        const categories = {
          P: "Space",
          A: "Air",
          G:
            code[0] === "E"
              ? "Ground equipment"
              : code[0] === "I"
                ? "Installations"
                : "Ground units",
          S: "Sea surface",
          U: "Subsurface",
          F: "Special operations forces"
        };
        const category =
          item.id[0] === "G" ? "Tactical points" : categories[item.id[2]];
        const ancestors = app6aCatalog.filter((parent) =>
          item.hierarchy.startsWith(parent.hierarchy + ".")
        );
        return {
          id: item.id,
          code,
          codingScheme: item.id[0],
          battleDimension: item.id[2],
          category,
          name: item.name,
          path: [...ancestors.map((parent) => parent.name), item.name],
          remarks: item.note || "",
          source: `APP-6A (1998), Annex B, p. ${item.page}`,
          defaultModifier: item.modifier.replace(/\*/g, "-"),
          prescribedAffiliation: item.affiliation,
          prescribedStatus: item.status
        };
      }),
      modifiers: {},
      common: { modifier1: [], modifier2: [] }
    },
    "2525c": normalizeLegacy(legacyStandards.ms2525c),
    "2525d": normalizeModern(legacyStandards.ms2525d),
    "2525e": normalizeModern(modernStandards.ms2525e),
    app6b: normalizeLegacy(natoStandards.app6b),
    app6d: normalizeModern(natoStandards.app6d)
  }
};

fs.mkdirSync(path.join(output, "vendor"), { recursive: true });
for (const file of ["index.html", "styles.css", "app.js", "modifier-fields.js", "favicon.svg"]) {
  if (file === "index.html") {
    const html = fs.readFileSync(path.join(source, file), "utf8");
    fs.writeFileSync(path.join(output, file), html.replace('<html lang="en">', `<html lang="en" data-local-audit="${!publicBuild}">`));
  } else fs.copyFileSync(path.join(source, file), path.join(output, file));
}
fs.copyFileSync(
  path.join(root, "dist", "milsymbol.development.js"),
  path.join(output, "vendor", "milsymbol.js")
);
fs.writeFileSync(path.join(output, "catalog.json"), JSON.stringify(data));
fs.copyFileSync(path.join(root, "src", "lettersidc", "metadata.js"), path.join(output, "vendor", "letter-metadata.js"));
fs.copyFileSync(path.join(root, "LICENSE"), path.join(output, "LICENSE.txt"));
const notices = [
  "Military Symbol Studio — independent modified version of milsymbol.\nNot an official Spatial Illusions or NATO product.\nAPP-6A support is partial; no full-conformance certification is claimed.",
  "milsymbol — https://github.com/spatialillusions/milsymbol\n\n" + fs.readFileSync(path.join(root, "LICENSE"), "utf8"),
  ...["mil-std-2525", "milstandard-e", "stanag-app6"].map(name => {
    const directory = path.join(root, "node_modules", name);
    const pkg = JSON.parse(fs.readFileSync(path.join(directory, "package.json"), "utf8"));
    return `${name} ${pkg.version} — catalog data included in catalog.json\n${typeof pkg.repository === "object" ? pkg.repository.url : pkg.repository}\n\n${fs.readFileSync(path.join(directory, "LICENSE"), "utf8")}`;
  })
];
fs.writeFileSync(path.join(output, "THIRD_PARTY_LICENSES.txt"), notices.join("\n\n----------------------------------------\n\n"));
if (publicBuild) {
  const allowed = new Set(["index.html", "styles.css", "app.js", "modifier-fields.js", "favicon.svg", "catalog.json", "vendor/milsymbol.js", "vendor/letter-metadata.js", "LICENSE.txt", "THIRD_PARTY_LICENSES.txt"]);
  const inspect = (directory, prefix = "") => {
    for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
      const relative = prefix + entry.name;
      if (entry.isDirectory() && relative === "vendor") inspect(path.join(directory, entry.name), relative + "/");
      else if (!entry.isFile() || !allowed.has(relative)) throw new Error(`Public build contains unexpected content: ${relative}. Refusing to package it.`);
    }
  };
  inspect(output);
}

const summary = Object.entries(data.standards)
  .map(([key, value]) => `${key}: ${value.icons.length}`)
  .join(", ");
console.log(`Symbol Studio built at ${output}`);
console.log(`Catalog entries — ${summary}`);
