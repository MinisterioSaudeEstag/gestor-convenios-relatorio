// Exemplo de adaptação para o src/api/base44Client.js
import { createClient } from '@base44/sdk';

// Se o SDK exigir configuração, ou podemos criar um mock leve para testes locais:
export const base44 = {
  auth: {
    me: async () => {
      // Retorna um usuário mockado para testes locais
      const userStr = localStorage.getItem('kora_user');
      return userStr ? JSON.parse(userStr) : null;
    },
    register: async ({ email, password }) => {
      const mockUser = { id: '1', email, name: email.split('@')[0] };
      localStorage.setItem('kora_user', JSON.stringify(mockUser));
      return { user: mockUser };
    },
    login: async ({ email, password }) => {
      const mockUser = { id: '1', email, name: email.split('@')[0] };
      localStorage.setItem('kora_user', JSON.stringify(mockUser));
      return { user: mockUser };
    },
    loginWithProvider: async () => {
      const mockUser = { id: '1', email: 'autoridade@saude.gov.br', name: 'Gestor SUS' };
      localStorage.setItem('kora_user', JSON.stringify(mockUser));
      window.location.href = '/';
    },
    logout: async () => {
      localStorage.removeItem('kora_user');
      window.location.href = '/login';
    }
  },
  entities: {
    // Mock básico para entidades caso precise salvar convênios localmente via localStorage
    Documento: {
      create: async (data) => data,
      delete: async () => true,
    }
  }
};