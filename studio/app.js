import { app6aSymbolClass, app6aTextFields, getApp6aFields } from "./vendor/letter-metadata.js";
import * as app6aRules from "./vendor/modifierprofiles/app6a.js";
import { std2525cProfile } from "./vendor/modifierprofiles/std2525c.js";
import {
  app6dProfile,
  app6dContexts,
  app6dIdentityName,
  app6dStatuses,
  app6dEngagementError
} from "./vendor/modifierprofiles/app6d.js";
import * as app6dSectors from "./vendor/modifierprofiles/app6d-sectors.js";
import { decodeEditorSidc, editImportedSidc, numericSidcEdition } from "./sidc-editor.js";
import { modifierGroups, textModifiers, collectTextModifiers } from "./modifier-fields.js";
import {
  probeOffers,
  patchSidc,
  shortReason,
  humanize,
  classWords,
  sectorChoices,
  sectorStatusLabels,
  parseEngagement,
  composeEngagement,
  engagementOptions,
  fieldMeaning,
  carryWarnings,
  fieldRule,
  profileExtraFields,
  profileDetailLines
} from "./profile-controls.js";

import { fieldStates, profileFieldStates, formatDtg, evaluationRating, sidcParts, pushRecent, placeholderOptions, paletteProgress } from "./editor-helpers.js";
import { fieldReference } from "./field-reference.js";
import { app6aIdentities, contextOptions, convertIdentity, decodeIdentity, identityCode, identityLabel, identityList } from "./identities.js";
import { createCountryFlagPart } from "./country-flags.js";
import { countryCodeForFlag, countryFlagFromSidc, countrySidcField, withCountryFlag } from "./country-codes.js";

const standards = [
  {
    id: "app6a",
    label: "APP‑6A",
    detail: "NATO / 1998",
    family: "legacy",
    standard: "APP6A",
    version: ""
  },
  {
    id: "app6b",
    label: "APP‑6B",
    detail: "NATO / 15 CHAR",
    family: "legacy",
    standard: "APP6",
    version: ""
  },
  {
    id: "app6d",
    label: "APP‑6D",
    detail: "NATO / D",
    family: "modern",
    standard: "APP6",
    version: "10"
  },
  {
    id: "app6e",
    label: "APP‑6E",
    detail: "NATO / E",
    family: "modern",
    standard: "APP6",
    version: "13"
  },
  {
    id: "2525c",
    label: "MIL‑2525C",
    detail: "15 CHAR",
    family: "legacy",
    standard: "2525C",
    version: ""
  },
  {
    id: "2525d",
    label: "MIL‑2525D",
    detail: "NUMERIC / D",
    family: "modern",
    standard: "2525",
    version: "10"
  },
  {
    id: "2525e",
    label: "MIL‑2525E",
    detail: "NUMERIC / E",
    family: "modern",
    standard: "2525",
    version: "13"
  }
];

// Edition modifier profiles shared with the renderer. APP-6A falls back to its
// Table III helpers until the edition exports a profile object.
const profiles = { app6a: app6aRules.app6aProfile, "2525c": std2525cProfile, app6d: app6dProfile };
const profileNotes = {
  app6a: "APP-6A Table III (pp. 19–21). Only applicable fields are editable; limits follow the publication.",
  "2525c": "MIL-STD-2525C Table IV (pp. 22–24) for warfighting (S) symbols. Only applicable fields are editable; limits follow the publication.",
  app6d: "APP-6D amplifier tables of this symbol set. Only applicable fields are editable; limits appear only where the publication sets one."
};
const profileTitles = { app6a: "APP-6A Table III", "2525c": "MIL-STD-2525C Table IV", app6d: "APP-6D" };
const activeProfile = () => profiles[state.standardId] || null;
// Names come from the edition's own table when its profile has one: APP-6D
// names Joker and Faker only with context 1 and calls status 2-5 "Present/...".
function identityLabelFor(entry, context = state.context) {
  const named = state.standardId === "app6d" && entry.numeric && app6dIdentityName(context, entry.numeric);
  return named || identityLabel(entry, context);
}
function statusLabelFor(entry) {
  const named = state.standardId === "app6d" && app6dStatuses.find((item) => item.digit === entry.numeric);
  return named ? named.name : entry.label;
}
// "Exercise (US only)": the profile's note says where a context may be used.
function contextLabelFor([value, label]) {
  const context = state.standardId === "app6d" && app6dContexts.find((item) => item.digit === value);
  return context ? `${context.name}${/\bUS\b/.test(context.note || "") ? " (US only)" : ""}` : label;
}

const statuses = [
  { value: "present", label: "Present", numeric: "0", legacy: "P" },
  {
    value: "planned",
    label: "Planned / anticipated",
    numeric: "1",
    legacy: "A"
  },
  { value: "fullyCapable", label: "Fully capable", numeric: "2", legacy: "C" },
  { value: "damaged", label: "Damaged", numeric: "3", legacy: "D" },
  { value: "destroyed", label: "Destroyed", numeric: "4", legacy: "X" },
  {
    value: "fullToCapacity",
    label: "Full to capacity",
    numeric: "5",
    legacy: "F"
  }
];

const echelons = [
  ["", "Unspecified", "00", "-"],
  ["team", "Team / crew", "11", "A"],
  ["squad", "Squad", "12", "B"],
  ["section", "Section", "13", "C"],
  ["platoon", "Platoon / detachment", "14", "D"],
  ["company", "Company / battery", "15", "E"],
  ["battalion", "Battalion / squadron", "16", "F"],
  ["regiment", "Regiment / group", "17", "G"],
  ["brigade", "Brigade", "18", "H"],
  ["division", "Division", "21", "I"],
  ["corps", "Corps / MEF", "22", "J"],
  ["army", "Army", "23", "K"],
  ["armyGroup", "Army group / front", "24", "L"],
  ["region", "Region / theater", "25", "M"],
  ["command", "Command", "26", "N"]
];

const mobilities = [
  ["", "Unspecified", "00", "--"],
  ["wheeledLimited", "Wheeled, limited cross-country", "31", "MO"],
  ["wheeled", "Wheeled, cross-country", "32", "MP"],
  ["tracked", "Tracked", "33", "MQ"],
  ["combined", "Wheeled and tracked", "34", "MR"],
  ["towed", "Towed", "35", "MS"],
  ["rail", "Rail", "36", "MT"],
  ["pack", "Pack animals", "37", "MW"],
  ["snow", "Over snow", "41", "MU"],
  ["sled", "Sled", "42", "MV"],
  ["barge", "Barge", "51", "MX"],
  ["amphibious", "Amphibious", "52", "MY"],
  ["shortArray", "Short towed array", "61", "NS"],
  ["longArray", "Long towed array", "62", "NL"]
];

const dom = Object.fromEntries(
  [
    "standardSelect",
    "symbolSearch",
    "clearSearch",
    "searchLauncher",
    "searchPanel",
    "searchResults",
    "categoryList",
    "recentSection",
    "recentGrid",
    "resultHeading",
    "symbolGrid",
    "resultCount",
    "paletteStatus",
    "selectedName",
    "selectedPath",
    "symbolPreview",
    "stage",
    "gridToggle",
    "outlineToggle",
    "positionsToggle",
    "previewHint",
    "symbolClass",
    "sidcStatus",
    "identityChips",
    "identityNote",
    "identityAdjust",
    "uncertaintyField",
    "uncertaintyMarker",
    "uncertaintyNote",
    "statusChips",
    "statusMeta",
    "statusNote",
    "statusAdjust",
    "designationMeta",
    "designationNote",
    "amplifierMeta",
    "amplifierNote",
    "amplifierAdjust",
    "countryMeta",
    "flagSwatch",
    "editionMeta",
    "textSummary",
    "carryNotes",
    "profileExtras",
    "profileDetails",
    "profileIssues",
    "profileNotesBox",
    "profileNotesSummary",
    "profileNotesList",
    "toggleUnavailable",
    "clearText",
    "textFilledBadge",
    "graphicsBadge",
    "directionNumber",
    "directionDial",
    "directionNeedle",
    "directionNote",
    "hqStaffNote",
    "showFlag",
    "fillColorOn",
    "fillColor",
    "monoColorOn",
    "monoColor",
    "infoColorOn",
    "infoColor",
    "infoBackgroundOn",
    "infoBackground",
    "fillOpacity",
    "fillOpacityOutput",
    "infoSize",
    "infoSizeOutput",
    "outlineWidth",
    "outlineWidthOutput",
    "outlineColor",
    "sidcInput",
    "applySidc",
    "copySidc",
    "sidcLength",
    "sidcSegments",
    "downloadSvg",
    "downloadPng",
    "copySvg",
    "renderState",
    "affiliation",
    "context",
    "contextField",
    "status",
    "colorMode",
    "countryFlag",
    "hq",
    "taskForce",
    "feintDummy",
    "amplifierMode",
    "amplifierLabel",
    "amplifierValue",
    "symbolModifiers",
    "modifier1",
    "modifier2",
    "modifierNote",
    "direction",
    "directionOutput",
    "speedLeader",
    "hqStaffLength",
    "stack",
    "frameShape",
    "frameShapeField",
    "fill",
    "frame",
    "icon",
    "infoFields",
    "symbolSize",
    "sizeOutput",
    "strokeWidth",
    "strokeOutput",
    "resetButton",
    "helpButton",
    "helpDialog",
    "closeHelp",
    "toast"
  ].map((id) => [id, document.getElementById(id)])
);

// The symbol palette renders its results in batches as the list scrolls.
const paletteBatch = 40;

const state = {
  standardId: "app6a",
  selectedId: null,
  search: "",
  category: "all",
  visible: paletteBatch,
  affiliation: "friend",
  context: "0",
  status: "present",
  amplifierMode: "echelon",
  amplifierValue: "",
  modifier1: "",
  modifier2: "",
  customSidc: "",
  importedIcon: null,
  outline: false,
  positions: false,
  searchOpen: false,
  sidcDirty: false,
  sidcMessage: null,
  showUnavailable: true,
  focusField: "",
  recent: [],
  // Fallbacks the Studio made after the edition profile rejected a selection.
  adjustments: {},
  // Where free text was typed (key -> {meaning, where}); see carryWarnings().
  textOrigins: {},
  // Select values dropped because the edition does not define them (key -> text).
  droppedChoices: {}
};

let catalog;
let flagArtwork = new Map();
let currentSymbol;
let currentSvg = "";
let toastTimer;

const config = () =>
  standards.find((standard) => standard.id === state.standardId);
const dataset = () => {
  const key = catalog.aliases?.[state.standardId] || state.standardId;
  return catalog.standards[key];
};
const selectedIcon = () =>
  (state.customSidc && state.importedIcon) ||
  dataset().icons.find((icon) => icon.id === state.selectedId) ||
  dataset().icons[0];
const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      })[character]
  );
const option = (value, label) =>
  `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`;

function toast(message) {
  dom.toast.textContent = message;
  dom.toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => dom.toast.classList.remove("visible"), 1800);
}

function currentOptions(minimal = false) {
  const direction = Number(dom.direction.value);
  const app6a = state.standardId === "app6a";
  const sidc = state.customSidc || buildSidc();
  const values = minimal ? {} : Object.fromEntries(textModifiers.map(({ key, id }) =>
    [key, document.getElementById(id)?.value || ""]
  ));
  const options = {
    standard: config().standard,
    countryFlag: minimal || !dom.showFlag.checked ? "" : dom.countryFlag.value,
    size: minimal ? 34 : Number(dom.symbolSize.value),
    strokeWidth: Number(dom.strokeWidth.value),
    colorMode: dom.colorMode.value,
    fill: minimal ? true : dom.fill.checked,
    frame: minimal ? true : dom.frame.checked,
    icon: minimal ? true : dom.icon.checked,
    infoFields: minimal ? false : dom.infoFields.checked,
    outlineWidth: !minimal && state.outline ? Number(dom.outlineWidth.value) : 0,
    outlineColor: dom.outlineColor.value,
    fillColor: !minimal && dom.fillColorOn.checked ? dom.fillColor.value : "",
    monoColor: !minimal && dom.monoColorOn.checked ? dom.monoColor.value : "",
    fillOpacity: minimal ? 1 : Number(dom.fillOpacity.value) / 100,
    infoColor: !minimal && dom.infoColorOn.checked ? dom.infoColor.value : "",
    infoSize: minimal ? 40 : Number(dom.infoSize.value),
    infoBackground: !minimal && dom.infoBackgroundOn.checked ? dom.infoBackground.value : "",
    ...collectTextModifiers(values, profiledFieldKeys(sidc)),
    direction: minimal || direction < 0 ? undefined : direction,
    speedLeader: minimal ? 0 : Number(dom.speedLeader.value),
    hqStaffLength: minimal ? 0 : Number(dom.hqStaffLength.value),
    stack: minimal || app6a ? 0 : Number(dom.stack.value)
  };
  // APP-6A 503.1a lets the "?" of pending, assumed friend and suspect sit in field E or in the frame.
  if (app6a && !minimal && dom.uncertaintyMarker.value !== "table") options.uncertaintyMarker = dom.uncertaintyMarker.value;
  if (app6a && app6aSymbolClass(sidc) === "point") options.direction = undefined;
  return options;
}

