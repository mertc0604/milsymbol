import { ms, app6a } from "../index.mjs";

// Third pass over the user's selected Annex D rows. Positions are read from
// the publication cells in milsymbol's SVG units (PDF pp. 160–268).
ms.reset();
ms.addIcons(app6a);
const result = {};
const parts = (sidc, standard = "APP6A") => {
  const visit = values => values.flatMap(value => Array.isArray(value)
    ? visit(value) : value ? [value, ...visit(value.draw || [])] : []);
  return visit(new ms.Symbol(sidc, { standard }).drawInstructions).filter(part => part.icon);
};
const ground = (code, affiliation) => parts(`S${affiliation}GP${code}-----`);
const paths = list => list.filter(p => p.type === "path").map(p => p.d);

for (const affiliation of ["U", "F", "N", "H"]) {
  const signal = { U: "M44.3,69.1 100,109.5 100,89.2 156.2,130.5", H: "M50.8,77.2 100,108.8 100,87.5 151.8,120.2" }[affiliation];
  if (signal) {
    for (const code of ["UUSC--", "UUSO--", "UUSF--", "UUSR--"]) {
      result[`flatter signal bolt ${code}/${affiliation}`] = [paths(ground(code, affiliation)).includes(signal), true];
    }
  }
  const recon = { U: "M44.1,130.8L155.9,69.2", H: "M53.5,125.6L146.5,74.4" }[affiliation];
  if (recon) {
    for (const code of ["UUACRW", "UUMSEA", "UCRV--", "UCRR--"]) {
      result[`flatter reconnaissance diagonal ${code}/${affiliation}`] = [paths(ground(code, affiliation)).includes(recon), true];
    }
  }
  const divider = { U: 120, F: 125, N: 136, H: 120 }[affiliation];
  for (const code of ["USS4--", "USS5--", "USS8T-", "USS3AT", "USSWPT"]) {
    result[`supply bar height ${code}/${affiliation}`] = [paths(ground(code, affiliation)).some(d => new RegExp(`^M[\\d.]+,${divider} H`).test(d)), true];
  }
  result[`aviation fuel glass and rotor ${affiliation}`] = [
    paths(ground("USS3AT", affiliation)).filter(d => /^M[\d.]+,[\d.]+ V[\d.]+ L/.test(d) || /^M[\d.]+,[\d.]+ V[\d.]+ L[\d.]+,[\d.]+ Z M/.test(d)).length, 2];
  const airfield = ground("USTA--", affiliation).find(p => p.type === "circle");
  result[`larger airfield wheel ${affiliation}`] = [[airfield.cx, airfield.cy, airfield.r], [99.3, 116, 28.4]];
  result[`chemical dots low in the track ${affiliation}`] = [
    ground("UUACCK", affiliation).filter(p => p.type === "circle").map(p => [p.cx, p.cy, p.r]), [[68, 93.5, 7.5], [132, 93.5, 7.5]]];
  result[`tracked mortar oval ${affiliation}`] = [
    paths(ground("UCFMS-", affiliation)).includes("M72,100 H128 C147,100 147,130 128,130 H72 C53,130 53,100 72,100 Z"), true];
  result[`taller engineer bracket ${affiliation}`] = [paths(ground("UCEC--", affiliation)).includes("M65.5,127.5 V93 H134 V127.5 M100,93 V116"), true];
  result[`wheeled security lower and larger ${affiliation}`] = [
    ground("UCSM--", affiliation).filter(p => p.type === "text").map(p => [p.text, p.y, p.fontsize]), [["SEC", 96.2, 33]]];
  result[`rocket launcher bar raised ${affiliation}`] = [paths(ground("UCFRM-", affiliation)).includes("M57,110 H142"), true];
  result[`Vulcan barrel per frame ${affiliation}`] = [
    paths(ground("UCDSV-", affiliation)).includes({ U: "M48.5,67V133", F: "M41,50V150", N: "M56.7,45V155", H: "M58,70V130" }[affiliation]), true];
  result[`air assault V per frame ${affiliation}`] = [
    paths(ground("UCAAS-", affiliation)).some(d => d.includes(` 100,${{ U: 107, F: 113, N: 127, H: 128 }[affiliation]} `)), true];
  result[`law-enforcement thin line ${affiliation}`] = [
    paths(parts(`S${affiliation}SPXL---------`)).includes("M123.3,92 L101.2,130"), true];
  // Later editions keep their own drawings for the same rows.
  for (const standard of ["APP6", "2525"]) {
    result[`other edition unchanged UCFMS-/${affiliation}/${standard}`] = [
      paths(parts(`S${affiliation}GPUCFMS-----`, standard)).some(d => d.startsWith("M72,100 H128")), false];
  }
}
export default result;
