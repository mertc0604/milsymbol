// MIL-STD-2525C scheme S modifier profile. Expected values come from the
// standard: Table IV (PDF 28-30, printed 22-24), Table A-I (PDF 57, printed 51),
// Table A-II (PDF 58-60, printed 52-54), Figure 2 (PDF 27, printed 21) and
// 5.4.4 (PDF 40, printed 34) of MIL-STD-2525C, not from current output.
import { ms, std2525c } from "../index.mjs";
import {
  std2525cTableIV,
  std2525cFields,
  std2525cSymbolClass,
  std2525cValidate,
  std2525cTextLayout
} from "../src/modifierprofiles/std2525c.js";

ms.reset();
ms.addIcons(std2525c);
ms.setStandard("2525C");

function visit(parts) {
  return parts.reduce(
    (all, part) =>
      all.concat(
        Array.isArray(part)
          ? visit(part)
          : part
            ? [part].concat(visit(part.draw || []))
            : []
      ),
    []
  );
}
const texts = (symbol) =>
  visit(symbol.drawInstructions)
    .filter((part) => part.type === "text")
    .map((part) => part.text);
const sym = (sidc, options) => new ms.Symbol(sidc, options || {});
const errors = (sidc, options) =>
  std2525cValidate(sidc, options).details.modifierErrors;
const ok = (sidc, options) => std2525cValidate(sidc, options).valid;

const UNIT = "SFGPUCI-----";
const EQUIPMENT = "SFGPEWM-----";
const INSTALLATION = "SFGPIB------";
const result = {};

// Table IV: 39 entries; U/E/I limits for selected rows.
const row = (field) =>
  std2525cTableIV.filter((e) => e.field === field)[0].limits;
result["Table IV has 39 entries"] = [std2525cTableIV.length, 39];
result["C is U- E9 I-"] = [row("C"), [null, 9, null]];
result["K is U5 E- I5"] = [row("K"), [5, null, 5]];
result["Z is U8 E8 I-"] = [row("Z"), [8, 8, null]];
result["W 16 and X 14"] = [
  [row("W")[1], row("X")[1]],
  [16, 14]
];
result["AO is G/8"] = [row("AO"), ["G/8", "G/8", "G/8"]];
result["SIGINT-only AD AE AF R2 are dashes"] = [
  ["AD", "AE", "AF", "R2"].map((f) => row(f).join()),
  ["AD", "AE", "AF", "R2"].map(() => ",,")
];

// Symbol class.
[
  [UNIT, "unit"],
  [EQUIPMENT, "equipment"],
  [INSTALLATION, "installation"],
  ["SFAPMF------", "equipment"],
  ["SFPPS-------", "equipment"],
  ["SFSPCL------", "equipment"],
  ["SFUPSA------", "equipment"],
  ["SFFPA-------", "unit"],
  ["SFZP--------", "unknown"],
  ["GFGPGLB-----", ""]
].forEach(([sidc, cls]) => {
  result["class " + sidc] = [std2525cSymbolClass(sidc), cls];
});

// Field lists by class.
const keys = (sidc) => std2525cFields(sidc).map((f) => f.key);
result["unit has F, no C/V/L/N"] = [
  [
    "reinforcedReduced",
    "quantity",
    "type",
    "signatureEquipment",
    "hostile"
  ].map((k) => keys(UNIT).indexOf(k) > -1),
  [true, false, false, false, false]
];
result["equipment has C V Z, no K F M AA"] = [
  [
    "quantity",
    "type",
    "speed",
    "combatEffectiveness",
    "reinforcedReduced",
    "higherFormation",
    "specialHeadquarters"
  ].map((k) => keys(EQUIPMENT).indexOf(k) > -1),
  [true, true, true, false, false, false, false]
];
result["installation has K, no Z V C Q"] = [
  ["combatEffectiveness", "speed", "type", "quantity", "direction"].map(
    (k) => keys(INSTALLATION).indexOf(k) > -1
  ),
  [true, false, false, false, false]
];
result["non-S scheme is unrestricted"] = [std2525cFields("GFGPGLB-----"), null];
result["non-S scheme validates"] = [
  ok("GFGPGLB-----", { country: "TR" }),
  true
];
result["non-S scheme has no layout"] = [
  std2525cTextLayout("GFGPGLB-----"),
  null
];

