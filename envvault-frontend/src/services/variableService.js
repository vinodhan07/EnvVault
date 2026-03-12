// src/services/variableService.js
import api from './api'

export const getVariables = (projectId, env) =>
  api.get(`/variables?projectId=${projectId}&env=${env}`)

export const createVariable = (data) =>
  api.post('/variables', data)

export const updateVariable = (id, data) =>
  api.put(`/variables/${id}`, data)

export const deleteVariable = (id) =>
  api.delete(`/variables/${id}`)

export const revealVariable = (id) =>
  api.get(`/variables/${id}/reveal`)

export const exportEnv = (projectId, env) =>
  api.get(`/export?projectId=${projectId}&env=${env}`, {
    responseType: 'blob'  // for file download
  })
