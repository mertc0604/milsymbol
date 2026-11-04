import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";

import * as milsymbol from "milsymbol";

const ms = milsymbol.default;
const sidc = "SFGPUCI----K---";

test("declared named exports construct symbols with the full default registry", () => {
  assert.equal(typeof milsymbol.Symbol, "function");
  const symbol = new milsymbol.Symbol(sidc);
  assert.equal(symbol.isValid(), true);
  assert.equal(symbol.asSVG(), new ms.Symbol(sidc).asSVG());
});

test("named configuration functions share the default registry", () => {
  for (const name of [
    "ColorMode",
    "getColorMode",
    "setColorMode",
    "getHqStaffLength",
    "setHqStaffLength",
    "getDashArrays",
    "setDashArrays",
    "getVersion",
    "setStandard",
    "addSymbolPart",
    "addIconParts",
    "outline"
  ]) {
    assert.equal(typeof milsymbol[name], "function", name);
  }

  const staffLength = ms.getHqStaffLength();
  const dashArrays = { ...ms.getDashArrays() };
  const light = ms.getColorMode("Light");
  const standard = ms._STD2525 ? "2525" : "APP6";
  const parts = ms.getSymbolParts();
  const iconParts = ms._iconParts;
  try {
    assert.equal(milsymbol.setHqStaffLength(123), 123);
    assert.equal(milsymbol.getHqStaffLength(), 123);
    assert.equal(ms.getHqStaffLength(), 123);
    assert.deepEqual(milsymbol.setDashArrays("1,2", "3,4", "5,6"), {
      pending: "1,2",
      anticipated: "3,4",
      feintDummy: "5,6"
    });
    assert.equal(milsymbol.getDashArrays(), ms.getDashArrays());
    const colors = milsymbol.ColorMode("a", "b", "c", "d", "e", "f");
    assert.deepEqual(milsymbol.setColorMode("Light", colors), colors);
    assert.deepEqual(milsymbol.getColorMode("Light"), colors);
    assert.deepEqual(ms.getColorMode("Light"), colors);
    assert.equal(milsymbol.setStandard("APP6A"), true);
    assert.equal(new milsymbol.Symbol(sidc).getMetadata().app6a, true);
    const part = () => ({ pre: [], post: [], bbox: new ms.BBox() });
    assert.equal(milsymbol.addSymbolPart(part), ms);
    assert.ok(ms.getSymbolParts().includes(part));
    const icons = () => {};
    assert.equal(milsymbol.addIconParts(icons), ms);
    assert.ok(ms._iconParts.includes(icons));
    assert.equal(
      milsymbol.getVersion(),
      JSON.parse(
        readFileSync(new URL("../package.json", import.meta.url), "utf8")
      ).version
    );
    const outlined = milsymbol.outline(
      { type: "path", d: "M0,0L1,1", stroke: "black" },
      2,
      1,
      "red"
    );
    assert.equal(outlined.strokewidth, 5);
    assert.equal(outlined.stroke, "red");
  } finally {
    ms.setHqStaffLength(staffLength);
    ms.setDashArrays(
      dashArrays.pending,
      dashArrays.anticipated,
      dashArrays.feintDummy
    );
    ms.setColorMode("Light", light);
    ms.setStandard(standard);
    ms.setSymbolParts(parts);
    ms._iconParts = iconParts;
  }
});

test("CommonJS keeps the direct registry API", () => {
  const commonjs = createRequire(import.meta.url)("milsymbol");
  assert.equal(typeof commonjs.Symbol, "function");
  assert.equal(commonjs.default, undefined);
  assert.equal(new commonjs.Symbol(sidc).isValid(), true);
});

test("the browser UMD bundle keeps the direct ms global", () => {
  const browser = { console: { info() {} } };
  vm.runInNewContext(
    readFileSync(
      new URL("../dist/milsymbol.development.js", import.meta.url),
      "utf8"
    ),
    browser
  );
  assert.equal(typeof browser.ms.Symbol, "function");
  assert.equal(browser.ms.default, undefined);
  assert.equal(new browser.ms.Symbol(sidc).isValid(), true);
});