// Min / max / max+1 / empty for every free text field and class.
[
  [UNIT, "unit"],
  [EQUIPMENT, "equipment"],
  [INSTALLATION, "installation"]
].forEach(([sidc, cls]) => {
  std2525cFields(sidc)
    .filter((f) => f.kind === "text" && f.maxLength !== null)
    .forEach((f) => {
      const set = (n) => {
        const o = {};
        o[f.key] = "x".repeat(n);
        return o;
      };
      const name = cls + " " + f.field + " " + f.key;
      result[name + " min"] = [ok(sidc, set(1)), true];
      result[name + " max " + f.maxLength] = [ok(sidc, set(f.maxLength)), true];
      result[name + " max+1"] = [ok(sidc, set(f.maxLength + 1)), false];
    });
});
result["empty values are valid"] = [
  ok(UNIT, { staffComments: "", dtg: undefined }),
  true
];
result["no invented character set (lowercase/punctuation)"] = [
  ok(UNIT, { staffComments: "a/b-c é ü" }),
  true
];

// Not applicable per class.
result["unit rejects C"] = [ok(UNIT, { quantity: "5" }), false];
result["equipment accepts C"] = [ok(EQUIPMENT, { quantity: "5" }), true];
result["installation rejects C"] = [ok(INSTALLATION, { quantity: "5" }), false];
result["installation rejects Z"] = [ok(INSTALLATION, { speed: "5" }), false];
result["equipment rejects K"] = [
  ok(EQUIPMENT, { combatEffectiveness: "80" }),
  false
];
result["equipment rejects M"] = [
  ok(EQUIPMENT, { higherFormation: "1" }),
  false
];
result["installation rejects Q"] = [ok(INSTALLATION, { direction: 90 }), false];
result["unit accepts Q 0"] = [ok(UNIT, { direction: 0 }), true];
[
  "country",
  "platformType",
  "equipmentTeardownTime",
  "commonIdentifier",
  "headquartersElement",
  "installationComposition",
  "sigint",
  "guardedUnit",
  "specialDesignator",
  "auxiliaryEquipmentIndicator"
].forEach((key) => {
  const o = {};
  o[key] = "x";
  result["not a 2525C S field " + key] = [ok(UNIT, o), false];
});
result["AO accepts 8 rejects 9"] = [
  [
    ok(UNIT, { engagementBar: "A".repeat(8) }),
    ok(UNIT, { engagementBar: "A".repeat(9) })
  ],
  [true, false]
];

// J: all 36 pairs; K free text; L only !; N only ENY; F display forms.
let pairs = 0;
"ABCDEF".split("").forEach((r) =>
  "123456".split("").forEach((c) => {
    if (ok(UNIT, { evaluationRating: r + c })) pairs++;
  })
);
result["J accepts 36 pairs"] = [pairs, 36];
result["J rejects G1 A7 1A"] = [
  ["G1", "A7", "1A", "A"].map((v) => ok(UNIT, { evaluationRating: v })),
  [false, false, false, false]
];
result["K is free text up to 5"] = [
  [
    ok(UNIT, { combatEffectiveness: "80%" }),
    ok(UNIT, { combatEffectiveness: "123456" })
  ],
  [true, false]
];
result["L only ! and only hostile"] = [
  [
    ok("SHGPEWM-----", { signatureEquipment: "!" }),
    ok("SSGPEWM-----", { signatureEquipment: "!" }),
    ok(EQUIPMENT, { signatureEquipment: "!" }),
    ok("SHGPEWM-----", { signatureEquipment: "?" })
  ],
  [true, true, false, false]
];
result["N ENY only, independent of identity"] = [
  [
    ok(EQUIPMENT, { hostile: "ENY" }),
    ok("SHGPEWM-----", { hostile: "ENY" }),
    ok(EQUIPMENT, { hostile: "EN" }),
    ok(UNIT, { hostile: "ENY" })
  ],
  [true, true, false, false]
];
result["H identity does not generate ENY"] = [
  texts(sym("SHGPEWM-----")).indexOf("ENY"),
  -1
];
result["F display forms"] = [
  ["(+)", "(-)", "(±)"].map((v) => ok(UNIT, { reinforcedReduced: v })),
  [true, true, true]
];
result["F transmission codes are not display values"] = [
  ["R", "D", "RD"].map((v) => ok(UNIT, { reinforcedReduced: v })),
  [false, false, false]
];

