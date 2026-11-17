import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw, Check } from 'lucide-react'
import { format, parseISO, differenceInCalendarDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useSpiritualContext } from '../context/SpiritualContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Icon3D from '../components/Icon3D'
import Tabs from '../components/Tabs'
import {
  MYSTERIES, MYSTERY_ORDER, getTodayMystery, buildRosarySteps, buildMercySteps,
  LITANIES_LORETTE, LITANIES_ORAISON, NEUVAINE, nextDivineMercySunday,
} from '../data/prayers'

const SECTION_LABELS = { ouverture: 'Ouverture', mystere: 'Mystère', dizaine: 'Dizaine', cloture: 'Clôture' }

// Durée réelle, plafonnée si le chapelet a été repris bien plus tard
const minutesSince = (startedAt, estimate) => {
  const m = Math.round((Date.now() - (startedAt || Date.now())) / 60000)
  return m >= 1 && m <= estimate * 3 ? m : estimate
}

// ─── Grains ───────────────────────────────────────────────────────────────────
function Beads({ count, total, color }) {
  return (
    <div className="flex justify-center gap-1.5 flex-wrap" aria-label={`Grain ${count} sur ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
          i < count ? color : 'bg-white/10'} ${i === count - 1 ? 'scale-125 ring-2 ring-white/20' : ''}`} />
      ))}
    </div>
  )
}

