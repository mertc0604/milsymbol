import ms from "../index.js";

function iconParts(symbol) {
  const visit = (parts) =>
    parts.flatMap((part) =>
      Array.isArray(part)
        ? visit(part)
        : part
          ? [part, ...visit(part.draw || [])]
          : []
    );
  return visit(symbol.drawInstructions).filter((part) => part.icon);
}
const result = {};
// Independently reviewed Annex D illustrations, PDF pp. 236–268. The exact
// printed SIDCs take priority here where Annex B and Annex D disagree.
for (const affiliation of ["U", "F", "N", "H"]) {
  for (const frame of [true, false]) {
    const parts = (code) =>
      iconParts(
        new ms.Symbol(`S${affiliation}GP${code}-----`, {
          standard: "APP6A",
          frame,
        })
      );
    for (const [code, bars, theatre] of [
      ["EWMA--", 0, false],
      ["EWMAT-", 1, false],
      ["EWMAL-", 2, false],
      ["EWMAI-", 3, false],
      ["EWMAS-", 0, true],
    ]) {
      const p = parts(code);
      result[`Annex D AD launcher crossbars ${code}/${affiliation}/${frame}`] =
        [
          p.filter(
            (x) =>
              x.type === "path" && /^M(?:85|86),\d+ H(?:114|115)$/.test(x.d)
          ).length,
          bars,
        ];
      result[`Annex D AD launcher theatre ${code}/${affiliation}/${frame}`] = [
        p.some((x) => x.type === "text" && x.text === "T"),
        theatre,
      ];
      result[`Annex D flared launcher foot ${code}/${affiliation}/${frame}`] = [
        p.some((x) => x.type === "path" && /H80/.test(x.d)),
        true,
      ];
    }
    for (const [code, bars] of [
      ["EWGR--", 1],
      ["EWGL--", 2],
      ["EWGM--", 3],
      ["EWGH--", 0],
    ]) {
      const p = parts(code);
      result[`Annex D antitank crossbars ${code}/${affiliation}/${frame}`] = [
        p.filter(
          (x) => x.type === "path" && /^M(?:85|86),\d+ H(?:114|115)$/.test(x.d)
        ).length,
        bars,
      ];
      result[`Annex D recoilless upward tip ${code}/${affiliation}/${frame}`] =
        [
          p.some(
            (x) => x.type === "path" && /M85,75 L100,50 L115,75/.test(x.d)
          ),
          code === "EWGH--",
        ];
    }
    for (const code of ["EV----", "EVA---", "EVE---"]) {
      const p = parts(code),
        wheels = p.filter((x) => x.type === "circle");
      result[`Annex D vehicle wheels ${code}/${affiliation}/${frame}`] = [
        wheels.map((x) => [x.cx, x.cy, x.r]),
        [
          [63, 117, 5],
          [137, 117, 5],
        ],
      ];
    }
    result[
      `Annex D light armored wheels clear diamond ${affiliation}/${frame}`
    ] = [
      parts("EVAL--")
        .filter((x) => x.type === "circle")
        .map((x) => [x.cx, x.cy, x.r]),
      [
        [70, 124, 5],
        [100, 124, 5],
        [130, 124, 5],
      ],
    ];
    if (!frame) {
      const svg = new ms.Symbol(`S${affiliation}GPEWMAS------`, {
        standard: "APP6A",
        frame,
      }).asSVG();
      const viewBox = /viewBox="([^"]+)"/.exec(svg)[1].split(" ").map(Number);
      result[`Annex D theatre T is inside unframed viewBox ${affiliation}`] = [
        viewBox[1] + viewBox[3] >= 150,
        true,
      ];
    }
    const trailer = parts("EVEMT-");
    result[`Annex D trailer tall stem ${affiliation}/${frame}`] = [
      trailer.some((x) => x.type === "path" && /M100,50 V80/.test(x.d)),
      true,
    ];
    result[`Annex D trailer wheels below base ${affiliation}/${frame}`] = [
      trailer.filter((x) => x.type === "circle").map((x) => [x.cy, x.r]),
      [
        [122, 5],
        [122, 5],
      ],
    ];
    result[`Annex D volcano raised letter ${affiliation}/${frame}`] = [
      parts("EVEML-")
        .filter((x) => x.type === "text")
        .map((x) => [x.text, x.y, x.fontsize]),
      [["V", 100, 39]],
    ];
  }
  // Third pass: both rings are octagons, centred per frame (PDF pp. 267–268).
  for (const [code, start, ring] of [
    ["IBN---", "M96.5,", { U: 64.5, F: 69.5, N: 67.5, H: 61 }[affiliation] - 8.5],
    ["IMS---", "M97.7,", { U: 60.5, F: 67, N: 65, H: 56.25 }[affiliation] - 5.5],
  ]) {
    const p = iconParts(
      new ms.Symbol(`S${affiliation}GP${code}H----`, { standard: "APP6A" })
    );
    result[`Annex D installation anchor ring ${code}/${affiliation}`] = [
      [p.filter((x) => x.type === "circle").length, p.some((x) => x.fill === false && x.d?.startsWith(`${start}${ring} `))],
      [0, true],
    ];
  }
}
ms.reset();
export default { "APP6A selected equipment and installation drawings": result };
