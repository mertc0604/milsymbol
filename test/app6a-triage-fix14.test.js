import { ms, app6a } from "../index.mjs";

// The 14 rows marked for correction on 2026-11-04. Every number below was read
// from the Annex D cell of the identity it names (PDF pp. 171–238), in
// milsymbol's SVG units, so a tolerance stands for the print's raster.
ms.reset();
ms.addIcons(app6a);
const result = {};
const identities = ["U", "F", "N", "H"];
const near = (actual, expected, tolerance = 1.5) => Math.abs(actual - expected) <= tolerance;
const check = (name, value) => { result[name] = [value, true]; };

function drawn(sidc, options = {}) {
  const symbol = new ms.Symbol(sidc, { standard: "APP6A", ...options });
  const visit = values => values.flatMap(value => Array.isArray(value)
    ? visit(value) : value ? [value, ...visit(value.draw || [])] : []);
  return { symbol, parts: visit(symbol.drawInstructions).filter(part => part.icon) };
}
const ground = (code, identity, options) => drawn(`S${identity}GP${code}-----`, options).parts;

// Straight runs and sampled curves of a path, as [[x, y], [x, y]] segments.
function segments(part) {
  const tokens = part.d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+)/g) || [];
  const found = [];
  let i = 0, command, x = 0, y = 0, startX = 0, startY = 0;
  const to = (nextX, nextY) => { found.push([[x, y], [nextX, nextY]]); x = nextX; y = nextY; };
  while (i < tokens.length) {
    if (/^[a-zA-Z]$/.test(tokens[i])) command = tokens[i++];
    const relative = command === command.toLowerCase();
    const upper = command.toUpperCase();
    if (upper === "Z") { to(startX, startY); command = "M"; continue; }
    const n = { M: 2, L: 2, H: 1, V: 1, C: 6, A: 7 }[upper];
    if (!n) throw new Error(`Unsupported path command ${command}`);
    const values = tokens.slice(i, i + n).map(Number);
    i += n;
    if (upper === "H") to(values[0] + (relative ? x : 0), y);
    else if (upper === "V") to(x, values[0] + (relative ? y : 0));
    // No row below is drawn with arcs now; the shared wheel primitive is.
    else if (upper === "A") to(values[5] + (relative ? x : 0), values[6] + (relative ? y : 0));
    else {
      for (let j = 0; relative && j < n; j += 2) { values[j] += x; values[j + 1] += y; }
      if (upper === "M") {
        x = startX = values[0]; y = startY = values[1];
        command = relative ? "l" : "L";
      } else if (upper === "L") to(values[0], values[1]);
      else {
        const [fromX, fromY] = [x, y];
        for (let step = 1; step <= 40; step++) {
          const t = step / 40, u = 1 - t;
          to(u ** 3 * fromX + 3 * u ** 2 * t * values[0] + 3 * u * t ** 2 * values[2] + t ** 3 * values[4],
            u ** 3 * fromY + 3 * u ** 2 * t * values[1] + 3 * u * t ** 2 * values[3] + t ** 3 * values[5]);
        }
      }
    }
  }
  return found;
}
const paths = list => list.filter(part => part.type === "path");
const allSegments = list => paths(list).flatMap(segments);
const points = list => allSegments(list).flat();
function box(list) {
  const all = points(list);
  return {
    x0: Math.min(...all.map(p => p[0])), x1: Math.max(...all.map(p => p[0])),
    y0: Math.min(...all.map(p => p[1])), y1: Math.max(...all.map(p => p[1]))
  };
}
const horizontals = (list, length = 5) => allSegments(list)
  .filter(([a, b]) => a[1] === b[1] && Math.abs(a[0] - b[0]) >= length)
  .map(([a, b]) => ({ y: a[1], x0: Math.min(a[0], b[0]), x1: Math.max(a[0], b[0]) }));
const verticals = (list, length = 5) => allSegments(list)
  .filter(([a, b]) => a[0] === b[0] && Math.abs(a[1] - b[1]) >= length)
  .map(([a, b]) => ({ x: a[0], y0: Math.min(a[1], b[1]), y1: Math.max(a[1], b[1]) }));
