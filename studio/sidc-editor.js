// Decode controls without rebuilding the SIDC: fields with no editor control
// (including national extensions and order of battle) remain authoritative.
export function numericSidcEdition(sidc) {
  if (/^1[012]/.test(sidc)) return "d";
  // Table A-1: 13 2525E, 14 APP-06(E)(1), 15 2525E(1), 16 APP-06(E)(2).
  if (/^1[3-6]/.test(sidc)) return "e";
  return "";
}

// Table A-1: 10 is 2525D and APP-06(D)(1) alike, 11, 13 and 15 are 2525, and
// 12, 14 and 16 are APP-06. The code decides the view, as it does for D and E.
const versionPublication = { 11: "2525", 12: "app6", 13: "2525", 14: "app6", 15: "2525", 16: "app6" };
export function standardForSidc(sidc, standardId) {
  const edition = numericSidcEdition(sidc);
  if (!edition) return standardId;
  const publication = versionPublication[sidc.slice(0, 2)] || (standardId.startsWith("app6") ? "app6" : "2525");
  return `${publication}${edition}`;
}

// A code that is valid only in the other family of standards. The library reads
// a SIDC as numeric when its first two characters are digits.
function otherFamilyError(value, family) {
  if (family === "modern")
    return /^[A-Z]/.test(value) ? "This is a letter-based SIDC, and this standard takes numeric codes. Choose APP-6A, APP-6B or MIL-2525C to use it." : "";
  return /^\d{2}/.test(value) ? "This is a numeric SIDC, and this standard takes letter-based codes. Choose APP-6D, APP-6E, MIL-2525D or MIL-2525E to use it." : "";
}

// Position 23 of an edition E code may hold A, Sea Surface (2525E Change 1
// Table A-LX). Every other position of a numeric SIDC is a digit.
const isNumericSidc = (value) =>
  /^\d{6,30}$/.test(value) || (numericSidcEdition(value) === "e" && /^\d{22}A\d{0,7}$/.test(value));

// Apply accepts the start of a code and fills the rest. Letter SIDCs need at
// least scheme, identity, dimension and status; the function ID (positions
// 5-10) is filled with "-" (no information) and positions 11-15 with "*"
// (defined by the user), as in the code tables (APP-6A B.4.2, PDF 74 / 68).
// Numeric SIDCs need version through symbol set and are filled with "0" to 20
// digits. "_" is "-".
export function completeEditorSidc(input, family) {
  const value = String(input).trim().toUpperCase().replace(/\s/g, "").replace(/_/g, "-");
  const otherFamily = otherFamilyError(value, family);
  if (otherFamily) return { value, added: 0, error: otherFamily };
  if (family === "modern") {
    if (!isNumericSidc(value))
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
  const extended = (numericSidcEdition(value) || numericSidcEdition(version)) === "e";
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
  // 7 is the leadership amplifier of a dismounted individual (Table A-VIII).
  const mobility = modern ? /^[34567]/.test(amplifier) : /^[MN]/.test(amplifier);
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
  const extended = (numericSidcEdition(original) || numericSidcEdition(version)) === "e";
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

// Copy gives the code as it is drawn and as file names carry it: the box's *
// marks an empty user field for reading (displayEditorSidc). Text still being
// typed has no drawn code yet, so it is copied as it stands.
export function copiedSidc({ shown, sidc, dirty }) {
  return dirty ? shown : sidc;
}
