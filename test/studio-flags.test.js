import fs from "node:fs";
import { ms, app6a, app6b, std2525d } from "../index.mjs";
import { createCountryFlagPart } from "../studio/country-flags.js";

ms.reset();
ms.addIcons(app6a);
ms.addIcons(app6b);
ms.addIcons(std2525d);

const flags = ["tr", "eu", "np"].map((code) => ({
  code,
  svg: fs.readFileSync(`node_modules/flag-icons/flags/4x3/${code}.svg`, "utf8")
}));
flags.push({code: "nato", svg: fs.readFileSync("studio/flags/nato.svg", "utf8")});
const sidc = "SFGPUCI--------";
const plain = new ms.Symbol(sidc, {
  standard: "APP6A",
  additionalInformation: "A LONG LABEL",
  direction: 90
});
ms.addSymbolPart(createCountryFlagPart(flags));
const flagged = new ms.Symbol(sidc, {
  standard: "APP6A",
  additionalInformation: "A LONG LABEL",
  direction: 90,
  countryFlag: "tr"
});
const small = new ms.Symbol(sidc, { countryFlag: "tr", size: 55 });
const large = new ms.Symbol(sidc, { countryFlag: "tr", size: 110 });
const svg = flagged.asSVG();
const eu = new ms.Symbol("10031000001211000000", { countryFlag: "eu" }).asSVG();
const ids = [...eu.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const references = [...eu.matchAll(/(?:href="#|url\(#)([^"\)]+)/g)].map(
  (match) => match[1]
);
const part = flagged.drawInstructions
  .flat(Infinity)
  .find(
    (item) =>
      item && item.type === "svg" && item.svg.includes('data-country-flag="tr"')
  );

export default {
  "Studio SVG country flags": {
    "flag dimensions match the reference generator at base scale": [
      [
        Number(part.svg.match(/\bwidth="([^"]+)"/)[1]),
        Number(part.svg.match(/\bheight="([^"]+)"/)[1])
      ],
      [57.6, 43.2]
    ],
    "NATO artwork is embedded as self-contained vectors": [
      new ms.Symbol(sidc, {countryFlag: "nato"}).asSVG().includes('data-country-flag="nato"'), true
    ],
    "flag is aligned to the lower right of the frame": [
      Number(part.svg.match(/\by="([^"]+)"/)[1]), flagged.metadata.baseGeometry.bbox.y2 - 10
    ],
    "flag artwork is embedded as vectors in exported SVG": [
      svg.includes('data-country-flag="tr"') &&
        svg.includes("#e30a17") &&
        !/<image\b/.test(svg),
      true
    ],
    "no selection preserves existing rendering exactly": [
      new ms.Symbol(sidc, {
        standard: "APP6A",
        additionalInformation: "A LONG LABEL",
        direction: 90
      }).asSVG(),
      plain.asSVG()
    ],
    "flag never overlaps labels or the direction arrow": [
      Boolean(part) &&
        Number(part.svg.match(/\bx="([^"]+)"/)[1]) > plain.bbox.x2,
      true
    ],
    "export bounds include flag artwork": [
      flagged.getSize().width > plain.getSize().width,
      true
    ],
    "flag scales with the symbol": [
      large.getSize().width,
      small.getSize().width * 2
    ],
    "flag does not modify the SIDC or APP-6A validity": [
      [flagged.options.sidc, flagged.isValid()],
      [sidc, true]
    ],
    "unknown and malformed selections are ignored": [
      ["unknown-code", "__proto__", "<script>alert(1)</script>"].every(
        (countryFlag) =>
          new ms.Symbol(sidc, { standard: "APP6A", countryFlag }).asSVG() ===
          new ms.Symbol(sidc, { standard: "APP6A" }).asSVG()
      ),
      true
    ],
    "EU flag local SVG references survive embedding": [
      references.length > 0 && references.every((id) => ids.includes(id)),
      true
    ],
    "flag remains visible when text labels are hidden": [
      new ms.Symbol(sidc, { countryFlag: "np", infoFields: false })
        .asSVG()
        .includes('data-country-flag="np"'),
      true
    ]
  }
};
