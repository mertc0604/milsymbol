import { decodeEditorSidc, editImportedSidc } from "../studio/sidc-editor.js";

const tank = { id: "S-G-EVAT--", name: "Tank", code: "EVAT--", battleDimension: "G", codingScheme: "S" };
const legacy = { family: "legacy", version: "", icons: [tank] };
const modern = { family: "modern", version: "13", icons: [{ id: "10-121100", symbolSet: "10", code: "121100", name: "Infantry" }] };
const parsed = decodeEditorSidc("SHGAEVAT--MQTUG", legacy);
const unit = decodeEditorSidc("SFGPUCI---DFTU-", legacy);
const d = decodeEditorSidc("100310001612110102037921234567", { ...modern, version: "10" });
const e = decodeEditorSidc("131610171812110001022180000792", modern);

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
    "changing status preserves all other fields": [editImportedSidc("SFGPEVAT--MQTUG", "SHGAUCI--------", "status", legacy), "SFGAEVAT--MQTUG"],
    "editing short SIDCs only extends through the changed field": [editImportedSidc("SFGPUCI---", "SFGPUCI----F---", "amplifier", legacy), "SFGPUCI----F"],
    "D modifier edits preserve originator and national extension": [editImportedSidc("100310001612110102037921234567", "100310001612110104000000000000", "modifier1", { ...modern, version: "10" }), "100310001612110104037921234567"],
    "E modifier edits change only their own prefix and base field": [editImportedSidc("131610171812110001022180000792", "130310000012110003004000000000", "modifier1", modern), "131610171812110003024180000792"],
    "clearing common modifier clears its prefix without touching country": [editImportedSidc("131610171812110001022180000792", "130310000012110000000000000000", "modifier2", modern), "131610171812110001002080000792"],
    "frame shape edits preserve E country and modifiers": [editImportedSidc("131610171812110001022180000792", "130310000012110000000010000000", "frameShape", modern), "131610171812110001022110000792"]
  }
};
