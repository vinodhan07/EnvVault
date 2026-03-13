import { api } from './api';

export const secretService = {
  getSecrets: async (environment) => {
    const response = await api.get('/secrets', { params: { environment } });
    return response.data;
  },

  revealSecret: async (id) => {
    const response = await api.get(`/secrets/${id}/reveal`);
    return response.data; // e.g., { value: 'the-real-secret-value' }
  },

  createSecret: async (data) => {
    // data: { key, value, description, environment }
    const response = await api.post('/secrets', data);
    return response.data;
  },

  updateSecret: async (id, data) => {
    const response = await api.put(`/secrets/${id}`, data);
    return response.data;
  },

  deleteSecret: async (id) => {
    const response = await api.delete(`/secrets/${id}`);
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await api.get('/audit-logs');
    return response.data;
  },

  exportEnv: async (environment) => {
    const response = await api.get('/secrets/export', { params: { environment } });
    return response.data; // Array or string representation
  }
};
