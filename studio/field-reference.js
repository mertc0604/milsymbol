// Reference tables shown under the focused text amplifier.
export const fieldReference = {
  evaluationRating: {
    title: "Evaluation rating codes",
    rows: [
      ["A", "Completely reliable"],
      ["B", "Usually reliable"],
      ["C", "Fairly reliable"],
      ["D", "Not usually reliable"],
      ["E", "Unreliable"],
      ["F", "Reliability cannot be judged"],
      ["1", "Confirmed by other sources"],
      ["2", "Probably true"],
      ["3", "Possibly true"],
      ["4", "Doubtfully true"],
      ["5", "Improbable"],
      ["6", "Truth cannot be judged"]
    ],
    note: "One letter for source reliability, then one digit for information credibility, for example B2."
  },
  engagementBar: {
    title: "Engagement bar codes (A:BBB-CC)",
    rows: [
      ["R", "A: remote engagement (B for both, none for local)"],
      ["ASN", "Assign / cover"],
      ["ENG", "Engage"],
      ["MIF", "Missile in flight"],
      ["CF", "Cease fire"],
      ["CE", "Cease engage"],
      ["HF", "Hold fire"],
      ["TE", "Terminate engagement"],
      ["BE", "Break engagement"],
      ["MBE", "Management by exception"],
      ["M<T", "MBE less than threshold"],
      ["MLT", "Multiple engagements"],
      ["M", "CC: missile"],
      ["BM", "CC: ballistic missile"],
      ["CM", "CC: cruise missile"],
      ["GN", "CC: gun"],
      ["T", "CC: torpedo"],
      ["A", "CC: attack aircraft"],
      ["UV", "CC: unmanned vehicle"],
      ["02–99", "CC: number of engagements"]
    ],
    note: "Example: R:ENG-M is a remote engagement with a missile."
  },
  dtg: {
    title: "Date-time group format",
    rows: [
      ["DD", "Day of the month"],
      ["HHMM", "Hour and minute"],
      ["Z", "Time zone suffix, Z for UTC"],
      ["MON", "Three-letter month, for example NOV"],
      ["YY", "Year"],
      ["O/O", "On order"]
    ],
    note: "Example: 021435ZNOV26. Now (UTC) fills the current time in this format."
  },
  location: {
    title: "Location formats",
    rows: [
      ["MGRS", "35T PF 1234 5678"],
      ["Degrees and minutes", "4100.5N02858.2E"]
    ],
    note: "Use the display format your plan or system requires."
  }
};
