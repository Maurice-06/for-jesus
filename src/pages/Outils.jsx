import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, ChevronRight, ChevronDown, CheckCircle2, Circle, Play, RotateCcw, Bookmark, Search,
} from 'lucide-react'
import { READING_PLANS, expectedByDay, chaptersPerDay } from '../data/readingPlans'
import { useSpiritualContext } from '../context/SpiritualContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { format, parseISO, differenceInCalendarDays } from 'date-fns'
import ConfirmButton from '../components/ConfirmButton'
import { formatDay } from '../utils/dates'
import Icon3D from '../components/Icon3D'
import PageHeader from '../components/PageHeader'
import { exportBackup, importBackup, requestPersistentStorage } from '../utils/backup'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35 } }),
}

// ─── Plans de lecture ──────────────────────────────────────────────────────────
function ReadingPlans() {
  const { readingProgress } = useSpiritualContext()
  const [activePlanId, setActivePlanId] = useLocalStorage('fj_activePlan', null)
  const [planStartDate, setPlanStartDate] = useLocalStorage('fj_planStart', null)
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  const activePlan = READING_PLANS.find(p => p.id === activePlanId)

  const startPlan = (planId) => {
    setActivePlanId(planId)
    setPlanStartDate(format(new Date(), 'yyyy-MM-dd'))
  }

  const stopPlan = () => {
    setActivePlanId(null)
    setPlanStartDate(null)
  }

  const getPlanProgress = (plan) => {
    const done = plan.chapters.filter(c => readingProgress[c.key]).length
    return { done, total: plan.chapters.length, pct: Math.round((done / plan.chapters.length) * 100) }
  }

  // Lecture du jour : les prochains chapitres non lus du plan, dans l'ordre.
  // Un jour manqué ne fait rien « sauter » : on reprend simplement là où l'on s'est arrêté.
  const planStatus = (() => {
    if (!activePlan || !planStartDate) return null
    const dayIndex = Math.max(0, differenceInCalendarDays(new Date(), parseISO(planStartDate)))
    const { done, total } = getPlanProgress(activePlan)
    // Retard = ce qui était prévu jusqu'à hier (la lecture du jour n'est pas encore « en retard »)
    const target = dayIndex > 0 ? expectedByDay(activePlan, dayIndex - 1) : 0
    const quota = Math.ceil(activePlan.chapters.length / activePlan.days)
    const next = activePlan.chapters.filter(c => !readingProgress[c.key]).slice(0, quota)
    // Chapitres prévus aujourd'hui déjà lus aujourd'hui → on les montre cochés
    const readToday = activePlan.chapters.filter(c => readingProgress[c.key] === format(new Date(), 'yyyy-MM-dd'))
    return { dayIndex, done, total, target, behind: Math.max(0, target - done), next, readToday, finished: done >= total }
  })()
  const todaysReading = planStatus ? [...planStatus.readToday, ...planStatus.next].slice(0, Math.max(planStatus.readToday.length, Math.ceil(activePlan.chapters.length / activePlan.days))) : []

  return (
    <div className="space-y-4">
      {/* Today's reading */}
      {activePlan && planStatus && (
        <div className={`card border ${activePlan.color}`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80 flex items-center gap-1.5">
              <Target size={12} /> Lecture du jour
            </p>
            <span className={`badge border text-xs ${activePlan.color}`}>{activePlan.icon} {activePlan.name}</span>
          </div>
          {planStatus.finished ? (
            <p className="text-sm text-emerald-400 py-2">🎉 Plan terminé ! Gloire à Dieu pour votre persévérance.</p>
          ) : (
            <p className="text-xs text-slate-500 mb-3">
              Jour {planStatus.dayIndex + 1} / {activePlan.days} ·{' '}
              {planStatus.behind === 0
                ? <span className="text-emerald-400">à jour ✓</span>
                : <span>{planStatus.behind} chapitre{planStatus.behind > 1 ? 's' : ''} de retard — pas d'inquiétude, avancez à votre rythme.</span>}
            </p>
          )}
          <div className="space-y-2">
            {todaysReading.map(ch => {
              const done = readingProgress[ch.key]
              return (
                <div key={ch.key} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  done ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-navy-700 border-navy-600'
                }`}>
                  {done
                    ? <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
                    : <Circle size={18} className="text-slate-600 flex-shrink-0" />
                  }
                  <span className={`flex-1 text-sm font-medium ${done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                    {ch.bookName} {ch.chapter}
                  </span>
                  {!done && (
                    <button
                      onClick={() => navigate(`/bible?livre=${ch.bookId}&ch=${ch.chapter}`)}
                      className="text-xs text-gold-500 hover:text-gold-400 flex items-center gap-1 min-h-[40px] px-2"
                    >
                      Lire <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
          {/* Progress */}
          <div className="mt-3">
            {(() => { const p = getPlanProgress(activePlan); return (
              <>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>{p.done}/{p.total} chapitres</span>
                  <span>{p.pct}%</span>
                </div>
                <div className="h-1.5 bg-navy-900 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gold-400 transition-all duration-500" style={{ width: `${p.pct}%` }} />
                </div>
              </>
            )})()}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <ConfirmButton onConfirm={stopPlan} label="Arrêter ce plan" size={13} />
            <span>Arrêter ce plan (vos chapitres lus restent comptés)</span>
          </div>
        </div>
      )}

      {/* Plan list */}
      <p className="text-sm text-slate-500 font-medium">Choisir un plan :</p>
      <div className="space-y-2">
        {READING_PLANS.map((plan, i) => {
          const prog = getPlanProgress(plan)
          const isActive = activePlanId === plan.id
          return (
            <motion.div key={plan.id} variants={fadeUp} custom={i}
              className={`card border cursor-pointer transition-all ${isActive ? plan.color : 'border-navy-600 hover:border-navy-500'}`}
            >
              <div className="flex items-start gap-3" onClick={() => setExpanded(expanded === plan.id ? null : plan.id)}>
                <span className="text-2xl flex-shrink-0">{plan.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-200 text-sm">{plan.name}</h3>
                    {isActive && <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[0.625rem]">Actif</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{plan.days} jours</p>
                  {prog.done > 0 && (
                    <div className="mt-2 h-1 bg-navy-900 rounded-full overflow-hidden w-32">
                      <div className="h-full rounded-full bg-gold-400" style={{ width: `${prog.pct}%` }} />
                    </div>
                  )}
                </div>
                <ChevronDown size={15} className={`text-slate-600 flex-shrink-0 transition-transform ${expanded === plan.id ? 'rotate-180' : ''}`} />
              </div>
              <AnimatePresence>
                {expanded === plan.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <p className="text-sm text-slate-400 leading-relaxed mt-3 mb-3">{plan.description}</p>
                    <p className="text-xs text-slate-500 mb-3">{plan.chapters.length} chapitres · {chaptersPerDay(plan)} ch/jour</p>
                    {!isActive ? (
                      <button onClick={() => startPlan(plan.id)} className="btn-primary text-sm flex items-center gap-2">
                        <Play size={13} /> Commencer ce plan
                      </button>
                    ) : (
                      <p className="text-xs text-emerald-400">✓ Plan en cours — {prog.pct}% terminé</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Examen de conscience ──────────────────────────────────────────────────────
const EXAMINATION = [
  {
    category: 'Envers Dieu',
    icon: '✝️',
    questions: [
      'Ai-je prié régulièrement et avec sincérité ?',
      'Ai-je lu et médité la Parole de Dieu ?',
      'Ai-je mis ma confiance en Dieu ou ai-je cédé à l\'anxiété et au doute ?',
      'Ai-je prononcé le nom de Dieu de façon irrespectueuse ?',
      'Ai-je pratiqué ma foi courageusement ou me suis-je caché(e) ?',
      'Ai-je remercié Dieu pour ses bienfaits ?',
    ],
  },
  {
    category: 'Envers les autres',
    icon: '❤️',
    questions: [
      'Ai-je manqué de respect, blessé ou offensé quelqu\'un ?',
      'Ai-je menti, trompé ou manipulé ?',
      'Ai-je été envieux/euse ou jaloux/se ?',
      'Ai-je pardonné à ceux qui m\'ont blessé(e) ?',
      'Ai-je aidé quelqu\'un dans le besoin quand j\'en avais la possibilité ?',
      'Ai-je jugé ou médis d\'une personne ?',
    ],
  },
  {
    category: 'Envers moi-même',
    icon: '🪞',
    questions: [
      'Ai-je cédé à la colère, à l\'orgueil ou à l\'impatience ?',
      'Ai-je entretenu des pensées impures, violentes ou négatives ?',
      'Ai-je abusé de nourriture, de médias, de divertissements ?',
      'Ai-je pris soin de ma santé physique et mentale comme d\'un temple de Dieu ?',
      'Ai-je procrastiné ou évité mes responsabilités ?',
    ],
  },
  {
    category: 'Béatitudes',
    icon: '🕊️',
    questions: [
      'Ai-je été pauvre en esprit — humble devant Dieu et les hommes ?',
      'Ai-je été artisan(e) de paix dans mes relations ?',
      'Ai-je eu faim et soif de justice ?',
      'Ai-je fait miséricorde à ceux qui ont failli ?',
      'Ai-je été persécuté(e) à cause du bien que je voulais faire ?',
    ],
  },
]

function ExaminationOfConscience() {
  const { logActivity } = useSpiritualContext()
  const [checked, setChecked] = useState({})
  const [phase, setPhase] = useState('exam') // 'exam' | 'prayer'

  const toggle = (catIdx, qIdx) => {
    const key = `${catIdx}-${qIdx}`
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const checkedCount = Object.values(checked).filter(Boolean).length

  if (phase === 'prayer') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="card-glass border border-gold-500/15">
          <p className="text-xs text-gold-500 font-semibold uppercase tracking-wider mb-3">Prière d'acte de contrition</p>
          <p className="text-sm text-slate-300 leading-loose font-serif italic">
            "Mon Dieu, j'ai un grand regret de vous avoir offensé, parce que vous êtes infiniment bon, infiniment aimable, et que le péché vous déplaît. Je prends la ferme résolution, avec le secours de votre sainte grâce, de ne plus vous offenser et de faire pénitence. Amen."
          </p>
        </div>
        <div className="card-glass border border-spirit-500/15">
          <p className="text-xs text-spirit-400 font-semibold uppercase tracking-wider mb-3">Rappel de la miséricorde</p>
          <p className="text-sm text-slate-300 leading-relaxed italic font-serif">
            « Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité. »
          </p>
          <p className="text-xs text-gold-500 mt-2">1 Jean 1:9</p>
        </div>
        <button onClick={() => setPhase('exam')} className="btn-secondary text-sm flex items-center gap-2">
          <RotateCcw size={13} /> Recommencer l'examen
        </button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500 leading-relaxed">
        Cochez les points qui vous touchent. Cet examen est entièrement privé — il n'est pas sauvegardé.
      </p>
      {EXAMINATION.map((cat, ci) => (
        <div key={ci} className="card space-y-2">
          <h4 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
            <span>{cat.icon}</span> {cat.category}
          </h4>
          {cat.questions.map((q, qi) => {
            const key = `${ci}-${qi}`
            const isChecked = checked[key]
            return (
              <button key={qi} onClick={() => toggle(ci, qi)}
                className={`w-full text-left flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                  isChecked ? 'bg-red-500/8 border border-red-500/20' : 'hover:bg-navy-700'
                }`}
              >
                <div className={`mt-0.5 flex-shrink-0 transition-colors ${isChecked ? 'text-red-400' : 'text-slate-600'}`}>
                  {isChecked ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                </div>
                <p className={`text-sm leading-relaxed ${isChecked ? 'text-slate-400' : 'text-slate-300'}`}>{q}</p>
              </button>
            )
          })}
        </div>
      ))}
      {checkedCount === 0 && (
        <button onClick={() => { logActivity('examen', 5); setPhase('prayer') }} className="btn-secondary w-full min-h-[48px]">
          Terminer l'examen et prier
        </button>
      )}
      {checkedCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="card border border-gold-500/20 text-center py-5 space-y-3">
          <p className="text-slate-400 text-sm">
            {checkedCount} point{checkedCount > 1 ? 's' : ''} identifié{checkedCount > 1 ? 's' : ''}.
            Confiez-les à Dieu dans la prière.
          </p>
          <button onClick={() => { logActivity('examen', 5); setPhase('prayer') }} className="btn-primary min-h-[48px] mx-auto flex items-center gap-2">
            Prier l'acte de contrition →
          </button>
        </motion.div>
      )}
    </div>
  )
}

// ─── Méditations thématiques ───────────────────────────────────────────────────
const THEMES = [
  {
    id: 'paix', label: 'La Paix', icon: '🕊️', color: 'text-blue-400',
    verses: [
      { ref: 'Jean 14:27', text: 'Je vous laisse la paix, je vous donne ma paix. Je ne vous la donne pas comme le monde la donne.' },
      { ref: 'Philippiens 4:7', text: 'La paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.' },
      { ref: 'Psaumes 46:10', text: 'Arrêtez, et sachez que je suis Dieu.' },
      { ref: 'Ésaïe 26:3', text: 'A celui dont l\'esprit est ferme tu assures la paix, la paix, parce qu\'il se confie en toi.' },
    ],
  },
  {
    id: 'pardon', label: 'Le Pardon', icon: '🤍', color: 'text-slate-300',
    verses: [
      { ref: '1 Jean 1:9', text: 'Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité.' },
      { ref: 'Romains 8:1', text: 'Il n\'y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ.' },
      { ref: 'Lamentations 3:22-23', text: 'Les bontés de l\'Éternel ne sont pas épuisées, ses compassions ne sont pas à leur terme ; elles se renouvellent chaque matin.' },
      { ref: 'Michée 7:18', text: 'Quel Dieu est semblable à toi, qui pardonnes l\'iniquité, qui passes sur la transgression du reste de ton héritage ?' },
    ],
  },
  {
    id: 'force', label: 'La Force', icon: '💪', color: 'text-orange-400',
    verses: [
      { ref: 'Philippiens 4:13', text: 'Je puis tout par celui qui me fortifie.' },
      { ref: 'Ésaïe 40:31', text: 'Mais ceux qui se confient en l\'Éternel renouvellent leur force. Ils prennent le vol comme les aigles.' },
      { ref: '2 Timothée 1:7', text: 'Car ce n\'est pas un esprit de timidité que Dieu nous a donné, mais un esprit de force, d\'amour et de sagesse.' },
      { ref: 'Josué 1:9', text: 'Sois fort et courageux. Ne te laisse pas abattre et ne sois pas troublé, car l\'Éternel, ton Dieu, est avec toi.' },
    ],
  },
  {
    id: 'amour', label: "L'Amour de Dieu", icon: '❤️', color: 'text-red-400',
    verses: [
      { ref: 'Jean 3:16', text: 'Car Dieu a tant aimé le monde qu\'il a donné son Fils unique, afin que quiconque croit en lui ne périsse pas, mais ait la vie éternelle.' },
      { ref: 'Romains 5:8', text: 'Mais Dieu prouve son amour envers nous, en ce que, lorsque nous étions encore des pécheurs, Christ est mort pour nous.' },
      { ref: '1 Jean 4:8', text: 'Celui qui n\'aime pas n\'a pas connu Dieu, car Dieu est amour.' },
      { ref: 'Jérémie 31:3', text: 'Je t\'ai aimé d\'un amour éternel ; c\'est pourquoi je te conserve ma grâce.' },
    ],
  },
  {
    id: 'confiance', label: 'La Confiance', icon: '⚓', color: 'text-gold-400',
    verses: [
      { ref: 'Proverbes 3:5-6', text: 'Confie-toi en l\'Éternel de tout ton cœur, et ne t\'appuie pas sur ta sagesse ; reconnais-le dans toutes tes voies, et il aplanira tes sentiers.' },
      { ref: 'Jérémie 29:11', text: 'Car je connais les projets que j\'ai formés sur vous, projets de paix et non de malheur, afin de vous donner un avenir et de l\'espérance.' },
      { ref: 'Psaumes 37:5', text: 'Recommande ton sort à l\'Éternel, mets en lui ta confiance, et il agira.' },
      { ref: 'Romains 8:28', text: 'Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu.' },
    ],
  },
  {
    id: 'guerison', label: 'La Guérison', icon: '🌿', color: 'text-emerald-400',
    verses: [
      { ref: 'Psaumes 147:3', text: 'Il guérit ceux qui ont le cœur brisé, et il panse leurs blessures.' },
      { ref: 'Ésaïe 53:5', text: 'Mais il était blessé pour nos péchés, brisé pour nos iniquités ; le châtiment qui nous donne la paix est tombé sur lui, et c\'est par ses meurtrissures que nous sommes guéris.' },
      { ref: 'Matthieu 11:28', text: 'Venez à moi, vous tous qui vous fatiguez et qui êtes chargés, et je vous donnerai du repos.' },
      { ref: 'Apocalypse 21:4', text: 'Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n\'y aura plus ni deuil, ni cri, ni douleur.' },
    ],
  },
]

function MeditationThemes() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map(theme => (
          <button key={theme.id} onClick={() => setSelected(selected === theme.id ? null : theme.id)}
            className={`p-3.5 rounded-xl border text-left transition-all min-h-[60px] ${
              selected === theme.id
                ? `bg-navy-700 border-navy-400`
                : 'bg-navy-800 border-navy-600 hover:border-navy-500'
            }`}
          >
            <span className="text-xl block mb-1">{theme.icon}</span>
            <p className={`text-xs font-semibold ${theme.color}`}>{theme.label}</p>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {selected && (() => {
          const theme = THEMES.find(t => t.id === selected)
          return (
            <motion.div key={selected}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <p className="text-xs text-slate-500 font-medium px-1">{theme.icon} {theme.label}</p>
              {theme.verses.map((v, i) => (
                <div key={i} className="card-glass p-4">
                  <p className="text-sm text-slate-300 leading-relaxed font-serif italic mb-2">« {v.text} »</p>
                  <p className="text-xs text-gold-500 font-medium">{v.ref}</p>
                </div>
              ))}
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}

// ─── Signets ───────────────────────────────────────────────────────────────────
function Bookmarks() {
  const { bookmarks, removeBookmark } = useSpiritualContext()
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = bookmarks.filter(b =>
    !search ||
    b.bookName?.toLowerCase().includes(search.toLowerCase()) ||
    b.text?.toLowerCase().includes(search.toLowerCase())
  )

  if (bookmarks.length === 0) {
    return (
      <div className="card text-center py-12">
        <Bookmark size={32} className="text-slate-700 mx-auto mb-3" />
        <p className="text-slate-400 font-medium text-sm">Aucun signet enregistré</p>
        <p className="text-slate-600 text-xs mt-1">Appuyez sur un verset dans la Bible puis "Ajouter signet"</p>
        <button onClick={() => navigate('/bible')} className="btn-primary mt-4 text-sm">Ouvrir la Bible</button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        <input type="text" placeholder="Rechercher dans les signets..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-10 text-sm" />
      </div>
      <p className="text-xs text-slate-600">{filtered.length} signet{filtered.length > 1 ? 's' : ''}</p>
      <AnimatePresence>
        {filtered.map(bm => (
          <motion.div key={bm.id}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
            className="card hover:border-navy-500 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                <Bookmark size={14} className="text-gold-400" />
              </div>
              <div className="flex-1 min-w-0">
                <button onClick={() => navigate(`/bible?livre=${bm.bookId}&ch=${bm.chapter}`)}
                  className="text-xs font-semibold text-gold-500 hover:text-gold-400 mb-1 underline-offset-2 hover:underline">
                  {bm.bookName} {bm.chapter}:{bm.verse}
                </button>
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 italic">« {bm.text} »</p>
                <p className="text-xs text-slate-600 mt-1.5">
                  {formatDay(bm.date)}
                </p>
              </div>
              <ConfirmButton onConfirm={() => removeBookmark(bm.id)} label="Retirer" size={15} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ─── Sauvegarde ────────────────────────────────────────────────────────────────
function Backup() {
  const [status, setStatus] = useState(null) // { ok: bool, msg: string }
  const [persisted, setPersisted] = useState(null)

  const protect = async () => setPersisted(await requestPersistentStorage())

  const onImport = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const n = await importBackup(file)
      setStatus({ ok: true, msg: `Sauvegarde restaurée (${n} catégories de données).` })
    } catch (err) {
      setStatus({ ok: false, msg: err.message })
    }
  }

  return (
    <div className="space-y-3">
      <div className="card-glass text-sm text-slate-400 leading-relaxed">
        Vos données (journal, prières, progression) restent <span className="text-slate-200">uniquement sur ce téléphone</span>.
        Faites une sauvegarde de temps en temps : elle vous permet de tout retrouver si vous changez d'appareil
        ou si le navigateur efface ses données.
      </div>
      <button onClick={() => { exportBackup(); setStatus({ ok: true, msg: 'Fichier de sauvegarde téléchargé.' }) }}
        className="btn-primary w-full min-h-[48px]">
        Télécharger ma sauvegarde
      </button>
      <label className="btn-secondary w-full min-h-[48px] flex items-center justify-center cursor-pointer">
        Restaurer une sauvegarde
        <input type="file" accept="application/json,.json" onChange={onImport} className="sr-only" />
      </label>
      <button onClick={protect} className="btn-secondary w-full min-h-[48px]">
        Protéger mes données contre l'effacement automatique
      </button>
      {persisted !== null && (
        <p className={`text-xs ${persisted ? 'text-emerald-400' : 'text-amber-400'}`}>
          {persisted
            ? 'Protection activée ✓'
            : "Le navigateur n'a pas accordé la protection. Sur iPhone, ajoutez l'appli à l'écran d'accueil (Partager → Sur l'écran d'accueil)."}
        </p>
      )}
      {status && (
        <p role="status" className={`text-sm ${status.ok ? 'text-emerald-400' : 'text-red-400'}`}>{status.msg}</p>
      )}
    </div>
  )
}

// ─── Page principale ───────────────────────────────────────────────────────────
const TOOLS = [
  { id: 'plans',     label: 'Plans de lecture',        icon3d: 'calendar', desc: '5 plans pour lire la Bible pas à pas' },
  { id: 'bookmarks', label: 'Mes versets',             icon3d: 'bookmark', desc: 'Vos versets favoris enregistrés' },
  { id: 'themes',    label: 'Méditer un thème',        icon3d: 'bulb',     desc: 'Paix, pardon, force, confiance…' },
  { id: 'exam',      label: 'Examen de conscience',    icon3d: 'mirror',   desc: 'Préparer sa confession et renouveler son cœur' },
  { id: 'backup',    label: 'Sauvegarde',              icon3d: 'save',     desc: 'Exporter ou restaurer vos données' },
  { id: 'progress',  label: 'Mes statistiques',        icon3d: 'chart',    desc: 'Calendrier, minutes, lectures', to: '/progres' },
]

export default function Outils() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const active = TOOLS.some(t => t.id === params.get('outil')) ? params.get('outil') : null
  const tool = TOOLS.find(t => t.id === active)
  const open = (t) => (t.to ? navigate(t.to) : setParams({ outil: t.id }))

  return (
    <div className="space-y-5">
      {!active ? (
        <>
          <PageHeader icon="sparkles" title="Outils spirituels" subtitle="Plans, versets, méditations, examen" />
          <div className="space-y-2">
            {TOOLS.map(t => (
              <button key={t.id} onClick={() => open(t)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-left min-h-[68px]">
                <Icon3D name={t.icon3d} size={34} />
                <div className="flex-1">
                  <p className="font-semibold text-slate-100">{t.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                </div>
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate('/chemin')}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 min-h-[44px] -ml-1 mb-2">
            <ChevronRight size={16} className="rotate-180" /> Mon chemin
          </button>
          <PageHeader icon={tool.icon3d} title={tool.label} subtitle={tool.desc} />
          {active === 'plans'     && <ReadingPlans />}
          {active === 'bookmarks' && <Bookmarks />}
          {active === 'themes'    && <MeditationThemes />}
          {active === 'exam'      && <ExaminationOfConscience />}
          {active === 'backup'    && <Backup />}
        </motion.div>
      )}
    </div>
  )
}
