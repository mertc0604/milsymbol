// Drafts contain editor values only. Rendering rules remain in milsymbol.
import { completeEditorSidc } from "./sidc-editor.js";

export const draftStateKeys = [
  "standardId",
  "selectedId",
  "customSidc",
  "affiliation",
  "context",
  "status",
  "amplifierMode",
  "amplifierValue",
  "modifier1",
  "modifier2",
  "outline",
  "sidcDirty",
  "textOrigins",
  "droppedChoices",
  "adjustments"
];

const standards = [
  "app6a",
  "app6b",
  "app6d",
  "app6e",
  "2525c",
  "2525d",
  "2525e"
];
const record = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const text = (value) => typeof value === "string" && value.length <= 10000;
const stringMap = (value) => record(value) && Object.values(value).every(text);

function validDraft(draft) {
  if (!record(draft) || !record(draft.state) || !record(draft.controls))
    return false;
  const state = draft.state;
  if (!draftStateKeys.every((key) => Object.hasOwn(state, key))) return false;
  if (
    !standards.includes(state.standardId) ||
    !text(state.selectedId) ||
    !text(state.customSidc)
  )
    return false;
  if (!["echelon", "mobility", "none"].includes(state.amplifierMode))
    return false;
  if (
    ![state.modifier1, state.modifier2].every((value) =>
      /^(?:|set:\d{2}|common:\d{2,3})$/.test(value)
    )
  )
    return false;
  if (state.customSidc) {
    const family = ["app6a", "app6b", "2525c"].includes(state.standardId)
      ? "legacy"
      : "modern";
    const completed = completeEditorSidc(state.customSidc, family);
    if (completed.error || completed.value !== state.customSidc) return false;
  }
  if (
    !Object.entries(state).every(([key, value]) => {
      if (!draftStateKeys.includes(key)) return false;
      if (["outline", "sidcDirty"].includes(key))
        return typeof value === "boolean";
      if (["droppedChoices", "adjustments"].includes(key))
        return stringMap(value);
      if (key === "textOrigins")
        return (
          record(value) &&
          Object.values(value).every(
            (origin) =>
              record(origin) &&
              record(origin.meaning) &&
              text(origin.meaning.field) &&
              text(origin.meaning.label) &&
              (origin.meaning.choices === null ||
                (Array.isArray(origin.meaning.choices) &&
                  origin.meaning.choices.every(text))) &&
              text(origin.where)
          )
        );
      return text(value);
    })
  )
    return false;
  return Object.entries(draft.controls).every(
    ([id, value]) =>
      /^[a-zA-Z][\w-]*$/.test(id) && (typeof value === "boolean" || text(value))
  );
}

export function createDraftStore(storage, key = "symbol-studio:draft") {
  return {
    load() {
      try {
        const saved = JSON.parse(storage.getItem(key));
        return saved?.version === 1 && validDraft(saved.draft)
          ? saved.draft
          : null;
      } catch {
        return null;
      }
    },
    save(draft) {
      try {
        if (!validDraft(draft)) return false;
        storage.setItem(key, JSON.stringify({ version: 1, draft }));
        return true;
      } catch {
        return false;
      }
    }
  };
}

export const sameDraft = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Saves the editor after a pause. The state at start() needs no saving, so a visit
// that changes nothing leaves nothing behind.
export function createDraftAutosave({ store, capture, report, delay = 250 }) {
  let last = null;
  let timer;
  const flush = () => {
    if (last === null) return;
    clearTimeout(timer);
    const draft = capture();
    const serialized = JSON.stringify(draft);
    if (serialized === last) return;
    const saved = store.save(draft);
    if (saved) last = serialized;
    report(saved);
  };
  return {
    start() {
      last = JSON.stringify(capture());
    },
    schedule() {
      if (last === null) return;
      clearTimeout(timer);
      timer = setTimeout(flush, delay);
    },
    flush
  };
}
