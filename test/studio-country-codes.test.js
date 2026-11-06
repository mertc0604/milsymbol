import { countryCodeForFlag, countryFlagFromSidc, withCountryFlag } from "../studio/country-codes.js";
import { countryCodes, nonIsoCodes } from "../studio/country-code-data.js";
import fs from "node:fs";

const flagIcons = JSON.parse(fs.readFileSync(new URL("../node_modules/flag-icons/country.json", import.meta.url), "utf8")).map(({ code }) => code);
const standards = ["app6a", "app6b", "2525c", "app6d", "app6e", "2525d", "2525e"];
const codesFor = (flag) => standards.map((standard) => countryCodeForFlag(flag, standard));
const uncoded = (standard) => [...flagIcons, "nato"].filter((flag) => !countryCodeForFlag(flag, standard)).sort();

const legacy = "SFGPUCI-----";
const modern = "10031000001211000000";
const extended = "130310000012110000001234567792";
const dExtended = modern + "7921234276";

export default {
  "Studio SIDC country codes": {
    "every encodable country round-trips without changing identity": [
      [...countryCodes, ...nonIsoCodes].every(([flag]) => standards
        .every((standard) => !countryCodeForFlag(flag, standard) ||
          countryFlagFromSidc(withCountryFlag(standard === "2525c" || standard === "app6a" || standard === "app6b"
            ? legacy + "---" : modern, flag, standard), standard) === flag)),
      true
    ],
    "Turkey uses edition-specific codes": [
      [countryFlagFromSidc(legacy + "TU-", "app6a"),
        countryFlagFromSidc(legacy + "TR-", "2525c"),
        countryFlagFromSidc(modern + "7920000000", "app6d")],
      ["tr", "tr", "tr"]
    ],
    "FIPS AU means Austria; ISO AU means Australia": [
      [countryFlagFromSidc(legacy + "AU-", "app6a"),
        countryFlagFromSidc(legacy + "AU-", "2525c")],
      ["at", "au"]
    ],
    "do not fall back from FIPS to ISO or vice versa": [
      [countryFlagFromSidc(legacy + "TR-", "app6a"),
        countryFlagFromSidc(legacy + "TU-", "2525c")],
      ["", ""]
    ],
    "blank, partial, unknown and wrong-family codes produce no flag": [
      [legacy + "---", legacy + "ZZ-", legacy + "T", modern,
        modern + "792", modern + "0000000999"].map((sidc) =>
        countryFlagFromSidc(sidc, /^\d/.test(sidc) ? "app6d" : "app6a")),
      ["", "", "", "", "", ""]
    ],
    "numeric country leading zeros are significant": [
      countryFlagFromSidc(modern + "0040000000", "app6d"), "af"
    ],
    "selecting Turkey changes only legacy country and preserves OOB": [
      withCountryFlag(legacy + "USG", "tr", "app6a"), legacy + "TUG"
    ],
    "modern country update preserves all other extension digits": [
      withCountryFlag(extended, "de", "app6e"), extended.slice(0, 27) + "276"
    ],
    "20-digit SIDC expands to 30 digits when selecting a country": [
      withCountryFlag(modern, "tr", "app6d"), modern + "7920000000"
    ],
    "removing the flag clears only country digits": [
      [withCountryFlag(extended, "", "2525e"),
        withCountryFlag(legacy + "TUG", "", "app6a")],
      [extended.slice(0, 27) + "000", legacy + "--G"]
    ],
    "a flag with no code clears a stale country": [
      withCountryFlag(dExtended, "eu", "app6d"), modern + "0001234276"
    ],
    "APP6B and all numeric editions use the appropriate mapping": [
      [withCountryFlag(legacy + "---", "tr", "app6b"),
        ...["app6d", "2525d"].map((standard) => countryFlagFromSidc(dExtended, standard)),
        ...["app6e", "2525e"].map((standard) => countryFlagFromSidc(extended, standard))],
      [legacy + "TU-", "tr", "tr", "tr", "tr"]
    ],
    "D editions read originator country while E editions read nationality": [
      [countryFlagFromSidc(dExtended, "app6d"), countryFlagFromSidc(dExtended, "2525d"),
        countryFlagFromSidc("13" + dExtended.slice(2), "2525e")],
      ["tr", "tr", "de"]
    ],
    "D edition country edits preserve originator symbol set and all six national digits": [
      withCountryFlag(dExtended, "de", "app6d"), modern + "2761234276"
    ],
    "removing a D edition country preserves all other national data": [
      withCountryFlag(dExtended, "", "2525d"), modern + "0001234276"
    ],
    "last three D edition digits are never a fallback country": [
      countryFlagFromSidc(modern + "0000000792", "app6d"), ""
    ],
    "codes outside ISO 3166-1 follow FIPS 10-4 and GENC only": [
      // app6a, app6b, 2525c, app6d, app6e, 2525d, 2525e
      [codesFor("xk"), codesFor("cp"), codesFor("dg"), codesFor("xx")],
      [["KV", "KV", "", "", "901", "", "901"],
        ["IP", "IP", "", "", "905", "", "905"],
        ["", "", "", "", "908", "", "908"],
        ["", "", "", "", "932", "", "932"]]
    ],
    "GENC codes are read back only in edition E": [
      [countryFlagFromSidc(legacy + "KV-", "app6a"), countryFlagFromSidc(legacy + "XK-", "2525c"),
        countryFlagFromSidc(modern + "9010000000", "app6d"), countryFlagFromSidc(extended.slice(0, 27) + "901", "2525e")],
      ["xk", "", "", "xk"]
    ],
    "composite ISO entries have no FIPS code and their parts no flag": [
      [codesFor("ps"), codesFor("sj"), codesFor("um"),
        ["GZ", "WE", "SV", "JN"].map((code) => countryFlagFromSidc(legacy + code + "-", "app6a"))],
      [["", "", "PS", "275", "", "275", ""],
        ["", "", "SJ", "744", "", "744", ""],
        ["", "", "UM", "581", "", "581", ""],
        ["", "", "", ""]]
    ],
    "Åland has an ISO code but none in FIPS or GENC": [
      codesFor("ax"), ["", "", "AX", "248", "", "248", ""]
    ],
    "flags with no code in each list": [
      ["app6a", "2525c", "app6d", "2525e"].map(uncoded),
      [["arab", "asean", "ax", "bq", "cefta", "dg", "eac", "es-ct", "es-ga", "es-pv", "eu", "gb-eng", "gb-nir", "gb-sct", "gb-wls", "ic", "nato", "pc", "ps", "sh-ac", "sh-hl", "sh-ta", "sj", "um", "un", "xx"],
        ["arab", "asean", "cefta", "cp", "dg", "eac", "es-ct", "es-ga", "es-pv", "eu", "gb-eng", "gb-nir", "gb-sct", "gb-wls", "ic", "nato", "pc", "sh-ac", "sh-hl", "sh-ta", "un", "xk", "xx"],
        ["arab", "asean", "cefta", "cp", "dg", "eac", "es-ct", "es-ga", "es-pv", "eu", "gb-eng", "gb-nir", "gb-sct", "gb-wls", "ic", "nato", "pc", "sh-ac", "sh-hl", "sh-ta", "un", "xk", "xx"],
        ["arab", "asean", "ax", "cefta", "eac", "es-ct", "es-ga", "es-pv", "eu", "gb-eng", "gb-nir", "gb-sct", "gb-wls", "ic", "nato", "pc", "ps", "sh-ac", "sh-hl", "sh-ta", "sj", "um", "un"]]
    ],
    "invalid inputs are preserved rather than rewritten": [
      withCountryFlag("not-a-sidc", "tr", "app6d"), "not-a-sidc"
    ]
  }
};