function flagCode() {
  return (
    (dom.feintDummy.checked && !dom.feintDummy.disabled ? 1 : 0) +
    (dom.hq.checked && !dom.hq.disabled ? 2 : 0) +
    (dom.taskForce.checked && !dom.taskForce.disabled ? 4 : 0)
  );
}

// Position 11 of a letter SIDC, indexed by flagCode(): feint/dummy 1, HQ 2, task force 4.
const legacyFlagLetters = ["-", "F", "A", "C", "E", "G", "B", "D"];

function legacyFlagCharacter() {
  return legacyFlagLetters[flagCode()];
}

// What the active edition profile accepts for this symbol. Each candidate value
// is written into the SIDC and handed to profile.validate(); a value is
// offered only when that adds no SIDC-level error (see profile-controls.js).
// Returns null when the edition has no profile (or APP-6A, which keeps its
// own Table III rules for these controls).
const offerCache = new Map();
function profileOffers(sidc) {
  const profile = activeProfile();
  if (!profile) return null;
  const key = `${state.standardId}|${state.context}|${sidc}`;
  if (offerCache.has(key)) return offerCache.get(key);
  const standard = config();
  const modern = standard.family === "modern";
  const pad = modern ? "0" : "-";
  const base = sidc.padEnd(modern ? 20 : 15, pad);
  const at = modern ? { identity: 3, status: 6, flags: 7, amplifier: 8 } : { identity: 1, status: 3, flags: 10, amplifier: 10 };
  const map = (rows, valueOf) => new Map(rows.map(({ item, offered, reason }) => [valueOf(item), { offered, reason }]));
  const offers = {
    identity: map(
      probeOffers(profile, identityList(standard), (entry) => patchSidc(base, at.identity, identityCode(entry, standard, state.context), pad)),
      (entry) => entry.value
    ),
    status: map(
      probeOffers(profile, statusChoices(), (entry) => patchSidc(base, at.status, modern ? entry.numeric : entry.legacy, pad)),
      (entry) => entry.value
    )
  };
  if (state.standardId !== "app6a") {
    // Flags and amplifiers are probed one at a time against a symbol that has none.
    const clear = patchSidc(base, at.amplifier, modern ? "00" : "--", pad);
    const flagsClear = patchSidc(base, at.flags, modern ? "0" : "--", pad);
    const flagProbe = (code) => probeOffers(profile, [code], (value) => patchSidc(flagsClear, at.flags, modern ? String(value) : `${legacyFlagLetters[value]}-`, pad), flagsClear)[0];
    offers.flags = { feintDummy: flagProbe(1), hq: flagProbe(2), taskForce: flagProbe(4) };
    const amplifiers = [...echelons, ...mobilities].filter((item) => item[0] !== "");
    offers.amplifier = map(
      probeOffers(
        profile,
        amplifiers,
        (item) => patchSidc(clear, at.amplifier, modern ? item[2] : echelons.includes(item) ? `-${item[3]}` : item[3], pad),
        clear
      ),
      (item) => item[0]
    );
  }
  if (offerCache.size > 300) offerCache.clear();
  offerCache.set(key, offers);
  return offers;
}

// Statuses of the edition as they are listed in the status select.
function statusChoices() {
  return state.standardId === "app6a" ? statuses.slice(0, 2) : statuses;
}

// A new symbol or standard can leave a selection the edition profile rejects
// for it (a "damaged" status on a unit). Fall back to a value the profile
// accepts and say so next to the control. An imported SIDC is never rewritten:
// its rejected values stay, flagged, so the code the user pasted is kept.
function reconcileSelections() {
  if (state.customSidc) return;
  const offers = profileOffers(buildSidc());
  if (!offers) return;
  const rejected = (kind, value) => {
    const offer = offers[kind].get(value);
    return offer && !offer.offered ? offer : null;
  };
  const firstOffered = (kind, preferred) =>
    offers[kind].get(preferred)?.offered ? preferred : [...offers[kind]].find(([, offer]) => offer.offered)?.[0];
  const note = (what, current, reason, next) => `${what} ${current} does not fit this symbol (${humanize(shortReason(reason))}); switched to ${next}.`;
  let offer = rejected("identity", state.affiliation);
  if (offer) {
    const next = firstOffered("identity", "friend");
    const label = (value) => identityLabelFor(identityList(config()).find((item) => item.value === value) || { label: value });
    if (next) {
      state.adjustments.identity = note("Identity", label(state.affiliation), offer.reason, label(next));
      state.affiliation = next;
    }
  }
  offer = rejected("status", state.status);
  if (offer) {
    const next = firstOffered("status", "present");
    const label = (value) => statusLabelFor(statuses.find((item) => item.value === value) || { label: value });
    if (next) {
      state.adjustments.status = note("Status", label(state.status), offer.reason, label(next));
      state.status = next;
    }
  }
  if (offers.amplifier) {
    offer = state.amplifierValue && offers.amplifier.get(state.amplifierValue);
    if (offer && !offer.offered) {
      const label = [...echelons, ...mobilities].find((item) => item[0] === state.amplifierValue)?.[1] || state.amplifierValue;
      state.adjustments.amplifier = note("Amplifier", label, offer.reason, "unspecified");
      state.amplifierValue = "";
    }
    // A mode with nothing to offer ("echelon" on equipment) moves to the other
    // mode when that one has values, else to none. The value stays unspecified.
    const hasOffer = (list) => list.some((item) => item[0] !== "" && offers.amplifier.get(item[0])?.offered);
    const modes = { echelon: echelons, mobility: mobilities };
    if (modes[state.amplifierMode] && !hasOffer(modes[state.amplifierMode])) {
      const other = state.amplifierMode === "echelon" ? "mobility" : "echelon";
      state.amplifierMode = hasOffer(modes[other]) ? other : "none";
      state.amplifierValue = "";
    }
  }
}

function applyModernModifier(sidc, value, type) {
  if (!value) return;
  const [scope, code] = value.split(":");
  const start = type === 1 ? 16 : 18;
  if (scope === "common" && code.length === 3) {
    sidc[start] = code[1];
    sidc[start + 1] = code[2];
    sidc[type === 1 ? 20 : 21] = code[0];
  } else {
    sidc[start] = code.padStart(2, "0")[0];
    sidc[start + 1] = code.padStart(2, "0")[1];
  }
}

function buildSidc(icon = selectedIcon(), minimal = false) {
  if (!icon) return "";
  const standard = config();
  const affiliation = identityList(standard).find(
    (item) => item.value === (minimal ? "friend" : state.affiliation)
  );
  const identity = affiliation
    ? identityCode(affiliation, standard, minimal ? "0" : state.context)
    : state.affiliation.split(":").at(-1);
  const status = statuses.find(
    (item) => item.value === (minimal ? "present" : state.status)
  ) || { legacy: state.status.split(":").at(-1), numeric: state.status.split(":").at(-1) };

  if (standard.family === "legacy") {
    let amplifier = [minimal ? "-" : legacyFlagCharacter(), "-"];
    if (!minimal && state.amplifierMode === "echelon") {
      amplifier = [
        legacyFlagCharacter(),
        echelons.find((item) => item[0] === state.amplifierValue)?.[3] || (state.amplifierValue.startsWith("code:") ? state.amplifierValue.slice(5) : "-")
      ];
    } else if (!minimal && state.amplifierMode === "mobility") {
      amplifier = [
        ...(mobilities.find((item) => item[0] === state.amplifierValue)?.[3] ||
          (state.amplifierValue.startsWith("code:") ? state.amplifierValue.slice(5) : "--"))
      ];
    }
    if ((state.standardId === "app6a" || state.customSidc) && icon.defaultModifier?.startsWith("H")) {
      amplifier = ["H", !minimal && dom.feintDummy.checked ? "B" : "-"];
    }
    if (state.standardId === "app6a" && icon.codingScheme === "G")
      amplifier = ["-", "-"];
    const sidc = `${icon.codingScheme || "S"}${icon.prescribedAffiliation || identity}${icon.battleDimension || "G"}${icon.prescribedStatus || status.legacy}${icon.code || "------"}${amplifier.join("")}---`;
    return minimal ? sidc : withCountryFlag(sidc, dom.countryFlag.value, state.standardId);
  }

  const sidc = Array(30).fill("0");
  sidc.splice(0, 2, ...standard.version);
  sidc[2] = minimal ? "0" : state.context;
  sidc[3] = identity;
  sidc.splice(4, 2, ...(icon.symbolSet || "10").padStart(2, "0"));
  sidc[6] = status.numeric;
  sidc[7] = minimal ? "0" : String(flagCode());
  const amplifier =
    minimal || state.amplifierMode === "none"
      ? "00"
      : state.amplifierMode === "mobility"
        ? mobilities.find((item) => item[0] === state.amplifierValue)?.[2] ||
          (state.amplifierValue.startsWith("code:") ? state.amplifierValue.slice(5) : "00")
        : echelons.find((item) => item[0] === state.amplifierValue)?.[2] ||
          (state.amplifierValue.startsWith("code:") ? state.amplifierValue.slice(5) : "00");
  sidc.splice(8, 2, ...amplifier);
  sidc.splice(10, 6, ...(icon.code || "000000").padEnd(6, "0").slice(0, 6));
  if (!minimal) {
    applyModernModifier(sidc, state.modifier1, 1);
    applyModernModifier(sidc, state.modifier2, 2);
    if (standard.version === "13") sidc[22] = dom.frameShape.value;
  }
  return minimal ? sidc.join("") : withCountryFlag(sidc.join(""), dom.countryFlag.value, state.standardId);
}

function renderStandardSelect() {
  dom.standardSelect.innerHTML = standards
    .map((standard) => `<option value="${standard.id}">${standard.label}</option>`)
    .join("");
  dom.standardSelect.value = state.standardId;
}

function setStandard(id) {
  const next = standards.find((item) => item.id === id);
  if (!next) return;
  state.standardId = id;
  state.adjustments = {};
  loadRecent();
  const identity = convertIdentity({ value: state.affiliation, context: state.context }, next);
  state.affiliation = identity.value;
  state.context = identity.context;
  state.selectedId = null;
  state.category = "all";
  state.visible = paletteBatch;
  state.modifier1 = "";
  state.modifier2 = "";
  state.customSidc = "";
  state.importedIcon = null;
  if (id === "app6a" && !["present", "planned"].includes(state.status))
    state.status = "present";
  window.ms.setStandard(next.standard);
  renderStandardSelect();
  populateCategories();
  chooseInitialSymbol();
  syncStandardControls();
  renderCatalog();
  renderAll();
  document.querySelector(".control-scroll").scrollTop = 0;
}

function chooseInitialSymbol() {
  const matches = filteredIcons();
  const icons = matches.length ? matches : dataset().icons;
  const preferred =
    icons.find((icon) => /infantry$/i.test(icon.name)) ||
    icons.find((icon) => /infantry/i.test(icon.name)) ||
    icons[0];
  state.selectedId = preferred?.id || null;
}

function populateCategories() {
  const counts = new Map();
  for (const icon of dataset().icons) counts.set(icon.category, (counts.get(icon.category) || 0) + 1);
  const categories = [...counts.keys()].sort((a, b) => a.localeCompare(b));
  const button = (value, label, count) =>
    `<button type="button" data-category="${escapeHtml(value)}" aria-pressed="${value === state.category}"><span>${escapeHtml(label)}</span><small>${count.toLocaleString("en-US")}</small></button>`;
  dom.categoryList.innerHTML =
    button("all", "All symbol sets", dataset().icons.length) +
    categories.map((item) => button(item, item, counts.get(item))).join("");
}

function recentKey() {
  return `symbol-studio:recent:${state.standardId}`;
}

function loadRecent() {
  try {
    const stored = JSON.parse(localStorage.getItem(recentKey()) || "[]");
    state.recent = Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : [];
  } catch {
    state.recent = [];
  }
}

function rememberRecent(id) {
  state.recent = pushRecent(state.recent, id);
  try {
    localStorage.setItem(recentKey(), JSON.stringify(state.recent));
  } catch {}
}

