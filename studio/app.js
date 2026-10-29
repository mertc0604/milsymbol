import { app6aSymbolClass, getApp6aFields } from "./vendor/letter-metadata.js";
import { modifierGroups, textModifiers, collectTextModifiers } from "./modifier-fields.js";

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
    standard: "2525",
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

const affiliations = [
  { value: "friend", label: "Friend", numeric: "3", legacy: "F" },
  { value: "hostile", label: "Hostile", numeric: "6", legacy: "H" },
  { value: "neutral", label: "Neutral", numeric: "4", legacy: "N" },
  { value: "unknown", label: "Unknown", numeric: "0", legacy: "U" }
];
const app6aAffiliations = affiliations.concat([
  { value: "pending", label: "Pending (?)", legacy: "P" },
  { value: "assumed", label: "Assumed friend (?)", legacy: "A" },
  { value: "suspect", label: "Suspect (?)", legacy: "S" },
  { value: "joker", label: "Joker (J)", legacy: "J" },
  { value: "faker", label: "Faker (K)", legacy: "K" }
]);

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
    "categoryFilter",
    "symbolGrid",
    "resultCount",
    "loadMore",
    "selectedName",
    "selectedPath",
    "symbolPreview",
    "stage",
    "gridToggle",
    "outlineToggle",
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

const state = {
  standardId: "app6a",
  selectedId: null,
  search: "",
  category: "all",
  visible: 40,
  affiliation: "friend",
  context: "0",
  status: "present",
  amplifierMode: "echelon",
  amplifierValue: "",
  modifier1: "",
  modifier2: "",
  customSidc: "",
  outline: false
};

let catalog;
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
    size: minimal ? 34 : Number(dom.symbolSize.value),
    strokeWidth: Number(dom.strokeWidth.value),
    colorMode: dom.colorMode.value,
    fill: minimal ? true : dom.fill.checked,
    frame: minimal ? true : dom.frame.checked,
    icon: minimal ? true : dom.icon.checked,
    infoFields: minimal ? false : dom.infoFields.checked,
    outlineWidth: !minimal && state.outline ? 7 : 0,
    outlineColor: "#ffffff",
    ...collectTextModifiers(values, app6a ? getApp6aFields(sidc).map(field => field.key) : null),
    direction: minimal || direction < 0 ? undefined : direction,
    speedLeader: minimal ? 0 : Number(dom.speedLeader.value),
    hqStaffLength: minimal ? 0 : Number(dom.hqStaffLength.value),
    stack: minimal || app6a ? 0 : Number(dom.stack.value)
  };
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

