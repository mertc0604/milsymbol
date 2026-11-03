// Decode controls without rebuilding the SIDC: fields with no editor control
// (including national extensions and order of battle) remain authoritative.
export function numericSidcEdition(sidc) {
  if (/^1[012]/.test(sidc)) return "d";
  if (/^1[34]/.test(sidc)) return "e";
  return "";
}

// Apply accepts the start of a code and fills the rest. Letter SIDCs need at
// least scheme, identity, dimension and status; the function ID (positions
// 5-10) is filled with "-" (no information) and positions 11-15 with "*"
// (defined by the user), as in the code tables (APP-6A B.4.2, PDF 74 / 68).
// Numeric SIDCs need version through symbol set and are filled with "0" to 20
// digits. "_" is "-".
export function completeEditorSidc(input, family) {
  const value = String(input).trim().toUpperCase().replace(/\s/g, "").replace(/_/g, "-");
  if (family === "modern") {
    if (!/^\d{6,30}$/.test(value))
      return { value, added: 0, error: `Enter at least the first 6 digits of a numeric SIDC (up to 30); the rest is filled with 0 to 20 digits. This one has ${value.length} characters${/\D/.test(value) ? ", including letters" : ""}.` };
    return { value: value.padEnd(20, "0"), added: Math.max(0, 20 - value.length), error: "" };
  }
  if (!/^[A-Z0-9*-]{4,15}$/.test(value))
    return { value, added: 0, error: `Enter at least the first 4 characters of a letter-based SIDC (up to 15: letters, digits, - or *); the function code is filled with - and positions 11–15 with *. This one has ${value.length}.` };
  return { value: value.padEnd(10, "-").padEnd(15, "*"), added: 15 - value.length, error: "" };
}

// User-defined fields (positions 11-15) by coding scheme, as the code tables
// mark them with "*": APP-6A Annex B (S: ** ** *, installations H* ** *) and
// MIL-STD-2525C (S/E/O *****, I --***, G ****X; W none).
const userFields = {
  S: [[10, 12], [12, 14], [14, 15]],
  E: [[10, 12], [12, 14], [14, 15]],
  O: [[10, 12], [12, 14], [14, 15]],
  I: [[12, 14], [14, 15]],
  G: [[10, 12], [12, 14]]
};

// The SIDC box shows a user-defined field that is still empty as "*" instead
// of "-"; an installation keeps its H. Rendering and Apply use "-" (Apply turns
// these * back into -). Numeric SIDCs are unchanged.
export function displayEditorSidc(sidc) {
  const fields = userFields[sidc[0]];
  if (!fields) return sidc;
  let shown = sidc.padEnd(15, "-");
  for (const [start, end] of fields) {
    const part = shown.slice(start, end);
    const empty = part === "-".repeat(end - start) ? "*".repeat(end - start) : start === 10 && part === "H-" ? "H*" : part;
    shown = shown.slice(0, start) + empty + shown.slice(end);
  }
  return shown;
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
    // Letter SIDCs write the exercise context into the identity letter.
    affiliation: [[1, 2]], context: [[1, 2]], status: [[3, 4]],
    flags: [[10, 12]], amplifier: [[10, 12]]
  };
  let result = original;
  for (const [start, end] of ranges[field] || []) {
    result = result.padEnd(end, modern ? "0" : "-");
    result = result.slice(0, start) + generated.slice(start, end) + result.slice(end);
  }
  return result;
}
