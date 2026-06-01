import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Clock } from 'lucide-react';

function SignaturePad({ value, onChange }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (value) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = value;
    }
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const start = (e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a1a1a';
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stop = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    drawing.current = false;
    onChange(canvasRef.current.toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Rubrica / Assinatura</p>
      <canvas
        ref={canvasRef}
        width={500}
        height={120}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
        style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', cursor: 'crosshair', display: 'block', touchAction: 'none', background: '#fff', maxWidth: '100%' }}
      />
      <button type="button" onClick={clear} style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.25rem 0.75rem', cursor: 'pointer', background: 'transparent', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-sm)', color: 'var(--clr-text-muted)' }}>
        Limpar assinatura
      </button>
    </div>
  );
}

export default function Relatorio({ client }) {
  const { clients, updateClient } = useStore();
  const liveClient = clients.find((c) => c.id === client.id) || client;
  const [newNote, setNewNote] = useState('');
  const relatorio = liveClient.relatorio || [];

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

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-primary)' }}>
        <SignaturePad
          value={liveClient.relatorio_rubrica || ''}
          onChange={(val) => updateClient(client.id, 'relatorio_rubrica', () => val)}
        />
      </div>
    </div>
  );
}
