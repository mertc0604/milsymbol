// APP-6(D) Edition D Version 1 modifier profile. Expected values come from the
// PDF (page references are physical PDF page / printed page), not from output.
import { ms, app6d } from "../index.mjs";
import {
  app6dProfile,
  app6dAmplifierKind,
  app6dIdentityName
} from "../src/modifierprofiles/app6d.js";
import {
  classifySectorCode,
  sectorDictionary,
  sectorPlacement
} from "../src/modifierprofiles/app6d-sectors.js";

ms.reset();
ms.addIcons(app6d);

// 20-digit SIDC builder: version, context, identity, set, status, HQ/TF/dummy,
// amplifier (2), entity (6), sector 1, sector 2.
function sidc(o) {
  const d = Object.assign(
    {
      ctx: "0",
      id: "3",
      set: "10",
      st: "0",
      hq: "0",
      amp: "00",
      ent: "000000",
      s1: "00",
      s2: "00"
    },
    o
  );
  return (
    "10" + d.ctx + d.id + d.set + d.st + d.hq + d.amp + d.ent + d.s1 + d.s2
  );
}
function check(o, options) {
  const symbol = new ms.Symbol(
    sidc(o),
    Object.assign({ standard: "APP6" }, options || {})
  );
  return symbol.metadata.validation;
}
const ok = (o, options) => check(o, options).valid;
const ENT = {
  air: "110100",
  rotary: "110200",
  sat: "110700",
  sub: "110101",
  torpedo: "130100",
  auv: "110400",
  ied: "130200"
};

const sets = {
  air: "01",
  missile: "02",
  space: "05",
  unit: "10",
  equip: "15",
  inst: "20",
  surface: "30",
  sub: "35",
  mine: "36"
};
const layout = (o) => app6dProfile.textLayout(sidc(o));
const fieldKeys = (o) => app6dProfile.fields(sidc(o)).map((f) => f.key);

// Table 1-2 / J field: 36 reliability x credibility pairs are all valid.
const jPairs = {};
"ABCDEF".split("").forEach((letter) =>
  "123456".split("").forEach((digit) => {
    jPairs[letter + digit] = [
      ok({ set: "15" }, { evaluationRating: letter + digit }),
      true
    ];
  })
);

// Annex A dictionary sizes (entries incl. 00): Tables A-11..A-39.
const dictionarySizes = {
  "01/1": 40,
  "01/2": 12,
  "02/1": 9,
  "02/2": 16,
  "05/1": 7,
  "05/2": 5,
  "10/1": 84,
  "10/2": 58,
  "15/1": 10,
  "20/1": 17,
  "20/2": 9,
  "30/1": 24,
  "30/2": 16,
  "35/1": 21,
  "35/2": 17
};
const sizeChecks = {};
Object.keys(dictionarySizes).forEach((key) => {
  const [set, sector] = key.split("/");
  sizeChecks[key] = [
    sectorDictionary(set, Number(sector)).entries.length,
    dictionarySizes[key]
  ];
});

const unitText = new ms.Symbol(sidc({ set: "10" }), {
  standard: "APP6",
  type: "T",
  platformType: "ELNOT",
  equipmentTeardownTime: "5",
  reinforcedReduced: "",
  uniqueDesignation: "U1"
}).asSVG();
const equipText = new ms.Symbol(sidc({ set: "15" }), {
  standard: "APP6",
  type: "T",
  platformType: "ELNOT",
  commonIdentifier: "PATRIOT",
  additionalInformation: "H1",
  equipmentTeardownTime: "5"
}).asSVG();

