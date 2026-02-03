import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import FontFamily from "@tiptap/extension-font-family";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect } from "react";

const TextEditor = ({ label, value, onChange, error }) => {
  const editor = useEditor({
    extensions: [
  StarterKit,
  Underline,

  TextStyle,      
  FontFamily,    

  Heading.configure({ levels: [1, 2, 3, 4] }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!editor) return null;

  const IconBtn = ({ onClick, active, icon }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-9 h-9 flex items-center justify-center rounded border text-sm
        ${active ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}
      `}
    >
      {icon}
    </button>
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      {/* ✅ PROFESSIONAL TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2 border rounded-t-lg p-3 bg-gray-50">

        {/* ✅ FONT FAMILY DROPDOWN */}
        <select
          className="border rounded px-2 py-1 text-sm"
          onChange={(e) =>
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
        >
          <option value="">Font</option>
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times</option>
          <option value="Courier New">Courier</option>
          <option value="Georgia">Georgia</option>
        </select>

        {/* ✅ HEADING DROPDOWN */}
        <select
          className="border rounded px-2 py-1 text-sm"
          onChange={(e) => {
            const level = Number(e.target.value);
            if (!level) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
        >
          <option value="0">Normal</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
        </select>

        {/* ✅ ICON TOOLBAR */}
        <IconBtn icon="𝐁" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <IconBtn icon="𝑰" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <IconBtn icon="U̲" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <IconBtn icon="S̶" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />

        <IconBtn icon="•" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <IconBtn icon="1." active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />

        <IconBtn icon="⬅" onClick={() => editor.chain().focus().setTextAlign("left").run()} />
        <IconBtn icon="⬍" onClick={() => editor.chain().focus().setTextAlign("center").run()} />
        <IconBtn icon="➡" onClick={() => editor.chain().focus().setTextAlign("right").run()} />

      </div>

      {/* ✅ EDITOR BODY */}
      <div className="border rounded-b-lg p-4 min-h-[200px] max-h-[450px] overflow-y-auto prose focus:outline-none">
        <EditorContent editor={editor} />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default TextEditor;
