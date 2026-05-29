import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { storeAPI } from '../store/useStore';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

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

const fields = [
  { key: 'peso', label: 'Peso (kg)' },
  { key: 'busto', label: 'Busto' },
  { key: 'bracoEsq', label: 'Braço Esq.' },
  { key: 'bracoDir', label: 'Braço Dir.' },
  { key: 'abdomen', label: 'Abdômen' },
  { key: 'cintura', label: 'Cintura' },
  { key: 'quadril', label: 'Quadril' },
  { key: 'culote', label: 'Culote' },
  { key: 'coxaEsq', label: 'Coxa Esq.' },
  { key: 'coxaDir', label: 'Coxa Dir.' },
  { key: 'panturrilhaEsq', label: 'Panturrilha Esq.' },
  { key: 'panturrilhaDir', label: 'Panturrilha Dir.' },
];

export default function Medidas({ client }) {
  const { id } = useParams();
  const clientId = client?.id || id;
  const clientData = client || storeAPI.getClient(clientId);
  const initial = clientData?.medidas || {};

  const [medidas, setMedidas] = useState(initial);
  const idRef = useRef(clientId);

  if (idRef.current !== clientId) {
    idRef.current = clientId;
    setMedidas(storeAPI.getClient(clientId)?.medidas || {});
  }

  const handleChange = useCallback((field, subfield, value) => {
    setMedidas(prev => ({
      ...prev,
      [field]: { ...(prev[field] || {}), [subfield]: value },
    }));
  }, []);

  const handleBlur = useCallback((field) => {
    setMedidas(prev => {
      storeAPI.updateClient(clientId, 'medidas', { [field]: prev[field] });
      return prev;
    });
  }, [clientId]);

  const handleAlturaChange = useCallback((value) => {
    setMedidas(prev => ({ ...prev, altura: value }));
  }, []);

  const handleAlturaBlur = useCallback(() => {
    setMedidas(prev => {
      storeAPI.updateClient(clientId, 'medidas', { altura: prev.altura });
      return prev;
    });
  }, [clientId]);

  const handleDateChange = useCallback((period, value) => {
    setMedidas(prev => ({ ...prev, [`data_${period}`]: value }));
  }, []);

  const handleDateBlur = useCallback((period) => {
    setMedidas(prev => {
      storeAPI.updateClient(clientId, 'medidas', { [`data_${period}`]: prev[`data_${period}`] });
      return prev;
    });
  }, [clientId]);

  const renderDiff = (inicio, fim) => {
    if (!inicio || !fim) return <Minus size={16} className="diff-neutral" />;
    const i = parseFloat(inicio);
    const f = parseFloat(fim);
    if (isNaN(i) || isNaN(f)) return <Minus size={16} className="diff-neutral" />;
    const diff = f - i;
    if (diff === 0) return <span className="diff-neutral">0</span>;
    if (diff > 0) return <span className="diff-positive flex items-center"><ArrowUpRight size={16} /> +{diff.toFixed(1)}</span>;
    return <span className="diff-negative flex items-center"><ArrowDownRight size={16} /> {diff.toFixed(1)}</span>;
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: 0 }}>Medidas Corporais</h2>
        <div className="form-group" style={{ marginBottom: 0, width: '200px' }}>
          <label>Altura (m)</label>
          <input
            type="number" step="0.01"
            value={medidas.altura || ''}
            onChange={(e) => handleAlturaChange(e.target.value)}
            onBlur={handleAlturaBlur}
            placeholder="Ex: 1.65"
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Área</th>
              <th>
                Início<br />
                <input
                  type="date"
                  value={medidas.data_i || ''}
                  onChange={(e) => handleDateChange('i', e.target.value)}
                  onBlur={() => handleDateBlur('i')}
                  style={{ fontSize: '0.75rem', padding: '2px 4px', marginTop: '4px' }}
                />
              </th>
              <th>
                Meio<br />
                <input
                  type="date"
                  value={medidas.data_m || ''}
                  onChange={(e) => handleDateChange('m', e.target.value)}
                  onBlur={() => handleDateBlur('m')}
                  style={{ fontSize: '0.75rem', padding: '2px 4px', marginTop: '4px' }}
                />
              </th>
              <th>
                Fim<br />
                <input
                  type="date"
                  value={medidas.data_f || ''}
                  onChange={(e) => handleDateChange('f', e.target.value)}
                  onBlur={() => handleDateBlur('f')}
                  style={{ fontSize: '0.75rem', padding: '2px 4px', marginTop: '4px' }}
                />
              </th>
              <th>Evolução (Início → Fim)</th>
            </tr>
          </thead>
          <tbody>
            {fields.map(({ key, label }) => {
              const data = medidas[key] || { i: '', m: '', f: '' };
              return (
                <tr key={key}>
                  <td style={{ fontWeight: 500 }}>{label}</td>
                  <td>
                    <input type="number" step="0.1" value={data.i || ''} onChange={(e) => handleChange(key, 'i', e.target.value)} onBlur={() => handleBlur(key)} style={{ padding: '0.5rem' }} />
                  </td>
                  <td>
                    <input type="number" step="0.1" value={data.m || ''} onChange={(e) => handleChange(key, 'm', e.target.value)} onBlur={() => handleBlur(key)} style={{ padding: '0.5rem' }} />
                  </td>
                  <td>
                    <input type="number" step="0.1" value={data.f || ''} onChange={(e) => handleChange(key, 'f', e.target.value)} onBlur={() => handleBlur(key)} style={{ padding: '0.5rem' }} />
                  </td>
                  <td style={{ fontWeight: 'bold' }}>{renderDiff(data.i, data.f)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--clr-sidebar)', borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }}>
        <label className="checkbox-label" style={{ fontWeight: 600 }}>
          <input
            type="checkbox"
            checked={!!medidas.termo_aceito}
            onChange={(e) => {
              setMedidas(prev => ({ ...prev, termo_aceito: e.target.checked }));
              storeAPI.updateClient(clientId, 'medidas', { termo_aceito: e.target.checked });
            }}
          />
          Declaro que as informações acima são verdadeiras. Li e aceito os termos de responsabilidade.
        </label>
        {!!medidas.termo_aceito && (
          <SignaturePad
            value={medidas.rubrica || ''}
            onChange={(val) => {
              setMedidas(prev => ({ ...prev, rubrica: val }));
              storeAPI.updateClient(clientId, 'medidas', { rubrica: val });
            }}
          />
        )}
      </div>
    </div>
  );
}