export default {
  "APP-6D profile": {
    "profile is active for version 10 under APP6 only": [
      [
        new ms.Symbol(sidc({}), { standard: "APP6" }).metadata.app6d,
        new ms.Symbol(sidc({}), { standard: "2525" }).metadata.app6d,
        new ms.Symbol("13031000001211000000", { standard: "APP6" }).metadata
          .app6d
      ].map(Boolean),
      [true, false, false]
    ],
    "symbol classes from the symbol set": [
      Object.keys(sets).map((k) =>
        app6dProfile.symbolClass(sidc({ set: sets[k] }))
      ),
      [
        "air",
        "airMissile",
        "space",
        "landUnit",
        "landEquipment",
        "landInstallation",
        "seaSurface",
        "seaSubsurface",
        "mineWarfare"
      ]
    ],
    "sets 11 and 27 are classified but not profiled": [
      ["11", "27"].map((s) => [
        app6dProfile.symbolClass(sidc({ set: s })),
        app6dProfile.fields(sidc({ set: s })),
        app6dProfile.textLayout(sidc({ set: s }))
      ]),
      [
        ["civilianOrganization", null, null],
        ["dismountedIndividual", null, null]
      ]
    ],
    "sets 25, 40 and 50 are untouched": [
      ["25", "40", "50"].map((s) => [
        app6dProfile.symbolClass(sidc({ set: s })),
        ok({ set: s })
      ]),
      [
        ["", true],
        ["", true],
        ["", true]
      ]
    ]
  },
  "Context, identity, status (Table A-2 PDF 718/A-4, Table A-6 PDF 723/A-9)": {
    "context 0 valid, 1 and 2 valid with US-only note, 3 reserved": [
      ["0", "1", "2", "3", "9"].map((c) => ok({ ctx: c })),
      [true, true, true, false, false]
    ],
    "context 1 carries the US-only note": [
      check({ ctx: "1" }).details.notes.some((n) => /US use only/.test(n)),
      true
    ],
    "identity 0-6 valid, 7-9 reserved": [
      "0123456789".split("").map((i) => ok({ id: i })),
      [true, true, true, true, true, true, true, false, false, false]
    ],
    "status 0-5 valid, 6-8 reserved, 9 is VEF not an ordinary error": [
      "0123456789".split("").map((s) => ok({ set: "15", st: s })),
      [true, true, true, true, true, true, false, false, false, false]
    ],
    "status 9 is reported as a version extension flag": [
      check({ st: "9" }).details.versionExtension,
      [{ position: "status", code: "9" }]
    ],
    "Land Unit has no operational condition (Tables 1-3/1-4 PDF 35/1-11)": [
      [
        ok({ set: "10", st: "3" }),
        ok({ set: "15", st: "3" }),
        ok({ set: "30", st: "5" })
      ],
      [false, true, true]
    ],
    "Joker and Faker names exist only with context 1": [
      [
        app6dIdentityName("1", "5"),
        app6dIdentityName("0", "5"),
        app6dIdentityName("1", "6"),
        app6dIdentityName("2", "6")
      ],
      ["Joker", "Suspect", "Faker", "Hostile"]
    ],
    "planned status on an uncertain identity gets a note, not a second dashed frame":
      [
        check({ id: "2", st: "1" }).details.notes.some((n) =>
          /not shown on an uncertain/.test(n)
        ),
        true
      ],
    "uncertain identities are 0, 2 and 5": [
      "0123456"
        .split("")
        .map((i) => check({ id: i }).details.uncertainIdentity),
      [true, false, true, false, false, true, false]
    ]
  },
  "Amplifier digits (Table A-7, A-8 PDF 723-726/A-9..A-12)": {
    "echelon, mobility, towed array, VEF and reserved kinds": [
      [
        "21",
        "19",
        "29",
        "27",
        "28",
        "51",
        "62",
        "38",
        "43",
        "63",
        "71",
        "80",
        "90",
        "00",
        "10"
      ].map(app6dAmplifierKind),
      [
        "echelon",
        "vef",
        "vef",
        "reserved",
        "reserved",
        "mobility",
        "towedArray",
        "reserved",
        "reserved",
        "reserved",
        "leadership",
        "reserved",
        "vef",
        "none",
        "undefined"
      ]
    ],
    "echelon 26 (command) is valid on a unit, mobility is not": [
      [
        ok({ set: "10", amp: "26" }),
        ok({ set: "10", amp: "51" }),
        ok({ set: "15", amp: "51" }),
        ok({ set: "15", amp: "21" })
      ],
      [true, false, true, false]
    ],
    "task force only on units, dummy on units/equipment/installations": [
      [
        ok({ set: "10", hq: "7" }),
        ok({ set: "15", hq: "1" }),
        ok({ set: "15", hq: "2" }),
        ok({ set: "20", hq: "3" }),
        ok({ set: "20", hq: "4" }),
        ok({ set: "01", hq: "1" })
      ],
      [true, true, false, true, false, false]
    ],
    "HQ/TF/dummy 8 reserved, 9 VEF": [
      [ok({ hq: "8" }), ok({ hq: "9" })],
      [false, false]
    ],
    "F at division and below (section 3.3.8 PDF 148/3-68)": [
      [
        ok({ set: "10", amp: "21" }, { reinforcedReduced: "+" }),
        ok({ set: "10", amp: "22" }, { reinforcedReduced: "+" }),
        ok({ set: "10", amp: "14" }, { reinforcedReduced: "±" }),
        ok({ set: "10", amp: "14" }, { reinforcedReduced: "(+)" }),
        ok({ set: "10", amp: "14" }, { reinforcedReduced: "R" })
      ],
      [true, false, true, true, false]
    ]
  },
  "Fields per symbol class": {
    "Land Unit uses AC as a graphic, Equipment and Installation as a country text (D-AC)":
      [
        [
          ok({ set: "10" }, { country: "TUR" }),
          ok({ set: "15" }, { country: "TUR" }),
          ok({ set: "20" }, { country: "TUR" }),
          ok({ set: "15" }, { country: "TU" })
        ],
        [false, true, true, false]
      ],
    "K: unit enum, equipment descriptions, installation capacity free text": [
      [
        ok({ set: "10" }, { combatEffectiveness: "UNK" }),
        ok({ set: "10" }, { combatEffectiveness: "85%" }),
        ok({ set: "15" }, { combatEffectiveness: "Fully Operational" }),
        ok({ set: "15" }, { combatEffectiveness: "85%" }),
        ok({ set: "20" }, { combatEffectiveness: "85%" })
      ],
      [true, false, true, false, true]
    ],
    "J accepts all 36 reliability/credibility pairs": [
      Object.keys(jPairs).length,
      36
    ],
    "J rejects bad letters, digits and lengths": [
      ["G1", "A7", "A", "A11", "a1"].map((j) =>
        ok({ set: "15" }, { evaluationRating: j })
      ),
      [false, false, false, false, false]
    ],
    "P is IFF/SIF for Equipment and AIS for Sea Surface": [
      [
        app6dProfile
          .fields(sidc({ set: "15" }))
          .filter((f) => f.key === "iffSif")[0].label,
        app6dProfile
          .fields(sidc({ set: "30" }))
          .filter((f) => f.key === "iffSif")[0].label
      ],
      ["IFF/SIF", "AIS (automatic identification system)"]
    ],
    "AQ is exactly BG on Sea Surface (Table 5-2 PDF 295/5-7)": [
      ["BG", "B", "BGG", "XX"].map((v) =>
        ok({ set: "30" }, { guardedUnit: v })
      ),
      [true, false, false, false]
    ],
    "AQ is not defined for Subsurface": [
      ok({ set: "35" }, { guardedUnit: "BG" }),
      false
    ],
    "AR is NRT or SIG on Sea Surface and Subsurface (PDF 295/5-7, 327/5-39)": [
      ["NRT", "SIG", "ABC", "NR"].map((v) => [
        ok({ set: "30" }, { specialDesignator: v }),
        ok({ set: "35" }, { specialDesignator: v })
      ]),
      [
        [true, true],
        [true, true],
        [false, false],
        [false, false]
      ]
    ],
    "L and N are for hostile equipment only; N does not change the identity": [
      [
        ok({ set: "15", id: "6" }, { signatureEquipment: "!", hostile: "ENY" }),
        ok({ set: "15", id: "3" }, { signatureEquipment: "!" }),
        ok({ set: "15", id: "3" }, { hostile: "ENY" }),
        new ms.Symbol(sidc({ set: "15", id: "3" }), {
          standard: "APP6",
          hostile: "ENY"
        }).metadata.affiliation
      ],
      [true, false, false, "Friend"]
    ],
    "W year length differs by class (D-W)": [
      [
        ok({ set: "10" }, { dtg: "301400ZSEP2017" }),
        ok({ set: "10" }, { dtg: "301400ZSEP17" }),
        ok({ set: "15" }, { dtg: "301400ZSEP17" }),
        ok({ set: "15" }, { dtg: "301400ZSEP2017" }),
        ok({ set: "15" }, { dtg: "O/O" })
      ],
      [true, false, true, false, true]
    ],
    "Y is limited to 22 characters on Land Unit only": [
      [
        ok({ set: "10" }, { location: "1234567890123456789012" }),
        ok({ set: "10" }, { location: "12345678901234567890123" }),
        ok({ set: "15" }, { location: "12345678901234567890123" })
      ],
      [true, false, true]
    ],
    "Installation AE is figure-only and noted, Space H and Z are unresolved (D-INST-AE, D-SPACE)":
      [
        [
          ok({ set: "20" }, { equipmentTeardownTime: "5" }),
          check(
            { set: "20" },
            { equipmentTeardownTime: "5" }
          ).details.notes.some((n) => /D-INST-AE/.test(n)),
          ok({ set: "05" }, { additionalInformation: "H" }),
          ok({ set: "05" }, { speed: "Z" }),
          ok({ set: "05" }, { staffComments: "G" })
        ],
        [true, true, false, false, true]
      ],
    "fields not defined for a class are rejected": [
      [
        ok({ set: "01" }, { quantity: "3" }),
        ok({ set: "30" }, { dtg: "301400ZSEP17" }),
        ok({ set: "35" }, { speed: "5" }),
        ok({ set: "20" }, { type: "X" }),
        ok({ set: "10" }, { quantity: "3" }),
        ok({ set: "15" }, { quantity: "3" })
      ],
      [false, false, false, false, false, true]
    ],
    "SIGINT R2 and AG are not APP-6D fields": [
      [
        ok({ set: "15" }, { sigint: "X" }),
        ok({ set: "15" }, { auxiliaryEquipmentIndicator: "X" })
      ],
      [false, false]
    ],
    "installation has no direction arrow": [
      ok({ set: "20" }, { direction: 45 }),
      false
    ],
    "unknown dimension keeps all fields (policy)": [
      [
        app6dProfile.fields(sidc({ set: "00" })),
        app6dProfile.textLayout(sidc({ set: "00" }))
      ],
      [null, null]
    ]
  },
  "Engagement bar A:BBB-CC (Tables 1-5, 1-6 PDF 40-41/1-16..1-17)": {
    "valid and invalid bars": [
      [
        "ENG-M",
        "R:ENG-M",
        ":ENG-M",
        "B:MLT-05",
        "MLT-99",
        "R:M<T",
        "ASN-L3",
        "R:ENG-GN"
      ].map((bar) => ok({ set: "01" }, { engagementBar: bar })),
      [true, true, true, true, true, true, true, true]
    ],
    "invalid bars": [
      [
        "X:ENG-M",
        "R:XXX-M",
        "B:ENG-M",
        "MLT-M",
        "ENG-05",
        "ENG-XX",
        "MLT-01",
        "R:"
      ].map((bar) => ok({ set: "01" }, { engagementBar: bar })),
      [false, false, false, false, false, false, false, false]
    ],
    "target designation applies to hostile tracks": [
      [
        ok(
          { set: "01", id: "6" },
          { engagementBar: "ENG-M", engagementType: "TARGET" }
        ),
        ok(
          { set: "01", id: "3" },
          { engagementBar: "ENG-M", engagementType: "TARGET" }
        ),
        ok(
          { set: "01", id: "6" },
          { engagementBar: "ENG-M", engagementType: "WHITE" }
        )
      ],
      [true, false, false]
    ]
  },
  "Text layouts": {
    "Air and Air Missile right column T; P; V; Z X; G H": [
      [
        layout({ set: "01" }).right.slice(1),
        layout({ set: "02" }).right.slice(1),
        layout({ set: "01" }).left
      ],
      [
        [
          ["uniqueDesignation"],
          ["iffSif"],
          ["type"],
          ["speed", "altitudeDepth"],
          ["staffComments", "additionalInformation"]
        ],
        [
          ["uniqueDesignation"],
          ["iffSif"],
          ["type"],
          ["speed", "altitudeDepth"],
          ["staffComments", "additionalInformation"]
        ],
        []
      ]
    ],
    "Land Unit and Land Equipment AE/AF positions differ": [
      [
        layout({ set: "10" }).left[3],
        layout({ set: "10" }).right[3],
        layout({ set: "15" }).left[3],
        layout({ set: "15" }).right[3]
      ],
      [
        ["type", "platformType", "equipmentTeardownTime"],
        ["additionalInformation", "commonIdentifier"],
        ["type", "platformType", "commonIdentifier"],
        ["additionalInformation", "equipmentTeardownTime"]
      ]
    ],
    "Land Unit rows": [
      [
        layout({ set: "10" }).left.slice(1),
        layout({ set: "10" }).right.slice(1)
      ],
      [
        [
          ["specialDesignator", "dtg"],
          ["altitudeDepth", "location"],
          ["type", "platformType", "equipmentTeardownTime"],
          ["uniqueDesignation"],
          ["speed"]
        ],
        [
          ["reinforcedReduced"],
          ["staffComments"],
          ["additionalInformation", "commonIdentifier"],
          ["higherFormation"],
          ["evaluationRating", "combatEffectiveness", "iffSif"]
        ]
      ]
    ],
    "Land Equipment and Installation right R1 is the country, quantity is on top":
      [
        [
          layout({ set: "15" }).right[1],
          layout({ set: "20" }).right[1],
          layout({ set: "15" }).top,
          layout({ set: "20" }).left[3]
        ],
        [["country"], ["country"], ["quantity"], ["installationComposition"]]
      ],
    "Sea Surface right T; V; P; G H; Y Z with AQ AR top-left": [
      [layout({ set: "30" }).right.slice(1), layout({ set: "30" }).left[1]],
      [
        [
          ["uniqueDesignation"],
          ["type"],
          ["iffSif"],
          ["staffComments", "additionalInformation"],
          ["location", "speed"]
        ],
        ["guardedUnit", "specialDesignator"]
      ]
    ],
    "Subsurface and Mine Warfare right T; V; X; G; H with AR top-left": [
      [
        layout({ set: "35" }).right.slice(1),
        layout({ set: "36" }).right.slice(1),
        layout({ set: "35" }).left[1]
      ],
      [
        [
          ["uniqueDesignation"],
          ["type"],
          ["altitudeDepth"],
          ["staffComments"],
          ["additionalInformation"]
        ],
        [
          ["uniqueDesignation"],
          ["type"],
          ["altitudeDepth"],
          ["staffComments"],
          ["additionalInformation"]
        ],
        ["specialDesignator"]
      ]
    ],
    "Space is T; V; X; G only and does not copy the Air rows": [
      layout({ set: "05" }).right.slice(1),
      [["uniqueDesignation"], ["type"], ["altitudeDepth"], ["staffComments"]]
    ],
    "single space joins shared positions and collapses empty values": [
      [
        />T ELNOT 5</.test(unitText),
        /U1</.test(unitText),
        />T ELNOT PATRIOT</.test(equipText),
        />H1 5</.test(equipText)
      ],
      [true, true, true, true]
    ],
    "layout separator is one space (policy)": [
      layout({ set: "10" }).separator,
      " "
    ]
  },
  "Sector modifiers (Annex A PDF 735-815)": {
    "dictionary sizes incl. 00": sizeChecks,
    "reserved ranges, VEF and undefined codes": [
      [
        classifySectorCode("02", 2, "06"),
        classifySectorCode("10", 1, "71"),
        classifySectorCode("10", 1, "94"),
        classifySectorCode("01", 1, "99"),
        classifySectorCode("01", 1, "40"),
        classifySectorCode("15", 2, "01"),
        classifySectorCode("36", 1, "01"),
        classifySectorCode("05", 1, "00")
      ],
      [
        "reserved",
        "reserved",
        "defined",
        "vef",
        "reserved",
        "undefined",
        "undefined",
        "none"
      ]
    ],
    "Air Missile sectors are left and right, others top and bottom": [
      [
        sectorPlacement("02", 1),
        sectorPlacement("02", 2),
        sectorPlacement("01", 1),
        sectorPlacement("01", 2),
        sectorPlacement("35", 2)
      ],
      ["left", "right", "top", "bottom", "bottom"]
    ],
    "Air 38/39 only with rotary wing": [
      [
        ok({ set: "01", ent: ENT.rotary, s1: "38" }),
        ok({ set: "01", ent: ENT.air, s1: "38" }),
        ok({ set: "01", ent: ENT.air, s1: "39" }),
        ok({ set: "01", ent: ENT.air, s1: "37" })
      ],
      [true, false, false, true]
    ],
    "Air Missile sector 2 07-11 only with sector 1 08 Interceptor": [
      [
        ok({ set: "02", ent: "110000", s1: "08", s2: "07" }),
        ok({ set: "02", ent: "110000", s1: "00", s2: "07" }),
        ok({ set: "02", ent: "110000", s1: "07", s2: "11" }),
        ok({ set: "02", ent: "110000", s2: "12" }),
        ok({ set: "02", ent: "110000", s2: "06" })
      ],
      [true, false, false, true, false]
    ],
    "Space sector 2 sensors only with satellites": [
      [
        ok({ set: "05", ent: ENT.sat, s2: "01" }),
        ok({ set: "05", ent: "110100", s2: "03" }),
        ok({ set: "05", ent: "110100", s1: "01" })
      ],
      [true, false, true]
    ],
    "Land Equipment has no sector 2": [
      [
        ok({ set: "15", ent: "110000", s1: "01" }),
        ok({ set: "15", ent: "110000", s2: "01" })
      ],
      [true, false]
    ],
    "Mine Warfare has no sector dictionary": [
      ok({ set: "36", ent: "110000", s1: "01" }),
      false
    ],
    "Subsurface submarine-only and AUV/UUV-only codes": [
      [
        ok({ set: "35", ent: ENT.sub, s1: "08" }),
        ok({ set: "35", ent: "110200", s1: "08" }),
        ok({ set: "35", ent: "110200", s1: "01" }),
        ok({ set: "35", ent: ENT.sub, s2: "13" }),
        ok({ set: "35", ent: ENT.auv, s2: "14" }),
        ok({ set: "35", ent: ENT.sub, s2: "14" })
      ],
      [true, false, true, true, true, false]
    ],
    "Subsurface sector 1 code 19 is an unresolved source conflict (D-SUB19)": [
      [
        check({ set: "35", ent: ENT.torpedo, s1: "19" }).details.unresolved.map(
          (u) => u.id
        ),
        check({ set: "35", ent: ENT.sub, s1: "19" }).details.unresolved.map(
          (u) => u.id
        ),
        ok({ set: "35", ent: "110200", s1: "19" })
      ],
      [["D-SUB19"], ["D-SUB19"], false]
    ],
    "reserved and VEF sector codes are not valid choices": [
      [
        ok({ set: "10", ent: "110000", s1: "71" }),
        ok({ set: "10", ent: "110000", s1: "99" }),
        ok({ set: "10", ent: "110000", s2: "58" }),
        ok({ set: "10", ent: "110000", s1: "98", s2: "57" })
      ],
      [false, false, false, true]
    ],
    "amplifier 51 Barge and Land Unit sector 2 51 Wheeled are separate dictionaries":
      [
        [
          app6dAmplifierKind("51"),
          classifySectorCode("10", 2, "51"),
          ok({ set: "15", amp: "51", ent: "110000" }),
          ok({ set: "10", ent: "110000", s2: "51" })
        ],
        ["mobility", "defined", true, true]
      ]
  },
  "Entity and identity restrictions": {
    "Own Ship is Friend only (Table 5-4 PDF 316/5-28)": [
      [
        ok({ set: "30", ent: "150000", id: "3" }),
        ok({ set: "30", ent: "150000", id: "2" }),
        ok({ set: "30", ent: "150000", id: "6" })
      ],
      [true, false, false]
    ],
    "Sea Surface sector 1 code 01 Own Ship is not tied to the entity rule": [
      ok({ set: "30", ent: "120100", id: "6", s1: "01" }),
      true
    ],
    "fused tracks and ETC/POSCON are Pending": [
      [
        ok({ set: "30", ent: "160000", id: "0" }),
        ok({ set: "30", ent: "160000", id: "3" }),
        ok({ set: "35", ent: "140000", id: "0" }),
        ok({ set: "35", ent: "150000", id: "1" })
      ],
      [true, false, true, false]
    ],
    "IED is Hostile only, Suspect does not substitute": [
      [
        ok({ set: "35", ent: ENT.ied, id: "6" }),
        ok({ set: "35", ent: ENT.ied, id: "3" }),
        ok({ set: "35", ent: ENT.ied, id: "5" })
      ],
      [true, false, false]
    ],
    "local tracks forbid sector modifiers but not outer text amplifiers": [
      [
        ok({ set: "30", ent: "170000", id: "3", s1: "02" }),
        ok({ set: "35", ent: "160000", id: "3", s2: "01" }),
        ok({ set: "30", ent: "170000", id: "3" }, { uniqueDesignation: "TN:1" })
      ],
      [false, false, true]
    ],
    "MEDAL red mine icon does not change the identity": [
      [
        new ms.Symbol(sidc({ set: "36", id: "3", ent: "110100" }), {
          standard: "APP6"
        }).metadata.affiliation,
        new ms.Symbol(sidc({ set: "36", id: "4", ent: "110100" }), {
          standard: "APP6"
        }).metadata.affiliation
      ],
      ["Friend", "Neutral"]
    ]
  }
};
