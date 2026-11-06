import { countryCodes, nonIsoCodes, notInGenc } from "./country-code-data.js";

const own = (code) => (code === "-" ? "" : code);
// Each flag's code in each list; "" where the list gives the flag no code of its own.
const codes = new Map([
  ...countryCodes.map(([flag, fips, numeric]) =>
    [flag, { fips: own(fips), iso: flag.toUpperCase(), numeric, genc: notInGenc.includes(flag) ? "" : numeric }]),
  ...nonIsoCodes.map(([flag, fips, genc]) =>
    [flag, { fips: own(fips), iso: "", numeric: "", genc: own(genc) }])
]);
const lists = ["fips", "iso", "numeric", "genc"];
const flagsByCode = Object.fromEntries(lists.map((list) => [list, new Map(
  [...codes].filter(([, row]) => row[list]).map(([flag, row]) => [row[list], flag])
)]));

// APP-6A B.4.1.5 and APP-6(B) name the FIPS Pub 10 series; MIL-STD-2525C
// Appendix A (Table A-I) names ISO 3166-1.
const fipsField = {list: "fips", start: 12, end: 14, label: "Country", description: "FIPS · positions 13–14"};
const isoField = {list: "iso", start: 12, end: 14, label: "Country", description: "ISO alpha-2 · positions 13–14"};
// APP-6D Annex A, Figure A-1 and A.12 / Table A-9; MIL-STD-2525D A.5.5.
// This field identifies the originator of national symbology extensions, whose
// identifiers APP-6D A.12 sources from ISO 3166.
const dField = {list: "numeric", start: 20, end: 23, label: "Originator country", description: "ISO numeric · positions 21–23 (symbology originator)"};
// MIL-STD-2525E A.5.5.4 names GENC: ISO numeric codes plus numbers from 900 for
// entities ISO 3166-1 does not list, such as Kosovo (901).
const eField = {list: "genc", start: 27, end: 30, label: "Country", description: "GENC numeric · positions 28–30"};
const fields = new Map([
  ["app6a", fipsField], ["app6b", fipsField], ["2525c", isoField],
  ["app6d", dField], ["2525d", dField], ["2525e", eField],
  // APP6E in the Studio is explicitly a shared 2525E compatibility view.
  ["app6e", eField]
]);

export function countrySidcField(standard) {
  return fields.get(standard) || null;
}

// "" when the standard's list has no code for this flag; the editor then lists
// it as display only, and the SIDC carries no country.
export function countryCodeForFlag(flag, standard) {
  const row = codes.get(flag);
  const field = countrySidcField(standard);
  return row && field ? row[field.list] : "";
}

export function countryFlagFromSidc(sidc, standard) {
  const field = countrySidcField(standard);
  if (!field) return "";
  if (field.list === "numeric" || field.list === "genc") {
    // Read only the complete third ten digits, at the edition's own offset.
    return /^\d{30}$/.test(sidc) ? flagsByCode[field.list].get(sidc.slice(field.start, field.end)) || "" : "";
  }
  if (!/^[A-Z0-9*-]{14,15}$/.test(sidc)) return "";
  return flagsByCode[field.list].get(sidc.slice(12, 14)) || "";
}

export function withCountryFlag(sidc, flag, standard) {
  const field = countrySidcField(standard);
  if (!field) return sidc;
  const code = countryCodeForFlag(flag, standard);
  if ((field.list === "numeric" || field.list === "genc") && /^\d{20,30}$/.test(sidc)) {
    if (!code && sidc.length <= field.start) return sidc;
    const full = sidc.padEnd(30, "0");
    return full.slice(0, field.start) + (code || "000") + full.slice(field.end);
  }
  if ((field.list === "fips" || field.list === "iso") && /^[A-Z0-9*-]{10,15}$/.test(sidc)) {
    if (!code && sidc.length <= 12) return sidc;
    const full = sidc.padEnd(15, "-");
    return full.slice(0, 12) + (code || "--") + full.slice(14);
  }
  return sidc;
}
