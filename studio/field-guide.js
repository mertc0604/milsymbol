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
  app6b: {
    // Table I W prints DDHHMMSSZMONYY, 14 characters (PDF 31/2-9).
    dtg: { format: "DDHHMMSSZMONYY (Table I)", example: "03143000ZNOV26", printed: { seconds: true } },
    // Table I X: six characters; note d: WGS 84 (PDF 32/2-10).
    altitudeDepth: { example: "1500FT" },
    location: { description: "Latitude and longitude, WGS 84 (Table I).", example: "410030N0285812E" }
  },
  "2525d": {
    // Table VII W and 5.3.7.7 (PDF 39/23, PDF 47/31).
    dtg: { format: "DDHHMMSSZMONYYYY, DDHHMMZMONYY or O/O (5.3.7.7)", example: "03143000ZNOV2026", printed: { seconds: true, fourDigitYear: true } },
    altitudeDepth: { example: "1500MSL" },
    location: { description: "Degrees, minutes and decimal minutes, or MGRS or GARS (Table VII).", example: "38SMB2649083145" },
    speed: { description: "A value with KPH, MPS, KTS or MPH (5.3.7.6).", example: "220KPH" },
    uniqueDesignation: { example: "TN:13579" },
    engagementBar: { description: "A:BBB-CC above the symbol: remote or both (A), the engagement stage (BBB) and the weapon or number of engagements (CC)." }
  },
  "2525e": {
    // Table VI W PDF 43/26: four-digit year.
    dtg: { format: "DDHHMMSSZMONYYYY or O/O (Table VI)", example: "03143000ZNOV2026", printed: { seconds: true, fourDigitYear: true } },
    altitudeDepth: { example: "FL280" },
    location: { description: "Degrees, minutes and decimal minutes, or MGRS or GARS (Table VI).", example: "38SMB2649083145" },
    speed: { description: "A value, a space and KPH, KPS, MPH, NMH or KTS (Table VI).", example: "220 KPH" },
    quantity: { description: "A number, a space and the unit of measure (Table VI).", example: "350 BEDS" },
    uniqueDesignation: { example: "TN:13579" },
    engagementBar: { description: "A:BBB-CC above the symbol: remote or both (A), the engagement stage (BBB) and the weapon or number of engagements (CC)." },
    headquartersElement: { description: "The element of a headquarters shown, such as TOC or MAIN2 (Table VI).", example: "MAIN2" }
  },
  app6e: {
    // Table 1-5 W PDF 74/40: four-digit year.
    dtg: { format: "DDHHMMSSZMMMYYYY or O/O (Table 1-5)", example: "03143000ZNOV2026", printed: { seconds: true, fourDigitYear: true } },
    altitudeDepth: { example: "FL280" },
    location: { description: "Degrees, minutes and seconds, or MGRS or GARS (Table 1-5).", example: "38SMB2649083145" },
    speed: { description: "A value, a space and KPH, KPS, MPH, NMH or KTS (Table 1-5).", example: "220 KPH" },
    quantity: { description: "A number, a space and the unit of measure (Table 1-5).", example: "500 LITRES" },
    engagementBar: { description: "A:BBB-CCC above the symbol: remote or both (A), the engagement stage (BBB) and the weapon or number of engagements (CCC)." },
    headquartersElement: { description: "The element of a headquarters shown, such as TOC or MAIN2 (Table 1-5).", example: "MAIN2" }
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
