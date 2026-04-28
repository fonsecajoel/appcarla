import { useStore } from '../store/useStore';

const tratamentosList = [
  { id: 'eletro', label: 'Eletroforese' },
  { id: 'estim', label: 'Estim. Musc.' },
  { id: 'dren', label: 'Drenagem Linf.' },
  { id: 'iono', label: 'Ionizador' },
  { id: 'vacuo', label: 'Vácuo' },
  { id: 'termo', label: 'Termo' },
  { id: 'endermo', label: 'Endermologia' },
  { id: 'ultrasom', label: 'Ultra Som' },
];

export default function Sessoes({ client }) {
  const { updateClient } = useStore();
  const sessoes = client.sessoes || [];

  const handleUpdateSessao = (sessaoId, field, value) => {
    updateClient(client.id, 'sessoes', (prevSessoes) => 
      prevSessoes.map(s => s.id === sessaoId ? { ...s, [field]: value } : s)
    );
  };

  const handleTratamentoToggle = (sessaoId, tratamentoId, checked) => {
    updateClient(client.id, 'sessoes', (prevSessoes) => 
      prevSessoes.map(s => {
        if (s.id === sessaoId) {
          return {
            ...s,
            tratamentos: { ...s.tratamentos, [tratamentoId]: checked }
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="animate-fade-in">
      <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Sessões de Tratamento</h2>

      <div className="grid grid-cols-2 gap-4">
        {sessoes.map((sessao) => (
          <div key={sessao.id} className="card" style={{ padding: '1rem' }}>
            <div className="flex justify-between items-center mb-3 border-b border-[var(--clr-border)] pb-2">
              <h3 style={{ fontSize: '1.125rem', color: 'var(--clr-primary)' }}>Sessão {sessao.id}</h3>
              <input 
                type="date" 
                value={sessao.data || ''} 
                onChange={(e) => handleUpdateSessao(sessao.id, 'data', e.target.value)}
                style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4" style={{ fontSize: '0.875rem' }}>
              {tratamentosList.map(trat => (
                <label key={trat.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={!!sessao.tratamentos?.[trat.id]}
                    onChange={(e) => handleTratamentoToggle(sessao.id, trat.id, e.target.checked)}
                  />
                  {trat.label}
                </label>
              ))}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <input 
                type="text" 
                placeholder="Supervisão / Profissional responsável" 
                value={sessao.supervisao || ''}
                onChange={(e) => handleUpdateSessao(sessao.id, 'supervisao', e.target.value)}
                style={{ padding: '0.5rem', fontSize: '0.875rem' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