function symbolCard(icon) {
  return `
    <button type="button" class="symbol-card ${icon.id === state.selectedId ? "active" : ""}" aria-pressed="${icon.id === state.selectedId}" data-symbol-id="${escapeHtml(icon.id)}" title="${escapeHtml(icon.name + (icon.categoryOnly ? " — Category: no separate illustration in APP-6A" : ""))}">
      <span class="mini-symbol">${safeMiniSvg(icon)}</span>
      <strong>${escapeHtml(icon.name)}${icon.categoryOnly ? ' <span class="category-badge">Category</span>' : ""}</strong>
      <small><span class="card-category">${escapeHtml(icon.category)}</span><span aria-hidden="true">·</span><span class="card-code">${escapeHtml(icon.code)}</span></small>
    </button>`;
}

function openSearch() {
  if (state.searchOpen) return dom.symbolSearch.focus();
  state.searchOpen = true;
  dom.searchPanel.hidden = false;
  dom.searchLauncher.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  renderCatalog();
  dom.symbolSearch.focus();
  dom.symbolSearch.select();
}

function closeSearch() {
  if (!state.searchOpen) return;
  state.searchOpen = false;
  dom.searchPanel.hidden = true;
  dom.searchLauncher.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  dom.searchLauncher.focus();
}

function filteredIcons() {
  const term = normalize(state.search).trim();
  const code = state.search.toUpperCase().replace(/\s/g, "");
  return dataset().icons.filter((icon) => {
    if (state.category !== "all" && icon.category !== state.category)
      return false;
    if (!term) return true;
    if (/^[A-Z][A-Z-][A-Z][A-Z*-][A-Z0-9-]{6}[A-Z0-9*-]{0,5}$/.test(code) && config().family === "legacy")
      return icon.id === `${code[0]}-${code[2]}-${code.slice(4,10)}`;
    if (/^\d{20,30}$/.test(code) && config().family === "modern")
      return icon.symbolSet === code.slice(4,6) && icon.code === code.slice(10,16);
    return normalize(
      [icon.name, icon.category, icon.code, icon.id, ...(icon.path || [])].join(" ")
    ).includes(term);
  });
}

function safeMiniSvg(icon) {
  try {
    return new window.ms.Symbol(
      buildSidc(icon, true),
      currentOptions(true)
    ).asSVG();
  } catch {
    return "<span>—</span>";
  }
}

function renderCatalog() {
  const focusedId = document.activeElement?.dataset.symbolId;
  const icons = filteredIcons();
  const visible = icons.slice(0, state.visible);
  dom.resultCount.textContent = icons.length.toLocaleString("en-US");
  dom.resultHeading.textContent = state.search.trim()
    ? `Results in ${state.category === "all" ? "all symbol sets" : state.category}`
    : state.category === "all" ? "All symbol sets" : state.category;
  dom.clearSearch.hidden = !state.search;
  for (const button of dom.categoryList.querySelectorAll("[data-category]"))
    button.setAttribute("aria-pressed", String(button.dataset.category === state.category));
  const recent = !state.search.trim() && state.category === "all"
    ? state.recent.map((id) => dataset().icons.find((icon) => icon.id === id)).filter(Boolean)
    : [];
  dom.recentSection.hidden = !recent.length;
  dom.recentGrid.innerHTML = recent.map(symbolCard).join("");
  dom.symbolGrid.innerHTML = visible.length
    ? visible.map(symbolCard).join("")
    : `<div class="empty-state">No symbols found.<br>Try a different name, code, or symbol set.</div>`;
  dom.paletteStatus.textContent = paletteProgress(visible.length, icons.length);
  if (focusedId && dom.searchPanel.contains(document.activeElement)) [...dom.symbolGrid.querySelectorAll("[data-symbol-id]")].find(card=>card.dataset.symbolId === focusedId)?.focus({preventScroll:true});
  fillPalette();
}

// Append the next batch of results; returns false when every result is shown.
function appendCatalogBatch() {
  const icons = filteredIcons();
  const batch = icons.slice(state.visible, state.visible + paletteBatch);
  if (!batch.length) return false;
  dom.symbolGrid.insertAdjacentHTML("beforeend", batch.map(symbolCard).join(""));
  state.visible += batch.length;
  dom.paletteStatus.textContent = paletteProgress(state.visible, icons.length);
  return true;
}

// Keep loading while the end of the list is within 400px of the visible area,
// so scrolling never reaches a gap and tall windows fill on open.
function fillPalette() {
  if (!state.searchOpen) return;
  const list = dom.searchResults;
  while (list.scrollHeight - list.scrollTop - list.clientHeight < 400 && appendCatalogBatch());
}

function mobilityNameFor(offers) {
  if (!offers || !offers.amplifier) return "Mobility";
  const offered = mobilities.filter((item) => item[0] !== "" && offers.amplifier.get(item[0])?.offered);
  const arrays = offered.filter((item) => ["shortArray", "longArray"].includes(item[0]));
  if (!arrays.length) return "Mobility";
  return arrays.length === offered.length ? "Towed array" : "Mobility / towed array";
}

function populateAmplifier() {
  let source = state.amplifierMode === "mobility" ? mobilities : echelons;
  if (state.standardId === "app6a")
    source = source.filter((item) => !["N", "NS", "NL"].includes(item[3]));
  // Edition profiles list only the echelons, mobilities and towed arrays the
  // symbol may carry; a current value they reject stays, flagged.
  const offers = profileOffers(state.customSidc || buildSidc());
  const rejected = new Map();
  if (offers && offers.amplifier)
    source = source.filter((item) => {
      const offer = offers.amplifier.get(item[0]);
      if (!offer || offer.offered) return true;
      if (item[0] !== state.amplifierValue) return false;
      rejected.set(item[0], offer.reason);
      return true;
    });
  dom.amplifierValue.disabled = state.amplifierMode === "none";
  // Where a profile offers only towed arrays (APP-6D sea surface) name them as such.
  const mobilityName = mobilityNameFor(offers);
  dom.amplifierMode.querySelector('[data-mode="mobility"]').textContent = mobilityName;
  dom.amplifierLabel.textContent =
    state.amplifierMode === "mobility" ? mobilityName : "Echelon";
  dom.amplifierValue.innerHTML = source
    .map((item) => rejected.has(item[0])
      ? `<option value="${escapeHtml(item[0])}" title="${escapeHtml(rejected.get(item[0]))}">${escapeHtml(item[1])} (not valid here)</option>`
      : option(item[0], item[1]))
    .join("");
  const exists = source.some((item) => item[0] === state.amplifierValue);
  if (!exists && state.amplifierValue.startsWith("code:"))
    dom.amplifierValue.innerHTML += option(state.amplifierValue, `SIDC: ${state.amplifierValue.slice(5)}`);
  else if (!exists) state.amplifierValue = "";
  dom.amplifierValue.value = state.amplifierValue;
  [...dom.amplifierMode.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.mode === state.amplifierMode
    );
    button.setAttribute("aria-pressed", String(button.dataset.mode === state.amplifierMode));
  });
}

function populateModifierSelect(select, field, selected) {
  const icon = selectedIcon();
  const setModifiers = dataset().modifiers?.[icon?.symbolSet]?.[field] || [];
  const commonModifiers = dataset().common?.[field] || [];
  const entries = [
    ...setModifiers.map((item) => ({ ...item, scope: "set" })),
    ...commonModifiers.map((item) => ({ ...item, scope: "common" }))
  ];
  select.innerHTML = option("", "Unspecified");
  const groups = new Map();
  for (const item of entries) {
    const groupName = `${item.scope === "common" ? "Common" : icon.category} / ${item.category || "Other"}`;
    if (!groups.has(groupName)) groups.set(groupName, []);
    groups.get(groupName).push(item);
  }
  for (const [label, items] of groups) {
    const group = document.createElement("optgroup");
    group.label = label;
    for (const item of items) {
      const itemOption = document.createElement("option");
      itemOption.value = `${item.scope}:${item.code}`;
      itemOption.textContent = `${item.code} — ${item.name}`;
      group.append(itemOption);
    }
    select.append(group);
  }
  if (selected && ![...select.options].some(item => item.value === selected))
    select.insertAdjacentHTML("beforeend", option(selected, `SIDC: ${selected}`));
  select.value = selected;
  return select.value;
}

function syncModifiers() {
  const modern = config().family === "modern";
  const app6a = state.standardId === "app6a";
  const prescribedAffiliation = app6a && selectedIcon()?.prescribedAffiliation;
  dom.affiliation.disabled = Boolean(prescribedAffiliation);
  dom.affiliation.value = prescribedAffiliation ? app6aIdentities.find(a => a.legacy === prescribedAffiliation).value : state.affiliation;
  const kind = app6a ? app6aSymbolClass(state.customSidc || buildSidc()) : "";
  const installation =
    !modern && selectedIcon()?.defaultModifier?.startsWith("H");
  const tactical =
    state.standardId === "app6a" && selectedIcon()?.codingScheme === "G";
  dom.hq.disabled = Boolean(installation || tactical || (app6a && state.amplifierMode === "mobility"));
  dom.taskForce.disabled = Boolean(installation || (app6a && kind !== "unit"));
  dom.feintDummy.disabled = tactical;
  dom.amplifierValue.disabled =
    installation || tactical || state.amplifierMode === "none";
  for (const button of dom.amplifierMode.querySelectorAll("button"))
    button.disabled = Boolean(installation || tactical || (app6a && button.dataset.mode === "echelon" && kind !== "unit") || (app6a && button.dataset.mode === "mobility" && kind !== "equipment"));
  if (app6a && ((state.amplifierMode === "echelon" && kind !== "unit") || (state.amplifierMode === "mobility" && kind !== "equipment"))) {
    state.amplifierMode = "none"; state.amplifierValue = ""; populateAmplifier();
  }
  // Editions with a profile (2525C, APP-6D) say which flags and amplifier
  // modes the symbol may carry; every disabled control keeps the profile's reason.
  const offers = app6a ? null : profileOffers(state.customSidc || buildSidc());
  const flagReasons = {};
  for (const control of [dom.feintDummy, dom.hq, dom.taskForce]) control.parentElement.title = "";
  if (offers && offers.flags) {
    for (const [key, offer] of Object.entries(offers.flags)) {
      const control = { feintDummy: dom.feintDummy, hq: dom.hq, taskForce: dom.taskForce }[key];
      if (offer.offered) continue;
      control.disabled = true;
      control.parentElement.title = offer.reason;
      flagReasons[key] = offer.reason;
    }
    const hasOffer = (list) => list.some((item) => item[0] !== "" && offers.amplifier.get(item[0])?.offered);
    for (const button of dom.amplifierMode.querySelectorAll("button")) {
      const list = { echelon: echelons, mobility: mobilities }[button.dataset.mode];
      if (list && !hasOffer(list)) button.disabled = true;
    }
  }
  if (offers) populateAmplifier();
  syncRuleNotes({ modern, app6a, kind, installation, tactical, prescribed: Boolean(prescribedAffiliation), flagReasons });
  syncApp6aTextFields();
  document.getElementById("legacyNote").textContent = installation
    ? "Installation modifier H is applied automatically. Feint / dummy changes it to HB; unit echelon and headquarters flags do not apply."
    : tactical
      ? "Tactical point: unit echelon, mobility and headquarters flags do not apply. Choose the graphic variant from the library."
      : "In this edition, icon variants are selected directly from the symbol library.";
  dom.symbolModifiers.hidden = !modern;
  document.getElementById("legacyNote").hidden = modern;
  if (!modern) {
    state.modifier1 = "";
    state.modifier2 = "";
    return;
  }
  if (state.standardId === "app6d") {
    // APP-6D lists only the sector codes its Annex A tables define.
    const first = populateSectorSelect(dom.modifier1, 1, state.modifier1);
    const second = populateSectorSelect(dom.modifier2, 2, state.modifier2);
    state.modifier1 = first.value;
    state.modifier2 = second.value;
    const blocked = [...first.choices.entries, ...second.choices.entries].filter((entry) => !entry.offered);
    dom.modifierNote.textContent = [
      first.choices.dictionary || second.choices.dictionary
        ? `Sector modifiers follow APP-6D ${[first.choices, second.choices].filter((item) => item.dictionary).map((item) => item.table).join(" and ")}. Only defined codes are listed.`
        : "APP-6D defines no sector modifiers for this symbol set.",
      blocked.length ? `${blocked.length} listed codes are disabled for this entity, for example: ${humanize(shortReason(blocked[0].reason))}.` : ""
    ].filter(Boolean).join(" ");
    return;
  }
  dom.modifier1.previousElementSibling.textContent = "Icon modifier 1";
  dom.modifier2.previousElementSibling.textContent = "Icon modifier 2";
  dom.modifier1.disabled = dom.modifier2.disabled = false;
  state.modifier1 = populateModifierSelect(
    dom.modifier1,
    "modifier1",
    state.modifier1
  );
  state.modifier2 = populateModifierSelect(
    dom.modifier2,
    "modifier2",
    state.modifier2
  );
  const setName = selectedIcon()?.category || "symbol set";
  dom.modifierNote.textContent = `${setName} and common modifiers for this edition.`;
}

