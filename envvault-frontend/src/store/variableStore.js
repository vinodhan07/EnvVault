// src/store/variableStore.js
import { create } from 'zustand'

export const useVariableStore = create((set) => ({
  variables:   [],
  environment: 'dev',   // 'dev' | 'staging' | 'prod'
  loading:     false,

  setVariables:   (variables)   => set({ variables }),
  setEnvironment: (environment) => set({ environment }),
  setLoading:     (loading)     => set({ loading }),

  addVariable: (v) =>
    set((s) => ({ variables: [...s.variables, v] })),

  updateVariable: (id, updated) =>
    set((s) => ({
      variables: s.variables.map((v) => v.id === id ? updated : v)
    })),

  removeVariable: (id) =>
    set((s) => ({
      variables: s.variables.filter((v) => v.id !== id)
    })),
}))
