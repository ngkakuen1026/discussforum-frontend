import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, FontSize } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Youtube from "@tiptap/extension-youtube";
import Heading from "@tiptap/extension-heading";
import {
  Palette,
  Bold,
  Italic,
  Link2,
  Image as ImageIcon,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Strikethrough,
  Highlighter,
  ALargeSmall,
} from "lucide-react";
import { useState } from "react";
import TiptapAddImagePopup from "./TiptapAddImagePopup";
import TiptapAddUrlPopup from "./TiptapAddUrlPopup";
import TiptapColorDropdown from "./TipTapColorDropdown";
import TiptapFontSizeDropdown from "./TiptapFontSizeDropdown";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onAddPendingImage?: (base64: string) => void;
}

const TiptapEditor = ({
  content,
  onChange,
  placeholder = "Body text (optional)",
  onAddPendingImage,
}: TiptapEditorProps) => {
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showAddImagePopup, setShowAddImagePopup] = useState(false);
  const [showAddUrlPopup, setShowAddUrlPopup] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-cyan-400 underline cursor-pointer" },
      }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Heading.configure({
        levels: [1, 2, 3, 4, 5],
      }),
      FontSize,
      Color.configure({
        types: ["textStyle"],
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        modestBranding: true,
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: "rounded-xl shadow-lg w-full aspect-video",
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-96 p-6 bg-gray-900 rounded-b-2xl",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const currentColor = editor.getAttributes("textStyle").color || "#ffffff";

  const buttons = [
    {
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      description: "Bold (Ctrl+B)",
    },
    {
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      description: "Italic (Ctrl+I)",
    },
    {
      icon: Strikethrough,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      description: "Strikethrough",
    },
    {
      icon: Code,
      onClick: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      description: "Inline Code",
    },
    {
      icon: ALargeSmall,
      onClick: () => setShowFontSizeDropdown((prev) => !prev),
      isActive: editor.getAttributes("textStyle").fontSize,
      description: "Font Size",
      isFontSize: true,
    },
    {
      icon: Palette,
      onClick: () => setShowColorDropdown((prev) => !prev),
      isActive: editor.isActive("textStyle", { color: /.+/ }),
      description: "Text Color",
      isColor: true,
    },
    {
      icon: Highlighter,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive("highlight"),
      description: "Highlight",
    },
    {
      icon: Link2,
      onClick: () => setShowAddUrlPopup(true),
      isActive: editor.isActive("link"),
      description: "Insert/Edit Link",
    },
    {
      icon: ImageIcon,
      onClick: () => setShowAddImagePopup(true),
      description: "Insert Image",
    },
    {
      icon: Quote,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      description: "Blockquote",
    },
    {
      icon: List,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      description: "Bullet List",
    },
    {
      icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      description: "Numbered List",
    },
    {
      icon: Undo,
      onClick: () => editor.chain().focus().undo().run(),
      isActive: false,
      description: "Undo",
    },
    {
      icon: Redo,
      onClick: () => editor.chain().focus().redo().run(),
      isActive: false,
      description: "Redo",
    },
  ];

  return (
    <div className="border border-gray-800 rounded-2xl bg-gray-900">
      <div
        className="relative flex items-center gap-1 bg-gray-800 border-b border-gray-700 p-3 flex-wrap"
        onClick={(e) => e.preventDefault()}
      >
        {buttons.map((btn, i) => {
          const Icon = btn.icon;
          const isColorButton = btn.isColor === true;
          const isFontSizeButton = btn.isFontSize === true;

          return (
            <div key={i} className="relative">
              <div className="relative group">
                <button
                  type="button"
                  onClick={btn.onClick}
                  className={`p-2 rounded-lg transition-all hover:bg-gray-700 ${
                    btn.isActive
                      ? "bg-cyan-900/70 text-cyan-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                </button>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap border border-gray-700 shadow-xl z-50">
                  {btn.description}
                </span>
              </div>

              {isFontSizeButton && (
                <TiptapFontSizeDropdown
                  editor={editor}
                  show={showFontSizeDropdown}
                  onClose={() => setShowFontSizeDropdown(false)}
                />
              )}

              {isColorButton && (
                <TiptapColorDropdown
                  show={showColorDropdown}
                  currentColor={currentColor}
                  onSelect={(color) => {
                    if (color === "#ffffff") {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(color).run();
                    }
                    setShowColorDropdown(false);
                  }}
                  onClose={() => setShowColorDropdown(false)}
                />
              )}
            </div>
          );
        })}
      </div>

      {showAddImagePopup && (
        <TiptapAddImagePopup
          show={showAddImagePopup}
          onClose={() => setShowAddImagePopup(false)}
          onInsertImage={(url) => {
            editor.chain().focus().setImage({ src: url }).run();
            if (url.startsWith("data:") && onAddPendingImage) {
              onAddPendingImage(url);
            }
          }}
        />
      )}

      <TiptapAddUrlPopup
        show={showAddUrlPopup}
        onClose={() => {
          setShowAddUrlPopup(false);
          setUrlInput("");
        }}
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        onInsertUrl={() => {
          if (urlInput) {
            editor.chain().focus().setLink({ href: urlInput }).run();
            setShowAddUrlPopup(false);
            setUrlInput("");
          }
        }}
      />
      <EditorContent editor={editor} className="text-white" />
    </div>
  );
};

export default TiptapEditor;