const vertical = (list, x, tolerance = 0.6) => verticals(list).find(line => near(line.x, x, tolerance));
// The y values where the outline of a shape crosses a vertical line.
const crossings = (list, x) => allSegments(list)
  .filter(([a, b]) => (a[0] - x) * (b[0] - x) < 0)
  .map(([a, b]) => a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]))
  .sort((a, b) => a - b);
const solids = list => paths(list).filter(part => part.stroke === false);
const lines = list => paths(list).filter(part => part.stroke !== false);
const circles = list => list.filter(part => part.type === "circle");
// milsymbol draws middle-aligned text with its base line a third of the font
// size below y, and Arial capitals reach 0.705 of the size above that line.
const capitals = part => ({
  top: part.y + part.fontsize / 3 - 0.705 * part.fontsize,
  bottom: part.y + part.fontsize / 3
});

// PDF 174–175: missile air defence.
const air = {
  U: { apex: 105, left: 38.5, right: 161.5, tip: 51, arc: 98.6, side: 100.7 },
  F: { apex: 125, left: 25, right: 175, tip: 72, arc: 117.8, side: 120.3 },
  N: { apex: 134.6, left: 45, right: 155, tip: 79.5, arc: 127.5, side: 129.3 },
  H: { apex: 101, left: 49, right: 151, tip: 45.5, arc: 94.5, side: 97 }
};
for (const identity of identities) {
  const frame = air[identity];
  for (const [code, rows] of [["UCDML-", []], ["UCDMM-", [84]], ["UCDMH-", [79.5, 87.5]]]) {
    const icon = ground(code, identity);
    const name = `${code}/${identity}`;
    const cross = horizontals(icon).filter(line => line.y > 64 && line.y < frame.apex - 3);
    check(`missile cross lines at their rows ${name}`, cross.length === rows.length
      && rows.every((y, i) => near(cross[i].y, y, 1)));
    check(`missile cross lines reach both sides ${name}`,
      cross.every(line => near(line.x0, 83.5, 0.6) && near(line.x1, 116.5, 0.6)));
    check(`missile body width ${name}`, Boolean(vertical(icon, 83.5) && vertical(icon, 116.5)));
    check(`missile body top ${name}`, near(Math.min(...points(icon).filter(p => p[0] > 84 && p[0] < 116).map(p => p[1])), 60.5, 1));
    check(`missile foot on the dome ${name}`, near(vertical(icon, 83.5)?.y1, frame.apex + 1, 1.5));
    const outer = box(icon);
    check(`missile dome reaches the frame ${name}`, near(outer.x0, frame.left) && near(outer.x1, frame.right));
    const apex = crossings(icon, 100.5).at(-1);
    check(`missile dome apex ${name}`, near(apex, frame.apex, 1));
    check(`missile lines are fine ${name}`, lines(icon).every(part => part.strokewidth <= 1.5));
  }
  const composite = ground("UCDC--", identity);
  const name = `UCDC--/${identity}`;
  const side = vertical(composite, 91.5);
  check(`composite body narrow and long ${name}`, Boolean(side && vertical(composite, 108.5)) && side.y1 - side.y0 > 40);
  const top = Math.min(...points(composite).filter(p => p[0] > 92 && p[0] < 108).map(p => p[1]));
  check(`composite tip ${name}`, near(top, frame.tip, 1));
  const centre = vertical(composite, 100);
  check(`composite centre line ${name}`, Boolean(centre) && near(centre.y0, frame.tip, 1) && near(centre.y1, frame.arc, 1));
  const onDome = crossings(composite, 88);
  check(`composite arc stands on the dome ${name}`, onDome.length >= 2
    && near(onDome.at(-1) - onDome.at(-2), 3.5, 2.5));
  check(`composite arc height ${name}`, crossings(composite, 104).some(y => near(y, frame.arc, 1.2)));
  check(`composite lines are fine ${name}`, lines(composite).every(part => part.strokewidth <= 1.5));
  // The sides end on the small arc: nothing runs on through it to the dome.
  check(`composite sides stop on the arc ${name}`, near(side?.y1, frame.side, 1) && near(vertical(composite, 108.5)?.y1, frame.side, 1));
  const below = allSegments(composite).filter(([a, b]) => Math.min(a[0], b[0]) > 90 && Math.max(a[0], b[0]) < 110
    && a[0] === b[0] && Math.max(a[1], b[1]) > frame.side + 1);
  check(`composite leaves the arc empty ${name}`, below.length === 0);
}

