import { completeEditorSidc, copiedSidc, decodeEditorSidc, displayEditorSidc, editImportedSidc, standardForSidc } from "../studio/sidc-editor.js";
import { exportFilename } from "../studio/editor-helpers.js";

const tank = { id: "S-G-EVAT--", name: "Tank", code: "EVAT--", battleDimension: "G", codingScheme: "S" };
const legacy = { family: "legacy", version: "", icons: [tank] };
const modern = { family: "modern", version: "13", icons: [{ id: "10-121100", symbolSet: "10", code: "121100", name: "Infantry" }] };
const parsed = decodeEditorSidc("SHGAEVAT--MQTUG", legacy);
const unit = decodeEditorSidc("SFGPUCI---DFTU-", legacy);
const d = decodeEditorSidc("100310001612110102037921234567", { ...modern, version: "10" });
const e = decodeEditorSidc("131610171812110001022180000792", modern);
const seaSurfaceFrame = "1303100000121100000000A0000000";
const leader = decodeEditorSidc("13032700711101010000", modern);
const errorOf = (input, family) => completeEditorSidc(input, family).error;

export default {
  "Imported SIDC editing": {
    "tank code selects the tank rather than the previous catalog selection": [parsed.icon.id, tank.id],
    "identity, planned status and tracked mobility decode together": [[parsed.identity, parsed.status, parsed.mobility], ["H", "A", "MQ"]],
    "HQ, task force, feint and battalion decode together": [[unit.hq, unit.taskForce, unit.feintDummy, unit.echelon], [true, true, true, "F"]],
    "installation feint is not treated as a unit echelon": [(() => { const p = decodeEditorSidc("SFGPI-----HBTU-", legacy); return [p.feintDummy, p.echelon, p.icon.defaultModifier]; })(), [true, "-", "HB"]],
    "ten-character input clears prior modifier selections": [(() => { const p = decodeEditorSidc("SFGPEVAT--", legacy); return [p.hq, p.taskForce, p.feintDummy, p.mobility, p.echelon]; })(), [false, false, false, "", "-"]],
    "unknown function gets its own identity instead of a previous icon": [decodeEditorSidc("SFGPZZZZZZ-----", legacy).icon.code, "ZZZZZZ"],
    "D originator never becomes a common modifier or frame shape": [[d.modifier1, d.modifier2, d.frameShape], ["set:02", "set:03", "0"]],
    "imported edition takes precedence over a previously selected E view": [decodeEditorSidc("100310001612110102037921234567", modern).modifier1, "set:02"],
    "editing a D import under an E config cannot overwrite its originator": [editImportedSidc("100310001612110102037921234567", "130310001612110104000000000000", "modifier1", modern), "100310001612110104037921234567"],
    "known legacy installations retain their H modifier for editing": [decodeEditorSidc("SFGPI-----HBTU-", { ...legacy, icons: [{ id: "S-G-I-----", name: "Installation" }] }).icon.defaultModifier, "HB"],
    "E identity, context, flags, echelon and extensions decode": [[e.identity, e.context, e.hq, e.taskForce, e.feintDummy, e.echelon, e.modifier1, e.modifier2, e.frameShape], ["6", "1", true, true, true, "18", "common:201", "common:102", "8"]],
    "changing identity preserves the imported tank, mobility, country and OOB": [editImportedSidc("SFGPEVAT--MQTUG", "SHGPUCI--------", "affiliation", legacy), "SHGPEVAT--MQTUG"],
    "changing letter context rewrites only the identity letter": [editImportedSidc("SFGPEVAT--MQTUG", "SDGPUCI--------", "context", legacy), "SDGPEVAT--MQTUG"],
    "changing status preserves all other fields": [editImportedSidc("SFGPEVAT--MQTUG", "SHGAUCI--------", "status", legacy), "SFGAEVAT--MQTUG"],
    "editing short SIDCs only extends through the changed field": [editImportedSidc("SFGPUCI---", "SFGPUCI----F---", "amplifier", legacy), "SFGPUCI----F"],
    "D modifier edits preserve originator and national extension": [editImportedSidc("100310001612110102037921234567", "100310001612110104000000000000", "modifier1", { ...modern, version: "10" }), "100310001612110104037921234567"],
    "E modifier edits change only their own prefix and base field": [editImportedSidc("131610171812110001022180000792", "130310000012110003004000000000", "modifier1", modern), "131610171812110003024180000792"],
    "clearing common modifier clears its prefix without touching country": [editImportedSidc("131610171812110001022180000792", "130310000012110000000000000000", "modifier2", modern), "131610171812110001002080000792"],
    "frame shape edits preserve E country and modifiers": [editImportedSidc("131610171812110001022180000792", "130310000012110000000010000000", "frameShape", modern), "131610171812110001022110000792"],
    "a leader individual reads as an amplifier below the frame, not an echelon": [[leader.mobility, leader.echelon], ["71", "00"]],
    "the sea surface frame code decodes as itself": [decodeEditorSidc(seaSurfaceFrame, modern).frameShape, "A"]
  },
  "SIDC completion on Apply": {
    "underscores count as dashes": [completeEditorSidc("sfgpuci_", "legacy").value, "SFGPUCI---*****"],
    "a short letter code fills the function with - and positions 11-15 with *": [completeEditorSidc("SFGPUCI", "legacy"), { value: "SFGPUCI---*****", added: 8, error: "" }],
    "four characters leave the whole function as -": [completeEditorSidc("SFGP", "legacy").value, "SFGP------*****"],
    "a code that reaches size/mobility fills only the rest with *": [completeEditorSidc("SFGPUCI----F", "legacy").value, "SFGPUCI----F***"],
    "a full letter code is unchanged": [completeEditorSidc("SFGPUCI----F---", "legacy"), { value: "SFGPUCI----F---", added: 0, error: "" }],
    "typed wildcards stay for the identity and status resolution": [completeEditorSidc("S*G*UCI", "legacy").value, "S*G*UCI---*****"],
    "a letter code needs scheme, identity, dimension and status": [Boolean(completeEditorSidc("SFG", "legacy").error), true],
    "a letter code longer than 15 is an error": [Boolean(completeEditorSidc("SFGPUCI----F---X", "legacy").error), true],
    "a short numeric code is filled with zeros to 20": [completeEditorSidc("100310001211", "modern"), { value: "10031000121100000000", added: 8, error: "" }],
    "numeric codes of 20 to 30 digits are unchanged": [completeEditorSidc("100310001612110102037921234567", "modern").added, 0],
    "a numeric code needs version, context, identity and symbol set": [Boolean(completeEditorSidc("10031", "modern").error), true],
    "letters in a numeric code are an error": [Boolean(completeEditorSidc("1003A0001211", "modern").error), true],
    "position 23 of an edition E code takes the sea surface frame": [errorOf(seaSurfaceFrame, "modern"), ""],
    "the sea surface frame in lower case": [completeEditorSidc(seaSurfaceFrame.toLowerCase(), "modern").value, seaSurfaceFrame],
    "the frame letter in position 22 is an error": [Boolean(errorOf("130310000012110000000A00000000", "modern")), true],
    "edition D has no frame shape field": [Boolean(errorOf("1003100000121100000000A0000000", "modern")), true]
  },
  "A SIDC of the other family": {
    "a numeric code in a letter-based view says it is numeric": [errorOf("10031000001211000000", "legacy").includes("numeric SIDC"), true],
    "and names the standards that take it": [errorOf("10031000001211000000", "legacy").includes("APP-6D"), true],
    "a short numeric code is not read as a letter code": [Boolean(errorOf("100310001211", "legacy")), true],
    "a letter code in a numeric view says it is letter-based": [errorOf("SFGPUCI---*****", "modern").includes("letter-based SIDC"), true],
    "and names the standards that take it": [errorOf("SFGPUCI---*****", "modern").includes("APP-6A"), true]
  },
  "The version digits choose the standard": {
    "16 in the 2525E view is APP-06(E)(2)": [standardForSidc("16031000001211000000", "2525e"), "app6e"],
    "14 in the 2525E view is APP-06(E)(1)": [standardForSidc("14031000001211000000", "2525e"), "app6e"],
    "13 in the APP-6E view is 2525E": [standardForSidc("13031000001211000000", "app6e"), "2525e"],
    "15 in the APP-6E view is 2525E Change 1": [standardForSidc("15031000001211000000", "app6e"), "2525e"],
    "11 in the APP-6D view is 2525D Change 1": [standardForSidc("11031000001211000000", "app6d"), "2525d"],
    "12 in the 2525D view is APP-06(D)(2)": [standardForSidc("12031000001211000000", "2525d"), "app6d"],
    "13 in the APP-6D view moves to 2525E, not APP-6E": [standardForSidc("13031000001211000000", "app6d"), "2525e"],
    "10 belongs to both D editions, so APP-6D stays": [standardForSidc("10031000001211000000", "app6d"), "app6d"],
    "10 belongs to both D editions, so 2525D stays": [standardForSidc("10031000001211000000", "2525d"), "2525d"],
    "10 in an E view keeps its publication family": [[standardForSidc("10031000001211000000", "app6e"), standardForSidc("10031000001211000000", "2525e")], ["app6d", "2525d"]],
    "a code of the same standard stays": [[standardForSidc("15031000001211000000", "2525e"), standardForSidc("14031000001211000000", "app6e")], ["2525e", "app6e"]],
    "a version outside the table leaves the view alone": [standardForSidc("17031000001211000000", "2525e"), "2525e"]
  },
  "Copy": {
    "gives the code as drawn, without the box's * marks": [copiedSidc({ shown: "SFGPUCI---*****", sidc: "SFGPUCI--------", dirty: false }), "SFGPUCI--------"],
    "gives text still being typed as it stands": [copiedSidc({ shown: "SFGPUCI---DE***", sidc: "SFGPUCI--------", dirty: true }), "SFGPUCI---DE***"],
    "matches the code in the file name": [exportFilename({ standardId: "app6b", sidc: "SFGPUCI--------", name: "Infantry" }, "svg").includes(copiedSidc({ shown: "SFGPUCI---*****", sidc: "SFGPUCI--------", dirty: false })), true]
  },
  "SIDC box shows unspecified user fields as *": {
    "a unit without size, country or order of battle": [displayEditorSidc("SFGPUCI--------"), "SFGPUCI---*****"],
    "a chosen echelon, country and order of battle stay": [displayEditorSidc("SFGPUCI----FTUG"), "SFGPUCI----FTUG"],
    "only the empty fields change": [displayEditorSidc("SFGPUCI----F---"), "SFGPUCI----F***"],
    "an installation keeps its H": [displayEditorSidc("SFGPI-----H----"), "SFGPI-----H****"],
    "a feint/dummy installation stays HB": [displayEditorSidc("SFGPI-----HB---"), "SFGPI-----HB***"],
    "the function code keeps its dashes": [displayEditorSidc("SFAP-----------"), "SFAP------*****"],
    "a short code shows its missing fields as *": [displayEditorSidc("SFGPUCI---"), "SFGPUCI---*****"],
    "signals intelligence keeps its fixed -- size field": [displayEditorSidc("IHGPSCC--------"), "IHGPSCC-----***"],
    "tactical graphics keep position 15": [displayEditorSidc("GFGPGPP--------"), "GFGPGPP---****-"],
    "weather codes are unchanged": [displayEditorSidc("WAS-PHT---P----"), "WAS-PHT---P----"],
    "numeric codes are unchanged": [displayEditorSidc("10031000001211000000"), "10031000001211000000"]
  }
};
