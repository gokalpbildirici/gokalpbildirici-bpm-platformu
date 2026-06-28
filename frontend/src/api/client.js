import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default client;

export const processApi = {
  getAll: () => client.get('/processes').then(r => r.data),
  get: (id) => client.get(`/processes/${id}`).then(r => r.data),
  create: (data) => client.post('/processes', data).then(r => r.data),
  update: (id, data) => client.put(`/processes/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/processes/${id}`),
  createVersion: (id, changedBy, description) =>
    client.post(`/processes/${id}/versions`, null, { params: { changedBy, description } }).then(r => r.data),
  getVersions: (id) => client.get(`/processes/${id}/versions`).then(r => r.data),
  restoreVersion: (id, versionId) =>
    client.post(`/processes/${id}/versions/${versionId}/restore`).then(r => r.data),
  getSteps: (id) => client.get(`/processes/${id}/steps`).then(r => r.data),
  addStep: (id, data) => client.post(`/processes/${id}/steps`, data).then(r => r.data),
  deleteStep: (processId, stepId) => client.delete(`/processes/${processId}/steps/${stepId}`),
  getLogs: (id) => client.get(`/processes/${id}/logs`).then(r => r.data),
};

export const roleApi = {
  getAll: () => client.get('/roles').then(r => r.data),
  create: (data) => client.post('/roles', data).then(r => r.data),
  update: (id, data) => client.put(`/roles/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/roles/${id}`),
};

export const ruleApi = {
  getAll: () => client.get('/rules').then(r => r.data),
  getByProcess: (processId) => client.get(`/rules/process/${processId}`).then(r => r.data),
  create: (data) => client.post('/rules', data).then(r => r.data),
  update: (id, data) => client.put(`/rules/${id}`, data).then(r => r.data),
  delete: (id) => client.delete(`/rules/${id}`),
};

export const logApi = {
  getAll: () => client.get('/logs').then(r => r.data),
};