// PDF 182, 201: blades 41 tall at their ends. Rotary wing keeps its mast.
for (const identity of identities) {
  for (const code of ["UCVR--", "UCSA--"]) {
    const blades = solids(ground(code, identity));
    check(`rotor blades ${code}/${identity}`, blades.length === 1
      && near(box(blades).y0, 80, 1) && near(box(blades).y1, 121, 1)
      && near(box(blades).x0, 60, 1) && near(box(blades).x1, 140, 1));
  }
  const mast = vertical(ground("UCVR--", identity), 100);
  check(`rotary wing mast ${identity}`, Boolean(mast) && mast.y0 <= 101 && near(mast.y1, 150, 1));
  const security = ground("UCSA--", identity).find(part => part.text === "SEC");
  const { top, bottom } = capitals(security);
  check(`aviation label height ${identity}`, near(top, 63.9, 1) && near(bottom, 85.7, 1));
  check(`aviation label width ${identity}`, near(security.fontsize, 31, 1));
}

// PDF 189: a solid anchor on a heavier engineer bracket.
const anchorTop = {
  U: { ring: 57.2, stock: 64.2 }, F: { ring: 58.75, stock: 65.2 },
  N: { ring: 56, stock: 63.9 }, H: { ring: 56.1, stock: 63.6 }
};
for (const identity of identities) {
  const icon = ground("UCENN-", identity);
  const shapes = solids(icon);
  const anchor = shapes.find(part => near(box([part]).y0, 79, 1.5));
  check(`anchor arms are solid ${identity}`, Boolean(anchor)
    && near(box([anchor]).x0, 74.3, 1) && near(box([anchor]).x1, 125.7, 1) && near(box([anchor]).y1, 103.4, 1));
  const at90 = anchor ? crossings([anchor], 90) : [];
  check(`anchor arm thickness ${identity}`, at90.length === 2 && near(at90[0], 95.7, 1.2) && near(at90[1], 101.6, 1.2));
  check(`anchor has no thin arm lines ${identity}`, !lines(icon).some(part => {
    const { y0, y1 } = box([part]);
    return y0 > 70 && y1 < 106;
  }));
  const { ring, stock } = anchorTop[identity];
  check(`anchor stock ${identity}`, horizontals(shapes, 30).some(line => near(line.y, stock, 0.6)
    && near(line.x0, 79, 1) && near(line.x1, 121, 1)));
  check(`anchor ring ${identity}`, shapes.some(part => {
    const b = box([part]);
    return near(b.x0, 93.6, 1) && near(b.x1, 106.4, 1) && near((b.y0 + b.y1) / 2, ring, 0.6) && near(b.y1 - b.y0, 12.8, 1);
  }));
  check(`anchor ring has a hole ${identity}`, shapes.some(part => crossings([part], 100.5).length >= 4));
  check(`bracket beam is heavy ${identity}`, shapes.some(part => {
    const b = box([part]);
    return near(b.x0, 71.6, 1) && near(b.x1, 128.4, 1) && near(b.y0, 107, 1) && near(b.y1, 110.4, 1);
  }));
  check(`bracket legs ${identity}`, near(vertical(icon, 72.5)?.y1, 137, 1) && near(vertical(icon, 127.5)?.y1, 137, 1));
  check(`bracket stub ${identity}`, near(vertical(icon, 100)?.y1, 127, 1));
}

