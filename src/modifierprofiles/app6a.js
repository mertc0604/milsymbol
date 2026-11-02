// APP-6A (1998) modifier profile. See common.js for the profile contract.
//
// Scope: S (warfighting) symbols get the full Table III / Table B-II / Table I
// rules and the Figure 2a layout. G (tactical graphic) points keep the legacy
// Table III limits only; they are not extended here.
//
// Sources (physical PDF page / printed page): Table I-II 21-23 / 15-17,
// Table III 25-27 / 19-21, Figure 2a 28 / 22, Table IV 30-31 / 24-25,
// 505 and 506.2 32-33 / 26-27, Table B-I 74 / 68, Table B-II 75-77 / 69-71.

// APP-6A (1998), Table III, printed pp. 19–21. Limits are character counts.
// Order: unit, equipment, installation, ordinary point, nuclear point.
// `identities` restricts a field to SIDC identities (L: hostile equipment only).
export const app6aTextFields = [
  ["quantity", "C", "Quantity of equipment", [0,9,0,0,6]],
  ["reinforcedReduced", "F", "Reinforced / detached", [3,0,0,0,0]],
  ["staffComments", "G", "Staff comments", [20,20,20,0,0]],
  ["additionalInformation", "H", "Additional information", [20,20,20,20,20]],
  ["evaluationRating", "J", "Evaluation rating (A1–F6)", [2,2,2,0,0]],
  ["combatEffectiveness", "K", "Combat effectiveness", [5,0,5,0,0]],
  ["signatureEquipment", "L", "Electronic signature (!)", [0,1,0,0,0], true, ["H"]],
  ["higherFormation", "M", "Higher formation", [21,0,0,0,0]],
  ["hostile", "N", "Hostile indicator (ENY)", [0,3,0,0,0]],
  ["iffSif", "P", "IFF / SIF", [5,5,5,0,0]],
  ["uniqueDesignation", "T", "Unique designation", [21,21,21,0,15]],
  ["type", "V", "Type of equipment", [0,24,0,0,20]],
  ["dtg", "W", "Date-time group", [14,14,14,14,14]],
  ["altitudeDepth", "X", "Altitude / depth", [6,6,6,0,6]],
  ["location", "Y", "Location (WGS-84)", [19,19,19,19,19]],
  ["speed", "Z", "Speed", [8,8,8,0,0]],
  ["specialHeadquarters", "AA", "Special C2 headquarters", [9,0,0,0,0]]
].map(([key,field,label,limits,hostileOnly,identities]) => ({key,field,label,limits,hostileOnly,identities}));

const classes = ["unit", "equipment", "installation", "point", "nuclear"];

function normalize(sidc) {
  return String(sidc).toUpperCase().replace(/\*/g, "-").replace(/ /g, "");
}

export function app6aSymbolClass(sidc) {
  sidc = String(sidc).toUpperCase().replace(/ /g, "");
  if (sidc[0] === "G") return /^G.C.BW[NEIF]/.test(sidc) ? "nuclear" : "point";
  if (sidc[2] === "G" && sidc[4] === "I") return "installation";
  if (sidc[2] === "F" || (sidc[2] === "G" && ["U", "-"].includes(sidc[4])) || (sidc[2] === "S" && sidc[4] === "G")) return "unit";
  return "equipment";
}

function fieldApplies(entry, sidc) {
  const index = classes.indexOf(app6aSymbolClass(sidc));
  if (!entry.limits[index]) return false;
  return !entry.identities || entry.identities.indexOf(sidc[1]) > -1;
}

export function getApp6aFields(sidc) {
  sidc = String(sidc).toUpperCase().replace(/ /g, "");
  const index = classes.indexOf(app6aSymbolClass(sidc));
  return app6aTextFields.filter(f => fieldApplies(f, sidc)).map(f => Object.assign({}, f, {
    maxLength: f.limits[index]
  }, index === 4 && f.key === "quantity" ? { field: "B", label: "Nuclear yield (kilotons)" } : {}));
}

// ---------------------------------------------------------------- Table B-II

// APP-6A has the echelons A–M only: no `N` command echelon (Table B-II, pp. 69-71).
const echelonNames = ["Team/Crew", "Squad", "Section", "Platoon", "Company", "Battalion", "Regiment/Group", "Brigade", "Division", "Corps/MEF", "Army", "Army Group/Front", "Region"];
// Keys of ms mapping.echelonMobility for echelons A–M.
const echelonKeys = ["11", "12", "13", "14", "15", "16", "17", "18", "21", "22", "23", "24", "25"];
// Table B-II MO–MY (equipment mobility only; no NS/NL towed arrays in APP-6A).
const mobilityNames = ["Wheeled / limited cross-country", "Wheeled / cross-country", "Tracked", "Wheeled and tracked", "Towed", "Rail", "Over the snow", "Sled", "Pack animals", "Barge", "Amphibious"];
const mobilityKeys = ["31", "32", "33", "34", "35", "36", "41", "42", "37", "51", "52"];

