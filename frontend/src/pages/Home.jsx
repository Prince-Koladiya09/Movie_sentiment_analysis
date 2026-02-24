import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, Zap, Database, Target, ArrowRight, ChevronRight } from 'lucide-react'
import StatCard from '../components/StatCard'

const PIPELINE_STEPS = [
  { label: 'Raw Text', icon: '📝', desc: 'IMDB movie reviews' },
  { label: 'Clean', icon: '🧹', desc: 'HTML removal + lemmatize' },
  { label: 'Embed', icon: '🔢', desc: 'TF-IDF / Word2Vec / BERT' },
  { label: 'Predict', icon: '🎯', desc: 'Classify sentiment' },
]

const TECH_STACK = [
  { name: 'TensorFlow', color: '#FF6F00', icon: '🧠' },
  { name: 'DistilBERT', color: '#e6a54a', icon: '🤗' },
  { name: 'Scikit-learn', color: '#e07a5f', icon: '⚙️' },
  { name: 'FastAPI', color: '#81b29a', icon: '⚡' },
  { name: 'React', color: '#5b8fb9', icon: '⚛️' },
  { name: 'LIME', color: '#8b5cf6', icon: '🔍' },
  { name: 'NLTK', color: '#81b29a', icon: '📚' },
  { name: 'Recharts', color: '#5b8fb9', icon: '📊' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-24 relative"
      >
        {/* Soft gradient blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #e07a5f, transparent 70%)' }} />
        <div className="absolute top-20 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #81b29a, transparent 70%)' }} />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 text-xs font-display font-semibold tracking-wide"
          style={{ background: 'rgba(224, 122, 95, 0.1)', border: '1px solid rgba(224, 122, 95, 0.2)', color: '#e07a5f' }}
        >
          <span className="w-2 h-2 rounded-full bg-accent-sage animate-pulse"></span>
          NLP Research · IMDB Dataset · 4 Models
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-7xl font-display font-extrabold leading-tight mb-6 text-warm-800"
        >
          Movie
          <br />
          <span className="bg-gradient-to-r from-accent-coral to-accent-amber bg-clip-text text-transparent">
            Sentiment
          </span>
          <br />
          Analysis
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-warm-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          An end-to-end NLP pipeline exploring the evolution from Bag-of-Words to BERT —
          classifying IMDB movie reviews as positive or negative across 4 distinct architectures.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <button
            onClick={() => navigate('/predictor')}
            className="btn-primary flex items-center gap-2 text-base px-8 py-3.5"
          >
            Try Live Predictor <Zap size={16} />
          </button>
          <button
            onClick={() => navigate('/comparison')}
            className="btn-secondary flex items-center gap-2 text-base px-8 py-3.5"
          >
            Compare Models <ArrowRight size={16} />
          </button>
        </motion.div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
        <StatCard value="93.2%" label="Best Accuracy" icon={Target} color="coral" delay={0} />
        <StatCard value="0.931" label="Best F1 Score" icon={Brain} color="cyan" delay={0.1} />
        <StatCard value="4" label="Models Trained" icon={Zap} color="green" delay={0.2} />
        <StatCard value="50K" label="Dataset Reviews" icon={Database} color="amber" delay={0.3} />
      </div>

      {/* Pipeline */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-24"
      >
        <motion.h2 variants={itemVariants} className="text-2xl font-display font-bold text-warm-800 mb-2">
          Pipeline Flow
        </motion.h2>
        <motion.p variants={itemVariants} className="text-warm-500 text-sm mb-8">
          From raw text to sentiment prediction
        </motion.p>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          {PIPELINE_STEPS.map((step, i) => (
            <motion.div key={i} variants={itemVariants} className="flex items-center gap-3 flex-1">
              <div className="flex-1 card p-6 text-center group hover:scale-[1.03] transition-transform duration-200">
                <div className="text-3xl mb-3 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  {step.icon}
                </div>
                <div className="font-display text-sm font-bold text-warm-800 mb-1">{step.label}</div>
                <div className="text-xs text-warm-500">{step.desc}</div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <ChevronRight size={20} className="text-accent-coral opacity-40 flex-shrink-0 hidden sm:block" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tech Stack */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-12"
      >
        <motion.h2 variants={itemVariants} className="text-2xl font-display font-bold text-warm-800 mb-2">
          Tech Stack
        </motion.h2>
        <motion.p variants={itemVariants} className="text-warm-500 text-sm mb-8">
          Powered by industry-leading tools
        </motion.p>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {TECH_STACK.map((tech, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.08, y: -4 }}
              className="card p-3.5 text-center cursor-default"
            >
              <div className="text-2xl mb-1.5">{tech.icon}</div>
              <div className="text-xs font-display font-semibold" style={{ color: tech.color }}>{tech.name}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