// PDF 199, 203: wheels stand apart, below the body.
const halfStroke = 0.65;
const wheelsClearBody = (wheels, bottom) => wheels.every(wheel => wheel.cy - wheel.r - halfStroke > bottom + halfStroke);
const lightBody = { U: [75, 141.5], F: [75.3, 141.5], N: [74.7, 141.5], H: [73.5, 143] };
for (const identity of identities) {
  const icon = ground("UCRRL-", identity);
  const body = lines(icon).find(part => horizontals([part], 30).length >= 2);
  const { x0, x1, y0, y1 } = body ? box([body]) : {};
  check(`light recon body ${identity}`, near(y0, lightBody[identity][0], 1) && near(y1, 115.5, 0.6)
    && near(x1, lightBody[identity][1], 1) && near(x0, 200 - lightBody[identity][1], 1));
  const wheels = circles(icon);
  check(`light recon wheel spacing ${identity}`, wheels.length === 3
    && [63, 99.5, 135.8].every((x, i) => near(wheels[i].cx, x, 0.8)));
  check(`light recon wheels below the body ${identity}`, wheelsClearBody(wheels, y1));
  check(`light recon wheel bottom ${identity}`, wheels.every(wheel => near(wheel.cy + wheel.r, 126, 1)));
}
const chemicalTop = { U: 69.1, F: 70.4, N: 68.7, H: 67.9 };
for (const identity of identities) {
  const icon = ground("UUACRW", identity);
  const body = lines(icon).find(part => horizontals([part], 30).length >= 2);
  const { x0, x1, y0, y1 } = body ? box([body]) : {};
  check(`chemical wheeled body ${identity}`, near(y0, chemicalTop[identity], 0.6) && near(y1, 110, 0.6)
    && near(x0, 59, 1) && near(x1, 141, 1));
  const hollow = circles(icon).filter(part => part.fill === false);
  check(`chemical wheel spacing ${identity}`, hollow.length === 3
    && [63.5, 99.5, 136.5].every((x, i) => near(hollow[i].cx, x, 0.6)));
  check(`chemical wheels below the body ${identity}`, wheelsClearBody(hollow, y1));
  check(`chemical wheel bottom ${identity}`, hollow.every(wheel => near(wheel.cy + wheel.r, 120.7, 0.6)));
  const dots = circles(icon).filter(part => part.fill !== false);
  check(`chemical dots follow the body ${identity}`, dots.length === 2
    && dots.every(dot => near(dot.cy, chemicalTop[identity] + 9.3, 0.6) && near(dot.r, 5.4, 0.5))
    && near(dots[0].cx, 79.5, 0.8) && near(dots[1].cx, 120, 0.8));
}

