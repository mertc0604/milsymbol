// Text amplifiers rendered by the bundled milsymbol library. Keep their option
// names here so forms, rendering and Reset share the same vocabulary.
export const modifierGroups = [
  {
    label: "Identity & organization",
    fields: [
      [
        "uniqueDesignation",
        "T",
        "Unique designation",
        "e.g. 1/23 INF",
        "Unit name, track number or other unique identifier."
      ],
      [
        "higherFormation",
        "M",
        "Higher formation",
        "e.g. 2 BDE",
        "Number or name of the higher command."
      ],
      [
        "specialHeadquarters",
        "AA",
        "Special headquarters",
        "e.g. NATO",
        "Special C2 headquarters name, inside the frame."
      ],
      [
        "headquartersElement",
        "AH",
        "Headquarters element",
        "e.g. MAIN",
        "Headquarters element label below the frame."
      ],
      [
        "country",
        "AC",
        "Country",
        "e.g. TUR",
        "Country text identifier; placement depends on the symbol set."
      ],
      [
        "reinforcedReduced",
        "F",
        "Reinforced / reduced",
        "",
        "Indicates reinforcement, reduction or both.",
        [
          ["", "Unspecified"],
          ["(+)", "Reinforced (+)"],
          ["(-)", "Reduced (−)"],
          ["(±)", "Reinforced and reduced (±)"]
        ]
      ]
    ]
  },
  {
    label: "Information & assessment",
    fields: [
      [
        "additionalInformation",
        "H",
        "Additional information",
        "e.g. ALPHA",
        "Additional details about the symbol."
      ],
      [
        "staffComments",
        "G",
        "Staff comments",
        "e.g. READY",
        "Staff remarks displayed beside the symbol."
      ],
      [
        "evaluationRating",
        "J",
        "Evaluation rating",
        "e.g. A1",
        "Source reliability A–F and information credibility 1–6."
      ],
      [
        "combatEffectiveness",
        "K",
        "Combat effectiveness",
        "e.g. 85%",
        "Unit effectiveness or installation capability."
      ],
      [
        "signatureEquipment",
        "L",
        "Signature equipment",
        "e.g. !",
        "Electronic signature / detectable equipment indicator."
      ],
      [
        "hostile",
        "N",
        "Hostile indicator",
        "e.g. ENY",
        "Text marking equipment as hostile."
      ],
      [
        "iffSif",
        "P",
        "IFF / SIF / AIS",
        "e.g. 1200",
        "Identification modes and codes."
      ]
    ]
  },
  {
    label: "Time, location & movement",
    fields: [
      [
        "dtg",
        "W",
        "Date-time group",
        "e.g. 291430ZOCT26",
        "Date and time associated with the symbol."
      ],
      [
        "location",
        "Y",
        "Location",
        "e.g. 35T PF 1234 5678",
        "Coordinates in the required display format."
      ],
      [
        "altitudeDepth",
        "X",
        "Altitude / depth",
        "e.g. 1500FT",
        "Altitude, flight level, depth or height."
      ],
      [
        "speed",
        "Z",
        "Speed",
        "e.g. 30KM/H",
        "Movement speed, including the desired unit."
      ]
    ]
  },
  {
    label: "Equipment & installations",
    fields: [
      [
        "quantity",
        "C",
        "Quantity",
        "e.g. 12",
        "Number of items represented by the symbol."
      ],
      ["type", "V", "Type", "e.g. MECH", "Equipment or platform type."],
      [
        "platformType",
        "AD",
        "Platform type",
        "e.g. ELNOT",
        "Electronic or communications intelligence platform notation."
      ],
      [
        "equipmentTeardownTime",
        "AE",
        "Equipment teardown time",
        "e.g. 15 MIN",
        "Time needed to dismantle the equipment."
      ],
      [
        "commonIdentifier",
        "AF",
        "Common identifier",
        "e.g. HAWK",
        "Common equipment or system name."
      ],
      [
        "installationComposition",
        "AI",
        "Installation composition",
        "e.g. 3 RADARS",
        "Equipment or components of the installation."
      ]
    ]
  },
  {
    label: "Engagement & maritime",
    fields: [
      [
        "engagementBar",
        "AO",
        "Engagement bar",
        "e.g. R:ENG-M",
        "Engagement text above the frame, e.g. R:ENG-M."
      ],
      [
        "engagementType",
        "",
        "Engagement bar type",
        "",
        "Style used when engagement bar text is provided.",
        [
          ["", "Unspecified"],
          ["TARGET", "Target"],
          ["NON-TARGET", "Non-target"],
          ["EXPIRED", "Expired"]
        ]
      ],
      [
        "guardedUnit",
        "AQ",
        "Guarded unit",
        "e.g. DDG-01",
        "Guarding unit identifier on numeric sea-surface symbols."
      ],
      [
        "specialDesignator",
        "AR",
        "Special designator",
        "e.g. TRACK-01",
        "Special track designation on numeric sea-surface / subsurface symbols."
      ]
    ]
  }
].map((group) => ({
  ...group,
  fields: group.fields.map(
    ([key, field, label, placeholder, description, choices]) => ({
      key,
      field,
      label,
      placeholder,
      description,
      choices,
      id: key === "type" ? "typeLabel" : key
    })
  )
}));

export const textModifiers = modifierGroups.flatMap((group) => group.fields);

export function collectTextModifiers(values, allowedKeys = null) {
  const allowed = allowedKeys && new Set(allowedKeys);
  return Object.fromEntries(
    textModifiers.map(({ key }) => [
      key,
      !allowed || allowed.has(key) ? String(values[key] ?? "") : ""
    ])
  );
}