export const app6aEchelons = "ABCDEFGHIJKLM".split("").map((code, i) => ({ code, name: echelonNames[i], key: echelonKeys[i] }));
export const app6aMobilities = "OPQRSTUVWXY".split("").map((code, i) => ({ code, name: mobilityNames[i], key: mobilityKeys[i] }));

// Decode SIDC positions 11-12 (Table B-II). 11th character families:
// `-`/A-G carry HQ (A-D), task force (B, D, E, G) and feint/dummy (C, D, F, G)
// bits with a `-`/A-M echelon; H- installation, HB feint/dummy installation
// (the B is not a squad); M- equipment mobility with MO-MY; K- nuclear yield
// (tactical graphics only).
export function decodeApp6aSizeMobility(value) {
  const sidc = normalize(value).padEnd(15, "-");
  const code = sidc.slice(10, 12);
  const kind = app6aSymbolClass(sidc);
  const out = {
    code,
    valid: true,
    errors: [],
    headquarters: false,
    taskForce: false,
    feintDummy: false,
    installation: false,
    echelon: "",
    echelonKey: "",
    mobility: "",
    mobilityKey: "",
    // "headquarters" for units, "locationOffset" for equipment/installations
    // (Table III field S).
    staffRole: ""
  };
  const fail = (message) => {
    out.valid = false;
    out.errors.push(message);
  };
  if (sidc[0] === "S" && sidc[2] === "G" && sidc[4] === "I" && code[0] !== "H") fail("B-II: ground installations use H- or HB");
  if (!/^(?:[-A-G][-A-M]|H[-B]|K-|M[-O-Y])$/.test(code)) {
    fail("B-II: " + code + " is not an APP-6A size/mobility code");
    return out;
  }
  if (code[0] === "M" && kind !== "equipment") fail("B-II: mobility M* is for equipment only");
  if ("BDEG".indexOf(code[0]) > -1 && kind !== "unit") fail("Table III D: the task force bracket is for units only");
  if (code[0] === "H" && kind !== "installation") fail("B-II: H- is for installations only");
  if (code[0] !== "H" && code[0] !== "M" && /[A-M]/.test(code[1]) && kind !== "unit") fail("Table III B: echelon is for units only");
  if (code[0] === "K" && kind !== "nuclear") fail("B-II: K- (nuclear yield) is for nuclear tactical graphics, not S symbols");
  if (sidc[0] === "G" && code !== "--" && !(kind === "nuclear" && code === "K-")) fail("B-II: not applicable to tactical graphic points");
  if (!out.valid) return out;
  if (code[0] === "H") {
    out.installation = true;
    out.feintDummy = code[1] === "B";
    return out;
  }
  if (code[0] === "M") {
    const index = "OPQRSTUVWXY".indexOf(code[1]);
    if (index > -1) {
      out.mobility = code[1];
      out.mobilityKey = mobilityKeys[index];
    }
    return out;
  }
  if (code[0] === "K") return out;
  out.headquarters = "ABCD".indexOf(code[0]) > -1;
  out.taskForce = "BDEG".indexOf(code[0]) > -1;
  out.feintDummy = "CDFG".indexOf(code[0]) > -1;
  if (out.headquarters) out.staffRole = kind === "unit" ? "headquarters" : "locationOffset";
  const echelon = "ABCDEFGHIJKLM".indexOf(code[1]);
  if (echelon > -1) {
    out.echelon = code[1];
    out.echelonKey = echelonKeys[echelon];
  }
  return out;
}

// -------------------------------------------------------- Table I identities

// Table I (pp. 15-16), Table II (p. 17), Table C-II colours. `frame` is the
// geometry family; `marker`/`placement` is the E field or in-frame mark.
export const app6aIdentities = {
  P: { name: "Pending", frame: "Unknown", color: "yellow", marker: "?", placement: "frame" },
  U: { name: "Unknown", frame: "Unknown", color: "yellow", marker: "", placement: "" },
  A: { name: "Assumed friend", frame: "Friend", color: "cyan", marker: "?", placement: "field" },
  F: { name: "Friend", frame: "Friend", color: "cyan", marker: "", placement: "" },
  N: { name: "Neutral", frame: "Neutral", color: "green", marker: "", placement: "" },
  S: { name: "Suspect", frame: "Hostile", color: "red", marker: "?", placement: "field" },
  H: { name: "Hostile", frame: "Hostile", color: "red", marker: "", placement: "" },
  // Joker and faker use the FRIEND geometry in the red family (Table I, p. 16).
  J: { name: "Joker", frame: "Friend", color: "red", marker: "J", placement: "field" },
  K: { name: "Faker", frame: "Friend", color: "red", marker: "K", placement: "field" }
};
const frameDimensions = "PAGSUF";