// PDF 226, 232: the chevron of these two corps rows runs from frame to frame.
const corps = {
  U: { end: 163, top: 77, tip: 150, bottom: 123 }, F: { end: 175, top: 50, tip: 157, bottom: 150 },
  N: { end: 153.7, top: 45, tip: 141.7, bottom: 155 }, H: { end: 152.2, top: 80, tip: 140.3, bottom: 120 }
};
const chevron = (icon, identity) => {
  const { end, top, tip, bottom } = corps[identity];
  return allSegments(icon).some(([a, b]) => near(a[0], end, 0.8) && near(a[1], top, 1) && near(b[0], tip, 0.8) && near(b[1], 100, 0.2))
    && allSegments(icon).some(([a, b]) => near(a[0], tip, 0.8) && near(a[1], 100, 0.2) && near(b[0], end, 0.8) && near(b[1], bottom, 1));
};
const classVIII = {
  U: { top: 31, cross: 78, crossLeft: 40.5, crossRight: 162.4, bar: 120, barLeft: 36.4, barRight: 161.3 },
  F: { top: 50, cross: 91, crossLeft: 25, crossRight: 160.2, bar: 125, barLeft: 25, barRight: 166 },
  N: { top: 45, cross: 84, crossLeft: 45, crossRight: 145.2, bar: 136, barLeft: 45, barRight: 149.6 },
  H: { top: 28, cross: 73.5, crossLeft: 54.5, crossRight: 145.5, bar: 120, barLeft: 48, barRight: 152.2 }
};
for (const identity of identities) {
  const icon = ground("USS8C-", identity);
  const row = classVIII[identity];
  check(`class VIII chevron ${identity}`, chevron(icon, identity));
  check(`class VIII cross arm ${identity}`, horizontals(icon, 30).some(line => near(line.y, row.cross, 0.8)
    && near(line.x0, row.crossLeft, 0.8) && near(line.x1, row.crossRight, 0.8)));
  check(`class VIII supply bar ${identity}`, horizontals(icon, 30).some(line => near(line.y, row.bar, 0.8)
    && near(line.x0, row.barLeft, 0.8) && near(line.x1, row.barRight, 0.8)));
  const post = vertical(icon, 100);
  check(`class VIII post ${identity}`, near(post?.y0, row.top, 1) && near(post?.y1, row.bar, 1));

  for (const code of ["USTI--", "USTIC-"]) {
    const transport = ground(code, identity);
    const name = `${code}/${identity}`;
    const centre = vertical(transport, 100, 0.3);
    const tip = identity === "F" ? 53.3 : 50;
    check(`transport missile centre line ${name}`, Boolean(centre) && near(centre.y0, tip, 1) && near(centre.y1, 85, 1));
    check(`transport missile body ${name}`, Boolean(vertical(transport, 93.5) && vertical(transport, 106.5))
      && near(vertical(transport, 93.5)?.y1, 85, 1));
    check(`transport missile tip ${name}`, near(Math.min(...points(transport).filter(p => p[0] > 94 && p[0] < 106).map(p => p[1])), tip, 1));
    const [wheel] = circles(transport);
    check(`transport wheel ${name}`, near(wheel?.cx, 99.3, 0.6) && near(wheel?.cy, 116, 0.8) && near(wheel?.r, 28.4, 0.8));
    check(`transport wheel clears the missile ${name}`, wheel?.cy - wheel?.r > 86.5);
    const spoke = vertical(transport, 99.3, 0.3);
    check(`transport spoke ${name}`, Boolean(spoke) && near(spoke.y0, 87.6, 1) && near(spoke.y1, 144.4, 1));
    check(`transport lines are fine ${name}`, lines(transport).every(part => part.strokewidth <= 1.5));
  }
  check(`missile corps chevron ${identity}`, chevron(ground("USTIC-", identity), identity));
}

// PDF 232: the Friend frame stands just above the missile. It must not touch
// the inner edge of the frame line at any frame stroke.
for (const code of ["USTI--", "USTIC-"]) {
  for (const strokeWidth of [1, 2, 3, 4]) {
    const icon = ground(code, "F", { strokeWidth });
    const highest = Math.min(...points(icon).filter(p => p[0] > 92 && p[0] < 108).map(p => p[1]));
    check(`Friend transport missile clears the frame ${code}/${strokeWidth}`, highest - halfStroke > 50 + strokeWidth / 2);
  }
}

// PDF 238: long range is a single cross line, framed or not.
for (const identity of identities) {
  for (const frame of [true, false]) {
    const icon = ground("EWMSL-", identity, { frame });
    const name = `${identity}/${frame ? "framed" : "unframed"}`;
    const rows = horizontals(icon, 20);
    check(`long range single cross line ${name}`, rows.length === 1 && near(rows[0].y, 95, 1)
      && near(rows[0].x0, 81, 1) && near(rows[0].x1, 119, 1));
    check(`long range launcher sides ${name}`, near(vertical(icon, 82.5)?.y1, 140, 0.6) && near(vertical(icon, 117.5)?.y1, 140, 0.6));
    const centre = vertical(icon, 100);
    check(`long range centre line ${name}`, Boolean(centre) && near(centre.y0, 51.5, 1) && near(centre.y1, 140, 0.6));
    check(`long range arch top ${name}`, near(Math.min(...points(icon).map(p => p[1])), 51.5, 1));
    check(`long range lines are fine ${name}`, lines(icon).every(part => part.strokewidth <= 1.5));
  }
}

