import { RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts'

const MODEL_COLORS = {
  'Naive Bayes': '#8b5cf6',
  'Logistic Regression': '#5b8fb9',
  'RNN (LSTM)': '#81b29a',
  'DistilBERT': '#e6a54a',
}

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid #ebe3d9',
  borderRadius: 12,
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  fontFamily: 'Inter',
}

export default function MetricsRadar({ data }) {
  if (!data) return <div className="skeleton h-64 w-full" />

  const metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score', 'AUC-ROC']
  const models = Object.keys(data)

  const radarData = metrics.map(metric => {
    const pt = { metric }
    models.forEach(m => {
      pt[m] = (data[m][metric] || 0) * 100
    })
    return pt
  })

  return (
    <div>
      <p className="section-label mb-4">Radar Comparison</p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#ebe3d9" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: '#9a8b78', fontSize: 11, fontFamily: 'Inter' }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(val) => [`${val.toFixed(2)}%`]}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', color: '#5c524a' }} />
          {models.map(m => (
            <Radar
              key={m}
              name={m}
              dataKey={m}
              stroke={MODEL_COLORS[m] || '#8b5cf6'}
              fill={MODEL_COLORS[m] || '#8b5cf6'}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
