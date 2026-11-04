import { ms } from "../src/milsymbol.js";
import { std2525e } from "../src/numbersidc.js";

ms.reset();
ms.addIcons(std2525e);
ms.setStandard("2525");

// 2525E Change 1 Table A-LX PDF 158/141: position 23 of an edition E SIDC.
const landUnit = (identity, frameShape) =>
  `130${identity}1000001211000000` + `00${frameShape}0000000`;
const seaSurface = (identity) => `130${identity}3000001200000000` + "000000000" + "0";
const frameOnly = (sidc) => new ms.Symbol(sidc, { icon: false }).asSVG();
const identities = { friend: "3", hostile: "6", neutral: "4", unknown: "1" };

const sameFrame = {};
for (const [name, digit] of Object.entries(identities))
  sameFrame[`a ${name} land unit with code A draws the ${name} sea surface frame`] = [
    frameOnly(landUnit(digit, "A")),
    frameOnly(seaSurface(digit))
  ];

const sea = new ms.Symbol(landUnit("3", "A"), {});

export default {
  "2525E frame shape A": {
    "keeps a frame": [sea.getMetadata().frame, true],
    "is a sea surface frame": [sea.getMetadata().dimension, "Sea"],
    "is a valid code": [sea.isValid(), true],
    "the frame differs from the land unit's own": [
      frameOnly(landUnit("3", "A")) === frameOnly(landUnit("3", "0")),
      false
    ],
    ...sameFrame
  }
};
