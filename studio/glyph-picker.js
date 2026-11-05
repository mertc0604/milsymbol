import { typeaheadIndex } from "./editor-helpers.js";

// A select stays the source of truth (imports, profile checks and problem lines
// read it). This list in front of it shows a picture beside each choice.
const chevron = '<svg class="chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>';
// Letters typed within this many milliseconds spell one name.
const typingPause = 700;

// choices() gives { value, name, code, reason } rows, which may add a group heading,
// disabled and a note. glyphs(rows) gives a function from a value to its picture, so
// a list can draw all its rows to one scale.
export function createGlyphPicker({ button, list, select, idPrefix, fallback, choices, glyphs, escapeHtml }) {
  let active = 0;
  let typed = "";
  let typedAt = 0;

  const row = (item, glyph, note = "") =>
    `<span class="glyph" aria-hidden="true">${glyph(item.value)}</span><span class="glyph-name">${escapeHtml(item.name)}${note}</span>${item.code ? `<code>${escapeHtml(item.code)}</code>` : ""}`;

  function renderList() {
    const rows = choices();
    const glyph = glyphs(rows);
    active = Math.min(Math.max(active, 0), rows.length - 1);
    let group = "";
    list.innerHTML = rows
      .map((item, index) => {
        const heading = item.group && item.group !== group ? `<div class="glyph-group" role="presentation">${escapeHtml(item.group)}</div>` : "";
        group = item.group || "";
        const note = item.note || (item.reason ? "not valid here" : "");
        return `${heading}<div role="option" id="${idPrefix}${index}" class="glyph-option${item.disabled ? " blocked" : item.reason ? " invalid" : ""}${index === active ? " active" : ""}" data-index="${index}" data-value="${escapeHtml(item.value)}" aria-selected="${item.value === select.value}"${item.disabled ? ' aria-disabled="true"' : ""}${item.reason ? ` title="${escapeHtml(item.reason)}"` : ""}>${row(item, glyph, note ? `<small>${escapeHtml(note)}</small>` : "")}</div>`;
      })
      .join("");
    list.setAttribute("aria-activedescendant", `${idPrefix}${active}`);
  }

  function move(index) {
    const options = list.querySelectorAll("[role=option]");
    if (!options.length) return;
    active = (index + options.length) % options.length;
    options.forEach((item, position) => item.classList.toggle("active", position === active));
    list.setAttribute("aria-activedescendant", `${idPrefix}${active}`);
    options[active].scrollIntoView({ block: "nearest" });
  }

  function open() {
    if (button.disabled) return;
    active = Math.max(0, [...select.options].findIndex((item) => item.value === select.value));
    renderList();
    list.hidden = false;
    button.setAttribute("aria-expanded", "true");
    // Open upwards when the list would run past the bottom of the window.
    const box = button.getBoundingClientRect();
    const below = window.innerHeight - box.bottom;
    list.classList.toggle("up", below < Math.min(list.scrollHeight, 380) + 12 && box.top > below);
    list.focus({ preventScroll: true });
    move(active);
  }

  function close(refocus = false) {
    if (list.hidden) return;
    list.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (refocus) button.focus();
  }

  function choose(item) {
    if (item.getAttribute("aria-disabled") === "true") return;
    close(true);
    if (item.dataset.value === select.value) return;
    select.value = item.dataset.value;
    select.dispatchEvent(new Event("change"));
  }

  function render() {
    const rows = choices();
    const choice = rows.find((item) => item.value === select.value) || fallback || rows[0];
    button.disabled = select.disabled;
    button.classList.toggle("invalid", Boolean(choice.reason));
    button.title = choice.reason || "";
    button.innerHTML = `${row(choice, glyphs(rows))}${chevron}`;
    if (button.disabled) close();
    else if (!list.hidden) renderList();
  }

  // One letter again and again walks through the names that start with it.
  function typeahead(key) {
    const now = Date.now();
    typed = now - typedAt < typingPause ? typed + key : key;
    typedAt = now;
    const query = new Set(typed).size === 1 ? key : typed;
    const index = typeaheadIndex(choices().map((item) => item.name), query, active);
    if (index >= 0) move(index);
  }

  function bind() {
    button.addEventListener("click", () => (list.hidden ? open() : close(true)));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      open();
    });
    list.addEventListener("click", (event) => {
      const item = event.target.closest("[role=option]");
      if (item) choose(item);
    });
    list.addEventListener("pointermove", (event) => {
      const item = event.target.closest("[role=option]");
      if (item && Number(item.dataset.index) !== active) move(Number(item.dataset.index));
    });
    list.addEventListener("keydown", (event) => {
      const options = [...list.querySelectorAll("[role=option]")];
      const moves = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: options.length - 1, PageDown: active + 5, PageUp: active - 5 };
      // A space inside a name ("New Zealand") belongs to the name.
      const spelling = event.key === " " && Date.now() - typedAt < typingPause;
      if (event.key in moves) {
        event.preventDefault();
        const target = moves[event.key];
        move(event.key.startsWith("Page") ? Math.min(Math.max(target, 0), options.length - 1) : target);
      } else if (event.key === "Enter" || (event.key === " " && !spelling)) {
        event.preventDefault();
        if (options[active]) choose(options[active]);
      } else if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close(true);
      } else if (event.key === "Tab") {
        close();
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        typeahead(event.key);
      }
    });
    list.addEventListener("focusout", (event) => {
      if (!event.currentTarget.parentElement.contains(event.relatedTarget)) close();
    });
    document.addEventListener("pointerdown", (event) => {
      if (!list.hidden && !list.parentElement.contains(event.target)) close();
    });
  }

  return { render, bind };
}
