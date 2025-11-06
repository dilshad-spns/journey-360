import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from './ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading2,
  Quote,
  Undo,
  Redo,
  Code,
  Strikethrough
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content',
      },
    },
  });

  // Sync editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-card border border-border rounded-t-[var(--radius-input)]">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBold().run())}
          className={`h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all ${
            editor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          }`}
          title="Bold (Ctrl+B)"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())}
          className={`h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all ${
            editor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          }`}
          title="Italic (Ctrl+I)"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleStrike().run())}
          className={`h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all ${
            editor.isActive('strike') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          }`}
          title="Strikethrough"
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleCode().run())}
          className={`h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all ${
            editor.isActive('code') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          }`}
          title="Code"
          aria-label="Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          className={`h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all ${
            editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          }`}
          title="Heading"
          aria-label="Heading"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBulletList().run())}
          className={`h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all ${
            editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          }`}
          title="Bullet List"
          aria-label="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleOrderedList().run())}
          className={`h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all ${
            editor.isActive('orderedList') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          }`}
          title="Numbered List"
          aria-label="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBlockquote().run())}
          className={`h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all ${
            editor.isActive('blockquote') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          }`}
          title="Quote"
          aria-label="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().undo().run())}
          disabled={!editor.can().undo()}
          className="h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onMouseDown={(e) => handleButtonClick(e, () => editor.chain().focus().redo().run())}
          disabled={!editor.can().redo()}
          className="h-8 w-8 p-0 rounded-[var(--radius-button)] hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <div className="rich-text-editor-wrapper">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
