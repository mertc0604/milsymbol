import {
  fieldStates,
  formatDtg,
  evaluationRating,
  sidcParts,
  pushRecent,
  placeholderOptions
} from "../studio/editor-helpers.js";
import { fieldReference } from "../studio/field-reference.js";
import { textModifiers } from "../studio/modifier-fields.js";
import {
  app6aTextFields,
  app6aSymbolClass,
  getApp6aFields
} from "../src/lettersidc/metadata.js";

const app6aContext = (sidc) => ({
  available: getApp6aFields(sidc),
  table: app6aTextFields,
  kind: app6aSymbolClass(sidc),
  identity: sidc[1]
});
const byKey = (states) =>
  Object.fromEntries(states.map((state) => [state.key, state]));

const unit = byKey(fieldStates(textModifiers, app6aContext("SFGPUCI--------")));
const equipment = byKey(
  fieldStates(textModifiers, app6aContext("SFGPEVATM------"))
);
const hostileEquipment = byKey(
  fieldStates(textModifiers, app6aContext("SHGPEVATM------"))
);
const modern = fieldStates(textModifiers, null);
const placeholders = placeholderOptions(
  fieldStates(textModifiers, app6aContext("SFGPUCI--------")),
  { uniqueDesignation: "", higherFormation: "23 BDE" }
);

export default {
  "Studio editor helpers": {
    "DTG uses DDHHMMZMONYY in UTC": [
      formatDtg(new Date(Date.UTC(2026, 10, 2, 14, 35))),
      "021435ZNOV26"
    ],
    "evaluation rating joins reliability and credibility": [
      evaluationRating("b", "2"),
      "B2"
    ],
    "evaluation rating rejects an unknown reliability": [
      evaluationRating("G", "2"),
      ""
    ],
    "APP-6A unit: quantity is equipment only": [
      [unit.quantity.available, unit.quantity.reason],
      [false, "Equipment only"]
    ],
    "APP-6A unit: higher formation keeps the publication limit": [
      [unit.higherFormation.available, unit.higherFormation.maxLength],
      [true, 21]
    ],
    "APP-6A unit: platform type is not in APP-6A": [
      unit.platformType.reason,
      "Not in APP-6A"
    ],
    "APP-6A equipment: quantity applies": [
      [equipment.quantity.available, equipment.quantity.maxLength],
      [true, 9]
    ],
    "APP-6A equipment: higher formation is units only": [
      equipment.higherFormation.reason,
      "Units only"
    ],
    "APP-6A friend equipment: signature needs a hostile identity": [
      equipment.signatureEquipment.reason,
      "Hostile or suspect only"
    ],
    "APP-6A hostile equipment: signature applies": [
      hostileEquipment.signatureEquipment.available,
      true
    ],
    "other standards: every field is available without a limit": [
      modern.every((state) => state.available && state.maxLength === null && !state.reason),
      true
    ],
    "field states follow the form order": [
      modern.map((state) => state.key),
      textModifiers.map((field) => field.key)
    ],
    "letter SIDC parts keep the existing breakdown": [
      sidcParts("SFGPUCI----F---", false).map((part) => [part.label, part.value]),
      [
        ["Scheme", "S"],
        ["Identity", "F"],
        ["Dimension", "G"],
        ["Status", "P"],
        ["Function", "UCI---"],
        ["Modifiers", "-F"],
        ["Country", "--"],
        ["OOB", "-"]
      ]
    ],
    "edition D number SIDC parts include the originator": [
      sidcParts("100310001612110000007920000000", true).map((part) => part.label),
      ["Version", "Identity", "Set", "Amplifier", "Entity", "Modifiers", "Originator country", "Originator set", "National data"]
    ],
    "edition E number SIDC parts include frame shape and country": [
      sidcParts("130310001612110000000030000792", false).map((part) => [part.label, part.value]).slice(6),
      [["Ext.", "00"], ["Frame shape", "3"], ["Other ext.", "0000"], ["Country", "792"]]
    ],
    "recent list moves a symbol to the front once": [
      pushRecent(["a", "b", "c"], "b"),
      ["b", "a", "c"]
    ],
    "recent list keeps at most eight symbols": [
      pushRecent(["1", "2", "3", "4", "5", "6", "7", "8"], "9"),
      ["9", "1", "2", "3", "4", "5", "6", "7"]
    ],
    "placeholders tag empty available fields with their code": [
      [placeholders.options.uniqueDesignation, placeholders.codes["[T]"]],
      ["[T]", "uniqueDesignation"]
    ],
    "placeholders leave filled and unavailable fields alone": [
      ["higherFormation" in placeholders.options, "quantity" in placeholders.options],
      [false, false]
    ],
    "reference tables cover the rating, engagement, DTG and location fields": [
      ["evaluationRating", "engagementBar", "dtg", "location"].every(
        (key) => Boolean(fieldReference[key]) && fieldReference[key].rows.length > 0
      ),
      true
    ],
    "evaluation reference lists six reliability and six credibility codes": [
      fieldReference.evaluationRating.rows.length,
      12
    ]
  }
};
