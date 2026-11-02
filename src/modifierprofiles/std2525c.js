// MIL-STD-2525C (17 November 2008) modifier profile for scheme S warfighting
// symbols. Active only when the edition is selected explicitly with
// ms.setStandard("2525C") or style.standard "2525C". See common.js.

export const std2525cProfile = {
  id: "2525c",
  symbolClass() {
    return "";
  },
  // null: no edition-specific field list yet; every option stays available.
  fields() {
    return null;
  },
  unavailableReason() {
    return "";
  },
  validate() {
    return { valid: true, details: { modifierErrors: [], notes: [] } };
  },
  textLayout() {
    return null;
  }
};
