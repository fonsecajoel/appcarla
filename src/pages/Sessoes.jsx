import { useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { storeAPI } from '../store/useStore';

const tratamentosList = [
  { id: 'cavitacao', label: 'Cavitação' },
  { id: 'radiofrequencia', label: 'Radiofrequência vácuo' },
  { id: 'pressoterapia', label: 'Pressoterapia' },
  { id: 'criolipolise', label: 'Criolipólise' },
  { id: 'hifu', label: 'Hifu' },
  { id: 'lipolise', label: 'Lipólise' },
  { id: 'massagem', label: 'Massagem' },
  { id: 'drenagem', label: 'Drenagem linfática' },
  { id: 'manta', label: 'Manta de sudação' },
];

const tratamentos2List = [
  { id: 'eletroforese', label: 'Eletroforese' },
  { id: 'estim_musc', label: 'Estim. Musc.' },
  { id: 'drenagem_linf', label: 'Drenagem Linf.' },
  { id: 'ionizador', label: 'Ionizador' },
  { id: 'vacuo', label: 'Vácuo' },
  { id: 'termo', label: 'Termo' },
  { id: 'endermologia', label: 'Endermologia' },
  { id: 'ultra_som', label: 'Ultra Som' },
];

export default function Sessoes({ client }) {
  const { id } = useParams();
  const clientId = client?.id || id;
  const clientData = client || storeAPI.getClient(clientId);
  const initialSessoes = clientData?.sessoes || [];

  const [sessoes, setSessoes] = useState(initialSessoes);
  const idRef = useRef(clientId);

  if (idRef.current !== clientId) {
    idRef.current = clientId;
    const fresh = storeAPI.getClient(clientId);
    setSessoes(fresh?.sessoes || []);
  }

  const persist = useCallback((updated) => {
    storeAPI.updateClient(clientId, 'sessoes', () => updated);
  }, [clientId]);

  const handleField = useCallback((sessaoId, field, value) => {
    setSessoes(prev => prev.map(s => s.id === sessaoId ? { ...s, [field]: value } : s));
  }, []);

  const handleFieldBlur = useCallback((sessaoId, field) => {
    setSessoes(prev => {
      persist(prev);
      return prev;
    });
  }, [persist]);

  const handleToggle = useCallback((sessaoId, tratId, checked) => {
    setSessoes(prev => {
      const updated = prev.map(s => {
        if (s.id !== sessaoId) return s;
        return { ...s, tratamentos: { ...s.tratamentos, [tratId]: checked } };
      });
      persist(updated);
      return updated;
    });
  }, [persist]);

  const handleToggle2 = useCallback((sessaoId, tratId, checked) => {
    setSessoes(prev => {
      const updated = prev.map(s => {
        if (s.id !== sessaoId) return s;
        return { ...s, tratamentos2: { ...s.tratamentos2, [tratId]: checked } };
      });
      persist(updated);
      return updated;
    });
  }, [persist]);

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Sessões de Tratamento</h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: 'var(--clr-sidebar)' }}>
              <th style={thStyle}>Sessão</th>
              {sessoes.map(s => (
                <th key={s.id} style={thStyle}>{s.id}ª</th>
              ))}
            </tr>
            <tr style={{ background: 'var(--clr-sidebar)' }}>
              <th style={thStyle}>Data</th>
              {sessoes.map(s => (
                <th key={s.id} style={{ ...thStyle, padding: '2px' }}>
                  <input
                    type="date"
                    value={s.data || ''}
                    onChange={(e) => handleField(s.id, 'data', e.target.value)}
                    onBlur={() => handleFieldBlur(s.id, 'data')}
                    style={{ width: '100%', fontSize: '0.7rem', padding: '2px', border: 'none', background: 'transparent', color: 'var(--clr-text-main)' }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tratamentosList.map((trat, i) => (
              <tr key={trat.id} style={{ background: i % 2 === 0 ? 'var(--clr-bg)' : 'var(--clr-sidebar)' }}>
                <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: 'nowrap' }}>{trat.label}</td>
                {sessoes.map(s => (
                  <td key={s.id} style={{ ...tdStyle, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!s.tratamentos?.[trat.id]}
                      onChange={(e) => handleToggle(s.id, trat.id, e.target.checked)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr style={{ background: 'var(--clr-sidebar)' }}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>Supervisão</td>
              {sessoes.map(s => (
                <td key={s.id} style={{ ...tdStyle, padding: '2px' }}>
                  <input
                    type="text"
                    value={s.supervisao || ''}
                    onChange={(e) => handleField(s.id, 'supervisao', e.target.value)}
                    onBlur={() => handleFieldBlur(s.id, 'supervisao')}
                    style={{ width: '100%', fontSize: '0.7rem', padding: '2px', border: 'none', background: 'transparent', color: 'var(--clr-text-main)' }}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr style={{ background: 'var(--clr-sidebar)' }}>
              <th style={thStyle}>Sessão →</th>
              {sessoes.map(s => (
                <th key={s.id} style={thStyle}>{s.id}ª</th>
              ))}
            </tr>
            <tr style={{ background: 'var(--clr-sidebar)' }}>
              <th style={thStyle}>Data →</th>
              {sessoes.map(s => (
                <th key={s.id} style={{ ...thStyle, padding: '2px' }}>
                  <input
                    type="date"
                    value={s.data2 || ''}
                    onChange={(e) => handleField(s.id, 'data2', e.target.value)}
                    onBlur={() => handleFieldBlur(s.id, 'data2')}
                    style={{ width: '100%', fontSize: '0.7rem', padding: '2px', border: 'none', background: 'transparent', color: 'var(--clr-text-main)' }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={sessoes.length + 1} style={{ ...tdStyle, fontWeight: 600 }}>Tratamento ↓</td>
            </tr>
            {tratamentos2List.map((trat, i) => (
              <tr key={trat.id} style={{ background: i % 2 === 0 ? 'var(--clr-bg)' : 'var(--clr-sidebar)' }}>
                <td style={{ ...tdStyle, fontWeight: 500, whiteSpace: 'nowrap' }}>{trat.label}</td>
                {sessoes.map(s => (
                  <td key={s.id} style={{ ...tdStyle, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={!!s.tratamentos2?.[trat.id]}
                      onChange={(e) => handleToggle2(s.id, trat.id, e.target.checked)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr style={{ background: 'var(--clr-sidebar)' }}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>Supervisão →</td>
              {sessoes.map(s => (
                <td key={s.id} style={{ ...tdStyle, padding: '2px' }}>
                  <input
                    type="text"
                    value={s.supervisao2 || ''}
                    onChange={(e) => handleField(s.id, 'supervisao2', e.target.value)}
                    onBlur={() => handleFieldBlur(s.id, 'supervisao2')}
                    style={{ width: '100%', fontSize: '0.7rem', padding: '2px', border: 'none', background: 'transparent', color: 'var(--clr-text-main)' }}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem', border: '1px solid var(--clr-border)', padding: '1rem' }}>
        <h3 style={{ textAlign: 'center', fontWeight: 600, marginBottom: '0.75rem', fontSize: '1rem' }}>Relatório</h3>
        <textarea
          value={clientData?.sessoes_relatorio || ''}
          onChange={(e) => {
            storeAPI.updateClient(clientId, 'sessoes_relatorio', () => e.target.value);
          }}
          style={{
            width: '100%',
            minHeight: '150px',
            border: 'none',
            borderTop: '1px solid var(--clr-border)',
            background: 'transparent',
            color: 'var(--clr-text-main)',
            fontSize: '0.85rem',
            resize: 'vertical',
            padding: '0.5rem 0',
            lineHeight: '1.8',
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1.7em, var(--clr-border) 1.7em, var(--clr-border) 1.75em)',
          }}
          placeholder="Escrever relatório..."
        />
      </div>
    </div>
  );
}

const thStyle = {
  border: '1px solid var(--clr-border)',
  padding: '6px 4px',
  textAlign: 'center',
  fontWeight: 600,
  fontSize: '0.8rem',
};

const tdStyle = {
  border: '1px solid var(--clr-border)',
  padding: '4px 6px',
  fontSize: '0.8rem',
};