const sectorPlaces = { top: "above the symbol", bottom: "below the symbol", left: "left of the symbol", right: "right of the symbol" };

// Sector 1 / sector 2 select from the APP-6D dictionary for this symbol set.
// A code the entity may not use is listed but disabled; a current code the
// dictionary does not define (imported) stays, flagged.
function populateSectorSelect(select, sector, selected) {
  const sidc = state.customSidc || buildSidc();
  const current = selected.startsWith("set:") ? selected.slice(4) : "";
  const choices = sectorChoices({ profile: app6dProfile, sectors: app6dSectors, sidc, set: sidc.slice(4, 6), sector, start: sector === 1 ? 16 : 18, current });
  select.previousElementSibling.textContent = `Sector ${sector} modifier (${sectorPlaces[choices.placement]})`;
  select.innerHTML =
    option("", choices.dictionary ? "Unspecified" : "None defined for this symbol set") +
    choices.entries
      .map((entry) => `<option value="set:${entry.code}"${entry.offered ? "" : ` disabled title="${escapeHtml(entry.reason)}"`}>${entry.code} — ${escapeHtml(entry.name)}${entry.offered ? "" : " (not for this entity)"}</option>`)
      .join("");
  if (selected && ![...select.options].some((item) => item.value === selected)) {
    const label = sectorStatusLabels[choices.status];
    select.insertAdjacentHTML("beforeend", option(selected, `SIDC: ${current || selected}${label ? ` — ${label}` : ""}`));
  }
  select.disabled = !choices.dictionary && !current;
  select.value = selected;
  return { value: select.value, choices };
}

const kindLabels = { unit: "Unit", equipment: "Equipment", installation: "Installation", point: "Tactical point", nuclear: "Nuclear point" };

// Explain every rule that disables a control, next to the control.
function syncRuleNotes({ modern, app6a, kind, installation, tactical, prescribed, flagReasons = {} }) {
  const profile = activeProfile();
  const contextNote = {
    1: `Exercise: an X is drawn beside the frame; suspect and hostile become Joker (J) and Faker (K).${modern ? "" : " Position 2 uses the exercise letters G, W, M, D, L, J and K."}`,
    2: "Simulation: an S is drawn beside the frame."
  }[app6a ? "0" : state.context];
  // APP-6D marks Exercise and Simulation as US-only; the note comes from its table.
  const usOnly = state.standardId === "app6d" && app6dContexts.find((item) => item.digit === state.context && item.note);
  const identityNote = prescribed
    ? "This symbol prescribes its identity, so the identity is fixed."
    : [contextNote, usOnly && `${usOnly.name} is ${shortReason(usOnly.note).replace(/^US use only/, "for US use only")}.`].filter(Boolean).join(" ");
  dom.identityNote.hidden = !identityNote;
  dom.identityNote.textContent = identityNote;
  for (const [key, element] of [["identity", dom.identityAdjust], ["status", dom.statusAdjust], ["amplifier", dom.amplifierAdjust]]) {
    element.hidden = !state.adjustments[key];
    element.textContent = state.adjustments[key] || "";
  }
  // The "?" placement choice applies only where the profile's identity table has one.
  const marked = app6a && app6aRules.app6aIdentities[(state.customSidc || buildSidc())[1]];
  dom.uncertaintyField.hidden = dom.uncertaintyNote.hidden = !(marked && marked.marker === "?");
  if (marked) {
    const table = marked.placement === "frame" ? "inside the frame" : "in field E";
    dom.uncertaintyNote.textContent = `${marked.name}: the publication default puts the ? ${table}. APP-6A 503.1a allows field E or the frame. A symbol without a frame always uses field E.`;
  }
  dom.statusMeta.textContent = modern ? "Position 7" : "Position 4";
  dom.statusNote.textContent = app6a
    ? "APP-6A defines Present and Planned. Fully capable, damaged, destroyed and full to capacity appear in the other editions."
    : profile
      ? `Only the statuses ${profileTitles[state.standardId]} allows for this symbol are listed.`
      : "";
  dom.designationMeta.textContent = modern ? "Position 8" : "Position 11";
  const reasons = [];
  if (installation) reasons.push("Installations carry the installation modifier, so headquarters and task force do not apply.");
  else if (tactical) reasons.push("Tactical points take no headquarters or feint flag.");
  else {
    if (app6a && state.amplifierMode === "mobility") reasons.push("Mobility uses positions 11–12, so headquarters is off.");
    if (app6a && kind !== "unit") reasons.push("Task force applies to units only.");
  }
  const flagNames = { hq: "Headquarters", taskForce: "Task force", feintDummy: "Feint / dummy" };
  for (const [key, reason] of Object.entries(flagReasons)) reasons.push(`${flagNames[key]}: ${humanize(shortReason(reason))}.`);
  dom.designationNote.textContent = reasons.join(" ") || (modern
    ? "Writes one combined code to position 8 of the SIDC."
    : "Writes one combined code to position 11, for example A for headquarters or E for task force.");
  dom.amplifierMeta.textContent = modern ? "Positions 9–10" : "Positions 11–12";
  dom.amplifierNote.textContent = installation || tactical
    ? "This symbol takes no echelon or mobility amplifier."
    : app6a && kind === "unit"
      ? "Units take an echelon above the frame. Mobility is for equipment."
      : app6a && kind === "equipment"
        ? "Equipment takes a mobility amplifier below the frame. Echelon is for units."
        : `Echelon is drawn above the frame; mobility below it.${profile && !app6a ? ` Only the values ${profileTitles[state.standardId]} allows for this symbol are listed.` : ""}`;
  dom.countryMeta.textContent = countrySidcField(state.standardId)?.description || "";
  dom.editionMeta.textContent = modern
    ? (config().version === "13" ? "Edition E" : "Edition D")
    : "APP-6D / E · MIL-STD-2525D / E";
  dom.modifierNote.hidden = !modern;
  dom.symbolClass.hidden = false;
  dom.symbolClass.textContent = app6a ? kindLabels[kind] || "Symbol" : selectedIcon()?.category || "Symbol";
  dom.hqStaffLength.disabled = !dom.hq.checked || dom.hq.disabled;
  dom.hqStaffNote.textContent = dom.hqStaffLength.disabled
    ? "Turn on Headquarters in the Symbol tab to use it."
    : "Length of the headquarters staff. 0 uses the default length.";
}

const reliabilityCodes = ["A", "B", "C", "D", "E", "F"];
const credibilityCodes = ["1", "2", "3", "4", "5", "6"];

function fieldTools(field) {
  if (field.key === "dtg")
    return `<div class="field-tools"><button type="button" data-dtg-now="${field.id}">Now (UTC)</button></div>`;
  if (field.key === "evaluationRating")
    return `<div class="field-tools"><select data-rating-part="reliability" aria-label="Source reliability">${option("", "Reliability")}${reliabilityCodes.map((code) => option(code, code)).join("")}</select><select data-rating-part="credibility" aria-label="Information credibility">${option("", "Credibility")}${credibilityCodes.map((code) => option(code, code)).join("")}</select></div>`;
  return "";
}

function fieldReferenceHtml(key) {
  const reference = fieldReference[key];
  if (!reference) return "";
  return `<details><summary>${escapeHtml(reference.title)}</summary><dl class="reference-table">${reference.rows
    .map(([code, meaning]) => `<dt>${escapeHtml(code)}</dt><dd>${escapeHtml(meaning)}</dd>`)
    .join("")}</dl><p>${escapeHtml(reference.note)}</p></details>`;
}

