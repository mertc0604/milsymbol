import { ms, app6a } from "../index.mjs";

ms.reset();
ms.addIcons(app6a);
ms.setStandard("APP6A");
const result = {};
const selected = ["UCDH--", "UCAWS-", "UCAWW-", "UCAWWR", "UCAAAS", "UCAAOS", "UCFHX-", "UCFMT-", "UCRV--", "UCRR--", "UCRRD-", "UUACCM", "UUMSED", "UUMSEI", "UUSA--", "UUSF--", "UUSM--", "UUSMS-", "UUSML-", "UUX---", "USMVT-", "USS3AC"];
function parts(symbol) {
  const visit = values => values.flatMap(value => Array.isArray(value)
    ? visit(value) : value ? [value, ...visit(value.draw || [])] : []);
  return visit(symbol.drawInstructions).filter(part => part.icon);
}
const render = (code, affiliation = "F", options = {}) => new ms.Symbol(`S${affiliation}GP${code}-----`, { standard: "APP6A", ...options });
// The selected Annex D rows use fine linework, with the air-assault V
// inside its vehicle or triangle and signal labels to the right of the bolt.
for (const affiliation of ["U", "F", "N", "H"]) {
  for (const code of selected) {
    const lines = parts(render(code, affiliation)).filter(p => ["path", "circle"].includes(p.type) && p.stroke !== false && p.fill === false);
    result[`fine APP6A interior ${code}/${affiliation}`] = [lines.length > 0 && lines.every(p => p.strokewidth <= 1.5), true];
  }
  for (const code of ["UCAAAS", "UCAAOS"]) {
    const foot = { U: 107, F: 113, N: 127, H: 128 }[affiliation];
    const v = parts(render(code, affiliation)).find(p => p.type === "path" && p.d.includes(` 100,${foot} `));
    result[`air-assault V inside triangle ${code}/${affiliation}`] = [Boolean(v), true];
  }
  for (const [code, text] of [["UUSA--", "AREA"], ["UUSF--", "FWD"], ["UUSM--", "MSE"], ["UUSMS-", "SEN"], ["UUSML-", "LEN"]]) {
    const label = parts(render(code, affiliation)).find(p => p.text === text);
    result[`signal label right of bolt ${code}/${affiliation}`] = [label.x >= 110 && label.y >= 75 && label.y <= 85, true];
  }
  for (const code of ["UCAWW-", "UCAWWR", "UCFHX-", "UCRR--", "UCRRD-", "UUX---"]) {
    result[`smooth waterline ${code}/${affiliation}`] = [parts(render(code, affiliation)).some(p => (p.d?.match(/ C/g) || []).length >= 7), true];
  }
  const ew = parts(render("UUMSED", affiliation));
  result[`direction finding labels flank stem ${affiliation}`] = [ew.some(p => p.text === "E" && p.x < 90) && ew.some(p => p.text === "W" && p.x > 110), true];
  const sd = parts(render("UUACCM", affiliation)).find(p => p.text === "SD");
  result[`motorized smoke label clears stem ${affiliation}`] = [sd.x < 90 && sd.fontsize <= 28, true];
  const veterinary = parts(render("USMVT-", affiliation)).find(p => p.text === "V");
  result[`veterinary label in lower right quadrant ${affiliation}`] = [veterinary.x > 110 && veterinary.x < 140 && veterinary.y < 135, true];
}
const wheels = parts(render("UCFMT-")).filter(p => p.type === "circle");
result["towed mortar wheels meet bar"] = [wheels.filter(p => p.cx !== 100).every(p => p.cy >= 110 && p.cy <= 116 && p.r <= 5), true];
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
    for (const frame of [true, false]) for (const fill of [true, false]) for (const strokeWidth of [1, 3, 6]) {
      const symbol = render(code, affiliation, { frame, fill, strokeWidth });
      const [x, y, width, height] = symbol.asSVG().match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
      const outside = drawingPoints(symbol).filter(([px, py]) => px < x + 0.65 || py < y + 0.65 || px > x + width - 0.65 || py > y + height - 0.65);
      result[`viewport contains drawing ${code}/${affiliation}/${frame}/${fill}/${strokeWidth}`] = [outside.length === 0, true];
    }
  }
}
export default result;
