import { api } from './api';

export const apiKeyService = {
  createApiKey: async (data) => {
    // data: { project_name, environment }
    const response = await api.post('/api-keys', data);
    return response.data;
  },

  listApiKeys: async () => {
    const response = await api.get('/api-keys');
    return response.data;
  },

  deleteApiKey: async (id) => {
    const response = await api.delete(`/api-keys/${id}`);
    return response.data;
  },
};