function createTextFields() {
  const container = document.getElementById("app6aTextFields");
  // All editions share one form; applicable APP-6A fields are filtered below.
  container.innerHTML = modifierGroups.map((group, index) => `<section class="modifier-group" data-group="${index}">
    <div class="group-head"><h4>${escapeHtml(group.label)}</h4><span data-group-summary></span></div>
    <div class="field-grid">
    ${group.fields.map(field => `<div class="text-field" data-field-wrapper="${field.key}">
      <label><span class="field-label"><span><span class="field-code" data-field-code>${escapeHtml(field.field || "–")}</span><span class="field-name" data-field-label id="label-${field.id}">${escapeHtml(field.label)}</span></span><span class="field-count" data-field-count></span></span>
      ${field.choices
        ? `<select id="${field.id}" data-modifier-field="${field.key}" aria-labelledby="label-${field.id}" aria-describedby="help-${field.id}">${field.choices.map(([value, label]) => option(value, label)).join("")}</select>`
        : `<input id="${field.id}" data-modifier-field="${field.key}" aria-labelledby="label-${field.id}" aria-describedby="help-${field.id}" placeholder="${escapeHtml(field.placeholder)}" />`}</label>
      ${field.key === "engagementBar" ? engagementBuilderHtml() : ""}${fieldTools(field)}
      <div class="field-warn" data-field-warn role="status" hidden></div>
      <div class="field-help"><span class="modifier-description" id="help-${field.id}">${escapeHtml(field.description)}</span>${fieldReferenceHtml(field.key)}</div>
    </div>`).join("")}
    </div><div class="unavailable-list" data-unavailable></div></section>`).join("");
  container.addEventListener("input", (event) => {
    if (event.target.matches("[data-rating-part], [data-ao-part]")) return;
    recordTextOrigin(event.target);
    renderAll();
  });
  container.addEventListener("change", (event) => {
    if (event.target.matches("[data-ao-part]")) return composeEngagementInput(event.target);
    if (!event.target.matches("[data-rating-part]")) return;
    const tools = event.target.closest(".text-field");
    const value = evaluationRating(
      tools.querySelector('[data-rating-part="reliability"]').value,
      tools.querySelector('[data-rating-part="credibility"]').value
    );
    if (!value) return;
    const input = tools.querySelector("[data-modifier-field]");
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-dtg-now]");
    if (!button) return;
    const input = document.getElementById(button.dataset.dtgNow);
    input.value = formatDtg(new Date()).slice(0, input.maxLength > 0 ? input.maxLength : undefined);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  });
  container.addEventListener("focusin", (event) => {
    const wrapper = event.target.closest("[data-field-wrapper]");
    if (wrapper) setFocusField(wrapper.dataset.fieldWrapper);
  });
  dom.carryNotes.addEventListener("click", (event) => {
    const button = event.target.closest("[data-clear-field]");
    const field = button && textModifiers.find((item) => item.key === button.dataset.clearField);
    if (!field) return;
    const input = document.getElementById(field.id);
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

// Remember what a text field meant where the user typed it, so a later change
// of edition or symbol can warn when the same text is read differently.
function recordTextOrigin(input) {
  const key = input.dataset.modifierField;
  if (!key) return;
  delete state.droppedChoices[key];
  const definition = input.value && currentFieldStates().find((item) => item.key === key);
  if (definition && definition.available) state.textOrigins[key] = { meaning: fieldMeaning(definition), where: describeWhere() };
  else delete state.textOrigins[key];
}

function describeWhere(sidc = state.customSidc || buildSidc()) {
  const profile = activeProfile();
  const kind = profile && classWords(profile.symbolClass(sidc));
  return kind ? `${config().label} ${kind}` : config().label;
}

// AO "A:BBB-CC" (APP-6D): three dropdowns compose the text that is sent.
const engagementSourceNames = { R: "remote", B: "local and remote" };
function engagementBuilderHtml() {
  const part = (name, caption) => `<label class="ao-part"><span>${caption}</span><select data-ao-part="${name}" aria-label="Engagement bar ${caption}"></select></label>`;
  return `<div class="ao-builder" data-ao-builder hidden>${part("a", "A source")}${part("b", "BBB stage")}${part("c", "CC weapon or count")}<p class="ao-preview" data-ao-preview></p></div>`;
}

function composeEngagementInput(select) {
  const wrapper = select.closest("[data-field-wrapper]");
  const value = (name) => wrapper.querySelector(`[data-ao-part="${name}"]`).value;
  const parts = { a: value("a"), b: value("b"), c: value("c") };
  // The list behind CC changes with the stage (weapons, or counts for MLT).
  if (select.dataset.aoPart === "b" && (parts.b === "MLT") !== (parseEngagement(wrapper.querySelector("[data-modifier-field]").value).b === "MLT")) parts.c = "";
  const input = wrapper.querySelector("[data-modifier-field]");
  input.value = composeEngagement(parts);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function syncEngagementBuilder(wrapper, definition, input) {
  const builder = wrapper.querySelector("[data-ao-builder]");
  if (!builder) return;
  const composite = Boolean(definition && definition.parts);
  builder.hidden = !composite;
  input.hidden = composite;
  if (!composite) return;
  const options = engagementOptions(definition.parts, app6dEngagementError);
  const parts = parseEngagement(input.value);
  const fill = (name, list, value, blank, label) => {
    const select = builder.querySelector(`[data-ao-part="${name}"]`);
    select.innerHTML =
      option("", blank) +
      list.map(([code, text]) => option(code, label(code, text))).join("") +
      (value && !list.some(([code]) => code === value) ? option(value, `${value} (not defined)`) : "");
    select.value = value;
    select.disabled = name !== "b" && !parts.b;
  };
  fill("a", options.sources, parts.a, "(local)", (code) => `${code} — ${engagementSourceNames[code] || code}`);
  fill("b", options.stages, parts.b, "(none)", (code, text) => `${code} — ${text}`);
  fill("c", parts.b === "MLT" ? options.counts : options.weapons, parts.c, "(none)", (code, text) => `${code} — ${text}`);
  const message = parts.b || input.value ? app6dEngagementError(input.value) : "";
  const preview = builder.querySelector("[data-ao-preview]");
  preview.textContent = input.value ? `${input.value}${message ? ` — ${message}` : ""}` : `Format ${definition.format}: choose the stage (BBB) first.`;
  preview.classList.toggle("problem", Boolean(message));
}

function setFocusField(key) {
  if (state.focusField === key) return;
  state.focusField = key;
  for (const wrapper of document.querySelectorAll("[data-field-wrapper]"))
    wrapper.classList.toggle("focused", wrapper.dataset.fieldWrapper === key);
  if (state.positions) renderAll();
}

function currentFieldStates(sidc = state.customSidc || buildSidc()) {
  const profile = activeProfile();
  if (profile) return profileFieldStates(textModifiers, profile, sidc);
  return fieldStates(textModifiers, state.standardId === "app6a"
    ? { available: getApp6aFields(sidc), table: app6aTextFields, kind: app6aSymbolClass(sidc), identity: sidc[1] }
    : null);
}

// Keys the edition allows for this SIDC; null when every field applies.
function profiledFieldKeys(sidc) {
  const profile = activeProfile();
  if (profile && !profile.fields(sidc)) return null;
  if (!profile && state.standardId !== "app6a") return null;
  return currentFieldStates(sidc).filter((item) => item.available).map((item) => item.key);
}

// Offer a profile's literal values: rebuild a select, or suggest via a datalist.
function applyFieldChoices(field, input, profileChoices, alternates) {
  // Profiles may list plain literals; the form uses [value, label] pairs.
  const choices = profileChoices && profileChoices.map((choice) => (Array.isArray(choice) ? choice : [String(choice), String(choice)]));
  if (field.choices) {
    let list = choices ? [["", field.choices[0][1]], ...choices.filter(([code]) => code !== "")] : field.choices;
    // A form the profile accepts besides its own list (APP-6D F "(+)") stays selectable.
    const dropped = state.droppedChoices[field.key];
    const wanted = input.value || dropped || "";
    if (wanted && !list.some(([code]) => code === wanted) && (alternates || []).includes(wanted)) list = [...list, [wanted, `${wanted} (alternate form)`]];
    const signature = JSON.stringify(list);
    if (input.dataset.choices === signature) return;
    input.innerHTML = list.map(([code, label]) => option(code, label)).join("");
    input.dataset.choices = signature;
    // A value this edition does not define is not reinterpreted: it is cleared,
    // reported next to the form, and comes back when a list defines it again.
    if (wanted && list.some(([code]) => code === wanted)) {
      input.value = wanted;
      delete state.droppedChoices[field.key];
    } else {
      input.value = "";
      if (wanted) state.droppedChoices[field.key] = wanted;
    }
    return;
  }
  const id = `choices-${field.id}`;
  let datalist = document.getElementById(id);
  if (!choices) {
    input.removeAttribute("list");
    return;
  }
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = id;
    input.after(datalist);
  }
  datalist.innerHTML = choices.map(([code, label]) => option(code, label)).join("");
  input.setAttribute("list", id);
}

function syncApp6aTextFields() {
  const sidc = state.customSidc || buildSidc();
  const profile = activeProfile();
  const active = profile ? Boolean(profile.fields(sidc)) : state.standardId === "app6a";
  const fieldNote = document.getElementById("app6aFieldNote");
  fieldNote.hidden = !active;
  fieldNote.textContent = profileNotes[state.standardId] || "";
  const container = document.getElementById("app6aTextFields");
  const states = new Map(currentFieldStates(sidc).map((item) => [item.key, item]));
  const extras = profile ? profileExtraFields(profile, sidc, textModifiers.map((field) => field.key)) : [];
  const values = Object.fromEntries(textModifiers.map(({ key, id }) => [key, document.getElementById(id).value]));
  for (const key of Object.keys(state.textOrigins)) if (!values[key]) delete state.textOrigins[key];
  const carried = new Map(carryWarnings({ states: [...states.values()], values, origins: state.textOrigins, extras }).map((item) => [item.key, item]));
  for (const field of textModifiers) {
    const input = document.getElementById(field.id);
    const definition = states.get(field.key);
    const wrapper = input.closest("[data-field-wrapper]");
    wrapper.hidden = !definition.available;
    input.disabled = !definition.available;
    const warning = wrapper.querySelector("[data-field-warn]");
    const lines = [];
    if (definition.available) {
      wrapper.querySelector("[data-field-label]").textContent = definition.label;
      wrapper.querySelector("[data-field-code]").textContent = definition.field || "–";
      applyFieldChoices(field, input, definition.choices || definition.examples || null, definition.alternates);
      syncEngagementBuilder(wrapper, definition, input);
      if (!field.choices) {
        if (definition.maxLength) input.maxLength = definition.maxLength;
        else input.removeAttribute("maxlength");
        input.placeholder = active && definition.maxLength ? `Max. ${definition.maxLength} characters · ${definition.field}` : field.placeholder;
      }
      // Rules the profile attaches to the field: format, length, source tensions.
      const rule = fieldRule(definition, input.value);
      const help = [field.description];
      if (rule.hint) help.push(`Format: ${rule.hint}.`);
      if (definition.requiresEchelonDivisionOrBelow) help.push("Used at division level and below.");
      if (definition.unresolved) help.push(`${definition.nonBlocking ? "Source note" : "Unresolved in the source"}: ${definition.unresolved}.`);
      wrapper.querySelector(".modifier-description").textContent = help.join(" ");
      if (rule.problem) lines.push(`${definition.field} ${rule.problem}.`);
      if (definition.unresolved && !definition.nonBlocking && input.value) lines.push("Unresolved in the source: the symbol is reported as not valid while this field is filled.");
      if (carried.has(field.key)) lines.push(carried.get(field.key).message);
    }
    warning.hidden = !lines.length;
    warning.innerHTML = lines.map(escapeHtml).join("<br>");
  }
  renderCarryNotes([...carried.values()], extras, states);
  let available = 0;
  for (const group of container.querySelectorAll(".modifier-group")) {
    const fields = modifierGroups[Number(group.dataset.group)].fields;
    const groupStates = fields.map((field) => states.get(field.key));
    const open = groupStates.filter((item) => item.available);
    available += open.length;
    group.classList.toggle("none-available", !open.length);
    group.querySelector(".field-grid").hidden = !open.length;
    group.querySelector("[data-group-summary]").textContent = active
      ? `${open.length} of ${fields.length} apply`
      : `${fields.length} fields`;
    group.querySelector("[data-unavailable]").innerHTML = groupStates
      .filter((item) => !item.available)
      .map((item) => `<div class="unavailable-row" title="${escapeHtml(fields.find((field) => field.key === item.key).description)}"><span><span class="field-code">${escapeHtml(item.field || "–")}</span><span>${escapeHtml(item.label)}</span></span><small title="${escapeHtml(item.reason)}">${escapeHtml(humanize(shortReason(item.reason)))}</small></div>`)
      .join("");
  }
  const unavailable = textModifiers.length - available;
  container.classList.toggle("hide-unavailable", !state.showUnavailable);
  dom.toggleUnavailable.hidden = !unavailable;
  dom.toggleUnavailable.textContent = state.showUnavailable ? `Hide ${unavailable} unavailable` : `Show ${unavailable} unavailable`;
  dom.toggleUnavailable.setAttribute("aria-pressed", String(!state.showUnavailable));
  dom.toggleUnavailable.classList.toggle("active", !state.showUnavailable);
  const kind = !active ? "" : profile ? profile.symbolClass(sidc) : app6aSymbolClass(sidc);
  const filled = textModifiers.filter((field) => {
    const input = document.getElementById(field.id);
    return !input.disabled && input.value;
  }).length;
  for (const field of textModifiers) {
    const input = document.getElementById(field.id);
    const counter = input.closest("[data-field-wrapper]").querySelector("[data-field-count]");
    if (field.choices) counter.textContent = "";
    else {
      const max = input.maxLength > 0 ? input.maxLength : 0;
      counter.textContent = max ? `${input.value.length} / ${max}` : input.value ? String(input.value.length) : "";
      counter.classList.toggle("full", Boolean(max) && input.value.length >= max);
    }
  }
  dom.textSummary.textContent = active
    ? `${profileTitles[state.standardId]} · ${available} of ${textModifiers.length} fields apply to ${({ unit: "units", equipment: "equipment", installation: "installations", point: "tactical points", nuclear: "nuclear points" })[kind] || (kind ? `${classWords(kind)} symbols` : "this symbol")} · ${filled} filled`
    : `${textModifiers.length} text amplifiers · ${filled} filled · placement follows the renderer's symbol-set rules`;
  dom.textFilledBadge.hidden = !filled;
  dom.textFilledBadge.textContent = `${filled} filled`;
  dom.direction.disabled = state.standardId === "app6a" && app6aSymbolClass(sidc) === "point";
  dom.speedLeader.disabled = dom.direction.disabled;
  dom.directionNumber.disabled = dom.direction.disabled;
  dom.stack.disabled = state.standardId === "app6a";
}

// Non-blocking list above the text fields: text that is kept but not drawn,
// text now read under a different meaning, and select values cleared because
// the edition does not define them. Nothing here changes what the user typed.
function renderCarryNotes(warnings, extras, states) {
  const rows = warnings.map((item) => ({ ...item, clearable: true }));
  for (const [key, value] of Object.entries(state.droppedChoices)) {
    const definition = states.get(key);
    if (definition) rows.push({ key, field: definition.field, label: definition.label, value, kind: "dropped", message: `"${value}" is not a defined value in ${config().label}, so the choice is cleared. It returns if a symbol or edition defines it again.` });
  }
  dom.carryNotes.hidden = !rows.length;
  dom.carryNotes.innerHTML = rows.length
    ? `<h4>Check these entries (${rows.length})</h4>` +
      rows.map((item) => `<div class="carry-row" data-kind="${item.kind}"><span class="field-code">${escapeHtml(item.field || "–")}</span><div><b>${escapeHtml(item.label)}</b>${item.kind === "dropped" ? "" : ` <q>${escapeHtml(item.value)}</q>`}<span>${escapeHtml(item.message)}</span></div>${item.clearable ? `<button type="button" class="quiet-button" data-clear-field="${escapeHtml(item.key)}">Clear</button>` : ""}</div>`).join("")
    : "";
  dom.profileExtras.hidden = !extras.length;
  dom.profileExtras.innerHTML = extras.length
    ? `<h4>Defined for this symbol, not editable here</h4>` +
      extras.map((item) => `<div class="unavailable-row"><span><span class="field-code">${escapeHtml(item.field || "–")}</span><span>${escapeHtml(item.label)}</span></span><small>${escapeHtml(humanize(item.reason))}</small></div>`).join("")
    : "";
}

function selectImportedValue(select, value) {
  if (![...select.options].some(item => item.value === value))
    select.insertAdjacentHTML("beforeend", option(value, `SIDC: ${value.replace(/^code:/, "")}`));
  select.value = value;
}

function applyImportedSidc(value) {
  const edition = config().family === "modern" && numericSidcEdition(value);
  if (edition && edition !== (config().version === "13" ? "e" : "d"))
    setStandard(`${state.standardId.startsWith("app6") ? "app6" : "2525"}${edition}`);
  state.adjustments = {};
  const parsed = decodeEditorSidc(value, { ...config(), icons: dataset().icons });
  const modern = config().family === "modern";
  const encoding = modern ? "numeric" : "legacy";
  const identity = decodeIdentity(parsed.identity, config(), parsed.context);
  const source = parsed.mobility ? mobilities : echelons;
  const amplifier = parsed.mobility || parsed.echelon;
  const amplifierValue = source.find(item => item[modern ? 2 : 3] === amplifier)?.[0];
  Object.assign(state, {
    customSidc: value,
    importedIcon: parsed.icon,
    selectedId: parsed.icon.id,
    affiliation: identity?.value || `code:${parsed.identity}`,
    status: statuses.find(item => item[encoding] === parsed.status)?.value || `code:${parsed.status}`,
    context: identity?.context || parsed.context,
    amplifierMode: parsed.mobility ? "mobility" : ["-", "00"].includes(amplifier) ? "none" : "echelon",
    amplifierValue: amplifierValue ?? `code:${amplifier}`,
    modifier1: parsed.modifier1,
    modifier2: parsed.modifier2
  });
  for (const key of ["hq", "taskForce", "feintDummy"]) dom[key].checked = parsed[key];
  selectImportedValue(dom.frameShape, parsed.frameShape);
  syncStandardControls();
}

// Exercise relabels suspect and hostile as Joker and Faker.
function populateIdentityOptions() {
  dom.affiliation.innerHTML = identityList(config())
    .map((item) => option(item.value, identityLabelFor(item)))
    .join("");
  selectImportedValue(dom.affiliation, state.affiliation);
}

function syncStandardControls() {
  const contexts = contextOptions(config());
  dom.contextField.hidden = !contexts.length;
  dom.frameShapeField.hidden = config().version !== "13";
  // Validate after removing publication whitespace, not while pasting it.
  dom.sidcInput.removeAttribute("maxlength");
  populateIdentityOptions();
  dom.status.innerHTML = statusChoices()
    .map((item) => option(item.value, statusLabelFor(item)))
    .join("");
  selectImportedValue(dom.status, state.status);
  dom.context.innerHTML = contexts.map((item) => option(item[0], contextLabelFor(item))).join("");
  if (contexts.length) selectImportedValue(dom.context, state.context);
  populateAmplifier();
  syncModifiers();
}

const schemeNames = { S: "Warfighting", G: "Tactical graphic", W: "Weather", I: "Intelligence", O: "Stability operations", E: "Emergency management" };
const dimensionNames = { P: "Space", A: "Air", G: "Ground", S: "Sea surface", U: "Subsurface", F: "Special operations", X: "Other", Z: "Unknown" };
const contextNames = { 0: "Reality", 1: "Exercise", 2: "Simulation" };
const legacyFlagNames = { "-": "", F: "Feint / dummy", A: "Headquarters", C: "HQ · feint", E: "Task force", G: "Task force · feint", B: "Task force HQ", D: "Task force HQ · feint" };
let flagNames = new Map();

function describePart(key, value, sidc) {
  const modern = /^\d/.test(sidc);
  const icon = selectedIcon();
  const flagName = (code) => (code && flagNames.get(code)) || "";
  switch (key) {
    case "scheme": return schemeNames[value] || "";
    case "identity": {
      const identity = decodeIdentity(modern ? value[1] : value, config(), modern ? value[0] : "0");
      const entry = identity && identityList(config()).find((item) => item.value === identity.value);
      const label = entry ? identityLabelFor(entry, identity.context) : "";
      if (modern) return [contextNames[value[0]] || "Context " + value[0], label].filter(Boolean).join(" · ");
      return identity?.context === "1" ? `Exercise · ${label}` : label;
    }
    case "dimension": return dimensionNames[value] || "";
    case "status": return statuses.find((item) => item.legacy === value)?.label || "";
    case "function":
    case "entity": return icon?.name || "";
    case "set": return icon?.category || "";
    case "version": return /^1[012]/.test(value) ? "Edition D" : /^1[34]/.test(value) ? "Edition E" : "";
    case "modifiers": {
      if (modern) return value === "0000" ? "None" : "Icon modifiers";
      if (value[0] === "H") return value === "HB" ? "Installation · feint" : "Installation";
      const mobility = mobilities.find((item) => item[3] === value);
      if (mobility) return mobility[1];
      const echelon = echelons.find((item) => item[3] === value[1] && item[3] !== "-");
      return [legacyFlagNames[value[0]], echelon?.[1]].filter(Boolean).join(" · ") || "None";
    }
    case "amplifier": {
      const statusEntry = statuses.find((item) => item.numeric === value[0]);
      const status = statusEntry && statusLabelFor(statusEntry);
      const flags = ["", "Feint / dummy", "Headquarters", "HQ · feint", "Task force", "TF · feint", "Task force HQ", "TF HQ · feint"][Number(value[1])];
      const amplifier = [...echelons, ...mobilities].find((item) => item[2] === value.slice(2) && item[2] !== "00")?.[1];
      return [status, flags, amplifier].filter(Boolean).join(" · ");
    }
    case "country":
    case "originatorCountry": return flagName(countryFlagFromSidc(sidc, state.standardId)) || (/^[-0]+$/.test(value) ? "Not set" : "");
    case "frameShape": return [...dom.frameShape.options].find((item) => item.value === value)?.textContent || "";
    case "oob": return value === "-" ? "Not set" : "";
    default: return "";
  }
}

function updateSegments(sidc) {
  const dEdition = ["app6d", "2525d"].includes(state.standardId);
  dom.sidcSegments.innerHTML = sidcParts(sidc, dEdition)
    .map(({ key, label, value }) => {
      const meaning = describePart(key, value, sidc);
      return `<div title="${escapeHtml(meaning)}"><span>${escapeHtml(label)}</span><b>${escapeHtml(value || "—")}</b>${meaning ? `<small>${escapeHtml(meaning)}</small>` : ""}</div>`;
    })
    .join("");
}

const chipCache = new Map();

function chipSvg(sidc) {
  const key = `${state.standardId}|${sidc}|${dom.colorMode.value}|${dom.strokeWidth.value}`;
  if (!chipCache.has(key)) {
    let svg = "";
    try {
      svg = new window.ms.Symbol(sidc, { ...currentOptions(true), size: 18, infoFields: false }).asSVG();
    } catch {}
    if (chipCache.size > 400) chipCache.clear();
    chipCache.set(key, svg);
  }
  return chipCache.get(key);
}

// Chips are a visual front end for the identity and status selects, which
// stay the single source of truth for import and edit logic.
function renderChips(sidc) {
  const modern = config().family === "modern";
  let base = sidc;
  if (modern) base = base.padEnd(20, "0").slice(0, 7) + "000" + base.padEnd(20, "0").slice(10);
  else if (base[10] !== "H") base = base.padEnd(15, "-").slice(0, 10) + "--" + base.padEnd(15, "-").slice(12);
  const variant = (position, code) => base.slice(0, position) + code + base.slice(position + 1);
  // A chip the edition profile does not offer stays only while it is the
  // current value, flagged, so the problem line and the chip agree.
  const chip = (select, value, label, code, position, flag) =>
    `<button type="button" class="chip${flag ? " chip-invalid" : ""}" data-value="${escapeHtml(value)}" aria-pressed="${select.value === value}"${flag ? ` title="${escapeHtml(flag)}"` : ""}${select.disabled ? " disabled" : ""}><span class="chip-glyph">${code ? chipSvg(variant(position, code)) : ""}</span><span>${escapeHtml(label)}</span>${flag ? '<small class="chip-flag">not valid here</small>' : ""}</button>`;
  const standard = config();
  const identities = identityList(standard);
  const offers = profileOffers(sidc);
  // Returns "" to show the chip, null to hide it, or the reason to flag it.
  const offerFlag = (select, kind, value, importedReason) => {
    if (value.startsWith("code:")) return importedReason || "This code is not defined in this edition.";
    const offer = offers && offers[kind].get(value);
    if (!offer || offer.offered) return "";
    return select.value === value ? offer.reason || "Not valid for this symbol." : null;
  };
  // Re-rendering replaces the buttons; keep keyboard focus on the same chip.
  const focused = document.activeElement?.closest?.(".chip");
  const focusedGroup = focused && (dom.identityChips.contains(focused) ? dom.identityChips : dom.statusChips.contains(focused) ? dom.statusChips : null);
  const focusedValue = focusedGroup && focused.dataset.value;
  const importedIdentityReason = (value) =>
    state.standardId === "app6a" ? app6aRules.app6aIdentity(value.replace(/^code:/, ""), sidc[2]).reason : "";
  dom.identityChips.innerHTML = [...dom.affiliation.options].map((item) => {
    const entry = identities.find((candidate) => candidate.value === item.value);
    const flag = offerFlag(dom.affiliation, "identity", item.value, importedIdentityReason(item.value));
    if (flag === null) return "";
    const code = entry ? identityCode(entry, standard, state.context) : item.value.replace(/^code:/, "");
    return chip(dom.affiliation, item.value, entry ? identityLabelFor(entry) : item.textContent, code, modern ? 3 : 1, flag);
  }).join("");
  dom.statusChips.innerHTML = [...dom.status.options].map((item) => {
    const entry = statuses.find((candidate) => candidate.value === item.value);
    const flag = offerFlag(dom.status, "status", item.value);
    if (flag === null) return "";
    const code = entry ? entry[modern ? "numeric" : "legacy"] : item.value.replace(/^code:/, "");
    return chip(dom.status, item.value, entry ? statusLabelFor(entry) : item.textContent, code, modern ? 6 : 3, flag);
  }).join("");
  if (focusedGroup)
    [...focusedGroup.querySelectorAll(".chip")].find((item) => item.dataset.value === focusedValue)?.focus({ preventScroll: true });
}

// Name the SIDC position when an imported code is outside this edition.
function renderProblem() {
  if (!currentSymbol) return "This code cannot be rendered.";
  if (currentSymbol.isValid()) return "";
  const modern = config().family === "modern";
  const detail = currentSymbol.isValid(true);
  const sidc = state.customSidc || buildSidc();
  // selectImportedValue() adds "SIDC: …" options for values this edition does not offer.
  const imported = (select, start, end, what) =>
    select.selectedOptions[0]?.textContent.startsWith("SIDC: ")
      ? `Position ${end - start > 1 ? `${start + 1}–${end}` : start + 1}: "${sidc.slice(start, end)}" is not ${what} in this edition.`
      : "";
  const reasons = [
    imported(dom.affiliation, modern ? 3 : 1, modern ? 4 : 2, "an identity"),
    imported(dom.status, modern ? 6 : 3, modern ? 7 : 4, "a status"),
    imported(dom.amplifierValue, modern ? 8 : 10, modern ? 10 : 12, "an echelon or mobility code"),
    ...(detail.sidcErrors || []),
    ...(detail.identityErrors || []),
    ...(detail.modifierErrors || []),
    detail.icon === false ? "Unknown function code for this standard." : "",
    detail.affiliation === "undefined" ? "Unknown identity." : "",
    detail.mobility === false ? "Unknown echelon or mobility code." : ""
  ].filter(Boolean);
  return `Check code / modifiers. ${reasons.join(" ") || "The renderer could not validate this code."}`;
}

function renderSidcStatus(sidc) {
  const message = state.sidcMessage;
  let kind = "idle";
  let text = "Valid code. It follows every change in the editor.";
  if (state.sidcDirty) {
    kind = message && ["error", "info"].includes(message.kind) ? message.kind : "pending";
    text = kind === "pending" ? "Not applied yet. Press Enter or Apply; Esc returns to the current code." : message.text;
  } else {
    const problem = renderProblem();
    if (message && message.sidc === sidc) ({ kind, text } = message);
    if (problem) {
      kind = "error";
      text = message && message.sidc === sidc ? `${text} ${problem}` : problem;
    }
  }
  dom.sidcStatus.dataset.kind = kind;
  dom.sidcStatus.textContent = text;
  dom.sidcInput.classList.toggle("dirty", state.sidcDirty && kind === "pending");
  dom.sidcInput.classList.toggle("error", state.sidcDirty && kind === "error");
  dom.applySidc.classList.toggle("ready", state.sidcDirty);
  const length = dom.sidcInput.value.replace(/\s/g, "").length;
  dom.sidcLength.textContent = `${length} characters`;
  dom.sidcInput.style.height = "auto";
  dom.sidcInput.style.height = `${dom.sidcInput.scrollHeight + 2}px`;
}

// What the edition profile reports besides errors: unresolved source conflicts
// and Version Extension Flags are shown outright; notes sit in a fold-out.
function renderProfileDetails() {
  const lines = currentSymbol ? profileDetailLines(currentSymbol.isValid(true)) : { notes: [], unresolved: [], versionExtension: [] };
  const issues = [...lines.unresolved.map((text) => `Unresolved source conflict. ${text}`), ...lines.versionExtension];
  dom.profileIssues.innerHTML = issues.map((text) => `<li>${escapeHtml(text)}</li>`).join("");
  dom.profileNotesBox.hidden = !lines.notes.length;
  dom.profileNotesSummary.textContent = `${lines.notes.length} note${lines.notes.length === 1 ? "" : "s"} from ${profileTitles[state.standardId] || "the edition profile"}`;
  dom.profileNotesList.innerHTML = lines.notes.map((text) => `<li>${escapeHtml(text)}</li>`).join("");
  dom.profileDetails.hidden = !issues.length && !lines.notes.length;
}

let positionCodes = {};

// One shared row holds several tags ("[AR] [W]", legacy "[X]/[Y]"), so each tag
// becomes its own tspan: every tag can be clicked and highlighted on its own.
function markFieldTags() {
  const svgNs = "http://www.w3.org/2000/svg";
  for (const text of dom.symbolPreview.querySelectorAll("text")) {
    const parts = text.textContent.split(/(\[[^\]]+\])/).filter(Boolean);
    if (!parts.some((part) => positionCodes[part])) continue;
    text.replaceChildren(...parts.map((part) => {
      const key = positionCodes[part];
      if (!key) return document.createTextNode(part);
      const tag = document.createElementNS(svgNs, "tspan");
      tag.textContent = part;
      tag.classList.add("field-tag");
      tag.classList.toggle("focused", key === state.focusField);
      tag.dataset.field = key;
      return tag;
    }));
  }
}

function syncGraphicsControls() {
  const value = Number(dom.direction.value);
  const on = value >= 0 && !dom.direction.disabled;
  dom.directionOutput.value = value < 0 ? "Off" : `${value}°`;
  if (document.activeElement !== dom.directionNumber) dom.directionNumber.value = value < 0 ? "" : String(value);
  for (const button of document.querySelectorAll("[data-direction]")) {
    button.classList.toggle("active", Number(button.dataset.direction) === value);
    button.disabled = dom.direction.disabled;
  }
  dom.directionNeedle.toggleAttribute("hidden", !on);
  dom.directionNeedle.setAttribute("transform", `rotate(${on ? value : 0} 60 60)`);
  dom.directionDial.classList.toggle("on", on);
  dom.directionDial.setAttribute("aria-label", on ? `Heading ${value} degrees` : "Direction off");
  dom.directionNote.textContent = dom.direction.disabled
    ? "Direction does not apply to APP-6A tactical points."
    : dom.hq.checked && !dom.hq.disabled
      ? "With a headquarters, the arrow starts at the end of the HQ staff."
      : "Ground symbols draw the arrow from a staff below the frame.";
  dom.graphicsBadge.hidden = !on;
  dom.graphicsBadge.textContent = on ? `Q ${value}°` : "";
  dom.sizeOutput.value = `${dom.symbolSize.value}%`;
  dom.strokeOutput.value = dom.strokeWidth.value;
  dom.fillOpacityOutput.value = `${dom.fillOpacity.value}%`;
  dom.infoSizeOutput.value = dom.infoSize.value;
  dom.outlineWidthOutput.value = dom.outlineWidth.value;
}

function renderFlagSwatch() {
  const artwork = flagArtwork.get(dom.countryFlag.value);
  dom.flagSwatch.innerHTML = artwork || "";
  dom.flagSwatch.classList.toggle("has-flag", Boolean(artwork));
}

function renderAll() {
  const icon = selectedIcon();
  if (!icon) return;
  state.selectedId = icon.id;
  reconcileSelections();
  if ([...dom.status.options].some((item) => item.value === state.status)) dom.status.value = state.status;
  syncModifiers();
  const sidc = state.customSidc || buildSidc(icon);
  const countryCode = countryCodeForFlag(dom.countryFlag.value, state.standardId);
  const countryField = countrySidcField(state.standardId);
  const countryEncoding = countryField?.description || "";
  document.getElementById("countryFlagNote").textContent = dom.countryFlag.value && !countryCode
    ? "Display-only flag: no country code is assigned for this standard. Included in SVG and PNG exports."
    : `${countryCode ? `${countryField.label} code: ${countryCode}. ` : "Select a country or apply a SIDC to select its flag. "}${countryEncoding}. Included in SVG and PNG exports.`;
  window.ms.setStandard(config().standard);
  try {
    currentSymbol = new window.ms.Symbol(sidc, currentOptions());
    currentSvg = currentSymbol.asSVG();
    let previewSvg = currentSvg;
    positionCodes = {};
    if (state.positions) {
      const values = Object.fromEntries(textModifiers.map(({ key, id }) => [key, document.getElementById(id)?.value || ""]));
      const tags = placeholderOptions(currentFieldStates(sidc), values);
      positionCodes = tags.codes;
      try {
        previewSvg = new window.ms.Symbol(sidc, { ...currentOptions(), infoFields: true, ...tags.options }).asSVG();
      } catch {}
    }
    dom.symbolPreview.innerHTML = previewSvg;
    if (state.positions) markFieldTags();
    document.getElementById("compactPreview").innerHTML = currentSvg;
    const valid = Boolean(currentSymbol.isValid());
    dom.renderState.classList.toggle("invalid", !valid);
    dom.renderState.innerHTML = `<i></i>${valid ? "Rendered" : "Check code / modifiers"}`;
    const detail = currentSymbol.isValid(true);
    dom.renderState.title = [...(detail.modifierErrors || []), ...(detail.notes || [])].join("; ");
  } catch (error) {
    currentSymbol = null;
    currentSvg = "";
    document.getElementById("compactPreview").replaceChildren();
    dom.symbolPreview.innerHTML = `<div class="empty-state">Unable to render symbol.<br>${escapeHtml(error.message)}</div>`;
    dom.renderState.classList.add("invalid");
    dom.renderState.innerHTML = "<i></i>Rendering error";
  }
  dom.selectedName.textContent = icon.name;
  dom.selectedPath.textContent = [...new Set([icon.category, ...(icon.path || [])].filter(Boolean))].join(" / ")
    + (state.customSidc ? " / Imported SIDC" : "");
  document.getElementById("supportNote").textContent = state.standardId === "app6e"
    ? "Compatibility view using the shared 2525E catalog. This is not a separate edition-specific catalog."
    : state.standardId === "app6a"
      ? `${icon.source || "APP-6A (1998)"}. ${dataset().icons.length} S-scheme catalog entries.${icon.categoryOnly ? " Category — no separate illustration in APP-6A Annex D; preview is the renderer’s representation." : ""}${icon.remarks ? " " + icon.remarks : ""}`
      : "Rendered with milsymbol. Symbol appearance may differ from older standard publications.";
  if (!state.sidcDirty) dom.sidcInput.value = sidc;
  for (const button of [dom.downloadSvg, dom.downloadPng, dom.copySvg, dom.copySidc]) button.disabled = !currentSvg;
  const auditLink = document.getElementById("publicationAudit");
  auditLink.hidden = document.documentElement.dataset.localAudit !== "true" || state.standardId !== "app6a" || !icon.id.startsWith("S");
  auditLink.href = `audit/symbols/index.html?symbol=${encodeURIComponent(icon.id)}`;
  updateSegments(sidc);
  renderSidcStatus(sidc);
  renderProfileDetails();
  renderChips(sidc);
  renderFlagSwatch();
  syncGraphicsControls();
  dom.previewHint.textContent = state.positions ? "Tags mark empty fields. Click one to edit it." : "Transparent background";
  document.title = `${icon.name} — Military Symbol Editor`;
}

function updateSidcAndRender(field, { rerenderCatalog = false } = {}) {
  if (state.customSidc)
    state.customSidc = editImportedSidc(state.customSidc, buildSidc(), field, config());
  renderAll();
  if (rerenderCatalog) renderCatalog();
}

function selectSymbol(id) {
  state.selectedId = id;
  state.adjustments = {};
  rememberRecent(id);
  state.modifier1 = "";
  state.modifier2 = "";
  state.customSidc = "";
  state.importedIcon = null;
  try {
    localStorage.setItem(`symbol-studio:${state.standardId}`, id);
  } catch {}
  renderCatalog();
  renderAll();
}

function download(content, filename, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text, success) {
  try {
    await navigator.clipboard.writeText(text);
    toast(success);
  } catch {
    const field = document.createElement("textarea");
    field.value = text;
    document.body.append(field);
    field.select();
    document.execCommand("copy");
    field.remove();
    toast(success);
  }
}

function exportName(extension) {
  const name = selectedIcon()?.name || "military-symbol";
  return `${
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "military-symbol"
  }.${extension}`;
}

function downloadPng() {
  if (!currentSvg) return;
  const image = new Image();
  const blobUrl = URL.createObjectURL(
    new Blob([currentSvg], { type: "image/svg+xml" })
  );
  image.onload = () => {
    const canvas = document.createElement("canvas");
    const scale = 3;
    canvas.width = Math.ceil(image.naturalWidth * scale);
    canvas.height = Math.ceil(image.naturalHeight * scale);
    const context = canvas.getContext("2d");
    context.scale(scale, scale);
    context.drawImage(image, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = exportName("png");
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }, "image/png");
    URL.revokeObjectURL(blobUrl);
  };
  image.onerror = () => {
    URL.revokeObjectURL(blobUrl);
    toast("PNG export failed. Try downloading SVG instead.");
  };
  image.src = blobUrl;
}