function legacyFlagCharacter() {
  return ["-", "F", "A", "C", "E", "G", "B", "D"][flagCode()];
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
  const affiliation = (standard.id === "app6a" ? app6aAffiliations : affiliations).find(
    (item) => item.value === (minimal ? "friend" : state.affiliation)
  );
  const status = statuses.find(
    (item) => item.value === (minimal ? "present" : state.status)
  );

  if (standard.family === "legacy") {
    let amplifier = [minimal ? "-" : legacyFlagCharacter(), "-"];
    if (!minimal && state.amplifierMode === "echelon") {
      amplifier = [
        legacyFlagCharacter(),
        echelons.find((item) => item[0] === state.amplifierValue)?.[3] || "-"
      ];
    } else if (!minimal && state.amplifierMode === "mobility") {
      amplifier = [
        ...(mobilities.find((item) => item[0] === state.amplifierValue)?.[3] ||
          "--")
      ];
    }
    if (state.standardId === "app6a" && icon.defaultModifier?.startsWith("H")) {
      amplifier = ["H", !minimal && dom.feintDummy.checked ? "B" : "-"];
    }
    if (state.standardId === "app6a" && icon.codingScheme === "G")
      amplifier = ["-", "-"];
    return `${icon.codingScheme || "S"}${icon.prescribedAffiliation || affiliation.legacy}${icon.battleDimension || "G"}${icon.prescribedStatus || status.legacy}${icon.code || "------"}${amplifier.join("")}---`;
  }

  const sidc = Array(30).fill("0");
  sidc.splice(0, 2, ...standard.version);
  sidc[2] = minimal ? "0" : state.context;
  sidc[3] = affiliation.numeric;
  sidc.splice(4, 2, ...(icon.symbolSet || "10").padStart(2, "0"));
  sidc[6] = status.numeric;
  sidc[7] = minimal ? "0" : String(flagCode());
  const amplifier =
    minimal || state.amplifierMode === "none"
      ? "00"
      : state.amplifierMode === "mobility"
        ? mobilities.find((item) => item[0] === state.amplifierValue)?.[2] ||
          "00"
        : echelons.find((item) => item[0] === state.amplifierValue)?.[2] ||
          "00";
  sidc.splice(8, 2, ...amplifier);
  sidc.splice(10, 6, ...(icon.code || "000000").padEnd(6, "0").slice(0, 6));
  if (!minimal) {
    applyModernModifier(sidc, state.modifier1, 1);
    applyModernModifier(sidc, state.modifier2, 2);
    if (standard.version === "13") sidc[22] = dom.frameShape.value;
  }
  return sidc.join("");
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
  if (id !== "app6a" && !affiliations.some(item => item.value === state.affiliation)) state.affiliation = "friend";
  state.selectedId = null;
  state.category = "all";
  state.visible = 40;
  state.modifier1 = "";
  state.modifier2 = "";
  state.customSidc = "";
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
  const categories = [
    ...new Set(dataset().icons.map((icon) => icon.category))
  ].sort((a, b) => a.localeCompare(b));
  dom.categoryFilter.innerHTML =
    option("all", "All symbol sets") +
    categories.map((item) => option(item, item)).join("");
  dom.categoryFilter.value = state.category;
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
  dom.clearSearch.hidden = !state.search;
  dom.symbolGrid.innerHTML = visible.length
    ? visible
        .map(
          (icon) => `
    <button class="symbol-card ${icon.id === state.selectedId ? "active" : ""}" aria-pressed="${icon.id === state.selectedId}" data-symbol-id="${escapeHtml(icon.id)}" title="${escapeHtml(icon.name)}">
      <span class="mini-symbol">${safeMiniSvg(icon)}</span>
      <strong>${escapeHtml(icon.name)}</strong>
      <small>${escapeHtml(icon.category)} · ${escapeHtml(icon.code)}</small>
    </button>`
        )
        .join("")
    : `<div class="empty-state">No symbols found.<br>Try a different name, code, or symbol set.</div>`;
  dom.loadMore.hidden = icons.length <= state.visible;
  dom.loadMore.textContent = `Show more · ${icons.length - state.visible}`;
  if (focusedId) [...dom.symbolGrid.querySelectorAll("[data-symbol-id]")].find(card=>card.dataset.symbolId === focusedId)?.focus({preventScroll:true});
}

function populateAmplifier() {
  let source = state.amplifierMode === "mobility" ? mobilities : echelons;
  if (state.standardId === "app6a")
    source = source.filter((item) => !["N", "NS", "NL"].includes(item[3]));
  dom.amplifierValue.disabled = state.amplifierMode === "none";
  dom.amplifierLabel.textContent =
    state.amplifierMode === "mobility" ? "Mobility" : "Echelon";
  dom.amplifierValue.innerHTML = source
    .map((item) => option(item[0], item[1]))
    .join("");
  const exists = source.some((item) => item[0] === state.amplifierValue);
  if (!exists) state.amplifierValue = "";
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
  select.value = [...select.options].some((item) => item.value === selected)
    ? selected
    : "";
  return select.value;
}

