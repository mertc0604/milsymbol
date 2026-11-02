// Pure helpers that derive Studio controls from an edition modifier profile
// (src/modifierprofiles, copied to vendor/modifierprofiles/). The Studio keeps
// no copy of an edition's rules: it asks the profile whether a candidate SIDC
// is acceptable and offers only what the profile accepts. Profiles and the
// APP-6D sector helpers are passed in, so this file works in the page and in
// Node tests without importing the vendor copy.

// SIDC-level problems of a candidate code. Every `*Errors` list a profile
// reports counts (modifierErrors, sidcErrors, identityErrors, ...). Option
// values are not part of the question, so validate() is called without any.
export function profileErrors(profile, sidc) {
  if (!profile) return [];
  let details;
  try {
    details = (profile.validate(sidc, {}) || {}).details || {};
  } catch {
    return [];
  }
  return Object.keys(details)
    .filter((key) => /Errors$/.test(key) && Array.isArray(details[key]))
    .flatMap((key) => details[key]);
}

// Ask the profile about several candidate codes at once.
// - With a `baselineSidc`, errors the baseline already has are not the
//   candidate's fault (use it for "unspecified" versus a value).
// - Without one, errors shared by every candidate belong to other positions of
//   the SIDC (for example an invalid sector) and cannot be fixed by choosing a
//   value here, so they are ignored. A lone candidate is therefore always kept.
// Returns [{item, offered, reason}] in the order of `items`.
export function probeOffers(profile, items, sidcFor, baselineSidc) {
  const probed = items.map((item) => ({
    item,
    errors: profileErrors(profile, sidcFor(item))
  }));
  let ignored;
  if (baselineSidc !== undefined)
    ignored = profileErrors(profile, baselineSidc);
  else if (probed.length)
    ignored = probed
      .map((entry) => entry.errors)
      .reduce((all, errors) => all.filter((error) => errors.includes(error)));
  else ignored = [];
  return probed.map(({ item, errors }) => {
    const reasons = errors.filter((error) => !ignored.includes(error));
    return { item, offered: reasons.length === 0, reason: reasons[0] || "" };
  });
}

// Replace characters of a SIDC at `index`, padding when it is too short.
export function patchSidc(sidc, index, text, pad = "-") {
  const padded = sidc.padEnd(index + text.length, pad);
  return padded.slice(0, index) + text + padded.slice(index + text.length);
}

// A profile reason ends with its source in parentheses. Keep the sentence for
// the visible note and leave the source to a tooltip. Parentheses may nest.
export function shortReason(reason) {
  let text = String(reason || "").trim();
  while (text.endsWith(")")) {
    let depth = 0;
    let open = -1;
    for (let index = text.length - 1; index >= 0; index -= 1) {
      if (text[index] === ")") depth += 1;
      else if (text[index] === "(" && --depth === 0) {
        open = index;
        break;
      }
    }
    if (open <= 0) break;
    text = text.slice(0, open).trim();
  }
  return text;
}

