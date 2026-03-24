import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts'
import {
  TrendingUp, Flame, BookOpen, Heart, Target, Trophy, Star,
  Calendar, ChevronRight, Award, Zap
} from 'lucide-react'
import { useSpiritualContext } from '../context/SpiritualContext'
import { TOTAL_CHAPTERS, ALL_BOOKS } from '../data/bibleBooks'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-700 border border-navy-500 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: <span className="text-slate-200">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

function StatCard({ icon: Icon, label, value, sub, color, custom }) {
  return (
    <motion.div variants={fadeUp} custom={custom} className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{label}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-600 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.replace('text-', 'bg-').replace('400', '500/10')}`}>
          <Icon size={18} className={color} />
        </div>
      </div>
    </motion.div>
  )
}

function HeatmapCalendar({ dailyLogs }) {
  const weeks = []
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - 83) // 12 weeks

  for (let w = 0; w < 12; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + w * 7 + d)
      const key = date.toISOString().split('T')[0]
      const log = dailyLogs[key] || {}
      const level = (log.prayed ? 1 : 0) + (log.bibleRead ? 1 : 0)
      week.push({ date: key, level, future: date > today })
    }
    weeks.push(week)
  }

  const colors = [
    'bg-navy-700',         // 0 - nothing
    'bg-gold-500/30',      // 1 - partial
    'bg-gold-500',         // 2 - full
  ]

  return (
    <div className="card">
      <h3 className="section-title mb-4">Calendrier d'activité</h3>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={day.future ? '' : `${day.date} : ${day.level === 2 ? 'Prière + Bible' : day.level === 1 ? 'Partiel' : 'Aucun'}`}
                className={`w-4 h-4 rounded-sm transition-all ${day.future ? 'bg-navy-800 opacity-30' : colors[day.level]}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-slate-600">Moins</span>
        {colors.map((c, i) => <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />)}
        <span className="text-xs text-slate-600">Plus</span>
      </div>
    </div>
  )
}

