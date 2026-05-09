import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import ClientCard from '../components/ClientCard';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const { clients, addClient } = useStore();
  const navigate = useNavigate();

  const handleAddClient = () => {
    const name = window.prompt('Nome do novo cliente:');
    if (name) {
      const id = addClient(name);
      navigate(`/client/${id}`);
    }
  };

  const filteredClients = clients.filter(c => 
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">Total de {clients.length} clientes registrados</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddClient}>
          <UserPlus size={20} />
          Novo Cliente
        </button>
      </div>

      <div className="search-wrapper mb-6">
        <Search className="search-icon" size={20} />
        <input 
          type="text" 
          placeholder="Buscar cliente por nome..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          <p>Nenhum cliente encontrado.</p>
          <button className="btn btn-outline mt-4" onClick={handleAddClient}>
            <UserPlus size={18} /> Adicionar Primeiro Cliente
          </button>
        </div>
      )}
    </div>
  );
}
