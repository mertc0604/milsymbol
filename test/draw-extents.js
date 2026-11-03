// Test helper: geometric extents of a symbol's abstract draw instructions, so
// tests can check that every drawn part lies inside the symbol bounding box and
// that text rows stay clear of the frame. Not a test file (no .test.js suffix).
import strWidth from "../src/symbolfunctions/string-width.js";

// Points of an SVG path: end points and control points; arcs are sampled
// (library arcs are circular).
function pathPoints(d) {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const points = [];
  let i = 0;
  let command = "";
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  const number = () => parseFloat(tokens[i++]);
  const isCommand = (token) => /^[a-zA-Z]$/.test(token);
  const point = (relative) => {
    const px = number();
    const py = number();
    return [relative ? x + px : px, relative ? y + py : py];
  };
  while (i < tokens.length) {
    if (isCommand(tokens[i])) command = tokens[i++];
    const relative = command === command.toLowerCase();
    const kind = command.toUpperCase();
    if (kind === "Z") {
      x = startX;
      y = startY;
    } else if (kind === "M" || kind === "L" || kind === "T") {
      const p = point(relative);
      x = p[0];
      y = p[1];
      if (kind === "M") {
        startX = x;
        startY = y;
        command = relative ? "l" : "L";
      }
      points.push(p);
    } else if (kind === "H") {
      const px = number();
      x = relative ? x + px : px;
      points.push([x, y]);
    } else if (kind === "V") {
      const py = number();
      y = relative ? y + py : py;
      points.push([x, y]);
    } else if (kind === "C" || kind === "S" || kind === "Q") {
      const count = kind === "C" ? 3 : 2;
      for (let k = 0; k < count; k++) {
        const p = point(relative);
        points.push(p);
        if (k === count - 1) {
          x = p[0];
          y = p[1];
        }
      }
    } else if (kind === "A") {
      const radius = Math.abs(number());
      number();
      number();
      const large = number();
      const sweep = number();
      const end = point(relative);
      const dx = (x - end[0]) / 2;
      const dy = (y - end[1]) / 2;
      const squared = dx * dx + dy * dy;
      const r = Math.max(radius, Math.sqrt(squared));
      const sign = large === sweep ? -1 : 1;
      const k = sign * Math.sqrt(Math.max(0, (r * r - squared) / squared));
      const cx = k * dy + (x + end[0]) / 2;
      const cy = -k * dx + (y + end[1]) / 2;
      const a0 = Math.atan2(y - cy, x - cx);
      let a1 = Math.atan2(end[1] - cy, end[0] - cx);
      if (sweep && a1 < a0) a1 += 2 * Math.PI;
      if (!sweep && a1 > a0) a1 -= 2 * Math.PI;
      for (let s = 0; s <= 24; s++) {
        const a = a0 + ((a1 - a0) * s) / 24;
        points.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
      }
      x = end[0];
      y = end[1];
    } else {
      i++;
    }
  }
  return points;
}

function boxOf(points) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return {
    x1: Math.min.apply(null, xs),
    x2: Math.max.apply(null, xs),
    y1: Math.min.apply(null, ys),
    y2: Math.max.apply(null, ys)
  };
}

// Every geometric part as { kind, part, box, outer }: `box` is the geometry,
// `outer` adds half the stroke width. translate and rotate groups are applied.
// Text uses the renderer's own character widths and a box from 0.8 font sizes
// above to 0.2 below the baseline.
export function drawExtents(instructions, strokeWidth) {
  const out = [];
  const walk = (list, transform) => {
    list.forEach((part) => {
      if (Array.isArray(part)) return walk(part, transform);
      if (!part || typeof part !== "object") return;
      let points = null;
      if (part.type === "path" && part.d) points = pathPoints(part.d);
      else if (part.type === "circle")
        points = [
          [part.cx - part.r, part.cy - part.r],
          [part.cx + part.r, part.cy + part.r]
        ];
      else if (part.type === "text") {
        const width = strWidth(String(part.text), part.fontsize, 0);
        const left =
          part.textanchor === "end"
            ? part.x - width
            : part.textanchor === "middle"
              ? part.x - width / 2
              : part.x;
        points = [
          [left, part.y - part.fontsize * 0.8],
          [left + width, part.y + part.fontsize * 0.2]
        ];
      }
      if (points) {
        const box = boxOf(points.map((p) => transform(p[0], p[1])));
        const half = part.stroke
          ? (part.strokewidth === undefined ? strokeWidth : part.strokewidth) /
            2
          : 0;
        out.push({
          kind: part.type,
          part: part,
          box: box,
          outer: {
            x1: box.x1 - half,
            x2: box.x2 + half,
            y1: box.y1 - half,
            y2: box.y2 + half
          }
        });
      }
      if (part.type === "translate") {
        walk(part.draw || [], (px, py) => transform(px + part.x, py + part.y));
      } else if (part.type === "rotate") {
        const a = (part.degree * Math.PI) / 180;
        walk(part.draw || [], (px, py) => {
          const dx = px - part.x;
          const dy = py - part.y;
          return transform(
            part.x + dx * Math.cos(a) - dy * Math.sin(a),
            part.y + dx * Math.sin(a) + dy * Math.cos(a)
          );
        });
      } else if (part.draw) {
        walk(part.draw, transform);
      }
    });
  };
  walk(instructions, (x, y) => [x, y]);
  return out;
}

// The viewBox the SVG output uses: the symbol bbox plus the stroke width.
export function viewBoxOf(svg) {
  const v = /viewBox="([^"]+)"/.exec(svg)[1].split(" ").map(parseFloat);
  return { x1: v[0], y1: v[1], x2: v[0] + v[2], y2: v[1] + v[3] };
}

export function intersects(a, b) {
  const eps = 0.01;
  return (
    a.x1 < b.x2 - eps &&
    a.x2 > b.x1 + eps &&
    a.y1 < b.y2 - eps &&
    a.y2 > b.y1 + eps
  );
}

export function outside(box, view) {
  const eps = 0.01;
  return (
    box.x1 < view.x1 - eps ||
    box.x2 > view.x2 + eps ||
    box.y1 < view.y1 - eps ||
    box.y2 > view.y2 + eps
  );
}
