// Placement and rules of the APP-6(B), MIL-STD-2525D, MIL-STD-2525E and APP-6(E)
// profiles. The expected rows are copied by hand from the placement figures of
// each publication (citations in docs/edition-modifiers.md), and compared with
// what the renderer draws, so a wrong profile table fails here.
import { ms, app6b, app6d, std2525c, std2525d, std2525e } from "../index.mjs";
import { fieldKeys } from "../src/modifierprofiles/fieldtable.js";
import { app6bProfile } from "../src/modifierprofiles/app6b.js";
import { app6eProfile } from "../src/modifierprofiles/app6e.js";
import { std2525dProfile } from "../src/modifierprofiles/std2525d.js";
import { std2525eProfile } from "../src/modifierprofiles/std2525e.js";
import {
  editionField,
  editorGaps,
  movementControls,
  probeOffers,
  patchSidc
} from "../studio/profile-controls.js";
import { numericSidcEdition } from "../studio/sidc-editor.js";

ms.reset();
ms.addIcons(app6b);
ms.addIcons(std2525c);
ms.addIcons(app6d);
ms.addIcons(std2525d);
ms.addIcons(std2525e);

const codes = Object.keys(fieldKeys);
const allFields = (extra) => {
  const options = {};
  codes.forEach((code) => {
    options[fieldKeys[code]] = code;
  });
  // AO is a bar with its own text, not a row.
  options.engagementBar = "";
  return Object.assign(options, extra || {});
};

// What the renderer drew: {left, right, centre} as row texts, top to bottom.
function drawn(sidc, standard, extra) {
  const svg = new ms.Symbol(sidc, allFields(extra), {
    standard,
    icon: false
  }).asSVG();
  const found = [
    ...svg.matchAll(
      /<text[^>]*?x="([^"]+)"[^>]*?y="([^"]+)"[^>]*?text-anchor="(\w+)"[^>]*>([^<]*)<\/text>/g
    )
  ].map((match) => ({
    y: Number(match[2]),
    anchor: match[3],
    text: match[4]
  }));
  const side = (anchor) =>
    found
      .filter((item) => item.anchor === anchor)
      .sort((a, b) => a.y - b.y)
      .map((item) => item.text);
  return { left: side("end"), right: side("start"), centre: side("middle") };
}

