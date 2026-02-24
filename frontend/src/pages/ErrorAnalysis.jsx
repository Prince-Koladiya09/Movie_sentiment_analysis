import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle, TrendingDown } from 'lucide-react'
import { getErrors } from '../services/api'

const MOCK_ERRORS = [
  { id: 1, model: 'Naive Bayes', review: "I can't say enough bad things about this film... just kidding, it was fantastic!", true_label: 'positive', pred_label: 'negative', confidence: 0.91, length: 78, reason: 'Sarcasm / Negation' },
  { id: 2, model: 'Logistic Regression', review: 'The movie was not without its charm, but ultimately fails to deliver on its ambitious premise.', true_label: 'negative', pred_label: 'positive', confidence: 0.82, length: 90, reason: 'Complex negation' },
  { id: 3, model: 'RNN (LSTM)', review: "Barely watchable. Somehow worse than the sequel, which was already bad.", true_label: 'negative', pred_label: 'positive', confidence: 0.77, length: 68, reason: 'Unusual phrasing' },
  { id: 4, model: 'DistilBERT', review: "A film that tries so hard to be profound that it forgets to be entertaining.", true_label: 'negative', pred_label: 'positive', confidence: 0.71, length: 74, reason: 'Subtle irony' },
  { id: 5, model: 'Naive Bayes', review: "Despite the terrible reviews, I actually enjoyed it. Go figure.", true_label: 'positive', pred_label: 'negative', confidence: 0.88, length: 58, reason: 'Contrast with expectations' },
  { id: 6, model: 'Logistic Regression', review: "The 'acting' was so over-the-top it became unintentionally hilarious.", true_label: 'positive', pred_label: 'negative', confidence: 0.79, length: 68, reason: 'Quotation irony' },
  { id: 7, model: 'RNN (LSTM)', review: "My friends loved it; I found it deeply mediocre.", true_label: 'negative', pred_label: 'positive', confidence: 0.73, length: 47, reason: 'Short length ambiguity' },
  { id: 8, model: 'DistilBERT', review: "Technically impressive but emotionally hollow. Beautiful images, no soul.", true_label: 'negative', pred_label: 'positive', confidence: 0.68, length: 70, reason: 'Mixed signals' },
]

const ERROR_BY_LENGTH = [
  { bucket: '0-200', error_rate: 0.18 },
  { bucket: '200-400', error_rate: 0.12 },
  { bucket: '400-600', error_rate: 0.10 },
  { bucket: '600-800', error_rate: 0.09 },
  { bucket: '800-1000', error_rate: 0.11 },
  { bucket: '1000+', error_rate: 0.14 },
]

const SARCASM_EXAMPLES = [
  {
    text: "Oh wow, another superhero movie! Just what the world needed. A real creative breakthrough.",
    note: "Sarcasm — positive words mask negative sentiment",
    trueLabel: 'negative',
  },
  {
    text: "I've never been so bored in my life... I was riveted. Staring at the ceiling was more engaging.",
    note: "Direct contradiction within sentence",
    trueLabel: 'negative',
  },
  {
    text: "It's not the worst movie of the year. It IS the worst movie of the decade.",
    note: "False softening then extreme negative",
    trueLabel: 'negative',
  },
]

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid #ebe3d9',
  borderRadius: 12,
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  fontFamily: 'Inter',
}

