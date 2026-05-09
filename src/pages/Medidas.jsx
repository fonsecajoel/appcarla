import { useStore } from '../store/useStore';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

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
  const { updateClient } = useStore();
  const medidas = client.medidas || {};

  const handleAlturaChange = (e) => {
    updateClient(client.id, 'medidas', { altura: e.target.value });
  };

  const handleMeasureChange = (field, period, value) => {
    const newFieldData = { ...medidas[field], [period]: value };
    updateClient(client.id, 'medidas', { [field]: newFieldData });
  };

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
          <input type="number" step="0.01" value={medidas.altura || ''} onChange={handleAlturaChange} placeholder="Ex: 1.65" />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Área</th>
              <th>Início (cm/kg)</th>
              <th>Meio (cm/kg)</th>
              <th>Fim (cm/kg)</th>
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
                    <input type="number" step="0.1" value={data.i || ''} onChange={(e) => handleMeasureChange(key, 'i', e.target.value)} style={{ padding: '0.5rem' }} />
                  </td>
                  <td>
                    <input type="number" step="0.1" value={data.m || ''} onChange={(e) => handleMeasureChange(key, 'm', e.target.value)} style={{ padding: '0.5rem' }} />
                  </td>
                  <td>
                    <input type="number" step="0.1" value={data.f || ''} onChange={(e) => handleMeasureChange(key, 'f', e.target.value)} style={{ padding: '0.5rem' }} />
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
                    {renderDiff(data.i, data.f)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
