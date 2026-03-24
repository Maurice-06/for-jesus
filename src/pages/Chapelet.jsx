import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle2, Circle, X, BookOpen } from 'lucide-react'

// ─── Prières de base ──────────────────────────────────────────────────────────
const NOTRE_PERE = `Notre Père, qui es aux cieux, que ton nom soit sanctifié, que ton règne vienne, que ta volonté soit faite sur la terre comme au ciel. Donne-nous aujourd'hui notre pain de ce jour. Pardonne-nous nos offenses, comme nous pardonnons aussi à ceux qui nous ont offensés. Et ne nous soumets pas à la tentation, mais délivre-nous du mal. Amen.`

const JE_VOUS_SALUE = `Je vous salue Marie, pleine de grâce ; le Seigneur est avec vous. Vous êtes bénie entre toutes les femmes, et Jésus, le fruit de vos entrailles, est béni. Sainte Marie, Mère de Dieu, priez pour nous, pécheurs, maintenant et à l'heure de notre mort. Amen.`

const GLOIRE_AU_PERE = `Gloire au Père, au Fils et au Saint-Esprit, comme il était au commencement, maintenant et toujours, dans les siècles des siècles. Amen.`

const O_JESUS = `Ô Jésus, pardonnez-nous nos péchés, préservez-nous du feu de l'enfer, conduisez au ciel toutes les âmes, surtout celles qui ont le plus besoin de votre miséricorde. Amen.`

const JE_CROIS = `Je crois en Dieu, le Père tout-puissant, créateur du ciel et de la terre. Et en Jésus-Christ, son Fils unique, notre Seigneur, qui a été conçu du Saint-Esprit, est né de la Vierge Marie, a souffert sous Ponce Pilate, a été crucifié, est mort et a été enseveli, est descendu aux enfers, le troisième jour est ressuscité des morts, est monté aux cieux, est assis à la droite de Dieu le Père tout-puissant, d'où il viendra juger les vivants et les morts. Je crois au Saint-Esprit, à la sainte Église catholique, à la communion des saints, à la rémission des péchés, à la résurrection de la chair, à la vie éternelle. Amen.`

const JE_VOUS_SALUE_REINE = `Je vous salue, Reine, Mère de miséricorde, notre vie, notre douceur et notre espérance, salut ! Enfants d'Ève, nous vous envoyons nos soupirs du fond de cet exil de larmes. Tournez vers nous vos yeux miséricordieux, et après cet exil, montrez-nous Jésus, le fruit béni de vos entrailles. Ô clémente, ô pieuse, ô douce Vierge Marie ! Priez pour nous, sainte Mère de Dieu, afin que nous soyons rendus dignes des promesses de Jésus-Christ. Amen.`

