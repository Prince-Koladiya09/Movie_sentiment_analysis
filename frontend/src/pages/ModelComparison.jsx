import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts'
import { GitCompare } from 'lucide-react'
import { getMetrics, getTrainingHistory } from '../services/api'
import MetricsBar from '../components/charts/MetricsBar'
import MetricsRadar from '../components/charts/RadarChart'
import ConfusionMatrix from '../components/charts/ConfusionMatrix'
import ROCCurve from '../components/charts/ROCCurve'

// Mock data
const MOCK_METRICS = {
  'Naive Bayes': { Accuracy: 0.872, Precision: 0.876, Recall: 0.867, 'F1-Score': 0.871, 'AUC-ROC': 0.950 },
  'Logistic Regression': { Accuracy: 0.904, Precision: 0.910, Recall: 0.897, 'F1-Score': 0.903, 'AUC-ROC': 0.967 },
  'RNN (LSTM)': { Accuracy: 0.912, Precision: 0.918, Recall: 0.905, 'F1-Score': 0.911, 'AUC-ROC': 0.972 },
  'DistilBERT': { Accuracy: 0.932, Precision: 0.935, Recall: 0.928, 'F1-Score': 0.931, 'AUC-ROC': 0.986 },
}

const MOCK_CONFUSION = {
  'Naive Bayes': [[10523, 1477], [1852, 11148]],
  'Logistic Regression': [[11102, 898], [1057, 12943]],
  'RNN (LSTM)': [[11287, 713], [910, 13090]],
  'DistilBERT': [[946, 54], [66, 934]],
}

function genROC(auc) {
  const pts = []
  for (let i = 0; i <= 50; i++) {
    const fpr = i / 50
    const tpr = Math.min(1, Math.pow(fpr, 1 / (auc * 3)) * auc + fpr * (1 - auc))
    pts.push({ fpr, tpr })
  }
  return pts
}

const MOCK_ROC = {
  'Naive Bayes': genROC(0.950),
  'Logistic Regression': genROC(0.967),
  'RNN (LSTM)': genROC(0.972),
  'DistilBERT': genROC(0.986),
}

function genHistory(epochs, start, end) {
  return Array.from({ length: epochs }, (_, i) => ({
    epoch: i + 1,
    train_acc: start + (end - start) * (1 - Math.exp(-i * 0.8)) + (Math.random() - 0.5) * 0.01,
    val_acc: start + (end - start) * (1 - Math.exp(-i * 0.7)) - 0.02 + (Math.random() - 0.5) * 0.015,
    train_loss: 0.7 - (0.7 - 0.15) * (1 - Math.exp(-i * 0.8)) + (Math.random() - 0.5) * 0.02,
    val_loss: 0.72 - (0.72 - 0.2) * (1 - Math.exp(-i * 0.7)) + (Math.random() - 0.5) * 0.03,
  }))
}

const MOCK_HISTORY = {
  'rnn_lstm': genHistory(10, 0.7, 0.91),
  'distilbert': genHistory(3, 0.82, 0.935),
}

const METRIC_KEYS = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'AUC-ROC']
const MODEL_COLORS = ['#8b5cf6', '#5b8fb9', '#81b29a', '#e6a54a']

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid #ebe3d9',
  borderRadius: 12,
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  fontFamily: 'Inter',
}

export default function ModelComparison() {
  const [metrics, setMetrics] = useState(MOCK_METRICS)
  const [history, setHistory] = useState(MOCK_HISTORY)
  const [cmModel, setCmModel] = useState('Naive Bayes')

  useEffect(() => {
    getMetrics().then(setMetrics).catch(() => { })
  }, [])

  const models = Object.keys(metrics)
  const tableData = models.map(m => ({ model: m, ...metrics[m] }))

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-plum to-accent-blue flex items-center justify-center shadow-md">
            <GitCompare size={18} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-warm-800">Model Comparison</h1>
        </div>
        <p className="text-warm-500 mb-10 ml-[52px]">Side-by-side analysis of all 4 architectures on the same test set</p>
      </motion.div>

      {/* Metrics Table */}
      <div className="card p-6 mb-6">
        <p className="section-label mb-4">Performance Metrics Summary</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-200">
                <th className="text-left py-3 px-4 section-label">Model</th>
                {METRIC_KEYS.map(k => (
                  <th key={k} className="text-center py-3 px-4 section-label">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, i) => (
                <tr key={row.model} className="border-b border-warm-100 transition-colors hover:bg-warm-50">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: MODEL_COLORS[i] }} />
                      <span className="text-warm-700 font-display text-sm font-semibold">{row.model}</span>
                    </div>
                  </td>
                  {METRIC_KEYS.map(k => {
                    const val = row[k]
                    const isTop = models.every(m => (metrics[m][k] || 0) <= (metrics[row.model][k] || 0))
                    return (
                      <td key={k} className="py-3.5 px-4 text-center">
                        <span
                          className="font-display text-sm font-semibold"
                          style={{ color: isTop ? MODEL_COLORS[i] : '#9a8b78' }}
                        >
                          {(val * 100).toFixed(2)}%
                          {isTop && <span className="ml-1 text-xs">★</span>}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <MetricsBar data={metrics} />
        </div>
        <div className="card p-6">
          <MetricsRadar data={metrics} />
        </div>
      </div>

      {/* ROC Curves */}
      <div className="card p-6 mb-6">
        <ROCCurve data={MOCK_ROC} />
      </div>

      {/* Confusion Matrix + Training History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <span />
            <select
              value={cmModel}
              onChange={e => setCmModel(e.target.value)}
              className="text-xs font-display font-semibold bg-warm-50 text-warm-700 border border-warm-200 rounded-xl px-3 py-2 focus:outline-none focus:border-accent-coral/40 transition-colors"
            >
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <ConfusionMatrix data={MOCK_CONFUSION[cmModel]} modelName={cmModel} />
        </div>

        {/* Training History */}
        <div className="card p-6">
          <p className="section-label mb-4">Training History — LSTM</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MOCK_HISTORY.rnn_lstm} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe3d9" />
              <XAxis dataKey="epoch" tick={{ fill: '#9a8b78', fontSize: 11 }} label={{ value: 'Epoch', position: 'insideBottom', offset: -3, fill: '#9a8b78', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9a8b78', fontSize: 11 }} domain={[0.6, 1]} tickFormatter={v => v.toFixed(2)} />
              <Tooltip contentStyle={tooltipStyle} formatter={v => v.toFixed(4)} />
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', color: '#5c524a' }} />
              <Line type="monotone" dataKey="train_acc" name="Train Acc" stroke="#81b29a" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="val_acc" name="Val Acc" stroke="#5b8fb9" dot={false} strokeWidth={2} strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DistilBERT training */}
      <div className="card p-6">
        <p className="section-label mb-4">Training History — DistilBERT</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={MOCK_HISTORY.distilbert} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ebe3d9" />
            <XAxis dataKey="epoch" tick={{ fill: '#9a8b78', fontSize: 11 }} />
            <YAxis tick={{ fill: '#9a8b78', fontSize: 11 }} domain={[0.7, 1]} tickFormatter={v => v.toFixed(2)} />
            <Tooltip contentStyle={tooltipStyle} formatter={v => v.toFixed(4)} />
            <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', color: '#5c524a' }} />
            <Line type="monotone" dataKey="train_acc" name="Train Acc" stroke="#e6a54a" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="val_acc" name="Val Acc" stroke="#5b8fb9" dot={false} strokeWidth={2} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="train_loss" name="Train Loss" stroke="#e05c8c" dot={false} strokeWidth={1.5} strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