const figures = {
  "2525D Figure C-3 air": [
    "10030100001101000000",
    "2525",
    [],
    ["T", "P", "V", "Z X", "G H"],
    []
  ],
  "2525D Figure B-3 space": [
    "10030500001101000000",
    "2525",
    [],
    ["T", "V", "Z X", "G H"],
    []
  ],
  "2525D Figure D-4 land unit": [
    "10031000001211000000",
    "2525",
    ["W", "X Y", "T", "Z"],
    ["F AS", "G", "H", "M", "J K P"],
    ["AA"]
  ],
  "2525D Figure D-5 land equipment": [
    "10031500001101000000",
    "2525",
    ["W AR", "X Y", "V AD AE", "T", "Z"],
    ["G AQ", "H AF", "J L N P"],
    ["C"],
    { hostile: "N" }
  ],
  "2525D Figure D-6 land installation": [
    "10032000001101000000",
    "2525",
    ["W", "X Y", "T"],
    ["G", "H", "J K P"],
    []
  ],
  "2525D Figure E-2 sea surface": [
    "10033000001201000000",
    "2525",
    ["AQ AR"],
    ["T", "V", "P", "G H", "Y Z"],
    []
  ],
  "2525D Figure F-3 sea subsurface": [
    "10033500001101000000",
    "2525",
    ["AR"],
    ["T", "V", "X", "G", "H"],
    []
  ],
  "2525D Figure G-2 activities": [
    "10034000001101000000",
    "2525",
    ["W", "Y"],
    ["AS", "G", "H", "J"],
    []
  ],
  "2525D Figure L-2 cyberspace": [
    "10036000001101000000",
    "2525",
    ["W", "Y", "T V"],
    ["F AS", "G", "H", "M", "K L"],
    []
  ],
  "2525E Figure D-3 air": [
    "13030100001101000000",
    "2525",
    ["W", "AR", "AD"],
    ["AS", "T Y", "V AF", "P X Z", "G H J"],
    ["C"]
  ],
  "2525E Figure C-2 space": [
    "13030500001101000000",
    "2525",
    ["W", "AR", "AD"],
    ["AS", "T Y", "V AF", "P X Z", "G H J"],
    ["C"]
  ],
  "2525E Figure E-3 land unit": [
    "13031000001211000000",
    "2525",
    ["W AR", "X Y", "V AD AE", "C T", "Z"],
    ["F AS", "G AQ", "H AF", "M", "J K L P"],
    ["AA", "AW"]
  ],
  "2525E Figure E-4 land equipment": [
    "13031500001101000000",
    "2525",
    ["W", "X Y", "V AD AE", "C T", "Z"],
    ["AS", "G AQ", "H AF", "J K L N P"],
    []
  ],
  "2525E Figure E-5 land installation": [
    "13032000001101000000",
    "2525",
    ["W", "X Y", "C AE AX", "T"],
    ["AS", "G AQ", "H", "M", "J K P"],
    ["AA"]
  ],
  "2525E Figure F-2 dismounted individual": [
    "13032700001101000000",
    "2525",
    ["W", "X Y", "V AF", "T", "Z"],
    ["AS", "G", "H", "M", "J K P"],
    ["C"]
  ],
  "2525E Figure G-2 sea surface": [
    "13033000001201000000",
    "2525",
    ["AQ AR"],
    ["AS", "T", "V", "P", "G H", "Y Z"],
    []
  ],
  "2525E Figure H-3 sea subsurface": [
    "13033500001101000000",
    "2525",
    ["AR", "X"],
    ["AS", "T", "V", "P", "G H", "Y Z"],
    []
  ],
  "2525E Figure I-2 activities": [
    "13034000001101000000",
    "2525",
    ["W", "Y", "C"],
    ["AS", "T", "G", "H", "J"],
    []
  ],
  "2525E Figure K-2 cyberspace": [
    "13036000001101000000",
    "2525",
    ["W", "Y", "V", "T"],
    ["F AS", "G", "H", "M", "K L"],
    []
  ],
  "2525E 5.3.7 mine warfare has no amplifiers": [
    "13033600001101000000",
    "2525",
    [],
    [],
    []
  ],
  "APP-6(E) Figure 2-2 air": [
    "16030100001101000000",
    "APP6",
    [],
    ["T AS", "P", "V", "Z X", "G H"],
    []
  ],
  "APP-6(E) Figure 6-2 space": [
    "16030500001101000000",
    "APP6",
    [],
    ["T AS", "V", "Z X", "G H"],
    []
  ],
  "APP-6(E) Figure 3-3 land unit": [
    "16031000001211000000",
    "APP6",
    ["AR W", "X Y", "V AD AE", "T", "Z"],
    ["F AS", "G", "H AF", "M", "J K P"],
    ["C", "AA", "AW"]
  ],
  "APP-6(E) Figure 3-9 land equipment": [
    "16031500001101000000",
    "APP6",
    ["W", "X Y", "V AD AF", "T", "Z"],
    ["AS", "G", "H AE", "M", "J K L N P"],
    ["C"]
  ],
  "APP-6(E) Figure 3-13 land installation": [
    "16032000001101000000",
    "APP6",
    ["W", "X Y", "AX", "T"],
    ["AS", "G", "H AE", "M", "J K AT"],
    []
  ],
  "APP-6(E) Figure 4-3 dismounted individual": [
    "16032700001101000000",
    "APP6",
    ["W", "X Y", "V AF", "T", "Z"],
    ["AS", "G", "H", "M", "J K P"],
    ["C"]
  ],
  "APP-6(E) Figure 5-3 sea surface": [
    "16033000001201000000",
    "APP6",
    ["AQ AR"],
    ["T AS", "V", "P", "G H", "Y Z"],
    []
  ],
  "APP-6(E) Figure 5-6 sea subsurface": [
    "16033500001101000000",
    "APP6",
    ["AR"],
    ["T AS", "V", "P X", "G H", "Y Z"],
    []
  ],
  "APP-6(E) Figure 7-2 activities": [
    "16034000001101000000",
    "APP6",
    ["W", "Y", "T"],
    ["AS", "G", "H", "J"],
    []
  ],
  "APP-6(E) Figure 9-2 cyberspace unit": [
    "16036000001101000000",
    "APP6",
    ["AR W", "Y", "V AD AE", "T", "AY"],
    ["F AS", "G", "H AF", "M", "K L P"],
    ["C", "AA", "AW"]
  ],
  "APP-6(B) Figure 5 land unit": [
    "SFGPUCI--------",
    "APP6",
    ["W", "X Y", "T", "Z"],
    ["F", "G", "H", "M", "J K P"],
    ["AA"]
  ],
  "APP-6(B) Figure 5 land equipment": [
    "SHGPEWM--------",
    "APP6",
    ["W", "X Y", "V", "T", "Z"],
    ["G", "H", "J L N P"],
    ["C"],
    { signatureEquipment: "L" }
  ],
  "APP-6(B) Figure 5 land installation": [
    "SFGPIB---------",
    "APP6",
    ["W", "X Y", "T", "Z"],
    ["G", "H", "J K P"],
    []
  ],
  "APP-6(B) Figure 5 air": [
    "SFAPMF---------",
    "APP6",
    ["W", "X Y", "V", "T", "Z"],
    ["G", "H", "J N P"],
    ["C"]
  ]
};