// Identities and Table II N/A for unknown dimension.
"PUAFNSHGWMDLJK".split("").forEach((id) => {
  result["identity " + id + " ground unit valid"] = [
    ok("S" + id + "GPUCI-----"),
    true
  ];
  result["identity " + id + " unknown dimension"] = [
    ok("S" + id + "ZP--------"),
    "GWPUAFNSH".indexOf(id) > -1
  ];
});
result["X Other is a note, not a frame"] = [
  sym("SFXP--------").metadata.frame,
  false
];
result["Joker friend shape red"] = [
  [
    sym("SJGPUCI-----").metadata.affiliation,
    sym("SJGPUCI-----").metadata.joker
  ],
  ["Friend", true]
];
result["Faker friend shape"] = [
  [
    sym("SKGPUCI-----").metadata.affiliation,
    sym("SKGPUCI-----").metadata.faker
  ],
  ["Friend", true]
];
result["Joker uses the hostile (red) frame colour"] = [
  sym("SJGPUCI-----").colors.frameColor.Friend,
  sym("SHGPUCI-----").colors.frameColor.Hostile
];

// Status.
result["unit rejects C D X F"] = [
  ["C", "D", "X", "F"].map((s) =>
    ok("SFGP" === "" ? "" : "SFG" + s + "UCI-----")
  ),
  [false, false, false, false]
];
result["equipment accepts C D X F"] = [
  ["C", "D", "X", "F"].map((s) => ok("SFG" + s + "EWM-----")),
  [true, true, true, true]
];
result["unit never draws AL"] = [sym("SFGCUCI-----").metadata.condition, ""];
result["equipment C draws fully capable"] = [
  sym("SFGCEWM-----").metadata.condition,
  "FullyCapable"
];
result["status P on equipment is a recorded tension"] = [
  [ok(EQUIPMENT), std2525cValidate(EQUIPMENT).details.notes.length > 0],
  [true, true]
];
result["on order needs status A"] = [
  [ok(UNIT, { dtg: "O/O" }), ok("SFGAUCI-----", { dtg: "O/O" })],
  [false, true]
];
result["planned and uncertainty kept apart"] = [
  [
    sym("SAGAUCI-----").metadata.identityUncertain,
    sym("SAGAUCI-----").metadata.plannedStatus,
    sym("SFGAUCI-----").metadata.identityUncertain
  ],
  [true, true, false]
];

// SIDC 11-12 (Table A-II).
const sm = (cls, code) => ok(cls.substr(0, 10) + code);
result["unit modifier codes"] = [
  ["--", "-A", "-N", "AN", "BB", "DN", "EA", "FA", "GN", "H-", "HB"].map((c) =>
    sm(UNIT, c)
  ),
  Array(11).fill(true)
];
result["H only H- HB"] = [
  ["HA", "HC", "HN"].map((c) => sm(UNIT, c)),
  [false, false, false]
];
result["unit rejects mobility and array"] = [
  ["MQ", "NS"].map((c) => sm(UNIT, c)),
  [false, false]
];
result["equipment mobility MO..MY"] = [
  ["MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY"].map((c) =>
    sm(EQUIPMENT, c)
  ),
  Array(11).fill(true)
];
result["mobility rejects MA MZ"] = [
  ["MA", "MZ"].map((c) => sm(EQUIPMENT, c)),
  [false, false]
];
result["towed array NS NL on equipment"] = [
  ["NS", "NL", "NX"].map((c) => sm(EQUIPMENT, c)),
  [true, true, false]
];
result["equipment HQ and FD ok, echelon and TF not"] = [
  ["A-", "C-", "F-", "H-", "HB", "-E", "AE", "E-", "B-"].map((c) =>
    sm(EQUIPMENT, c)
  ),
  [true, true, true, true, true, false, false, false, false]
];
result["installation HQ ok, echelon not"] = [
  ["A-", "H-", "HB", "-A"].map((c) => sm(INSTALLATION, c)),
  [true, true, true, false]
];
result["renderer agrees: equipment echelon/TF/mobility on unit are not drawn"] =
  [
    [
      sym("SFGPEWM---E-").metadata.taskForce,
      sym("SFGPEWM----E").metadata.echelon,
      sym("SFGPUCI---MQ").metadata.mobility
    ],
    [false, "", ""]
  ];
