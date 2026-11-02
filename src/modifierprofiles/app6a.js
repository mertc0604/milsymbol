// APP-6A (1998) modifier profile. See common.js for the profile contract.

// APP-6A (1998), Table III, printed pp. 19–21. Limits are character counts.
// Order: unit, equipment, installation, ordinary point, nuclear point.
export const app6aTextFields = [
  ["quantity", "C", "Quantity of equipment", [0,9,0,0,6]],
  ["reinforcedReduced", "F", "Reinforced / detached", [3,0,0,0,0]],
  ["staffComments", "G", "Staff comments", [20,20,20,0,0]],
  ["additionalInformation", "H", "Additional information", [20,20,20,20,20]],
  ["evaluationRating", "J", "Evaluation rating (A1–F6)", [2,2,2,0,0]],
  ["combatEffectiveness", "K", "Combat effectiveness", [5,0,5,0,0]],
  ["signatureEquipment", "L", "Electronic signature (!)", [0,1,0,0,0], true],
  ["higherFormation", "M", "Higher formation", [21,0,0,0,0]],
  ["hostile", "N", "Hostile indicator (ENY)", [0,3,0,0,0], true],
  ["iffSif", "P", "IFF / SIF", [5,5,5,0,0]],
  ["uniqueDesignation", "T", "Unique designation", [21,21,21,0,15]],
  ["type", "V", "Type of equipment", [0,24,0,0,20]],
  ["dtg", "W", "Date-time group", [14,14,14,14,14]],
  ["altitudeDepth", "X", "Altitude / depth", [6,6,6,0,6]],
  ["location", "Y", "Location (WGS-84)", [19,19,19,19,19]],
  ["speed", "Z", "Speed", [8,8,8,0,0]],
  ["specialHeadquarters", "AA", "Special C2 headquarters", [9,0,0,0,0]]
].map(([key,field,label,limits,hostileOnly]) => ({key,field,label,limits,hostileOnly}));

export function app6aSymbolClass(sidc) {
  sidc = String(sidc).toUpperCase().replace(/ /g, "");
  if (sidc[0] === "G") return /^G.C.BW[NEIF]/.test(sidc) ? "nuclear" : "point";
  if (sidc[2] === "G" && sidc[4] === "I") return "installation";
  if (sidc[2] === "F" || (sidc[2] === "G" && ["U", "-"].includes(sidc[4])) || (sidc[2] === "S" && sidc[4] === "G")) return "unit";
  return "equipment";
}
export function getApp6aFields(sidc) {
  sidc = String(sidc).toUpperCase().replace(/ /g, "");
  const index = ["unit","equipment","installation","point","nuclear"].indexOf(app6aSymbolClass(sidc));
  return app6aTextFields.filter(f => f.limits[index] && (!f.hostileOnly || ["H","S"].includes(sidc[1]))).map(f => ({...f,maxLength:f.limits[index], ...(index === 4 && f.key === "quantity" ? { field: "B", label: "Nuclear yield (kilotons)" } : {})}));
}
export function validateApp6aOptions(sidc, options) {
  const fields = new Map(getApp6aFields(sidc).map(f => [f.key,f]));
  const errors = [];
  for (const field of app6aTextFields) {
    const value = String(options[field.key] ?? "");
    if (!value) continue;
    if (!fields.has(field.key)) errors.push(`${field.field}: not applicable to ${app6aSymbolClass(sidc)}`);
    else if (value.length > fields.get(field.key).maxLength) errors.push(`${field.field}: maximum ${fields.get(field.key).maxLength} characters`);
  }
  if (options.evaluationRating && !/^[A-F][1-6]$/.test(options.evaluationRating)) errors.push("J: use A1 through F6");
  if (options.signatureEquipment && options.signatureEquipment !== "!") errors.push("L: use !");
  if (options.hostile && options.hostile !== "ENY") errors.push("N: use ENY");
  if (app6aSymbolClass(sidc) === "point" && options.direction !== undefined && options.direction !== null) errors.push("Q: not applicable to ordinary tactical points");
  for (const key of ["sigint","country","platformType","equipmentTeardownTime","commonIdentifier","auxiliaryEquipmentIndicator","headquartersElement","installationComposition","engagementBar","engagementType","guardedUnit","specialDesignator"]) {
    if (options[key]) errors.push(`${key}: not an APP-6A Table III modifier`);
  }
  return errors;
}
