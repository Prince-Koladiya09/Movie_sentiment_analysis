import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState } from 'react'

const METRICS = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'AUC-ROC']
const MODEL_COLORS = ['#8b5cf6', '#5b8fb9', '#81b29a', '#e6a54a']

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid #ebe3d9',
  borderRadius: 12,
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  fontFamily: 'Inter',
}

export default function MetricsBar({ data }) {
  const [selected, setSelected] = useState('F1-Score')

  if (!data) return <div className="skeleton h-64 w-full" />

  const models = Object.keys(data)
  const chartData = models.map(m => ({
    model: m.length > 15 ? m.substring(0, 15) + '…' : m,
    fullName: m,
    value: (data[m][selected] || 0) * 100,
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="section-label">Metrics Comparison</p>
        <div className="flex gap-1">
          {METRICS.map(m => (
            <button
              key={m}
              onClick={() => setSelected(m)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all"
              style={{
                background: selected === m ? 'rgba(224, 122, 95, 0.1)' : 'transparent',
                color: selected === m ? '#e07a5f' : '#9a8b78',
                border: `1px solid ${selected === m ? 'rgba(224, 122, 95, 0.25)' : 'transparent'}`,
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebe3d9" vertical={false} />
          <XAxis dataKey="model" tick={{ fill: '#9a8b78', fontSize: 11, fontFamily: 'Inter' }} />
          <YAxis domain={[85, 100]} tick={{ fill: '#9a8b78', fontSize: 11 }} tickFormatter={v => `${v.toFixed(0)}%`} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(val, _, { payload }) => [`${val.toFixed(2)}%`, payload.fullName]}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={MODEL_COLORS[i % MODEL_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
