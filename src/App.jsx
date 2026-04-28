import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ClientProfile from './pages/ClientProfile';

export default function App() {
  return (
    <div className="app-layout">
      <Routes>
        <Route path="*" element={<Sidebar />} />
      </Routes>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Dashboard />} />
          <Route path="/client/:id/*" element={<ClientProfile />} />
        </Routes>
      </main>
    </div>
  );
}
