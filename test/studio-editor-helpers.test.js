import {
  fieldStates,
  formatDtg,
  evaluationRating,
  sidcParts,
  pushRecent,
  placeholderOptions,
  readTextRows,
  fieldValueChars,
  fitRowWidths,
  layoutFieldBoxes,
  paletteProgress
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

// Field positions: rows of a probe rendering, in symbol units. The "?" row has
// no marker and is not a field row.
const probeRows = readTextRows(
  [
    { x: 5, y: 80, anchor: "end", fontSize: 40, middle: false, content: "[X]/[Y]" },
    { x: 100, y: 103, anchor: "middle", fontSize: 33, middle: true, content: "[AA]" },
    { x: 195, y: 40, anchor: "start", fontSize: 40, middle: false, content: "[F]" },
    { x: 100, y: 20, anchor: "middle", fontSize: 40, middle: false, content: "?" }
  ],
  { "[X]": "altitudeDepth", "[Y]": "location", "[AA]": "specialHeadquarters", "[F]": "reinforcedReduced" }
);
const sideBoxes = layoutFieldBoxes(
  [
    { anchor: "end", x: 100, y: 50, keys: ["altitudeDepth", "location"] },
    { anchor: "start", x: 200, y: 50, keys: ["staffComments"] }
  ],
  { altitudeDepth: 60, location: 80, staffComments: 90 },
  { height: 30, gap: 6 }
);
// AO centred above the frame, too wide for the room between W and F at its
// height: past them is less than a row away, so it moves up there.
const movedBox = layoutFieldBoxes(
  [
    { anchor: "end", x: 40, y: 20, keys: ["dtg"] },
    { anchor: "start", x: 160, y: 20, keys: ["reinforcedReduced"] },
    { anchor: "middle", x: 100, y: 20, keys: ["engagementBar"] }
  ],
  { dtg: 80, reinforcedReduced: 80, engagementBar: 120 },
  { height: 30, gap: 6, center: 100 }
);
// With another side row above, the way out is more than a row: AO narrows.
const narrowedBox = layoutFieldBoxes(
  [
    { anchor: "end", x: 40, y: 20, keys: ["dtg"] },
    { anchor: "start", x: 160, y: 20, keys: ["reinforcedReduced"] },
    { anchor: "end", x: 40, y: -18, keys: ["specialDesignator"] },
    { anchor: "middle", x: 100, y: 20, keys: ["engagementBar"] }
  ],
  { dtg: 80, reinforcedReduced: 80, specialDesignator: 80, engagementBar: 120 },
  { height: 30, gap: 6, center: 100 }
);
// AO and C both centred above the frame: C, nearer the centre, keeps its
// place and AO moves up past it.
const stackedBoxes = layoutFieldBoxes(
  [
    { anchor: "middle", x: 100, y: 20, keys: ["engagementBar"] },
    { anchor: "middle", x: 100, y: 22, keys: ["quantity"] }
  ],
  { engagementBar: 120, quantity: 70 },
  { height: 30, gap: 6, center: 100 }
);
const sideRow = (anchor, keys) => ({ anchor, x: 0, y: 0, keys });
const crowded = [sideRow("end", ["type", "platformType", "commonIdentifier"]), sideRow("start", ["evaluationRating", "combatEffectiveness", "signatureEquipment", "hostile", "iffSif"])];
const crowdedFit = fitRowWidths(
  crowded,
  { type: 100, platformType: 101, commonIdentifier: 114, evaluationRating: 71, combatEffectiveness: 110, signatureEquipment: 107, hostile: 75, iffSif: 75 },
  { room: 752, between: 175 }
);
const rowSpan = (row, widths) => row.keys.reduce((sum, key) => sum + widths[key], 0) + 8 * (row.keys.length - 1);

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
      "Hostile (H) only"
    ],
    "APP-6A suspect equipment: signature needs identity H": [
      byKey(fieldStates(textModifiers, app6aContext("SSGPEVATM------")))
        .signatureEquipment.reason,
      "Hostile (H) only"
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
    "field rows keep their anchor, centre line and field order": [
      probeRows,
      [
        { anchor: "end", x: 5, y: 66, keys: ["altitudeDepth", "location"] },
        { anchor: "middle", x: 100, y: 103, keys: ["specialHeadquarters"] },
        { anchor: "start", x: 195, y: 26, keys: ["reinforcedReduced"] }
      ]
    ],
    "boxes grow away from the anchor, one gap apart": [
      sideBoxes,
      [
        { key: "altitudeDepth", left: -46, top: 35, width: 60, height: 30 },
        { key: "location", left: 20, top: 35, width: 80, height: 30 },
        { key: "staffComments", left: 200, top: 35, width: 90, height: 30 }
      ]
    ],
    "a centred box too wide beside the side rows moves past them": [
      movedBox[2],
      { key: "engagementBar", left: 40, top: -28, width: 120, height: 30 }
    ],
    "a centred box that cannot get past the side rows within a row narrows": [
      narrowedBox[3],
      { key: "engagementBar", left: 46, top: 5, width: 108, height: 30 }
    ],
    "a centred box moves away from a box it meets": [
      stackedBoxes,
      [
        { key: "quantity", left: 65, top: 7, width: 70, height: 30 },
        { key: "engagementBar", left: 40, top: -29, width: 120, height: 30 }
      ]
    ],
    "rows that fit keep their widths": [
      fitRowWidths([sideRow("end", ["dtg"]), sideRow("start", ["staffComments"])], { dtg: 100, staffComments: 100 }, { room: 400, between: 100 }),
      { dtg: 100, staffComments: 100 }
    ],
    "the narrower side keeps its boxes; the wider boxes of the other give up most": [
      fitRowWidths([sideRow("end", ["dtg"]), sideRow("start", ["staffComments", "evaluationRating"])], { dtg: 100, staffComments: 200, evaluationRating: 100 }, { room: 400, between: 100 }),
      { dtg: 100, staffComments: 119, evaluationRating: 72 }
    ],
    "crowded rows on both sides share the room and keep the minimum width": [
      [
        rowSpan(crowded[0], crowdedFit) + rowSpan(crowded[1], crowdedFit) <= 752 - 175,
        Object.values(crowdedFit).every((width) => width >= 48)
      ],
      [true, true]
    ],
    "a crowded row gives up the widest name first and keeps the value room": [
      fitRowWidths(
        [sideRow("end", ["dtg"]), sideRow("start", ["staffComments", "evaluationRating", "combatEffectiveness"])],
        { dtg: 100, staffComments: 140, evaluationRating: 70, combatEffectiveness: 150 },
        { room: 500, between: 100, plain: { dtg: 100, staffComments: 120, evaluationRating: 50, combatEffectiveness: 70 } }
      ),
      { dtg: 100, staffComments: 140, evaluationRating: 70, combatEffectiveness: 70 }
    ],
    "crowded rows on both sides give up names in turn, the wider side first": [
      fitRowWidths(
        [sideRow("end", ["type", "platformType"]), sideRow("start", ["staffComments", "additionalInformation"])],
        { type: 200, platformType: 150, staffComments: 200, additionalInformation: 150 },
        { room: 600, between: 100, plain: { type: 100, platformType: 80, staffComments: 100, additionalInformation: 80 } }
      ),
      { type: 100, platformType: 80, staffComments: 100, additionalInformation: 150 }
    ],
    "with every name given up, a row still too long narrows its values": [
      fitRowWidths(
        [sideRow("end", ["dtg"]), sideRow("start", ["staffComments", "evaluationRating"])],
        { dtg: 100, staffComments: 200, evaluationRating: 100 },
        { room: 400, between: 100, plain: { dtg: 100, staffComments: 180, evaluationRating: 60 } }
      ),
      { dtg: 100, staffComments: 136, evaluationRating: 56 }
    ],
    "rows that cannot fit even at the minimum width give null": [
      fitRowWidths(crowded, { type: 100, platformType: 100, commonIdentifier: 100, evaluationRating: 100, combatEffectiveness: 100, signatureEquipment: 100, hostile: 100, iffSif: 100 }, { room: 500, between: 100 }),
      null
    ],
    "a box makes room for a usual value, never more than the field's limit": [
      [
        fieldValueChars({ key: "uniqueDesignation", maxLength: 21 }),
        fieldValueChars({ key: "uniqueDesignation", maxLength: 6 }),
        fieldValueChars({ key: "somethingNew", maxLength: null })
      ],
      [16, 6, 10]
    ],
    // W and Y formats differ by edition (studio/field-guide.js), so they have
    // no shared code table.
    "code tables cover the rating and engagement fields only": [
      Object.keys(fieldReference).filter(
        (key) => fieldReference[key].rows.length > 0
      ),
      ["evaluationRating", "engagementBar"]
    ],
    "evaluation reference lists six reliability and six credibility codes": [
      fieldReference.evaluationRating.rows.length,
      12
    ],
    "palette status counts loaded symbols while more remain": [
      paletteProgress(40, 1589),
      "Showing 40 of 1,589"
    ],
    "palette status says when every symbol is loaded": [
      paletteProgress(713, 713),
      "All 713 symbols shown"
    ],
    "palette status uses the singular for one symbol": [
      paletteProgress(1, 1),
      "1 symbol shown"
    ],
    "palette status is empty when nothing matches": [
      paletteProgress(0, 0),
      ""
    ]
  }
};
