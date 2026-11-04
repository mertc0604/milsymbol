import { ms, app6a } from "../index.mjs";

ms.reset();
ms.addIcons(app6a);
ms.setStandard("APP6A");
const result = {};
function parts(code, affiliation = "F", standard = "APP6A") {
  const symbol = new ms.Symbol(`S${affiliation}GP${code}-----`, { standard });
  const visit = values => values.flatMap(value => Array.isArray(value)
    ? visit(value) : value ? [value, ...visit(value.draw || [])] : []);
  return visit(symbol.drawInstructions).filter(part => part.icon);
}
// Independently read from the selected Annex D rows (PDF pp. 173–229).
const selected = [
  "UCDS--", "UCDSV-", "UCDO--", "UCATA-", "UCATW-", "UCATWR", "UCAWL-", "UCAAS-",
  "UCVV--", "UCVUF-", "UCVUR-", "UCEC--", "UCEN--", "UCENN-", "UCFRS-", "UCFRSS",
  "UCFRSR", "UCFRST", "UCFRM-", "UCFRMS", "UCFRMR", "UCFRMT", "UCFMS-", "UCFMTS",
  "UCFML-", "UCRRF-", "UCRRL-", "UCSW--", "UUACCK", "UUACSA", "UUACRW", "UUACRS",
  "UUMA--", "UUMSEA", "UUMRG-", "UUSC--", "UUSCL-", "UUSO--", "UUSMN-", "UUSR--",
  "UUSRT-", "UUSRW-", "UUSS--", "USAPBC", "USS3AT", "USS4--", "USS4T-", "USS4C-",
  "USS5--", "USS8T-", "USSWPT", "UCECS-", "UCSM--", "UCSR--", "USS8C-", "USTA--", "USTAT-", "USTAC-"
];
for (const affiliation of ["U", "F", "N", "H"]) {
  for (const code of selected) {
    const lines = parts(code, affiliation).filter(p => (p.type === "path" || p.type === "circle") && p.stroke !== false && p.fill === false);
    result[`Annex D fine interior linework ${code}/${affiliation}`] = [lines.every(p => p.strokewidth <= 1.5), true];
  }
  for (const [code, label] of [["UUSC--", "CCP"], ["UUSCL-", "LCCP"], ["UUSO--", "OPS"], ["UUSMN-", "NC"], ["UUSS--", "SPT"]]) {
    const text = parts(code, affiliation).find(p => p.text === label);
    result[`signal label above the bolt step ${code}/${affiliation}`] = [text.x >= 110 && text.y >= 77 && text.y <= 81, true];
  }
  const role = parts("UCDS--", affiliation).find(p => p.text === "SRD");
  result[`air-defense role clears the dome ${affiliation}`] = [role.y, { U: 91, F: 107, N: 115, H: 90 }[affiliation]];
  for (const code of ["UCFRS-", "UCFRSS", "UCFRMS"]) {
    const icon = parts(code, affiliation);
    result[`tracked rocket dot below chevrons ${code}/${affiliation}`] = [icon.find(p => p.type === "circle").cy >= 106, true];
  }
  for (const code of ["UUACRS", "UUMSEA"]) {
    const label = parts(code, affiliation).find(p => p.type === "text");
    result[`vehicle label fits inside track ${code}/${affiliation}`] = [label.fontsize <= 27 && label.y >= 75 && label.y <= 100, true];
  }
}
// Bounds of the new absolute-coordinate paths express the publication's
// relative dimensions, without requiring a particular SVG path spelling.
function extent(part) {
  const pairs = [...(part.d || "").matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(m => [+m[1], +m[2]]);
  return { x: pairs.map(p => p[0]), y: pairs.map(p => p[1]) };
}
result["tracked mortar uses full-width mounting"] = [parts("UCFMS-").some(p => {
  const e = extent(p); return Math.max(...e.x) - Math.min(...e.x) > 80 && Math.min(...e.y) >= 100 && Math.max(...e.y) <= 130;
}), true];
result["riverine label clears the waterline"] = [parts("UCSW--").find(p => p.text === "SEC").y, 100];
result["supply IV beam raised above supply divider"] = [parts("USS4--").some(p => {
  const e = extent(p); return Math.min(...e.y) <= 80 && Math.max(...e.y) >= 110 && Math.min(...e.x) > 50 && Math.max(...e.x) < 150;
}), true];
result["supply V ammunition reaches supply divider"] = [parts("USS5--").some(p => {
  const e = extent(p); return Math.min(...e.y) <= 78 && Math.max(...e.y) >= 118 && Math.min(...e.x) > 65 && Math.max(...e.x) < 135;
}), true];
result["wheeled security label fits inside track"] = [parts("UCSM--").find(p => p.text === "SEC").fontsize <= 34, true];
result["railroad security clears the wheel bar"] = [parts("UCSR--").find(p => p.text === "SEC").y < 105, true];
result["APP6 keeps its later radio geometry"] = [parts("UUSR--", "F", "APP6").some(p => p.d?.includes("100,108 V 82.5")), true];
// A viewport regression: evaluate the actual drawing instructions (including
// relative path coordinates and transform groups) against the exported SVG.
// Sampling cubic curves catches the visible geometry, not just control points.
function drawingPoints(symbol) {
  const points = [];
  function visit(values, tx = 0, ty = 0, scale = 1) {
    for (const part of values) {
      if (Array.isArray(part)) { visit(part, tx, ty, scale); continue; }
      if (!part) continue;
      if (part.draw) {
        visit(part.draw, tx + (part.x || 0) * scale, ty + (part.y || 0) * scale,
          scale * (part.factor || 1));
        continue;
      }
      if (!part.icon) continue;
      const push = (x, y) => points.push([tx + x * scale, ty + y * scale]);
      if (part.type === "circle") {
        push(part.cx - part.r, part.cy - part.r);
        push(part.cx + part.r, part.cy + part.r);
      } else if (part.type === "text") {
        const halfWidth = part.fontsize * part.text.length * 0.34;
        push(part.x - halfWidth, part.y - part.fontsize / 2);
        push(part.x + halfWidth, part.y + part.fontsize / 2);
      } else if (part.type === "path") {
        const tokens = part.d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)/g) || [];
        let i = 0, command, x = 0, y = 0, startX = 0, startY = 0;
        while (i < tokens.length) {
          if (/^[a-zA-Z]$/.test(tokens[i])) command = tokens[i++];
          const relative = command === command.toLowerCase();
          const upper = command.toUpperCase();
          if (upper === "Z") { x = startX; y = startY; push(x, y); command = "M"; continue; }
          const n = { M: 2, L: 2, H: 1, V: 1, C: 6 }[upper];
          if (!n) throw new Error(`Unsupported viewport-test path command ${command}`);
          const coords = tokens.slice(i, i + n).map(Number); i += n;
          if (upper === "H") { x = coords[0] + (relative ? x : 0); push(x, y); }
          else if (upper === "V") { y = coords[0] + (relative ? y : 0); push(x, y); }
          else {
            for (let j = 0; j < n; j += 2) {
              coords[j] += relative ? x : 0; coords[j + 1] += relative ? y : 0;
            }
            if (upper === "C") {
              for (let step = 0; step <= 100; step++) {
                const t = step / 100, u = 1 - t;
                push(u ** 3 * x + 3 * u ** 2 * t * coords[0] + 3 * u * t ** 2 * coords[2] + t ** 3 * coords[4],
                  u ** 3 * y + 3 * u ** 2 * t * coords[1] + 3 * u * t ** 2 * coords[3] + t ** 3 * coords[5]);
              }
            }
            x = coords[n - 2]; y = coords[n - 1]; push(x, y);
            if (upper === "M") { startX = x; startY = y; command = relative ? "l" : "L"; }
          }
        }
      }
    }
  }
  visit(symbol.drawInstructions);
  return points;
}
for (const affiliation of ["U", "F", "N", "H"]) {
  for (const code of selected) {
    for (const strokeWidth of [1, 3]) {
      const symbol = new ms.Symbol(`S${affiliation}GP${code}-----`, { standard: "APP6A", frame: false, strokeWidth });
      const [x, y, width, height] = symbol.asSVG().match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
      const outside = drawingPoints(symbol).filter(([px, py]) => px < x + 0.65 || py < y + 0.65 || px > x + width - 0.65 || py > y + height - 0.65);
      result[`unframed viewport contains full drawing ${code}/${affiliation}/${strokeWidth}`] = [outside.length === 0, true];
    }
  }
}

export default result;