// ─── Mystères du Rosaire ──────────────────────────────────────────────────────
const MYSTERIES = {
  joyeux: {
    label: 'Mystères Joyeux',
    days: 'Lundi & Samedi',
    color: 'from-yellow-600/20 to-yellow-500/5',
    borderColor: 'border-yellow-500/20',
    textColor: 'text-yellow-400',
    icon: '✨',
    list: [
      { title: "L'Annonciation", ref: 'Luc 1:26-38', meditation: "L'ange Gabriel annonce à Marie qu'elle concevra le Fils de Dieu. Marie dit : « Qu'il me soit fait selon ta parole. » Méditons sur l'obéissance totale à la volonté de Dieu." },
      { title: 'La Visitation', ref: 'Luc 1:39-56', meditation: "Marie se rend chez Élisabeth. À son salut, l'enfant tressaille dans le sein d'Élisabeth. Méditons sur la joie du service et du partage de la foi." },
      { title: 'La Nativité de Jésus', ref: 'Luc 2:1-20', meditation: "Jésus naît dans une crèche à Bethléem. Les bergers viennent l'adorer. Méditons sur la pauvreté et l'humilité du Fils de Dieu venu parmi nous." },
      { title: 'La Présentation au Temple', ref: 'Luc 2:22-40', meditation: "Marie et Joseph présentent Jésus au Temple. Siméon proclame : « Mes yeux ont vu ton salut. » Méditons sur la fidélité à la Loi de Dieu." },
      { title: 'Le Recouvrement au Temple', ref: 'Luc 2:41-52', meditation: "Jésus, à 12 ans, est retrouvé au Temple parmi les docteurs. Il dit : « Je dois être aux affaires de mon Père. » Méditons sur la recherche de Dieu." },
    ],
  },
  lumineux: {
    label: 'Mystères Lumineux',
    days: 'Jeudi',
    color: 'from-blue-600/20 to-blue-500/5',
    borderColor: 'border-blue-500/20',
    textColor: 'text-blue-400',
    icon: '💡',
    list: [
      { title: 'Le Baptême de Jésus', ref: 'Mt 3:13-17', meditation: "Au baptême, le Père déclare : « Celui-ci est mon Fils bien-aimé. » L'Esprit descend sur Jésus. Méditons sur notre propre baptême et notre filiation divine." },
      { title: 'Les Noces de Cana', ref: 'Jean 2:1-12', meditation: "À la demande de Marie, Jésus transforme l'eau en vin. Marie dit : « Faites tout ce qu'il vous dira. » Méditons sur la confiance et l'intercession de Marie." },
      { title: "L'Annonce du Royaume", ref: 'Marc 1:14-15', meditation: "Jésus proclame : « Le Royaume de Dieu est proche. Repentez-vous et croyez à l'Évangile. » Méditons sur notre conversion et notre appel à témoigner." },
      { title: 'La Transfiguration', ref: 'Mt 17:1-8', meditation: "Sur la montagne, Jésus est transfiguré devant Pierre, Jacques et Jean. Sa face resplendit comme le soleil. Méditons sur la gloire divine cachée en Jésus." },
      { title: "L'Institution de l'Eucharistie", ref: 'Mt 26:26-28', meditation: "Lors de la Cène, Jésus institue l'Eucharistie : « Ceci est mon corps... Ceci est mon sang. » Méditons sur le don total de Jésus pour notre salut." },
    ],
  },
  douloureux: {
    label: 'Mystères Douloureux',
    days: 'Mardi & Vendredi',
    color: 'from-red-700/20 to-red-500/5',
    borderColor: 'border-red-500/20',
    textColor: 'text-red-400',
    icon: '✝️',
    list: [
      { title: "L'Agonie à Gethsémani", ref: 'Luc 22:39-46', meditation: "Jésus prie jusqu'à suer du sang : « Père, que ta volonté soit faite. » Méditons sur notre union à ses souffrances et notre abandon à Dieu dans l'épreuve." },
      { title: 'La Flagellation', ref: 'Mt 27:26', meditation: "Jésus est flagellé. Il accepte cette souffrance pour nos péchés. Méditons sur la puissance rédemptrice de sa souffrance et notre propre repentir." },
      { title: 'Le Couronnement d\'épines', ref: 'Mt 27:27-30', meditation: "Les soldats mettent une couronne d'épines sur la tête de Jésus et se moquent de lui. Méditons sur sa royauté proclamée dans l'humiliation." },
      { title: 'Le Portement de la Croix', ref: 'Jean 19:17', meditation: "Jésus porte sa croix vers le Golgotha. Il dit : « Que celui qui veut venir après moi prenne sa croix et me suive. » Méditons sur le chemin de la croix dans notre vie." },
      { title: 'La Crucifixion', ref: 'Luc 23:33-46', meditation: "Jésus est crucifié et meurt pour nos péchés. « Père, pardonne-leur. » Méditons sur l'amour infini de Dieu qui livre son Fils pour notre salut." },
    ],
  },
  glorieux: {
    label: 'Mystères Glorieux',
    days: 'Mercredi & Dimanche',
    color: 'from-spirit-600/20 to-spirit-500/5',
    borderColor: 'border-spirit-500/20',
    textColor: 'text-spirit-400',
    icon: '👑',
    list: [
      { title: 'La Résurrection', ref: 'Luc 24:1-12', meditation: "Jésus ressuscite le troisième jour. « Il n'est pas ici, il est ressuscité. » Méditons sur notre espérance de la résurrection et la victoire sur la mort." },
      { title: "L'Ascension", ref: 'Luc 24:50-53', meditation: "Jésus monte au ciel et siège à la droite du Père. Il promet d'envoyer l'Esprit. Méditons sur notre vocation céleste et notre mission d'évangélisation." },
      { title: 'La Pentecôte', ref: 'Actes 2:1-4', meditation: "L'Esprit-Saint descend sur Marie et les apôtres sous forme de langues de feu. Méditons sur le rôle de l'Esprit dans notre vie spirituelle et notre mission." },
      { title: "L'Assomption de Marie", ref: 'Apoc. 12:1', meditation: "Au terme de sa vie terrestre, Marie est élevée corps et âme dans la gloire céleste. Méditons sur notre propre espérance de la gloire éternelle." },
      { title: 'Le Couronnement de Marie', ref: 'Apoc. 12:1', meditation: "Marie est couronnée Reine du ciel et de la terre. Elle intercède pour nous. Méditons sur la communion des saints et notre union à l'Église triomphante." },
    ],
  },
}