function resetControls() {
  for (const input of document.querySelectorAll("[data-modifier-field]")) input.value = "";
  Object.assign(state, {
    affiliation: "friend",
    context: "0",
    status: "present",
    amplifierMode: "echelon",
    amplifierValue: "",
    modifier1: "",
    modifier2: "",
    customSidc: "",
    importedIcon: null,
    outline: false,
    sidcDirty: false,
    sidcMessage: null,
    adjustments: {},
    textOrigins: {},
    droppedChoices: {}
  });
  for (const select of document.querySelectorAll("[data-rating-part]")) select.value = "";
  for (const id of ["fillColorOn", "monoColorOn", "infoColorOn", "infoBackgroundOn"]) dom[id].checked = false;
  dom.showFlag.checked = true;
  dom.fillColor.value = "#80e0ff";
  dom.monoColor.value = "#000000";
  dom.infoColor.value = "#000000";
  dom.infoBackground.value = "#ffffff";
  dom.fillOpacity.value = 100;
  dom.infoSize.value = 40;
  dom.outlineWidth.value = 7;
  dom.outlineColor.value = "#ffffff";
  dom.countryFlag.value = "";
  dom.colorMode.value = "Light";
  for (const id of ["hq", "taskForce", "feintDummy"]) dom[id].checked = false;
  for (const id of ["speedLeader", "hqStaffLength", "stack", "frameShape"]) dom[id].value = "0";
  dom.uncertaintyMarker.value = "table";
  dom.direction.value = -1;
  dom.fill.checked =
    dom.frame.checked =
    dom.icon.checked =
    dom.infoFields.checked =
      true;
  dom.symbolSize.value = 100;
  dom.strokeWidth.value = 4;
  dom.outlineToggle.classList.remove("active");
  dom.outlineToggle.setAttribute("aria-pressed", "false");
  syncStandardControls();
  renderAll();
  renderCatalog();
  toast("Modifiers reset");
}