export default function Progress() {
  const {
    prayerStreak, readingStreak, totalChaptersRead,
    getLast30Days, getLast7Days, getWeeklyStats,
    prayerRequests, journalEntries, dailyLogs, goals, setGoals
  } = useSpiritualContext()

  const [period, setPeriod] = useState('7') // '7' | '30'
  const data = period === '7' ? getLast7Days() : getLast30Days()
  const weekly = getWeeklyStats()

  const answeredCount = prayerRequests.filter(r => r.answered).length
  const biblePercent = Math.round((totalChaptersRead / TOTAL_CHAPTERS) * 100 * 10) / 10

  const chartData = data.map(d => ({
    name: d.label,
    'Prière': d.prayed,
    'Bible': d.bibleRead,
    'Min. prière': d.prayerMinutes,
    'Chapitres': d.chaptersRead,
  }))

  const pieData = [
    { name: 'Ancien Testament', value: ALL_BOOKS.slice(0, 39).reduce((s, b) => {
      for (let c = 1; c <= b.chapters; c++) {
        if (dailyLogs) {} // access closure
      }
      return s
    }, 0) },
  ]

  const achievements = [
    { icon: Flame, label: 'Série de prière', value: prayerStreak, suffix: 'jours', color: 'text-orange-400', threshold: 7 },
    { icon: BookOpen, label: 'Série de lecture', value: readingStreak, suffix: 'jours', color: 'text-spirit-400', threshold: 7 },
    { icon: Heart, label: 'Prières exaucées', value: answeredCount, suffix: '', color: 'text-red-400', threshold: 5 },
    { icon: Star, label: 'Entrées de journal', value: journalEntries.length, suffix: '', color: 'text-gold-400', threshold: 10 },
  ]

  return (
    <motion.div variants={{ visible: {} }} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} custom={0}>
        <h1 className="text-2xl font-bold text-slate-100">Progrès</h1>
        <p className="text-slate-500 text-sm mt-0.5">Suivez votre croissance spirituelle</p>
      </motion.div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Flame} label="Série prière" value={prayerStreak} sub="jours consécutifs" color="text-orange-400" custom={1} />
        <StatCard icon={BookOpen} label="Série lecture" value={readingStreak} sub="jours consécutifs" color="text-spirit-400" custom={2} />
        <StatCard icon={Target} label="Bible lue" value={`${biblePercent}%`} sub={`${totalChaptersRead} / ${TOTAL_CHAPTERS} ch.`} color="text-emerald-400" custom={3} />
        <StatCard icon={Heart} label="Prières exaucées" value={answeredCount} sub={`sur ${prayerRequests.length} demandes`} color="text-red-400" custom={4} />
      </div>

      {/* Bible reading progress bar */}
      <motion.div variants={fadeUp} custom={5} className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-slate-200 text-sm">Progression — Bible complète</h3>
          <span className="text-gold-400 font-bold text-sm">{biblePercent}%</span>
        </div>
        <div className="h-3 bg-navy-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${biblePercent}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-600">Genèse</span>
          <span className="text-xs text-slate-600">{totalChaptersRead} chapitres lus</span>
          <span className="text-xs text-slate-600">Apocalypse</span>
        </div>
      </motion.div>

      {/* Activity chart */}
      <motion.div variants={fadeUp} custom={6} className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Activité quotidienne</h3>
          <div className="flex gap-1">
            {['7', '30'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  period === p ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20' : 'bg-navy-700 text-slate-500 hover:text-slate-300'
                }`}
              >
                {p}j
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Prière" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Bible" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-2 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-sm bg-orange-500 inline-block" />Prière</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-sm bg-spirit-500 inline-block" />Bible</span>
        </div>
      </motion.div>

      {/* Prayer minutes chart */}
      <motion.div variants={fadeUp} custom={7} className="card">
        <h3 className="section-title mb-4">Minutes de prière</h3>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="prayerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Min. prière" stroke="#f59e0b" fill="url(#prayerGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Heat map */}
      <motion.div variants={fadeUp} custom={8}>
        <HeatmapCalendar dailyLogs={dailyLogs} />
      </motion.div>

      {/* Achievements */}
      <motion.div variants={fadeUp} custom={9} className="card">
        <h3 className="section-title mb-4">Accomplissements</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map(({ icon: Icon, label, value, suffix, color, threshold }) => {
            const unlocked = value >= threshold
            return (
              <div
                key={label}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  unlocked ? 'bg-gold-500/5 border-gold-500/20' : 'bg-navy-700 border-navy-600 opacity-60'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${unlocked ? color.replace('text-', 'bg-').replace('400', '500/15') : 'bg-navy-800'}`}>
                  {unlocked ? <Trophy size={16} className="text-gold-400" /> : <Icon size={16} className={color} />}
                </div>
                <div>
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className={`text-sm font-bold ${unlocked ? 'text-gold-400' : color}`}>
                    {value}{suffix} {unlocked && '✓'}
                  </p>
                  {!unlocked && <p className="text-xs text-slate-700">Objectif: {threshold}{suffix}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Weekly goals */}
      <motion.div variants={fadeUp} custom={10} className="card">
        <h3 className="section-title mb-4 flex items-center gap-2">
          <Target size={18} className="text-gold-400" />
          Objectifs hebdomadaires
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm text-slate-400">Jours de prière</span>
              <span className="text-sm font-medium text-orange-400">{weekly.prayerDays} / {goals.weeklyPrayerDays}</span>
            </div>
            <div className="h-2.5 bg-navy-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((weekly.prayerDays / goals.weeklyPrayerDays) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-orange-500"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-sm text-slate-400">Jours de lecture</span>
              <span className="text-sm font-medium text-spirit-400">{weekly.readingDays} / {goals.weeklyBibleChapters}</span>
            </div>
            <div className="h-2.5 bg-navy-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((weekly.readingDays / goals.weeklyBibleChapters) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="h-full rounded-full bg-spirit-500"
              />
            </div>
          </div>
        </div>

        {/* Goal editor */}
        <div className="mt-4 pt-4 border-t border-navy-600">
          <p className="text-xs text-slate-500 mb-3">Modifier mes objectifs :</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Jours de prière / semaine</label>
              <input
                type="number"
                min="1" max="7"
                value={goals.weeklyPrayerDays}
                onChange={e => setGoals(g => ({ ...g, weeklyPrayerDays: Math.min(7, Math.max(1, +e.target.value)) }))}
                className="input text-sm text-center"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1">Jours de lecture / semaine</label>
              <input
                type="number"
                min="1" max="7"
                value={goals.weeklyBibleChapters}
                onChange={e => setGoals(g => ({ ...g, weeklyBibleChapters: Math.min(7, Math.max(1, +e.target.value)) }))}
                className="input text-sm text-center"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
