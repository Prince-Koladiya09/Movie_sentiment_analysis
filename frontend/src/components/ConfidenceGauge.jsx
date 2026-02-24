import { motion } from 'framer-motion'

export default function ConfidenceGauge({ confidence, sentiment }) {
  const isPositive = sentiment === 'positive'
  const color = isPositive ? '#81b29a' : '#e05c8c'
  const pct = Math.round(confidence * 100)

  // SVG arc params
  const r = 52
  const cx = 70
  const cy = 70
  const startAngle = -220
  const endAngle = 40
  const totalAngle = endAngle - startAngle
  const angle = startAngle + (confidence * totalAngle)

  function polarToCart(cx, cy, r, angleDeg) {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function arcPath(cx, cy, r, startAngle, endAngle) {
    const s = polarToCart(cx, cy, r, startAngle)
    const e = polarToCart(cx, cy, r, endAngle)
    const large = endAngle - startAngle > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`
  }

  const bgPath = arcPath(cx, cy, r, startAngle, endAngle)
  const fgPath = arcPath(cx, cy, r, startAngle, angle)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 140, height: 100 }}>
        <svg width={140} height={110} viewBox="0 0 140 110">
          {/* Background arc */}
          <path d={bgPath} fill="none" stroke="#ebe3d9" strokeWidth={10} strokeLinecap="round" />
          {/* Foreground arc */}
          <motion.path
            d={fgPath}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          />
          {/* Center text */}
          <text x={cx} y={cy + 10} textAnchor="middle" fill={color} fontSize={22} fontFamily="Plus Jakarta Sans" fontWeight="bold">
            {pct}%
          </text>
          <text x={cx} y={cy + 28} textAnchor="middle" fill="#9a8b78" fontSize={9} fontFamily="Plus Jakarta Sans" fontWeight="600" letterSpacing="1.5">
            CONFIDENCE
          </text>
        </svg>
      </div>
    </div>
  )
}