function syncModifiers() {
  const modern = config().family === "modern";
  const app6a = state.standardId === "app6a";
  const prescribedAffiliation = app6a && selectedIcon()?.prescribedAffiliation;
  dom.affiliation.disabled = Boolean(prescribedAffiliation);
  dom.affiliation.value = prescribedAffiliation ? app6aAffiliations.find(a => a.legacy === prescribedAffiliation).value : state.affiliation;
  const kind = app6a ? app6aSymbolClass(state.customSidc || buildSidc()) : "";
  const installation =
    state.standardId === "app6a" &&
    selectedIcon()?.defaultModifier?.startsWith("H");
  const tactical =
    state.standardId === "app6a" && selectedIcon()?.codingScheme === "G";
  dom.hq.disabled = Boolean(installation || tactical || (app6a && state.amplifierMode === "mobility"));
  dom.taskForce.disabled = app6a && kind !== "unit";
  dom.feintDummy.disabled = tactical;
  dom.amplifierValue.disabled =
    installation || tactical || state.amplifierMode === "none";
  for (const button of dom.amplifierMode.querySelectorAll("button"))
    button.disabled = Boolean(installation || tactical || (app6a && button.dataset.mode === "echelon" && kind !== "unit") || (app6a && button.dataset.mode === "mobility" && kind !== "equipment"));
  if (app6a && ((state.amplifierMode === "echelon" && kind !== "unit") || (state.amplifierMode === "mobility" && kind !== "equipment"))) {
    state.amplifierMode = "none"; state.amplifierValue = ""; populateAmplifier();
  }
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

function createTextFields() {
  const container = document.getElementById("app6aTextFields");
  // All editions share one form; applicable APP-6A fields are filtered below.
  container.innerHTML = modifierGroups.map(group => `<section class="modifier-group">
    <h4>${escapeHtml(group.label)}</h4><div class="control-group two-col">
    ${group.fields.map(field => `<label><span data-field-label id="label-${field.id}">${escapeHtml(field.label)} <small>${field.field}</small></span>
      ${field.choices
        ? `<select id="${field.id}" data-modifier-field="${field.key}" aria-labelledby="label-${field.id}" aria-describedby="help-${field.id}">${field.choices.map(([value, label]) => option(value, label)).join("")}</select>`
        : `<input id="${field.id}" data-modifier-field="${field.key}" aria-labelledby="label-${field.id}" aria-describedby="help-${field.id}" placeholder="${escapeHtml(field.placeholder)}" />`}
      <span class="modifier-description" id="help-${field.id}">${escapeHtml(field.description)}</span></label>`).join("")}
    </div></section>`).join("");
  container.addEventListener("input", renderAll);
}

function syncApp6aTextFields() {
  const active = state.standardId === "app6a";
  document.getElementById("app6aFieldNote").hidden = !active;
  const container = document.getElementById("app6aTextFields");
  const sidc = state.customSidc || buildSidc();
  const fields = new Map(getApp6aFields(sidc).map(field => [field.key,field]));
  for (const field of textModifiers) {
    const input = document.getElementById(field.id);
    const definition = active ? fields.get(field.key) : field;
    input.parentElement.hidden = !definition;
    input.disabled = !definition;
    const label = input.parentElement.querySelector("[data-field-label]");
    if (definition) {
      label.innerHTML = `${escapeHtml(definition.label)} <small>${definition.field}</small>`;
      if (!field.choices) {
        if (active) input.maxLength = definition.maxLength;
        else input.removeAttribute("maxlength");
        input.placeholder = active ? `Max. ${definition.maxLength} characters · ${definition.field}` : field.placeholder;
      }
    }
  }
  for (const group of container.querySelectorAll(".modifier-group"))
    group.hidden = ![...group.querySelectorAll("[data-modifier-field]")].some(input => !input.disabled);
  dom.direction.disabled = active && app6aSymbolClass(sidc) === "point";
  dom.speedLeader.disabled = dom.direction.disabled;
  dom.stack.disabled = active;
}

function syncStandardControls() {
  const modern = config().family === "modern";
  dom.contextField.hidden = !modern;
  dom.frameShapeField.hidden = config().version !== "13";
  // Validate after removing publication whitespace, not while pasting it.
  dom.sidcInput.removeAttribute("maxlength");
  dom.affiliation.innerHTML = (state.standardId === "app6a" ? app6aAffiliations : affiliations)
    .map((item) => option(item.value, item.label))
    .join("");
  dom.affiliation.value = state.affiliation;
  dom.status.innerHTML = (
    state.standardId === "app6a" ? statuses.slice(0, 2) : statuses
  )
    .map((item) => option(item.value, item.label))
    .join("");
  dom.status.value = state.status;
  dom.context.innerHTML =
    option("0", "Reality") +
    option("1", "Exercise") +
    option("2", "Simulation");
  dom.context.value = state.context;
  populateAmplifier();
  syncModifiers();
}

function updateSegments(sidc) {
  const modern = /^\d/.test(sidc);
  const parts = modern
    ? [
        ["Version", sidc.slice(0, 2)],
        ["Identity", sidc.slice(2, 4)],
        ["Set", sidc.slice(4, 6)],
        ["Amplifier", sidc.slice(6, 10)],
        ["Entity", sidc.slice(10, 16)],
        ["Modifiers", sidc.slice(16, 20)],
        ["Ext.", sidc.slice(20, 22)],
        ["Reserved", sidc.slice(22)]
      ]
    : [
        ["Scheme", sidc.slice(0, 1)],
        ["Identity", sidc.slice(1, 2)],
        ["Dimension", sidc.slice(2, 3)],
        ["Status", sidc.slice(3, 4)],
        ["Function", sidc.slice(4, 10)],
        ["Modifiers", sidc.slice(10, 12)],
        ["Country/OOB", sidc.slice(12)]
      ];
  dom.sidcSegments.innerHTML = parts
    .map(([label, value]) => `<span>${label} <b>${value || "—"}</b></span>`)
    .join("");
}

function renderAll() {
  const icon = selectedIcon();
  if (!icon) return;
  state.selectedId = icon.id;
  syncModifiers();
  const sidc = state.customSidc || buildSidc(icon);
  window.ms.setStandard(config().standard);
  try {
    currentSymbol = new window.ms.Symbol(sidc, currentOptions());
    currentSvg = currentSymbol.asSVG();
    dom.symbolPreview.innerHTML = currentSvg;
    document.getElementById("compactPreview").innerHTML = currentSvg;
    const valid = Boolean(currentSymbol.isValid());
    dom.renderState.classList.toggle("invalid", !valid);
    dom.renderState.innerHTML = `<i></i>${valid ? "Rendered" : "Check code / modifiers"}`;
    dom.renderState.title = currentSymbol.isValid(true).modifierErrors?.join("; ") || "";
  } catch (error) {
    currentSymbol = null;
    currentSvg = "";
    document.getElementById("compactPreview").replaceChildren();
    dom.symbolPreview.innerHTML = `<div class="empty-state">Unable to render symbol.<br>${error.message}</div>`;
    dom.renderState.classList.add("invalid");
    dom.renderState.innerHTML = "<i></i>Rendering error";
  }
  dom.selectedName.textContent = state.customSidc ? "Custom SIDC" : icon.name;
  dom.selectedPath.textContent = state.customSidc
    ? `${config().label} / Manually entered symbol code`
    : [...new Set([icon.category, ...(icon.path || [])].filter(Boolean))].join(
        " / "
      );
  document.getElementById("supportNote").textContent = state.standardId === "app6e"
    ? "Compatibility view using the shared 2525E catalog. This is not a separate edition-specific catalog."
    : state.standardId === "app6a"
      ? `${icon.source || "APP-6A (1998)"}. ${dataset().icons.length} tactical symbols (S-scheme).${icon.remarks ? " " + icon.remarks : ""}`
      : "Rendered with milsymbol. Symbol appearance may differ from older standard publications.";
  dom.sidcInput.value = sidc;
  for (const button of [dom.downloadSvg, dom.downloadPng, dom.copySvg, dom.copySidc]) button.disabled = !currentSvg;
  const auditLink = document.getElementById("publicationAudit");
  auditLink.hidden = document.documentElement.dataset.localAudit !== "true" || state.standardId !== "app6a" || !icon.id.startsWith("S");
  auditLink.href = `audit/symbols/index.html?symbol=${encodeURIComponent(icon.id)}`;
  dom.sidcLength.textContent = `${sidc.length} characters`;
  updateSegments(sidc);
  dom.directionOutput.value =
    Number(dom.direction.value) < 0 ? "Off" : `${dom.direction.value}°`;
  dom.sizeOutput.value = `${dom.symbolSize.value}%`;
  dom.strokeOutput.value = dom.strokeWidth.value;
  document.title = `${state.customSidc ? "Custom SIDC" : icon.name} — Military Symbol Editor`;
}

function clearCustomAndRender({ rerenderCatalog = false } = {}) {
  state.customSidc = "";
  renderAll();
  if (rerenderCatalog) renderCatalog();
}

function selectSymbol(id) {
  state.selectedId = id;
  state.modifier1 = "";
  state.modifier2 = "";
  state.customSidc = "";
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
    outline: false
  });
  dom.colorMode.value = "Light";
  for (const id of ["hq", "taskForce", "feintDummy"]) dom[id].checked = false;
  for (const id of ["speedLeader", "hqStaffLength", "stack", "frameShape"]) dom[id].value = "0";
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