function activateTab(tab) {
  for (const candidate of document.querySelectorAll("[data-editor-tab]")) {
    const active = candidate === tab;
    candidate.setAttribute("aria-selected", String(active));
    candidate.tabIndex = active ? 0 : -1;
    document.getElementById(candidate.getAttribute("aria-controls")).hidden =
      !active;
  }
  // Section switches return the form to its top.
  const panel = document.querySelector(".editor-panel");
  if (panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: "start" });
}

function openField(key) {
  const field = textModifiers.find((item) => item.key === key);
  const input = field && document.getElementById(field.id);
  if (!input || input.disabled) return;
  activateTab(document.getElementById("tab-text"));
  setFocusField(key);
  input.scrollIntoView({ block: "center" });
  // The AO text is composed from dropdowns; focus the first one when the text is hidden.
  (input.hidden ? input.closest("[data-field-wrapper]").querySelector('[data-ao-part="b"]') : input).focus({ preventScroll: true });
}

function moveCardFocus(card, step) {
  const allCards = () => [...dom.searchResults.querySelectorAll("[data-symbol-id]")];
  let cards = allCards();
  const index = cards.indexOf(card);
  if (index < 0) return;
  // At the last loaded card, load the next batch before moving on.
  if (step > 0 && index === cards.length - 1 && appendCatalogBatch()) cards = allCards();
  const next = cards[index + step];
  if (next) next.focus();
  else if (step < 0) dom.symbolSearch.focus();
}