// ─── Lecteur d'étapes commun (Rosaire et Miséricorde) ─────────────────────────
function StepPlayer({ steps, idx, setIdx, onFinish, onStop, beadColor, accent }) {
  const step = steps[idx]
  const pct = Math.round((idx / (steps.length - 1)) * 100)
  const isLast = idx === steps.length - 1
  const m = step.mystery
  const set = step.setKey ? MYSTERIES[step.setKey] : null

  return (
    <div className="space-y-4">
      {/* Progression */}
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>{step.mysteryNumber ? `Mystère ${step.mysteryNumber}/${step.totalMysteries}` : step.decade ? `Dizaine ${step.decade}/5` : SECTION_LABELS[step.section]}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${beadColor} transition-all duration-300`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Rappel du mystère en cours */}
      {m && step.kind !== 'annonce' && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Icon3D name={set.icon} size={20} />
          <span className="truncate">{m.title}</span>
          <span className="text-slate-600">·</span>
          <span className="truncate text-slate-500">{m.fruit}</span>
        </div>
      )}

      {step.bead && <Beads count={step.bead.count} total={step.bead.total} color={beadColor} />}

      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.18 }}
          className={`rounded-3xl p-5 border bg-gradient-to-br to-transparent ${set ? `${set.bg} ${set.ring}` : 'from-white/[0.05] border-white/10'}`}>
          <div className="flex items-start gap-3 mb-3">
            {(step.icon || (step.kind === 'annonce' && set)) && <Icon3D name={step.icon || set.icon} size={36} />}
            <div className="min-w-0">
              <p className={`text-xs font-semibold uppercase tracking-wider ${accent}`}>{SECTION_LABELS[step.section]}</p>
              <h3 className="text-lg font-semibold text-slate-50 leading-snug">{step.title}</h3>
            </div>
          </div>

          {step.kind === 'annonce' ? (
            <div className="space-y-3">
              <p className="text-slate-200 leading-relaxed">{m.meditation}</p>
              <p className="text-xs text-slate-500">{m.ref}</p>
              <div className="grid gap-2">
                <p className="text-sm"><span className="text-slate-500">Fruit du mystère : </span><span className="text-slate-100 font-medium">{m.fruit}</span></p>
                <p className="text-sm"><span className="text-slate-500">Intention : </span><span className="text-slate-200">{m.intention}</span></p>
              </div>
            </div>
          ) : step.kind === 'litanies' ? (
            <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
              {LITANIES_LORETTE.map(([v, r], i) => (
                <p key={i} className="text-[15px] leading-snug">
                  <span className="text-slate-200">{v}</span> <span className="text-gold-300 italic">{r}</span>
                </p>
              ))}
              <p className="text-[15px] text-slate-300 italic pt-3">{LITANIES_ORAISON}</p>
            </div>
          ) : (
            <>
              {step.note && <p className="text-sm text-slate-500 mb-2">{step.note}</p>}
              <p className={`font-serif text-[17px] leading-[1.7] whitespace-pre-line ${step.kind === 'accompagnement' ? 'italic text-gold-100' : 'text-slate-100'}`}>
                {step.prayer}
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 pt-1">
        <button onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}
          aria-label="Prière précédente"
          className="btn-secondary min-h-[56px] min-w-[56px] px-4 disabled:opacity-30">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => (isLast ? onFinish() : setIdx(idx + 1))}
          className="btn-primary flex-1 min-h-[56px] text-[16px] flex items-center justify-center gap-2">
          {isLast ? <><Check size={18} /> Amen — terminer</> : <>Suivant <ChevronRight size={18} /></>}
        </button>
      </div>
      <button onClick={onStop} className="w-full text-sm text-slate-500 hover:text-slate-300 min-h-[40px] flex items-center justify-center gap-1.5">
        <RotateCcw size={14} /> Arrêter et recommencer plus tard
      </button>
    </div>
  )
}

function Finished({ icon, title, text, onRestart }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl p-8 text-center bg-white/[0.04] border border-white/10 space-y-4">
      <Icon3D name={icon} size={80} className="mx-auto" />
      <h3 className="text-xl font-semibold text-slate-50">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{text}</p>
      <button onClick={onRestart} className="btn-secondary min-h-[48px] inline-flex items-center gap-2"><RotateCcw size={15} /> Prier à nouveau</button>
    </motion.div>
  )
}

// ─── Rosaire ──────────────────────────────────────────────────────────────────
const ROSARY_DEFAULT = { status: 'setup', mode: 'chapelet', setKey: null, clausules: true, litanies: true, idx: 0, startedAt: null }

function Rosaire() {
  const { logActivity } = useSpiritualContext()
  const [st, setSt] = useLocalStorage('fj_rosaryState', ROSARY_DEFAULT)
  const s = { ...ROSARY_DEFAULT, ...st }
  const suggested = getTodayMystery()
  const setKey = MYSTERIES[s.setKey] ? s.setKey : suggested
  const steps = useMemo(
    () => buildRosarySteps(s.mode === 'rosaire' ? MYSTERY_ORDER : [setKey], { clausules: s.clausules, litanies: s.litanies }),
    [s.mode, setKey, s.clausules, s.litanies],
  )

  const update = (patch) => setSt(prev => ({ ...ROSARY_DEFAULT, ...prev, ...patch }))
  const start = () => update({ status: 'praying', idx: 0, startedAt: Date.now(), setKey })
  const stop = () => update({ status: 'setup', idx: 0, startedAt: null })
  const finish = () => {
    const full = s.mode === 'rosaire'
    logActivity(full ? 'rosaire' : 'chapelet', minutesSince(s.startedAt, full ? 75 : 20))
    update({ status: 'done' })
  }

  if (s.status === 'done') {
    return <Finished icon="rose" title={s.mode === 'rosaire' ? 'Rosaire terminé' : 'Chapelet terminé'}
      text="Votre prière a été enregistrée. Que Marie vous garde dans la paix de son Fils." onRestart={stop} />
  }

  if (s.status === 'praying') {
    return <StepPlayer steps={steps} idx={Math.min(s.idx, steps.length - 1)} setIdx={(i) => update({ idx: i })}
      onFinish={finish} onStop={stop} beadColor="bg-gold-400" accent="text-gold-300" />
  }

  // Préparation
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2">
        {[
          { id: 'chapelet', icon: 'beads', label: 'Chapelet', sub: '5 mystères · ~20 min' },
          { id: 'rosaire', icon: 'rose', label: 'Rosaire complet', sub: '20 mystères · ~1 h 15' },
        ].map(o => (
          <button key={o.id} onClick={() => update({ mode: o.id })}
            className={`p-4 rounded-2xl border text-left min-h-[100px] transition-all ${
              s.mode === o.id ? 'bg-gold-500/10 border-gold-400/40' : 'bg-white/[0.03] border-white/5'}`}>
            <Icon3D name={o.icon} size={34} muted={s.mode !== o.id} />
            <p className="font-semibold text-slate-100 mt-2">{o.label}</p>
            <p className="text-xs text-slate-500">{o.sub}</p>
          </button>
        ))}
      </div>

      {s.mode === 'chapelet' && (
        <div>
          <p className="text-sm text-slate-400 mb-2">Mystères à méditer</p>
          <div className="grid grid-cols-2 gap-2">
            {MYSTERY_ORDER.map(k => {
              const m = MYSTERIES[k]
              const active = setKey === k
              return (
                <button key={k} onClick={() => update({ setKey: k })}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 min-h-[64px] transition-all ${
                    active ? `bg-gradient-to-br ${m.bg} to-transparent ${m.ring}` : 'bg-white/[0.03] border-white/5'}`}>
                  <Icon3D name={m.icon} size={30} muted={!active} />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold ${active ? m.accent : 'text-slate-300'}`}>{m.short}</p>
                    <p className="text-[11px] text-slate-500">{m.days}{k === suggested ? ' · aujourd’hui' : ''}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {[
          ['clausules', 'Petites phrases dans chaque Je vous salue', 'ex. « … Jésus, qui naît à Bethléem »'],
          ['litanies', 'Litanies de la Vierge Marie', 'à la fin, avant la prière à saint Michel'],
        ].map(([key, label, hint]) => (
          <label key={key} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer min-h-[56px]">
            <input type="checkbox" checked={!!s[key]} onChange={e => update({ [key]: e.target.checked })}
              className="w-5 h-5 accent-amber-400" />
            <span className="flex-1">
              <span className="block text-sm text-slate-200">{label}</span>
              <span className="block text-xs text-slate-500">{hint}</span>
            </span>
          </label>
        ))}
      </div>

      <button onClick={start} className="btn-primary w-full min-h-[56px] text-[16px]">
        Commencer {s.mode === 'rosaire' ? 'le Rosaire' : `— ${MYSTERIES[setKey].label.toLowerCase()}`}
      </button>
    </div>
  )
}

// ─── Divine Miséricorde ───────────────────────────────────────────────────────
const MERCY_DEFAULT = { status: 'setup', idx: 0, startedAt: null }

function DivineMercy() {
  const { logActivity } = useSpiritualContext()
  const [st, setSt] = useLocalStorage('fj_mercyState', MERCY_DEFAULT)
  const s = { ...MERCY_DEFAULT, ...st }
  const steps = useMemo(() => buildMercySteps(), [])
  const update = (patch) => setSt(prev => ({ ...MERCY_DEFAULT, ...prev, ...patch }))

  if (s.status === 'done') {
    return <Finished icon="blood" title="Chapelet de la Miséricorde terminé"
      text="Votre prière a été enregistrée. « Jésus, j'ai confiance en toi. »" onRestart={() => update(MERCY_DEFAULT)} />
  }
  if (s.status === 'praying') {
    return <StepPlayer steps={steps} idx={Math.min(s.idx, steps.length - 1)} setIdx={(i) => update({ idx: i })}
      onFinish={() => { logActivity('misericorde', minutesSince(s.startedAt, 10)); update({ status: 'done' }) }}
      onStop={() => update(MERCY_DEFAULT)} beadColor="bg-rose-400" accent="text-rose-300" />
  }
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-5 bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-400/20 flex gap-4">
        <Icon3D name="blood" size={48} />
        <p className="text-sm text-slate-300 leading-relaxed">
          Chapelet transmis par Jésus à sainte Faustine. On le prie de préférence à <span className="text-rose-200 font-medium">15 h</span>,
          l'Heure de la Miséricorde. Environ 10 minutes, sur un chapelet ordinaire.
        </p>
      </div>
      <button onClick={() => update({ status: 'praying', idx: 0, startedAt: Date.now() })} className="btn-primary w-full min-h-[56px] text-[16px]">
        Commencer le chapelet
      </button>
    </div>
  )
}

// ─── Neuvaine à la Divine Miséricorde ─────────────────────────────────────────
function Neuvaine({ onPrayChaplet }) {
  const { logActivity } = useSpiritualContext()
  const [nv, setNv] = useLocalStorage('fj_neuvaine', null)
  const done = nv?.done || {}
  const doneCount = Object.keys(done).length
  const currentDay = Math.min(9, doneCount + 1)
  const todayKey = format(new Date(), 'yyyy-MM-dd')
  const prayedToday = Object.values(done).includes(todayKey)
  const dates = nextDivineMercySunday()
  const day = NEUVAINE[currentDay - 1]

  const markDay = () => {
    setNv(prev => ({ startedOn: prev?.startedOn || todayKey, done: { ...(prev?.done || {}), [currentDay]: todayKey } }))
    logActivity('neuvaine')
  }

  return (
    <div className="space-y-4">
      {dates && (
        <p className="text-sm text-slate-400 leading-relaxed">
          Traditionnellement priée du <span className="text-slate-200">Vendredi saint ({format(dates.goodFriday, 'd MMMM', { locale: fr })})</span> au
          {' '}<span className="text-slate-200">dimanche de la Miséricorde ({format(dates.sunday, 'd MMMM yyyy', { locale: fr })})</span> — mais vous pouvez la commencer quand vous voulez.
        </p>
      )}

      {/* 9 jours */}
      <div className="flex justify-between">
        {NEUVAINE.map((_, i) => {
          const n = i + 1
          return (
            <span key={n} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
              done[n] ? 'bg-rose-400 text-navy-950' : n === currentDay && doneCount < 9 ? 'border-2 border-rose-300/60 text-rose-200' : 'bg-white/5 text-slate-500'}`}>
              {done[n] ? <Check size={14} strokeWidth={3} /> : n}
            </span>
          )
        })}
      </div>

      {doneCount >= 9 ? (
        <Finished icon="sparkles" title="Neuvaine achevée"
          text="Vous avez prié les neuf jours. Que la miséricorde du Seigneur vous enveloppe."
          onRestart={() => setNv(null)} />
      ) : (
        <div className="rounded-3xl p-5 bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-400/20 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-300">Jour {currentDay} sur 9</p>
          <h3 className="text-lg font-semibold text-slate-50 leading-snug">Pour {day.intention.charAt(0).toLowerCase() + day.intention.slice(1)}</h3>
          <p className="font-serif italic text-[17px] leading-relaxed text-slate-200">{day.priere}</p>
          <p className="text-sm text-slate-400">Puis priez le chapelet de la Divine Miséricorde à cette intention.</p>
          <div className="flex flex-col gap-2 pt-1">
            <button onClick={onPrayChaplet} className="btn-secondary min-h-[48px]">Prier le chapelet</button>
            <button onClick={markDay} disabled={prayedToday} className="btn-primary min-h-[48px] disabled:opacity-50">
              {prayedToday ? 'Jour déjà prié aujourd’hui ✓ — à demain' : `J'ai prié le jour ${currentDay}`}
            </button>
          </div>
          {nv?.startedOn && (
            <p className="text-xs text-slate-500">Commencée le {format(parseISO(nv.startedOn), 'd MMMM', { locale: fr })}
              {differenceInCalendarDays(new Date(), parseISO(nv.startedOn)) > doneCount ? ' · un jour manqué ? Reprenez simplement là où vous en êtes.' : ''}</p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Onglet Chapelet ──────────────────────────────────────────────────────────
export default function Chapelet() {
  const [params, setParams] = useSearchParams()
  const tab = ['rosaire', 'misericorde', 'neuvaine'].includes(params.get('chapelet')) ? params.get('chapelet') : 'rosaire'
  const setTab = (t) => {
    const next = new URLSearchParams(params)
    next.set('chapelet', t)
    setParams(next, { replace: true })
  }

  return (
    <div className="space-y-5">
      <Tabs value={tab} onChange={setTab} tabs={[
        { id: 'rosaire', label: 'Rosaire', icon: 'rose' },
        { id: 'misericorde', label: 'Miséricorde', icon: 'blood' },
        { id: 'neuvaine', label: 'Neuvaine', icon: 'calendar' },
      ]} />
      {tab === 'rosaire' && <Rosaire />}
      {tab === 'misericorde' && <DivineMercy />}
      {tab === 'neuvaine' && <Neuvaine onPrayChaplet={() => setTab('misericorde')} />}
    </div>
  )
}