// ─── Chapelet de la Divine Miséricorde ────────────────────────────────────────
const DIVINE_MERCY_STEPS = [
  { type: 'intro', label: 'Introduction', text: 'Commencez par le signe de la Croix, puis récitez le Credo des Apôtres.', prayer: JE_CROIS },
  { type: 'notre_pere', label: 'Notre Père', text: 'Sur la grande perle, récitez un Notre Père.', prayer: NOTRE_PERE },
  { type: 'je_vous_salue', label: 'Je vous salue Marie (×3)', text: 'Sur chacune des 3 petites perles, récitez un Je vous salue Marie pour les vertus de foi, d\'espérance et de charité.', prayer: JE_VOUS_SALUE, repeat: 3 },
  { type: 'gloire', label: 'Gloire au Père', text: 'Récitez le Gloire au Père.', prayer: GLOIRE_AU_PERE },
  ...Array.from({ length: 5 }, (_, i) => ({
    type: 'decade',
    label: `${i + 1}ᵉ décade`,
    text: `Sur la grande perle, récitez un Notre Père.\nSur les 10 petites perles, récitez 10 fois la prière de la Divine Miséricorde.`,
    prayer: NOTRE_PERE,
    mercy: `Père éternel, je vous offre le Corps et le Sang, l'Âme et la Divinité de votre très aimé Fils, Notre Seigneur Jésus-Christ, en expiation de nos péchés et de ceux du monde entier.`,
    mercyResponse: `Pour les mérites de sa douloureuse Passion, ayez pitié de nous et du monde entier.`,
    decadeNum: i + 1,
  })),
  {
    type: 'final',
    label: 'Prière finale (×3)',
    text: 'Pour terminer, récitez 3 fois cette invocation :',
    prayer: `Dieu Saint, Dieu Fort, Dieu Saint et Immortel, prends pitié de nous et du monde entier.`,
    repeat: 3,
  },
]

// ─── Utilitaires ──────────────────────────────────────────────────────────────
function getTodayMystery() {
  const day = new Date().getDay() // 0=dim
  if (day === 1 || day === 6) return 'joyeux'
  if (day === 2 || day === 5) return 'douloureux'
  if (day === 3) return 'lumineux'
  return 'glorieux' // 0=dim, 4=jeu→lumineux
}

// ─── Composants ───────────────────────────────────────────────────────────────

