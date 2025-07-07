/**
 * Modal dialog to edit or create a note.
 * @param {object} note - existing note (for edit), or null (for create)
 * @param {function} onSave - receives note object
 * @param {function} onCancel
 */
import React, { useState } from 'react';

function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note ? note.title : '');
  const [content, setContent] = useState(note ? note.content : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    if (!title.trim()) {
      setError('Title is required');
      setSaving(false);
      return;
    }
    try {
      await onSave({ id: note?.id, title, content });
    } catch (err) {
      setError('Could not save note');
    }
    setSaving(false);
  }

  return (
    <div className="note-editor__backdrop" onClick={onCancel}>
      <div className="note-editor__modal" onClick={e => e.stopPropagation()}>
        <h2>{note ? 'Edit Note' : 'Create Note'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="note-editor__input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            maxLength={100}
            required
            autoFocus
          />
          <textarea
            className="note-editor__textarea"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Start writing your note..."
            rows={8}
            maxLength={2000}
          />
          {error && <div className="note-editor__error">{error}</div>}
          <div className="note-editor__actions">
            <button type="button" onClick={onCancel} className="note-editor__cancel">Cancel</button>
            <button type="submit" disabled={saving} className="note-editor__save">
              {saving ? 'Saving...' : (note ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteEditor;
