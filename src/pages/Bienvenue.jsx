import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useSpiritualContext } from '../context/SpiritualContext'
import Icon3D from '../components/Icon3D'

// Les étapes pour bien utiliser l'appli (aussi consultables plus tard depuis « Mon chemin »)
const HOW_TO = [
  { icon: 'candle', title: 'Chaque jour, un moment avec Dieu',
    text: "Un seul bouton sur l'accueil : l'appli vous guide pas à pas — l'Évangile du jour, une question pour méditer, un temps de prière, une phrase à garder." },
  { icon: 'herb', title: 'Commencez petit',
    text: "2 minutes suffisent pour commencer. Quand vous aurez tenu quelques jours, l'appli vous proposera doucement d'aller un peu plus loin." },
  { icon: 'beads', title: 'Approfondissez quand vous voulez',
    text: 'La Bible et les lectures de la messe, le chapelet et la Divine Miséricorde, votre journal, vos intentions de prière.' },
  { icon: 'seedling', title: 'Regardez votre chemin grandir',
    text: "Chaque jour passé avec Dieu fait grandir votre « grain de sénevé ». Il ne recule jamais : un jour manqué n'efface rien." },
]

const MINUTES = [2, 5, 10]

export default function Bienvenue() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const reviewOnly = params.has('revoir') // relecture du guide depuis « Mon chemin »
  const { profile, completeOnboarding } = useSpiritualContext()

  const steps = reviewOnly ? ['but', 'etapes'] : ['but', 'etapes', 'prenom', 'temps', 'pret']
  const [i, setI] = useState(0)
  const [name, setName] = useState(profile.name || '')
  const [minutes, setMinutes] = useState(profile.dailyMinutes || 2)
  const step = steps[i]
  const cleanName = name.replace(/\s+/g, ' ').trim()

  const next = () => {
    if (i < steps.length - 1) return setI(i + 1)
    if (reviewOnly) return navigate('/chemin')
  }
  const finish = (to) => {
    completeOnboarding({ name: cleanName, dailyMinutes: minutes })
    navigate(to, { replace: true })
  }

  return (
    <div className="min-h-screen bg-navy-900 bg-mesh flex flex-col"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
      <div className="max-w-xl w-full mx-auto px-5 flex items-center gap-3 h-14">
        {i > 0 ? (
          <button onClick={() => setI(i - 1)} aria-label="Étape précédente" className="w-10 h-10 -ml-2 flex items-center justify-center text-slate-400"><ChevronLeft size={22} /></button>
        ) : <span className="w-10" />}
        <div className="flex-1 flex gap-1.5" aria-label={`Étape ${i + 1} sur ${steps.length}`}>
          {steps.map((s, k) => <span key={s} className={`h-1.5 flex-1 rounded-full ${k <= i ? 'bg-gold-400' : 'bg-white/10'}`} />)}
        </div>
        <span className="w-10" />
      </div>

      <main className="flex-1 max-w-xl w-full mx-auto px-6 py-6 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div key={step} className="flex-1 flex flex-col"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>

            {step === 'but' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
                <Icon3D name="dove" size={96} />
                <h1 className="text-[1.75rem] font-bold text-slate-50 leading-tight">Bienvenue dans For Jesus</h1>
                <p className="text-[1.0625rem] text-slate-300 leading-relaxed max-w-md">
                  Vous avez peut-être perdu l'habitude de prier. Ce n'est pas grave : Dieu, lui, ne vous a jamais quitté.
                </p>
                <p className="text-slate-400 leading-relaxed max-w-md">
                  Cette appli est là pour vous aider à <span className="text-slate-100 font-medium">retrouver le chemin de la prière, pas à pas</span>,
                  quelques minutes par jour — sans jugement, à votre rythme.
                </p>
                <p className="font-serif italic text-gold-300 max-w-sm">« Approchez-vous de Dieu, et il s'approchera de vous. »<span className="block text-sm not-italic text-slate-500 mt-1">Jacques 4, 8</span></p>
              </div>
            )}

            {step === 'etapes' && (
              <div className="flex-1 flex flex-col justify-center gap-5">
                <h1 className="text-2xl font-bold text-slate-50">Comment ça marche ?</h1>
                <ol className="space-y-4">
                  {HOW_TO.map((h, k) => (
                    <li key={h.title} className="flex gap-4 items-start">
                      <div className="relative flex-shrink-0">
                        <Icon3D name={h.icon} size={44} />
                        <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-gold-500 text-navy-950 text-[0.6875rem] font-bold flex items-center justify-center">{k + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-100">{h.title}</p>
                        <p className="text-sm text-slate-400 leading-relaxed mt-0.5">{h.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Vos données restent uniquement sur ce téléphone. Pensez à faire une sauvegarde de temps en temps (Mon chemin → Sauvegarde).
                </p>
              </div>
            )}

            {step === 'prenom' && (
              <div className="flex-1 flex flex-col justify-center gap-5">
                <Icon3D name="writing" size={64} />
                <h1 className="text-2xl font-bold text-slate-50">Comment souhaitez-vous qu'on vous appelle ?</h1>
                <input value={name} onChange={e => setName(e.target.value)} maxLength={40} autoFocus
                  autoComplete="given-name" autoCapitalize="words" enterKeyHint="next"
                  onKeyDown={e => e.key === 'Enter' && next()}
                  placeholder="Votre prénom" className="input text-[1.125rem] min-h-[56px]" />
                <p className="text-sm text-slate-500">Facultatif. Votre prénom reste sur ce téléphone et n'est envoyé nulle part.</p>
              </div>
            )}

            {step === 'temps' && (
              <div className="flex-1 flex flex-col justify-center gap-5">
                <Icon3D name="hourglass" size={64} />
                <h1 className="text-2xl font-bold text-slate-50">Combien de temps pour commencer ?</h1>
                <p className="text-slate-400 leading-relaxed">Mieux vaut peu chaque jour que beaucoup une fois. Vous pourrez changer à tout moment.</p>
                <div className="grid grid-cols-3 gap-3">
                  {MINUTES.map(m => (
                    <button key={m} onClick={() => setMinutes(m)} aria-pressed={minutes === m}
                      className={`min-h-[88px] rounded-2xl border flex flex-col items-center justify-center transition-all ${
                        minutes === m ? 'bg-gold-500 text-navy-950 border-gold-400' : 'bg-white/[0.04] border-white/10 text-slate-200'}`}>
                      <span className="text-2xl font-bold">{m}</span>
                      <span className="text-sm">minutes</span>
                    </button>
                  ))}
                </div>
                {minutes === 2 && <p className="text-sm text-emerald-400">Excellent choix pour reprendre en douceur.</p>}
              </div>
            )}

            {step === 'pret' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
                <Icon3D name="sunrise" size={96} />
                <h1 className="text-[1.75rem] font-bold text-slate-50 leading-tight">
                  {cleanName ? `${cleanName}, vous êtes prêt(e).` : 'Vous êtes prêt(e).'}
                </h1>
                <p className="text-slate-300 leading-relaxed max-w-md">
                  Votre premier moment avec Dieu dure environ {minutes} minutes. Il n'y a rien à réussir : simplement être là.
                </p>
                <p className="text-sm text-slate-500 max-w-sm">
                  Astuce : ajoutez l'appli à votre écran d'accueil (Partager → « Sur l'écran d'accueil ») et programmez un rappel dans Mon chemin.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="pt-6 space-y-2">
          {step === 'pret' ? (
            <>
              <button onClick={() => finish('/moment')} className="btn-primary w-full min-h-[54px] text-[1rem]">Vivre mon premier moment</button>
              <button onClick={() => finish('/')} className="btn-secondary w-full min-h-[48px]">Découvrir l'appli d'abord</button>
            </>
          ) : (
            <button onClick={next} className="btn-primary w-full min-h-[54px] text-[1rem]">
              {reviewOnly && i === steps.length - 1 ? 'Retour à mon chemin'
                : step === 'prenom' ? (cleanName ? 'Continuer' : 'Passer')
                : step === 'but' ? 'Découvrir comment' : 'Continuer'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