function PrayerBox({ label, text, dimmed }) {
  return (
    <div className={`p-4 rounded-xl border transition-all duration-300 ${dimmed ? 'bg-navy-800/40 border-navy-700 opacity-50' : 'bg-navy-700/60 border-navy-500'}`}>
      {label && <p className="text-xs font-semibold text-gold-500 mb-2 uppercase tracking-wider">{label}</p>}
      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-serif italic">"{text}"</p>
    </div>
  )
}

function ProgressBeads({ total, current, color = 'bg-gold-400' }) {
  return (
    <div className="flex flex-wrap gap-1.5 justify-center my-3">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${
          i < current ? color : 'bg-navy-700 border border-navy-600'
        }`} />
      ))}
    </div>
  )
}

// ─── Chapelet du Rosaire ──────────────────────────────────────────────────────
function Rosaire() {
  const suggested = getTodayMystery()
  const [mysteryKey, setMysteryKey] = useState(suggested)
  const mystery = MYSTERIES[mysteryKey]

  // step: 'opening' | 'mystery-N' (0-4) | 'closing'
  const [step, setStep] = useState('opening')
  const [subStep, setSubStep] = useState(0) // within a mystery decade
  // subSteps: 0=announce, 1=notre_pere, 2..11=hail_mary(×10), 12=gloria, 13=o_jesus
  const SUB_TOTAL = 14
  const [mysteryIdx, setMysteryIdx] = useState(0)
  const [aveMarias, setAveMarias] = useState(0) // count within current mystery
  const [finished, setFinished] = useState(false)

  const reset = () => { setStep('opening'); setSubStep(0); setMysteryIdx(0); setAveMarias(0); setFinished(false) }

  // Opening: credo, notre pere, 3 je vous salue, gloire
  const OPENING_STEPS = [
    { label: 'Signe de la Croix + Credo des Apôtres', prayer: JE_CROIS },
    { label: 'Notre Père', prayer: NOTRE_PERE },
    { label: 'Je vous salue Marie — Pour la foi', prayer: JE_VOUS_SALUE },
    { label: 'Je vous salue Marie — Pour l\'espérance', prayer: JE_VOUS_SALUE },
    { label: 'Je vous salue Marie — Pour la charité', prayer: JE_VOUS_SALUE },
    { label: 'Gloire au Père', prayer: GLOIRE_AU_PERE },
  ]

  // Closing
  const CLOSING_STEPS = [
    { label: 'Je vous salue Reine', prayer: JE_VOUS_SALUE_REINE },
    { label: 'Prière finale', prayer: `Par ce chapelet, ô Vierge Marie, que notre foi soit ravivée, notre espérance fortifiée, et notre charité enflammée. Amen.` },
  ]

  const advance = () => {
    if (step === 'opening') {
      if (subStep < OPENING_STEPS.length - 1) setSubStep(s => s + 1)
      else { setStep(`mystery-${mysteryIdx}`); setSubStep(0); setAveMarias(0) }
    } else if (step.startsWith('mystery-')) {
      const idx = parseInt(step.split('-')[1])
      if (subStep === 0) { // announce → notre pere
        setSubStep(1)
      } else if (subStep === 1) { // notre pere → 1st hail mary
        setSubStep(2); setAveMarias(0)
      } else if (subStep >= 2 && subStep < 12) { // hail mary 1-10
        const next = subStep + 1
        setAveMarias(am => am + 1)
        if (next > 12) {
          setSubStep(12) // gloria
        } else {
          setSubStep(next)
        }
      } else if (subStep === 12) { // gloria → o jesus
        setSubStep(13)
      } else { // o jesus → next mystery or closing
        if (idx < 4) {
          const nextIdx = idx + 1
          setMysteryIdx(nextIdx)
          setStep(`mystery-${nextIdx}`)
          setSubStep(0)
          setAveMarias(0)
        } else {
          setStep('closing')
          setSubStep(0)
        }
      }
    } else if (step === 'closing') {
      if (subStep < CLOSING_STEPS.length - 1) setSubStep(s => s + 1)
      else setFinished(true)
    }
  }

  const back = () => {
    if (finished) { setFinished(false); return }
    if (step === 'opening' && subStep > 0) { setSubStep(s => s - 1); return }
    if (step === 'closing' && subStep > 0) { setSubStep(s => s - 1); return }
    if (step.startsWith('mystery-')) {
      const idx = parseInt(step.split('-')[1])
      if (subStep > 0) { setSubStep(s => s - 1); return }
      if (idx > 0) { setMysteryIdx(idx - 1); setStep(`mystery-${idx - 1}`); setSubStep(13); return }
      setStep('opening'); setSubStep(OPENING_STEPS.length - 1)
    }
  }

  const getTitle = () => {
    if (finished) return 'Terminé !'
    if (step === 'opening') return OPENING_STEPS[subStep].label
    if (step === 'closing') return CLOSING_STEPS[subStep].label
    const idx = parseInt(step.split('-')[1])
    const m = mystery.list[idx]
    if (subStep === 0) return `${idx + 1}ᵉ mystère : ${m.title}`
    if (subStep === 1) return 'Notre Père'
    if (subStep >= 2 && subStep <= 11) return `Je vous salue Marie ${subStep - 1}/10`
    if (subStep === 12) return 'Gloire au Père'
    return 'Ô Jésus...'
  }

  const getPrayer = () => {
    if (step === 'opening') return OPENING_STEPS[subStep].prayer
    if (step === 'closing') return CLOSING_STEPS[subStep].prayer
    const idx = parseInt(step.split('-')[1])
    const m = mystery.list[idx]
    if (subStep === 0) return m.meditation
    if (subStep === 1) return NOTRE_PERE
    if (subStep >= 2 && subStep <= 11) return JE_VOUS_SALUE
    if (subStep === 12) return GLOIRE_AU_PERE
    return O_JESUS
  }

  const getTotalProgress = () => {
    let total = OPENING_STEPS.length
    total += mystery.list.length * SUB_TOTAL
    total += CLOSING_STEPS.length
    let current = 0
    if (step === 'opening') current = subStep
    else if (step.startsWith('mystery-')) {
      current = OPENING_STEPS.length + parseInt(step.split('-')[1]) * SUB_TOTAL + subStep
    } else if (step === 'closing') {
      current = OPENING_STEPS.length + 5 * SUB_TOTAL + subStep
    }
    return Math.round((current / total) * 100)
  }

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="card text-center py-12 space-y-4">
        <div className="text-5xl mb-2">🌹</div>
        <h3 className="text-xl font-serif font-semibold text-slate-100">Chapelet terminé</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          Vous avez prié le chapelet du Rosaire avec {mystery.list.length} {mystery.label.toLowerCase()}. Que Marie vous accompagne dans votre journée.
        </p>
        <button onClick={reset} className="btn-primary flex items-center gap-2 mx-auto">
          <RotateCcw size={15} /> Recommencer
        </button>
      </motion.div>
    )
  }

  const progress = getTotalProgress()
  const decadeIdx = step.startsWith('mystery-') ? parseInt(step.split('-')[1]) : -1

  return (
    <div className="space-y-4">
      {/* Mystery selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Object.entries(MYSTERIES).map(([key, m]) => (
          <button key={key} onClick={() => { setMysteryKey(key); reset() }}
            className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${
              mysteryKey === key
                ? `bg-gradient-to-br ${m.color} ${m.borderColor} ${m.textColor}`
                : 'bg-navy-700 border-navy-600 text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="block text-base mb-0.5">{m.icon}</span>
            {m.label.replace('Mystères ', '')}
            <span className="block text-[10px] opacity-70 mt-0.5">{m.days}</span>
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-600 text-center">
        Aujourd'hui recommandé : <span className={`font-medium ${mystery.textColor}`}>{mystery.label}</span>
      </p>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Progression</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400" />
        </div>
      </div>

      {/* Decade beads (only during mysteries) */}
      {decadeIdx >= 0 && (
        <div className="text-center">
          <p className="text-xs text-slate-600 mb-1">{mystery.list[decadeIdx].title}</p>
          {subStep >= 2 && subStep <= 11 && (
            <ProgressBeads total={10} current={subStep - 1} color="bg-gold-400" />
          )}
          <div className="flex justify-center gap-2 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all ${
                i < decadeIdx ? 'bg-spirit-400' : i === decadeIdx ? 'bg-gold-400 ring-2 ring-gold-400/30' : 'bg-navy-700'
              }`} />
            ))}
          </div>
        </div>
      )}

      {/* Current step card */}
      <AnimatePresence mode="wait">
        <motion.div key={`${step}-${subStep}`}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={`card-glass bg-gradient-to-br ${mystery.color} border ${mystery.borderColor}`}
        >
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${mystery.textColor}`}>
            {step === 'opening' ? 'Ouverture' : step === 'closing' ? 'Clôture' : `Mystère ${decadeIdx + 1}/5`}
          </p>
          <h3 className="font-serif text-lg font-semibold text-slate-100 mb-3">{getTitle()}</h3>
          {/* Meditation text for mystery announcement */}
          {step.startsWith('mystery-') && subStep === 0 && (
            <p className="text-sm text-slate-300 leading-relaxed mb-4 italic">
              {mystery.list[decadeIdx].meditation}
            </p>
          )}
          <div className="p-4 bg-navy-900/60 rounded-xl border border-navy-700">
            <p className="text-sm text-slate-300 leading-relaxed font-serif italic">
              "{getPrayer()}"
            </p>
          </div>
          {step.startsWith('mystery-') && subStep === 0 && (
            <p className="text-xs text-slate-600 mt-2">Réf. : {mystery.list[decadeIdx].ref}</p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={back} className="btn-secondary flex items-center gap-2 text-sm">
          <ChevronLeft size={15} /> Précédent
        </button>
        <button onClick={advance} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
          Suivant <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ─── Chapelet de la Divine Miséricorde ────────────────────────────────────────
function DivineMercy() {
  const [stepIdx, setStepIdx] = useState(0)
  const [mercyCount, setMercyCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const step = DIVINE_MERCY_STEPS[stepIdx]

  const reset = () => { setStepIdx(0); setMercyCount(0); setFinished(false) }

  const advance = () => {
    if (step.type === 'decade') {
      if (mercyCount < 10) {
        setMercyCount(c => c + 1)
        return
      }
      setMercyCount(0)
    }
    if (stepIdx < DIVINE_MERCY_STEPS.length - 1) setStepIdx(s => s + 1)
    else setFinished(true)
  }

  const back = () => {
    if (finished) { setFinished(false); return }
    if (step.type === 'decade' && mercyCount > 0) { setMercyCount(c => c - 1); return }
    if (stepIdx > 0) setStepIdx(s => s - 1)
  }

  const progress = Math.round((stepIdx / (DIVINE_MERCY_STEPS.length - 1)) * 100)

  if (finished) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="card text-center py-12 space-y-4">
        <div className="text-5xl mb-2">❤️‍🔥</div>
        <h3 className="text-xl font-serif font-semibold text-slate-100">Chapelet terminé</h3>
        <p className="text-slate-400 text-sm max-w-xs mx-auto">
          Vous avez prié le Chapelet de la Divine Miséricorde. Jésus a dit à sainte Faustine : « Cette prière est toute-puissante. »
        </p>
        <button onClick={reset} className="btn-primary flex items-center gap-2 mx-auto">
          <RotateCcw size={15} /> Recommencer
        </button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="card-glass border border-red-500/15 bg-gradient-to-br from-red-600/10 to-transparent">
        <p className="text-xs text-slate-500 leading-relaxed">
          Le Chapelet de la Divine Miséricorde fut révélé à <span className="text-red-400">sainte Faustine Kowalska</span> par Jésus en 1935.
          Il se prie de préférence à <span className="text-red-400">15h</span>, l'Heure de la Miséricorde.
        </p>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-slate-600 mb-1">
          <span>Étape {stepIdx + 1} / {DIVINE_MERCY_STEPS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
          <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
            className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400" />
        </div>
      </div>

      {/* Decade beads */}
      {step.type === 'decade' && (
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-2">Notre Père + 10 invocations — Décade {step.decadeNum}/5</p>
          <ProgressBeads total={10} current={mercyCount} color="bg-red-400" />
          <div className="flex justify-center gap-2 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all ${
                i < step.decadeNum - 1 ? 'bg-red-400/60' : i === step.decadeNum - 1 ? 'bg-red-400 ring-2 ring-red-400/30' : 'bg-navy-700'
              }`} />
            ))}
          </div>
        </div>
      )}

      {/* Step card */}
      <AnimatePresence mode="wait">
        <motion.div key={`${stepIdx}-${mercyCount}`}
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="card-glass border border-red-500/20 bg-gradient-to-br from-red-600/10 to-transparent"
        >
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
            {step.type === 'decade' ? `${step.decadeNum}ᵉ décade • invocation ${mercyCount}/10` : step.label}
          </p>
          <p className="text-sm text-slate-400 mb-3 leading-relaxed">{step.text}</p>

          {/* For decades: show Notre Père first, then invocations */}
          {step.type === 'decade' ? (
            mercyCount === 0 ? (
              <div className="p-4 bg-navy-900/60 rounded-xl border border-navy-700">
                <p className="text-xs text-gold-500 mb-1 font-semibold">Notre Père</p>
                <p className="text-sm text-slate-300 leading-relaxed font-serif italic">"{NOTRE_PERE}"</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-navy-900/60 rounded-xl border border-red-800/30">
                  <p className="text-xs text-red-400 mb-1 font-semibold">Prière de la Miséricorde</p>
                  <p className="text-sm text-slate-300 leading-relaxed font-serif italic">"{step.mercy}"</p>
                </div>
                <div className="p-3 bg-navy-900/40 rounded-xl border border-navy-700">
                  <p className="text-xs text-slate-500 mb-1">Réponse</p>
                  <p className="text-sm text-slate-400 italic font-serif">"{step.mercyResponse}"</p>
                </div>
              </div>
            )
          ) : (
            <div className="p-4 bg-navy-900/60 rounded-xl border border-navy-700">
              <p className="text-sm text-slate-300 leading-relaxed font-serif italic">"{step.prayer}"</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={back} className="btn-secondary flex items-center gap-2 text-sm">
          <ChevronLeft size={15} /> Précédent
        </button>
        <button onClick={advance} className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm">
          {step.type === 'decade' && mercyCount < 10
            ? `Invocation suivante (${mercyCount + 1}/10)`
            : 'Suivant'
          }
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ─── Page principale ───────────────────────────────────────────────────────────
export default function Chapelet() {
  const [tab, setTab] = useState('rosaire') // 'rosaire' | 'divine-mercy'

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Chapelet</h1>
        <p className="text-slate-500 text-sm mt-0.5">Prière contemplative guidée</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-navy-800 rounded-2xl border border-navy-600">
        <button onClick={() => setTab('rosaire')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'rosaire'
              ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          🌹 Chapelet du Rosaire
        </button>
        <button onClick={() => setTab('divine-mercy')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'divine-mercy'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          ❤️‍🔥 Divine Miséricorde
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === 'rosaire' ? (
          <motion.div key="rosaire"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <Rosaire />
          </motion.div>
        ) : (
          <motion.div key="divine"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          >
            <DivineMercy />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