// Resolve the identity of an S symbol. O (none specified, Table B-I) and any
// code without a Table I frame yield defined: false and a reason; no frame is guessed.
// policy: "table" (default), "field" or "frame" (503.1a allows E or in-frame
// for pending, assumed friend and suspect; J/K stay in field E).
export function app6aIdentity(code, dimension, policy, framed) {
  const identity = app6aIdentities[code];
  if (!identity) {
    return { code, defined: false, reason: code === "O" ? "O (none specified) is a Table B-I code but Table I defines no frame or colour for it" : code + " is not an APP-6A identity" };
  }
  if (dimension !== undefined && frameDimensions.indexOf(dimension) < 0) {
    return { code, defined: false, reason: "Table I defines no frame for battle dimension " + dimension };
  }
  let placement = identity.placement;
  if (placement && (code === "P" || code === "A" || code === "S")) {
    if (policy === "field") placement = "field";
    if (policy === "frame") placement = "frame";
  }
  // Embedding needs a frame; fall back to field E for unframed symbols.
  if (placement === "frame" && framed === false) placement = "field";
  return Object.assign({ code, defined: true, reason: "" }, identity, { placement });
}

// ------------------------------------------------------------- Profile parts

const unsupportedKeys = ["sigint", "country", "platformType", "equipmentTeardownTime", "commonIdentifier", "auxiliaryEquipmentIndicator", "headquartersElement", "installationComposition", "engagementBar", "engagementType", "guardedUnit", "specialDesignator"];
const reliability = "ABCDEF".split("");
const credibility = "123456".split("");
const evaluationChoices = reliability.reduce((all, letter) => all.concat(credibility.map((digit) => letter + digit)), []);
const reinforcedChoices = ["(+)", "(-)", "(±)"];

// Product policy: length is counted in Unicode code points, no normalization.
export function app6aLength(value) {
  return Array.from(String(value)).length;
}

function allowedValues(key) {
  if (key === "evaluationRating") return evaluationChoices;
  if (key === "reinforcedReduced") return reinforcedChoices;
  if (key === "signatureEquipment") return ["!"];
  if (key === "hostile") return ["ENY"];
  return null;
}

export function validateApp6aOptions(sidc, options) {
  sidc = String(sidc).toUpperCase().replace(/ /g, "");
  const fields = new Map(getApp6aFields(sidc).map(f => [f.key,f]));
  const kind = app6aSymbolClass(sidc);
  const errors = [];
  for (const field of app6aTextFields) {
    const raw = options[field.key];
    const value = raw === undefined || raw === null ? "" : String(raw);
    if (!value) continue;
    if (!fields.has(field.key)) {
      errors.push(field.identities && classes.indexOf(kind) > -1 && field.limits[classes.indexOf(kind)] > 0
        ? field.field + ": only for identity " + field.identities.join("/") + " (hostile equipment)"
        : field.field + ": not applicable to " + kind);
    } else if (app6aLength(value) > fields.get(field.key).maxLength) errors.push(`${field.field}: maximum ${fields.get(field.key).maxLength} characters`);
    const choices = allowedValues(field.key);
    if (choices && sidc[0] === "S" && choices.indexOf(value) < 0) {
      errors.push(field.key === "evaluationRating" ? "J: use A1 through F6" : field.key === "reinforcedReduced" ? "F: use (+), (-) or (±)" : field.key === "signatureEquipment" ? "L: use !" : "N: use ENY");
    }
  }
  if (sidc[0] === "G") {
    if (options.evaluationRating && !/^[A-F][1-6]$/.test(options.evaluationRating)) errors.push("J: use A1 through F6");
    if (options.signatureEquipment && options.signatureEquipment !== "!") errors.push("L: use !");
    if (options.hostile && options.hostile !== "ENY") errors.push("N: use ENY");
  }
  if (kind === "point" && options.direction !== undefined && options.direction !== null) errors.push("Q: not applicable to ordinary tactical points");
  for (const key of unsupportedKeys) {
    if (options[key]) errors.push(`${key}: not an APP-6A Table III modifier`);
  }
  return errors;
}

