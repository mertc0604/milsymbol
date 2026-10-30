// Decode controls without rebuilding the SIDC: fields with no editor control
// (including national extensions and order of battle) remain authoritative.
export function numericSidcEdition(sidc) {
  if (/^1[012]/.test(sidc)) return "d";
  if (/^1[34]/.test(sidc)) return "e";
  return "";
}

export function decodeEditorSidc(value, { family, version, icons }) {
  const modern = family === "modern";
  const extended = (numericSidcEdition(value) || (version === "13" ? "e" : "d")) === "e";
  const sidc = value.padEnd(modern ? 30 : 15, modern ? "0" : "-");
  const id = modern
    ? `${sidc.slice(4, 6)}-${sidc.slice(10, 16)}`
    : `${sidc[0]}-${sidc[2]}-${sidc.slice(4, 10)}`;
  const installation = !modern && sidc[0] === "S" && sidc[2] === "G" && sidc[4] === "I";
  const entry = icons.find((item) => item.id === id) || {
    id, name: "Custom SIDC", category: "Not in this catalog", path: [],
    code: modern ? sidc.slice(10, 16) : sidc.slice(4, 10),
    ...(modern ? { symbolSet: sidc.slice(4, 6) } : {
      codingScheme: sidc[0], battleDimension: sidc[2],
      defaultModifier: installation ? sidc.slice(10, 12) : "--"
    })
  };
  const icon = installation ? { ...entry, defaultModifier: sidc.slice(10, 12) } : entry;
  const flags = modern ? Number(sidc[7]) : ["-", "F", "A", "C", "E", "G", "B", "D"].indexOf(sidc[10]);
  const amplifier = modern ? sidc.slice(8, 10) : sidc.slice(10, 12);
  const mobility = modern ? /^[3456]/.test(amplifier) : /^[MN]/.test(amplifier);
  const modifier = (start, prefix) => {
    const code = sidc.slice(start, start + 2);
    return extended && sidc[prefix] !== "0"
      ? `common:${sidc[prefix]}${code}` : code === "00" ? "" : `set:${code}`;
  };
  return {
    icon,
    identity: sidc[modern ? 3 : 1], status: sidc[modern ? 6 : 3],
    context: modern ? sidc[2] : "0",
    hq: flags >= 0 && Boolean(flags & 2),
    taskForce: flags >= 0 && Boolean(flags & 4),
    feintDummy: (flags >= 0 && Boolean(flags & 1)) || (!modern && amplifier === "HB"),
    mobility: mobility ? amplifier : "",
    echelon: mobility || installation ? (modern ? "00" : "-") : modern ? amplifier : amplifier[1],
    modifier1: modern ? modifier(16, 20) : "",
    modifier2: modern ? modifier(18, 21) : "",
    frameShape: modern && extended ? sidc[22] : "0"
  };
}

// Replace only the field the user edited. In particular, never reconstruct an
// imported SIDC from the previous catalog selection or discard trailing data.
export function editImportedSidc(original, generated, field, { family, version }) {
  const modern = family === "modern";
  const extended = (numericSidcEdition(original) || (version === "13" ? "e" : "d")) === "e";
  const ranges = modern ? {
    affiliation: [[3, 4]], context: [[2, 3]], status: [[6, 7]],
    flags: [[7, 8]], amplifier: [[8, 10]],
    modifier1: [[16, 18], ...(extended ? [[20, 21]] : [])],
    modifier2: [[18, 20], ...(extended ? [[21, 22]] : [])],
    frameShape: extended ? [[22, 23]] : []
  } : {
    affiliation: [[1, 2]], status: [[3, 4]],
    flags: [[10, 12]], amplifier: [[10, 12]]
  };
  let result = original;
  for (const [start, end] of ranges[field] || []) {
    result = result.padEnd(end, modern ? "0" : "-");
    result = result.slice(0, start) + generated.slice(start, end) + result.slice(end);
  }
  return result;
}
