import { Link } from 'react-router-dom';
import { User, Calendar, ChevronRight } from 'lucide-react';

export default function ClientCard({ client }) {
  const lastVisit = client.relatorio && client.relatorio.length > 0
    ? new Date(client.relatorio[client.relatorio.length - 1].date).toLocaleDateString()
    : 'Nenhuma visita';

  const age = client.anamnese?.idade || 'N/A';

  return (
    <Link to={`/client/${client.id}`} style={{ textDecoration: 'none' }}>
      <div className="card card-hover flex flex-col justify-between" style={{ height: '100%' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div style={{
              width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--clr-sidebar)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-primary)'
            }}>
              <User size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.1rem' }}>{client.name || 'Sem Nome'}</h3>
              <span className="badge badge-outline">Idade: {age}</span>
            </div>
          </div>
          <ChevronRight size={20} style={{ color: 'var(--clr-text-muted)' }} />
        </div>

        <div className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--clr-text-muted)', borderTop: '1px solid var(--clr-border)', paddingTop: '1rem' }}>
          <Calendar size={16} />
          <span>Última visita: {lastVisit}</span>
        </div>
      </div>
    </Link>
  );
}
