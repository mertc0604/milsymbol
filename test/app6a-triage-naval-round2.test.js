import { ms, app6a } from "../index.mjs";

ms.reset();
ms.addIcons(app6a);

const result = {};
const flatten = (parts) =>
  parts.flatMap((p) =>
    Array.isArray(p) ? flatten(p) : p ? [p, ...flatten(p.draw || [])] : []
  );
const symbol = (code, affiliation, options = {}) =>
  new ms.Symbol(`S${affiliation}${code[0]}P${code.slice(1)}-----`, {
    standard: "APP6A",
    ...options
  });
// Annex D, PDF pp. 152, 155, 160, 163, 170 and 256: protect the
// selected symbols' visible geometry and clearances, across rendering options.
for (const affiliation of ["U", "F", "N", "H"]) {
  for (const frame of [true, false]) {
    for (const fill of [true, false]) {
      for (const strokeWidth of [1, 3, 6]) {
        const options = { frame, fill, strokeWidth };
        const parts = (code) =>
          flatten(symbol(code, affiliation, options).drawInstructions).filter(
            (p) => p.icon
          );
        const key = `${affiliation}/${frame}/${fill}/${strokeWidth}`;
        const water = parts("GEVUR--");
        result[`water-craft wheels touch the chassis ${key}`] = [
          water
            .filter((p) => p.type === "circle")
            .map((p) => [p.cx, p.cy, p.r]),
          [
            [70, 123, 5],
            [130, 123, 5]
          ]
        ];
        result[`water-craft smooth wave spans the hull ${key}`] = [
          water.some((p) => p.d?.startsWith("M65,99 Q70,91 75,99")),
          true
        ];
        for (const [code, label] of [
          ["SSP----", "PK"],
          ["SNNR---", "RS"]
        ]) {
          const station = parts(code);
          result[`station mast clear of ${label} ${key}`] = [
            station.some((p) => p.d === "M70,65 H130 V108 H70 Z M100,54 V119"),
            true
          ];
          result[`station ${label} below raised rectangle ${key}`] = [
            station
              .filter((p) => p.type === "text")
              .map((p) => [p.text, p.y, p.fontsize]),
            [[label, 138, 28]]
          ];
        }
        const law = parts("SXL----");
        // Third pass (PDF p. 160): narrower keel, broad stripe and a thin line beside it.
        result[`law-enforcement stripe terminates at hull ${key}`] = [
          [
            law.some((p) => p.d === "M80,92 V68.5 H120 V92 H146.7 L124.2,130 H75.7 L53.3,92 Z"),
            law.some((p) => p.d === "M128.3,92 H135.3 L113.2,130 H106.2 Z" && p.stroke === false),
            law.some((p) => p.d === "M123.3,92 L101.2,130" && p.fill === false)
          ],
          [true, true, true]
        ];
        result[`other-submersible deep oval and tall cabin ${key}`] = [
          parts("USO----").some(
            (p) => /^M82,[\d.]+ V[\d.]+ H118 V/.test(p.d || "") && p.d.includes(" 145,") && p.d.includes(" 55,")
          ),
          true
        ];
        const naval = parts("FSN----");
        result[`SOF naval ring and longer lower shaft ${key}`] = [
          naval.some((p) => p.d?.includes("M100,102 V140") && p.fill === false),
          true
        ];
        result[`SOF naval small upright flukes clear the frame ${key}`] = [
          naval.some(
            (p) =>
              p.d ===
                "M74,116 L79,123 V126 Q100,146 121,126 V123 L126,116 V129 Q100,153 74,129 Z" &&
              p.stroke === false
          ),
          true
        ];
        result[`SOF naval label clears anchor ring ${key}`] = [
          naval
            .filter((p) => p.type === "text")
            .map((p) => [p.text, p.y, p.fontsize]),
          [["SOF", 74, 27]]
        ];
      }
    }
  }
  result[`later submersible remains shallow ${affiliation}`] = [
    flatten(
      symbol("USO----", affiliation, { standard: "APP6" }).drawInstructions
    ).some((p) => p.d?.startsWith("m 85,90 0,-10 30,0 0,10")),
    true
  ];
}
ms.reset();
export default { "APP6A second selected naval corrections": result };
