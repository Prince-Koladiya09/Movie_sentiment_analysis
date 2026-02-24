import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ThumbsUp, ThumbsDown, Loader2, RotateCcw } from 'lucide-react'
import { usePrediction } from '../hooks/usePrediction'
import ModelSelector from '../components/ModelSelector'
import ConfidenceGauge from '../components/ConfidenceGauge'
import LimeHighlighter from '../components/LimeHighlighter'

const EXAMPLES = [
  {
    label: '😄 Glowing Review',
    text: "An absolute masterpiece! The performances were breathtaking, the cinematography stunning, and the story was deeply moving. One of the best films I've ever seen. A must-watch for cinema lovers.",
  },
  {
    label: '😒 Scathing Review',
    text: 'Terrible movie. The plot made absolutely no sense, the acting was wooden, and the pacing was painfully slow. A complete waste of two hours. I want my money back.',
  },
  {
    label: '🤔 Sarcastic Review',
    text: "Oh sure, because every movie needs an hour of exposition before anything remotely interesting happens. Truly 'groundbreaking' stuff. Hollywood at its finest.",
  },
  {
    label: '😐 Mixed Review',
    text: 'The visuals are stunning and the soundtrack is excellent, but the storyline falls apart in the third act. Some great moments but ultimately a disappointing experience.',
  },
]

const MODEL_DISPLAY = {
  naive_bayes: { label: 'Naive Bayes', color: '#8b5cf6' },
  logistic_regression: { label: 'Logistic Regression', color: '#5b8fb9' },
  rnn_lstm: { label: 'RNN (LSTM)', color: '#81b29a' },
  distilbert: { label: 'DistilBERT', color: '#e6a54a' },
}

function ResultCard({ modelId, result }) {
  const m = MODEL_DISPLAY[modelId] || { label: modelId, color: '#8b5cf6' }
  const isPositive = result.sentiment === 'positive'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-6"
      style={{ borderLeft: `3px solid ${m.color}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-display text-sm font-bold" style={{ color: m.color }}>
          {m.label}
        </span>
        <span
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-bold"
          style={{
            background: isPositive ? 'rgba(129, 178, 154, 0.12)' : 'rgba(224, 92, 140, 0.12)',
            color: isPositive ? '#4a8c6f' : '#c04070',
            border: `1px solid ${isPositive ? 'rgba(129,178,154,0.25)' : 'rgba(224,92,140,0.25)'}`,
          }}
        >
          {isPositive ? <ThumbsUp size={11} /> : <ThumbsDown size={11} />}
          {result.sentiment.toUpperCase()}
        </span>
      </div>

      <div className="flex justify-center my-2">
        <ConfidenceGauge confidence={result.confidence} sentiment={result.sentiment} />
      </div>

      {result.lime_words && result.lime_words.length > 0 && (
        <LimeHighlighter words={result.lime_words} />
      )}

      {result.inference_time_ms != null && (
        <p className="text-xs text-warm-400 mt-3 font-body">
          ⏱ {result.inference_time_ms.toFixed(1)}ms inference
        </p>
      )}
    </motion.div>
  )
}

export default function LivePredictor() {
  const [text, setText] = useState('')
  const [selectedModels, setSelectedModels] = useState(['naive_bayes', 'logistic_regression'])
  const { loading, results, error, predict } = usePrediction()

  const handleAnalyze = () => predict(text, selectedModels)

  const handleExample = (example) => setText(example.text)

  const handleReset = () => {
    setText('')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-coral to-accent-amber flex items-center justify-center shadow-md">
            <Zap size={18} className="text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-warm-800">Live Predictor</h1>
        </div>
        <p className="text-warm-500 mb-10 ml-[52px]">Real-time sentiment analysis with LIME explanations</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-4">

          {/* Example buttons */}
          <div className="card p-5">
            <p className="section-label mb-3">Quick Examples</p>
            <div className="grid grid-cols-2 gap-2">
              {EXAMPLES.map(ex => (
                <button
                  key={ex.label}
                  onClick={() => handleExample(ex)}
                  className="px-3 py-2.5 rounded-xl text-xs text-left transition-all hover:scale-[1.03] hover:shadow-md bg-warm-50 border border-warm-200 text-warm-600 hover:border-accent-coral/30 hover:text-warm-800"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div className="card p-5">
            <ModelSelector selected={selectedModels} onChange={setSelectedModels} />
          </div>
        </div>

        {/* Input + Results */}
        <div className="lg:col-span-2 space-y-6">

          {/* Textarea */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="section-label">Review Text</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-warm-400 font-body">{text.length} chars</span>
                {text && (
                  <button onClick={handleReset} className="text-warm-400 hover:text-warm-600 transition-colors">
                    <RotateCcw size={14} />
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste a movie review here, or select an example above..."
              rows={7}
              className="w-full bg-warm-50 text-warm-800 placeholder-warm-300 resize-none focus:outline-none text-sm leading-relaxed p-4 rounded-xl border border-warm-200 focus:border-accent-coral/40 transition-colors"
            />
            <div className="mt-4">
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Analyze Sentiment
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && !loading && (
            <div className="card p-4 border-l-3 border-l-accent-rose bg-accent-rose/5">
              <p className="text-sm text-accent-rose">{error}</p>
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {results && Object.keys(results).length > 0 && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p className="section-label mb-4">Analysis Results</p>
                <div className={`grid gap-4 ${Object.keys(results).length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                  {Object.entries(results).map(([modelId, result]) => (
                    <ResultCard key={modelId} modelId={modelId} result={result} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!results && !loading && (
            <div className="card p-12 text-center border border-dashed border-warm-300">
              <div className="text-4xl mb-3 opacity-40">🎬</div>
              <p className="text-warm-400 font-display text-sm">Results will appear here after analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
