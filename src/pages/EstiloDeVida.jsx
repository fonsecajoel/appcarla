import { useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';

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

const columns = {
  DIGESTORIO: { label: 'Digestório', questions: [1, 4, 5, 15] },
  INTESTINAL: { label: 'Intestinal', questions: [3, 19, 24, 26] },
  CIRCULATORIO: { label: 'Circulatório', questions: [11, 28] },
  NERVOSO: { label: 'Nervoso', questions: [9, 16, 20, 21, 25, 31, 35, 36] },
  IMUNOLOGICO: { label: 'Imunológico', questions: [2, 7, 10, 14, 34] },
  RESPIRATORIO: { label: 'Respiratório', questions: [12, 38] },
  URINARIO: { label: 'Urinário', questions: [30, 33] },
  GLANDULAR: { label: 'Glandular', questions: [6, 17, 22, 23, 27, 29] },
  ESTRUTURAL: { label: 'Estrutural', questions: [37] },
};

const questionsText = {
  1: "Sofre de cansaço ou debilidade geral?",
  2: "Seu organismo debilita-se com facilidade?",
  3: "Possui mau odor corporal ou mau hálito?",
  4: "Tem problemas com a digestão de certos alimentos?",
  5: "Ingere carnes vermelhas com frequência?",
  6: "Tem problemas pré-menstruais?",
  7: "Utiliza-se de antibióticos com frequência?",
  8: "Consome bebidas alcoólicas?",
  9: "Tem mudanças de humor constantes?",
  10: "Sofre de alergias?",
  11: "Possui olheiras?",
  12: "Fuma?",
  13: "Tem memória fraca e dificuldade de concentração?",
  14: "Considera seu organismo pouco resistente?",
  15: "Costuma arrotar após as refeições?",
  16: "Sofre de estresse?",
  17: "Tem problemas de pele?",
  18: "Ingere doces e/ou alimentos processados com frequência?",
  19: "Costuma consumir derivados de leite?",
  20: "Deprime-se ou irrita-se facilmente?",
  21: "Dorme mal?",
  22: "Suas unhas são fracas?",
  23: "Seus cabelos estão ressecados e caindo muito?",
  24: "Ingere muitos alimentos gordurosos e frituras?",
  25: "É nervoso, ansioso, tenso?",
  26: "Ingere poucas frutas, legumes e verduras?",
  27: "Sofre de cãibras?",
  28: "Está exposto à poluição ambiental?",
  29: "Dorme ao sentar-se?",
  30: "Toma muito café e bebidas gasosas?",
  31: "Descontrola-se com facilidade?",
  32: "Tem sensibilidade a certos alimentos e produtos químicos?",
  33: "Tem algum tipo de micose?",
  34: "Sente-se debilitado?",
  35: "Preocupa-se em excesso?",
  36: "Irrita-se com facilidade?",
  37: "Faz pouco exercício?",
  38: "Tem excesso de mucosidade no nariz ou garganta?"
};

const getResultLabel = (colIndex, score) => {
  const s = score;
  const col = colIndex + 1;
  if (col === 1) {
    if (s <= 1) return 'Excelente'; if (s <= 3) return 'Bom'; if (s <= 5) return 'Regular'; return 'Baixa';
  } else if (col === 2) {
    if (s <= 1) return 'Excelente'; if (s <= 3) return 'Bom'; if (s <= 5) return 'Regular'; return 'Baixa';
  } else if (col === 3) {
    if (s === 0) return 'Excelente'; if (s === 1) return 'Bom'; if (s <= 3) return 'Regular'; return 'Baixa';
  } else if (col === 4) {
    if (s <= 1) return 'Excelente'; if (s <= 3) return 'Bom'; if (s <= 5) return 'Regular'; return 'Baixa';
  } else if (col === 5) {
    if (s <= 1) return 'Excelente'; if (s <= 3) return 'Bom'; if (s <= 5) return 'Regular'; return 'Baixa';
  } else if (col === 6) {
    if (s === 0) return 'Excelente'; if (s === 1) return 'Bom'; if (s <= 3) return 'Regular'; return 'Baixa';
  } else if (col === 7) {
    if (s === 0) return 'Excelente'; if (s === 1) return 'Bom'; if (s <= 3) return 'Regular'; return 'Baixa';
  } else if (col === 8) {
    if (s <= 1) return 'Excelente'; if (s <= 3) return 'Bom'; if (s <= 6) return 'Regular'; return 'Baixa';
  } else if (col === 9) {
    if (s === 0) return 'Excelente'; if (s === 1) return 'Bom'; if (s <= 3) return 'Regular'; return 'Baixa';
  }
  return '';
};

const getBadgeColor = (label) => {
  switch (label) {
    case 'Excelente': return 'var(--clr-success)';
    case 'Bom': return 'var(--clr-primary)';
    case 'Regular': return 'var(--clr-accent)';
    case 'Baixa': return 'var(--clr-danger)';
    default: return 'var(--clr-text-muted)';
  }
};

export default function EstiloDeVida({ client }) {
  const { clients, updateClient } = useStore();
  const liveClient = clients.find((c) => c.id === client.id) || client;
  const estilo = liveClient.estiloVida || {};

  const handleToggle = (qNum) => {
    updateClient(client.id, 'estiloVida', { [qNum]: !estilo[qNum] });
  };

  const handleFieldChange = (field, value) => {
    updateClient(client.id, 'estiloVida', { [field]: value });
  };

  const systemScores = Object.entries(columns).map(([key, col], index) => {
    const score = col.questions.reduce((acc, q) => acc + (estilo[q] ? 1 : 0), 0);
    const result = getResultLabel(index, score);
    return { key, label: col.label, score, result };
  });

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Análise do Estilo de Vida</h2>

      <div className="card mb-6" style={{ background: 'var(--clr-sidebar)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)' }}>Resultados (Sistemas do Corpo)</h3>
        <div className="grid grid-cols-3 gap-4" style={{ textAlign: 'center' }}>
          {systemScores.map(({ key, label, score, result }) => (
            <div key={key} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--clr-text-main)', marginBottom: '0.5rem' }}>{score}</div>
              <div className="badge" style={{ backgroundColor: getBadgeColor(result), color: '#fff' }}>{result}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(questionsText).map(([qNum, text]) => (
          <label key={qNum} className="card card-hover flex items-start gap-3" style={{ cursor: 'pointer', padding: '1rem' }}>
            <input
              type="checkbox"
              checked={!!estilo[qNum]}
              onChange={() => handleToggle(qNum)}
              style={{ marginTop: '0.25rem' }}
            />
            <span style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
              <strong>{qNum}.</strong> {text}
            </span>
          </label>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--clr-primary)', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Data e Observações</h3>
        <div className="grid grid-cols-2 mb-6">
          <div className="form-group">
            <label>Data da Avaliação</label>
            <input
              type="date"
              value={estilo.data_avaliacao || ''}
              onChange={(e) => handleFieldChange('data_avaliacao', e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Observações / Comentários</label>
          <textarea
            rows={4}
            value={estilo.observacoes || ''}
            onChange={(e) => handleFieldChange('observacoes', e.target.value)}
            placeholder="Escreva aqui as suas observações..."
            style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--clr-border)', background: 'var(--clr-input-bg)', color: 'var(--clr-text-main)', resize: 'vertical' }}
          />
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-primary)' }}>
        <SignaturePad
          value={estilo.rubrica || ''}
          onChange={(val) => handleFieldChange('rubrica', val)}
        />
      </div>
    </div>
  );
}
