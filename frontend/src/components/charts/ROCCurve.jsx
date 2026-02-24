import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'

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

export default function ROCCurve({ data }) {
  if (!data) return <div className="skeleton h-64 w-full" />

  const models = Object.keys(data)

  return (
    <div>
      <p className="section-label mb-4">ROC Curves (All Models)</p>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart margin={{ top: 5, right: 20, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebe3d9" />
          <XAxis
            type="number"
            domain={[0, 1]}
            label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -10, fill: '#9a8b78', fontSize: 11 }}
            tick={{ fill: '#9a8b78', fontSize: 11 }}
            tickFormatter={v => v.toFixed(1)}
          />
          <YAxis
            type="number"
            domain={[0, 1]}
            label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#9a8b78', fontSize: 11 }}
            tick={{ fill: '#9a8b78', fontSize: 11 }}
            tickFormatter={v => v.toFixed(1)}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#9a8b78' }}
          />
          <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', color: '#5c524a' }} />
          <ReferenceLine
            segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
            stroke="#d9cdbf"
            strokeDasharray="4 4"
            label={{ value: 'Random', fill: '#b8a994', fontSize: 10 }}
          />
          {models.map(model => (
            <Line
              key={model}
              type="monotone"
              data={data[model]}
              dataKey="tpr"
              name={model}
              stroke={MODEL_COLORS[model] || '#8b5cf6'}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
