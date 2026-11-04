import {
  matchesSearch,
  distinctEntries,
  correctApp6bEntries
} from "../studio/editor-helpers.js";

const entry = (id, name, path = [name]) => ({
  id,
  code: id.split("#")[0].slice(4),
  category: "GROUND UNIT",
  name,
  path
});
const infantry = entry("S-G-UCI---", "INFANTRY", ["UNIT", "COMBAT", "INFANTRY"]);
const recon = entry("S-G-UCR---", "RECONNAISSANCE", ["UNIT", "RECONNAISSANCE"]);
const airDefense = entry("S-G-UCD---", "AIR DEFENSE", ["UNIT", "AIR DEFENSE"]);
const repeated = entry("S-G-UCEC--#2", "ENGINEER COMBAT BRIDGING");
const numeric = {
  id: "10-121100",
  symbolSet: "10",
  code: "121100",
  category: "Land unit",
  name: "Infantry",
  path: ["Infantry"]
};

const noteOf = (icon) => icon.note || "";
const inLetterEdition = (icon, query) => matchesSearch(icon, query, "legacy");
const inNumericEdition = (icon, query) => matchesSearch(icon, query, "modern");

const engineers = [
  entry("S-G-UCEC--", "ENGINEER COMBAT"),
  entry("S-G-UCEC--", "ENGINEER COMBAT BRIDGING"),
  entry("S-G-UCEC--", "ENGINEER COMBAT DIVING"),
  entry("S-G-UCI---", "INFANTRY")
];
const distinct = distinctEntries(engineers, "APP-6(B)");

const app6bRows = correctApp6bEntries([
  { ...entry("S-G-UCRLL--", "RECONNAISSANCE LIGHT"), code: "UCRLL--" },
  entry("S-G-UCAWA-", "ARMOUR, WHEELED AIRBORNE"),
  entry("S-G-UCAWA-", "ARMOUR, WHEELED AMPHIBIOUS"),
  infantry
]);

export default {
  "palette search": {
    "a word of ten letters or more is a word, not a SIDC": [
      inLetterEdition(recon, "reconnaissance"),
      true
    ],
    "two words that add up to ten letters": [
      inLetterEdition(airDefense, "air defense"),
      true
    ],
    "a long word still leaves out symbols without it": [
      inLetterEdition(infantry, "reconnaissance"),
      false
    ],
    "a full SIDC finds its symbol": [
      inLetterEdition(infantry, "SFGPUCI---*****"),
      true
    ],
    "a full SIDC leaves out the others": [
      inLetterEdition(recon, "SFGPUCI---*****"),
      false
    ],
    "a SIDC in lower case": [inLetterEdition(infantry, "sfgpuci---"), true],
    "the form printed in the publications": [
      inLetterEdition(infantry, "S*G*UCI---*****"),
      true
    ],
    "a later row of a shared code is found by that code": [
      inLetterEdition(repeated, "SFGPUCEC--"),
      true
    ],
    "the mark that tells rows apart is not searchable": [
      inLetterEdition(repeated, "#2"),
      false
    ],
    "an empty search keeps every symbol": [inLetterEdition(infantry, " "), true],
    "a numeric SIDC finds its symbol": [
      inNumericEdition(numeric, "10031000001211000000"),
      true
    ],
    "a numeric SIDC of another symbol set": [
      inNumericEdition(numeric, "10031500001211000000"),
      false
    ]
  },
  "rows that share a code": {
    "each row gets its own id": [
      distinct.map((icon) => icon.id),
      ["S-G-UCEC--", "S-G-UCEC--#2", "S-G-UCEC--#3", "S-G-UCI---"]
    ],
    "the code they write into the SIDC stays the same": [
      distinct.map((icon) => icon.code),
      ["UCEC--", "UCEC--", "UCEC--", "UCI---"]
    ],
    "each keeps its own name": [
      distinct[1].name,
      "ENGINEER COMBAT BRIDGING"
    ],
    "the note names the other rows": [
      ["ENGINEER COMBAT", "ENGINEER COMBAT DIVING"].every((name) =>
        noteOf(distinct[1]).includes(name)
      ),
      true
    ],
    "the note names the edition": [noteOf(distinct[0]).includes("APP-6(B)"), true],
    "a code used once has no note": [distinct[3].note, undefined]
  },
  "APP-6(B) code corrections": {
    "Reconnaissance Light gets a six-character function": [
      [app6bRows[0].id, app6bRows[0].code],
      ["S-G-UCRL--", "UCRL--"]
    ],
    "Wheeled amphibious armour gets its own code": [
      [app6bRows[2].id, app6bRows[2].code],
      ["S-G-UCAWW-", "UCAWW-"]
    ],
    "Wheeled airborne armour keeps its code": [app6bRows[1].id, "S-G-UCAWA-"],
    "a correction says what the publication prints": [
      noteOf(app6bRows[0]).includes("UCRLL--"),
      true
    ],
    "other rows are left alone": [app6bRows[3], infantry]
  }
};
