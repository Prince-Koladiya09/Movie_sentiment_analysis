import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  timeout: 60000,
})

api.interceptors.response.use(
  res => res.data,
  err => {
    console.error('API Error:', err)
    throw err
  }
)

export const predictSingle = (text, model) =>
  api.post('/predict', { text, model })

export const predictAll = (text) =>
  api.post('/predict/compare', { text })

export const getMetrics = () =>
  api.get('/metrics')

export const getDatasetStats = () =>
  api.get('/dataset/stats')

export const getErrors = (params = {}) =>
  api.get('/errors', { params })

export const getTrainingHistory = (model) =>
  api.get('/training-history', { params: { model } })

export default api
