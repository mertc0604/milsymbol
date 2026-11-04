// modifierColor and the palette rules of milsymbol 3.0.5 inside the APP-6A
// profile. Upstream's own cases are in test/color-resolution.test.js.
import { ms, app6a, std2525d } from "../index.mjs";

ms.reset();
ms.addIcons(app6a);
ms.addIcons(std2525d);

const paint = "rgb(1, 2, 3)";
const headquarters = "SFGPUCI---A----";
const svg = (sidc, style) => new ms.Symbol(sidc, style).asSVG();
const app6aSvg = (sidc, style) => svg(sidc, { standard: "APP6A", ...style });

const civilianAircraft = new ms.Symbol("SFAPCF---------", {
  standard: "APP6A"
});
const shared = { Friend: "rgb(9, 9, 9)", Hostile: "rgb(8, 8, 8)" };
const before = JSON.stringify(shared);
new ms.Symbol("SJGPUCI--------", {
  standard: "APP6A",
  frameColor: shared
}).asSVG();

export default {
  "modifierColor in APP-6A": {
    "the HQ staff takes the colour": [
      app6aSvg(headquarters, { modifierColor: paint }).includes(paint),
      true
    ],
    "the echelon takes the colour": [
      app6aSvg("SFGPUCI----F---", { modifierColor: paint }).includes(paint),
      true
    ],
    "a symbol with no modifier stays as it was": [
      app6aSvg("SFGPUCI--------", { modifierColor: paint }),
      app6aSvg("SFGPUCI--------", {})
    ],
    "without the option the symbol stays as it was": [
      app6aSvg(headquarters, { modifierColor: "" }),
      app6aSvg(headquarters, {})
    ],
    "the frame keeps its colour": [
      app6aSvg(headquarters, { modifierColor: paint }).replaceAll(
        paint,
        "black"
      ),
      app6aSvg(headquarters, { modifierColor: "black" })
    ],
    "it wins over a monochrome symbol": [
      app6aSvg(headquarters, {
        modifierColor: paint,
        monoColor: "rgb(4, 5, 6)"
      }).includes(paint),
      true
    ]
  },
  "APP-6A palette after the merge": {
    "civilian symbols keep the identity fill": [
      [
        civilianAircraft.metadata.civilian,
        civilianAircraft.colors.fillColor.Friend ===
          ms.getColorMode("Light").Friend
      ],
      [true, true]
    ],
    "a shared palette is not changed": [JSON.stringify(shared), before],
    "unframed icons keep the identity colour": [
      new ms.Symbol("SFGPUCI--------", { standard: "APP6A", frame: false })
        .colors.iconColor.Friend !== ms.getColorMode("Black").Friend,
      true
    ]
  },
  "modifierColor in the numeric editions": {
    "2525D HQ staff takes the colour": [
      svg("10031002001211000000", {
        standard: "2525",
        modifierColor: paint
      }).includes(paint),
      true
    ]
  }
};
