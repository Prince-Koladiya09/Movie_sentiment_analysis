import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { Database, Search } from 'lucide-react'
import { getDatasetStats } from '../services/api'

// Mock data for when backend not connected
const MOCK_STATS = {
  length_distribution: Array.from({ length: 20 }, (_, i) => ({
    bucket: `${i * 200}-${(i + 1) * 200}`,
    positive: Math.floor(Math.random() * 800 + 200),
    negative: Math.floor(Math.random() * 800 + 200),
  })),
  sentiment_distribution: [
    { name: 'Positive', value: 25000, color: '#81b29a' },
    { name: 'Negative', value: 25000, color: '#e05c8c' },
  ],
  top_positive_words: ['great', 'excellent', 'love', 'amazing', 'wonderful', 'best', 'fantastic', 'perfect', 'brilliant', 'superb'].map((w, i) => ({ word: w, count: 5000 - i * 400 })),
  top_negative_words: ['bad', 'terrible', 'waste', 'awful', 'boring', 'worst', 'disappointing', 'poor', 'horrible', 'dull'].map((w, i) => ({ word: w, count: 4500 - i * 380 })),
  sample_reviews: [
    { id: 1, text: 'An absolute masterpiece of cinema. The performances were stunning.', sentiment: 1, length: 67 },
    { id: 2, text: 'Terrible movie. Complete waste of time and money. Avoid at all costs.', sentiment: 0, length: 65 },
    { id: 3, text: 'A decent watch but nothing special. Some good moments, some dull ones.', sentiment: 1, length: 70 },
    { id: 4, text: 'The plot made no sense and the acting was wooden throughout.', sentiment: 0, length: 59 },
    { id: 5, text: 'Surprisingly good! I had low expectations but was really impressed.', sentiment: 1, length: 65 },
    { id: 6, text: 'One of the worst films I have seen. Boring from start to finish.', sentiment: 0, length: 62 },
  ]
}

const tooltipStyle = {
  background: '#ffffff',
  border: '1px solid #ebe3d9',
  borderRadius: 12,
  fontSize: 12,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  fontFamily: 'Inter',
}

export default function DataExplorer() {
  const [stats, setStats] = useState(MOCK_STATS)
  const [loading, setLoading] = useState(false)
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const PER_PAGE = 4

  useEffect(() => {
    setLoading(true)
    getDatasetStats()
      .then(data => setStats(data))
      .catch(() => { }) // fallback to mock
      .finally(() => setLoading(false))
  }, [])

  const filteredReviews = (stats.sample_reviews || []).filter(r => {
    const matchSentiment = sentimentFilter === 'all' || r.sentiment === (sentimentFilter === 'positive' ? 1 : 0)
    const matchSearch = !search || r.text.toLowerCase().includes(search.toLowerCase())
    return matchSentiment && matchSearch
  })

  const pagedReviews = filteredReviews.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const totalPages = Math.ceil(filteredReviews.length / PER_PAGE)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-sage flex items-center justify-center shadow-md">
            <Database size={18} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-warm-800">Data Explorer</h1>
        </div>
        <p className="text-warm-500 mb-10 ml-[52px]">IMDB Dataset Analysis — 50,000 balanced movie reviews</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Length Distribution */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="section-label">Review Length Distribution</p>
            <div className="flex gap-1.5">
              {['all', 'positive', 'negative'].map(f => (
                <button
                  key={f}
                  onClick={() => setSentimentFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-display font-semibold capitalize transition-all"
                  style={{
                    background: sentimentFilter === f ? 'rgba(224, 122, 95, 0.1)' : 'transparent',
                    color: sentimentFilter === f ? '#e07a5f' : '#9a8b78',
                    border: `1px solid ${sentimentFilter === f ? 'rgba(224, 122, 95, 0.25)' : 'transparent'}`,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.length_distribution} margin={{ top: 5, right: 10, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ebe3d9" vertical={false} />
              <XAxis dataKey="bucket" tick={{ fill: '#9a8b78', fontSize: 9, fontFamily: 'Inter' }} angle={-45} textAnchor="end" />
              <YAxis tick={{ fill: '#9a8b78', fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              {(sentimentFilter === 'all' || sentimentFilter === 'positive') &&
                <Bar dataKey="positive" name="Positive" fill="#81b29a" fillOpacity={0.85} radius={[4, 4, 0, 0]} />}
              {(sentimentFilter === 'all' || sentimentFilter === 'negative') &&
                <Bar dataKey="negative" name="Negative" fill="#e05c8c" fillOpacity={0.85} radius={[4, 4, 0, 0]} />}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Distribution Donut */}
        <div className="card p-6">
          <p className="section-label mb-4">Sentiment Distribution</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.sentiment_distribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {stats.sentiment_distribution?.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', color: '#5c524a' }} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val) => [val.toLocaleString(), '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <span className="font-display text-xs text-warm-400 font-semibold">PERFECTLY BALANCED DATASET</span>
          </div>
        </div>
      </div>

      {/* Top Words */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[
          { title: 'Top Positive Words', data: stats.top_positive_words, color: '#81b29a' },
          { title: 'Top Negative Words', data: stats.top_negative_words, color: '#e05c8c' },
        ].map(({ title, data, color }) => (
          <div key={title} className="card p-6">
            <p className="section-label mb-4" style={{ color }}>{title}</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ebe3d9" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#9a8b78', fontSize: 11 }} />
                <YAxis type="category" dataKey="word" tick={{ fill: '#5c524a', fontSize: 11, fontFamily: 'Inter' }} width={70} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill={color} fillOpacity={0.8} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* Review Table */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="section-label">Sample Reviews</p>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0) }}
              placeholder="Search reviews..."
              className="pl-9 pr-4 py-2.5 rounded-xl text-sm bg-warm-50 text-warm-700 border border-warm-200 focus:outline-none focus:border-accent-coral/40 w-full sm:w-64 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-200">
                {['#', 'Review', 'Sentiment', 'Length'].map(h => (
                  <th key={h} className="text-left py-3 px-4 section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedReviews.map((r) => (
                <tr key={r.id} className="border-b border-warm-100 transition-colors hover:bg-warm-50">
                  <td className="py-3.5 px-4 text-warm-400 font-display text-xs font-semibold">{r.id}</td>
                  <td className="py-3.5 px-4 text-warm-700 max-w-sm">
                    <span className="line-clamp-2">{r.text}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-display font-bold"
                      style={{
                        background: r.sentiment === 1 ? 'rgba(129, 178, 154, 0.12)' : 'rgba(224, 92, 140, 0.12)',
                        color: r.sentiment === 1 ? '#4a8c6f' : '#c04070',
                        border: `1px solid ${r.sentiment === 1 ? 'rgba(129,178,154,0.25)' : 'rgba(224,92,140,0.25)'}`,
                      }}
                    >
                      {r.sentiment === 1 ? '+ Positive' : '– Negative'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-warm-400 font-display text-xs">{r.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-warm-100">
          <span className="text-xs text-warm-400">{filteredReviews.length} reviews</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all disabled:opacity-30 bg-warm-100 text-warm-600 hover:bg-warm-200"
            >
              ← Prev
            </button>
            <span className="px-3.5 py-1.5 text-xs font-display font-semibold text-accent-coral">{page + 1} / {Math.max(1, totalPages)}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3.5 py-1.5 rounded-lg text-xs font-display font-semibold transition-all disabled:opacity-30 bg-warm-100 text-warm-600 hover:bg-warm-200"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
