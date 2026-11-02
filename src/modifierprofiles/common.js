// Edition modifier profiles: shared contract and helpers.
//
// A profile describes, for one standard edition, which text/graphic amplifier
// fields apply to a SIDC, how long they may be, which literal values they
// accept, and where the renderer places them. Profiles are plain data plus pure
// functions with no dependency on `ms`, so the Studio can import the same files
// (copied to dist/studio/vendor/modifierprofiles/) that the library uses.
//
// Profile shape (every function receives the normalized SIDC string):
//   id                       "app6a" | "2525c" | "app6d"
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

// Join the non-empty values of one shared field position in source order.
// Empty modifiers collapse: no separator is reserved for them.
export function joinFields(options, keys, separator = " ") {
  return (keys || [])
    .map((key) => String(options[key] == null ? "" : options[key]))
    .filter((value) => value !== "")
    .join(separator);
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

// Store a profile's validation and layout on symbol metadata.
export function applyProfile(profile, sidc, options, metadata) {
  metadata.profile = profile.id;
  metadata.validation = profile.validate(sidc, options);
  const layout = profile.textLayout(sidc);
  if (layout) metadata.textLayout = layout;
  return metadata;
}
