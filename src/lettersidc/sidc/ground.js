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
        // Annex D draws the Neutral supply bar lower than the other frames.
        const [left, right, y] = { Unknown: [42, 158, 120], Friend: [25, 175, 125], Neutral: [45, 155, 136], Hostile: [50, 150, 120] }[identity];
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
      // Further selected Annex D rows (PDF 175–224). Keep these changes
      // local to their APP-6A composition instead of changing shared icons.
      const round2 = ["UCDH--", "UCAWS-", "UCAWW-", "UCAWWR", "UCAAAS", "UCAAOS", "UCFHX-", "UCFMT-", "UCRV--", "UCRR--", "UCRRD-", "UUACCM", "UUMSED", "UUMSEI", "UUSA--", "UUSF--", "UUSM--", "UUSMS-", "UUSML-", "UUX---", "USMVT-", "USS3AC"];
      put("UCDH--", icn["GR.IC.FF.AIR DEFENCE"], label("HMD", 100,
        { Unknown: 91, Friend: 107, Neutral: 115, Hostile: 90 }[identity], 32));
      const wheeledTrack = line("M120,80 C144,80 144,117 120,117 H80 C56,117 56,80 80,80 Z");
      const lowerWheels = [65, 100, 135].map(x => dot(x, 123, 4.5, true));
      put("UCAWS-", wheeledTrack, lowerWheels, line("M81,62 100,94 119,62"));
      put("UCAWW-", wheeledTrack, lowerWheels, wave());
      put("UCAWWR", wheeledTrack, lowerWheels, wave(),
        line("M82,137 H118 M77,131 C86,131 86,143 77,143 M123,131 C114,131 114,143 123,143"));
      for (const code of ["UCAAAS", "UCAAOS"]) {
        put(code, ...(code === "UCAAAS" ? [track] : [icn["GR.IC.FF.MOTORIZED"]]),
          ...sId["S-G-UCAAS-"]);
      }
      put("UCFHX-", dot(100, 100, 10), wave());
      put("UCFMT-", mortar(107, 54), towed);
      put("UCRV--", line(icn["GR.IC.FF.RECONNAISSANCE"].d), label("CAV", 110, 126, 29));
      for (const code of ["UCRR--", "UCRRD-"]) put(code, icn["GR.IC.FF.RECONNAISSANCE"], wave());
      put("UUACCM", icn["GR.IC.FF.MOTORIZED"],
        line("M70,96 C94,90 114,108 114,145 M130,96 C106,90 86,108 86,145"),
        dot(70, 96, 7), dot(130, 96, 7), label("SD", 80, 79, 26));
      const ewLabels = y => [label("E", 74, y, 36), label("W", 126, y, 36)];
      const ewTop = { Unknown: 49, Friend: 52, Neutral: 48, Hostile: 49 }[identity];
      const ewBottom = { Unknown: 153, Friend: 147, Neutral: 151, Hostile: 153 }[identity];
      put("UUMSED", line(`M100,${ewTop} V${ewBottom} M60,90 100,${ewTop} 140,90`), ewLabels(115));
      put("UUMSEI", line(`M100,${ewTop} V112`), ewLabels(94),
        { ...icn["GR.IC.AVIATION ROTARY WING"], d: "M63,112 H137 L100,148 Z" });
      for (const [code, text] of [["UUSA--", "AREA"], ["UUSF--", "FWD"], ["UUSM--", "MSE"], ["UUSMS-", "SEN"], ["UUSML-", "LEN"]]) {
        put(code, icn["GR.IC.FF.SIGNAL"], label(text,
          { Unknown: 110, Friend: 135, Neutral: 118, Hostile: 110 }[identity],
          identity === "Unknown" || identity === "Hostile" ? 85 : 80,
          text.length === 4 ? 21 : 23));
      }
      put("UUX---", wave(), label("LS", 100, 75, 32));
      const medicalHeight = { Unknown: [30, 170], Friend: [50, 150], Neutral: [45, 155], Hostile: [28, 172] }[identity];
      const medicalBeam = { Unknown: [52, 148], Friend: [43, 157], Neutral: [57, 143], Hostile: [62, 138] }[identity];
      put("USMVT-", support("T"),
        line(`M100,${medicalHeight[0]} V${medicalHeight[1]} M${medicalBeam[0]},100 H${medicalBeam[1]}`),
        label("V", { Unknown: 120, Friend: 136, Neutral: 126, Hostile: 120 }[identity], 127, 28));
      put("USS3AC", supply("C"), line("M100,125 V102 L80,67 H120 L100,102"),
        ms._translate(28, 6, ms._scale(0.4, icn["GR.IC.AVIATION ROTARY WING"])));
      // Third pass over the selected rows: proportions and placements read
      // from the publication cells in these SVG units (PDF 182–207).
      put("UCFMS-", mortar(94, 49), line("M72,100 H128 C147,100 147,130 128,130 H72 C53,130 53,100 72,100 Z"));
      // Chemical units: the dots sit lower and further in; each line crosses
      // the other and ends at the bottom of the icon or of the vehicle body.
      const agent = (left, right, y, r, bottom, inset) => {
        const reach = 0.35 * (right - left), rise = y - 0.17 * (bottom - y), drop = y + 0.6 * (bottom - y);
        return [line(`M${left},${y} C${left + reach},${rise} ${right - inset},${drop} ${right - inset},${bottom}` +
          ` M${right},${y} C${right - reach},${rise} ${left + inset},${drop} ${left + inset},${bottom}`),
        dot(left, y, r), dot(right, y, r)];
      };
      put("UUACCK", track, agent(68, 132, 93.5, 7.5, 140.5, 18.5), label("SD", 100, 65, 24));
      put("UUACSA", track, agent(68, 132, 93.5, 7.5, 140.5, 18.5), label("S", 100, 65, 27));
      put("UUACRW", wheelTrack, agent(80, 120, 78, 5, 107, 13), icn["GR.IC.FF.RECONNAISSANCE"], wheels);
      put("UUACRS", wheelTrack, agent(80, 120, 89, 5, 107, 15), icn["GR.IC.FF.RECONNAISSANCE"], wheels,
        label("RS", 100, 79, 18));
      put("UUACCM", icn["GR.IC.FF.MOTORIZED"], agent(69, 130, 96, 7, 140.5, 18), label("SD", 80, 79, 26));
      // Annex D's EW is a taller (condensed) face on the same base line.
      put("UUMSEA", wheelTrack, label("EW", 88, 88, 27), icn["GR.IC.FF.RECONNAISSANCE"], wheels);
      // Signal units: Annex D draws a flatter bolt in the Unknown and Hostile
      // frames, and places each role label individually above it.
      const bolt = {
        Unknown: line("M44.3,69.1 100,109.5 100,89.2 156.2,130.5"),
        Hostile: line("M50.8,77.2 100,108.8 100,87.5 151.8,120.2")
      }[identity] || icn["GR.IC.FF.SIGNAL"];
      const signalLabels = {
        "UUSC--": ["CCP", [115, 79], [128, 80], [123, 79], [115, 78]],
        "UUSCL-": ["LCCP", [116, 79], [136, 79.5], [120, 79], [113, 78]],
        "UUSO--": ["OPS", [115, 80], [134, 79.5], [125, 79], [115, 78.5]],
        "UUSMN-": ["NC", [122, 79], [141, 79.5], [131.5, 79], [123, 78]],
        "UUSS--": ["SPT", [114.5, 79], [138, 79.5], [126, 79], [115, 78]],
        "UUSA--": ["AREA", [115, 79.5], [134, 80], [120, 79], [115.5, 78]],
        "UUSF--": ["FWD", [114.5, 79.5], [137.5, 80], [124, 79], [114.5, 78]],
        "UUSM--": ["MSE", [113.5, 79.5], [136, 80], [125, 79], [113.5, 78.5]],
        "UUSMS-": ["SEN", [111, 79.5], [137, 80], [125.5, 79], [112, 78]],
        "UUSML-": ["LEN", [115, 79], [137, 80], [126, 79], [115, 78]]
      };
      const place = ["Unknown", "Friend", "Neutral", "Hostile"].indexOf(identity) + 1;
      for (const [code, row] of Object.entries(signalLabels)) {
        put(code, bolt, label(row[0], ...row[place], 23));
      }
      // The large-configuration arcs stand at a different height per frame.
      const [lcTop, lcFoot] = { Unknown: [113.3, 124], Friend: [119, 133], Neutral: [132, 142], Hostile: [112.8, 125.5] }[identity];
      sId["S-G-UUSCL-"].push(line(`M70,${lcFoot} C70,${lcTop} 100,${lcTop} 100,${lcFoot} C100,${lcTop} 130,${lcTop} 130,${lcFoot}`));
      for (const code of ["UUSR--", "UUSRT-", "UUSRW-"]) sId[`S-G-${code}`][0] = bolt;
      // Supply rows, measured against the bar of their frame.
      const base = { Unknown: 120, Friend: 125, Neutral: 136, Hostile: 120 }[identity];
      const ammunition = base - 4.5;
      put("USS5--", supply(""), line(`M82,${ammunition} V${ammunition - 46} C82,${ammunition - 69} 118,${ammunition - 69} ` +
        `118,${ammunition - 46} V${ammunition} M77,${ammunition} H123`));
      const medical = side => {
        const [top, y, left, right] = {
          Unknown: [31, 78, 40.5, 159.5], Friend: [50, 91, 40, 160],
          Neutral: [45, 84, side === "T" ? 52 : 43.5, 147], Hostile: [28, 73.5, 54.5, 145.5]
        }[identity];
        return line(`M100,${top} V${base} M${left},${y} H${right}`);
      };
      put("USS8T-", supply("T"), medical("T"));
      put("USS8C-", supply("C"), medical("C"));
      // Aviation fuel: a glass of Annex D's proportions and a tall, narrow
      // rotor beside it; in the Neutral frame both stand further down and left.
      const [glass, rim, half, foot, rotorX, rotorY] = {
        Unknown: [100, 61.5, 22, 92.5, 128, 100.5], Friend: [99.5, 69, 22, 101, 128.5, 106],
        Neutral: [89, 77, 23, 109.5, 117.5, 117.3], Hostile: [95, 60.5, 22.5, 93.5, 121.5, 100.7]
      }[identity];
      const aviationFuel = side => [supply(side),
        line(`M${glass},${base} V${foot} L${glass - half},${rim} H${glass + half} L${glass},${foot}`),
        { ...icn["GR.IC.AVIATION ROTARY WING"], d: `M${rotorX - 13},${rotorY - 9} V${rotorY + 9} L${rotorX},${rotorY} Z ` +
          `M${rotorX + 13},${rotorY - 9} V${rotorY + 9} L${rotorX},${rotorY} Z` }];
      put("USS3AT", ...aviationFuel("T"));
      put("USS3AC", ...aviationFuel("C"));
      // Wheeled security: body, wheels and a larger label all sit lower.
      put("UCSM--", line("M120,73.5 C149,73.5 149,114.5 120,114.5 H80 C51,114.5 51,73.5 80,73.5 Z"),
        [62.5, 100, 137.5].map(x => dot(x, 120, 5, true)), label("SEC", 100, 96.2, 33));
      // Rocket launchers on wheels: the chevrons, the rocket and the wheel
      // bar all stand higher; the bar is wider.
      const launcher = (multiple, wheels) => [
        line(multiple ? "M77,85 100,62 123,85 M77,75 100,52 123,75" : "M77,85 100,62 123,85"),
        dot(100, 98.5, 11.5), line("M57,110 H142"), ...wheels.map(x => dot(x, 115, 4.5, true))];
      put("UCFRSR", ...launcher(false, [62, 137]));
      put("UCFRMR", ...launcher(true, [62, 137]));
      put("UCFRM-", ...launcher(true, [62, 100, 137]));
      // Riverine: in the Unknown and Hostile frames label and waterline sit higher.
      if (identity === "Unknown" || identity === "Hostile") {
        put("UCSW--", label("SEC", 100, identity === "Unknown" ? 93 : 94, 33), wave(identity === "Unknown" ? 110 : 112));
      }
      // Combat engineer: a taller bracket under the label.
      put("UCEC--", line("M65.5,127.5 V93 H134 V127.5 M100,93 V116"), label("CBT", 100, 79, 30));
      // Vulcan: the gun barrel stands at a different distance from the frame.
      put("UCDSV-", icn["GR.IC.FF.AIR DEFENCE"], {
        ...icn["GR.IC.FF.MAIN GUN SYSTEM"],
        d: { Unknown: "M48.5,67V133", Friend: "M41,50V150", Neutral: "M56.7,45V155", Hostile: "M58,70V130" }[identity]
      }, line("M116,62 C139,62 139,94 116,94 H84 C61,94 61,62 84,62 Z"), label("V", 100, 80, 25));
      // Air defence rows: in the Friend and Neutral frames the dome is a
      // circular arc from corner to corner (flatter, resp. steeper at its ends).
      const dome = { Friend: "M25,150 C70.1,118.7 129.9,118.7 175,150", Neutral: "M45,155 C76.6,127.8 123.4,127.8 155,155" }[identity];
      if (dome) {
        const generic = icn["GR.IC.FF.AIR DEFENCE"].d;
        for (const code of ["UCDS--", "UCDSV-", "UCDO--", "UCDH--"]) {
          sId[`S-G-${code}`] = sId[`S-G-${code}`].map(p => p && p.d === generic ? { ...p, d: dome } : p);
        }
      }
      // Antitank air assault: the V hangs lower in the Neutral and Hostile
      // frames and higher in the Unknown one, whose legs also spread wider.
      const [vLeft, vTop, vFoot, vRight] = {
        Unknown: [79.5, 73.5, 107, 120.5], Friend: [77.04, 82, 113, 122.96],
        Neutral: [79.5, 93, 127, 120.5], Hostile: [78.75, 92.5, 128, 121.25]
      }[identity];
      const airAssault = [identity === "Unknown" ? { ...icn["GR.IC.FF.ANTITANK/ANTIARMOUR"], d: "M42.7,129.6 L100,30.75 157.3,129.6" }
        : icn["GR.IC.FF.ANTITANK/ANTIARMOUR"], line(`M${vLeft},${vTop} 100,${vFoot} ${vRight},${vTop}`)];
      put("UCAAS-", ...airAssault);
      put("UCAAAS", track, ...airAssault);
      put("UCAAOS", icn["GR.IC.FF.MOTORIZED"], ...airAssault);
      // Airport: a larger wheel, the bar lower and the diagonal steeper,
      // reaching the bottom of the wheel.
      const airfield = [line("M58.7,83.5 H140.6 M58,115.5 106,52.6 M99.3,87.6 V144.4 M74.1,101.3 124.5,130.7 " +
        "M74.1,130.7 124.5,101.3"), dot(99.3, 116, 28.4, true)];
      put("USTA--", airfield);
      put("USTAT-", support("T"), airfield);
      put("USTAC-", support("C"), airfield);
      // Rows marked for correction on 2026-11-04 (PDF 174–232). Every position
      // below is read from the publication cell of its identity.
      const solid = d => ({ ...icn["GR.IC.AVIATION ROTARY WING"], d });
      // Missile air defence: a flatter dome reaching the frame, and a body
      // whose cross lines run from side to side: none, one or two for light,
      // medium and heavy.
      const missileDome = {
        Unknown: line("M38.5,124.7 C79,98.4 121,98.4 161.5,124.7"),
        Friend: line("M25,150 C70.1,116.7 129.9,116.7 175,150"),
        Neutral: line("M45,155 C76.6,127.8 123.4,127.8 155,155"),
        Hostile: icn["GR.IC.FF.AIR DEFENCE"]
      }[identity];
      const missileFoot = { Unknown: 105.5, Friend: 126, Neutral: 135.3, Hostile: 102 }[identity];
      const missileBody = line(`M83.5,${missileFoot} V75 C83.5,55.5 116.5,55.5 116.5,75 V${missileFoot}`);
      put("UCDML-", missileDome, missileBody);
      put("UCDMM-", missileDome, missileBody, line("M83.5,84 H116.5"));
      put("UCDMH-", missileDome, missileBody, line("M83.5,79.5 H116.5 M83.5,87.5 H116.5"));
      // Composite: a long narrow missile standing on a small arc on the dome.
      // Its sides end on the arc, which leaves the space under it empty.
      const [compositeTip, compositeArc] = {
        Unknown: [51, 98.6], Friend: [72, 117.8], Neutral: [79.5, 127.5], Hostile: [45.5, 94.5]
      }[identity];
      const compositeHump = (compositeArc - 0.25 * missileFoot) / 0.75;
      const compositeSide = missileFoot - 0.764 * (missileFoot - compositeArc);
      put("UCDC--", missileDome, line(`M91.5,${compositeSide} V${compositeTip + 7} ` +
        `C91.5,${compositeTip - 2.2} 108.5,${compositeTip - 2.2} 108.5,${compositeTip + 7} V${compositeSide} ` +
        `M100,${compositeTip} V${compositeArc} ` +
        `M85.5,${missileFoot} C90,${compositeHump} 110,${compositeHump} 114.5,${missileFoot}`));
      // Rotary wing: taller blades on a mast that runs down to y 150.
      const rotor = solid("M60,80 100,100.5 140,80 V121 L100,100.5 60,121 Z");
      put("UCVR--", rotor, line("M100,100.5 V150"));
      put("UCSA--", label("SEC", 100, 75.2, 31), rotor);
      // Naval construction: a solid anchor on a heavier engineer bracket. Ring
      // and stock stand at a slightly different height in each cell.
      // A negative radius runs the other way round, which leaves a hole.
      const annulus = (cx, cy, r) => {
        const side = Math.abs(r), k = 0.55 * r, l = 0.55 * side;
        return `M${cx + r},${cy} C${cx + r},${cy + l} ${cx + k},${cy + side} ${cx},${cy + side} ` +
          `C${cx - k},${cy + side} ${cx - r},${cy + l} ${cx - r},${cy} ` +
          `C${cx - r},${cy - l} ${cx - k},${cy - side} ${cx},${cy - side} ` +
          `C${cx + k},${cy - side} ${cx + r},${cy - l} ${cx + r},${cy} Z `;
      };
      const [ringY, stockY] = { Unknown: [57.2, 64.2], Friend: [58.75, 65.2], Neutral: [56, 63.9], Hostile: [56.1, 63.6] }[identity];
      put("UCENN-", line("M72.5,109 V137 M127.5,109 V137 M100,109 V127"),
        solid("M71.6,107 H128.4 V110.4 H71.6 Z"),
        solid(annulus(100, ringY, 6.4) + annulus(100, ringY, -3.6)),
        solid(`M79,${stockY} H121 V${stockY + 2.5} H79 Z M98.8,${ringY + 6} H101.2 V98 H98.8 Z`),
        solid("M74.3,79 H77.2 C78,84 80.5,86.5 82,89.5 C86,94 94,97.5 100,97.5 C106,97.5 114,94 118,89.5 " +
          "C119.5,86.5 122,84 122.8,79 H125.7 L125.2,90 124,93.8 122,92.3 C117,97.5 108,103.4 100,103.4 " +
          "C92,103.4 83,97.5 78,92.3 L76,93.8 74.8,90 Z"));
      // Light armoured reconnaissance: a full-size body, the wheels below it.
      const [lightTop, lightSide] = { Unknown: [75, 148.5], Friend: [75.3, 148.5], Neutral: [74.7, 148.5], Hostile: [73.5, 150.7] }[identity];
      put("UCRRL-", line(`M120,${lightTop} C${lightSide},${lightTop} ${lightSide},115.2 120,115.2 H80 C${200 - lightSide},115.2 ${200 - lightSide},${lightTop} 80,${lightTop} Z`),
        icn["GR.IC.FF.RECONNAISSANCE"], [63, 99.5, 135.8].map(x => dot(x, 121.2, 4.6, true)));
      // Wheeled chemical reconnaissance: the body top and the dots above the
      // crossing lines vary with the frame.
      const wheeledTop = { Unknown: 69.1, Friend: 70.4, Neutral: 68.7, Hostile: 67.9 }[identity];
      const wheeledDot = wheeledTop + 9.3;
      put("UUACRW", line(`M120,${wheeledTop} C148,${wheeledTop} 148,110 120,110 H80 C52,110 52,${wheeledTop} 80,${wheeledTop} Z`),
        line(`M79.5,${wheeledDot} C97,${wheeledDot - 5} 107,${wheeledDot + 15} 107,108 M120,${wheeledDot} C102.5,${wheeledDot - 5} 92.5,${wheeledDot + 15} 92.5,108`),
        dot(79.5, wheeledDot, 5.4), dot(120, wheeledDot, 5.4), icn["GR.IC.FF.RECONNAISSANCE"],
        [63.5, 99.5, 136.5].map(x => dot(x, 116.2, 4.5, true)));
      // Corps chevron of these rows: it runs from frame to frame.
      const corps = {
        Unknown: [163, 77, 150, 123], Friend: [175, 50, 157, 150], Neutral: [153.7, 45, 141.7, 155], Hostile: [152.2, 80, 140.3, 120]
      }[identity];
      const corpsLine = line(`M${corps[0]},${corps[1]} L${corps[2]},100 ${corps[0]},${corps[3]}`);
      // The bars of medical supply reach the frame and stop at the chevron.
      const [crossTop, crossY, crossLeft, crossRight, barLeft, barRight] = {
        Unknown: [31, 78, 40.5, 162.4, 36.4, 161.3], Friend: [50, 91, 25, 160.2, 25, 166],
        Neutral: [45, 84, 45, 145.2, 45, 149.6], Hostile: [28, 73.5, 54.5, 145.5, 48, 152.2]
      }[identity];
      put("USS8C-", corpsLine, line(`M${barLeft},${base} H${barRight} M100,${crossTop} V${base} M${crossLeft},${crossY} H${crossRight}`));
      // Missile transport: a long missile with a centre line above the same
      // wheel as the airport rows. The Friend frame is the only one close
      // enough to its tip: there it starts lower, clear of the frame line.
      const transportTip = identity === "Friend" ? 53.3 : 50;
      const transportMissile = [line(`M93.5,85 V${transportTip + 7} C93.5,${transportTip - 2.5} 106.5,${transportTip - 2.5} ` +
        `106.5,${transportTip + 7} V85 M100,${transportTip} V85`),
        line("M99.3,87.6 V144.4 M74.1,101.3 124.5,130.7 M74.1,130.7 124.5,101.3"), dot(99.3, 116, 28.4, true)];
      put("USTI--", ...transportMissile);
      put("USTIC-", corpsLine, ...transportMissile);
      // Reconnaissance rows: the Unknown and Hostile diagonals are flatter.
      const recon = { Unknown: "M44.1,130.8L155.9,69.2", Hostile: "M53.5,125.6L146.5,74.4" }[identity];
      if (recon) {
        const steep = icn["GR.IC.FF.RECONNAISSANCE"].d;
        for (const code of ["UUACRW", "UUACRS", "UUMSEA", "UCRRF-", "UCRRL-", "UCRV--", "UCRR--", "UCRRD-"]) {
          sId[`S-G-${code}`] = sId[`S-G-${code}`].map(p => p && p.d === steep ? { ...p, d: recon } : p);
        }
      }
      // Preserve shared primitives: clone only the selected compositions
      // before applying Annex D's fine interior strokes.
      const fine = part => Array.isArray(part) ? part.map(fine) : part ? {
        ...part,
        ...(part.type === "path" || part.type === "circle" ? { strokewidth: 1.3, non_scaling_stroke: 1 } : {}),
        ...(part.draw ? { draw: fine(part.draw) } : {})
      } : part;
      for (const code of ["UCDS--", "UCDSV-", "UCDO--", "UCATA-", "UCATW-", "UCATWR", "UCAWL-", "UCAAS-", "UCVV--", "UCVUF-", "UCVUR-", "UCEC--", "UCEN--", "UCENN-", "UCFRS-", "UCFRSS", "UCFRSR", "UCFRST", "UCFRM-", "UCFRMS", "UCFRMR", "UCFRMT", "UCFMS-", "UCFMTS", "UCFML-", "UCRRF-", "UCRRL-", "UCSW--", "UUACCK", "UUACSA", "UUACRW", "UUACRS", "UUMA--", "UUMSEA", "UUMRG-", "UUSC--", "UUSCL-", "UUSO--", "UUSMN-", "UUSR--", "UUSRT-", "UUSRW-", "UUSS--", "USAPBC", "USS3AT", "USS4--", "USS4T-", "USS4C-", "USS5--", "USS8T-", "USSWPT", "UCECS-", "UCSM--", "UCSR--", "USS8C-", "USTA--", "USTAT-", "USTAC-", "UCDML-", "UCDMM-", "UCDMH-", "UCDC--", "UCVR--", "UCSA--", "USTI--", "USTIC-", ...round2]) {
        sId[`S-G-${code}`] = fine(sId[`S-G-${code}`]);
      }
      if (this.metadata.frame && identity === "Unknown") {
        // Fine strokes can exceed the narrow frame padding at strokeWidth 1.
        for (const code of ["UCAWW-", "UCAWWR", "UCFHX-", "UCRR--", "UCRRD-", "UUX---"]) {
          bbox[`S-G-${code}`] = { x1: 29, y1: 50, x2: 171, y2: 150 };
        }
        bbox["S-G-USMVT-"] = { x1: 50, y1: 29, x2: 150, y2: 171 };
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
        extend(["UCDH--"], {
          Unknown: [45, 50, 155, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [49, 50, 151, 150]
        }[identity]);
        extend(["UCAAAS", "UCAAOS"], {
          Unknown: [50, 30, 150, 170], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [50, 28, 150, 172]
        }[identity]);
        extend(["UCAWW-", "UCAWWR", "UCFHX-", "UCRR--", "UCRRD-", "UUX---"], {
          Unknown: [28, 50, 172, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [28, 50, 172, 150]
        }[identity]);
        extend(["UCRV--"], {
          Unknown: [50, 50, 150, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [50, 50, 150, 150]
        }[identity]);
        extend(["UUACCM"], {
          Unknown: [50, 30, 150, 170], Friend: [50, 50, 150, 150],
          Neutral: [50, 45, 150, 155], Hostile: [50, 28, 150, 172]
        }[identity]);
        extend(["UUMSED", "UUMSEI"], {
          Unknown: [50, 49, 150, 153], Friend: [50, 50, 150, 150],
          Neutral: [50, 48, 150, 151], Hostile: [50, 49, 150, 153]
        }[identity]);
        extend(["UUSA--", "UUSF--", "UUSM--", "UUSMS-", "UUSML-"], {
          Unknown: [50, 50, 154, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [50, 50, 150, 150]
        }[identity]);
        extend(["USMVT-"], {
          Unknown: [40, 30, 160, 170], Friend: [25, 50, 175, 150],
          Neutral: [45, 45, 155, 155], Hostile: [50, 28, 150, 172]
        }[identity]);
        extend(["USS3AC"], {
          Unknown: [40, 50, 160, 150], Friend: [25, 50, 175, 150],
          Neutral: [45, 50, 155, 150], Hostile: [50, 50, 150, 150]
        }[identity]);
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
        // Third-pass compositions: extents of their paths, per identity.
        for (const [codes, bounds] of [
          [["UCFMS-"], { Unknown: [57.8, 49, 142.3, 130], Friend: [57.8, 49, 142.3, 130], Neutral: [57.8, 49, 142.3, 130], Hostile: [57.8, 49, 142.3, 130] }],
          [["UUACRW", "UUACRS", "UUMSEA"], { Unknown: [44.1, 68, 155.9, 130.8], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [53.5, 68, 146.5, 125.6] }],
          [["UUACCM"], { Unknown: [61.8, 30.8, 137, 169.3], Friend: [61.8, 50, 137, 150], Neutral: [61.8, 45, 137, 155], Hostile: [61.8, 28, 137, 172] }],
          [["UUSC--", "UUSMN-", "UUSS--", "UUSML-"], { Unknown: [44.3, 67.5, 156.2, 130.5], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [50.8, 66.5, 151.8, 120.2] }],
          [["UUSCL-"], { Unknown: [44.3, 67.5, 156.2, 130.5], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [50.8, 66.5, 151.8, 125.5] }],
          [["UUSO--"], { Unknown: [44.3, 68.5, 156.2, 130.5], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [50.8, 67, 151.8, 120.2] }],
          [["UUSA--", "UUSF--", "UUSMS-"], { Unknown: [44.3, 68, 156.2, 130.5], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [50.8, 66.5, 151.8, 120.2] }],
          [["UUSM--"], { Unknown: [44.3, 68, 156.2, 130.5], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [50.8, 67, 151.8, 120.2] }],
          [["UUSR--"], { Unknown: [44.3, 64, 156.2, 149], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [50.8, 64, 151.8, 149] }],
          [["UUSRT-"], { Unknown: [44.3, 65, 156.2, 151.5], Friend: [25, 50, 175, 151.5], Neutral: [45, 45, 155, 155], Hostile: [50.8, 65, 151.8, 151.5] }],
          [["UUSRW-"], { Unknown: [44.3, 65, 156.2, 149], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [50.8, 65, 151.8, 149] }],
          [["UCRRF-"], { Unknown: [30, 65, 170, 130.8], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [28, 65, 172, 125.6] }],
          [["UCRRL-"], { Unknown: [44.1, 69.2, 155.9, 130.8], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [51.8, 74.4, 148.3, 125.6] }],
          [["UCRV--"], { Unknown: [44.1, 69.2, 155.9, 140.5], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [53.5, 74.4, 146.5, 140.5] }],
          [["UCRR--", "UCRRD-"], { Unknown: [30, 69.2, 170, 130.8], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [28, 74.4, 172, 125.6] }],
          [["USS5--"], { Unknown: [42, 52.3, 158, 120], Friend: [25, 57.3, 175, 125], Neutral: [45, 68.3, 155, 136], Hostile: [50, 52.3, 150, 120] }],
          [["USS8T-"], { Unknown: [40, 31, 160, 125], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 150], Hostile: [50, 28, 150, 120] }],
          [["USS8C-"], { Unknown: [36.4, 31, 163, 125], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [48, 28, 152.2, 120] }],
          [["UCDML-", "UCDMM-", "UCDMH-"], { Unknown: [38.5, 60, 161.5, 125], Friend: [25, 60, 175, 150], Neutral: [45, 60, 155, 155], Hostile: [49, 60, 151, 121] }],
          [["UCDC--"], { Unknown: [38.5, 51, 161.5, 125], Friend: [25, 72, 175, 150], Neutral: [45, 79, 155, 155], Hostile: [49, 45, 151, 121] }],
          [["UCENN-"], { Unknown: [71, 49, 129, 138], Friend: [71, 49, 129, 138], Neutral: [71, 49, 129, 138], Hostile: [71, 49, 129, 138] }],
          [["USTI--"], { Unknown: [70, 49, 128, 145], Friend: [70, 49, 128, 145], Neutral: [70, 49, 128, 145], Hostile: [70, 49, 128, 145] }],
          [["USTIC-"], { Unknown: [70, 49, 163, 145], Friend: [70, 49, 175, 150], Neutral: [70, 45, 153.7, 155], Hostile: [70, 49, 152.2, 145] }],
          [["USS3AT"], { Unknown: [40, 61.5, 160, 125], Friend: [25, 50, 175, 150], Neutral: [45, 50, 155, 150], Hostile: [50, 60.5, 150, 120] }],
          [["USS3AC"], { Unknown: [42, 61.5, 160, 125], Friend: [25, 50, 175, 150], Neutral: [45, 50, 155, 150], Hostile: [50, 60.5, 150, 120] }],
          [["USTAT-"], { Unknown: [40, 52.6, 160, 144.4], Friend: [25, 50, 175, 150], Neutral: [45, 50, 155, 150], Hostile: [50, 52.6, 150, 144.4] }],
          [["USTAC-"], { Unknown: [58, 52.6, 160, 144.4], Friend: [58, 50, 175, 150], Neutral: [58, 50, 155, 150], Hostile: [58, 52.6, 150, 144.4] }],
          [["UCAAS-"], { Unknown: [42.7, 30.8, 157.3, 129.6], Friend: [25, 52, 175, 150], Neutral: [45, 47, 155, 150], Hostile: [60, 30, 140, 132] }],
          [["UCAAAS"], { Unknown: [42.7, 30.8, 157.3, 129.6], Friend: [25, 52, 175, 150], Neutral: [45, 47, 155, 150], Hostile: [51.8, 30, 148.3, 132] }],
          [["UCAAOS"], { Unknown: [42.7, 30.8, 157.3, 169.3], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [60, 28, 140, 172] }],
          [["UCDSV-"], { Unknown: [45, 62, 155, 133], Friend: [25, 50, 175, 150], Neutral: [45, 45, 155, 155], Hostile: [49, 62, 151, 130] }],
          [["UCDS--", "UCDO--", "UCDH--"], { Unknown: [45, 75, 155, 125], Friend: [25, 91, 175, 150], Neutral: [45, 99, 155, 155], Hostile: [49, 74, 151, 121] }],
          [["UCSW--"], { Unknown: [30, 76.5, 170, 119], Friend: [25, 83.5, 175, 137], Neutral: [45, 83.5, 155, 137], Hostile: [40, 77.5, 160, 121] }]
        ]) extend(codes, bounds[identity]);
      }
    }
  }
};