result["renderer: HA does not draw an echelon"] = [
  sym("SFGPUCI---HA").metadata.echelon,
  ""
];

// Figure 2 layout, single space, collapse of empties.
const layout = std2525cTextLayout(UNIT);
result["left rows"] = [
  layout.left,
  [
    [],
    ["dtg"],
    ["altitudeDepth", "location"],
    [],
    ["uniqueDesignation"],
    ["speed"]
  ]
];
result["right rows"] = [
  layout.right,
  [
    [],
    ["reinforcedReduced"],
    ["staffComments"],
    ["additionalInformation"],
    ["higherFormation"],
    ["evaluationRating", "combatEffectiveness", "iffSif"]
  ]
];
result["equipment left rows"] = [
  std2525cTextLayout(EQUIPMENT).left[3],
  ["type"]
];
result["equipment quantity is top, AA is not"] = [
  [std2525cTextLayout(EQUIPMENT).top, std2525cTextLayout(EQUIPMENT).inner],
  [["quantity"], []]
];
result["unit AA is inner"] = [layout.inner, ["specialHeadquarters"]];
result["exercise descriptor first in E/F row"] = [
  std2525cTextLayout("SDGPUCI-----").right[1],
  ["frameDescriptor", "reinforcedReduced"]
];
result["joker descriptor J"] = [
  std2525cTextLayout("SJGPUCI-----").derived,
  { frameDescriptor: "J" }
];
result["single space and collapse"] = [
  texts(sym(UNIT, { evaluationRating: "B2", iffSif: "1234" })).filter(
    (t) => t.indexOf("B2") > -1
  ),
  ["B2 1234"]
];
result["full right-lower group order"] = [
  texts(
    sym(UNIT, {
      iffSif: "1234",
      combatEffectiveness: "80%",
      evaluationRating: "B2"
    })
  ).filter((t) => t.indexOf("B2") > -1),
  ["B2 80% 1234"]
];
result["equipment J K L N P order"] = [
  texts(
    sym("SHGPEWM-----", {
      evaluationRating: "A1",
      signatureEquipment: "!",
      hostile: "ENY",
      iffSif: "12"
    })
  ).filter((t) => t.indexOf("A1") > -1),
  ["A1 ! ENY 12"]
];
result["X Y share a row with one space"] = [
  texts(sym(UNIT, { altitudeDepth: "100 FT AGL", location: "12.5N" })).filter(
    (t) => t.indexOf("100") > -1
  ),
  ["100 FT AGL 12.5N"]
];
result["exercise X drawn once, with F"] = [
  texts(sym("SDGPUCI-----", { reinforcedReduced: "(+)" })).filter(
    (t) => t.indexOf("X") > -1
  ),
  ["X (+)"]
];
result["exercise X drawn once, without F"] = [
  texts(sym("SDGPUCI-----")).filter((t) => t === "X"),
  ["X"]
];
result["joker J drawn once"] = [
  texts(sym("SJGPUCI-----", { reinforcedReduced: "(-)" })).filter(
    (t) => t.indexOf("J") > -1
  ),
  ["J (-)"]
];
result["inapplicable text is not drawn"] = [
  texts(
    sym(UNIT, { quantity: "55", headquartersElement: "HQE", type: "TYPEX" })
  ).filter((t) => ["55", "HQE", "TYPEX"].indexOf(t) > -1),
  []
];

// Isolation: 2525 (B/C mix) keeps drawing everything; stale cache check.
const mixed = (standard) =>
  sym(UNIT, { standard: standard, quantity: "55", reinforcedReduced: "(+)" });
result["2525 mix still draws C on a unit"] = [
  texts(mixed("2525")).indexOf("55") > -1,
  true
];
result["2525C does not"] = [texts(mixed("2525C")).indexOf("55") > -1, false];
result["interleaved standards stay stable"] = [
  [
    texts(mixed("2525")).indexOf("55") > -1,
    texts(mixed("2525C")).indexOf("55") > -1,
    texts(mixed("2525")).indexOf("55") > -1
  ],
  [true, false, true]
];
result["2525 unit with status C keeps its bar"] = [
  new ms.Symbol("SFGCUCI-----", { standard: "2525" }).metadata.condition,
  "FullyCapable"
];

ms.reset();
export default { "MIL-STD-2525C modifiers": result };
