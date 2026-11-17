import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, Check } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useSpiritualContext } from '../context/SpiritualContext'
import { DAILY_VERSES } from '../data/bibleBooks'
import { useMesseDuJour } from '../hooks/useMesse'
import { getEvangile, LITURGICAL_COLORS } from '../utils/aelf'
import Icon3D from '../components/Icon3D'

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } }),
}
const Section = ({ i, children, className = '' }) => (
  <motion.section variants={fadeUp} initial="hidden" animate="visible" custom={i} className={className}>{children}</motion.section>
)

function greeting(hour) {
  if (hour < 5) return 'Bonne nuit'
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

export default function Dashboard() {
  const {
    getTodayLog, profile, growth, getThisWeek, getEncouragementMessage,
    goalSuggestion, setDailyMinutes, snoozeGoalSuggestion,
  } = useSpiritualContext()
  const { data: messe } = useMesseDuJour()
  const evangile = getEvangile(messe)

  const now = new Date()
  const todayLog = getTodayLog()
  const momentDone = (todayLog.activities?.moment || 0) > 0
  const week = getThisWeek()
  const weekCount = week.filter(d => d.active).length
  const encourage = getEncouragementMessage()
  const isMercyHour = now.getHours() === 15
  const couleur = LITURGICAL_COLORS[messe?.couleur]

  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  const dailyVerse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length]

  return (
    <div className="space-y-5">
      {/* En-tête : date et calendrier liturgique */}
      <Section i={0}>
        <p className="text-slate-400 text-sm capitalize">{format(now, 'EEEE d MMMM', { locale: fr })}</p>
        <h1 className="text-[28px] font-bold text-slate-50 tracking-tight">{greeting(now.getHours())} 🙏</h1>
        {messe && (
          <p className="mt-1 text-sm text-slate-400 flex items-center gap-2">
            {couleur && <span className={`inline-block w-2.5 h-2.5 rounded-full ${couleur.className}`} title={`Couleur liturgique : ${couleur.label}`} />}
            <span className="truncate">{messe.fete ? `${messe.fete} · ` : ''}{messe.jour[0]}</span>
          </p>
        )}
      </Section>

      {/* Message bienveillant */}
      <Section i={1}>
        <p className={`text-[15px] leading-relaxed ${encourage.type === 'welcome' ? 'text-gold-200' : 'text-slate-300'}`}>
          {encourage.message}
        </p>
      </Section>

      {/* Le cœur de l'appli : Mon moment avec Dieu */}
      <Section i={2}>
        <Link to="/moment"
          className="block relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-gold-500/20 via-gold-600/10 to-transparent border border-gold-400/20 active:scale-[0.99] transition-transform">
          <div className="absolute -right-6 -top-6 w-40 h-40 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <Icon3D name={momentDone ? 'sparkles' : 'candle'} size={64} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-300">
                {momentDone ? 'Moment vécu aujourd’hui' : 'Mon moment avec Dieu'}
              </p>
              <h2 className="text-xl font-semibold text-slate-50 mt-1 leading-snug">
                {momentDone ? 'Revenir prier un instant' : `${profile.dailyMinutes} minutes pour Lui`}
              </h2>
              <p className="text-sm text-slate-400 mt-1">Évangile · méditation · prière · une ligne au journal</p>
            </div>
          </div>
          <div className={`mt-5 w-full min-h-[52px] rounded-2xl flex items-center justify-center gap-2 font-semibold text-[16px] ${
            momentDone ? 'bg-white/10 text-slate-100' : 'bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20'}`}>
            {momentDone ? <><Check size={18} /> Prier encore</> : 'Commencer'}
          </div>
        </Link>
      </Section>

      {/* Heure de la Miséricorde (15h) */}
      {isMercyHour && (
        <Section i={3}>
          <Link to="/priere?onglet=chapelet&chapelet=misericorde"
            className="flex items-center gap-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-400/20">
            <Icon3D name="blood" size={40} />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">C'est l'Heure de la Miséricorde</p>
              <p className="text-sm text-slate-400">15h — prier le chapelet de la Divine Miséricorde</p>
            </div>
            <ChevronRight size={18} className="text-slate-500" />
          </Link>
        </Section>
      )}

      {/* Proposition d'augmenter l'objectif, en douceur */}
      {goalSuggestion && (
        <Section i={3}>
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-400/20">
            <div className="flex items-center gap-3">
              <Icon3D name="herb" size={36} />
              <p className="text-[15px] text-slate-200 leading-snug">
                Vous avez prié {goalSuggestion.from} minutes {goalSuggestion.days} jours cette semaine. Passer à {goalSuggestion.to} minutes ?
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setDailyMinutes(goalSuggestion.to)} className="btn-primary flex-1 min-h-[44px]">Oui, {goalSuggestion.to} min</button>
              <button onClick={snoozeGoalSuggestion} className="btn-secondary min-h-[44px]">Plus tard</button>
            </div>
          </div>
        </Section>
      )}

      {/* Ma semaine + croissance */}
      <Section i={4}>
        <Link to="/chemin" className="block card-glass active:scale-[0.99] transition-transform">
          <div className="flex items-center gap-4">
            <Icon3D name={growth.stage.icon} size={52} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-100">{growth.stage.name}</p>
              <p className="text-sm text-slate-400">
                {growth.nextStage
                  ? `Encore ${growth.toNext} jour${growth.toNext > 1 ? 's' : ''} de rencontre avant « ${growth.nextStage.name.toLowerCase()} »`
                  : 'Votre arbre abrite les oiseaux du ciel.'}
              </p>
            </div>
            <ChevronRight size={18} className="text-slate-600" />
          </div>
          {growth.nextStage && (
            <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" style={{ width: `${growth.pct}%` }} />
            </div>
          )}
          <div className="mt-4 flex items-center justify-between">
            {week.map(d => (
              <div key={d.date} className="flex flex-col items-center gap-1.5">
                <span className={`text-[11px] ${d.isToday ? 'text-gold-300 font-semibold' : 'text-slate-500'}`}>{d.letter}</span>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  d.active ? 'bg-gold-500 text-navy-950' : d.isToday ? 'border-2 border-gold-400/50' : d.future ? 'bg-white/[0.02]' : 'bg-white/5'
                }`}>
                  {d.active && <Check size={15} strokeWidth={3} />}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500 text-center">
            {weekCount === 0 ? 'Chaque jour est un nouveau départ.' : `${weekCount} jour${weekCount > 1 ? 's' : ''} avec Dieu cette semaine`}
          </p>
        </Link>
      </Section>

      {/* Parole du jour */}
      <Section i={5}>
        <Link to={evangile ? '/bible?onglet=jour' : '/bible'} className="block card-glass active:scale-[0.99] transition-transform">
          <div className="flex items-center gap-2 mb-2">
            <Icon3D name="scroll" size={22} />
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-300">
              {evangile ? 'Évangile du jour' : 'Verset du jour'}
            </span>
          </div>
          {evangile ? (
            <>
              <p className="text-verse text-[17px]">{evangile.titre || evangile.texte.slice(0, 140) + '…'}</p>
              <p className="text-sm text-gold-400 mt-2">{evangile.ref}</p>
            </>
          ) : (
            <>
              <p className="text-verse text-[17px]">« {dailyVerse.text} »</p>
              <p className="text-sm text-gold-400 mt-2">{dailyVerse.ref_fr}</p>
            </>
          )}
        </Link>
      </Section>

      {/* Pour aller plus loin */}
      <Section i={6}>
        <h2 className="text-lg font-semibold text-slate-100 mb-3">Pour aller plus loin</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { to: '/priere?onglet=chapelet', icon: 'beads', label: 'Chapelet', sub: 'Rosaire, Miséricorde' },
            { to: '/bible', icon: 'book', label: 'Bible', sub: 'Lire un chapitre' },
            { to: '/journal', icon: 'writing', label: 'Journal', sub: 'Écrire à Dieu' },
            { to: '/priere?onglet=intentions', icon: 'heart', label: 'Intentions', sub: 'Confier une personne' },
          ].map(c => (
            <Link key={c.to} to={c.to}
              className="p-4 rounded-2xl bg-white/[0.04] border border-white/5 active:scale-[0.98] transition-transform min-h-[112px] flex flex-col justify-between">
              <Icon3D name={c.icon} size={36} />
              <div>
                <p className="font-semibold text-slate-100 text-[15px]">{c.label}</p>
                <p className="text-xs text-slate-500">{c.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  )
}
