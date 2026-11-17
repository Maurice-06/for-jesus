import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, BookOpen, Flame, Star, ChevronRight, CheckCircle2, Circle, Sparkles, AlertCircle, Info } from 'lucide-react'
import { useSpiritualContext } from '../context/SpiritualContext'
import { DAILY_VERSES } from '../data/bibleBooks'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } }),
}

function StreakBadge({ count, label, icon: Icon, color }) {
  return (
    <div className={`flex items-center gap-3 card p-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-100">{count}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  )
}

function DailyCheckItem({ done, label, icon: Icon, onCheck, linkTo }) {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
      done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-navy-700 border-navy-600 hover:border-navy-500'
    }`}>
      <button
        onClick={onCheck}
        disabled={done}
        aria-label={done ? `${label} — fait` : label}
        className={`flex-shrink-0 min-w-[40px] min-h-[40px] -m-2 flex items-center justify-center transition-all duration-200 ${done ? 'text-emerald-400' : 'text-slate-500 hover:text-gold-400'}`}
      >
        {done ? <CheckCircle2 size={22} /> : <Circle size={22} />}
      </button>
      <Icon size={16} className={done ? 'text-emerald-400' : 'text-slate-500'} />
      <span className={`text-sm font-medium flex-1 ${done ? 'text-emerald-300 line-through decoration-emerald-500/40' : 'text-slate-300'}`}>
        {label}
      </span>
      {!done && (
        <Link to={linkTo} className="text-xs text-gold-500 hover:text-gold-400 transition-colors py-2 px-1">
          Faire <ChevronRight size={12} className="inline" />
        </Link>
      )}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { getTodayLog, markPrayed, prayerStreak, readingStreak, getWeeklyStats, getEncouragementMessage, prayerRequests, totalChaptersRead } = useSpiritualContext()
  const todayLog = getTodayLog()
  const weeklyStats = getWeeklyStats()
  const encourage = getEncouragementMessage()

  // Daily verse rotation based on day of year
  const now = new Date()
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  const dailyVerse = DAILY_VERSES[dayOfYear % DAILY_VERSES.length]

  const activePrayers = prayerRequests.filter(r => !r.answered).length

  const EncourageIcon = {
    alert: AlertCircle,
    info: Info,
    success: Sparkles,
  }[encourage.type]

  const encourageStyle = {
    alert: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
  }[encourage.type]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-slate-500 text-sm capitalize">
              {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
            </p>
            <h1 className="text-2xl font-bold text-slate-100">
              Bonjour <span className="text-gradient-gold">bien-aimé(e)</span>
            </h1>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg glow-gold animate-pulse-slow">
            <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
              <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
              <rect x="4" y="7" width="16" height="3" rx="1.5"/>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Encouragement banner */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${encourageStyle}`}>
          <EncourageIcon size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">{encourage.message}</p>
        </div>
      </motion.div>

      {/* Daily verse */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2}>
        <div className="card-glass relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
          <div className="flex items-center gap-2 mb-3">
            <Star size={14} className="text-gold-400" />
            <span className="text-xs font-medium text-gold-400 uppercase tracking-wider">Verset du jour</span>
          </div>
          <blockquote className="text-verse mb-3">"{dailyVerse.text}"</blockquote>
          <div className="flex items-center justify-between">
            <cite className="text-sm text-gold-500 font-medium not-italic">{dailyVerse.ref_fr}</cite>
            <Link to="/bible" className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
              Ouvrir la Bible <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Daily checklist */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
        <h2 className="section-title mb-3">Aujourd'hui</h2>
        <div className="space-y-2">
          <DailyCheckItem
            done={todayLog.prayed}
            label="J'ai prié aujourd'hui"
            icon={Heart}
            onCheck={() => markPrayed(0)}
            linkTo="/priere"
          />
          <DailyCheckItem
            done={todayLog.bibleRead}
            label="J'ai lu la Bible aujourd'hui"
            icon={BookOpen}
            onCheck={() => navigate('/bible')}
            linkTo="/bible"
          />
        </div>
      </motion.div>

      {/* Streaks */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
        <h2 className="section-title mb-3">Mes séries</h2>
        <div className="grid grid-cols-2 gap-3">
          <StreakBadge
            count={prayerStreak}
            label={prayerStreak === 1 ? 'jour de prière' : 'jours de prière'}
            icon={Flame}
            color="bg-orange-500/15 text-orange-400"
          />
          <StreakBadge
            count={readingStreak}
            label={readingStreak === 1 ? 'jour de lecture' : 'jours de lecture'}
            icon={BookOpen}
            color="bg-spirit-500/15 text-spirit-400"
          />
        </div>
      </motion.div>

      {/* Weekly summary */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5}>
        <h2 className="section-title mb-3">Cette semaine</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Jours de prière', value: weeklyStats.prayerDays, suffix: '/7', color: 'text-orange-400' },
            { label: 'Jours de lecture', value: weeklyStats.readingDays, suffix: '/7', color: 'text-spirit-400' },
            { label: 'Minutes de prière', value: weeklyStats.totalPrayerMinutes, suffix: 'min', color: 'text-gold-400' },
            { label: 'Chapitres lus', value: weeklyStats.totalChapters, suffix: '', color: 'text-emerald-400' },
          ].map(({ label, value, suffix, color }) => (
            <div key={label} className="card text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}<span className="text-sm text-slate-500 font-normal">{suffix}</span></p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick links */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6}>
        <h2 className="section-title mb-3">Accès rapide</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/priere" className="card hover:border-gold-500/30 hover:bg-navy-700 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Heart size={18} className="text-red-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200 text-sm">Prière</p>
                <p className="text-xs text-slate-500">{activePrayers} demandes actives</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
          </Link>
          <Link to="/bible" className="card hover:border-gold-500/30 hover:bg-navy-700 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-spirit-500/10 flex items-center justify-center">
                <BookOpen size={18} className="text-spirit-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200 text-sm">Bible</p>
                <p className="text-xs text-slate-500">{totalChaptersRead} chapitres lus</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
          </Link>
          <Link to="/journal" className="card hover:border-gold-500/30 hover:bg-navy-700 transition-all duration-200 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <Sparkles size={18} className="text-gold-400" />
              </div>
              <div>
                <p className="font-medium text-slate-200 text-sm">Journal</p>
                <p className="text-xs text-slate-500">Écrire aujourd'hui</p>
              </div>
              <ChevronRight size={16} className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
