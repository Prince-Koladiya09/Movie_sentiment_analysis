import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, BarChart3, Zap, GitCompare, AlertTriangle, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Home', icon: Brain },
  { to: '/data', label: 'Data Explorer', icon: BarChart3 },
  { to: '/predictor', label: 'Predictor', icon: Zap },
  { to: '/comparison', label: 'Models', icon: GitCompare },
  { to: '/errors', label: 'Errors', icon: AlertTriangle },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-warm-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-coral to-accent-amber flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Brain size={17} className="text-white" />
            </div>
            <span className="font-display text-base font-bold text-warm-800 hidden sm:block tracking-tight">
              Sentiment<span className="text-accent-coral">AI</span>
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Status indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-sage/10 border border-accent-sage/20">
            <div className="w-2 h-2 rounded-full bg-accent-sage animate-pulse"></div>
            <span className="font-body text-xs font-medium text-accent-sage">API Live</span>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-warm-500 hover:text-warm-800 transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-warm-200 px-4 py-3 flex flex-col gap-1 bg-white"
        >
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </motion.div>
      )}
    </motion.nav>
  )
}