// "landEquipment" -> "land equipment"
export function classWords(symbolClass) {
  return String(symbolClass || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();
}

// Profile reasons name classes and keys in camelCase ("not defined for
// landUnit"). Read them as words; the full text stays available as a tooltip.
export function humanize(text) {
  return String(text || "").replace(/\b[a-z]+(?:[A-Z][a-z]+)+\b/g, (word) =>
    classWords(word)
  );
}

// Why a field is unavailable, in one sentence, plus the profile's full wording.
// An unsupported profile field with the same code (the Land Unit AC block next
// to country text) says what the code means here.
export function explainUnavailable(state, extras = []) {
  const full = String(state.reason || "");
  const same = extras.find(
    (extra) => extra.field && extra.field === state.field
  );
  const short = humanize(shortReason(full)) || "Not available";
  return {
    short: same
      ? `${short}. ${same.field} here is ${same.label.toLowerCase()}: ${humanize(same.reason)}`
      : short,
    full: same ? `${full} | ${same.reason}` : full
  };
}

// ------------------------------------------------------------------ sectors

// Sector 1 / sector 2 choices of an APP-6D symbol set. `sectors` carries
// sectorDictionary, classifySectorCode and sectorPlacement from
// app6d-sectors.js. Only codes the dictionary defines are listed; a code the
// current entity may not use is listed but disabled with the profile's reason.
// `start` is the SIDC index of the sector's first digit (16 or 18).
export function sectorChoices({
  profile,
  sectors,
  sidc,
  set,
  sector,
  start,
  current
}) {
  const dictionary = sectors.sectorDictionary(set, sector);
  const placement = sectors.sectorPlacement(set, sector);
  const status =
    current && current !== "00"
      ? sectors.classifySectorCode(set, sector, current)
      : "none";
  if (!dictionary)
    return { dictionary: null, placement, entries: [], status, table: "" };
  const defined = dictionary.entries.filter(([code]) => code !== "00");
  const probed = probeOffers(
    profile,
    defined,
    ([code]) => patchSidc(sidc, start, code, "0"),
    patchSidc(sidc, start, "00", "0")
  );
  return {
    dictionary,
    placement,
    status,
    table: `Table ${dictionary.table}, PDF ${dictionary.pdf.join("-")}`,
    entries: probed.map(({ item, offered, reason }) => ({
      code: item[0],
      name: item[1],
      offered,
      reason
    }))
  };
}

export const sectorStatusLabels = {
  reserved: "reserved for future use",
  undefined: "not defined in this edition",
  vef: "version extension flag",
  none: "",
  defined: ""
};

// ------------------------------------------------------- engagement bar AO

// "A:BBB-CC" -> parts. Never throws; anything unrecognised stays in `rest`.
export function parseEngagement(text) {
  let rest = String(text || "");
  let a = "";
  let c = "";
  const colon = rest.indexOf(":");
  if (colon >= 0) {
    a = rest.slice(0, colon);
    rest = rest.slice(colon + 1);
  }
  const dash = rest.indexOf("-");
  if (dash >= 0) {
    c = rest.slice(dash + 1);
    rest = rest.slice(0, dash);
  }
  return { a, b: rest, c };
}

export function composeEngagement({ a, b, c }) {
  if (!b) return "";
  return `${a ? `${a}:` : ""}${b}${c ? `-${c}` : ""}`;
}

// Options of the three AO dropdowns. `errorFn` is the profile's engagement
// grammar check (empty string when valid). Counts for MLT are found by asking
// the grammar, not by repeating its range.
export function engagementOptions(parts, errorFn) {
  const pair = (choice) =>
    Array.isArray(choice) ? choice : [String(choice), String(choice)];
  const named = (name) =>
    (parts.find((part) => part.name === name) || { choices: [] }).choices.map(
      pair
    );
  const counts = [];
  for (let n = 2; n <= 99; n += 1) {
    const value = String(n).padStart(2, "0");
    if (!errorFn(`MLT-${value}`)) counts.push([value, `${n} engagements`]);
  }
  return {
    sources: named("A"),
    stages: named("BBB"),
    weapons: named("CC"),
    counts
  };
}

// -------------------------------------------------- text carried over editions

const stopWords = new Set([
  "of",
  "the",
  "and",
  "or",
  "an",
  "for",
  "in",
  "to",
  "is"
]);
const wordsOf = (label) =>
  new Set(
    (
      String(label || "")
        .toLowerCase()
        .match(/[a-z0-9]+/g) || []
    ).filter((word) => word.length > 1 && !stopWords.has(word))
  );

// What a text field meant where it was typed: its code, its name and the
// closed value list it offered, if any.
export function fieldMeaning(definition) {
  const choices = definition.choices
    ? definition.choices
        .map((choice) =>
          String(Array.isArray(choice) ? choice[0] : choice).toLowerCase()
        )
        .sort()
    : null;
  return {
    field: definition.field || "",
    label: definition.label || "",
    choices
  };
}

// Non-empty reason when the same free text would be read differently under
// `to` than it was typed under `from`. Two definitions agree when they share a
// field code, at least one significant word of their names, and (if both are
// closed lists) the same values.
export function meaningChange(from, to) {
  if (!from || !to) return "";
  if (from.field !== to.field)
    return `field ${from.field || "-"} is now field ${to.field || "-"}`;
  const before = wordsOf(from.label);
  const shared = [...wordsOf(to.label)].some((word) => before.has(word));
  if (!shared) return `"${from.label}" is now "${to.label}"`;
  if (
    from.choices &&
    to.choices &&
    from.choices.join("|") !== to.choices.join("|")
  )
    return "its list of allowed values changed";
  return "";
}

// Warnings about typed text the current edition or symbol reads differently or
// not at all. `states` come from profileFieldStates, `values` maps key -> text,
// `origins` maps key -> {meaning, where} recorded when the text was typed. The
// text itself is never touched.
export function carryWarnings({ states, values, origins, extras = [] }) {
  const warnings = [];
  for (const state of states) {
    const value = String(values[state.key] == null ? "" : values[state.key]);
    if (!value) continue;
    const base = {
      key: state.key,
      field: state.field,
      label: state.label,
      value
    };
    if (!state.available) {
      warnings.push({
        ...base,
        kind: "inactive",
        message: `${explainUnavailable(state, extras).short}. The text is kept but not drawn.`
      });
      continue;
    }
    const origin = origins[state.key];
    const change = origin && meaningChange(origin.meaning, fieldMeaning(state));
    if (change)
      warnings.push({
        ...base,
        kind: "changed",
        message: `Typed under ${origin.where}, where ${change}. Check that it still fits.`
      });
  }
  return warnings;
}

// Fields a profile defines for the symbol but marks supported:false (for
// example the APP-6D Land Unit AC installation block): there is no SIDC digit
// or renderer option to set them. They are listed so the user knows the field
// exists and why it cannot be set.
export function profileExtraFields(profile, sidc, knownKeys) {
  const defined = (profile && profile.fields(sidc)) || [];
  return defined
    .filter(
      (definition) =>
        definition.supported === false && !knownKeys.includes(definition.key)
    )
    .map((definition) => ({
      key: definition.key,
      field: definition.field || "",
      label: definition.label || definition.key,
      reason:
        definition.unresolved || "The renderer does not support this field"
    }));
}

// Inline hints from the metadata a field definition carries (minLength,
// maxLength, pattern/patternText). Returns {hint, problem}: the rule as help
// text, and what is wrong with the value, if anything.
export function fieldRule(definition, value) {
  const text = String(value || "");
  const hints = [];
  const problems = [];
  const length = Array.from(text).length;
  if (definition.minLength && definition.maxLength === definition.minLength)
    hints.push(`exactly ${definition.minLength} characters`);
  else if (definition.minLength)
    hints.push(`at least ${definition.minLength} characters`);
  if (definition.patternText) hints.push(definition.patternText);
  if (text) {
    if (definition.minLength && length < definition.minLength)
      problems.push(
        `needs ${definition.minLength === definition.maxLength ? "exactly" : "at least"} ${definition.minLength} characters`
      );
    if (definition.pattern && !definition.pattern.test(text))
      problems.push(
        definition.patternText
          ? `expected ${definition.patternText}`
          : "unexpected format"
      );
  }
  return { hint: hints.join("; "), problem: problems.join("; ") };
}

// ----------------------------------------------------- profile detail lines

const positionNames = {
  status: "status (position 7)",
  hqTaskForceDummy: "HQ / task force / dummy (position 8)",
  amplifier: "echelon / mobility / towed array (positions 9-10)",
  sector1: "sector 1 modifier (positions 17-18)",
  sector2: "sector 2 modifier (positions 19-20)"
};

// details.notes, details.unresolved and details.versionExtension as lines for
// the user. Duplicates collapse.
export function profileDetailLines(details) {
  const unique = (list) => [...new Set(list)];
  const info = details || {};
  return {
    notes: unique((info.notes || []).map(String)),
    unresolved: unique(
      (info.unresolved || []).map((item) =>
        typeof item === "string" ? item : `${item.id}: ${item.detail}`
      )
    ),
    versionExtension: unique(
      (info.versionExtension || []).map(
        (item) =>
          `Version Extension Flag in ${positionNames[item.position] || item.position} (code ${item.code}): extension content cannot be interpreted, so the symbol is reported as not valid.`
      )
    )
  };
}
