// Edition modifier profiles: shared contract and helpers.
//
// A profile describes, for one standard edition, which text/graphic amplifier
// fields apply to a SIDC, how long they may be, which literal values they
// accept, and where the renderer places them. Profiles are plain data plus pure
// functions with no dependency on `ms`, so the Studio can import the same files
// (copied to dist/studio/vendor/modifierprofiles/) that the library uses.
//
// Profile shape (every function receives the normalized SIDC string):
//   id                       "app6a" | "app6b" | "2525c" | "app6d" | "2525d" |
//                            "2525e" | "app6e"
//   symbolClass(sidc)        class used for applicability, e.g. "unit"
//   fields(sidc)             [{ key, field, label, maxLength, kind, choices }]
//                            kind: "text" | "choice" | "graphic"; maxLength is
//                            null when the source sets no display limit.
//   unavailableReason(key, sidc)
//                            "" when the option applies, else a short reason.
//   validate(sidc, options)  { valid, details }; details is spread into
//                            Symbol.isValid(true). Use details.modifierErrors
//                            for source-backed violations and details.notes for
//                            source conflicts or product-policy decisions.
//   textLayout(sidc)         null to keep the legacy layout, or
//                            { left, right, separator, top, inner, bottom }.
//                            left/right are rows 0..5 top to bottom (row 0 sits
//                            above the usual first row); each row lists option
//                            keys in source order. top/inner/bottom list the
//                            option keys allowed in those positions.

// A value that is only whitespace (or missing) is empty. It does not create a
// row, reserve a separator, or count as "present" for validation. Whitespace is
// what String.prototype.trim() removes. Non-blank values are never trimmed.
export function isBlank(value) {
  return value == null || String(value).trim() === "";
}

// Join the non-empty values of one shared field position in source order.
// Empty and whitespace-only modifiers collapse: no separator is reserved.
export function joinFields(options, keys, separator = " ") {
  return (keys || [])
    .map((key) => (options[key] == null ? "" : String(options[key])))
    .filter((value) => !isBlank(value))
    .join(separator);
}

// Text options a symbol can carry (src/ms/symbol.js). Only these are touched by
// clearBlankText; sidc and any unknown key are left alone.
export const textOptionKeys = [
  "quantity",
  "reinforcedReduced",
  "staffComments",
  "additionalInformation",
  "evaluationRating",
  "combatEffectiveness",
  "signatureEquipment",
  "higherFormation",
  "hostile",
  "iffSif",
  "sigint",
  "uniqueDesignation",
  "type",
  "dtg",
  "altitudeDepth",
  "location",
  "speed",
  "specialHeadquarters",
  "country",
  "platformType",
  "equipmentTeardownTime",
  "commonIdentifier",
  "auxiliaryEquipmentIndicator",
  "headquartersElement",
  "installationComposition",
  "installationCapacity",
  "networkIdentifier",
  "engagementBar",
  "engagementType",
  "guardedUnit",
  "specialDesignator"
];

// Whitespace-only text options become "" and a whitespace-only direction
// becomes undefined. This runs on the symbol's own options object (setOptions
// copies the values the caller passes, so the caller's object is untouched),
// before the profile validates or the renderer reads the options, so every
// consumer sees the same "empty".
export function clearBlankText(options) {
  textOptionKeys.forEach((key) => {
    if (typeof options[key] === "string" && isBlank(options[key]))
      options[key] = "";
  });
  if (typeof options.direction === "string" && isBlank(options.direction))
    options.direction = undefined;
  return options;
}

// Every option key a layout can draw.
export function layoutKeys(layout) {
  if (!layout) return [];
  return [
    ...(layout.left || []).flat(),
    ...(layout.right || []).flat(),
    ...(layout.top || []),
    ...(layout.inner || []),
    ...(layout.bottom || [])
  ];
}

// A layout's derived descriptor (the E field) is drawn in the text rows only
// when the rows have something else to show; otherwise it stays by the frame.
export function layoutHasText(layout, options) {
  return Boolean(
    layout &&
      layoutKeys(layout).some(
        (key) => key !== "frameDescriptor" && !isBlank(options[key])
      )
  );
}

// Store a profile's validation and layout on symbol metadata.
export function applyProfile(profile, sidc, options, metadata) {
  clearBlankText(options);
  metadata.profile = profile.id;
  metadata.validation = profile.validate(sidc, options);
  const layout = profile.textLayout(sidc);
  if (layout) metadata.textLayout = layout;
  return metadata;
}
