export default function ConfusionMatrix({ data, modelName }) {
  if (!data) return <div className="skeleton h-48 w-full" />

  const [[tn, fp], [fn, tp]] = data
  const total = tn + fp + fn + tp

  const cells = [
    { label: 'True Neg', value: tn, color: 'rgba(91, 143, 185, 0.12)', text: '#5b8fb9', border: 'rgba(91, 143, 185, 0.25)' },
    { label: 'False Pos', value: fp, color: 'rgba(224, 92, 140, 0.1)', text: '#e05c8c', border: 'rgba(224, 92, 140, 0.2)' },
    { label: 'False Neg', value: fn, color: 'rgba(224, 92, 140, 0.1)', text: '#e05c8c', border: 'rgba(224, 92, 140, 0.2)' },
    { label: 'True Pos', value: tp, color: 'rgba(129, 178, 154, 0.15)', text: '#4a8c6f', border: 'rgba(129, 178, 154, 0.3)' },
  ]

  return (
    <div>
      <p className="section-label mb-4">Confusion Matrix — {modelName}</p>
      <div className="overflow-x-auto">
        <div className="min-w-64 max-w-sm mx-auto">
          {/* Column headers */}
          <div className="grid grid-cols-3 mb-1">
            <div />
            <div className="text-center text-xs text-warm-500 font-display font-semibold py-2">Pred Neg</div>
            <div className="text-center text-xs text-warm-500 font-display font-semibold py-2">Pred Pos</div>
          </div>
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="flex items-center justify-end pr-2 text-xs text-warm-500 font-display font-semibold">Act Neg</div>
            {[cells[0], cells[1]].map((c, i) => (
              <div
                key={i}
                className="aspect-square flex flex-col items-center justify-center rounded-xl relative overflow-hidden"
                style={{ background: c.color, border: `1px solid ${c.border}` }}
              >
                <span className="text-2xl font-display font-bold" style={{ color: c.text }}>{c.value.toLocaleString()}</span>
                <span className="text-[10px] mt-1 font-display font-semibold" style={{ color: c.text, opacity: 0.7 }}>{c.label}</span>
                <span className="text-[10px]" style={{ color: c.text, opacity: 0.5 }}>{((c.value / total) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center justify-end pr-2 text-xs text-warm-500 font-display font-semibold">Act Pos</div>
            {[cells[2], cells[3]].map((c, i) => (
              <div
                key={i}
                className="aspect-square flex flex-col items-center justify-center rounded-xl relative overflow-hidden"
                style={{ background: c.color, border: `1px solid ${c.border}` }}
              >
                <span className="text-2xl font-display font-bold" style={{ color: c.text }}>{c.value.toLocaleString()}</span>
                <span className="text-[10px] mt-1 font-display font-semibold" style={{ color: c.text, opacity: 0.7 }}>{c.label}</span>
                <span className="text-[10px]" style={{ color: c.text, opacity: 0.5 }}>{((c.value / total) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
