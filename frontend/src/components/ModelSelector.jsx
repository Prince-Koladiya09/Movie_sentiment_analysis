const MODELS = [
  { id: 'naive_bayes', label: 'Naive Bayes', color: '#8b5cf6', desc: 'TF-IDF + Multinomial NB' },
  { id: 'logistic_regression', label: 'Logistic Regression', color: '#5b8fb9', desc: 'TF-IDF + LR + GridSearchCV' },
  { id: 'rnn_lstm', label: 'RNN (LSTM)', color: '#81b29a', desc: 'Bidirectional LSTM' },
  { id: 'distilbert', label: 'DistilBERT', color: '#e6a54a', desc: 'Fine-tuned Transformer' },
]

export default function ModelSelector({ selected, onChange }) {
  const toggle = (id) => {
    if (selected.includes(id)) {
      if (selected.length > 1) onChange(selected.filter(m => m !== id))
    } else {
      onChange([...selected, id])
    }
  }

  return (
    <div>
      <p className="section-label mb-3">Select Models</p>
      <div className="grid grid-cols-2 gap-2.5">
        {MODELS.map(({ id, label, color, desc }) => {
          const active = selected.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              className="relative p-3.5 rounded-xl text-left transition-all duration-200"
              style={{
                background: active ? `${color}0D` : '#faf8f5',
                border: `1.5px solid ${active ? color : '#ebe3d9'}`,
                boxShadow: active ? `0 2px 12px ${color}20` : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full transition-all"
                  style={{
                    background: active ? color : '#d9cdbf',
                    boxShadow: active ? `0 0 8px ${color}50` : 'none'
                  }}
                />
                <span className="text-sm font-display font-semibold" style={{ color: active ? color : '#5c524a' }}>
                  {label}
                </span>
              </div>
              <p className="text-xs text-warm-500 ml-5">{desc}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { MODELS }
