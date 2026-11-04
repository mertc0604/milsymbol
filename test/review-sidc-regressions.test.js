import { ms, std2525e } from "../index.mjs";
import { app6eProfile } from "../src/modifierprofiles/app6e.js";
import { std2525eProfile } from "../src/modifierprofiles/std2525e.js";
import { fieldGuide } from "../studio/field-guide.js";
import { identityList, identityLabel, convertIdentity } from "../studio/identities.js";

ms.reset();
ms.addIcons(std2525e);

const core = "031000001211000000";
const unknownVersions = {};
for (const standard of ["2525", "APP6"]) {
  for (const version of ["00", "17", "99"]) {
    for (const hidden of [false, true]) {
      const symbol = new ms.Symbol(version + core, {
        standard,
        ...(hidden ? { frame: false, icon: false, infoFields: false } : {})
      });
      unknownVersions[`${standard} ${version} hidden ${hidden}`] = {
        "cannot pass validation": [symbol.isValid(), false],
        "explains unsupported version": [
          (symbol.isValid(true).sidcErrors || []).some(error => /version/i.test(error) && error.includes(version)),
          true
        ],
        "retains permissive SVG rendering": [symbol.asSVG().startsWith("<svg"), true]
      };
    }
  }
}
for (const version of ["10", "11", "12", "13", "14", "15", "16"]) {
  unknownVersions[`known ${version}`] = [new ms.Symbol(version + core, { standard: "2525" }).isValid(), true];
}
const invalidStatus = new ms.Symbol("99031090141211000000", { standard: "2525" });
unknownVersions["unknown version cannot bypass the status check"] = [invalidStatus.isValid(), false];
invalidStatus.setOptions({ sidc: "13031000001211000000" });
unknownVersions["editing to a known valid version recovers"] = [invalidStatus.isValid(), true];
invalidStatus.setOptions({ sidc: "99031000001211000000" });
unknownVersions["editing back to unknown cannot reuse earlier validation"] = [invalidStatus.isValid(), false];

const exercises = {};
const texts = symbol => [...symbol.asSVG().matchAll(/<text[^>]*>(.*?)<\/text>/g)].map(match => match[1]);
const studioStandard = { id: "2525e", family: "modern" };
const app6a = { id: "app6a", family: "legacy" };
for (const [version, standard] of [["13", "2525"], ["16", "APP6"]]) {
  for (const [digit, value, marker] of [["5", "suspect", "J"], ["6", "hostile", "K"]]) {
    for (const context of ["1", "5", "6"]) {
      const symbol = new ms.Symbol(`${version}${context}${digit}1000001211000000`, { standard });
      exercises[`${standard} identity ${digit} context ${context}`] = {
        "valid exercise symbol": [symbol.isValid(), true],
        "keeps the exercise identity and frame": [
          [symbol.metadata.context, symbol.metadata.affiliation, symbol.metadata.joker, symbol.metadata.faker],
          ["Exercise", "Friend", digit === "5", digit === "6"]
        ],
        "uses the J/K descriptor": [texts(symbol).filter(text => ["J", "K", "X"].includes(text)), [marker]],
        "preserves restricted/no-strike markers": [
          [Boolean(symbol.metadata.restrictedTarget), Boolean(symbol.metadata.noStrike)],
          [context === "5", context === "6"]
        ],
        "Studio labels the resolved exercise identity": [
          identityLabel(identityList(studioStandard).find(entry => entry.value === value), context),
          digit === "5" ? "Joker" : "Faker"
        ],
        "APP-6A conversion retains Joker/Faker": [
          convertIdentity({ value, context }, app6a),
          { value: digit === "5" ? "joker" : "faker", context: "0" }
        ]
      };
    }
    for (const context of ["0", "2", "3", "4", "7", "8"]) {
      const symbol = new ms.Symbol(`${version}${context}${digit}1000001211000000`, { standard });
      exercises[`${standard} non-exercise ${digit}/${context}`] = [
        [symbol.metadata.affiliation, symbol.metadata.joker, symbol.metadata.faker],
        ["Hostile", false, false]
      ];
    }
  }
}

// APP-6(E) Table 1-5 PDF 87/53: AS is alphanumeric {3,3}; its
// geographical entity code list is outside the publication's scope.
const asField = {};
const warnings = (profile, value) => profile.validate("16031000001211000000", { country: value })
  .details.fieldWarnings.filter(warning => warning.key === "country");
for (const value of ["792", "A1B", "TUR"]) {
  asField[`APP-6E accepts alphanumeric ${value}`] = [warnings(app6eProfile, value), []];
}
for (const value of ["AB", "ABCD", "A!B"]) {
  asField[`APP-6E warns about malformed ${value}`] = [warnings(app6eProfile, value).length > 0, true];
}
asField["MIL-2525E retains its three-letter rule"] = [warnings(std2525eProfile, "792").length > 0, true];
asField["APP-6E help names its own format"] = [
  fieldGuide("app6e", "landUnit", { key: "country", description: "Country text" }).description.includes("alphanumeric"),
  true
];

export default {
  "Review R1 unsupported numeric versions": unknownVersions,
  "Review R2 restricted exercise identities": exercises,
  "Review R8 APP-6E geographical entity format": asField
};
