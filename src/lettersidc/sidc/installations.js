import { metadata as metadata_letter } from "../metadata.js";
import { geticons as getIcons_letter } from "../geticons.js";
import icons from "../../iconparts/ground.js";

export default {
  type: "letter",
  getMetadata: metadata_letter,
  getIcons: getIcons_letter,
  iconParts: [icons],
  icons: function installations(sId, bbox, icn, _STD2525) {
    //Adds support for installations
    sId["S-G-I-----"] = [];
    sId["S-G-IR----"] = [icn["GR.IN.IC.RAW MATERIAL PRODUCTION/STORAGE"]];
    sId["S-G-IRM---"] = [icn["GR.IN.IC.MINE"]];
    sId["S-G-IRP---"] = [icn["GR.IC.FF.CLASS III"]];
    sId["S-G-IRN---"] = [icn["GR.IC.CBRN"]];
    sId["S-G-IRNB--"] = [icn["GR.IC.CBRN"], icn["GR.M1.BIOLOGICAL"]];
    sId["S-G-IRNC--"] = [icn["GR.IC.CBRN"], icn["GR.M1.CHEMICAL"]];
    sId["S-G-IRNN--"] = [icn["GR.IC.CBRN"], icn["GR.M1.NUCLEAR"]];
    sId["S-G-IP----"] = [icn["GR.IN.IC.PROCESSING FACILITY"]];
    sId["S-G-IPD---"] = [icn["GR.IC.CBRN"], icn["GR.M1.DECONTAMINATION"]];
    sId["S-G-IE----"] = [icn["GR.IC.EQUIPMENT MANUFACTURE"]];
    sId["S-G-IU----"] = [icn["GR.IN.IC.UTILITY FACILITY"]];
    sId["S-G-IUR---"] = [icn["GR.IN.IC.RESEARCH"]];
    sId["S-G-IUT---"] = [icn["GR.IN.IC.TELECOMMUNICATIONS"]];
    sId["S-G-IUE---"] = [icn["GR.IN.IC.ELECTRIC POWER"]];
    sId["S-G-IUEN--"] = [
      icn["GR.IN.IC.ELECTRIC POWER"],
      icn["GR.IN.IC.ELECTRIC POWER NUCLEAR"],
    ];
    sId["S-G-IUED--"] = [
      icn["GR.IN.IC.ELECTRIC POWER"],
      icn["GR.IN.IC.ELECTRIC POWER DAM"],
    ];
    sId["S-G-IUEF--"] = [
      icn["GR.IN.IC.ELECTRIC POWER"],
      icn["GR.IN.IC.ELECTRIC POWER FOSSIL"],
    ];
    sId["S-G-IUP---"] = [icn["GR.IC.WATER"]];
    sId["S-G-IM----"] = []; // N/A
    sId["S-G-IMF---"] = [icn["GR.IN.IC.ATOMIC ENERGY"]];
    sId["S-G-IMFA--"] = [
      icn["GR.IN.IC.ATOMIC ENERGY"],
      icn["GR.IN.M2.ATOMIC ENERGY REACTOR"],
    ];
    sId["S-G-IMFP--"] = [
      icn["GR.IN.IC.ATOMIC ENERGY"],
      icn["GR.IN.M2.NUCLEAR MATERIAL PRODUCTION"],
    ];
    sId["S-G-IMFPW-"] = [
      icn["GR.IN.IC.ATOMIC ENERGY WEAPONS GRADE"],
      icn["GR.IN.M2.NUCLEAR MATERIAL PRODUCTION"],
    ];
    sId["S-G-IMFS--"] = [
      icn["GR.IN.IC.ATOMIC ENERGY"],
      icn["GR.IN.M2.NUCLEAR MATERIAL STORAGE"],
    ];
    sId["S-G-IMA---"] = [icn["GR.IN.IC.AIRCRAFT PRODUCTION & ASSEMBLY"]];
    sId["S-G-IME---"] = [this.metadata.app6a ? {
      ...icn["GR.IC.FF.CLASS V"],
      // Annex D, PDF p. 265: full-height ammunition-production icon.
      d: "M77,132 V78 C77,49 123,49 123,78 V132 M70,132 H130",
    } : icn["GR.IC.FF.CLASS V"]];
    sId["S-G-IMG---"] = [icn["GR.EQ.TANK"]];
    sId["S-G-IMV---"] = [icn["GR.IC.MAINTENANCE"]];
    sId["S-G-IMN---"] = [icn["GR.EQ.DOZER"]];
    sId["S-G-IMNB--"] = [icn["GR.IN.IC.BRIDGE"]];
    sId["S-G-IMC---"] = [
      icn["GR.IC.CBRN"],
      icn["GR.IN.M2.CHEMICAL & BIOLOGICAL WARFARE"],
    ];
    sId["S-G-IMS---"] = [icn["GR.IC.NAVAL"], icn["GR.IN.M2.SHIP CONSTRUCTION"]];
    sId["S-G-IMM---"] = [icn["GR.IC.MISSILE"]];
    sId["S-G-IG----"] = [icn["GR.I.GOVERNMENT"]];
    sId["S-G-IB----"] = [icn["GR.IN.IC.BASE"]];
    sId["S-G-IBA---"] = [
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.IC.AIRPORT OF DEBARKATION"],
    ];
    if (this.metadata.app6a) {
      // Annex D, PDF 267: one wheel under a wing, not a wheel inside a
      // second airport wheel.
      const [wing, wheel] = icn["GR.IC.AIRPORT OF DEBARKATION"];
      sId["S-G-IBA---"] = [
        { ...wing, d: "M60,78 H139 M59,109 L101,65 M104,85 V143 M78.2,100.8 L129.8,127.2 M78.2,127.2 L129.8,100.8" },
        { ...wheel, cx: 104, cy: 114, r: 29 },
      ];
    }
    sId["S-G-IBN---"] = [icn["GR.IC.NAVAL"]];
    sId["S-G-IT----"] = [icn["GR.IC.TRANSPORTATION"]];
    sId["S-G-IX----"] = [icn["GR.IC.FF.MEDICAL"]];
    sId["S-G-IXH---"] = [icn["GR.IC.FF.MEDICAL TREATMENT FACILITY"]];
    sId["S-G-IRR---"] = sId["S-G-IRSR--"] = [
      icn["GR.IN.IC.SEA SURFACE INSTALLATION, OIL RIG/PLATFORM"],
    ];
  },
};
