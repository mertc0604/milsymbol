import { ms, std2525d } from "../index.mjs";
import canvasDraw from "../src/ms/symbol/canvasdraw.js";

ms.reset();
ms.addIcons(std2525d);

const symbol = (sidc, options = {}) =>
  new ms.Symbol(sidc, { standard: "2525", ...options });

const first = symbol("10031500001100000000");
const before = first.asSVG();
const second = symbol("10031500001100000100");
const firstAfterSecond = first.asSVG();
const repeatedFirst = symbol("10031500001100000000");

function scaledInstructions(arrayRoot) {
  const group = {
    type: "translate",
    x: 2,
    y: 3,
    draw: [
      [{ type: "path", d: "M0 0L10 10", stroke: "black", strokewidth: 3 }],
      {
        type: "rotate",
        x: 0,
        y: 0,
        degree: 90,
        draw: [
          {
            type: "circle",
            cx: 5,
            cy: 5,
            r: 2,
            stroke: "black",
            strokewidth: 5
          }
        ]
      }
    ]
  };
  const input = arrayRoot ? [group] : group;
  const initial = JSON.stringify(input);
  const half = ms._scale(0.5, input, true);
  const quarter = ms._scale(0.25, input, true);
  const output = symbol("10031000001100000000");
  output.drawInstructions = [input, half, quarter];
  return {
    "leaves the reusable source unchanged": [JSON.stringify(input), initial],
    "keeps each scale's nested shape widths independent": [
      [...output.asSVG().matchAll(/stroke-width="([^"]+)"/g)].map((m) =>
        Number(m[1])
      ),
      [3, 5, 6, 10, 12, 20]
    ]
  };
}

// Record the Canvas API boundary, including the state restored by save/restore.
// A native Canvas is unavailable in the Node test runner.
function recordingContext() {
  const events = [];
  const stack = [];
  return {
    events,
    globalAlpha: 1,
    clipped: false,
    getLineDash: () => [],
    setLineDash() {},
    beginPath() {},
    arc() {},
    translate() {},
    scale() {},
    save() {
      stack.push({ alpha: this.globalAlpha, clipped: this.clipped });
    },
    restore() {
      const state = stack.pop();
      this.globalAlpha = state.alpha;
      this.clipped = state.clipped;
    },
    clip() {
      this.clipped = true;
    },
    fill(path) {
      events.push([
        "fill",
        path ? "path" : "circle",
        this.globalAlpha,
        this.clipped
      ]);
    },
    stroke(path) {
      events.push([
        "stroke",
        path ? "path" : "circle",
        this.globalAlpha,
        this.clipped
      ]);
    }
  };
}

const opacityCases = {};
const previousPath2D = globalThis.Path2D;
const previousBroken = ms._brokenPath2D;
globalThis.Path2D = class {
  constructor(d) {
    this.d = d;
  }
};
ms._brokenPath2D = false;
try {
  for (const opacity of [0, 0.25]) {
    const frame = symbol("10031500001100000000", { fillOpacity: opacity });
    const ctx = recordingContext();
    canvasDraw.call(frame, ctx, frame.drawInstructions);
    opacityCases[
      `real circular frame retains stroke alpha at fillOpacity ${opacity}`
    ] = [
      ctx.events.filter(
        (event) => event[0] === "stroke" && event[1] === "circle"
      ),
      [["stroke", "circle", 1, false]]
    ];
    for (const clipped of [false, true]) {
      const instructions = [
        { type: "circle", cx: 5, cy: 5, r: 2 },
        { type: "path", d: "M0 0L10 10" }
      ].map((shape) => ({
        ...shape,
        fill: "red",
        stroke: "black",
        fillopacity: opacity,
        ...(clipped ? { clipPath: "M0 0H10V10H0Z" } : {})
      }));
      const recorder = recordingContext();
      canvasDraw.call(frame, recorder, instructions);
      opacityCases[
        `circle and path separate fill/stroke alpha, opacity ${opacity}, clip ${clipped}`
      ] = [
        recorder.events,
        [
          ["fill", "circle", opacity, clipped],
          ["stroke", "circle", 1, false],
          ["fill", "path", opacity, clipped],
          ["stroke", "path", 1, false]
        ]
      ];
    }
    const outerClip = recordingContext();
    canvasDraw.call(frame, outerClip, [
      {
        type: "clip",
        d: "M0 0H10V10H0Z",
        draw: [
          {
            type: "circle",
            cx: 5,
            cy: 5,
            r: 2,
            fill: "red",
            stroke: "black",
            fillopacity: opacity
          }
        ]
      }
    ]);
    opacityCases[
      `outer clip remains active for circle stroke at opacity ${opacity}`
    ] = [
      [outerClip.events, outerClip.globalAlpha, outerClip.clipped],
      [
        [
          ["fill", "circle", opacity, true],
          ["stroke", "circle", 1, true]
        ],
        1,
        false
      ]
    ];
  }
} finally {
  if (typeof previousPath2D === "undefined") delete globalThis.Path2D;
  else globalThis.Path2D = previousPath2D;
  ms._brokenPath2D = previousBroken;
}

const anchorCases = {};
for (const fixture of [
  {
    name: "square unit",
    sidc: "10031000001100000000",
    options: { square: true },
    size: [158, 158],
    anchor: [79, 79],
    octagon: [79, 79]
  },
  {
    name: "square unit with size/padding",
    sidc: "10031000001100000000",
    options: { square: true, size: 50, padding: 10 },
    size: [89, 89],
    anchor: [44.5, 44.5],
    octagon: [44.5, 44.5]
  },
  {
    name: "square HQ",
    sidc: "10031002001100000000",
    options: { square: true },
    size: [408, 408],
    anchor: [204, 204],
    octagon: [279, 54]
  },
  {
    name: "square HQ with size/padding/custom staff",
    sidc: "10031002001100000000",
    options: { square: true, size: 60, padding: 10, hqStaffLength: 50 },
    size: [196.8, 196.8],
    anchor: [98.4, 98.4],
    octagon: [143.4, 38.4]
  },
  {
    name: "ordinary rectangular unit",
    sidc: "10031000001100000000",
    options: {},
    size: [158, 108],
    anchor: [79, 54],
    octagon: [79, 54]
  }
]) {
  const result = symbol(fixture.sidc, fixture.options);
  anchorCases[fixture.name] = [
    [
      result.isValid(),
      Object.values(result.getSize()),
      Object.values(result.getAnchor()),
      Object.values(result.getOctagonAnchor())
    ],
    [true, fixture.size, fixture.anchor, fixture.octagon]
  ];
}

export default {
  "Review rendering regressions": {
    "creating a scaled icon preserves an earlier symbol's SVG": [
      [
        first.isValid(),
        second.isValid(),
        before === firstAfterSecond,
        before === repeatedFirst.asSVG(),
        firstAfterSecond === first.asSVG()
      ],
      [true, true, true, true, true]
    ],
    "nested object scale instructions": scaledInstructions(false),
    "nested array scale instructions": scaledInstructions(true),
    "Canvas opacity": opacityCases,
    "final output anchors": anchorCases
  }
};
