import { ms, app6d, std2525d, std2525e } from "../index.mjs";

ms.reset();
ms.addIcons(app6d);
ms.addIcons(std2525d);
ms.addIcons(std2525e);

const core = "10031000001211000102";
const baseline = new ms.Symbol(core, {standard: "APP6"});
const countryCodes = ["004", "276", "792", "840"];
const symbols = countryCodes.map((country) => new ms.Symbol(core + country + "1234567", {standard: "APP6"}));
const eSymbol = new ms.Symbol("13" + core.slice(2) + "1200000840", {standard: "2525"});

export default {
  "Numeric edition country fields": {
    "APP6D national originator digits do not change core symbol artwork": [
      symbols.every((symbol) => symbol.asSVG() === baseline.asSVG()), true
    ],
    "APP6D country fields cannot replace sector modifiers": [
      symbols.map((symbol) => [symbol.metadata._modifier1, symbol.metadata._modifier2]),
      countryCodes.map(() => ["001", "002"])
    ],
    "2525D national extension does not change core artwork either": [
      new ms.Symbol(core + "7921234567", {standard: "2525"}).asSVG(),
      new ms.Symbol(core, {standard: "2525"}).asSVG()
    ],
    "2525E keeps its own common modifier fields": [
      [eSymbol.metadata._modifier1, eSymbol.metadata._modifier2], ["101", "202"]
    ]
  }
};
