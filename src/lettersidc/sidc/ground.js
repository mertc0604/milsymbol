import { ms } from "../../ms.js";
import { metadata as metadata_letter } from "../metadata.js";
import { geticons as getIcons_letter } from "../geticons.js";
import icons from "../../iconparts/ground.js";

export default {
  type: "letter",
  getMetadata: metadata_letter,
  getIcons: getIcons_letter,
  iconParts: [icons],
  icons: function ground(sId, bbox, icn, _STD2525) {
    // GROUND ========================================================================
    sId["S-G-------"] = [];
    sId["S-G-U-----"] = [];
    sId["S-G-UC----"] = [icn["GR.IC.COMBAT"]];
    sId["S-G-UCD---"] = [icn["GR.IC.FF.AIR DEFENCE"]];
    sId["S-G-UCDS--"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE SHORT RANGE"]
    ];
    sId["S-G-UCDSC-"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE MISSILE"],
      icn["GR.IC.AIR DEFENSE CHAPARRAL"]
    ];
    sId["S-G-UCDSS-"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE MISSILE"],
      icn["GR.IC.AIR DEFENSE STINGER"]
    ];
    sId["S-G-UCDSV-"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.FF.MAIN GUN SYSTEM"],
      icn["GR.IC.AIR DEFENSE VULCAN"]
    ];
    sId["S-G-UCDM--"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE MISSILE"]
    ];
    sId["S-G-UCDML-"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE MISSILE"],
      icn["GR.IC.MISSILE.LIGHT"]
    ];
    sId["S-G-UCDMLA"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE MISSILE"],
      icn["GR.IC.FF.MOTORIZED"]
    ];
    sId["S-G-UCDMM-"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE MISSILE"],
      icn["GR.IC.MISSILE.MEDIUM"]
    ];
    sId["S-G-UCDMH-"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE MISSILE"],
      icn["GR.IC.MISSILE.HEAVY"]
    ];
    sId["S-G-UCDH--"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE H/MAD"]
    ];
    sId["S-G-UCDHH-"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE MISSILE"],
      icn["GR.IC.AIR DEFENSE H/MAD HAWK"]
    ];
    sId["S-G-UCDHP-"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE MISSILE"],
      icn["GR.IC.AIR DEFENSE H/MAD PATRIOT"]
    ];
    sId["S-G-UCDG--"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE GUN UNIT"]
    ];
    sId["S-G-UCDC--"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE COMPOSITE"]
    ];
    sId["S-G-UCDT--"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE TARGETING UNIT"]
    ];
    sId["S-G-UCDO--"] = [
      icn["GR.IC.FF.AIR DEFENCE"],
      icn["GR.IC.AIR DEFENSE THEATER MISSILE DEFENSE UNIT"]
    ];
    sId["S-G-UCA---"] = [icn["GR.IC.ARMOUR"]];
    sId["S-G-UCAT--"] = [icn["GR.IC.ARMOUR"]];
    sId["S-G-UCATA-"] = [icn["GR.IC.ARMOUR"], icn["GR.M2.AIRBORNE"]];
    sId["S-G-UCATW-"] = [icn["GR.IC.ARMOUR"], icn["GR.IC.FF.AMPHIBIOUS"]];
    sId["S-G-UCATWR"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.FF.AMPHIBIOUS"],
      icn["GR.M2.RECOVERY (MAINTENANCE)"]
    ];
    sId["S-G-UCATL-"] = [icn["GR.IC.ARMOUR"], icn["GR.M2.LIGHT"]];
    sId["S-G-UCATM-"] = [icn["GR.IC.ARMOUR"], icn["GR.M2.MEDIUM"]];
    sId["S-G-UCATH-"] = [icn["GR.IC.ARMOUR"], icn["GR.M2.HEAVY"]];
    sId["S-G-UCATR-"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.M2.RECOVERY (MAINTENANCE)"]
    ];
    sId["S-G-UCAW--"] = [icn["GR.IC.ARMOR, WHEELED"]];
    sId["S-G-UCAWS-"] = [
      icn["GR.IC.ARMOR, WHEELED"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCAWA-"] = [icn["GR.IC.ARMOR, WHEELED"], icn["GR.M2.AIRBORNE"]];
    sId["S-G-UCAWW-"] = [
      icn["GR.IC.ARMOR, WHEELED"],
      icn["GR.IC.FF.AMPHIBIOUS"]
    ];
    sId["S-G-UCAWWR"] = [
      icn["GR.IC.ARMOR, WHEELED"],
      icn["GR.IC.FF.AMPHIBIOUS"],
      icn["GR.M2.RECOVERY (MAINTENANCE)"]
    ];
    sId["S-G-UCAWL-"] = [icn["GR.IC.ARMOR, WHEELED"], icn["GR.M2.LIGHT"]];
    sId["S-G-UCAWM-"] = [icn["GR.IC.ARMOR, WHEELED"], icn["GR.M2.MEDIUM"]];
    sId["S-G-UCAWH-"] = [icn["GR.IC.ARMOR, WHEELED"], icn["GR.M2.HEAVY"]];
    sId["S-G-UCAWR-"] = [
      icn["GR.IC.ARMOR, WHEELED"],
      icn["GR.M2.RECOVERY (MAINTENANCE)"]
    ];
    sId["S-G-UCAA--"] = [icn["GR.IC.FF.ANTITANK/ANTIARMOUR"]];
    sId["S-G-UCAAD-"] = [icn["GR.IC.FF.ANTITANK/ANTIARMOUR"]];
    sId["S-G-UCAAL-"] = [
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"],
      icn["GR.M2.LIGHT"]
    ];
    sId["S-G-UCAAM-"] = [
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"],
      icn["GR.M2.AIRBORNE"]
    ];
    sId["S-G-UCAAS-"] = [
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCAAU-"] = [
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"],
      icn["GR.M2.MOUNTAIN"]
    ];
    sId["S-G-UCAAC-"] = [
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"],
      icn["GR.M2.ARCTIC"]
    ];
    sId["S-G-UCAAA-"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"]
    ];
    sId["S-G-UCAAAT"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"]
    ];
    sId["S-G-UCAAAW"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.M2.WHEELED"],
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"]
    ];
    sId["S-G-UCAAAS"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCAAO-"] = [
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"],
      icn["GR.IC.FF.MOTORIZED"]
    ];
    sId["S-G-UCAAOS"] = [
      icn["GR.IC.FF.ANTITANK/ANTIARMOUR"],
      icn["GR.IC.FF.MOTORIZED"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCV---"] = [icn["GR.IC.AVIATION ROTARY WING"]];
    sId["S-G-UCVF--"] = [icn["GR.IC.AVIATION FIXED WING"]];
    sId["S-G-UCVFU-"] = [
      icn["GR.IC.AVIATION FIXED WING"],
      icn["GR.M1.UTILITY"]
    ];
    sId["S-G-UCVFA-"] = [icn["GR.IC.AVIATION FIXED WING"], icn["GR.M1.ATTACK"]];
    sId["S-G-UCVUTP"] = [icn["GR.IC.AVIATION TACTICAL AIR CONTROL PARTY"]];
    sId["S-G-UCVUFC"] = [icn["GR.IC.AVIATION FORWARD AIR CONTROLLER"]];
    sId["S-G-UCVFR-"] = [icn["GR.IC.AVIATION FIXED WING"], icn["GR.M1.RECON"]];
    sId["S-G-UCVR--"] = _STD2525
      ? [
          icn["GR.IC.AVIATION ROTARY WING"],
          icn["GR.IC.AVIATION ROTARY WING 2525C"]
        ]
      : [icn["GR.IC.AVIATION ROTARY WING"]];
    sId["S-G-UCVRA-"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.ATTACK"]
    ];
    sId["S-G-UCVRS-"] = [icn["GR.IC.AVIATION ROTARY WING"], icn["GR.M1.RECON"]];
    sId["S-G-UCVRW-"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.ANTISUBMARINE WARFARE"]
    ];
    sId["S-G-UCVRU-"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.UTILITY"]
    ];
    sId["S-G-UCVRUL"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.UTILITY"],
      icn["GR.M2.LIGHT"]
    ];
    sId["S-G-UCVRUM"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.UTILITY"],
      icn["GR.M2.MEDIUM"]
    ];
    sId["S-G-UCVRUH"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.UTILITY"],
      icn["GR.M2.HEAVY"]
    ];
    sId["S-G-UCVRUC"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.COMMAND AND CONTROL ROTARY WING"]
    ];
    sId["S-G-UCVRUE"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.MEDEVAC"]
    ];
    sId["S-G-UCVRM-"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.MINE COUNTERMEASURE"]
    ];
    sId["S-G-UCVS--"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.PERSONNEL RECOVERY"]
    ];
    sId["S-G-UCVC--"] = [icn["GR.IC.AVIATION COMPOSITE"]];
    sId["S-G-UCVV--"] = [
      icn["GR.IC.AVIATION FIXED WING"],
      icn["GR.M2.VERTICAL OR SHORT TAKE-OFF AND LANDING "]
    ];
    sId["S-G-UCVU--"] = [icn["GR.IC.UNMANNED SYSTEMS"]];
    sId["S-G-UCVUF-"] = [
      icn["GR.IC.AVIATION FIXED WING"],
      icn["GR.M1.UNMANNED AERIAL VEHICLE"]
    ];
    //1.X.3.1.1.4.6.1.1 WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCVU--'] = [icn['GR.IC.UNMANNED SYSTEMS'],icn['GR.M2.CONTROL']];
    //1.X.3.1.1.4.6.1.2 WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCVU--'] = [icn['GR.IC.UNMANNED SYSTEMS'],icn['GR.M2.LAUNCHER']];
    //1.X.3.1.1.4.6.1.3 WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCVU--'] = [icn['GR.IC.UNMANNED SYSTEMS'],icn['GR.M2.RECOVERY (UNMANNED SYSTEMS)']];
    sId["S-G-UCVUR-"] = [
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.UNMANNED AERIAL VEHICLE"]
    ];
    sId["S-G-UCI---"] = [icn["GR.IC.FF.INFANTRY"]];
    sId["S-G-UCIL--"] = [icn["GR.IC.FF.INFANTRY"], icn["GR.M2.LIGHT"]];
    sId["S-G-UCIM--"] = [icn["GR.IC.FF.INFANTRY"], icn["GR.IC.FF.MOTORIZED"]];
    sId["S-G-UCIO--"] = [icn["GR.IC.FF.INFANTRY"], icn["GR.M2.MOUNTAIN"]];
    sId["S-G-UCIA--"] = [icn["GR.IC.FF.INFANTRY"], icn["GR.M2.AIRBORNE"]];
    sId["S-G-UCIS--"] = [
      icn["GR.IC.FF.INFANTRY"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCIZ--"] = [icn["GR.IC.ARMOUR"], icn["GR.IC.FF.INFANTRY"]];
    sId["S-G-UCIN--"] = [icn["GR.IC.FF.INFANTRY"], icn["GR.IC.FF.NAVAL"]];
    sId["S-G-UCII--"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.FF.INFANTRY"],
      icn["GR.IC.FF.MAIN GUN SYSTEM"]
    ];
    sId["S-G-UCIC--"] = [icn["GR.IC.FF.INFANTRY"], icn["GR.M2.ARCTIC"]];
    //1.X.3.1.1.5.10  WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCIC--'] = [icn['GR.IC.FF.INFANTRY'],icn['GR.M1.SNIPER']];
    sId["S-G-UCE---"] = [icn["GR.IC.ENGINEER"]];
    sId["S-G-UCEC--"] = [icn["GR.IC.ENGINEER"], icn["GR.M1.COMBAT"]];
    sId["S-G-UCECS-"] = [
      icn["GR.IC.ENGINEER"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCECA-"] = [icn["GR.IC.ENGINEER"], icn["GR.M2.AIRBORNE"]];
    sId["S-G-UCECC-"] = [icn["GR.IC.ENGINEER"], icn["GR.M2.ARCTIC"]];
    sId["S-G-UCECL-"] = [
      icn["GR.IC.ENGINEER"],
      icn["GR.M1.COMBAT"],
      icn["GR.M2.LIGHT"]
    ];
    sId["S-G-UCECM-"] = [
      icn["GR.IC.ENGINEER"],
      icn["GR.M1.COMBAT"],
      icn["GR.M2.MEDIUM"]
    ];
    sId["S-G-UCECH-"] = [
      icn["GR.IC.ENGINEER"],
      icn["GR.M1.COMBAT"],
      icn["GR.M2.HEAVY"]
    ];
    sId["S-G-UCECT-"] = [
      icn["GR.IC.ARMOUR"],
      ms._scale(0.7, icn["GR.IC.ENGINEER"], true)
    ];
    sId["S-G-UCECW-"] = [icn["GR.IC.ENGINEER"], icn["GR.IC.FF.MOTORIZED"]];
    sId["S-G-UCECO-"] = [icn["GR.IC.ENGINEER"], icn["GR.M2.MOUNTAIN"]];
    sId["S-G-UCECR-"] = [icn["GR.IC.ENGINEER"], icn["GR.IC.FF.RECONNAISSANCE"]];
    //1.X.3.1.1.6.1.11  WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCEC--'] = [
    //1.X.3.1.1.6.1.12  WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCEC--'] = [
    //1.X.3.1.1.6.1.13  WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCEC--'] = [
    //1.X.3.1.1.6.1.14  WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCEC--'] = [
    sId["S-G-UCEN--"] = [icn["GR.IC.ENGINEER"], icn["GR.M1.CONSTRUCTION"]];
    sId["S-G-UCENN-"] = [icn["GR.IC.ENGINEER"], icn["GR.M1.NAVAL"]];
    sId["S-G-UCF---"] = [icn["GR.IC.FIELD ARTILLERY"]];
    sId["S-G-UCFH--"] = [icn["GR.IC.FIELD ARTILLERY"]];
    sId["S-G-UCFHE-"] = [
      icn["GR.IC.ARMOUR"],
      ms._scale(0.8, icn["GR.IC.FIELD ARTILLERY"])
    ];
    sId["S-G-UCFHS-"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCFHA-"] = [icn["GR.IC.FIELD ARTILLERY"], icn["GR.M2.AIRBORNE"]];
    sId["S-G-UCFHC-"] = [icn["GR.IC.FIELD ARTILLERY"], icn["GR.M2.ARCTIC"]];
    sId["S-G-UCFHO-"] = [icn["GR.IC.FIELD ARTILLERY"], icn["GR.M2.MOUNTAIN"]];
    sId["S-G-UCFHL-"] = [icn["GR.IC.FIELD ARTILLERY"], icn["GR.M2.LIGHT"]];
    sId["S-G-UCFHM-"] = [icn["GR.IC.FIELD ARTILLERY"], icn["GR.M2.MEDIUM"]];
    sId["S-G-UCFHH-"] = [icn["GR.IC.FIELD ARTILLERY"], icn["GR.M2.HEAVY"]];
    sId["S-G-UCFHX-"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.IC.FF.AMPHIBIOUS"]
    ];
    sId["S-G-UCFR--"] = [icn["GR.IC.FF.FIELD ARTILLERY ROCKET"]];
    sId["S-G-UCFRS-"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M1.SINGLE ROCKET LAUNCHER"]
    ];
    sId["S-G-UCFRS-"] = [
      ms._scale(0.8, icn["GR.IC.FIELD ARTILLERY"]),
      icn["GR.M1.SINGLE ROCKET LAUNCHER"],
      _STD2525 ? [] : icn["GR.IC.ARMOUR"]
    ];
    sId["S-G-UCFRSS"] = [
      icn["GR.IC.ARMOUR"],
      ms._scale(0.8, icn["GR.IC.FIELD ARTILLERY"]),
      icn["GR.M1.SINGLE ROCKET LAUNCHER"]
    ];
    sId["S-G-UCFRSR"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M1.SINGLE ROCKET LAUNCHER"],
      icn["GR.M2.TRUCK"]
    ];
    sId["S-G-UCFRST"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M1.SINGLE ROCKET LAUNCHER"],
      icn["GR.M2.TOWED"]
    ];
    sId["S-G-UCFRM-"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M1.MULTIPLE ROCKET LAUNCHER"],
      _STD2525 ? "" : icn["GR.M2.CROSS-COUNTRY TRUCK"]
    ];
    sId["S-G-UCFRMS"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M1.MULTIPLE ROCKET LAUNCHER"]
    ];
    sId["S-G-UCFRMR"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M1.MULTIPLE ROCKET LAUNCHER"],
      icn["GR.M2.TRUCK"]
    ];
    sId["S-G-UCFRMT"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M1.MULTIPLE ROCKET LAUNCHER"],
      icn["GR.M2.TOWED"]
    ];
    sId["S-G-UCFT--"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M2.TARGET ACQUISITION"]
    ];
    sId["S-G-UCFTR-"] = [
      ms._translate(-30, 10, ms._scale(0.6, icn["GR.IC.FIELD ARTILLERY"])),
      icn["GR.IC.RADAR"]
    ];
    sId["S-G-UCFTS-"] = [
      ms._translate(0, 30, ms._scale(0.7, icn["GR.IC.FIELD ARTILLERY"])),
      icn["GR.IC.FF.SOUND"]
    ];
    sId["S-G-UCFTF-"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.M1.OPTICAL"],
      icn["GR.M2.TARGET ACQUISITION"]
    ];
    sId["S-G-UCFTC-"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.IC.FF.MOTORIZED"],
      icn["GR.IC.FF.RECONNAISSANCE"]
    ];
    sId["S-G-UCFTCD"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.IC.FF.RECONNAISSANCE"]
    ];
    sId["S-G-UCFTCM"] = [
      icn["GR.IC.ARMOUR"],
      ms._scale(0.8, icn["GR.IC.FIELD ARTILLERY"]),
      icn["GR.IC.FF.RECONNAISSANCE"]
    ];
    sId["S-G-UCFTA-"] = [
      icn["GR.IC.FIELD ARTILLERY"],
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.IC.AVIATION ROTARY WING"],
      icn["GR.M1.NAVAL"]
    ];
    sId["S-G-UCFM--"] = [icn["GR.IC.MORTAR"]];
    sId["S-G-UCFMS-"] = [icn["GR.IC.MORTAR"], icn["GR.M2.TRACKED"]];
    sId["S-G-UCFMW-"] = sId["S-G-UCFMSW"] = [
      icn["GR.IC.MORTAR"],
      icn["GR.M2.TRUCK"]
    ];
    sId["S-G-UCFMT-"] = [icn["GR.IC.MORTAR"], icn["GR.M2.TOWED"]];
    sId["S-G-UCFMTA"] = [
      icn["GR.IC.MORTAR"],
      icn["GR.M2.TOWED"],
      icn["GR.M2.AIRBORNE"]
    ];
    sId["S-G-UCFMTS"] = [
      icn["GR.IC.MORTAR"],
      icn["GR.M2.TOWED"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCFMTC"] = [icn["GR.IC.MORTAR"], icn["GR.M2.ARCTIC"]];
    sId["S-G-UCFMTO"] = [
      icn["GR.IC.MORTAR"],
      icn["GR.M2.TOWED"],
      icn["GR.M2.MOUNTAIN"]
    ];
    sId["S-G-UCFML-"] = [
      ms._translate(0, -20, icn["GR.IC.MORTAR"]),
      icn["GR.IC.FF.AMPHIBIOUS"]
    ];
    if (this.metadata.app6a) {
      // The full-height mortar is only the unmodified icon. Leave room below
      // it for the mounting and terrain marks in Annex D's composite rows.
      for (const code of ["S-G-UCFMS-", "S-G-UCFMSW", "S-G-UCFMT-", "S-G-UCFMTA", "S-G-UCFMTS", "S-G-UCFMTC", "S-G-UCFMTO"]) {
        const cy = code === "S-G-UCFMTO" || code === "S-G-UCFMTA" ? 104 : 112;
        const tip = code === "S-G-UCFMTS" ? 82 : 54;
        sId[code][0] = [
          { ...icn["GR.IC.MORTAR"][0], cy },
          { ...icn["GR.IC.MORTAR"][1], d: `M100,${cy - 6} V${tip + 4}` },
          ms._translate(0, tip - 54, icn["GR.IC.MORTAR"][2])
        ];
        if (code === "S-G-UCFMTO" || code === "S-G-UCFMTA") {
          sId[code][1] = ms._translate(0, -18, sId[code][1]);
          sId[code][2] = ms._translate(0, 10, ms._scale(0.7, sId[code][2]));
        }
      }
    }
    sId["S-G-UCFS--"] = [icn["GR.IC.SURVEY"]];
    sId["S-G-UCFSS-"] = [
      icn["GR.IC.SURVEY"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCFSA-"] = [icn["GR.IC.SURVEY"], icn["GR.M2.AIRBORNE"]];
    sId["S-G-UCFSL-"] = [icn["GR.IC.SURVEY"], icn["GR.M2.LIGHT"]];
    sId["S-G-UCFSO-"] = [icn["GR.IC.SURVEY"], icn["GR.M2.MOUNTAIN"]];
    sId["S-G-UCFO--"] = [icn["GR.IC.METEOROLOGICAL"]];
    sId["S-G-UCFOS-"] = [
      icn["GR.IC.METEOROLOGICAL"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCFOA-"] = [icn["GR.IC.METEOROLOGICAL"], icn["GR.M2.AIRBORNE"]];
    sId["S-G-UCFOL-"] = [icn["GR.IC.METEOROLOGICAL"], icn["GR.M2.LIGHT"]];
    sId["S-G-UCFOO-"] = [icn["GR.IC.METEOROLOGICAL"], icn["GR.M2.MOUNTAIN"]];
    //1.X.3.1.1.7.7  WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCF---'] = [icn['GR.IC.FIELD ARTILLERY'],icn['GR.M1.FIRE DIRECTION CENTRE']];
    //1.X.3.1.1.7.8  WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UCF---'] = [icn['GR.IC.FIELD ARTILLERY OBSERVER']];
    sId["S-G-UCR---"] = [icn["GR.IC.FF.RECONNAISSANCE"]];
    sId["S-G-UCRH--"] = [icn["GR.IC.FF.HORSE"]];
    sId["S-G-UCRV--"] = [
      icn["GR.IC.FF.RECONNAISSANCE"],
      _STD2525 || this.metadata.app6a ? icn["GR.M2.CAVALRY"] : []
    ];
    sId["S-G-UCRVA-"] = [icn["GR.IC.ARMOUR"], icn["GR.IC.FF.RECONNAISSANCE"]];
    sId["S-G-UCRVM-"] = [
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.IC.FF.MOTORIZED"]
    ];
    sId["S-G-UCRVG-"] = [icn["GR.IC.FF.RECONNAISSANCE"]];
    sId["S-G-UCRVO-"] = [
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.IC.AVIATION ROTARY WING"]
    ];
    sId["S-G-UCRC--"] = [icn["GR.IC.FF.RECONNAISSANCE"], icn["GR.M2.ARCTIC"]];
    sId["S-G-UCRS--"] = [
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.M1.AIRMOBILE/AIR ASSAULT"]
    ];
    sId["S-G-UCRA--"] = [icn["GR.IC.FF.RECONNAISSANCE"], icn["GR.M2.AIRBORNE"]];
    sId["S-G-UCRO--"] = [icn["GR.IC.FF.RECONNAISSANCE"], icn["GR.M2.MOUNTAIN"]];
    sId["S-G-UCRL--"] = sId["S-G-UCRLL-"] = [
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.M2.LIGHT"]
    ];
    sId["S-G-UCRR--"] = [
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.IC.FF.AMPHIBIOUS"]
    ];
    sId["S-G-UCRRD-"] = [
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.IC.FF.AMPHIBIOUS"],
      _STD2525 ? icn["GR.M1.MARINE DIVISION"] : []
    ];
    sId["S-G-UCRRF-"] = [
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.IC.FF.AMPHIBIOUS"],
      icn["GR.M1.FORCE"]
    ];
    sId["S-G-UCRRL-"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.M2.WHEELED"]
    ];
    sId["S-G-UCRX--"] = [
      icn["GR.IC.FF.RECONNAISSANCE"],
      _STD2525 || this.metadata.app6a
        ? icn["GR.M2.LONG RANGE SURVEILLANCE"]
        : [
            ms._translate(0, -20, icn["GR.M2.MOUNTAIN"]),
            icn["GR.M2.LONG RANGE"]
          ]
    ];
    sId["S-G-UCM---"] = [icn["GR.IC.MISSILE"]];
    sId["S-G-UCMT--"] = [icn["GR.IC.MISSILE"], icn["GR.M2.TACTICAL MISSILE"]];
    sId["S-G-UCMS--"] = [icn["GR.IC.MISSILE"], icn["GR.M2.STRATEGIC MISSILE"]];
    sId["S-G-UCS---"] = [icn["GR.IC.SECURITY"]];
    sId["S-G-UCSW--"] = [
      ms._translate(0, -20, icn["GR.IC.SECURITY"]),
      icn["GR.IC.FF.AMPHIBIOUS"]
    ];
    sId["S-G-UCSG--"] = [icn["GR.IC.SECURITY"]];
    sId["S-G-UCSGD-"] = [icn["GR.IC.SECURITY"], icn["GR.IC.FF.INFANTRY"]];
    sId["S-G-UCSGM-"] = [icn["GR.IC.SECURITY"], icn["GR.IC.FF.MOTORIZED"]];
    sId["S-G-UCSGA-"] = [icn["GR.IC.ARMOUR"], icn["GR.IC.SECURITY"]];
    sId["S-G-UCSM--"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.SECURITY"],
      icn["GR.M2.WHEELED"]
    ];
    sId["S-G-UCSR--"] = [icn["GR.IC.SECURITY"], icn["GR.M2.RAILROAD"]];
    sId["S-G-UCSA--"] = [
      ms._translate(0, -20, icn["GR.IC.SECURITY"]),
      icn["GR.IC.AVIATION ROTARY WING"]
    ];
    sId["S-G-F-S---"] = icn["GR.IC.SURVEILLANCE"];
    sId["S-G-UU----"] = [icn["GR.IC.COMBAT SUPPORT"]];
    sId["S-G-UUA---"] = [icn["GR.IC.CBRN"]];
    sId["S-G-UUAC--"] = [icn["GR.IC.CBRN"], icn["GR.M1.CHEMICAL"]];
    sId["S-G-UUACC-"] = [icn["GR.IC.CBRN"], icn["GR.M1.SMOKE/DECON"]];
    sId["S-G-UUACCK"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.CBRN"],
      icn["GR.M1.SMOKE/DECON"]
    ];
    sId["S-G-UUACCM"] = [
      icn["GR.IC.CBRN"],
      icn["GR.M1.SMOKE/DECON"],
      icn["GR.IC.FF.MOTORIZED"]
    ];
    sId["S-G-UUACS-"] = [icn["GR.IC.CBRN"], icn["GR.M1.SMOKE"]];
    sId["S-G-UUACSM"] = [
      icn["GR.IC.CBRN"],
      icn["GR.M1.SMOKE"],
      icn["GR.IC.FF.MOTORIZED"]
    ];
    sId["S-G-UUACSA"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.CBRN"],
      icn["GR.M1.SMOKE"]
    ];
    sId["S-G-UUACR-"] = [
      icn["GR.IC.CBRN"],
      icn["GR.M1.CHEMICAL"],
      icn["GR.IC.FF.RECONNAISSANCE"]
    ];
    sId["S-G-UUACRW"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.CBRN"],
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.M2.WHEELED"]
    ];
    sId["S-G-UUACRS"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.CBRN"],
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.M2.WHEELED"],
      _STD2525 || this.metadata.app6a ? icn["GR.M1.CHEMICAL SURVEILLANCE"] : []
    ];
    if (this.metadata.app6a) {
      // Annex D, PDF 204: in the wheeled recon vehicles the NBC sign stays
      // inside the track, clear of the wheels.
      for (const code of ["S-G-UUACRW", "S-G-UUACRS"]) {
        sId[code] = sId[code].map(part => part === icn["GR.IC.CBRN"]
          ? ms._translate(0, -2, ms._scale(0.52, part)) : part);
      }
    }
    sId["S-G-UUAN--"] = [icn["GR.IC.CBRN"], icn["GR.M1.NUCLEAR"]];
    sId["S-G-UUAB--"] = [icn["GR.IC.CBRN"], icn["GR.M1.BIOLOGICAL"]];
    sId["S-G-UUABR-"] = [
      icn["GR.IC.CBRN"],
      icn["GR.M1.BIOLOGICAL"],
      icn["GR.IC.FF.MOTORIZED"],
      icn["GR.IC.FF.RECONNAISSANCE"]
    ];
    sId["S-G-UUAD--"] = [icn["GR.IC.CBRN"], icn["GR.M1.DECONTAMINATION"]];
    sId["S-G-UUADT-"] = [
      icn["GR.IC.CBRN"],
      icn["GR.M1.DECONTAMINATION"],
      icn["GR.M2.TROOP"]
    ];
    sId["S-G-UUADE-"] = [
      icn["GR.IC.CBRN"],
      icn["GR.M1.DECONTAMINATION"],
      icn["GR.M2.EQUIPMENT"]
    ];
    sId["S-G-UUADET"] = [
      icn["GR.IC.CBRN"],
      icn["GR.M1.DECONTAMINATION"],
      icn["GR.M2.EQUIMENT/TROOP"]
    ];
    sId["S-G-UUAL--"] = [icn["GR.IC.CBRN"], icn["GR.M2.LABORATORY"]];
    sId["S-G-UUM---"] = [icn["GR.IC.MILITARY INTELLIGENCE"]];
    sId["S-G-UUMA--"] = [
      icn["GR.IC.MILITARY INTELLIGENCE"],
      icn["GR.M1.UNMANNED AERIAL VEHICLE"]
    ];
    sId["S-G-UUMS--"] = this.metadata.app6a
      ? [
          { ...icn["GR.IC.MILITARY INTELLIGENCE"], y: 132, fontsize: 30 },
          ms._translate(0, 50, ms._scale(2, { ...icn["GR.M1.SIGNALS INTELLIGENCE"], strokewidth: 1 }))
        ]
      : [
          ms._translate(-30, 0, icn["GR.IC.MILITARY INTELLIGENCE"]),
          icn["GR.IC.RADIO"]
        ];
    sId["S-G-UUMSE-"] = [icn["GR.IC.ELECTRONIC WARFARE"]];
    sId["S-G-UUMSEA"] = [
      icn["GR.IC.ARMOUR"],
      icn["GR.IC.ELECTRONIC WARFARE"],
      icn["GR.IC.FF.RECONNAISSANCE"],
      icn["GR.M2.WHEELED"]
    ];
    sId["S-G-UUMSED"] = [
      icn["GR.IC.ELECTRONIC WARFARE"],
      icn["GR.IC.FF.DIRECTION FINDING"]
    ];
    sId["S-G-UUMSEI"] = [
      icn["GR.IC.ELECTRONIC WARFARE"],
      icn["GR.IC.FF.INTERCEPT"]
    ];
    sId["S-G-UUMSEJ"] = [
      icn["GR.IC.ELECTRONIC WARFARE"],
      icn["GR.IC.FF.JAMMING"]
    ];
    sId["S-G-UUMSET"] = [
      icn["GR.IC.ELECTRONIC WARFARE"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-UUMSEC"] = [
      icn["GR.IC.ELECTRONIC WARFARE"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-UUMC--"] = [icn["GR.IC.COUNTER-INTELLIGENCE"]];
    sId["S-G-UUMR--"] = [icn["GR.IC.MILITARY INTELLIGENCE"]];
    sId["S-G-UUMRG-"] = [
      icn["GR.IC.MILITARY INTELLIGENCE"],
      icn["GR.M1.RADAR"]
    ];
    sId["S-G-UUMRS-"] = [
      ms._translate(0, 30, ms._scale(0.8, icn["GR.IC.MILITARY INTELLIGENCE"])),
      icn["GR.IC.FF.SENSOR"]
    ];
    sId["S-G-UUMRSS"] = [
      ms._translate(0, 30, ms._scale(0.8, icn["GR.IC.MILITARY INTELLIGENCE"])),
      icn["GR.IC.FF.SENSOR"],
      icn["GR.M1.SENSOR CONTROL MODULE"]
    ];
    sId["S-G-UUMRX-"] = [
      icn["GR.IC.MILITARY INTELLIGENCE"],
      icn["GR.M1.GROUND STATION MODULE"]
    ];
    sId["S-G-UUMMO-"] = [
      icn["GR.IC.MILITARY INTELLIGENCE"],
      icn["GR.M1.METEOROLOGICAL"]
    ];
    sId["S-G-UUMO--"] = [
      icn["GR.IC.MILITARY INTELLIGENCE"],
      icn["GR.M1.OPERATIONS"]
    ];
    sId["S-G-UUMT--"] = [
      icn["GR.IC.MILITARY INTELLIGENCE"],
      icn["GR.M1.TACTICAL EXPLOITATION"]
    ];
    // Annex D stacks these two labels with equal prominence, rather than
    // using the later large central MI and small upper modifier.
    if (this.metadata.app6a) {
      for (const code of ["S-G-UUMRX-", "S-G-UUMMO-", "S-G-UUMO--", "S-G-UUMT--"]) {
        sId[code] = [
          { ...sId[code][0], y: 132, fontsize: 30 },
          { ...sId[code][1], y: 84, fontsize: 32 }
        ];
      }
    }
    sId["S-G-UUMQ--"] = [icn["GR.IC.INTERROGATION"]];
    sId["S-G-UUMJ--"] = [icn["GR.IC.JOINT INTELLIGENCE CENTRE"]];
    sId["S-G-UUL---"] = [
      icn["GR.IC.FF.MILITARY POLICE"],
      icn["GR.IC.MILITARY POLICE"]
    ];
    sId["S-G-UULS--"] = [icn["GR.IC.SHORE PATROL"]];
    sId["S-G-UULM--"] = [icn["GR.IC.MILITARY POLICE"]];
    sId["S-G-UULC--"] = [icn["GR.IC.LAW ENFORCEMENT"]];
    sId["S-G-UULF--"] = [
      ms._translate(0, -25, ms._scale(0.8, icn["GR.IC.SHORE PATROL"])),
      icn["GR.IC.AVIATION FIXED WING"]
    ];
    sId["S-G-UULD--"] = [icn["GR.IC.CRIMINAL INVESTIGATION DIVISION"]];
    sId["S-G-UUS---"] = [icn["GR.IC.FF.SIGNAL"]];
    sId["S-G-UUSA--"] = [icn["GR.IC.FF.SIGNAL"], icn["GR.M1.AREA"]];
    sId["S-G-UUSC--"] = [
      icn["GR.IC.FF.SIGNAL"],
      icn["GR.M1.COMMUNICATIONS CONTINGENCY PACKAGE"]
    ];
    sId["S-G-UUSCL-"] = [
      icn["GR.IC.FF.SIGNAL"],
      icn["GR.M1.LARGE COMMUNICATIONS CONTINGENCY PACKAGE"],
      icn["GR.M2.AIRBORNE"]
    ];
    sId["S-G-UUSO--"] = [icn["GR.IC.FF.SIGNAL"], icn["GR.M1.OPERATIONS"]];
    sId["S-G-UUSF--"] = [icn["GR.IC.FF.SIGNAL"], icn["GR.M1.FORWARD"]];
    sId["S-G-UUSM--"] = [
      icn["GR.IC.FF.SIGNAL"],
      icn["GR.M1.MOBILE SUBSCRIBER EQUIPMENT"]
    ];
    sId["S-G-UUSMS-"] = [
      icn["GR.IC.FF.SIGNAL"],
      icn["GR.M1.SMALL EXTENSION NODE"]
    ];
    sId["S-G-UUSML-"] = [
      icn["GR.IC.FF.SIGNAL"],
      icn["GR.M1.LARGE EXTENSION NODE"]
    ];
    sId["S-G-UUSMN-"] = [icn["GR.IC.FF.SIGNAL"], icn["GR.M1.NODE CENTRE"]];
    sId["S-G-UUSR--"] = [icn["GR.IC.FF.SIGNAL"], icn["GR.IC.RADIO"]];
    sId["S-G-UUSRS-"] = [icn["GR.IC.FF.SIGNAL"], icn["GR.I.FF.SATELLITE"]];
    sId["S-G-UUSRT-"] = [
      icn["GR.IC.FF.SIGNAL"],
      icn["GR.IC.RADIO TELETYPE CENTRE"]
    ];
    sId["S-G-UUSRW-"] = [icn["GR.IC.FF.SIGNAL"], icn["GR.IC.RADIO RELAY"]];
    sId["S-G-UUSS--"] = [icn["GR.IC.FF.SIGNAL"], icn["GR.M1.SIGNAL SUPPORT"]];
    sId["S-G-UUSW--"] = [icn["GR.IC.FF.SIGNAL"], icn["GR.IC.TELEPHONE SWITCH"]];
    sId["S-G-UUSX--"] = [icn["GR.IC.ELECTRONIC RANGING"]];
    sId["S-G-UUI---"] = [icn["GR.IC.INFORMATION OPERATIONS"]];
    sId["S-G-UUP---"] = sId["S-G-UUX---"] = [
      icn["GR.IC.FF.AMPHIBIOUS"],
      icn["GR.M1.LANDING SUPPORT"]
    ];
    sId["S-G-UUE---"] = [icn["GR.IC.EXPLOSIVE ORDNANCE DISPOSAL"]];
    sId["S-G-UUT---"] = [icn["GR.IC.TOPOGRAPHIC"]];
    //1.X.3.1.2.9 WRONG SIDC IN STANDARD APP6B
    //sId['S-G-UU----'] = [icn['GR.IC.DOG']];
    sId["S-G-UUD---"] = [icn["GR.IC.DRILLING"]];
    sId["S-G-US----"] = [icn["GR.IC.COMBAT SERVICE SUPPORT"]];
    sId["S-G-USA---"] = [icn["GR.IC.ADMINISTRATIVE"]];
    sId["S-G-USAT--"] = [
      icn["GR.IC.ADMINISTRATIVE"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USAC--"] = [
      icn["GR.IC.ADMINISTRATIVE"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAJ--"] = [icn["GR.IC.JUDGE ADVOCATE GENERAL"]];
    sId["S-G-USAJT-"] = [
      icn["GR.IC.JUDGE ADVOCATE GENERAL"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USAJC-"] = [
      icn["GR.IC.JUDGE ADVOCATE GENERAL"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAO--"] = [icn["GR.IC.POSTAL"]];
    sId["S-G-USAOT-"] = [icn["GR.IC.POSTAL"], icn["GR.IC.FF.THEATRE SUPPORT"]];
    sId["S-G-USAOC-"] = [icn["GR.IC.POSTAL"], icn["GR.IC.FF.CORPS SUPPORT"]];
    sId["S-G-USAF--"] = [icn["GR.IC.FINANCE"]];
    sId["S-G-USAFT-"] = [icn["GR.IC.FINANCE"], icn["GR.IC.FF.THEATRE SUPPORT"]];
    sId["S-G-USAFC-"] = [icn["GR.IC.FINANCE"], icn["GR.IC.FF.CORPS SUPPORT"]];
    sId["S-G-USAS--"] = [icn["GR.IC.PERSONNEL SERVICES"]];
    sId["S-G-USAST-"] = [
      icn["GR.IC.PERSONNEL SERVICES"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USASC-"] = [
      icn["GR.IC.PERSONNEL SERVICES"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAM--"] = [icn["GR.IC.MORTUARY AFFAIRS"]];
    sId["S-G-USAMT-"] = [
      icn["GR.IC.MORTUARY AFFAIRS"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USAMC-"] = [
      icn["GR.IC.MORTUARY AFFAIRS"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAR--"] = [icn["GR.IC.RELIGIOUS SUPPORT"]];
    sId["S-G-USART-"] = [
      icn["GR.IC.RELIGIOUS SUPPORT"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USARC-"] = [
      icn["GR.IC.RELIGIOUS SUPPORT"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAP--"] = [icn["GR.IC.PUBLIC AFFAIRS"]];
    sId["S-G-USAPT-"] = [
      icn["GR.IC.PUBLIC AFFAIRS"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USAPC-"] = [
      icn["GR.IC.PUBLIC AFFAIRS"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAPB-"] = [icn["GR.IC.PUBLIC AFFAIRS BROADCAST"]];
    sId["S-G-USAPBT"] = [
      icn["GR.IC.PUBLIC AFFAIRS BROADCAST"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USAPBC"] = [
      icn["GR.IC.PUBLIC AFFAIRS BROADCAST"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAPM-"] = [icn["GR.IC.JOINT INFORMATION BUREAU"]];
    sId["S-G-USAPMT"] = [
      icn["GR.IC.JOINT INFORMATION BUREAU"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USAPMC"] = [
      icn["GR.IC.JOINT INFORMATION BUREAU"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAX--"] = [icn["GR.IC.REPLACEMENT HOLDING UNIT"]];
    sId["S-G-USAXT-"] = [
      icn["GR.IC.REPLACEMENT HOLDING UNIT"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USAXC-"] = [
      icn["GR.IC.REPLACEMENT HOLDING UNIT"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAL--"] = [icn["GR.IC.LABOUR"]];
    sId["S-G-USALT-"] = [icn["GR.IC.LABOUR"], icn["GR.IC.FF.THEATRE SUPPORT"]];
    sId["S-G-USALC-"] = [icn["GR.IC.LABOUR"], icn["GR.IC.FF.CORPS SUPPORT"]];
    sId["S-G-USAW--"] = [icn["GR.IC.MORALE, WELFARE, AND RECREATION"]];
    sId["S-G-USAWT-"] = [
      icn["GR.IC.MORALE, WELFARE, AND RECREATION"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USAWC-"] = [
      icn["GR.IC.MORALE, WELFARE, AND RECREATION"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USAQ--"] = [icn["GR.IC.QUARTERMASTER"]];
    sId["S-G-USAQT-"] = [
      icn["GR.IC.QUARTERMASTER"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USAQC-"] = [
      icn["GR.IC.QUARTERMASTER"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USM---"] = [icn["GR.IC.FF.MEDICAL"]];
    sId["S-G-USMT--"] = [icn["GR.IC.FF.MEDICAL THEATER"]];
    sId["S-G-USMC--"] = [icn["GR.IC.FF.MEDICAL CORPS"]];
    sId["S-G-USMM--"] = [
      icn["GR.IC.FF.MEDICAL"],
      icn["GR.IC.FF.MEDICAL TREATMENT FACILITY"]
    ];
    sId["S-G-USMMT-"] = [
      icn["GR.IC.FF.MEDICAL THEATER"],
      icn["GR.IC.FF.MEDICAL TREATMENT FACILITY"]
    ];
    sId["S-G-USMMC-"] = [
      icn["GR.IC.FF.MEDICAL CORPS"],
      icn["GR.IC.FF.MEDICAL TREATMENT FACILITY"]
    ];
    sId["S-G-USMV--"] = [icn["GR.IC.FF.MEDICAL"], icn["GR.M2.VETERINARY"]];
    sId["S-G-USMVT-"] = [
      icn["GR.IC.FF.MEDICAL THEATER"],
      icn["GR.M2.VETERINARY"]
    ];
    sId["S-G-USMVC-"] = [
      icn["GR.IC.FF.MEDICAL CORPS"],
      icn["GR.M2.VETERINARY"]
    ];
    sId["S-G-USMD--"] = [icn["GR.IC.FF.MEDICAL"], icn["GR.M2.DENTAL"]];
    sId["S-G-USMDT-"] = [icn["GR.IC.FF.MEDICAL THEATER"], icn["GR.M2.DENTAL"]];
    sId["S-G-USMDC-"] = [icn["GR.IC.FF.MEDICAL CORPS"], icn["GR.M2.DENTAL"]];
    sId["S-G-USMP--"] = [icn["GR.IC.FF.MEDICAL"], icn["GR.M2.PSYCHOLOGICAL"]];
    sId["S-G-USMPT-"] = [
      icn["GR.IC.FF.MEDICAL THEATER"],
      icn["GR.M2.PSYCHOLOGICAL"]
    ];
    sId["S-G-USMPC-"] = [
      icn["GR.IC.FF.MEDICAL CORPS"],
      icn["GR.M2.PSYCHOLOGICAL"]
    ];
    sId["S-G-USS---"] = [icn["GR.IC.FF.SUPPLY"]];
    sId["S-G-USST--"] = [icn["GR.IC.FF.SUPPLY THEATER"]];
    sId["S-G-USSC--"] = [icn["GR.IC.FF.SUPPLY CORPS"]];
    sId["S-G-USS1--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS I"]];
    sId["S-G-USS1T-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS I"]
    ];
    sId["S-G-USS1C-"] = [icn["GR.IC.FF.SUPPLY CORPS"], icn["GR.IC.FF.CLASS I"]];
    sId["S-G-USS2--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS II"]];
    sId["S-G-USS2T-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS II"]
    ];
    sId["S-G-USS2C-"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.FF.CLASS II"]
    ];
    sId["S-G-USS3--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS III"]];
    sId["S-G-USS3T-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS III"]
    ];
    sId["S-G-USS3C-"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.FF.CLASS III"]
    ];
    sId["S-G-USS3A-"] = [
      icn["GR.IC.FF.SUPPLY"],
      icn["GR.IC.FF.CLASS III"],
      ms._translate(25, 5, ms._scale(0.5, icn["GR.IC.AVIATION ROTARY WING"]))
    ];
    sId["S-G-USS3AT"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS III"],
      ms._translate(25, 5, ms._scale(0.5, icn["GR.IC.AVIATION ROTARY WING"]))
    ];
    sId["S-G-USS3AC"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.FF.CLASS III"],
      ms._translate(25, 5, ms._scale(0.5, icn["GR.IC.AVIATION ROTARY WING"]))
    ];
    sId["S-G-USS4--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS IV"]];
    sId["S-G-USS4T-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS IV"]
    ];
    sId["S-G-USS4C-"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.FF.CLASS IV"]
    ];
    sId["S-G-USS5--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS V"]];
    sId["S-G-USS5T-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS V"]
    ];
    sId["S-G-USS5C-"] = [icn["GR.IC.FF.SUPPLY CORPS"], icn["GR.IC.FF.CLASS V"]];
    sId["S-G-USS6--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS VI"]];
    sId["S-G-USS6T-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS VI"]
    ];
    sId["S-G-USS6C-"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.FF.CLASS VI"]
    ];
    sId["S-G-USS7--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS VII"]];
    sId["S-G-USS7T-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS VII"]
    ];
    sId["S-G-USS7C-"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.FF.CLASS VII"]
    ];
    sId["S-G-USS8--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS VIII"]];
    sId["S-G-USS8T-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS VIII"]
    ];
    sId["S-G-USS8C-"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.FF.CLASS VIII"]
    ];
    sId["S-G-USS9--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS IX"]];
    sId["S-G-USS9T-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS IX"]
    ];
    sId["S-G-USS9C-"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.FF.CLASS IX"]
    ];
    sId["S-G-USSX--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.FF.CLASS X"]];
    sId["S-G-USSXT-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.FF.CLASS X"]
    ];
    sId["S-G-USSXC-"] = [icn["GR.IC.FF.SUPPLY CORPS"], icn["GR.IC.FF.CLASS X"]];
    sId["S-G-USSL--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.LAUNDRY/BATH"]];
    sId["S-G-USSLT-"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.LAUNDRY/BATH"]
    ];
    sId["S-G-USSLC-"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.LAUNDRY/BATH"]
    ];
    sId["S-G-USSW--"] = [icn["GR.IC.FF.SUPPLY"], icn["GR.IC.WATER"]];
    sId["S-G-USSWT-"] = [icn["GR.IC.FF.SUPPLY THEATER"], icn["GR.IC.WATER"]];
    sId["S-G-USSWC-"] = [icn["GR.IC.FF.SUPPLY CORPS"], icn["GR.IC.WATER"]];
    sId["S-G-USSWP-"] = [
      icn["GR.IC.FF.SUPPLY"],
      icn["GR.IC.WATER PURIFICATION"]
    ];
    sId["S-G-USSWPT"] = [
      icn["GR.IC.FF.SUPPLY THEATER"],
      icn["GR.IC.WATER PURIFICATION"]
    ];
    sId["S-G-USSWPC"] = [
      icn["GR.IC.FF.SUPPLY CORPS"],
      icn["GR.IC.WATER PURIFICATION"]
    ];
    //1.X.3.1.3.3.15  ANOTHER SIDC THAT DOESN'T WORK OUT...
    //sId['S-G-US----'] = [icn['GR.IC.FF.SUPPLY CORPS'],icn['GR.IC.WATER PURIFICATION']];
    sId["S-G-UST---"] = [icn["GR.IC.TRANSPORTATION"]];
    sId["S-G-USTT--"] = [
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.IC.TRANSPORTATION"]
    ];
    sId["S-G-USTC--"] = [
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.IC.TRANSPORTATION"]
    ];
    sId["S-G-USTM--"] = [
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.M1.MOVEMENT CONTROL CENTRE"]
    ];
    sId["S-G-USTMT-"] = [
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.M1.MOVEMENT CONTROL CENTRE"]
    ];
    sId["S-G-USTMC-"] = [
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.M1.MOVEMENT CONTROL CENTRE"]
    ];
    sId["S-G-USTR--"] = [icn["GR.IC.TRANSPORTATION"], icn["GR.M1.RAILROAD"]];
    sId["S-G-USTRT-"] = [
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.M1.RAILROAD"]
    ];
    sId["S-G-USTRC-"] = [
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.M1.RAILROAD"]
    ];
    sId["S-G-USTS--"] = [icn["GR.IC.TRANSPORTATION"], icn["GR.M1.NAVAL"]];
    sId["S-G-USTST-"] = [
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.M1.NAVAL"]
    ];
    sId["S-G-USTSC-"] = [
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.M1.NAVAL"]
    ];
    sId["S-G-USTA--"] = [
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.IC.AIRPORT OF DEBARKATION"]
    ];
    sId["S-G-USTAT-"] = [
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.IC.AIRPORT OF DEBARKATION"]
    ];
    sId["S-G-USTAC-"] = [
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.IC.AIRPORT OF DEBARKATION"]
    ];
    sId["S-G-USTI--"] = [icn["GR.IC.TRANSPORTATION"], icn["GR.M1.MISSILE"]];
    sId["S-G-USTIT-"] = [
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.M1.MISSILE"]
    ];
    sId["S-G-USTIC-"] = [
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.IC.TRANSPORTATION"],
      icn["GR.M1.MISSILE"]
    ];
    if (this.metadata.app6a) {
      for (const code of ["S-G-USTM--", "S-G-USTMT-", "S-G-USTMC-", "S-G-USTR--", "S-G-USTRT-", "S-G-USTRC-", "S-G-USTS--", "S-G-USTST-", "S-G-USTSC-", "S-G-USTI--", "S-G-USTIT-", "S-G-USTIC-"]) {
        sId[code] = sId[code].map(part => part === icn["GR.IC.TRANSPORTATION"]
          ? ms._translate(0, 20, ms._scale(0.7, part)) : part);
      }
      // The airport primitive already includes its own wheel and spokes.
      for (const code of ["S-G-USTA--", "S-G-USTAT-", "S-G-USTAC-"]) {
        sId[code] = sId[code].map(part => part === icn["GR.IC.TRANSPORTATION"] ? []
          : part === icn["GR.IC.AIRPORT OF DEBARKATION"] ? ms._translate(0, 10, ms._scale(1.4, part)) : part);
      }
    }
    //1.X.3.1.3.4.8 SIDC BROKEN
    //sId['S-G-UST---']
    sId["S-G-USX---"] = [icn["GR.IC.MAINTENANCE"]];
    sId["S-G-USXT--"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.THEATRE SUPPORT"]
    ];
    sId["S-G-USXC--"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.CORPS SUPPORT"]
    ];
    sId["S-G-USXH--"] = [icn["GR.IC.MAINTENANCE"], icn["GR.M2.HEAVY"]];
    sId["S-G-USXHT-"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.M2.HEAVY"]
    ];
    sId["S-G-USXHC-"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.M2.HEAVY"]
    ];
    sId["S-G-USXR--"] = [icn["GR.IC.MAINTENANCE"], icn["GR.M2.RAILROAD"]];
    sId["S-G-USXRT-"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.M2.RAILROAD"]
    ];
    sId["S-G-USXRC-"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.M2.RAILROAD"]
    ];
    sId["S-G-USXO--"] = [icn["GR.IC.MAINTENANCE"], icn["GR.M1.AMMUNITION"]];
    sId["S-G-USXOT-"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.M1.AMMUNITION"]
    ];
    sId["S-G-USXOC-"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.M1.AMMUNITION"]
    ];
    sId["S-G-USXOM-"] = [icn["GR.IC.MAINTENANCE"], icn["GR.M1.MISSILE"]];
    sId["S-G-USXOMT"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.M1.MISSILE"]
    ];
    sId["S-G-USXOMC"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.M1.MISSILE"]
    ];
    sId["S-G-USXE--"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.M1.ELECTRO-OPTICAL"]
    ];
    sId["S-G-USXET-"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.THEATRE SUPPORT"],
      icn["GR.M1.ELECTRO-OPTICAL"]
    ];
    sId["S-G-USXEC-"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.IC.FF.CORPS SUPPORT"],
      icn["GR.M1.ELECTRO-OPTICAL"]
    ];
    if (this.metadata.app6a) {
      // Annex D, PDF 213-215: recovery is a bar with end wheels under the
      // wrench (not railway wheels); the ordnance missile has a centre line.
      const recovery = [
        { ...icn["GR.M2.RAILROAD"][0], d: "M66,110 H134" },
        { ...icn["GR.M2.RAILROAD"][1], cx: 70, cy: 115, r: 4.5 },
        { ...icn["GR.M2.RAILROAD"][4], cx: 130, cy: 115, r: 4.5 }
      ];
      const missile = { ...icn["GR.M1.MISSILE"], d: "M 95,78 V 58 c 0,-5 10,-5 10,0 v 20 M100,54 V78" };
      for (const code of Object.keys(sId)) {
        if (!code.startsWith("S-G-USX")) continue;
        sId[code] = sId[code].flatMap(part => part === icn["GR.M2.RAILROAD"] ? recovery
          : part === icn["GR.M1.MISSILE"] ? [missile] : [part]);
      }
    }
    sId["S-G-USXBDR"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.M2.BATTLE DAMAGE REPAIR"]
    ];
    sId["S-G-USXPM-"] = [
      icn["GR.IC.MAINTENANCE"],
      icn["GR.M2.PREVENTIVE MAINTENANCE"]
    ];
    sId["S-G-USXP--"] = [icn["GR.IC.PIPELINE"]];
    sId["S-G-USXEP-"] = [icn["GR.IC.ENVIRONMENTAL PROTECTION"]];
    sId["S-G-UH----"] = [];
    //1.X.3.1.5 BROKEN SIDC
    sId["S-G-UH1---"] = [icn["GR.IC.FF.HEADQUARTERS OR HEADQUARTERS ELEMENT"]];
    //1.X.3.1.6 BROKEN SIDC
    sId["S-G-UH2---"] = [
      icn["GR.IC.FF.SUPPLY"],
      icn["GR.IC.FF.HEADQUARTERS OR HEADQUARTERS ELEMENT"]
    ];
    sId["S-G-UHGL--"] = sId["S-G-GL----"] = [icn["GR.IC.LIAISON"]];
    if (this.metadata.app6a) {
      // Selected Annex D corrections. These compositions belong to APP-6A:
      // later editions deliberately keep their own sizes and modifier positions.
      const line = d => ({ ...icn["GR.IC.ENGINEER"], d });
      const dot = (cx, cy, r, hollow = false) => ({
        ...icn["GR.IC.FIELD ARTILLERY"], cx, cy, r,
        ...(hollow ? { fill: false } : {})
      });
      const label = (text, x, y, fontsize) => ({
        ...icn["GR.IC.SECURITY"], text, x, y, fontsize
      });
      const track = line("M125,75 C156,75 156,124 125,124 H75 C44,124 44,75 75,75 Z");
      const wheels = [63, 100, 137].map(x => dot(x, 115, 4.5, true));
      const wheelTrack = line("M120,68 C149,68 149,109 120,109 H80 C51,109 51,68 80,68 Z");
      const put = (code, ...parts) => { sId[`S-G-${code}`] = parts; };
      const identity = this.metadata.affiliation;
      // Annex D's waterline is a smooth wave; the generic primitive has
      // squared transitions and a different vertical placement.
      const wave = (y = 100) => {
        const [left, right] = {
          Unknown: y > 115 ? [42, 158] : [30, 170], Friend: [25, 175], Neutral: [45, 155], Hostile: [28 + Math.abs(y - 100), 172 - Math.abs(y - 100)]
        }[identity];
        const step = (right - left) / 7;
        let d = `M${left},${y}`;
        for (let i = 0; i < 7; i++) {
          const x = left + step * i;
          const bend = y + (i % 2 ? 12 : -12);
          d += ` C${x + step / 3},${bend} ${x + 2 * step / 3},${bend} ${x + step},${y}`;
        }
        return line(d);
      };
      put("UCDS--", icn["GR.IC.FF.AIR DEFENCE"], label("SRD", 100, { Unknown: 91, Friend: 107, Neutral: 115, Hostile: 90 }[identity], 32));
      put("UCDO--", icn["GR.IC.FF.AIR DEFENCE"], label("TMD", 100, { Unknown: 91, Friend: 107, Neutral: 115, Hostile: 90 }[identity], 32));
      put("UCDSV-", icn["GR.IC.FF.AIR DEFENCE"], icn["GR.IC.FF.MAIN GUN SYSTEM"],
        line("M116,62 C139,62 139,94 116,94 H84 C61,94 61,62 84,62 Z"), label("V", 100, 80, 25));
      put("UCATA-", ms._translate(0, -10, icn["GR.IC.ARMOUR"]),
        line("M63,125 C63,109 100,109 100,125 C100,109 137,109 137,125"));
      put("UCATW-", track, wave());
      put("UCATWR", track, wave(), line("M80,132 H120 M76,125 C86,125 86,139 76,139 M124,125 C114,125 114,139 124,139"));
      put("UCAWL-", wheelTrack, wheels, label("L", 100, 136, 28));
      // The air-assault V is inside the antitank triangle in Annex D.
      put("UCAAS-", icn["GR.IC.FF.ANTITANK/ANTIARMOUR"], line(`M${{ Unknown: 78.38, Friend: 77.04, Neutral: 81.31, Hostile: 79.61 }[identity]},82 100,113 ${{ Unknown: 121.62, Friend: 122.96, Neutral: 118.69, Hostile: 120.39 }[identity]},82`));
      put("UCVV--", ms._translate(0, -15, ms._scale(1.05, icn["GR.IC.AVIATION FIXED WING"])),
        label("VSTOL", 100, 114, 24));
      const unmanned = { ...icn["GR.M1.UNMANNED AERIAL VEHICLE"],
        d: "M70,67 100,86 130,67 V75 L100,97 70,75 Z" };
      put("UCVUF-", icn["GR.IC.AVIATION FIXED WING"], unmanned);
      put("UCVUR-", icn["GR.IC.AVIATION ROTARY WING"], unmanned);
      put("UCEC--", ms._translate(0, 14, ms._scale(0.85, icn["GR.IC.ENGINEER"])), label("CBT", 100, 79, 30));
      put("UCEN--", ms._translate(0, 23, ms._scale(0.7, icn["GR.IC.ENGINEER"])), label("CONST", 100, 96, 25));
      put("UCENN-", ms._translate(0, 22, ms._scale(0.7, icn["GR.IC.ENGINEER"])),
        line("M100,62 V103 M80,67 H120 M75,84 C75,99 88,106 100,106 C112,106 125,99 125,84 M75,84 78,97 85,93 M125,84 122,97 115,93"), dot(100, 57, 5, true));
      // PDF 191–192: the chevrons of tracked launchers sit INSIDE the
      // track, above their dot. Towed and truck dots sit on the wheel bar.
      const trackedRocket = (code, multiple) => put(code, track,
        line(multiple ? "M83,105 100,89 117,105 M83,96 100,80 117,96" : "M83,98 100,82 117,98"), dot(100, 110, 9));
      trackedRocket("UCFRS-", true);
      trackedRocket("UCFRSS", false);
      trackedRocket("UCFRMS", true);
      const rocket = (code, multiple, mounting) => put(code,
        line(multiple ? "M77,91 100,68 123,91 M77,81 100,58 123,81" : "M77,87 100,64 123,87"),
        dot(100, 101, 12), mounting);
      const truck = [line("M60,114 H140"), dot(65, 119, 4.5, true), dot(135, 119, 4.5, true)];
      const crossCountry = [line("M60,114 H140"), ...[65, 100, 135].map(x => dot(x, 119, 4.5, true))];
      const towed = [line("M68,114 H132"), dot(64, 114, 4.5, true), dot(136, 114, 4.5, true)];
      rocket("UCFRSR", false, truck);
      rocket("UCFRST", false, towed);
      rocket("UCFRM-", true, crossCountry);
      rocket("UCFRMR", true, truck);
      rocket("UCFRMT", true, towed);
      const mortar = (cy, tip) => [dot(100, cy, 6, true), line(`M100,${cy - 6} V${tip + 5}`),
        { ...icn["GR.IC.AVIATION ROTARY WING"], d: `M100,${tip} 95,${tip + 13} 105,${tip + 13} Z` }];
      put("UCFMS-", mortar(105, 56), line("M72,111 H128 C149,111 149,130 128,130 H72 C51,130 51,111 72,111 Z"));
      put("UCFMTS", mortar(110, 77), towed, line("M91,57 100,78 109,57"));
      put("UCFML-", mortar(120, 53), wave(125));
      put("UCRRF-", icn["GR.IC.FF.RECONNAISSANCE"], wave(), label("F", 83, 80, 30));
      put("UCRRL-", ms._translate(0, -1, ms._scale(0.88, track)), icn["GR.IC.FF.RECONNAISSANCE"], wheels.map(p => ({ ...p, cy: 121 })));
      put("UCSW--", label("SEC", 100, 100, 33), wave(128));
      put("UUACCK", track, icn["GR.IC.CBRN"], label("SD", 100, 65, 24));
      put("UUACSA", track, icn["GR.IC.CBRN"], label("S", 100, 65, 27));
      const chemical = ms._translate(0, -2, ms._scale(0.72, icn["GR.IC.CBRN"]));
      put("UUACRW", wheelTrack, chemical, icn["GR.IC.FF.RECONNAISSANCE"], wheels);
      put("UUACRS", wheelTrack, ms._translate(0, 5, ms._scale(0.7, chemical)),
        icn["GR.IC.FF.RECONNAISSANCE"], wheels, label("RS", 100, 79, 18));
      put("UUMA--", { ...unmanned, d: "M70,70 100,87 130,70 V77 L100,98 70,77 Z" }, label("MI", 100, 128, 36));
      put("UUMSEA", wheelTrack, label("EW", 88, 90, 27), icn["GR.IC.FF.RECONNAISSANCE"], wheels);
      put("UUMRG-", line("M74,65 C70,94 84,108 117,108 M76,87 102,65 V86 L129,65"), label("MI", 100, 132, 36));
      for (const [code, text] of [["UUSC--", "CCP"], ["UUSCL-", "LCCP"], ["UUSO--", "OPS"], ["UUSMN-", "NC"], ["UUSS--", "SPT"]]) {
        put(code, icn["GR.IC.FF.SIGNAL"], label(text, { Unknown: 123, Friend: 128, Neutral: 126, Hostile: 116 }[identity], identity === "Unknown" || identity === "Hostile" ? 85 : 80, text.length === 4 ? 21 : 23));
      }
      sId["S-G-UUSCL-"].push(line("M70,133 C70,119 100,119 100,133 C100,119 130,119 130,133"));
      // Radio and relay antennae occupy most of the frame height; their
      // circular bases are separate from the diagonal signal bolt.
      put("UUSR--", icn["GR.IC.FF.SIGNAL"], line("M100,121 V64 M73,72 82,64 91,72 100,64 109,72 118,64 127,72"), dot(100, 135, 14, true));
      put("UUSRT-", icn["GR.IC.FF.SIGNAL"], line("M100,140 V65 M73,65 H127 M82,76 H118"), label("C", 100, 134, 35));
      put("UUSRW-", icn["GR.IC.FF.SIGNAL"], line("M100,121 V65 M78,65 H122 M100,88 H86 L100,113"), dot(100, 135, 14, true));
      put("USAPBC", icn["GR.IC.FF.CORPS SUPPORT"], label("BPAD", 100, 103, 29));
      // Annex D support chevrons enter only a narrow strip at each side.
      const support = side => {
        const [left, right, top, bottom, inset] = {
          Unknown: [40, 160, 75, 125, 12], Friend: [25, 175, 50, 150, 18],
          Neutral: [45, 155, 50, 150, 12], Hostile: [50, 150, 80, 120, 12]
        }[identity];
        let d = "";
        if (side === "T") d += ` M${left},${top} L${left + inset},100 ${left},${bottom}`;
        if (side) d += ` M${right},${top} L${right - inset},100 ${right},${bottom}`;
        return line(d);
      };
      const supply = side => {
        const [left, right, y] = { Unknown: [42, 158, 120], Friend: [25, 175, 125], Neutral: [45, 155, 125], Hostile: [50, 150, 120] }[identity];
        const inset = side ? (identity === "Friend" ? 9 : identity === "Neutral" ? 6 : 0) : 0;
        return line(`M${left + (side === "T" ? inset : 0)},${y} H${right - inset} ${support(side).d}`);
      };
      put("USS3AT", supply("T"), line("M100,125 V102 L80,67 H120 L100,102"),
        ms._translate(28, 6, ms._scale(0.4, icn["GR.IC.AVIATION ROTARY WING"])));
      for (const [code, side] of [["USS4--", ""], ["USS4T-", "T"], ["USS4C-", "C"]]) {
        put(code, supply(side), line("M62,113 V78 H138 V113 M100,78 V102"));
      }
      put("USS5--", supply(""), line("M82,119 V77 C82,56 118,56 118,77 V119 M77,119 H123"));
      const medicalSupply = side => {
        const [top, bottom, left, right] = {
          Unknown: [31, 120, side === "T" ? 48 : 29, 152],
          Friend: [50, 125, side === "T" ? 40 : 25, 160],
          Neutral: [45, 125, side === "T" ? 55 : 45, 145],
          Hostile: [28, 120, side === "T" ? 57 : 36, 143]
        }[identity];
        return line(`M100,${top} V${bottom} M${left},92 H${right}`);
      };
      put("USS8T-", supply("T"), medicalSupply("T"));
      put("USSWPT", supply("T"), line("M60,85 H111 C124,85 135,98 135,111 M93,77 H117 M105,77 V85"), label("PURE", 100, 105, 20));
      put("UCECS-", ms._translate(0, 10, ms._scale(0.85, icn["GR.IC.ENGINEER"])), line("M83,60 100,95.55 117,60"));
      put("UCSM--", wheelTrack, wheels, label("SEC", 100, 91, 29));
      put("UCSR--", label("SEC", 100, 96, 32), line("M60,110 H140"),
        ...[65, 75, 125, 135].map(x => dot(x, 115, 4.5, true)));
      put("USS8C-", supply("C"), medicalSupply("C"));
      const airport = [line("M62,77 H138 M62,99 106,53 M100,90 V144 M76,103 124,131 M76,131 124,103"), dot(100, 117, 27, true)];
      put("USTA--", airport);
      put("USTAT-", support("T"), airport);
      put("USTAC-", support("C"), airport);
      // Preserve shared primitives: clone only the selected compositions
      // before applying Annex D's fine interior strokes.
      const fine = part => Array.isArray(part) ? part.map(fine) : part ? {
        ...part,
        ...(part.type === "path" || part.type === "circle" ? { strokewidth: 1.3, non_scaling_stroke: 1 } : {}),
        ...(part.draw ? { draw: fine(part.draw) } : {})
      } : part;
      for (const code of ["UCDS--", "UCDSV-", "UCDO--", "UCATA-", "UCATW-", "UCATWR", "UCAWL-", "UCAAS-", "UCVV--", "UCVUF-", "UCVUR-", "UCEC--", "UCEN--", "UCENN-", "UCFRS-", "UCFRSS", "UCFRSR", "UCFRST", "UCFRM-", "UCFRMS", "UCFRMR", "UCFRMT", "UCFMS-", "UCFMTS", "UCFML-", "UCRRF-", "UCRRL-", "UCSW--", "UUACCK", "UUACSA", "UUACRW", "UUACRS", "UUMA--", "UUMSEA", "UUMRG-", "UUSC--", "UUSCL-", "UUSO--", "UUSMN-", "UUSR--", "UUSRT-", "UUSRW-", "UUSS--", "USAPBC", "USS3AT", "USS4--", "USS4T-", "USS4C-", "USS5--", "USS8T-", "USSWPT", "UCECS-", "UCSM--", "UCSR--", "USS8C-", "USTA--", "USTAT-", "USTAC-"]) {
        sId[`S-G-${code}`] = fine(sId[`S-G-${code}`]);
      }
      if (!this.metadata.frame) {
        // Unframed icons otherwise use the generic 50..150 viewport. Expand
        // only selected compositions whose Annex D geometry reaches beyond it.
        const extend = (codes, [x1, y1, x2, y2]) => {
          if (x1 >= 50 && y1 >= 50 && x2 <= 150 && y2 <= 150) return;
          for (const code of codes) {
            const previous = bbox[`S-G-${code}`] || { x1: 50, y1: 50, x2: 150, y2: 150 };
            bbox[`S-G-${code}`] = {
              x1: Math.min(previous.x1, x1), y1: Math.min(previous.y1, y1),
              x2: Math.max(previous.x2, x2), y2: Math.max(previous.y2, y2)
            };
          }
        };
        extend(["UCDS--", "UCDSV-", "UCDO--"], {
          Unknown: [45, 50, 155, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [49, 50, 151, 150]
        }[identity]);
        extend(["UCATW-", "UCATWR", "UCRRF-"], {
          Unknown: [28, 50, 172, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [28, 50, 172, 150]
        }[identity]);
        extend(["UCFML-", "UCSW--"], {
          Unknown: [42, 50, 158, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 50, 155, 150], Hostile: [50, 50, 150, 150]
        }[identity]);
        extend(["UCAAS-"], {
          Unknown: [50, 33, 150, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 47, 155, 150], Hostile: [50, 30, 150, 150]
        }[identity]);
        extend(["UCRRL-", "UUACRW", "UUACRS", "UUMSEA"], {
          Unknown: [50, 50, 150, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [50, 50, 150, 150]
        }[identity]);
        extend(["UUSC--", "UUSCL-", "UUSO--", "UUSMN-", "UUSR--", "UUSRT-", "UUSRW-", "UUSS--"], {
          Unknown: [50, 50, 154, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [50, 50, 150, 150]
        }[identity]);
        extend(["UUSRT-"], [50, 50, 150, 152]);
        extend(["USAPBC", "USS3AT", "USS4--", "USS4T-", "USS4C-", "USS5--", "USS8T-", "USSWPT", "USS8C-", "USTAT-", "USTAC-"], {
          Unknown: [40, 50, 160, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 50, 155, 150], Hostile: [50, 50, 150, 150]
        }[identity]);
        extend(["USS8T-", "USS8C-"], [50, { Unknown: 31, Friend: 50, Neutral: 45, Hostile: 28 }[identity], 150, 150]);
        extend(["USS8C-"], [{ Unknown: 29, Friend: 25, Neutral: 45, Hostile: 36 }[identity], 50, 150, 150]);
      }
    }
  }
};
