import { Extension, Node, type Editor } from "@tiptap/core";

/**
 * Adds fontSize and fontWeight to the textStyle mark, so they apply to
 * whatever text is selected. Must be used together with TextStyle.
 *
 * Usage:  editor.chain().focus().setMark("textStyle", { fontSize: "24px" }).run()
 *         editor.chain().focus().setMark("textStyle", { fontWeight: "300" }).run()
 *         pass null to reset either one.
 */
export const TextStyleExtras = Extension.create({
  name: "textStyleExtras",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el: HTMLElement) => el.style.fontSize || null,
            renderHTML: (attrs: Record<string, any>) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
          fontWeight: {
            default: null,
            parseHTML: (el: HTMLElement) => el.style.fontWeight || null,
            renderHTML: (attrs: Record<string, any>) =>
              attrs.fontWeight ? { style: `font-weight: ${attrs.fontWeight}` } : {},
          },
        },
      },
    ];
  },
});

/**
 * A quote that behaves like a heading: a single block of text.
 * Enter at the end of it starts a normal paragraph (you leave the quote),
 * Shift+Enter adds a line break inside it.
 * Saved as <blockquote>, so your existing .editor-copy blockquote CSS still applies.
 *
 * Toggle with: editor.chain().focus().toggleNode("quote", "paragraph").run()
 * Active check: editor.isActive("quote")
 * Remember to disable the built-in one: StarterKit.configure({ blockquote: false })
 */
export const Quote = Node.create({
  name: "quote",
  group: "block",
  content: "inline*",
  defining: true,

  parseHTML() {
    return [{ tag: "blockquote" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["blockquote", HTMLAttributes, 0];
  },
});

/**
 * Sets font size / weight on the selected text ONLY.
 * - text selected  -> only that selection changes
 * - nothing selected -> only the text you type next changes; existing words are never touched
 * Pass null to reset a value.
 */
export function applyTextStyle(
  editor: Editor,
  attrs: { fontSize?: string | null; fontWeight?: string | null }
) {
  // focus first (synchronously) so the browser doesn't clear the style we are about to set
  editor.view.focus();

  const { state, view } = editor;
  const type = state.schema.marks.textStyle;
  const { selection } = state;
  const tr = state.tr;

  if (selection.empty) {
    const current = (state.storedMarks || selection.$from.marks()).find((m) => m.type === type);
    tr.addStoredMark(type.create({ ...(current?.attrs ?? {}), ...attrs }));
  } else {
    selection.ranges.forEach(({ $from, $to }) => {
      state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
        if (!node.isText) return;
        const from = Math.max(pos, $from.pos);
        const to = Math.min(pos + node.nodeSize, $to.pos);
        const existing = node.marks.find((m) => m.type === type);
        tr.addMark(from, to, type.create({ ...(existing?.attrs ?? {}), ...attrs }));
      });
    });
  }

  view.dispatch(tr);
}