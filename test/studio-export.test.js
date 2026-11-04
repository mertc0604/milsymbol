import {
  exportFilename,
  pngOutputSize,
  pngScale
} from "../studio/editor-helpers.js";

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
