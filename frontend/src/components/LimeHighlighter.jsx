import { motion } from 'framer-motion'

export default function LimeHighlighter({ words }) {
  // words = [{ word, weight }]  weight > 0 → positive, < 0 → negative
  if (!words || words.length === 0) return null

  const maxAbs = Math.max(...words.map(w => Math.abs(w.weight)), 0.001)

  return (
    <div className="mt-4">
      <p className="section-label mb-3">Word Importance</p>
      <div className="flex flex-wrap gap-2">
        {words.map(({ word, weight }, i) => {
          const intensity = Math.min(Math.abs(weight) / maxAbs, 1)
          const isPos = weight > 0
          const alpha = 0.08 + intensity * 0.25

          const bg = isPos
            ? `rgba(129, 178, 154, ${alpha})`
            : `rgba(224, 92, 140, ${alpha})`
          const border = isPos
            ? `rgba(129, 178, 154, ${alpha + 0.15})`
            : `rgba(224, 92, 140, ${alpha + 0.15})`
          const text = isPos ? '#4a8c6f' : '#c04070'

          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              className="inline-block px-3 py-1 rounded-lg text-sm font-medium cursor-default"
              style={{ background: bg, border: `1px solid ${border}`, color: text }}
              title={`Weight: ${weight.toFixed(4)}`}
            >
              {word}
              <span className="ml-1 text-xs opacity-60">
                {isPos ? '↑' : '↓'}
              </span>
            </motion.span>
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-warm-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded inline-block" style={{ background: 'rgba(129, 178, 154, 0.35)' }}></span>
          Positive signal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded inline-block" style={{ background: 'rgba(224, 92, 140, 0.35)' }}></span>
          Negative signal
        </span>
      </div>
    </div>
  )
}
