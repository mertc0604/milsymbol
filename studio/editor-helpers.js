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
  // L is for hostile equipment (Table III): the identities come from the table.
  if (entry.limits[index] > 0) return entry.identities && !entry.identities.includes(identity) ? "Hostile (H) only" : "";
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
// profile whose fields() returns null leaves every field available. A field
// the class table lists can still be ruled out for this SIDC: APP-6D lists L
// and N for all equipment, and its unavailableReason() limits them to hostile
// identities, as its validator does. The field's own unresolved note is not a
// rule-out; it is shown as a warning on an editable field.
export function profileFieldStates(textModifiers, profile, sidc) {
  const available = profile ? profile.fields(sidc) : null;
  if (!available) return fieldStates(textModifiers, null);
  return textModifiers.map(({ key, field, label }) => {
    const definition = available.find((item) => item.key === key);
    const reason = profile.unavailableReason(key, sidc);
    const ruledOut = definition && reason && reason !== definition.unresolved;
    if (definition && !ruledOut)
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
    return { key, field: definition?.field || field, label: definition?.label || label, available: false, maxLength: null, choices: null, reason: reason || "Not available" };
  });
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const twoDigits = (value) => String(value).padStart(2, "0");

// DDHHMMZMONYY, or DDHHMMZMONYYYY with fourDigitYear.
export function formatDtg(date, { fourDigitYear = false } = {}) {
  const year = fourDigitYear ? String(date.getUTCFullYear()).padStart(4, "0") : twoDigits(date.getUTCFullYear() % 100);
  return `${twoDigits(date.getUTCDate())}${twoDigits(date.getUTCHours())}${twoDigits(date.getUTCMinutes())}Z${months[date.getUTCMonth()]}${year}`;
}

// Now (UTC) for the W field of the current symbol: the year length the field's
// own pattern asks for (APP-6D Land Unit W1 four digits, Table 3-2 PDF 87/3-7;
// equipment and installations two). A field without a pattern gets two digits.
export function dtgForField(date, definition) {
  const short = formatDtg(date);
  const pattern = definition && definition.pattern;
  if (!pattern || pattern.test(short)) return short;
  const long = formatDtg(date, { fourDigitYear: true });
  return pattern.test(long) ? long : short;
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

// Field positions probe: each available text field without a value is drawn
// as its "[code]" marker, so the rows show where each field goes.
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

// The rows of a probe rendering whose text fields are all "[code]" markers.
// texts: the probe's <text> elements as {x, y, anchor, fontSize, middle,
// content}, in symbol units. A row keeps its anchor point, its vertical centre
// (y is the baseline unless the text is centred on it) and the fields in the
// order they are drawn.
export function readTextRows(texts, codes) {
  const markers = Object.keys(codes).map((marker) => marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!markers.length) return [];
  const pattern = new RegExp(`(${markers.join("|")})`);
  const rows = [];
  for (const text of texts) {
    const parts = text.content.split(pattern);
    const keys = parts.filter((part, index) => index % 2 && Object.hasOwn(codes, part)).map((part) => codes[part]);
    if (!keys.length) continue;
    rows.push({ anchor: text.anchor || "start", x: text.x, y: text.middle ? text.y : text.y - 0.35 * text.fontSize, keys });
  }
  return rows;
}

// Characters a box makes room for: a usual value, or the field's limit when
// that is shorter.
const boxChars = {
  dtg: 14, location: 15, altitudeDepth: 8, type: 9, uniqueDesignation: 16, speed: 8,
  reinforcedReduced: 3, staffComments: 16, additionalInformation: 16, higherFormation: 14,
  evaluationRating: 2, combatEffectiveness: 5, signatureEquipment: 1, hostile: 3, iffSif: 5,
  quantity: 5, specialHeadquarters: 8, headquartersElement: 8, engagementBar: 12, country: 3,
  platformType: 8, equipmentTeardownTime: 7, commonIdentifier: 10, installationComposition: 12,
  guardedUnit: 10, specialDesignator: 12
};

export function fieldValueChars(state) {
  const typical = boxChars[state.key] || 10;
  return state.maxLength ? Math.min(typical, state.maxLength) : typical;
}

// Narrows the side rows until the widest left row, the room between the side
// rows and the widest right row fit room. Names go first: the widest row of
// the wider side gives up its widest name, down to plain[key] (the box's code
// and a usual value), until the rows fit or no widest row has a name left.
// Then value room goes: the narrower side keeps its boxes when the other can
// give up enough, otherwise both give up in proportion, the widest boxes most,
// down to min px. null when the rows cannot fit even then. rows as
// readTextRows() gives them; widths and plain by field key.
export function fitRowWidths(rows, widths, { room, between, plain = widths, gap = 8, min = 48 }) {
  const fitted = { ...widths };
  const spaces = (row) => gap * (row.keys.length - 1);
  const span = (row) => row.keys.reduce((sum, key) => sum + fitted[key], 0) + spaces(row);
  const side = (anchor) => rows.filter((row) => row.anchor === anchor);
  const widest = (anchor) => side(anchor).reduce((best, row) => (best && span(best) >= span(row) ? best : row), null);
  const need = (anchor) => (widest(anchor) ? span(widest(anchor)) : 0);
  const floor = (anchor) => Math.max(0, ...side(anchor).map((row) => row.keys.length * min + spaces(row)));
  const free = room - between;
  const named = (row) => row.keys.filter((key) => fitted[key] > plain[key]).sort((a, b) => fitted[b] - plain[b] - (fitted[a] - plain[a]));
  while (need("end") + need("start") > free) {
    const order = need("end") >= need("start") ? ["end", "start"] : ["start", "end"];
    const key = order.map((anchor) => widest(anchor) && named(widest(anchor))[0]).find(Boolean);
    if (!key) break;
    fitted[key] = plain[key];
  }
  const left = need("end");
  const right = need("start");
  if (left + right <= free) return fitted;
  if (floor("end") + floor("start") > free) return null;
  let caps;
  if (left <= right && free - left >= floor("start")) caps = { end: left, start: free - left };
  else if (right < left && free - right >= floor("end")) caps = { end: free - right, start: right };
  else {
    const end = Math.min(free - floor("start"), Math.max(floor("end"), (free * left) / (left + right)));
    caps = { end, start: free - end };
  }
  for (const anchor of ["end", "start"])
    for (const row of side(anchor)) {
      for (const key of named(row)) {
        if (span(row) <= caps[anchor]) break;
        fitted[key] = plain[key];
      }
      const excess = span(row) - caps[anchor];
      if (excess <= 0) continue;
      const slack = row.keys.reduce((sum, key) => sum + fitted[key] - min, 0);
      for (const key of row.keys) fitted[key] = Math.floor(fitted[key] - (excess * (fitted[key] - min)) / slack);
    }
  return fitted;
}

// Boxes for the rows, in editor pixels: rows as readTextRows() gives them,
// already scaled; widths by field key. Each row grows away from its anchor:
// left of an "end" anchor, right of a "start" one, centred on a "middle" one.
// A centred row too wide for the room between the side rows at its height
// moves away from center (the symbol's vertical centre) past them when that
// is less than a row away, and narrows otherwise. Any row that would meet a
// box already placed moves away from center until it is clear.
export function layoutFieldBoxes(rows, widths, { height = 30, gap = 8, center = 0 } = {}) {
  const boxes = [];
  const meets = (a, b) =>
    a.left < b.left + b.width + gap / 2 &&
    b.left < a.left + a.width + gap / 2 &&
    a.top < b.top + b.height + gap / 2 &&
    b.top < a.top + a.height + gap / 2;
  const centred = (row) => row.anchor === "middle";
  const ordered = [...rows].sort((a, b) => centred(a) - centred(b) || Math.abs(a.y - center) - Math.abs(b.y - center));
  for (const row of ordered) {
    const spaces = gap * (row.keys.length - 1);
    const step = row.y < center ? -1 : 1;
    let sizes = row.keys.map((key) => widths[key]);
    let y = row.y;
    if (centred(row)) {
      const spanAt = (at) => {
        const beside = rows.filter((other) => !centred(other) && Math.abs(other.y - at) < height + gap / 2);
        return 2 * (Math.min(...beside.map((other) => (other.anchor === "start" ? other.x - row.x : row.x - other.x))) - gap);
      };
      const natural = sizes.reduce((sum, size) => sum + size, 0);
      let shift = 0;
      while (shift <= height + gap && natural + spaces > spanAt(row.y + step * shift)) shift++;
      if (shift <= height + gap) y = row.y + step * shift;
      else sizes = sizes.map((size) => Math.max(40, Math.floor((size * (spanAt(row.y) - spaces)) / natural)));
    }
    const total = sizes.reduce((sum, size) => sum + size, 0) + spaces;
    let left = row.anchor === "end" ? row.x - total : centred(row) ? row.x - total / 2 : row.x;
    const own = sizes.map((width, index) => {
      const box = { key: row.keys[index], left, top: y - height / 2, width, height };
      left += width + gap;
      return box;
    });
    for (let guard = 0; guard < 24; guard++) {
      const hit = boxes.find((box) => own.some((item) => meets(item, box)));
      if (!hit) break;
      const top = step < 0 ? hit.top - gap - height : hit.top + hit.height + gap;
      for (const item of own) item.top = top;
    }
    boxes.push(...own);
  }
  return boxes;
}

// Status line under the symbol palette, which loads its results in batches.
export function paletteProgress(shown, total) {
  if (!total) return "";
  if (total === 1) return "1 symbol shown";
  const count = (value) => value.toLocaleString("en-US");
  return shown < total ? `Showing ${count(shown)} of ${count(total)}` : `All ${count(total)} symbols shown`;
}
