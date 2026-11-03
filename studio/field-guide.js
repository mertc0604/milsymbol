// Edition-specific help for the text amplifiers: what a field holds in the
// selected edition, a usable example and its printed format. A class entry
// (the profile's symbolClass) overrides the edition entry; anything not listed
// keeps the shared wording of modifier-fields.js.
const guides = {
  app6a: {
    // Table III W prints DDHHMMSSZMONYY with at most 14 characters (PDF 26/20).
    dtg: { format: "DDHHMMSSZMONYY (Table III)", example: "03143000ZNOV26", printed: { seconds: true } },
    // Table III Y and 505.1e: latitude and longitude, WGS-84 (PDF 27/21, 32/26).
    location: { description: "Latitude and longitude, WGS-84 (Table III, 505.1e).", example: "410030N0285812E" },
    altitudeDepth: { example: "1500FT" }
  },
  "2525c": {
    // Table IV W: DDHHMMSSZMONYYYY or O/O, 16 characters (PDF 29/23).
    dtg: { format: "DDHHMMSSZMONYYYY or O/O for on order (Table IV)", example: "03143000ZNOV2026", printed: { seconds: true, fourDigitYear: true } },
    location: { description: "Degrees, minutes and seconds, or UTM or another display format (Table IV).", example: "410030N0285812E" },
    // Table IV AO: up to 8 characters, no code list (PDF 30/24).
    engagementBar: {
      description: "Up to 8 characters immediately above the symbol. It may show local or remote status, engagement status and weapon type (Table IV); 2525C gives no code list.",
      example: "ENG"
    }
  },
  app6d: {
    location: { description: "Latitude and longitude or grid coordinates." },
    engagementBar: { description: "A:BBB-CC above the symbol: who engages (A), the engagement stage (BBB) and the weapon or number of engagements (CC)." },
    classes: {
      // Table 3-2 W: four-digit year for land units (PDF 87/3-7).
      landUnit: { dtg: { example: "291430ZOCT2026" } },
      landInstallation: {
        // Table 3-22 PDF 218/3-138.
        installationComposition: {
          description: "Component type of the installation: Development, Research, Production, Service, Storage or Utility (Table 3-22).",
          example: "Production"
        },
        combatEffectiveness: { description: "Capacity of the installation (Table 3-22).", example: "" },
        // Figure 3-18 PDF 216 shows AE; Table 3-22 has no AE row.
        equipmentTeardownTime: {
          description: "Figure 3-18 shows AE for installations, but Table 3-22 does not define it, so no meaning is assumed here.",
          example: ""
        }
      }
    }
  }
};

// {description, example, format, printed} for a field; the shared field gives
// the defaults (its placeholder "e.g. ..." is the example).
export function fieldGuide(standardId, symbolClass, field) {
  const edition = guides[standardId] || {};
  const own = { ...(edition[field.key] || {}), ...((edition.classes && edition.classes[symbolClass]) || {})[field.key] };
  const example = own.example !== undefined ? own.example : String(field.placeholder || "").replace(/^e\.g\.\s*/, "");
  return {
    description: own.description || field.description,
    example,
    format: own.format || "",
    printed: own.printed || null
  };
}
