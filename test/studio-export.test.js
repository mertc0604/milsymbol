import {
  exportFilename,
  layoutFlagBox,
  layoutFieldBoxes,
  pngOutputSize,
  pngScale
} from "../studio/editor-helpers.js";

const symbol = { left: 100, top: 40, width: 120, height: 80 };
const size = { width: 58, height: 44 };
const box = (left, top) => ({ left, top, width: 90, height: 30 });
const meets = (a, b) =>
  a.left < b.left + b.width &&
  b.left < a.left + a.width &&
  a.top < b.top + b.height &&
  b.top < a.top + a.height;
const rows = [
  { keys: ["a"], x: 240, y: 40, anchor: "start" },
  { keys: ["b"], x: 240, y: 80, anchor: "start" },
  { keys: ["c"], x: 240, y: 120, anchor: "start" }
];
const placed = layoutFieldBoxes(
  rows,
  { a: 90, b: 90, c: 90 },
  { height: 30, gap: 8, center: 80 }
);

export default {
  "Studio export names": {
    "a numeric code": [
      exportFilename(
        {
          standardId: "app6e",
          sidc: "160310000012110000000000000000",
          name: "Infantry"
        },
        "png"
      ),
      "app6e_160310000012110000000000000000_infantry.png"
    ],
    "the wildcards of a letter code are not used in a file name": [
      exportFilename(
        { standardId: "app6a", sidc: "SFGPUCI---*****", name: "INFANTRY" },
        "svg"
      ),
      "app6a_SFGPUCI--------_infantry.svg"
    ],
    "punctuation in a symbol name becomes one dash": [
      exportFilename(
        {
          standardId: "2525d",
          sidc: "10031500",
          name: "Rifle / Automatic (M)"
        },
        "svg"
      ),
      "2525d_10031500_rifle-automatic-m.svg"
    ],
    "a symbol with no name keeps a readable file name": [
      exportFilename({ standardId: "2525e", sidc: "13", name: "" }, "png"),
      "2525e_13_military-symbol.png"
    ]
  },
  "Studio flag in Field positions": {
    "it goes under the right-hand boxes": [
      layoutFlagBox([box(10, 40), box(240, 40), box(240, 90)], symbol, size),
      { left: 240, top: 128, width: 58, height: 44 }
    ],
    "it covers no box": [
      placed.some((item) => meets(item, layoutFlagBox(placed, symbol, size))),
      false
    ],
    "with no box on the right it stays beside the symbol": [
      layoutFlagBox([box(10, 40)], symbol, size),
      { left: 228, top: 76, width: 58, height: 44 }
    ]
  },
  "Studio PNG size": {
    "the scale of the export": [pngScale, 3],
    "a fractional symbol size rounds up, as the canvas does": [
      pngOutputSize({ width: 100.4, height: 80 }),
      { width: 302, height: 240 }
    ],
    "another scale": [
      pngOutputSize({ width: 100, height: 50 }, 2),
      { width: 200, height: 100 }
    ]
  }
};
