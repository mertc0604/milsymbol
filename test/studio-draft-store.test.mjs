import assert from "node:assert/strict";
import { test } from "node:test";
import { createDraftAutosave, createDraftStore, sameDraft } from "../studio/draft-store.js";
import { fieldMeaning } from "../studio/profile-controls.js";

const draft = () => ({
  state: {
    standardId: "app6a",
    selectedId: "S-G-UCI---",
    customSidc: "SFGPUCI---ABTRX",
    affiliation: "friend",
    context: "0",
    status: "present",
    amplifierMode: "echelon",
    amplifierValue: "squad",
    modifier1: "",
    modifier2: "",
    outline: true,
    sidcDirty: false,
    textOrigins: {
      uniqueDesignation: {
        meaning: fieldMeaning({ field: "T", label: "Unique designation" }),
        where: "APP-6A units"
      }
    },
    droppedChoices: { combatEffectiveness: "Operational" },
    adjustments: {}
  },
  controls: {
    uniqueDesignation: "1/23 INF",
    infoSize: "48",
    fill: false,
    countryFlag: "tr",
    sidcInput: "SFGPUCI---ABTRX"
  }
});

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
}

test("a new store restores text, inactive values, styles and custom SIDC after a reload", () => {
  const storage = memoryStorage();
  assert.equal(createDraftStore(storage).save(draft()), true);
  assert.deepEqual(createDraftStore(storage).load(), draft());
});

test("saving again replaces the previous draft, including empty and false values", () => {
  const store = createDraftStore(memoryStorage());
  store.save(draft());
  const reset = draft();
  reset.controls.uniqueDesignation = "";
  reset.controls.fill = false;
  reset.state.outline = false;
  store.save(reset);
  assert.deepEqual(store.load(), reset);
});

test("storage owns a snapshot independent of subsequent form changes", () => {
  const store = createDraftStore(memoryStorage());
  const source = draft();
  store.save(source);
  source.controls.uniqueDesignation = "";
  source.state.textOrigins.uniqueDesignation.meaning.label = "changed";
  assert.deepEqual(store.load(), draft());
});

test("corrupt, outdated and malformed records are ignored", () => {
  for (const raw of [
    "broken json",
    "null",
    "[]",
    JSON.stringify({ version: 99, draft: draft() }),
    JSON.stringify({
      version: 1,
      draft: { state: { standardId: "missing" }, controls: {} }
    }),
    JSON.stringify({
      version: 1,
      draft: { ...draft(), controls: { fill: { unexpected: true } } }
    })
  ]) {
    assert.equal(createDraftStore({ getItem: () => raw }).load(), null);
  }
});

test("unavailable storage never throws or reports a successful save", () => {
  const store = createDraftStore({
    getItem() {
      throw new Error("denied");
    },
    setItem() {
      throw new Error("quota");
    }
  });
  assert.equal(store.load(), null);
  assert.equal(store.save(draft()), false);
  assert.equal(createDraftStore(null).save(draft()), false);
});

test("an invalid draft is not written over the last valid one", () => {
  const store = createDraftStore(memoryStorage());
  store.save(draft());
  assert.equal(
    store.save({ state: { standardId: "unknown" }, controls: {} }),
    false
  );
  assert.deepEqual(store.load(), draft());
});

test("malformed modifier encodings and truncated state cannot reach editor restoration", () => {
  for (const modifier of [
    "broken",
    "set:",
    "common:bad",
    "set:123",
    "other:12"
  ]) {
    const value = draft();
    value.state.standardId = "app6d";
    value.state.customSidc = "";
    value.state.modifier1 = modifier;
    const storage = {
      getItem: () => JSON.stringify({ version: 1, draft: value })
    };
    assert.equal(createDraftStore(storage).load(), null, modifier);
  }
  const value = draft();
  delete value.state.amplifierMode;
  assert.equal(
    createDraftStore({
      getItem: () => JSON.stringify({ version: 1, draft: value })
    }).load(),
    null
  );
});

test("incomplete or wrong-family applied SIDCs are ignored while numeric national tails survive", () => {
  const value = draft();
  for (const sidc of ["broken", "SFGP", "10031000001211000000"]) {
    value.state.customSidc = sidc;
    assert.equal(
      createDraftStore({
        getItem: () => JSON.stringify({ version: 1, draft: value })
      }).load(),
      null
    );
  }
  value.state.standardId = "app6d";
  value.state.customSidc = "100310000012110000007921234276";
  value.state.modifier1 = "set:12";
  const store = createDraftStore(memoryStorage());
  assert.equal(store.save(value), true);
  assert.deepEqual(store.load(), value);
});

function autosave({ works = true } = {}) {
  const saved = [];
  const reports = [];
  const current = { value: draft() };
  const session = createDraftAutosave({
    store: { save: (value) => (works ? saved.push(value) > 0 : false) },
    capture: () => current.value,
    report: (ok) => reports.push(ok),
    delay: 1
  });
  return { saved, reports, current, session };
}

test("a visit that changes nothing writes no draft", () => {
  const { saved, reports, session } = autosave();
  session.start();
  session.flush();
  assert.deepEqual(saved, []);
  assert.deepEqual(reports, []);
});

test("nothing is written before the editor has started", () => {
  const { saved, session } = autosave();
  session.flush();
  assert.deepEqual(saved, []);
});

test("a change is written and reported once", () => {
  const { saved, reports, current, session } = autosave();
  session.start();
  current.value = { ...draft(), controls: { uniqueDesignation: "2/5" } };
  session.flush();
  session.flush();
  assert.equal(saved.length, 1);
  assert.deepEqual(reports, [true]);
});

test("a failed write is reported and tried again", () => {
  const { reports, current, session } = autosave({ works: false });
  session.start();
  current.value = { ...draft(), controls: { uniqueDesignation: "2/5" } };
  session.flush();
  session.flush();
  assert.deepEqual(reports, [false, false]);
});

test("a scheduled save waits for the pause and writes once", async () => {
  const { saved, current, session } = autosave();
  session.start();
  current.value = { ...draft(), controls: { uniqueDesignation: "2/5" } };
  session.schedule();
  session.schedule();
  assert.equal(saved.length, 0);
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(saved.length, 1);
});

test("a saved draft that matches a new editor is not news", () => {
  assert.equal(sameDraft(draft(), draft()), true);
  assert.equal(sameDraft(draft(), { ...draft(), controls: {} }), false);
});
