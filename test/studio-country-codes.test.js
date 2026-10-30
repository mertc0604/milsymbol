import { countryCodeForFlag, countryFlagFromSidc, withCountryFlag } from "../studio/country-codes.js";
import { countryCodes } from "../studio/country-code-data.js";

const legacy = "SFGPUCI-----";
const modern = "10031000001211000000";
const extended = "130310000012110000001234567792";
const dExtended = modern + "7921234276";

export default {
  "Studio SIDC country codes": {
    "every encodable country round-trips without changing identity": [
      countryCodes.every(([flag]) => ["app6a", "app6b", "2525c", "app6d", "app6e", "2525d", "2525e"]
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
    "unsupported display-only flag clears stale country": [
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
    "invalid inputs are preserved rather than rewritten": [
      withCountryFlag("not-a-sidc", "tr", "app6d"), "not-a-sidc"
    ]
  }
};
