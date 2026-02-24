import { motion } from 'framer-motion'

export default function StatCard({ value, label, icon: Icon, color = 'coral', delay = 0 }) {
  const colorMap = {
    purple: { text: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.15)' },
    cyan: { text: '#5b8fb9', bg: 'rgba(91, 143, 185, 0.08)', border: 'rgba(91, 143, 185, 0.15)' },
    green: { text: '#81b29a', bg: 'rgba(129, 178, 154, 0.08)', border: 'rgba(129, 178, 154, 0.15)' },
    amber: { text: '#e6a54a', bg: 'rgba(230, 165, 74, 0.08)', border: 'rgba(230, 165, 74, 0.15)' },
    coral: { text: '#e07a5f', bg: 'rgba(224, 122, 95, 0.08)', border: 'rgba(224, 122, 95, 0.15)' },
  }

  const c = colorMap[color] || colorMap.coral

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card p-6 relative overflow-hidden cursor-default"
    >
      {/* Icon */}
      <div className="flex justify-between items-start mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: c.bg, border: `1px solid ${c.border}` }}
        >
          <Icon size={20} style={{ color: c.text }} />
        </div>
      </div>

      {/* Value */}
      <div className="text-3xl font-display font-bold mb-1" style={{ color: c.text }}>
        {value}
      </div>
      <div className="section-label">{label}</div>
    </motion.div>
  )
}
