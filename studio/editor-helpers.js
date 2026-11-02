// Pure editor helpers shared by the Studio page and its Node tests.

const symbolClasses = ["unit", "equipment", "installation", "point", "nuclear"];
const classNames = ["Units", "Equipment", "Installations"];
const classLabels = {
  unit: "units",
  equipment: "equipment",
  installation: "installations",
  point: "tactical points",
  nuclear: "nuclear points"
};

function unavailableReason(entry, kind, identity) {
  if (!entry) return "Not in APP-6A";
  const index = symbolClasses.indexOf(kind);
  if (entry.limits[index] > 0) return entry.hostileOnly && !["H", "S"].includes(identity) ? "Hostile or suspect only" : "";
  if (index > 2) return `Not for ${classLabels[kind]}`;
  const allowed = classNames.filter((_, position) => entry.limits[position] > 0);
  if (!allowed.length) return `Not for ${classLabels[kind]}`;
  const list = allowed.map((name, position) => (position ? name.toLowerCase() : name)).join(" and ");
  return `${list} only`;
}

// app6a: null for every other standard, else
// {available: getApp6aFields(sidc), table: app6aTextFields, kind, identity}.
export function fieldStates(textModifiers, app6a) {
  return textModifiers.map(({ key, field, label }) => {
    if (!app6a) return { key, field, label, available: true, maxLength: null, reason: "" };
    const definition = app6a.available.find((item) => item.key === key);
    if (definition)
      return { key, field: definition.field, label: definition.label, available: true, maxLength: definition.maxLength, reason: "" };
    const entry = app6a.table.find((item) => item.key === key);
    return { key, field, label, available: false, maxLength: null, reason: unavailableReason(entry, app6a.kind, app6a.identity) || "Not available" };
  });
}

// Field states from an edition modifier profile (src/modifierprofiles). A
// profile whose fields() returns null leaves every field available.
export function profileFieldStates(textModifiers, profile, sidc) {
  const available = profile ? profile.fields(sidc) : null;
  if (!available) return fieldStates(textModifiers, null);
  return textModifiers.map(({ key, field, label }) => {
    const definition = available.find((item) => item.key === key);
    if (definition)
      return {
        key,
        field: definition.field || field,
        label: definition.label || label,
        available: true,
        maxLength: definition.maxLength || null,
        choices: definition.choices || null,
        reason: "",
        // Metadata a profile may attach to a field; the Studio shows it.
        kind: definition.kind || "text",
        minLength: definition.minLength || null,
        pattern: definition.pattern || null,
        patternText: definition.patternText || "",
        alternates: definition.alternates || null,
        examples: definition.examples || null,
        parts: definition.parts || null,
        format: definition.format || "",
        unresolved: definition.unresolved || "",
        nonBlocking: Boolean(definition.nonBlocking),
        requiresEchelonDivisionOrBelow: Boolean(definition.requiresEchelonDivisionOrBelow)
      };
    return { key, field, label, available: false, maxLength: null, choices: null, reason: profile.unavailableReason(key, sidc) || "Not available" };
  });
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const twoDigits = (value) => String(value).padStart(2, "0");

export function formatDtg(date) {
  return `${twoDigits(date.getUTCDate())}${twoDigits(date.getUTCHours())}${twoDigits(date.getUTCMinutes())}Z${months[date.getUTCMonth()]}${twoDigits(date.getUTCFullYear() % 100)}`;
}

export function evaluationRating(reliability, credibility) {
  const letter = String(reliability || "").toUpperCase();
  const digit = String(credibility || "");
  return /^[A-F]$/.test(letter) && /^[1-6]$/.test(digit) ? letter + digit : "";
}

export function sidcParts(sidc, dEdition) {
  const part = (key, label, start, end) => ({ key, label, value: sidc.slice(start, end) });
  if (!/^\d/.test(sidc))
    return [
      part("scheme", "Scheme", 0, 1),
      part("identity", "Identity", 1, 2),
      part("dimension", "Dimension", 2, 3),
      part("status", "Status", 3, 4),
      part("function", "Function", 4, 10),
      part("modifiers", "Modifiers", 10, 12),
      part("country", "Country", 12, 14),
      part("oob", "OOB", 14)
    ];
  return [
    part("version", "Version", 0, 2),
    part("identity", "Identity", 2, 4),
    part("set", "Set", 4, 6),
    part("amplifier", "Amplifier", 6, 10),
    part("entity", "Entity", 10, 16),
    part("modifiers", "Modifiers", 16, 20),
    ...(dEdition
      ? [
          part("originatorCountry", "Originator country", 20, 23),
          part("originatorSet", "Originator set", 23, 24),
          part("nationalData", "National data", 24, 30)
        ]
      : [
          part("extension", "Ext.", 20, 22),
          part("frameShape", "Frame shape", 22, 23),
          part("otherExtension", "Other ext.", 23, 27),
          part("country", "Country", 27, 30)
        ])
  ];
}

export function pushRecent(list, id, max = 8) {
  return [id, ...list.filter((item) => item !== id)].slice(0, max);
}

// Field positions view: empty available text fields show their code in place.
export function placeholderOptions(states, values) {
  const options = {};
  const codes = {};
  for (const state of states) {
    if (!state.available || values[state.key] || state.key === "engagementType" || !state.field) continue;
    const tag = `[${state.field}]`;
    options[state.key] = tag;
    codes[tag] = state.key;
  }
  return { options, codes };
}
