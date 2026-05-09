import { Link, useLocation, useParams } from 'react-router-dom';
import { Home, Users, UserPlus, Settings, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const { getClient } = useStore();
  const client = id ? getClient(id) : null;

  return (
    <aside className="sidebar">
      <div className="logo">
        <FileText className="logo-icon" size={28} />
        <span>Estética</span>
      </div>

      <nav className="flex flex-col flex-1">
        <Link to="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/clients" className={`nav-link ${pathname.startsWith('/clients') && !id ? 'active' : ''}`}>
          <Users size={20} />
          <span>Clientes</span>
        </Link>

        {client && (
          <div className="mt-4">
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--clr-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cliente Atual
            </div>
            <Link to={`/client/${client.id}`} className={`nav-link ${pathname.includes(client.id) ? 'active' : ''}`}>
              <UserPlus size={20} />
              <span>{client.name || 'Sem nome'}</span>
            </Link>
          </div>
        )}
      </nav>
      
      <div className="mt-auto">
        <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <Settings size={20} />
          <span>Configurações</span>
        </button>
      </div>
    </aside>
  );
}