const placement = {};
Object.keys(figures).forEach((name) => {
  const [sidc, standard, left, right, centre, extra] = figures[name];
  const result = drawn(sidc, standard, extra);
  placement[name + " left"] = [result.left, left];
  placement[name + " right"] = [result.right, right];
  placement[name + " top, inner and bottom"] = [result.centre, centre];
});

const errors = (profile, sidc, options) =>
  profile.validate(sidc, options).details.modifierErrors;
const valid = (sidc, options, standard) =>
  new ms.Symbol(sidc, options || {}, { standard: standard }).isValid();
const yOf = (sidc, standard, options, text) => {
  const svg = new ms.Symbol(sidc, options, { standard }).asSVG();
  const match = svg.match(
    new RegExp('<text[^>]*?y="([^"]+)"[^>]*>' + text + "</text>")
  );
  return match ? Number(match[1]) : null;
};
const flags = (profile, base, at, pad) =>
  probeOffers(
    profile,
    ["0", "1", "2", "4"],
    (digit) => patchSidc(base, at, digit, pad),
    base
  ).map((item) => item.offered);

export default {
  "Edition modifier placement": placement,
  "Edition selection": {
    "Table A-1: 14, 15 and 16 are edition E": [
      ["14", "15", "16"].map(
        (version) =>
          new ms.Symbol(version + "031000001211000000", { standard: "2525" })
            .metadata.edition
      ),
      ["E", "E", "E"]
    ],
    "the same code is 2525E or APP-6(E) by standard": [
      [
        new ms.Symbol("13031000001211000000", { standard: "2525" }).metadata
          .profile,
        new ms.Symbol("13031000001211000000", { standard: "APP6" }).metadata
          .profile
      ],
      ["2525e", "app6e"]
    ],
    "edition D stays 2525D or APP-6(D) by standard": [
      [
        new ms.Symbol("10031000001211000000", { standard: "2525" }).metadata
          .profile,
        new ms.Symbol("10031000001211000000", { standard: "APP6" }).metadata
          .profile
      ],
      ["2525d", "app6d"]
    ],
    "letter SIDCs with 2525 keep no APP-6(B) profile": [
      new ms.Symbol("SFGPUCI--------", { standard: "2525" }).metadata.profile,
      undefined
    ],
    "tactical graphics stay outside the APP-6(B) profile": [
      new ms.Symbol("GFGPGPUUD------", { standard: "APP6" }).metadata.profile,
      undefined
    ],
    "control measures stay outside the numeric profiles": [
      std2525eProfile.fields("13032500001101000000"),
      null
    ],
    "the Studio reads 15 and 16 as edition E": [
      ["15", "16", "13", "12"].map((code) => numericSidcEdition(code)),
      ["e", "e", "e", "d"]
    ]
  },
  "Separators and collapsed fields": {
    "APP-6(B) 0213.b joins J K with one space": [
      drawn("SFGPUCI--------", "APP6", {}).right.pop(),
      "J K P"
    ],
    "an empty field reserves no separator": [
      drawn("13031000001211000000", "2525", {
        evaluationRating: "",
        combatEffectiveness: "",
        signatureEquipment: ""
      }).right.pop(),
      "P"
    ],
    "a whitespace-only field is empty": [
      drawn("16031500001101000000", "APP6", { type: "  ", platformType: "AD" })
        .left[2],
      "AD AF"
    ]
  },
  "The E descriptor is drawn once": {
    "APP-6(B) Joker with other text: in the E row": [
      new ms.Symbol("SJGPUCI--------", {
        standard: "APP6",
        staffComments: "HELLO"
      })
        .asSVG()
        .match(/>J<\/text>/g).length,
      1
    ],
    "APP-6(B) Joker alone: by the frame": [
      new ms.Symbol("SJGPUCI--------", { standard: "APP6" })
        .asSVG()
        .match(/>J<\/text>/g).length,
      1
    ],
    "2525C exercise equipment with text": [
      new ms.Symbol("SGGPEWM--------", {
        standard: "2525C",
        staffComments: "HELLO"
      })
        .asSVG()
        .match(/>X<\/text>/g).length,
      1
    ]
  },
  "Fields of a class": {
    "2525D unit has no quantity (Table VII)": [
      errors(std2525dProfile, "10031000001211000000", { quantity: "3" }).length,
      1
    ],
    "2525E unit has a quantity (Table VI)": [
      errors(std2525eProfile, "13031000001211000000", { quantity: "3" }),
      []
    ],
    "2525D equipment takes AQ and AR": [
      errors(std2525dProfile, "10031500001101000000", {
        guardedUnit: "BG",
        specialDesignator: "NRT"
      }),
      []
    ],
    "2525D equipment has no AS (Table VII, Figure D-5)": [
      std2525dProfile.unavailableReason("country", "10031500001101000000") !==
        "",
      true
    ],
    "APP-6(E) installation has AT and AX": [
      errors(app6eProfile, "16032000001101000000", {
        installationCapacity: "400 BEDS",
        installationComposition: "PROD"
      }),
      []
    ],
    "APP-6(E) cyberspace unit has AY": [
      errors(app6eProfile, "16036000001101000000", {
        networkIdentifier: "192.168.25.0"
      }),
      []
    ],
    "2525E has no AT": [
      errors(std2525eProfile, "13032000001101000000", {
        installationCapacity: "400 BEDS"
      }).length,
      1
    ],
    "APP-6(B) has no engagement bar": [
      errors(app6bProfile, "SFGPUCI--------", { engagementBar: "ENG" }).length,
      1
    ],
    "APP-6(B) does not draw an engagement bar": [
      new ms.Symbol("SFGPUCI--------", {
        engagementBar: "ENGAGE",
        standard: "APP6"
      })
        .asSVG()
        .includes("ENGAGE"),
      false
    ],
    "APP-6(B) installation takes Z (Table I), 2525C does not": [
      errors(app6bProfile, "SFGPIB---------", { speed: "20KTS" }),
      []
    ],
    "APP-6(B) L is hostile only": [
      app6bProfile.unavailableReason("signatureEquipment", "SFGPEWM--------"),
      "L is for hostile equipment (identity H only)"
    ]
  },
  "Values and lengths": {
    "2525D T takes 30 characters": [
      errors(std2525dProfile, "10031000001211000000", {
        uniqueDesignation: "X".repeat(31)
      }).length,
      1
    ],
    "APP-6(B) T takes 21 characters": [
      errors(app6bProfile, "SFGPUCI--------", {
        uniqueDesignation: "X".repeat(22)
      }).length,
      1
    ],
    "APP-6(B) X takes 6 characters": [
      errors(app6bProfile, "SFGPUCI--------", { altitudeDepth: "1500 FT" })
        .length,
      1
    ],
    "2525D W accepts the short form of 5.3.7.7": [
      errors(std2525dProfile, "10031000001211000000", { dtg: "031430ZNOV26" }),
      []
    ],
    "2525E W needs a four-digit year": [
      errors(std2525eProfile, "13031000001211000000", { dtg: "031430ZNOV26" })
        .length,
      1
    ],
    "2525E Y accepts the 22-character example of Table E-II": [
      errors(std2525eProfile, "13031000001211000000", {
        location: "3317.0921N 04412.6332E"
      }),
      []
    ],
    "APP-6(E) Y has a minimum of 12": [
      errors(app6eProfile, "16031000001211000000", { location: "38SMB" })
        .length,
      1
    ],
    "F is one character in edition E, the bracket form is accepted": [
      [
        errors(std2525eProfile, "13031000001211000000", {
          reinforcedReduced: "+"
        }).length,
        errors(std2525eProfile, "13031000001211000000", {
          reinforcedReduced: "(+)"
        }).length,
        errors(std2525dProfile, "10031000001211000000", {
          reinforcedReduced: "+"
        }).length
      ],
      [0, 0, 1]
    ],
    "2525 and APP-6(E) read L differently": [
      [
        std2525eProfile.unavailableReason(
          "signatureEquipment",
          "13031500001101000000"
        ),
        app6eProfile.unavailableReason(
          "signatureEquipment",
          "16031500001101000000"
        )
      ],
      ["hostile symbols only", ""]
    ],
    "AO follows the A:BBB-CC grammar": [
      [
        errors(std2525dProfile, "10031000001211000000", {
          engagementBar: "R:ENG-M"
        }).length,
        errors(std2525dProfile, "10031000001211000000", {
          engagementBar: "NOPE"
        }).length
      ],
      [0, 1]
    ],
    "APP-6(E) writes MT where 2525 writes M<T": [
      [
        errors(app6eProfile, "16031000001211000000", {
          engagementBar: "R:MT-M"
        }).length,
        errors(std2525eProfile, "13031000001211000000", {
          engagementBar: "R:M<T-M"
        }).length
      ],
      [0, 0]
    ],
    "target colours apply to hostile tracks": [
      errors(std2525eProfile, "13031000001211000000", {
        engagementBar: "ENG",
        engagementType: "TARGET"
      }).filter((text) => /hostile/.test(text)).length,
      1
    ]
  },
  "SIDC digits": {
    "2525D unit has no operational condition": [
      [
        errors(std2525dProfile, "10031030001211000000").length,
        new ms.Symbol("10031030001211000000", { standard: "2525" }).metadata
          .condition
      ],
      [1, ""]
    ],
    "2525E and APP-6(E) units have one (Figures E-3, 3-3)": [
      [
        new ms.Symbol("13031030001211000000", { standard: "2525" }).metadata
          .condition,
        new ms.Symbol("16031030001211000000", { standard: "APP6" }).metadata
          .condition
      ],
      ["Damaged", "Damaged"]
    ],
    "APP-6(B) has status A and P only": [
      ["P", "A", "C", "D", "X", "F"].map(
        (status) => errors(app6bProfile, "SFG" + status + "UCI--------").length
      ),
      [0, 0, 1, 1, 1, 1]
    ],
    "APP-6(B) draws no condition bar": [
      new ms.Symbol("SFGDUCI--------", { standard: "APP6" }).metadata.condition,
      ""
    ],
    "2525D unit: feint, HQ, task force": [
      flags(std2525dProfile, "10031000001211000000", 7, "0"),
      [true, true, true, true]
    ],
    "2525D equipment: feint only": [
      flags(std2525dProfile, "10031500001101000000", 7, "0"),
      [true, true, false, false]
    ],
    "APP-6(E) air has no feint (Table 1-5 AB)": [
      flags(app6eProfile, "16030100001101000000", 7, "0"),
      [true, false, false, false]
    ],
    "2525D unit takes an echelon, not mobility": [
      [
        errors(std2525dProfile, "10031000161211000000").length,
        errors(std2525dProfile, "10031000331211000000").length
      ],
      [0, 1]
    ],
    "2525E unit takes mobility (Figure E-3)": [
      errors(std2525eProfile, "13031000331211000000"),
      []
    ],
    "leadership belongs to the dismounted individual": [
      [
        errors(std2525eProfile, "13032700711101000000").length,
        errors(std2525eProfile, "13031000711211000000").length
      ],
      [0, 1]
    ],
    "contexts 3-8 exist in edition E only": [
      [
        errors(std2525dProfile, "10331000001211000000").length,
        errors(std2525eProfile, "13331000001211000000").length,
        errors(app6eProfile, "16331000001211000000").length
      ],
      [1, 0, 0]
    ],
    "APP-6(B) task force is for units": [
      [
        errors(app6bProfile, "SFGPUCI---E----").length,
        errors(app6bProfile, "SFGPEWM---E----").length
      ],
      [0, 1]
    ],
    "APP-6(B) mobility is for equipment": [
      [
        errors(app6bProfile, "SFGPEWM---MO---").length,
        errors(app6bProfile, "SFGPUCI---MO---").length
      ],
      [0, 1]
    ]
  },
  "Graphic amplifiers": {
    "APP-6(B) has Q and no AJ": [
      (() => {
        const controls = movementControls(
          app6bProfile,
          "SFGPUCI--------",
          "APP-6(B) Table I"
        );
        return [controls.direction.applies, controls.speedLeader.applies];
      })(),
      [true, false]
    ],
    "2525D installations have no Q": [
      movementControls(std2525dProfile, "10032000001101000000").direction
        .applies,
      false
    ],
    "2525E air uses AJ": [
      movementControls(std2525eProfile, "13030100001101000000").speedLeader
        .applies,
      true
    ],
    "2525E land units use Q and not AJ (Table VI AJ)": [
      (() => {
        const controls = movementControls(
          std2525eProfile,
          "13031000001211000000"
        );
        return [controls.direction.applies, controls.speedLeader.applies];
      })(),
      [true, false]
    ]
  },
  "Restricted target and no-strike entity": {
    "contexts 3-8 keep their frame context": [
      ["3", "4", "5", "6", "7", "8"].map(
        (digit) =>
          new ms.Symbol("16" + digit + "31000001211000000", {
            standard: "APP6"
          }).metadata.context
      ),
      ["Reality", "Reality", "Exercise", "Exercise", "Simulation", "Simulation"]
    ],
    "APP-6(E) Figure 1-6 draws the triangle": [
      new ms.Symbol("16331000001211000000", { standard: "APP6" })
        .asSVG()
        .includes(">!</text>"),
      true
    ],
    "APP-6(E) Figure 1-7 draws the circle": [
      new ms.Symbol("16431000001211000000", { standard: "APP6" })
        .asSVG()
        .includes('r="22"'),
      true
    ],
    "2525E gives them no graphic": [
      new ms.Symbol("13331000001211000000", { standard: "2525" })
        .asSVG()
        .includes(">!</text>"),
      false
    ],
    "the mark stays inside the symbol box": [
      new ms.Symbol("16331000001211000000", { standard: "APP6" }).bbox.y1 <= 18,
      true
    ]
  },
  "Top of the frame": {
    "quantity sits above the echelon in APP-6(E)": [
      yOf("16031000161211000000", "APP6", { quantity: "12" }, "12") <
        yOf("16031000001211000000", "APP6", { quantity: "12" }, "12"),
      true
    ],
    "AO sits above the quantity in APP-6(E)": [
      yOf(
        "16031500001101000000",
        "APP6",
        { quantity: "12", engagementBar: "R:ENG-M" },
        "R:ENG-M"
      ) <
        yOf(
          "16031500001101000000",
          "APP6",
          { quantity: "12", engagementBar: "R:ENG-M" },
          "12"
        ),
      true
    ],
    "the dismounted quantity sits below the frame": [
      yOf("16032700001101000000", "APP6", { quantity: "12" }, "12") > 150,
      true
    ]
  },
  "Studio field tables": {
    "the edition's own name replaces the form's": [
      [
        editionField("2525e", "headquartersElement", {
          "2525e": [{ key: "headquartersElement", field: "AW", label: "x" }]
        }).field
      ],
      ["AW"]
    ],
    "map graphics are listed as gaps": [
      editorGaps({
        standardId: "2525d",
        profile: std2525dProfile,
        sidc: "10031000001211000000",
        tables: {},
        movement: null
      }).map((row) => row.field),
      ["S2", "AH", "AI", "AK"]
    ],
    "a symbol outside the profile lists no gaps": [
      editorGaps({
        standardId: "2525e",
        profile: std2525eProfile,
        sidc: "13032500001101000000",
        tables: {},
        movement: null
      }),
      []
    ]
  },
  "Valid symbols stay valid": {
    "no options": [
      [
        valid("10031000161211000000", {}, "2525"),
        valid("13031000161211000000", {}, "2525"),
        valid("16031000161211000000", {}, "APP6"),
        valid("SFGPUCI---F----", {}, "APP6")
      ],
      [true, true, true, true]
    ],
    "a full 2525D unit": [
      valid(
        "10031000161211000000",
        {
          uniqueDesignation: "1/23 INF",
          dtg: "03143000ZNOV2026",
          speed: "220KPH",
          reinforcedReduced: "(+)",
          evaluationRating: "A1",
          combatEffectiveness: "FO"
        },
        "2525"
      ),
      true
    ]
  }
};
