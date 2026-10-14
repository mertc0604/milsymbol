import { ms, app6a, std2525e, lettersea, letteremergencymanagementsymbols } from "../index.mjs";
import { getApp6aFields, app6aCodes } from "../src/lettersidc/metadata.js";
import { app6aCatalog } from "../studio/app6a-catalog.js";

ms.reset();
ms.addIcons(app6a);
ms.setStandard("APP6A");

const result = {
  "catalog count": [app6aCatalog.length, 877],
  "unique catalog IDs": [new Set(app6aCatalog.map((row) => row.id)).size, 877],
  "code set matches catalog": [
    JSON.stringify([...app6aCodes]),
    JSON.stringify(app6aCatalog.map((row) => row.id))
  ]
};
for (const row of app6aCatalog) {
  for (const affiliation of row.affiliation ? [row.affiliation] : ["F", "H", "N", "U"]) {
    for (const status of row.status ? [row.status] : ["P", "A"]) {
      const sidc =
        row.id[0] +
        affiliation +
        row.id[2] +
        status +
        row.id.slice(4) +
        row.modifier.replace(/\*/g, "-") +
        "---";
      const symbol = new ms.Symbol(sidc);
      const svg = symbol.asSVG();
      const size = symbol.getSize();
      result[sidc] = [
        symbol.isValid() &&
          !/NaN|undefined|null/.test(svg) &&
          size.width > 0 &&
          size.height > 0,
        true
      ];
    }
  }
}
for (const modifier of [
  "--",
  "AD",
  "BD",
  "CD",
  "DD",
  "ED",
  "FD",
  "GD",
  "-M",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY"
]) {
  result[`modifier ${modifier}`] = [
    new ms.Symbol(`SFGP${modifier[0] === "M" ? "E-----" : "UCI---"}${modifier}---`).isValid(),
    true
  ];
}
ms.addIcons(std2525e);
for (const sidc of [
  "SFGCUCI--------",
  "SFGPUCI----N---",
  "SFGPUCI---NS---",
  "GFCPOXRD-------",
  "SFGPI----------",
  "SFGPUCI--------EXTRA",
  "130310000012110000000000000000",
  "SFGPUCVUTP-----"
]) {
  result[`reject ${sidc}`] = [new ms.Symbol(sidc).isValid(), false];
}
for (const affiliation of ["U", "F", "N", "H"]) {
  const expected = { U: "rgb(255,255,128)", F: "rgb(128,224,255)", N: "rgb(170,255,170)", H: "rgb(255,128,128)" }[affiliation];
  for (const frame of [true, false]) {
    const symbol = new ms.Symbol(`S${affiliation}SPXMC--------`, { frame });
    const parts = symbol.drawInstructions.flat(Infinity);
    result[`cargo fill ${affiliation}/${frame}`] = [parts.some(p=>p.icon && p.fill === (frame ? "white" : expected)), true];
    result[`cargo label ${affiliation}/${frame}`] = [parts.some(p=>p.icon && p.text === "CA"), true];
  }
}
const civilianPatrol = new ms.Symbol("SFSPXL---------").asSVG();
const civilianAirText = new ms.Symbol("SFAPC----------").drawInstructions.flat(Infinity).find(p=>p && p.icon && p.text === "CIV");
result["APP6A CIV uses solid lettering"] = [civilianAirText.fill, "black"];
result["APP6A CIV has no hollow outline"] = [civilianAirText.stroke, false];
ms.addIcons(letteremergencymanagementsymbols);
result["EMS cannot replace APP6A coast guard icon"] = [new ms.Symbol("SFSPXL---------").asSVG(), civilianPatrol];
for (const [sidc, options, valid] of [
  ["SFGPUCI--------", {higherFormation:"1 DIV", reinforcedReduced:"(+)"}, true],
  ["SFGPUCI--------", {quantity:"3"}, false],
  ["SFSPXMC--------", {higherFormation:"1 DIV"}, false],
  ["SHGPE----------", {signatureEquipment:"!",hostile:"ENY"}, true],
  ["SFGPE----------", {signatureEquipment:"!"}, false],
  ["SFGPUCI--------", {evaluationRating:"F6"}, true],
  ["SFGPUCI--------", {evaluationRating:"G7"}, false],
  ["SFGPUCI--------", {staffComments:"123456789012345678901"}, false],
  ["SFGPUCI--------", {platformType:"modern"}, false],
  ["GFCPCP--------", {higherFormation:"1 DIV"}, false],
  ["GFCPCP--------", {direction:90}, false],
  ["SFGPUCI---MO---", {}, false],
  ["SFSPXMC---ED---", {}, false],
  ["GHCPBWE--------", {quantity:"100",type:"BOMB"}, true],
  ["GFCPBWE--------", {}, false],
  ["SFSPXMC--------", {uniqueDesignation:"A".repeat(22)}, false]
]) result[`Table III ${sidc} ${JSON.stringify(options)}`] = [new ms.Symbol(sidc,options).isValid(), valid];
result["nuclear B field"] = [getApp6aFields("GHCPBWE--------").find(f=>f.key === "quantity").field, "B"];
result["ordinary point only H W Y"] = [getApp6aFields("GFCPPC--------").map(f=>f.field).join(""), "HWY"];
result["short core accepted"] = [new ms.Symbol("SFGPUCI---").isValid(), true];
result["installation flag"] = [
  new ms.Symbol("SFGPI-----H----").metadata.installation,
  true
];
result["feint installation flag"] = [
  new ms.Symbol("SFGPI-----HB---").metadata.feintDummy,
  true
];
result["extended profile failure"] = [
  new ms.Symbol("GFCPOXRD-------").isValid(true).standard,
  false
];
result["explicit APP6 override"] = [
  new ms.Symbol("SFGCUCI--------", { standard: "APP6" }).isValid(),
  true
];
result["explicit 2525 override"] = [
  new ms.Symbol("SFGCUCI--------", { standard: "2525" }).metadata.STD2525,
  true
];
ms.setStandard("2525");
result["global profile cleared"] = [
  new ms.Symbol("SFGCUCI--------").isValid(),
  true
];
result["explicit APP6A override"] = [
  new ms.Symbol("SFGCUCI--------", { standard: "APP6A" }).isValid(),
  false
];
result["NATO style override"] = [
  new ms.Symbol("SFGPUCI--------", { standard: "APP6A" }).metadata.STD2525,
  false
];
ms.setStandard("APP6");
result["APP6 clears edition"] = [
  new ms.Symbol("SFGPUCI--------").metadata.app6a,
  false
];
ms.setStandard("APP6A");
ms.reset();
result["reset clears edition"] = [ms._standardEdition, ""];
ms.addIcons(lettersea);
ms.setStandard("APP6A");
result["APP6A uses normally registered sea module"] = [new ms.Symbol("SFSPXMC--------").isValid(), true];
result["APP6A does not secretly load unregistered air modules"] = [new ms.Symbol("SFAPMF---------").isValid(), false];
ms.reset();

export default { "APP-6A point profile": result };
