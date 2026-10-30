import { countryCodes } from "./country-code-data.js";

const byFlag = new Map(countryCodes.map((row) => [row[0], row]));
const byFips = new Map(countryCodes.filter((row) => row[1] !== "-")
  .map((row) => [row[1], row[0]]));
const byNumeric = new Map(countryCodes.map((row) => [row[2], row[0]]));
// Alternate territorial FIPS codes share their current territory flag.
byFips.set("WE", "ps");
byFips.set("JN", "sj");

const fipsField = {encoding: "fips", start: 12, end: 14, label: "Country", description: "FIPS · positions 13–14"};
const isoField = {encoding: "iso", start: 12, end: 14, label: "Country", description: "ISO alpha-2 · positions 13–14"};
// APP-6D Annex A, Figure A-1 and A.12 / Table A-9; MIL-STD-2525D A.5.5.
// This field identifies the originator of national symbology extensions.
const dField = {encoding: "numeric", start: 20, end: 23, label: "Originator country", description: "ISO numeric · positions 21–23 (symbology originator)"};
const eField = {encoding: "numeric", start: 27, end: 30, label: "Country", description: "ISO numeric · positions 28–30"};
const fields = new Map([
  ["app6a", fipsField], ["app6b", fipsField], ["2525c", isoField],
  ["app6d", dField], ["2525d", dField], ["2525e", eField],
  // APP6E in the Studio is explicitly a shared 2525E compatibility view.
  ["app6e", eField]
]);

export function countrySidcField(standard) {
  return fields.get(standard) || null;
}

export function countryCodeForFlag(flag, standard) {
  const row = byFlag.get(flag);
  const field = countrySidcField(standard);
  if (!row || !field) return "";
  const type = field.encoding;
  if (type === "numeric") return row[2];
  if (type === "iso") return row[0].toUpperCase();
  return type === "fips" && row[1] !== "-" ? row[1] : "";
}

export function countryFlagFromSidc(sidc, standard) {
  const field = countrySidcField(standard);
  if (!field) return "";
  const type = field.encoding;
  if (type === "numeric") {
    // Read only the complete third ten digits, at the edition's own offset.
    return /^\d{30}$/.test(sidc) ? byNumeric.get(sidc.slice(field.start, field.end)) || "" : "";
  }
  if (!/^[A-Z0-9*-]{14,15}$/.test(sidc)) return "";
  const code = sidc.slice(12, 14);
  if (type === "fips") return byFips.get(code) || "";
  return type === "iso" && byFlag.has(code.toLowerCase()) ? code.toLowerCase() : "";
}

export function withCountryFlag(sidc, flag, standard) {
  const field = countrySidcField(standard);
  if (!field) return sidc;
  const type = field.encoding;
  const code = countryCodeForFlag(flag, standard);
  if (type === "numeric" && /^\d{20,30}$/.test(sidc)) {
    if (!code && sidc.length <= field.start) return sidc;
    const full = sidc.padEnd(30, "0");
    return full.slice(0, field.start) + (code || "000") + full.slice(field.end);
  }
  if ((type === "fips" || type === "iso") && /^[A-Z0-9*-]{10,15}$/.test(sidc)) {
    if (!code && sidc.length <= 12) return sidc;
    const full = sidc.padEnd(15, "-");
    return full.slice(0, 12) + (code || "--") + full.slice(14);
  }
  return sidc;
}
