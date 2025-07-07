/**
 * Dashboard after login: displays list of notes, CRUD actions, and logout button.
 * @param {string} token - user JWT token
 * @param {object} user - {id, username}
 * @param {function} onLogout - called when user logs out
 */
import React, { useState, useEffect } from 'react';
import NoteEditor from './NoteEditor';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

/**
 * Fetch notes for current user
 */
async function fetchNotes(token) {
  const res = await fetch(`${API_BASE}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
}

// PUBLIC_INTERFACE
function NotesDashboard({ token, user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editorNote, setEditorNote] = useState(null);
  const [apiError, setApiError] = useState('');

  // Initial load
  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  async function loadNotes() {
    setLoading(true);
    setApiError('');
    try {
      const n = await fetchNotes(token);
      setNotes(n);
    } catch (e) {
      setApiError(e.message);
    }
    setLoading(false);
  }

  // PUBLIC_INTERFACE
  function handleCreate() {
    setEditorNote(null);
    setShowEditor(true);
  }

  // PUBLIC_INTERFACE
  function handleEdit(note) {
    setEditorNote(note);
    setShowEditor(true);
  }

  // PUBLIC_INTERFACE
  async function handleDelete(noteId) {
    if (!window.confirm('Delete this note?')) return;
    setApiError('');
    try {
      const res = await fetch(`${API_BASE}/notes/${noteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete');
      setNotes(notes => notes.filter(n => n.id !== noteId));
    } catch (err) {
      setApiError(err.message);
    }
  }

  // PUBLIC_INTERFACE
  async function handleSave(note) {
    setApiError('');
    try {
      let saved;
      if (note.id) {
        // update note (PUT)
        const res = await fetch(`${API_BASE}/notes/${note.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(note)
        });
        if (!res.ok) throw new Error('Failed to update');
        saved = await res.json();
        setNotes(ns =>
          ns.map(n => (n.id === note.id ? saved : n))
        );
      } else {
        // create new note (POST)
        const res = await fetch(`${API_BASE}/notes`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(note)
        });
        if (!res.ok) throw new Error('Failed to create');
        saved = await res.json();
        setNotes(ns => [saved, ...ns]);
      }
      setShowEditor(false);
      setEditorNote(null);
    } catch (err) {
      setApiError(err.message);
    }
  }

  // PUBLIC_INTERFACE
  function handleCancel() {
    setShowEditor(false);
    setEditorNote(null);
  }

  return (
    <div className="dashboard">
      <nav className="dashboard__sidebar">
        <div className="dashboard__user">
          <span className="user-avatar">{user.username.charAt(0).toUpperCase()}</span>
          <span>{user.username}</span>
        </div>
        <button className="dashboard__logout" onClick={onLogout}>Logout</button>
      </nav>
      <main className="dashboard__main">
        <div className="dashboard__topbar">
          <h1>My Notes</h1>
          <button className="dashboard__add" onClick={handleCreate}>+ Create Note</button>
        </div>
        {apiError && <div className="dashboard__error">{apiError}</div>}
        {loading ? (
          <div>Loading notes...</div>
        ) : (
          <div className="notes-list">
            {notes.length === 0 && <div className="notes-empty">You have no notes yet.</div>}
            {notes.map(n => (
              <div className="note-card" key={n.id}>
                <div className="note-card__body" onClick={() => handleEdit(n)}>
                  <div className="note-card__title">{n.title}</div>
                  <div className="note-card__snippet">
                    {n.content.length > 100
                      ? n.content.slice(0, 100) + '...'
                      : n.content}
                  </div>
                </div>
                <button className="note-card__delete" onClick={() => handleDelete(n.id)} title="Delete note">🗑</button>
              </div>
            ))}
          </div>
        )}
      </main>
      {showEditor && (
        <NoteEditor
          note={editorNote}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}

export default NotesDashboard;