// PDF 171: the hull stands clear below SOF.
for (const identity of identities) {
  const { parts } = drawn(`S${identity}FPSNN--------`);
  const hull = solids(parts);
  check(`submarine hull has no outline ${identity}`, hull.length === 1);
  const { x0, x1, y0, y1 } = box(hull);
  check(`submarine hull extent ${identity}`, near(x0, 61.5, 1) && near(x1, 137.5, 1) && near(y0, 87.5, 1) && near(y1, 136, 1.2));
  check(`submarine tower width ${identity}`, horizontals(hull, 30).some(line => near(line.y, 87.5, 1) && near(line.x0, 78, 1) && near(line.x1, 121.5, 1)));
  const text = parts.find(part => part.text === "SOF");
  check(`submarine label size ${identity}`, near(text.fontsize, 28, 0.6));
  check(`submarine label clears the hull ${identity}`, capitals(text).bottom < y0 - 1.5);
}

// Nothing may reach past the exported SVG, at any frame stroke.
const rows = [
  ...["UCDML-", "UCDMM-", "UCDMH-", "UCDC--", "UCVR--", "UCENN-", "UCRRL-", "UCSA--", "UUACRW", "USS8C-", "USTI--", "USTIC-", "EWMSL-"]
    .map(code => identity => `S${identity}GP${code}-----`),
  identity => `S${identity}FPSNN--------`
];
for (const sidc of rows) {
  for (const identity of identities) {
    for (const frame of [true, false]) {
      for (const strokeWidth of [1, 2, 3, 4]) {
        const code = sidc(identity);
        const { symbol, parts } = drawn(code, { frame, strokeWidth });
        const [x, y, width, height] = symbol.asSVG().match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
        const clipped = parts.some(part => {
          const pad = part.stroke === false ? 0 : (part.strokewidth ?? strokeWidth) / 2;
          const spots = part.type === "path" ? segments(part).flat()
            : part.type === "circle" ? [[part.cx - part.r, part.cy - part.r], [part.cx + part.r, part.cy + part.r]] : [];
          return spots.some(([px, py]) => px - pad < x - 0.01 || py - pad < y - 0.01
            || px + pad > x + width + 0.01 || py + pad > y + height + 0.01);
        });
        result[`viewport holds the drawing ${code}/${frame}/${strokeWidth}`] = [clipped, false];
        result[`symbol valid ${code}/${frame}/${strokeWidth}`] = [symbol.isValid(), true];
      }
    }
  }
}

// Later editions keep their drawings, and so do the rows marked to skip.
const icons = (sidc, standard) => {
  const part = new ms.Symbol(sidc, { standard }).drawInstructions;
  return JSON.stringify(part);
};
for (const standard of ["APP6", "2525"]) {
  for (const identity of identities) {
    const name = `${identity}/${standard}`;
    const d = code => icons(`S${identity}GP${code}-----`, standard);
    check(`light missile keeps its mark ${name}`, d("UCDML-").includes("M90,90 L110,90"));
    check(`long range keeps its three lines ${name}`, d("EWMSL-").includes("m 85,110 30,0 m -30,-20 30,0 m -30,10 30,0"));
    check(`rotor keeps its blades ${name}`, d("UCVR--").includes("M60,85 l40,15 40,-15 0,30 -40,-15 -40,15 z"));
    check(`submarine keeps its hull ${name}`, icons(`S${identity}FPSNN--------`, standard)
      .includes("m 75,110 -10,-10 10,-10 0,-10 50,0 0,10 10,10 -10,10 z"));
  }
}
for (const identity of identities) {
  const d = code => icons(`S${identity}GP${code}-----`, "APP6A");
  check(`skipped theatre missile row keeps its drawing ${identity}`, d("USTIT-").includes("M 95,78 V 58 c 0,-5 10,-5 10,0 v 20"));
  check(`skipped motorized missile row keeps its drawing ${identity}`, d("UCDMLA").includes("V75 C85,58 115,58 115,75"));
  check(`skipped attack rotor row keeps its drawing ${identity}`, d("UCVRA-").includes("M60,85 l40,15 40,-15 0,30 -40,-15 -40,15 z"));
}

export default result;