export default function ErrorAnalysis() {
  const [errors, setErrors] = useState(MOCK_ERRORS)
  const [modelFilter, setModelFilter] = useState('all')
  const [trueLabelFilter, setTrueLabelFilter] = useState('all')
  const [predLabelFilter, setPredLabelFilter] = useState('all')

  useEffect(() => {
    getErrors().then(data => { if (data?.length) setErrors(data) }).catch(() => { })
  }, [])

  const models = [...new Set(MOCK_ERRORS.map(e => e.model))]

  const filtered = errors.filter(e => {
    const mOk = modelFilter === 'all' || e.model === modelFilter
    const tOk = trueLabelFilter === 'all' || e.true_label === trueLabelFilter
    const pOk = predLabelFilter === 'all' || e.pred_label === predLabelFilter
    return mOk && tOk && pOk
  })

  const highConf = [...errors].sort((a, b) => b.confidence - a.confidence).slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-rose to-accent-amber flex items-center justify-center shadow-md">
            <AlertTriangle size={18} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-warm-800">Error Analysis</h1>
        </div>
        <p className="text-warm-500 mb-10 ml-[52px]">Understanding where and why models fail</p>
      </motion.div>

      {/* Error by Length */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <p className="section-label mb-4">Error Rate by Review Length</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={ERROR_BY_LENGTH} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe3d9" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fill: '#9a8b78', fontSize: 10, fontFamily: 'Inter' }} />
              <YAxis tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fill: '#9a8b78', fontSize: 11 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={v => [`${(v * 100).toFixed(1)}%`, 'Error Rate']}
              />
              <Bar dataKey="error_rate" fill="#e05c8c" fillOpacity={0.75} radius={[6, 6, 0, 0]} name="Error Rate" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-warm-400 mt-2">Short reviews (&lt;200 chars) have the highest error rate — less context for models</p>
        </div>

        {/* High confidence failures */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={14} className="text-accent-rose" />
            <p className="section-label text-accent-rose">High Confidence Failures</p>
          </div>
          <p className="text-xs text-warm-400 mb-4">Most egregious misclassifications — model was very confident but very wrong</p>
          <div className="space-y-3">
            {highConf.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-accent-rose/5 border border-accent-rose/15"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-xs font-semibold text-accent-rose">{e.model}</span>
                  <span className="font-display text-xs text-accent-rose font-bold">{(e.confidence * 100).toFixed(0)}% WRONG</span>
                </div>
                <p className="text-xs text-warm-600 line-clamp-2 mb-2">"{e.review}"</p>
                <div className="flex gap-2 text-xs">
                  <span className="text-accent-sage font-semibold">True: {e.true_label}</span>
                  <span className="text-warm-300">→</span>
                  <span className="text-accent-rose font-semibold">Pred: {e.pred_label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Filterable Error Table */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <p className="section-label">Misclassification Table</p>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: modelFilter, onChange: setModelFilter, options: ['all', ...models], labels: ['All Models', ...models] },
              { value: trueLabelFilter, onChange: setTrueLabelFilter, options: ['all', 'positive', 'negative'], labels: ['True: All', 'True: Positive', 'True: Negative'] },
              { value: predLabelFilter, onChange: setPredLabelFilter, options: ['all', 'positive', 'negative'], labels: ['Pred: All', 'Pred: Positive', 'Pred: Negative'] },
            ].map((filter, fi) => (
              <select
                key={fi}
                value={filter.value}
                onChange={e => filter.onChange(e.target.value)}
                className="text-xs font-display font-semibold rounded-xl px-3 py-2 focus:outline-none bg-warm-50 border border-warm-200 text-warm-600 focus:border-accent-coral/40 transition-colors"
              >
                {filter.options.map((opt, oi) => <option key={opt} value={opt}>{filter.labels[oi]}</option>)}
              </select>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-200">
                {['Model', 'Review', 'True', 'Predicted', 'Confidence', 'Length', 'Reason'].map(h => (
                  <th key={h} className="text-left py-3 px-3 section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-warm-100 transition-colors hover:bg-warm-50">
                  <td className="py-3.5 px-3 text-xs font-display font-semibold text-warm-500 whitespace-nowrap">{e.model}</td>
                  <td className="py-3.5 px-3 text-warm-600 max-w-xs">
                    <span className="line-clamp-2 text-xs">"{e.review}"</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-xs font-display font-semibold" style={{ color: e.true_label === 'positive' ? '#4a8c6f' : '#c04070' }}>
                      {e.true_label}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-xs font-display font-semibold" style={{ color: e.pred_label === 'positive' ? '#4a8c6f' : '#c04070' }}>
                      {e.pred_label} ✗
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-xs font-display font-semibold text-accent-amber">{(e.confidence * 100).toFixed(0)}%</td>
                  <td className="py-3.5 px-3 text-xs font-display text-warm-400">{e.length}</td>
                  <td className="py-3.5 px-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-accent-amber/10 text-accent-amber border border-accent-amber/20 font-semibold">
                      {e.reason}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-warm-400 mt-4">{filtered.length} errors shown</p>
      </div>

      {/* Sarcasm Examples */}
      <div className="card p-6">
        <p className="section-label mb-2">Qualitative Analysis: Sarcasm & Negation Failures</p>
        <p className="text-xs text-warm-400 mb-6">Annotated examples showing linguistic patterns that trip up ML models</p>
        <div className="space-y-4">
          {SARCASM_EXAMPLES.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl bg-accent-amber/5 border border-accent-amber/15"
            >
              <p className="text-sm text-warm-700 italic mb-3">"{ex.text}"</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="text-xs px-2.5 py-1 rounded-lg font-display font-bold bg-accent-rose/10 text-accent-rose border border-accent-rose/20"
                >
                  TRUE: {ex.trueLabel.toUpperCase()}
                </span>
                <span className="text-xs text-accent-amber font-display font-semibold">⚠ {ex.note}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
