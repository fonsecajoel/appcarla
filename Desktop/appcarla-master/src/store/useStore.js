import { useState, useEffect } from 'react';

const STORE_KEY = 'clinica_clients_db';

let memoryState = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
const listeners = new Set();

const notify = () => {
  localStorage.setItem(STORE_KEY, JSON.stringify(memoryState));
  listeners.forEach((listener) => listener(memoryState));
};

export const storeAPI = {
  getClients: () => memoryState,
  getClient: (id) => memoryState.find((c) => c.id === id),
  addClient: (name) => {
    const newClient = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name,
      anamnese: {},
      medidas: {
        altura: '', peso: { i: '', m: '', f: '' }, busto: { i: '', m: '', f: '' },
        bracoEsq: { i: '', m: '', f: '' }, bracoDir: { i: '', m: '', f: '' },
        abdomen: { i: '', m: '', f: '' }, cintura: { i: '', m: '', f: '' },
        quadril: { i: '', m: '', f: '' }, culote: { i: '', m: '', f: '' },
        coxaEsq: { i: '', m: '', f: '' }, coxaDir: { i: '', m: '', f: '' },
        panturrilhaEsq: { i: '', m: '', f: '' }, panturrilhaDir: { i: '', m: '', f: '' }
      },
      sessoes: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, data: '', tratamentos: {}, supervisao: '' })),
      estiloVida: {},
      relatorio: [],
      fichaFacial: {},
      esculpeDetox: {}
    };
    memoryState = [newClient, ...memoryState];
    notify();
    return newClient.id;
  },
  updateClient: (id, moduleKey, data) => {
    memoryState = memoryState.map((client) => {
      if (client.id === id) {
        return {
          ...client,
          [moduleKey]: typeof data === 'function' ? data(client[moduleKey]) : { ...client[moduleKey], ...data }
        };
      }
      return client;
    });
    notify();
  },
  deleteClient: (id) => {
    memoryState = memoryState.filter((c) => c.id !== id);
    notify();
  },
  _subscribe: (fn) => listeners.add(fn),
  _unsubscribe: (fn) => listeners.delete(fn),
};

export function useStore() {
  const [clients, setClients] = useState(memoryState);

  useEffect(() => {
    const listener = (newState) => setClients([...newState]);
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, []);

  return {
    clients,
    getClient: storeAPI.getClient,
    addClient: storeAPI.addClient,
    updateClient: storeAPI.updateClient,
    deleteClient: storeAPI.deleteClient,
  };
}
