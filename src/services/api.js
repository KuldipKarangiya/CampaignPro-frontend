import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contactService = {
  uploadCSV: async (csvUrl) => {
    const response = await api.post('/api/contacts/upload', { csvUrl });
    return response.data;
  },
  getContacts: async (limit = 20, cursor = null, search = '', tags = '', sort = 'desc') => {
    const params = { limit };
    if (cursor) params.cursor = cursor;
    if (search) params.search = search;
    if (tags) params.tags = tags;
    if (sort) params.sort = sort;
    const response = await api.get('/api/contacts', { params });
    return response.data;
  },
  getUploads: async () => {
    const response = await api.get('/api/contacts/uploads');
    return response.data;
  }
};

export const campaignService = {
  getCampaigns: async (limit = 20, cursor = null) => {
    const params = { limit };
    if (cursor) params.cursor = cursor;
    const response = await api.get('/api/campaigns', { params });
    return response.data;
  },
  createCampaign: async (name, template) => {
    const response = await api.post('/api/campaigns', { name, template });
    return response.data;
  },
  startCampaign: async (id, filterOptions) => {
    const response = await api.post(`/api/campaigns/${id}/start`, filterOptions);
    return response.data;
  }
};
