import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Plus, CheckCircle2, Trash2, Clock, Tag, ChevronDown, X,
  Flame, Timer, Play, Square, BookOpen, Filter
} from 'lucide-react'
import { useSpiritualContext } from '../context/SpiritualContext'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

const CATEGORIES = [
  { id: 'petition', label: 'Pétition', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { id: 'intercession', label: 'Intercession', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { id: 'thanksgiving', label: 'Louange', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
  { id: 'confession', label: 'Confession', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { id: 'adoration', label: 'Adoration', color: 'text-gold-400 bg-gold-500/10 border-gold-500/20' },
]

const GUIDED_PRAYERS = [
  {
    title: 'Prière de repentance',
    text: 'Seigneur Jésus, je viens à toi avec un cœur contrit. Je reconnais mes péchés et mes manquements. Tu as dit dans ta Parole que si nous confessons nos péchés, tu es fidèle et juste pour nous les pardonner. Je te demande pardon pour [mes péchés]. Purifie-moi et renouvelle un esprit droit en moi. Merci pour ton amour qui ne change jamais. Amen.',
    icon: '🙏',
  },
  {
    title: 'Prière pour renouer avec Dieu',
    text: 'Père céleste, je reconnais m\'être éloigné(e) de toi. Comme le fils prodigue, je reviens à toi. Tu m\'as promis que si je m\'approchais de toi, tu t\'approcherais de moi. Restaure notre relation, ravive le feu de ta présence dans ma vie. Je veux te connaître davantage chaque jour. Amen.',
    icon: '💫',
  },
  {
    title: 'Prière du matin',
    text: 'Seigneur, merci pour ce nouveau jour que tu m\'accordes. Guide mes pas aujourd\'hui, que toutes mes pensées, mes paroles et mes actions te soient agréables. Remplis-moi de ton Saint-Esprit et que ta volonté s\'accomplisse dans ma vie aujourd\'hui. Amen.',
    icon: '🌅',
  },
  {
    title: 'Prière dans l\'épreuve',
    text: 'Père, tu vois ma situation et tu connais ma douleur. Ta Parole dit que tu es un refuge et une forteresse. Je te confie ce fardeau. Donne-moi la paix qui surpasse toute intelligence et la force de traverser cette épreuve. Je sais que tu es avec moi. Amen.',
    icon: '⚓',
  },
]

function PrayerTimer({ onSave }) {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [intervalId, setIntervalId] = useState(null)

  const start = () => {
    setRunning(true)
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    setIntervalId(id)
  }

  const stop = () => {
    setRunning(false)
    clearInterval(intervalId)
    if (seconds > 0) {
      onSave(Math.ceil(seconds / 60))
    }
    setSeconds(0)
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="card text-center space-y-4">
      <p className="text-sm text-slate-500 font-medium">Minuteur de prière</p>
      <div className="text-4xl font-mono font-bold text-slate-100 tracking-widest">
        {fmt(seconds)}
      </div>
      <div className="flex gap-3 justify-center">
        {!running ? (
          <button onClick={start} className="btn-primary flex items-center gap-2">
            <Play size={15} /> Commencer
          </button>
        ) : (
          <button onClick={stop} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl font-semibold transition-all">
            <Square size={15} /> Terminer
          </button>
        )}
      </div>
      {!running && seconds === 0 && (
        <p className="text-xs text-slate-600">Démarrez et priez — le temps sera enregistré automatiquement.</p>
      )}
    </div>
  )
}

function RequestCard({ req, onAnswer, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORIES.find(c => c.id === req.category) || CATEGORIES[0]
  const dateStr = format(parseISO(req.date + 'T00:00:00'), 'd MMM yyyy', { locale: fr })

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className={`card border transition-all duration-200 ${req.answered ? 'opacity-60' : 'hover:border-navy-500'}`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => !req.answered && onAnswer(req.id)}
          className={`mt-0.5 flex-shrink-0 transition-all duration-200 ${req.answered ? 'text-emerald-400' : 'text-slate-600 hover:text-emerald-400'}`}
        >
          <CheckCircle2 size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h4 className={`font-medium text-sm ${req.answered ? 'line-through text-slate-500' : 'text-slate-200'}`}>
              {req.title}
            </h4>
            <span className={`badge border ${cat.color}`}>{cat.label}</span>
            {req.answered && <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Exaucée ✓</span>}
          </div>
          <p className="text-xs text-slate-600">{dateStr}</p>
          {req.description && (
            <>
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs text-slate-500 hover:text-slate-300 mt-1 flex items-center gap-1 transition-colors"
              >
                {expanded ? 'Réduire' : 'Voir détails'} <ChevronDown size={10} className={expanded ? 'rotate-180' : ''} />
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="text-sm text-slate-400 mt-2 leading-relaxed overflow-hidden"
                  >
                    {req.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
        <button onClick={() => onDelete(req.id)} className="text-slate-700 hover:text-red-400 transition-colors p-1 flex-shrink-0">
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}

export default function Prayer() {
  const { prayerRequests, addPrayerRequest, markAnswered, deletePrayerRequest, markPrayed, prayerStreak } = useSpiritualContext()

  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('all') // 'all' | 'active' | 'answered'
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCat, setNewCat] = useState('petition')
  const [showGuided, setShowGuided] = useState(false)
  const [selectedGuided, setSelectedGuided] = useState(null)

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addPrayerRequest(newTitle.trim(), newDesc.trim(), newCat)
    setNewTitle('')
    setNewDesc('')
    setNewCat('petition')
    setShowAdd(false)
  }

  const filtered = prayerRequests.filter(r => {
    if (filter === 'active') return !r.answered
    if (filter === 'answered') return r.answered
    return true
  })

  const activeCount = prayerRequests.filter(r => !r.answered).length
  const answeredCount = prayerRequests.filter(r => r.answered).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Prière</h1>
          <p className="text-slate-500 text-sm mt-0.5">Parlez à Dieu — il vous écoute</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-xl">
            <Flame size={14} className="text-orange-400" />
            <span className="text-sm font-bold text-orange-400">{prayerStreak}</span>
            <span className="text-xs text-orange-500/70">jours</span>
          </div>
        </div>
      </div>

      {/* Prayer timer */}
      <PrayerTimer onSave={markPrayed} />

      {/* Guided prayers */}
      <div className="card">
        <button
          onClick={() => setShowGuided(!showGuided)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gold-400" />
            <span className="font-medium text-slate-200 text-sm">Prières guidées</span>
          </div>
          <ChevronDown size={16} className={`text-slate-500 transition-transform ${showGuided ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {showGuided && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {GUIDED_PRAYERS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedGuided(selectedGuided === i ? null : i)}
                    className="text-left p-3 bg-navy-700 hover:bg-navy-600 border border-navy-500 rounded-xl transition-all"
                  >
                    <span className="text-lg mb-1 block">{p.icon}</span>
                    <p className="text-sm font-medium text-slate-200">{p.title}</p>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {selectedGuided !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="mt-4 p-4 bg-navy-900 border border-navy-600 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-slate-200 flex items-center gap-2">
                        <span>{GUIDED_PRAYERS[selectedGuided].icon}</span>
                        {GUIDED_PRAYERS[selectedGuided].title}
                      </h4>
                      <button onClick={() => setSelectedGuided(null)} className="text-slate-600 hover:text-slate-400"><X size={14} /></button>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed italic font-serif">
                      "{GUIDED_PRAYERS[selectedGuided].text}"
                    </p>
                    <button
                      onClick={() => { markPrayed(5); setSelectedGuided(null) }}
                      className="mt-4 btn-primary text-sm w-full"
                    >
                      J'ai prié cette prière
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prayer requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Demandes de prière</h2>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm py-2">
            <Plus size={15} /> Ajouter
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'all', label: `Toutes (${prayerRequests.length})` },
            { id: 'active', label: `Actives (${activeCount})` },
            { id: 'answered', label: `Exaucées (${answeredCount})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === f.id ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'bg-navy-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="card mb-4 border-gold-500/20 bg-navy-700"
            >
              <form onSubmit={handleAdd} className="space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-slate-200 text-sm">Nouvelle demande</h3>
                  <button type="button" onClick={() => setShowAdd(false)} className="text-slate-600 hover:text-slate-400"><X size={14} /></button>
                </div>
                <input
                  type="text"
                  placeholder="Titre de la demande..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="input text-sm"
                  autoFocus
                />
                <textarea
                  placeholder="Détails (optionnel)..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="input text-sm resize-none h-20"
                />
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setNewCat(c.id)}
                      className={`badge border text-xs cursor-pointer transition-all ${newCat === c.id ? c.color : 'bg-navy-700 text-slate-500 border-navy-500'}`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary text-sm flex-1">Ajouter la demande</button>
                  <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Annuler</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="card text-center py-12">
            <Heart size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {filter === 'answered' ? 'Aucune prière exaucée pour l\'instant' : 'Ajoutez votre première demande de prière'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {filtered.map(req => (
                <RequestCard
                  key={req.id}
                  req={req}
                  onAnswer={markAnswered}
                  onDelete={deletePrayerRequest}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
