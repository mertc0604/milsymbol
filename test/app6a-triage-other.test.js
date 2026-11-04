import { ms, app6a } from "../index.mjs";

ms.reset();
ms.addIcons(app6a);
const result = {};
const flatten = (parts) =>
  parts.flatMap((part) =>
    Array.isArray(part)
      ? flatten(part)
      : part
        ? [part, ...flatten(part.draw || [])]
        : []
  );
const parts = (code, affiliation = "F", standard = "APP6A", frame = true) =>
  flatten(
    new ms.Symbol(`S${affiliation}${code[0]}P${code.slice(1)}-----`, {
      standard,
      frame
    }).drawInstructions
  ).filter((p) => p.icon);

// Measurements follow the selected Annex D publication cells, PDF pp. 136–172.
// These assertions protect the visual defects: role/size separation, thin mine
// horns, a long submarine periscope, and the SOF rotor's missing lower mast.
for (const affiliation of ["U", "F", "N", "H"]) {
  for (const role of ["C", "U"]) {
    for (const weight of ["L", "M", "H"]) {
      const code = `AMF${role}${weight}--`;
      const labels = parts(code, affiliation).filter((p) => p.type === "text");
      result[`Annex D air role above weight ${code}/${affiliation}`] = [
        labels.map((p) => [p.text, p.y, p.fontsize]),
        [
          [
            role,
            { U: 67, F: 70, N: 69, H: 64 }[affiliation],
            { U: 55, F: 55, N: 60, H: 58 }[affiliation]
          ],
          [weight, 134, 28]
        ]
      ];
      result[`later air role retained ${code}/${affiliation}`] = [
        parts(code, affiliation, "APP6")
          .filter((p) => p.type === "text")
          .map((p) => [p.y, p.fontsize]),
        [
          [103, 45],
          [134, 28]
        ]
      ];
    }
  }
  result[`Annex D rotary UAV broad chevron ${affiliation}`] = [
    parts("AMHQ---", affiliation).some(
      (p) => p.d === "M70,62 100,76 130,62 V74 L100,89 70,74 Z"
    ),
    true
  ];
  result[`Annex D ASW station tall upper rectangle ${affiliation}`] = [
    parts("SSA----", affiliation).some(
      (p) => p.d === "M70,65 H130 V108 H70 Z M100,54 V119"
    ),
    true
  ];
  result[`Annex D person water has separate head and arms ${affiliation}`] = [
    parts("SEP----", affiliation, "APP6A", false).filter(
      (p) => p.type === "path"
    ).length >= 3,
    true
  ];
  result[`Annex D mine-like fine horns ${affiliation}`] = [
    parts("SZM----", affiliation, "APP6A", false).some(
      (p) => p.fill === false && p.strokewidth === 1.5
    ),
    true
  ];
  // Third pass: mast top and hull depth read per frame.
  result[`Annex D conventional submarine long periscope ${affiliation}`] = [
    parts("USC----", affiliation).some((p) =>
      p.d.includes(`M97,${{ U: 53.4, F: 51.3, N: 59.4, H: 53.7 }[affiliation]} H103 V`)
    ),
    true
  ];
  result[`Annex D marine-life slender fish ${affiliation}`] = [
    parts("UNM----", affiliation, "APP6A", false).some((p) =>
      p.d.startsWith("M45,100 71,82")
    ),
    true
  ];
  result[`Annex D SOF rotary lower mast ${affiliation}`] = [
    parts("FAH----", affiliation).some(
      (p) => p.d === "M100,100 V150" && p.fill === false
    ),
    true
  ];
  result[`Annex D SOF support centred equal stack ${affiliation}`] = [
    parts("FGB----", affiliation)
      .filter((p) => p.type === "text")
      .map((p) => [p.text, p.y, p.fontsize]),
    [
      ["SOF", 85, 32],
      ["SPT", 116, 32]
    ]
  ];
}
result["Annex D space-station wheel opaque white"] = [
  parts("PT-----").some((p) => p.fill === "white"),
  true
];
for (const affiliation of ["U", "F", "N", "H"]) {
  const station = parts("PT-----", affiliation);
  result[`Annex D slender station antenna ${affiliation}`] = [
    station.some((p) => p.d === "M77,94 118.1,75.6 121.6,77.5 80.5,95.9 Z"),
    true
  ];
  result[`Annex D station mast above antenna ${affiliation}`] = [
    station.some((p) => p.d === "M98.6,74 V93" && p.fill === false),
    true
  ];
  result[`later station mast unchanged ${affiliation}`] = [
    parts("PT-----", affiliation, "APP6").some((p) => p.d === "M98.6,74 V93"),
    false
  ];
}
result["later space-station wheel remains unfilled"] = [
  parts("PT-----", "F", "APP6").some((p) => p.fill === "white"),
  false
];
result["later marine-life retains original silhouette"] = [
  parts("UNM----", "F", "APP6", false).some(
    (p) => p.d === "m 60,100 20,-20 45,20 15,-10 0,20 -15,-10 -45,20 z"
  ),
  true
];
result["later SOF support retains its role placement"] = [
  parts("FGB----", "F", "APP6")
    .filter((p) => p.type === "text")
    .map((p) => [p.y, p.fontsize]),
  [
    [103, 39],
    [134, 25]
  ]
];
for (const [code, extents] of [
  ["UNM----", [45, 82, 150, 118]],
  ["SZM----", [57, 39, 143, 131]],
  ["AMFCL--", [50, 40, 150, 150]]
]) {
  const symbol = new ms.Symbol(`SF${code[0]}P${code.slice(1)}-----`, {
    standard: "APP6A",
    frame: false,
    strokeWidth: 1
  });
  const [x, y, width, height] = symbol
    .asSVG()
    .match(/viewBox="([^"]+)"/)[1]
    .split(" ")
    .map(Number);
  result[`unframed ${code} geometry fits SVG viewport`] = [
    x <= extents[0] &&
      y <= extents[1] &&
      x + width >= extents[2] &&
      y + height >= extents[3],
    true
  ];
}
ms.reset();
export default { "APP6A selected air, naval and SOF corrections": result };
