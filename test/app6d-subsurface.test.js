import { ms } from "../src/milsymbol.js";
ms.reset();
import { app6d } from "stanag-app6";
import verify from "./number-sidc.js";
ms.setStandard("APP6");

import { subsurface as icons } from "../src/numbersidc.js";
ms.addIcons(icons);

// Identity restrictions the symbol table does not carry (APP-6(D) Edition D Version 1):
// Table 5-5 PDF 316/5-28 and Table 5-13 PDF 337/5-49 (fused, ETC/POSCON: Pending, 0);
// Table 5-10 PDF 331/5-43 (IED: Hostile, 6).
const identityFor = (set, code) =>
  (set === "30" && code === "160000") ||
  (set === "35" && ["140000", "150000"].includes(code))
    ? "0"
    : set === "35" && code === "130200"
      ? "6"
      : "3";

export default verify(ms, app6d["35"], identityFor);
