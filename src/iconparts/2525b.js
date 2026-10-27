import { defaultProperties } from "./iconparts-functions.js";
import { seaStationIconParts } from "./sea.js";
import { subsurfaceStationIconParts } from "./subsurface.js";

export default function (
  iconParts,
  metadata,
  colors,
  STD2525,
  monoColor,
  alternateMedal
) {
  //  2525B extra icon parts
  /*
  iconParts
  The existing object of icon parts
  
  metadata
  properties object
  
  colors
  color object
  
  STD2525
  Is it 2525 then true, otherwise false
  
  alternateMedal
  true/false for sea mine stuff
  */

  const affiliation = metadata.affiliation || "Friend";
  //If hostile and not monoColor, make it red, otherwise use the iconColor.
  const iconColor = colors.iconColor[affiliation];

  //var numberSIDC = metadata.numberSIDC;
  // Preserve the legacy names for consumers of the 2525B extra module.
  const sea = seaStationIconParts();
  const subsurface = subsurfaceStationIconParts();
  const icn = {
    "2525B.ASWSUB": subsurface["SU.IC.STATION ASW SUBMARINE"],
    "2525B.NCBTT.STN": sea["SE.IC.STATION NONCOMBATANT"],
    "2525B.STN.ASWSHP": sea["SE.IC.STATION ASW SHIP"],
    "2525B.STN.PKT": sea["SE.IC.STATION PICKET"],
    "2525B.STN.RSC": sea["SE.IC.STATION RESCUE"],
    "2525B.STN": sea["SE.IC.STATION"],
    "2525B.SUB.STN": subsurface["SU.IC.STATION"]
  };

  for (const key in icn) {
    if (!icn.hasOwnProperty(key)) continue;
    if (iconParts.hasOwnProperty(key)) console.warn("Override of: " + key);
    defaultProperties.call(this, icn[key], iconColor);
    iconParts[key] = icn[key];
  }
}
