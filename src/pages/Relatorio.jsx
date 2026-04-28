import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Clock } from 'lucide-react';

export default function Relatorio({ client }) {
  const { updateClient } = useStore();
  const [newNote, setNewNote] = useState('');
  const relatorio = client.relatorio || [];

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const noteEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      text: newNote.trim()
    };

    updateClient(client.id, 'relatorio', (prev) => [noteEntry, ...(prev || [])]);
    setNewNote('');
  };

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Relatório / Notas da Sessão</h2>

      <div className="card mb-6" style={{ background: 'var(--clr-sidebar)', border: 'none' }}>
        <div className="form-group" style={{ marginBottom: '1rem' }}>
          <textarea 
            placeholder="Digite aqui as observações, evolução ou notas da sessão..." 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={4}
            style={{ resize: 'vertical' }}
          />
        </div>
        <div className="flex justify-end">
          <button className="btn btn-primary" onClick={handleAddNote}>
            <Plus size={18} />
            Adicionar Nota
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {relatorio.length > 0 ? (
          relatorio.map((note) => (
            <div key={note.id} className="card" style={{ padding: '1rem 1.5rem' }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--clr-text-muted)', fontSize: '0.875rem' }}>
                <Clock size={14} />
                <span>{new Date(note.date).toLocaleString()}</span>
              </div>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{note.text}</p>
            </div>
          ))
        ) : (
          <div className="empty-state card">
            <p>Nenhuma nota registrada para este cliente.</p>
          </div>
        )}
      </div>
    </div>
  );
}
