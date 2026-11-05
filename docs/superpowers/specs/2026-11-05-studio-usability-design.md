# Studio usability

The user approved review items 2, 3, 4 and 6: progressive disclosure of standard details, four primary identities with expandable alternatives, browser-local draft recovery and Undo after Reset, and clearer typography with fewer nested boxes.

Keep all rendering rules and `src/` unchanged. Keep the existing JavaScript architecture. Use native details controls for technical notes and secondary identities; keep a selected secondary identity visible. Store the complete editor draft locally using a versioned, validated record. Failed storage must never prevent editing. Restore after the catalog is ready; defer the saved flag until asynchronous flag choices are ready. Applying a SIDC before that point replaces the pending flag. Undo Reset restores the complete prior draft, including a custom SIDC, inactive text and style. Normal editing after Reset dismisses Undo to avoid overwriting subsequent work.

Alternatives considered: a full editor rewrite is unnecessary; storing only the SIDC loses text and style. A small storage module and an editor adapter provide the required behavior without changing the renderer. Increase ordinary control text to 14px; retain compact metadata and code styling. Verify the UI at desktop and narrow widths.