function bindEvents() {
  const editorTabs = [...document.querySelectorAll("[data-editor-tab]")];
  editorTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const target =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? editorTabs.length - 1
            : (index +
                (event.key === "ArrowRight" ? 1 : -1) +
                editorTabs.length) %
              editorTabs.length;
      activateTab(editorTabs[target]);
      editorTabs[target].focus();
    });
  });
  dom.standardSelect.addEventListener("change", () => {
    setStandard(dom.standardSelect.value);
  });
  dom.symbolSearch.addEventListener("input", () => {
    state.search = dom.symbolSearch.value;
    state.visible = paletteBatch;
    renderCatalog();
    dom.searchResults.scrollTop = 0;
  });
  const clearSearch = () => {
    dom.symbolSearch.value = "";
    state.search = "";
    state.visible = paletteBatch;
    renderCatalog();
    dom.searchResults.scrollTop = 0;
    dom.symbolSearch.focus();
  };
  dom.clearSearch.addEventListener("click", clearSearch);
  dom.categoryList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    state.visible = paletteBatch;
    renderCatalog();
    dom.searchResults.scrollTop = 0;
  });
  dom.searchResults.addEventListener("click", (event) => {
    const card = event.target.closest("[data-symbol-id]");
    if (!card) return;
    selectSymbol(card.dataset.symbolId);
    closeSearch();
  });
  dom.searchResults.addEventListener("keydown", (event) => {
    const card = event.target.closest("[data-symbol-id]");
    if (!card) return;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
      moveCardFocus(card, 1);
    } else if (["ArrowUp", "ArrowLeft"].includes(event.key)) {
      event.preventDefault();
      moveCardFocus(card, -1);
    }
  });
  dom.symbolSearch.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      dom.searchResults.querySelector("[data-symbol-id]")?.focus();
    } else if (event.key === "Enter") {
      event.preventDefault();
      const first = filteredIcons()[0];
      if (first) {
        selectSymbol(first.id);
        closeSearch();
      }
    }
  });
  dom.searchLauncher.addEventListener("click", openSearch);
  // The search panel is modal: keep focus inside it while it is open.
  document.addEventListener("focusin", (event) => {
    if (state.searchOpen && !dom.searchPanel.contains(event.target)) dom.symbolSearch.focus();
  });
  for (const element of document.querySelectorAll("[data-close-search]"))
    element.addEventListener("click", closeSearch);
  dom.identityChips.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-value]");
    if (!chip || chip.disabled || dom.affiliation.disabled) return;
    dom.affiliation.value = chip.dataset.value;
    dom.affiliation.dispatchEvent(new Event("change"));
  });
  dom.statusChips.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-value]");
    if (!chip || chip.disabled) return;
    dom.status.value = chip.dataset.value;
    dom.status.dispatchEvent(new Event("change"));
  });
  dom.searchResults.addEventListener("scroll", fillPalette, { passive: true });

  dom.affiliation.addEventListener("change", () => {
    delete state.adjustments.identity;
    state.affiliation = dom.affiliation.value;
    updateSidcAndRender("affiliation", { rerenderCatalog: true });
  });
  dom.context.addEventListener("change", () => {
    delete state.adjustments.identity;
    state.context = dom.context.value;
    populateIdentityOptions();
    updateSidcAndRender("context");
  });
  dom.status.addEventListener("change", () => {
    delete state.adjustments.status;
    state.status = dom.status.value;
    updateSidcAndRender("status", { rerenderCatalog: true });
  });
  dom.amplifierMode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (!button || button.disabled || button.dataset.mode === state.amplifierMode) return;
    delete state.adjustments.amplifier;
    state.amplifierMode = button.dataset.mode;
    state.amplifierValue = "";
    populateAmplifier();
    updateSidcAndRender("amplifier");
  });
  dom.amplifierValue.addEventListener("change", () => {
    delete state.adjustments.amplifier;
    state.amplifierValue = dom.amplifierValue.value;
    updateSidcAndRender("amplifier");
  });
  dom.modifier1.addEventListener("change", () => {
    state.modifier1 = dom.modifier1.value;
    updateSidcAndRender("modifier1");
  });
  dom.modifier2.addEventListener("change", () => {
    state.modifier2 = dom.modifier2.value;
    updateSidcAndRender("modifier2");
  });

  for (const id of ["hq", "taskForce", "feintDummy"])
    dom[id].addEventListener("change", () => updateSidcAndRender("flags"));
  for (const id of ["fill", "frame", "icon", "infoFields"])
    dom[id].addEventListener("change", renderAll);
  dom.countryFlag.addEventListener("change", () => {
    if (state.customSidc)
      state.customSidc = withCountryFlag(state.customSidc, dom.countryFlag.value, state.standardId);
    renderAll();
  });
  dom.frameShape.addEventListener("change", () => updateSidcAndRender("frameShape"));
  dom.uncertaintyMarker.addEventListener("change", renderAll);
  for (const id of ["speedLeader", "hqStaffLength", "stack"])
    dom[id].addEventListener("input", renderAll);
  for (const id of ["showFlag", "fillColorOn", "monoColorOn", "infoColorOn", "infoBackgroundOn"])
    dom[id].addEventListener("change", renderAll);
  for (const id of ["fillColor", "monoColor", "infoColor", "infoBackground", "fillOpacity", "infoSize", "outlineWidth", "outlineColor"])
    dom[id].addEventListener("input", () => {
      const toggle = { fillColor: "fillColorOn", monoColor: "monoColorOn", infoColor: "infoColorOn", infoBackground: "infoBackgroundOn" }[id];
      if (toggle) dom[toggle].checked = true;
      if (id.startsWith("outline") && !state.outline) {
        state.outline = true;
        dom.outlineToggle.classList.add("active");
        dom.outlineToggle.setAttribute("aria-pressed", "true");
      }
      renderAll();
    });
  dom.directionNumber.addEventListener("input", () => {
    const raw = dom.directionNumber.value.trim();
    dom.direction.value = raw === "" ? -1 : Math.min(360, Math.max(0, Math.round(Number(raw) || 0)));
    renderAll();
  });
  for (const button of document.querySelectorAll("[data-direction]"))
    button.addEventListener("click", () => {
      dom.direction.value = button.dataset.direction;
      renderAll();
    });
  dom.toggleUnavailable.addEventListener("click", () => {
    state.showUnavailable = !state.showUnavailable;
    renderAll();
  });
  dom.clearText.addEventListener("click", () => {
    state.textOrigins = {};
    state.droppedChoices = {};
    for (const input of document.querySelectorAll("[data-modifier-field]")) input.value = "";
    for (const select of document.querySelectorAll("[data-rating-part]")) select.value = "";
    renderAll();
    toast("Text amplifiers cleared");
  });
  dom.positionsToggle.addEventListener("click", () => {
    state.positions = !state.positions;
    dom.positionsToggle.classList.toggle("active", state.positions);
    dom.positionsToggle.setAttribute("aria-pressed", String(state.positions));
    renderAll();
  });
  dom.symbolPreview.addEventListener("click", (event) => {
    const tag = event.target.closest("[data-field]");
    if (tag) openField(tag.dataset.field);
  });
  dom.sidcInput.addEventListener("input", () => {
    state.sidcDirty = true;
    state.sidcMessage = null;
    renderSidcStatus(state.customSidc || buildSidc());
  });
  for (const id of ["colorMode", "direction", "symbolSize", "strokeWidth"])
    dom[id].addEventListener("input", () => {
      renderAll();
      if (id === "colorMode" || id === "strokeWidth") renderCatalog();
    });

  dom.applySidc.addEventListener("click", () => {
    let value = dom.sidcInput.value.trim().toUpperCase().replace(/\s/g, "");
    const allowed =
      config().family === "modern" ? /^\d{20,30}$/ : /^[A-Z0-9*-]{10,15}$/;
    const reject = (text) => {
      state.sidcDirty = true;
      state.sidcMessage = { kind: "error", text };
      renderSidcStatus(state.customSidc || buildSidc());
    };
    if (!allowed.test(value)) {
      reject(
        config().family === "modern"
          ? `Enter a numeric SIDC with 20–30 digits. This one has ${value.length} characters${/\D/.test(value) ? ", including letters" : ""}.`
          : `Enter a letter-based SIDC with 10–15 characters (letters, digits, - or *). This one has ${value.length}.`
      );
      return;
    }
    if (state.standardId === "app6a" && !value.startsWith("S")) {
      reject("APP-6A: enter an S-scheme tactical symbol code. G-scheme tactical graphics are not part of this editor.");
      return;
    }
    const startStandard = state.standardId;
    const hasWildcards = value.includes("*");
    if (hasWildcards) {
      // Publication templates leave identity/status open. Resolve those using
      // the editor selections; unspecified optional fields remain empty.
      const characters = [...value];
      if (characters[1] === "*") {
        const identity = identityList(config()).find(item => item.value === state.affiliation);
        characters[1] = identity ? identityCode(identity, config(), state.context) : state.affiliation.replace(/^code:/, "");
      }
      if (characters[3] === "*")
        characters[3] = statuses.find(item => item.value === state.status)?.legacy || state.status.replace(/^code:/, "");
      value = characters.join("").replace(/\*/g, "-");
    }
    applyImportedSidc(value);
    // A newly applied SIDC is authoritative, including empty/unknown country
    // fields. Never leave the previously selected country's flag on a new code.
    dom.countryFlag.value = countryFlagFromSidc(value, state.standardId);
    state.sidcDirty = false;
    state.sidcMessage = null;
    renderAll();
    renderCatalog();
    const notes = [
      hasWildcards ? "Wildcards resolved with the current identity and status; other fields left unspecified." : "",
      state.standardId !== startStandard ? `Standard switched to ${config().label}.` : "",
      state.importedIcon?.name === "Custom SIDC" ? "This function code is not in the catalog; it is kept as entered." : ""
    ].filter(Boolean);
    state.sidcMessage = {
      kind: notes.length ? "info" : "ok",
      text: `Applied · ${selectedIcon().name}. ${notes.join(" ")}`.trim(),
      sidc: state.customSidc || buildSidc()
    };
    renderSidcStatus(state.sidcMessage.sidc);
  });
  dom.sidcInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      dom.applySidc.click();
    } else if (event.key === "Escape" && state.sidcDirty) {
      event.preventDefault();
      state.sidcDirty = false;
      state.sidcMessage = null;
      renderAll();
    }
  });
  dom.copySidc.addEventListener("click", () =>
    copyText(dom.sidcInput.value, "SIDC copied")
  );
  dom.copySvg.addEventListener(
    "click",
    () => currentSvg && copyText(currentSvg, "SVG source copied")
  );
  dom.downloadSvg.addEventListener(
    "click",
    () => currentSvg && download(currentSvg, exportName("svg"), "image/svg+xml")
  );
  dom.downloadPng.addEventListener("click", downloadPng);
  dom.gridToggle.addEventListener("click", () => {
    const active = dom.gridToggle.classList.toggle("active");
    dom.stage.classList.toggle("no-grid", !active);
    dom.gridToggle.setAttribute("aria-pressed", String(active));
  });
  dom.outlineToggle.addEventListener("click", () => {
    state.outline = !state.outline;
    dom.outlineToggle.classList.toggle("active", state.outline);
    dom.outlineToggle.setAttribute("aria-pressed", String(state.outline));
    renderAll();
  });
  dom.resetButton.addEventListener("click", resetControls);
  dom.helpButton.addEventListener("click", () => dom.helpDialog.showModal());
  dom.closeHelp.addEventListener("click", () => dom.helpDialog.close());
  dom.helpDialog.addEventListener("click", (event) => {
    if (event.target === dom.helpDialog) dom.helpDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName) &&
      !dom.helpDialog.open
    ) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === "Escape" && state.searchOpen) {
      event.preventDefault();
      if (document.activeElement === dom.symbolSearch && dom.symbolSearch.value) clearSearch();
      else closeSearch();
    }
  });
}

async function init() {
  try {
    const response = await fetch("./catalog.json");
    if (!response.ok)
      throw new Error(`Catalog request failed: ${response.status}`);
    catalog = await response.json();
    createTextFields();
    // Flags load separately so a missing artwork file cannot take the symbol
    // editor offline. Downloads stay vector-only and never need a remote CDN.
    try {
      const response = await fetch("./flags.json");
      if (!response.ok) throw new Error(`Flag request failed: ${response.status}`);
      const flags = await response.json();
      flagArtwork = new Map(flags.map((flag) => [flag.code, flag.svg]));
      flagNames = new Map(flags.map((flag) => [flag.code, flag.name]));
      window.ms.addSymbolPart(createCountryFlagPart(flags));
      dom.countryFlag.innerHTML = option("", "No flag") + flags.map(flag =>
        option(flag.code, flag.name)
      ).join("");
      dom.countryFlag.disabled = false;
    } catch (error) {
      dom.countryFlag.innerHTML = option("", "Flags unavailable — reload to retry");
      dom.countryFlag.disabled = true;
      console.error("Unable to load flag artwork", error);
    }
    bindEvents();
    loadRecent();
    renderStandardSelect();
    populateCategories();
    chooseInitialSymbol();
    try {
      const recent = localStorage.getItem(`symbol-studio:${state.standardId}`);
      if (recent && dataset().icons.some((icon) => icon.id === recent))
        state.selectedId = recent;
    } catch {}
    syncStandardControls();
    renderCatalog();
    renderAll();
  } catch (error) {
    for (const button of [dom.downloadSvg, dom.downloadPng, dom.copySvg, dom.copySidc, dom.applySidc]) button.disabled = true;
    dom.symbolGrid.innerHTML = `<div class="empty-state">Unable to load the symbol library.<br>${error.message}<br><br><b>npm run studio:build</b> to rebuild the library.</div>`;
    dom.symbolPreview.innerHTML = `<div class="empty-state">The symbol library is unavailable.</div>`;
  }
}

init();
