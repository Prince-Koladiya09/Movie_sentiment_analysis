import { useState, useCallback } from 'react'
import { predictSingle, predictAll } from '../services/api'
import toast from 'react-hot-toast'

export function usePrediction() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const predict = useCallback(async (text, models) => {
    if (!text.trim()) {
      toast.error('Please enter a review text')
      return
    }
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      let data
      if (models.length === 1) {
        const res = await predictSingle(text, models[0])
        data = { [models[0]]: res }
      } else {
        const res = await predictAll(text)
        // API returns { results: { model_id: {...}, ... } }
        const modelResults = res.results || res
        data = {}
        models.forEach(m => { if (modelResults[m]) data[m] = modelResults[m] })
      }
      setResults(data)
      toast.success('Analysis complete!')
    } catch (err) {
      const msg = err?.response?.data?.detail || 'API Error — is the backend running?'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, results, error, predict }
}
