import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft } from 'lucide-react'
import { useSpiritualContext } from '../context/SpiritualContext'
import { useMesseDuJour } from '../hooks/useMesse'
import { getEvangile } from '../utils/aelf'
import { DAILY_VERSES } from '../data/bibleBooks'
import { GUIDED_PRAYERS, SIGNE_DE_CROIX, NOTRE_PERE } from '../data/prayers'
import Icon3D from '../components/Icon3D'

const QUESTIONS = [
  ['Quel mot ou quelle phrase me touche ?', 'Relisez-la lentement, deux ou trois fois.'],
  ['Que me dit Jésus, à moi, aujourd’hui ?', 'Laissez venir une réponse simple, sans chercher à bien faire.'],
  ['Quelle grâce ai-je envie de lui demander ?', 'La paix, la force, le pardon, la confiance…'],
  ['De quoi puis-je lui dire merci ?', 'Même une toute petite chose de cette journée.'],
  ['Qui puis-je lui confier aujourd’hui ?', 'Un proche, une personne qui souffre, quelqu’un que j’ai du mal à aimer.'],
]

const STEPS = ['recueillement', 'parole', 'mediter', 'prier', 'ecrire', 'fin']

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function Moment() {
  const navigate = useNavigate()
  const { profile, logActivity, addJournalEntry, growth } = useSpiritualContext()
  const { data: messe, loading } = useMesseDuJour()
  const evangile = getEvangile(messe)

  const [step, setStep] = useState(0)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(null) // { minutes }
  const startedAt = useRef(Date.now())
  const [now, setNow] = useState(Date.now())

  const now0 = new Date()
  const dayOfYear = Math.floor((now0 - new Date(now0.getFullYear(), 0, 0)) / 86400000)
  const verse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length]
  const question = QUESTIONS[dayOfYear % QUESTIONS.length]
  const guided = GUIDED_PRAYERS[dayOfYear % GUIDED_PRAYERS.length]

  // Horloge (calculée depuis l'heure de départ : juste même écran verrouillé)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const elapsed = Math.min(Math.floor((now - startedAt.current) / 1000), 3 * 3600)
  const goalSec = profile.dailyMinutes * 60
  const goalPct = Math.min(100, Math.round((elapsed / goalSec) * 100))

  const finish = () => {
    if (saved) return
    const minutes = Math.max(1, Math.round(elapsed / 60))
    logActivity('moment', minutes)
    if (evangile) logActivity('evangile')
    if (note.trim()) addJournalEntry({ content: note.trim(), verse: evangile ? evangile.ref : verse.ref_fr, mood: '', gratitude: [] })
    setSaved({ minutes })
    setStep(STEPS.indexOf('fin'))
  }

  const next = () => (STEPS[step + 1] === 'fin' ? finish() : setStep(s => s + 1))
  const back = () => setStep(s => Math.max(0, s - 1))
  const current = STEPS[step]

  return (
    <div className="min-h-screen bg-navy-900 bg-mesh flex flex-col">
      {/* Barre du haut */}
      <div className="sticky top-0 z-10 bg-navy-900/90 backdrop-blur border-b border-white/5"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-xl mx-auto flex items-center gap-3 px-4 h-14">
          {step > 0 && current !== 'fin' ? (
            <button onClick={back} aria-label="Étape précédente" className="w-10 h-10 -ml-2 flex items-center justify-center text-slate-400"><ChevronLeft size={22} /></button>
          ) : <span className="w-10" />}
          <div className="flex-1 flex gap-1.5" aria-label={`Étape ${step + 1} sur ${STEPS.length}`}>
            {STEPS.slice(0, -1).map((s, i) => (
              <span key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-gold-400' : 'bg-white/10'}`} />
            ))}
          </div>
          <button onClick={() => navigate('/')} aria-label="Quitter" className="w-10 h-10 -mr-2 flex items-center justify-center text-slate-400"><X size={22} /></button>
        </div>
      </div>

      <main className="flex-1 max-w-xl w-full mx-auto px-5 py-8 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={current} className="flex-1 flex flex-col"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

            {current === 'recueillement' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                <Icon3D name="candle" size={96} />
                <h1 className="text-2xl font-semibold text-slate-50">Prenez un instant pour vous poser</h1>
                <p className="text-slate-400 leading-relaxed max-w-sm">
                  Respirez calmement. Vous êtes en présence de Dieu, qui vous aime tel que vous êtes.
                </p>
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/5 max-w-sm">
                  <p className="font-serif italic text-lg text-slate-200">{SIGNE_DE_CROIX}</p>
                  <p className="font-serif italic text-slate-300 mt-3">Seigneur, me voici. Ouvre mon cœur à ta Parole.</p>
                </div>
              </div>
            )}

            {current === 'parole' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon3D name="scroll" size={40} />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gold-300 font-semibold">{evangile ? 'Évangile du jour' : 'Parole du jour'}</p>
                    <p className="text-slate-400 text-sm">{evangile ? evangile.ref : verse.ref_fr}</p>
                  </div>
                </div>
                {loading && !evangile ? (
                  <p className="text-slate-500">Chargement de l’Évangile…</p>
                ) : evangile ? (
                  <article>
                    {evangile.intro && <p className="text-sm text-slate-500 italic mb-3">{evangile.intro}</p>}
                    <p className="font-serif text-[1.125rem] leading-[1.75] text-slate-100 whitespace-pre-line">{evangile.texte}</p>
                    <p className="text-xs text-slate-600 mt-4">Traduction liturgique officielle — AELF</p>
                  </article>
                ) : (
                  <p className="font-serif italic text-xl leading-relaxed text-slate-100">« {verse.text} »</p>
                )}
              </div>
            )}

            {current === 'mediter' && (
              <div className="flex-1 flex flex-col justify-center gap-6">
                <Icon3D name="bulb" size={72} className="mx-auto" />
                <h1 className="text-2xl font-semibold text-slate-50 text-center">{question[0]}</h1>
                <p className="text-slate-400 text-center leading-relaxed">{question[1]}</p>
                <p className="text-sm text-slate-500 text-center">Prenez le temps qu’il vous faut. Il n’y a pas de bonne ou de mauvaise réponse.</p>
              </div>
            )}

            {current === 'prier' && (
              <div className="flex-1 flex flex-col items-center gap-6">
                {/* Anneau de progression vers l'objectif du jour */}
                <div className="relative w-44 h-44 mt-2">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 44} strokeDashoffset={2 * Math.PI * 44 * (1 - goalPct / 100)}
                      style={{ transition: 'stroke-dashoffset 1s linear' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Icon3D name="hands" size={44} />
                    <p className="font-mono text-2xl font-bold text-slate-100 mt-1">{fmt(elapsed)}</p>
                    <p className="text-xs text-slate-500">{goalPct >= 100 ? 'Objectif atteint ✓' : `objectif ${profile.dailyMinutes} min`}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-center leading-relaxed">
                  Parlez à Dieu simplement, comme à un ami : remerciez-le, confiez-lui ce qui vous pèse, demandez-lui ce dont vous avez besoin.
                </p>
                <details className="w-full rounded-2xl bg-white/[0.04] border border-white/5 p-4 group">
                  <summary className="cursor-pointer text-sm font-medium text-gold-300 list-none flex items-center gap-2 min-h-[32px]">
                    <Icon3D name={guided.icon} size={22} /> Besoin de mots ? « {guided.title} »
                  </summary>
                  <p className="font-serif italic text-slate-200 leading-relaxed mt-3">{guided.text}</p>
                  <p className="font-serif italic text-slate-400 leading-relaxed mt-3 text-sm">{NOTRE_PERE}</p>
                </details>
              </div>
            )}

            {current === 'ecrire' && (
              <div className="flex-1 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <Icon3D name="writing" size={44} />
                  <div>
                    <h1 className="text-xl font-semibold text-slate-50">Une phrase à garder</h1>
                    <p className="text-sm text-slate-400">Facultatif — elle ira dans votre journal.</p>
                  </div>
                </div>
                <textarea value={note} onChange={e => setNote(e.target.value)} maxLength={1000}
                  placeholder="Ce que je retiens de ce moment…"
                  className="input min-h-[140px] text-[1rem] leading-relaxed resize-none" />
              </div>
            )}

            {current === 'fin' && saved && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
                <Icon3D name="sparkles" size={88} />
                <h1 className="text-2xl font-semibold text-slate-50">Merci pour ce moment{profile.name ? `, ${profile.name}` : ''}</h1>
                <p className="font-serif italic text-lg text-slate-200 max-w-sm leading-relaxed">
                  « Que le Seigneur te bénisse et te garde ! Qu’il fasse briller sur toi son visage. »
                </p>
                <p className="text-sm text-gold-400">Nombres 6, 24-25</p>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/5">
                  <Icon3D name={growth.stage.icon} size={40} />
                  <p className="text-sm text-slate-300 text-left">
                    {saved.minutes} minute{saved.minutes > 1 ? 's' : ''} avec Dieu.<br />
                    <span className="text-slate-500">{growth.stage.name} · {growth.faithfulDays} jour{growth.faithfulDays > 1 ? 's' : ''} de rencontre</span>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Bouton principal, toujours au même endroit (pouce) */}
        <div className="pt-6" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          {current === 'fin' ? (
            <Link to="/" className="btn-primary w-full min-h-[54px] flex items-center justify-center text-[1rem]">Retour à l’accueil</Link>
          ) : (
            <button onClick={next} className="btn-primary w-full min-h-[54px] text-[1rem]">
              {{
                recueillement: 'Je suis prêt(e)',
                parole: 'J’ai lu, je médite',
                mediter: 'Je prie',
                prier: goalPct >= 100 ? 'Amen' : 'Terminer ma prière',
                ecrire: note.trim() ? 'Enregistrer et terminer' : 'Terminer sans écrire',
              }[current]}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
