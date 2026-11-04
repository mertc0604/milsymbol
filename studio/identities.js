// Standard identities by edition. Numeric SIDCs (D/E) keep the context in
// position 3 and the identity in position 4. Letter SIDCs (APP-6B, 2525C)
// fold the exercise context into the position 2 letter. APP-6A has no exercise
// letters; its joker and faker are identities of their own.
export const identities = [
  {
    value: "friend",
    label: "Friend",
    numeric: "3",
    legacy: "F",
    exercise: "D"
  },
  {
    value: "hostile",
    label: "Hostile",
    exerciseLabel: "Faker",
    numeric: "6",
    legacy: "H",
    exercise: "K"
  },
  {
    value: "neutral",
    label: "Neutral",
    numeric: "4",
    legacy: "N",
    exercise: "L"
  },
  {
    value: "unknown",
    label: "Unknown",
    numeric: "1",
    legacy: "U",
    exercise: "W"
  },
  {
    value: "pending",
    label: "Pending",
    numeric: "0",
    legacy: "P",
    exercise: "G"
  },
  {
    value: "assumed",
    label: "Assumed friend",
    numeric: "2",
    legacy: "A",
    exercise: "M"
  },
  {
    value: "suspect",
    label: "Suspect",
    exerciseLabel: "Joker",
    numeric: "5",
    legacy: "S",
    exercise: "J"
  }
];

export const app6aIdentities = [
  { value: "friend", label: "Friend", legacy: "F" },
  { value: "hostile", label: "Hostile", legacy: "H" },
  { value: "neutral", label: "Neutral", legacy: "N" },
  { value: "unknown", label: "Unknown", legacy: "U" },
  { value: "pending", label: "Pending (?)", legacy: "P" },
  { value: "assumed", label: "Assumed friend (?)", legacy: "A" },
  { value: "suspect", label: "Suspect (?)", legacy: "S" },
  { value: "joker", label: "Joker (J)", legacy: "J" },
  { value: "faker", label: "Faker (K)", legacy: "K" }
];

const contexts = [
  ["0", "Reality"],
  ["1", "Exercise"],
  ["2", "Simulation"]
];

// `standard` is a Studio standard entry: { id, family }.
export function identityList(standard) {
  return standard.id === "app6a" ? app6aIdentities : identities;
}

// Edition E, Table A-2: a restricted target or no-strike entity in each context.
const markedContexts = [
  ["3", "Restricted target"],
  ["4", "No-strike entity"],
  ["5", "Restricted target, exercise"],
  ["6", "No-strike entity, exercise"],
  ["7", "Restricted target, simulation"],
  ["8", "No-strike entity, simulation"]
];

export function contextOptions(standard) {
  if (standard.id === "app6a") return [];
  if (["2525e", "app6e"].includes(standard.id))
    return [...contexts, ...markedContexts];
  return standard.family === "modern" ? contexts : contexts.slice(0, 2);
}

export function identityLabel(entry, context = "0") {
  return (context === "1" && entry.exerciseLabel) || entry.label;
}

export function identityCode(entry, standard, context = "0") {
  if (standard.family === "modern") return entry.numeric;
  return standard.id !== "app6a" && context === "1"
    ? entry.exercise
    : entry.legacy;
}

// Returns { value, context } for a position 2 letter or position 4 digit, or
// null when this edition has no such identity.
export function decodeIdentity(code, standard, context = "0") {
  const list = identityList(standard);
  if (standard.family === "modern") {
    const entry = list.find((item) => item.numeric === code);
    return entry ? { value: entry.value, context } : null;
  }
  const reality = list.find((item) => item.legacy === code);
  if (reality) return { value: reality.value, context: "0" };
  const exercise =
    standard.id !== "app6a" && list.find((item) => item.exercise === code);
  return exercise ? { value: exercise.value, context: "1" } : null;
}

// Carry an identity across a standard switch. APP-6A joker/faker and the
// exercise suspect/hostile are the same identity written differently.
export function convertIdentity({ value, context }, standard) {
  if (standard.id === "app6a") {
    if (context === "1" && value === "suspect")
      return { value: "joker", context: "0" };
    if (context === "1" && value === "hostile")
      return { value: "faker", context: "0" };
  } else if (value === "joker" || value === "faker") {
    return { value: value === "joker" ? "suspect" : "hostile", context: "1" };
  }
  const known = identityList(standard).some((item) => item.value === value);
  const allowed = contextOptions(standard).some(([code]) => code === context);
  return { value: known ? value : "friend", context: allowed ? context : "0" };
}
