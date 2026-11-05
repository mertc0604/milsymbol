import { popoverPosition } from "../studio/info-popover.js";

const screen = { width: 1000, height: 800 };
const box = { width: 340, height: 160 };
const anchor = (left, top) => ({ left, top, bottom: top + 30 });

export default {
  "where an information box opens": {
    "under its button": [
      popoverPosition({ anchor: anchor(100, 100), box, ...screen }),
      { left: 100, top: 138 }
    ],
    "inside the right edge": [
      popoverPosition({ anchor: anchor(900, 100), box, ...screen }).left,
      648
    ],
    "over its button when the space below runs out": [
      popoverPosition({ anchor: anchor(100, 700), box, ...screen }).top,
      532
    ],
    "at the screen margin when neither side has room": [
      popoverPosition({ anchor: anchor(100, 100), box: { width: 340, height: 790 }, ...screen }).top,
      12
    ],
    "at the left margin on a screen narrower than the box": [
      popoverPosition({ anchor: anchor(100, 100), box, width: 320, height: 800 }).left,
      12
    ]
  }
};