function graphicFields(sidc) {
  const kind = app6aSymbolClass(sidc);
  const graphic = (key, field, label) => ({ key, field, label, maxLength: null, kind: "graphic", choices: null });
  const list = [Object.assign(graphic("affiliationMarker", "E", "Suspect / assumed friend / faker / joker (from identity)"), { derived: true })];
  if (kind === "unit") list.push(graphic("echelon", "B", "Size indicator (SIDC position 12)"), graphic("taskForce", "D", "Task force bracket (SIDC position 11)"));
  if (kind === "installation") list.push(graphic("installation", "B", "Installation indicator (SIDC H-)"));
  list.push(graphic(kind === "unit" ? "headquarters" : "locationOffset", "S", kind === "unit" ? "Headquarters staff" : "Location offset indicator"));
  if (kind === "equipment") list.push(graphic("mobility", "R", "Mobility indicator (SIDC MO-MY)"));
  list.push(graphic("feintDummy", "AB", "Feint/dummy indicator"), graphic("direction", "Q", "Direction of movement"));
  return list;
}

const layoutRows = {
  left: [[], ["dtg"], ["altitudeDepth", "location"], ["type"], ["uniqueDesignation"], ["speed"]],
  right: [[], ["affiliationMarker", "reinforcedReduced"], ["staffComments"], ["additionalInformation"], ["higherFormation"], ["evaluationRating", "combatEffectiveness", "signatureEquipment", "hostile", "iffSif"]]
};

export const app6aProfile = {
  id: "app6a",
  symbolClass: app6aSymbolClass,
  fields(sidc) {
    sidc = normalize(sidc);
    const text = getApp6aFields(sidc).map((f) => ({
      key: f.key,
      field: f.field,
      label: f.label,
      maxLength: f.maxLength,
      kind: allowedValues(f.key) ? "choice" : "text",
      choices: allowedValues(f.key)
    }));
    return sidc[0] === "S" ? text.concat(graphicFields(sidc)) : text;
  },
  unavailableReason(key, sidc) {
    sidc = normalize(sidc);
    const entry = app6aTextFields.filter((f) => f.key === key)[0];
    if (!entry) return unsupportedKeys.indexOf(key) > -1 ? "Not an APP-6A Table III field" : "";
    if (fieldApplies(entry, sidc)) return "";
    const index = classes.indexOf(app6aSymbolClass(sidc));
    if (entry.limits[index] > 0) return "Hostile identity (H) only";
    const names = ["units", "equipment", "installations"].filter((name, i) => entry.limits[i] > 0);
    return names.length ? names.join(" and ") + " only" : "Not for " + classes[index] + " symbols";
  },
  validate(sidc, options) {
    sidc = normalize(sidc);
    const modifierErrors = validateApp6aOptions(sidc, options);
    const sidcErrors = sidc[0] === "S" ? decodeApp6aSizeMobility(sidc).errors : [];
    const identityErrors = [];
    const notes = [];
    if (sidc[0] === "S") {
      const identity = app6aIdentity(sidc[1], sidc[2]);
      if (!identity.defined) identityErrors.push(identity.reason);
      if (options.hostile === "ENY" && sidc[1] !== "H") notes.push("N: Table III does not tie ENY to the identity; it is user text and does not change the SIDC identity or the frame");
      const decoded = decodeApp6aSizeMobility(sidc);
      if (decoded.valid && decoded.code === "M-") notes.push("B-II: M- is the mobility heading; no mobility graphic is defined, none is drawn");
      if (decoded.valid && decoded.code === "HB") notes.push("B-II: HB is a feint/dummy installation; the B is not a squad");
    }
    return {
      valid: modifierErrors.length === 0 && sidcErrors.length === 0 && identityErrors.length === 0,
      details: { modifierErrors, sidcErrors, identityErrors, notes }
    };
  },
  // Figure 2a (PDF 28 / printed 22) for S symbols. Rows hold only the fields
  // that apply to the symbol class; empty values collapse (506.2).
  textLayout(sidc) {
    sidc = normalize(sidc);
    if (sidc[0] !== "S") return null;
    const applies = (key) => {
      if (key === "affiliationMarker") return true;
      const entry = app6aTextFields.filter((f) => f.key === key)[0];
      return !!entry && fieldApplies(entry, sidc);
    };
    const filter = (rows) => rows.map((row) => row.filter(applies));
    return {
      left: filter(layoutRows.left),
      right: filter(layoutRows.right),
      separator: " ",
      top: ["quantity"].filter(applies),
      inner: ["specialHeadquarters"].filter(applies),
      bottom: []
    };
  }
};
