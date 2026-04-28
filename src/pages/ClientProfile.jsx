import { Link, Routes, Route, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Anamnese from './Anamnese';
import Medidas from './Medidas';
import Sessoes from './Sessoes';
import EstiloDeVida from './EstiloDeVida';
import Relatorio from './Relatorio';
import FichaFacial from './FichaFacial';
import EsculpeDetox from './EsculpeDetox';

export default function ClientProfile() {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { getClient, deleteClient } = useStore();
  const client = getClient(id);

  if (!client) {
    return (
      <div className="card mt-4 p-8 text-center">
        <p>Cliente não encontrado.</p>
        <Link to="/" className="btn btn-primary mt-4">Voltar ao Dashboard</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(id);
      navigate('/');
    }
  };

  const tabs = [
    { name: 'Anamnese', path: '' },
    { name: 'Medidas Corporais', path: 'medidas' },
    { name: 'Sessões', path: 'sessoes' },
    { name: 'Estilo de Vida', path: 'estilo' },
    { name: 'Relatório/Notas', path: 'relatorio' },
    { name: 'Ficha Facial', path: 'ficha-facial' },
    { name: 'Esculpe Detox', path: 'esculpe-detox' },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-4" style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)' }}>
        <Link to="/" className="flex items-center gap-1 hover:text-[color:var(--clr-primary)]" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ArrowLeft size={16} /> Dashboard
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--clr-text-main)', fontWeight: 500 }}>{client.name}</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="title" style={{ marginBottom: 0 }}>{client.name}</h1>
        <button className="btn btn-outline" style={{ color: 'var(--clr-danger)', borderColor: 'var(--clr-danger)' }} onClick={handleDelete}>
          <Trash2 size={18} /> Excluir
        </button>
      </div>

      <div className="tabs">
        {tabs.map(tab => {
          const tabPath = `/client/${id}${tab.path ? `/${tab.path}` : ''}`;
          const isActive = tab.path === '' ? pathname === `/client/${id}` : pathname.includes(tab.path);
          return (
            <Link key={tab.name} to={tabPath} className={`tab ${isActive ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
              {tab.name}
            </Link>
          );
        })}
      </div>

      <div className="card" style={{ padding: 'var(--spacing-6)' }}>
        <Routes>
          <Route path="" element={<Anamnese client={client} />} />
          <Route path="medidas" element={<Medidas client={client} />} />
          <Route path="sessoes" element={<Sessoes client={client} />} />
          <Route path="estilo" element={<EstiloDeVida client={client} />} />
          <Route path="relatorio" element={<Relatorio client={client} />} />
          <Route path="ficha-facial" element={<FichaFacial client={client} />} />
          <Route path="esculpe-detox" element={<EsculpeDetox client={client} />} />
        </Routes>
      </div>
    </div>
  );
}
