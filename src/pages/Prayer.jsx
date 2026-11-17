import { useState, useEffect, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, CheckCircle2, ChevronDown, X, Play, Square } from 'lucide-react'
import { useSpiritualContext } from '../context/SpiritualContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import ConfirmButton from '../components/ConfirmButton'
import { formatDay } from '../utils/dates'
import Icon3D from '../components/Icon3D'
import PageHeader from '../components/PageHeader'
import Tabs from '../components/Tabs'
import { GUIDED_PRAYERS } from '../data/prayers'

const Chapelet = lazy(() => import('./Chapelet'))

const CATEGORIES = [
  { id: 'petition', label: 'Demande', icon: 'hands' },
  { id: 'intercession', label: 'Pour quelqu’un', icon: 'heart' },
  { id: 'thanksgiving', label: 'Merci', icon: 'sparkles' },
  { id: 'confession', label: 'Pardon', icon: 'droplet' },
  { id: 'adoration', label: 'Louange', icon: 'star' },
]

// ─── Minuteur ─────────────────────────────────────────────────────────────────
// Basé sur l'heure de départ (sauvegardée) : reste juste si l'écran se verrouille
// ou si l'on change de page.
function PrayerTimer({ goalMinutes, onSave }) {
  const [startedAt, setStartedAt] = useLocalStorage('fj_prayerTimer', null)
  const [now, setNow] = useState(Date.now())
  const [lastSaved, setLastSaved] = useState(null)
  const running = typeof startedAt === 'number'

  useEffect(() => {
    if (!running) return
    const tick = () => setNow(Date.now())
    tick()
    const id = setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick) }
  }, [running])

  const seconds = running ? Math.min(Math.max(0, Math.floor((now - startedAt) / 1000)), 3 * 3600) : 0
  const pct = Math.min(100, Math.round((seconds / (goalMinutes * 60)) * 100))
  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const start = () => { setLastSaved(null); setNow(Date.now()); setStartedAt(Date.now()) }
  const stop = () => {
    const minutes = seconds >= 30 ? Math.max(1, Math.round(seconds / 60)) : 0
    onSave(minutes)
    setLastSaved(minutes)
    setStartedAt(null)
  }

  return (
    <div className="rounded-3xl p-6 bg-white/[0.04] border border-white/10 text-center">
      <div className="relative w-36 h-36 mx-auto">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 44} strokeDashoffset={2 * Math.PI * 44 * (1 - pct / 100)}
            style={{ transition: 'stroke-dashoffset 1s linear' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon3D name="hands" size={36} />
          <p className="font-mono text-xl font-bold text-slate-100 mt-1">{fmt(seconds)}</p>
        </div>
      </div>
      <p className="text-sm text-slate-400 mt-3">
        {running ? (pct >= 100 ? 'Objectif atteint ✓ — continuez si vous le souhaitez' : `Objectif du jour : ${goalMinutes} min`)
          : lastSaved !== null ? (lastSaved > 0 ? `${lastSaved} min enregistrée${lastSaved > 1 ? 's' : ''}. Merci !` : 'Prière enregistrée. Merci !')
          : 'Le temps continue même si vous verrouillez votre téléphone.'}
      </p>
      <div className="flex gap-3 justify-center mt-4">
        {!running ? (
          <button onClick={start} className="btn-primary min-h-[52px] px-8 flex items-center gap-2"><Play size={16} /> Commencer à prier</button>
        ) : (
          <>
            <button onClick={() => setStartedAt(null)} className="btn-secondary min-h-[52px]">Annuler</button>
            <button onClick={stop} className="btn-primary min-h-[52px] px-6 flex items-center gap-2"><Square size={15} /> Amen</button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Onglet « Prier » ─────────────────────────────────────────────────────────
function Prier() {
  const { logActivity, profile } = useSpiritualContext()
  const [open, setOpen] = useState(null)

  return (
    <div className="space-y-5">
      <PrayerTimer goalMinutes={profile.dailyMinutes} onSave={(m) => logActivity('priere', m)} />

      <div>
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Prières pour vous guider</h2>
        <div className="space-y-2">
          {GUIDED_PRAYERS.map((p, i) => (
            <div key={p.title} className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
                className="w-full flex items-center gap-3 p-4 text-left min-h-[60px]">
                <Icon3D name={p.icon} size={30} />
                <span className="flex-1 font-medium text-slate-200">{p.title}</span>
                <ChevronDown size={18} className={`text-slate-500 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4">
                      <p className="font-serif italic text-[1.0625rem] leading-relaxed text-slate-200">{p.text}</p>
                      <button onClick={() => { logActivity('priere', 2); setOpen(null) }} className="btn-primary w-full mt-4 min-h-[48px]">
                        J'ai prié cette prière
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Onglet « Intentions » ────────────────────────────────────────────────────
function RequestCard({ req, onAnswer, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const cat = CATEGORIES.find(c => c.id === req.category) || CATEGORIES[0]
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className={`rounded-2xl p-4 bg-white/[0.03] border border-white/5 ${req.answered ? 'opacity-70' : ''}`}>
      <div className="flex items-start gap-3">
        <Icon3D name={req.answered ? 'sparkles' : cat.icon} size={30} />
        <div className="flex-1 min-w-0">
          <p className={`font-medium ${req.answered ? 'text-slate-400' : 'text-slate-100'}`}>{req.title}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {cat.label}{formatDay(req.date) && ` · ${formatDay(req.date)}`}
            {req.answered && formatDay(req.answeredDate) && <span className="text-emerald-400"> · exaucée le {formatDay(req.answeredDate, 'd MMM')}</span>}
          </p>
          {req.description && (
            <>
              <button onClick={() => setExpanded(!expanded)} className="text-xs text-slate-400 mt-1 min-h-[32px]">
                {expanded ? 'Masquer' : 'Voir les détails'}
              </button>
              {expanded && <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{req.description}</p>}
            </>
          )}
          {!req.answered && (
            <button onClick={() => onAnswer(req.id)} className="mt-2 text-sm text-emerald-300 flex items-center gap-1.5 min-h-[36px]">
              <CheckCircle2 size={16} /> Dieu a répondu
            </button>
          )}
        </div>
        <ConfirmButton onConfirm={() => onDelete(req.id)} size={15} />
      </div>
    </motion.div>
  )
}

function Intentions() {
  const { prayerRequests, addPrayerRequest, markAnswered, deletePrayerRequest } = useSpiritualContext()
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('active')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [cat, setCat] = useState('petition')

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    addPrayerRequest(title.trim().slice(0, 200), desc.trim().slice(0, 2000), cat)
    setTitle(''); setDesc(''); setCat('petition'); setShowAdd(false)
  }
  const active = prayerRequests.filter(r => !r.answered)
  const answered = prayerRequests.filter(r => r.answered)
  const list = filter === 'active' ? active : answered

  return (
    <div className="space-y-4">
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)} className="btn-primary w-full min-h-[52px] flex items-center justify-center gap-2">
          <Plus size={18} /> Confier une intention
        </button>
      ) : (
        <motion.form onSubmit={submit} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 bg-white/[0.04] border border-gold-400/20 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-100">Nouvelle intention</h3>
            <button type="button" onClick={() => setShowAdd(false)} aria-label="Fermer" className="w-10 h-10 -m-2 flex items-center justify-center text-slate-500"><X size={18} /></button>
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} maxLength={200} autoFocus
            placeholder="Pour qui, pour quoi ?" className="input text-[1rem]" />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} maxLength={2000}
            placeholder="Détails (facultatif)" className="input text-[1rem] h-24 resize-none" />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c.id} type="button" onClick={() => setCat(c.id)}
                className={`flex items-center gap-1.5 px-3 min-h-[40px] rounded-xl border text-sm ${
                  cat === c.id ? 'bg-gold-500/15 border-gold-400/40 text-gold-200' : 'bg-white/[0.03] border-white/5 text-slate-400'}`}>
                <Icon3D name={c.icon} size={18} muted={cat !== c.id} /> {c.label}
              </button>
            ))}
          </div>
          <button type="submit" disabled={!title.trim()} className="btn-primary w-full min-h-[48px] disabled:opacity-40">Confier à Dieu</button>
        </motion.form>
      )}

      <Tabs value={filter} onChange={setFilter} tabs={[
        { id: 'active', label: `En prière (${active.length})` },
        { id: 'answered', label: `Exaucées (${answered.length})` },
      ]} />

      {list.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <Icon3D name={filter === 'answered' ? 'sparkles' : 'heart'} size={56} className="mx-auto" muted />
          <p className="text-slate-400">
            {filter === 'answered' ? 'Les prières exaucées apparaîtront ici. Gardez-en la mémoire : elles nourrissent la confiance.' : 'Confiez à Dieu une personne ou une situation.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {list.map(r => <RequestCard key={r.id} req={r} onAnswer={markAnswered} onDelete={deletePrayerRequest} />)}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Prayer() {
  const [params, setParams] = useSearchParams()
  const tab = ['prier', 'chapelet', 'intentions'].includes(params.get('onglet')) ? params.get('onglet') : 'prier'
  const setTab = (t) => setParams({ onglet: t }, { replace: true })

  return (
    <div>
      <PageHeader icon="hands" title="Prière" subtitle="Parlez à Dieu — il vous écoute" />
      <Tabs className="mb-5" value={tab} onChange={setTab} tabs={[
        { id: 'prier', label: 'Prier', icon: 'candle' },
        { id: 'chapelet', label: 'Chapelet', icon: 'beads' },
        { id: 'intentions', label: 'Intentions', icon: 'heart' },
      ]} />
      {tab === 'prier' && <Prier />}
      {tab === 'chapelet' && (
        <Suspense fallback={<div className="py-16 text-center text-slate-500">Chargement…</div>}>
          <Chapelet />
        </Suspense>
      )}
      {tab === 'intentions' && <Intentions />}
    </div>
  )
}