function bindEvents() {
  const editorTabs = [...document.querySelectorAll("[data-editor-tab]")];
  const activateTab = (tab) => {
    for (const candidate of editorTabs) {
      const active = candidate === tab;
      candidate.setAttribute("aria-selected", String(active));
      candidate.tabIndex = active ? 0 : -1;
      document.getElementById(candidate.getAttribute("aria-controls")).hidden =
        !active;
    }
    document.querySelector(".control-scroll").scrollTop = 0;
  };
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
    state.visible = 40;
    renderCatalog();
    dom.symbolGrid.scrollTop = 0;
  });
  const clearSearch = () => {
    dom.symbolSearch.value = "";
    state.search = "";
    state.visible = 40;
    renderCatalog();
    dom.symbolGrid.scrollTop = 0;
    dom.symbolSearch.focus();
  };
  dom.clearSearch.addEventListener("click", clearSearch);
  dom.categoryFilter.addEventListener("change", () => {
    state.category = dom.categoryFilter.value;
    state.visible = 40;
    renderCatalog();
    dom.symbolGrid.scrollTop = 0;
  });
  dom.symbolGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-symbol-id]");
    if (card) selectSymbol(card.dataset.symbolId);
  });
  dom.loadMore.addEventListener("click", () => {
    state.visible += 40;
    renderCatalog();
  });

  dom.affiliation.addEventListener("change", () => {
    state.affiliation = dom.affiliation.value;
    clearCustomAndRender({ rerenderCatalog: true });
  });
  dom.context.addEventListener("change", () => {
    state.context = dom.context.value;
    clearCustomAndRender();
  });
  dom.status.addEventListener("change", () => {
    state.status = dom.status.value;
    clearCustomAndRender({ rerenderCatalog: true });
  });
  dom.amplifierMode.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mode]");
    if (!button || button.disabled || button.dataset.mode === state.amplifierMode) return;
    state.amplifierMode = button.dataset.mode;
    state.amplifierValue = "";
    populateAmplifier();
    clearCustomAndRender();
  });
  dom.amplifierValue.addEventListener("change", () => {
    state.amplifierValue = dom.amplifierValue.value;
    clearCustomAndRender();
  });
  dom.modifier1.addEventListener("change", () => {
    state.modifier1 = dom.modifier1.value;
    clearCustomAndRender();
  });
  dom.modifier2.addEventListener("change", () => {
    state.modifier2 = dom.modifier2.value;
    clearCustomAndRender();
  });

  for (const id of ["hq", "taskForce", "feintDummy"])
    dom[id].addEventListener("change", () => clearCustomAndRender());
  for (const id of ["fill", "frame", "icon", "infoFields"])
    dom[id].addEventListener("change", renderAll);
  dom.frameShape.addEventListener("change", () => clearCustomAndRender());
  for (const id of ["speedLeader", "hqStaffLength", "stack"])
    dom[id].addEventListener("input", renderAll);
  for (const id of ["colorMode", "direction", "symbolSize", "strokeWidth"])
    dom[id].addEventListener("input", () => {
      renderAll();
      if (id === "colorMode" || id === "strokeWidth") renderCatalog();
    });

  dom.applySidc.addEventListener("click", () => {
    let value = dom.sidcInput.value.trim().toUpperCase().replace(/\s/g, "");
    const allowed =
      config().family === "modern" ? /^\d{20,30}$/ : /^[A-Z0-9*-]{10,15}$/;
    if (!allowed.test(value)) {
      toast(
        config().family === "modern"
          ? "Enter a numeric SIDC with 20–30 digits"
          : "Enter a letter-based SIDC with 10–15 characters (letters, digits, - or *)"
      );
      return;
    }
    if (state.standardId === "app6a" && !value.startsWith("S")) {
      toast("APP-6A: enter an S-scheme tactical symbol code");
      return;
    }
    const hasWildcards = value.includes("*");
    if (hasWildcards) {
      // Publication templates leave identity/status open. Resolve those using
      // the editor selections; unspecified optional fields remain empty.
      const characters = [...value];
      if (characters[1] === "*")
        characters[1] = app6aAffiliations.find(item => item.value === state.affiliation).legacy;
      if (characters[3] === "*")
        characters[3] = statuses.find(item => item.value === state.status).legacy;
      value = characters.join("").replace(/\*/g, "-");
    }
    state.customSidc = value;
    renderAll();
    toast(hasWildcards ? "SIDC applied — wildcard fields resolved using current identity/status; other fields left unspecified" : "SIDC applied");
  });
  dom.sidcInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      dom.applySidc.click();
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
      !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)
    ) {
      event.preventDefault();
      dom.symbolSearch.focus();
    }
    if (
      event.key === "Escape" &&
      document.activeElement === dom.symbolSearch &&
      dom.symbolSearch.value
    ) {
      clearSearch();
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
    bindEvents();
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
