import { useState, useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { format, subDays, startOfWeek, addDays, differenceInCalendarDays, parseISO } from 'date-fns'

const today = () => format(new Date(), 'yyyy-MM-dd')
const EMPTY_LOG = { prayed: false, bibleRead: false, prayerMinutes: 0, chaptersRead: [], activities: {} }

// crypto.randomUUID n'existe qu'en contexte sécurisé (https / localhost)
const uuidv4 = () =>
  (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

// Toutes les clés sauvegardées par l'appli (pour l'export / import)
export const STORAGE_KEYS = [
  'fj_dailyLogs', 'fj_prayerRequests', 'fj_journalEntries', 'fj_bookmarks',
  'fj_readingProgress', 'fj_goals', 'fj_activePlan', 'fj_planStart', 'fj_bibleLast',
  'fj_profile', 'fj_neuvaine', 'fj_settings',
]

// ─── Activités : chaque onglet fait avancer le chemin ─────────────────────────
// prayer : compte comme « j'ai prié » · word : compte comme « j'ai lu la Parole »
export const ACTIVITIES = {
  moment:      { label: 'Moment avec Dieu',       kind: 'prayer', icon: 'candle' },
  priere:      { label: 'Prière',                 kind: 'prayer', icon: 'hands' },
  chapelet:    { label: 'Chapelet',               kind: 'prayer', icon: 'beads' },
  rosaire:     { label: 'Rosaire complet',        kind: 'prayer', icon: 'rose' },
  misericorde: { label: 'Divine Miséricorde',     kind: 'prayer', icon: 'blood' },
  neuvaine:    { label: 'Neuvaine',               kind: 'prayer', icon: 'calendar' },
  examen:      { label: 'Examen de conscience',   kind: 'prayer', icon: 'mirror' },
  bible:       { label: 'Lecture de la Bible',    kind: 'word',   icon: 'book' },
  evangile:    { label: 'Évangile du jour',       kind: 'word',   icon: 'scroll' },
  journal:     { label: 'Journal',                kind: 'other',  icon: 'journal' },
  intention:   { label: 'Intention confiée',      kind: 'other',  icon: 'heart' },
}

// ─── Croissance : la parabole du grain de sénevé (Mt 13, 31-32) ───────────────
// Basée sur le nombre total de jours de rencontre avec Dieu : elle ne recule jamais.
export const STAGES = [
  { min: 0,   name: 'La graine',         icon: 'seedling',  text: 'Tout commence petit. Une graine semée avec confiance.' },
  { min: 7,   name: 'La pousse',         icon: 'herb',      text: 'Ta prière prend racine, jour après jour.' },
  { min: 21,  name: 'La fleur',          icon: 'sunflower', text: 'Ta vie se tourne vers la lumière.' },
  { min: 50,  name: "L'arbre",           icon: 'tree',      text: 'Ta foi s’enracine et grandit.' },
  { min: 100, name: "L'arbre qui abrite", icon: 'dove',     text: '« Les oiseaux du ciel viennent faire leurs nids dans ses branches. »' },
]

// Objectif de prière quotidien : on démarre petit et on augmente pas à pas
export const MINUTE_LADDER = [2, 5, 10, 15, 20, 30]

const DEFAULT_PROFILE = { dailyMinutes: 2, suggestSnoozeUntil: null, lastVisit: null }

export function useSpiritual() {
  const [dailyLogs, setDailyLogs] = useLocalStorage('fj_dailyLogs', {})
  const [prayerRequests, setPrayerRequests] = useLocalStorage('fj_prayerRequests', [])
  const [journalEntries, setJournalEntries] = useLocalStorage('fj_journalEntries', [])
  const [bookmarks, setBookmarks] = useLocalStorage('fj_bookmarks', [])
  const [readingProgress, setReadingProgress] = useLocalStorage('fj_readingProgress', {})
  const [goals, setGoals] = useLocalStorage('fj_goals', { weeklyPrayerDays: 5, weeklyBibleChapters: 7 })
  const [storedProfile, setProfile] = useLocalStorage('fj_profile', DEFAULT_PROFILE)
  const profile = { ...DEFAULT_PROFILE, ...storedProfile }

  // ─── Retour après une absence (calculé une fois, à l'ouverture) ─────────────
  const [returnGap] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fj_profile'))
      return p?.lastVisit ? differenceInCalendarDays(new Date(), parseISO(p.lastVisit)) : 0
    } catch { return 0 }
  })
  useEffect(() => {
    setProfile(p => ({ ...DEFAULT_PROFILE, ...p, lastVisit: today() }))
  }, [setProfile])

  // ─── Journal quotidien ──────────────────────────────────────────────────────
  const getTodayLog = () => ({ ...EMPTY_LOG, ...dailyLogs[today()] })

  /** Enregistre une activité (et la prière / lecture qu'elle représente). */
  const logActivity = (type, minutes = 0) => {
    const def = ACTIVITIES[type]
    if (!def) return
    const date = today()
    const mins = Math.max(0, Math.round(minutes) || 0)
    setDailyLogs(prev => {
      const log = { ...EMPTY_LOG, ...prev[date] }
      const activities = { ...log.activities, [type]: (log.activities?.[type] || 0) + 1 }
      return {
        ...prev,
        [date]: {
          ...log,
          activities,
          prayed: log.prayed || def.kind === 'prayer',
          bibleRead: log.bibleRead || def.kind === 'word',
          prayerMinutes: log.prayerMinutes + (def.kind === 'prayer' ? mins : 0),
        },
      }
    })
  }

  // Compatibilité : « j'ai prié » simple
  const markPrayed = (minutes = 0) => logActivity('priere', minutes)

  const markBibleRead = (bookId, chapter) => {
    const date = today()
    const key = `${bookId}-${chapter}`
    setDailyLogs(prev => {
      const log = { ...EMPTY_LOG, ...prev[date] }
      if (log.chaptersRead.includes(key)) return prev
      return {
        ...prev,
        [date]: {
          ...log,
          bibleRead: true,
          chaptersRead: [...log.chaptersRead, key],
          activities: { ...log.activities, bible: (log.activities?.bible || 0) + 1 },
        },
      }
    })
    setReadingProgress(prev => ({ ...prev, [key]: date }))
  }

  // Annuler un « Marquer lu » fait par erreur
  const unmarkBibleRead = (bookId, chapter) => {
    const key = `${bookId}-${chapter}`
    const readOn = readingProgress[key]
    setReadingProgress(prev => {
      const { [key]: _removed, ...rest } = prev
      return rest
    })
    if (readOn) {
      setDailyLogs(prev => {
        const log = prev[readOn]
        if (!log) return prev
        const chaptersRead = (log.chaptersRead || []).filter(k => k !== key)
        const bibleCount = Math.max(0, (log.activities?.bible || 0) - 1)
        const activities = { ...log.activities, bible: bibleCount }
        return { ...prev, [readOn]: { ...log, chaptersRead, activities, bibleRead: chaptersRead.length > 0 || !!activities.evangile } }
      })
    }
  }

  // ─── Séries ─────────────────────────────────────────────────────────────────
  // La journée en cours n'est pas finie : si rien n'est fait aujourd'hui,
  // la série d'hier reste valable (elle ne retombe pas à 0 chaque matin).
  const calculateStreak = (type) => {
    const isDone = (d) => {
      const log = dailyLogs[format(d, 'yyyy-MM-dd')]
      return !!log && (type === 'prayer' ? log.prayed : log.bibleRead)
    }
    let streak = 0
    let currentDate = new Date()
    if (!isDone(currentDate)) currentDate = subDays(currentDate, 1)
    while (isDone(currentDate)) {
      streak++
      currentDate = subDays(currentDate, 1)
    }
    return streak
  }
  const prayerStreak = calculateStreak('prayer')
  const readingStreak = calculateStreak('reading')

  // ─── Statistiques ───────────────────────────────────────────────────────────
  const isActiveDay = (log) =>
    !!log && (log.prayed || log.bibleRead || Object.values(log.activities || {}).some(n => n > 0))

  const getLastDays = (n) => {
    const days = []
    for (let i = n - 1; i >= 0; i--) {
      const d = subDays(new Date(), i)
      const date = format(d, 'yyyy-MM-dd')
      const log = dailyLogs[date] || {}
      days.push({
        date,
        label: format(d, 'dd/MM'),
        prayed: log.prayed ? 1 : 0,
        bibleRead: log.bibleRead ? 1 : 0,
        prayerMinutes: log.prayerMinutes || 0,
        chaptersRead: (log.chaptersRead || []).length,
        active: isActiveDay(log),
      })
    }
    return days
  }
  const getLast30Days = () => getLastDays(30)
  const getLast7Days = () => getLastDays(7)

  const getWeeklyStats = () => {
    const last7 = getLast7Days()
    return {
      prayerDays: last7.filter(d => d.prayed).length,
      readingDays: last7.filter(d => d.bibleRead).length,
      totalPrayerMinutes: last7.reduce((s, d) => s + d.prayerMinutes, 0),
      totalChapters: last7.reduce((s, d) => s + d.chaptersRead, 0),
    }
  }

  // Semaine en cours (lundi → dimanche) : un point par jour de rencontre
  const getThisWeek = () => {
    const monday = startOfWeek(new Date(), { weekStartsOn: 1 })
    const todayKey = today()
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(monday, i)
      const date = format(d, 'yyyy-MM-dd')
      return { date, letter: 'LMMJVSD'[i], active: isActiveDay(dailyLogs[date]), isToday: date === todayKey, future: date > todayKey }
    })
  }

  const totalChaptersRead = Object.keys(readingProgress).length

  // Totaux de toutes les activités (pour les étapes du chemin)
  const totals = Object.values(dailyLogs).reduce((acc, log) => {
    const acts = log.activities && typeof log.activities === 'object' ? log.activities : {}
    for (const [k, n] of Object.entries(acts)) if (typeof n === 'number') acc[k] = (acc[k] || 0) + n
    acc.minutes += log.prayerMinutes || 0
    if (isActiveDay(log)) acc.faithfulDays += 1
    return acc
  }, { minutes: 0, faithfulDays: 0 })

  // ─── Croissance ─────────────────────────────────────────────────────────────
  const stageIndex = STAGES.reduce((idx, s, i) => (totals.faithfulDays >= s.min ? i : idx), 0)
  const stage = STAGES[stageIndex]
  const nextStage = STAGES[stageIndex + 1] || null
  const growth = {
    stage, stageIndex, nextStage,
    faithfulDays: totals.faithfulDays,
    toNext: nextStage ? nextStage.min - totals.faithfulDays : 0,
    pct: nextStage ? Math.round(((totals.faithfulDays - stage.min) / (nextStage.min - stage.min)) * 100) : 100,
  }

  // ─── Étapes du chemin (chaque onglet y participe) ───────────────────────────
  const answeredCount = prayerRequests.filter(r => r.answered).length
  const milestones = [
    { id: 'moment',    icon: 'candle',   label: 'Premier moment avec Dieu',  tab: 'Aujourd’hui', done: (totals.moment || 0) >= 1 },
    { id: 'fidele7',   icon: 'herb',     label: '7 jours de rencontre',       tab: 'Chemin',      done: totals.faithfulDays >= 7 },
    { id: 'evangile',  icon: 'scroll',   label: '7 Évangiles du jour lus',    tab: 'Bible',       done: (totals.evangile || 0) >= 7, progress: [totals.evangile || 0, 7] },
    { id: 'chapitres', icon: 'book',     label: '50 chapitres de la Bible',   tab: 'Bible',       done: totalChaptersRead >= 50, progress: [totalChaptersRead, 50] },
    { id: 'chapelet',  icon: 'beads',    label: 'Premier chapelet',           tab: 'Prière',      done: (totals.chapelet || 0) + (totals.rosaire || 0) >= 1 },
    { id: 'rosaire',   icon: 'rose',     label: 'Le Rosaire complet',         tab: 'Prière',      done: (totals.rosaire || 0) >= 1 },
    { id: 'misericorde', icon: 'blood',  label: 'Chapelet de la Miséricorde', tab: 'Prière',      done: (totals.misericorde || 0) >= 1 },
    { id: 'neuvaine',  icon: 'calendar', label: 'Une neuvaine complète',      tab: 'Prière',      done: (totals.neuvaine || 0) >= 9, progress: [Math.min(totals.neuvaine || 0, 9), 9] },
    { id: 'heure',     icon: 'hourglass',label: '1 heure de prière au total', tab: 'Prière',      done: totals.minutes >= 60, progress: [Math.min(totals.minutes, 60), 60] },
    { id: 'exaucee',   icon: 'sparkles', label: 'Une prière exaucée',         tab: 'Prière',      done: answeredCount >= 1 },
    { id: 'journal',   icon: 'writing',  label: 'Première page du journal',   tab: 'Journal',     done: journalEntries.length >= 1 },
    { id: 'journal10', icon: 'journal',  label: '10 pages de journal',        tab: 'Journal',     done: journalEntries.length >= 10, progress: [Math.min(journalEntries.length, 10), 10] },
    { id: 'examen',    icon: 'mirror',   label: 'Un examen de conscience',    tab: 'Outils',      done: (totals.examen || 0) >= 1 },
    { id: 'fidele30',  icon: 'tree',     label: '30 jours de rencontre',      tab: 'Chemin',      done: totals.faithfulDays >= 30, progress: [Math.min(totals.faithfulDays, 30), 30] },
  ]

  // ─── Objectif progressif ────────────────────────────────────────────────────
  const goalMetDays = getLast7Days().filter(d => d.prayerMinutes >= profile.dailyMinutes).length
  const nextMinutes = MINUTE_LADDER.find(m => m > profile.dailyMinutes) || null
  const snoozed = profile.suggestSnoozeUntil && profile.suggestSnoozeUntil > today()
  const goalSuggestion = nextMinutes && goalMetDays >= 5 && !snoozed
    ? { from: profile.dailyMinutes, to: nextMinutes, days: goalMetDays }
    : null
  const setDailyMinutes = (m) => setProfile(p => ({ ...DEFAULT_PROFILE, ...p, dailyMinutes: m, suggestSnoozeUntil: null }))
  const snoozeGoalSuggestion = () =>
    setProfile(p => ({ ...DEFAULT_PROFILE, ...p, suggestSnoozeUntil: format(addDays(new Date(), 7), 'yyyy-MM-dd') }))

  // ─── Demandes de prière ─────────────────────────────────────────────────────
  const addPrayerRequest = (title, description, category = 'petition') => {
    const req = { id: uuidv4(), title, description, category, date: today(), answered: false, answeredDate: null }
    setPrayerRequests(prev => [req, ...prev])
    logActivity('intention')
    return req
  }
  const markAnswered = (id) => {
    setPrayerRequests(prev => prev.map(r => r.id === id ? { ...r, answered: true, answeredDate: today() } : r))
  }
  const deletePrayerRequest = (id) => {
    setPrayerRequests(prev => prev.filter(r => r.id !== id))
  }

  // ─── Journal ────────────────────────────────────────────────────────────────
  const addJournalEntry = (data) => {
    const entry = { id: uuidv4(), date: today(), ...data, createdAt: new Date().toISOString() }
    setJournalEntries(prev => [entry, ...prev])
    logActivity('journal')
    return entry
  }
  const updateJournalEntry = (id, data) => {
    setJournalEntries(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))
  }
  const deleteJournalEntry = (id) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id))
  }
  const getTodayJournal = () => journalEntries.find(e => e.date === today()) || null

  // ─── Signets ────────────────────────────────────────────────────────────────
  const addBookmark = (bookId, bookName, chapter, verse, text, note = '') => {
    const bm = { id: uuidv4(), bookId, bookName, chapter, verse, text, note, date: today() }
    setBookmarks(prev => [bm, ...prev])
    return bm
  }
  const removeBookmark = (id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }
  const removeBookmarkAt = (bookId, chapter, verse) => {
    setBookmarks(prev => prev.filter(b => !(b.bookId === bookId && b.chapter === chapter && b.verse === verse)))
  }
  const isBookmarked = (bookId, chapter, verse) =>
    bookmarks.some(b => b.bookId === bookId && b.chapter === chapter && b.verse === verse)

  // ─── Message du jour (bienveillant, jamais culpabilisant) ───────────────────
  const getEncouragementMessage = () => {
    const log = getTodayLog()
    if (returnGap >= 3 && !log.prayed && !log.bibleRead) {
      return { type: 'welcome', message: "Content de vous revoir. Dieu ne compte pas les jours d'absence : il vous attendait. Recommencez simplement, avec quelques minutes." }
    }
    if (!log.prayed && !log.bibleRead) {
      return { type: 'info', message: `Aujourd'hui, offrez à Dieu ${profile.dailyMinutes} minutes. C'est assez pour commencer.` }
    }
    if (log.prayed && !log.bibleRead) {
      return { type: 'info', message: 'Merci pour ce temps de prière. Si vous le pouvez, laissez la Parole vous parler aujourd’hui.' }
    }
    if (!log.prayed && log.bibleRead) {
      return { type: 'info', message: 'Vous avez écouté la Parole. Répondez-lui maintenant par quelques mots de prière.' }
    }
    return { type: 'success', message: 'Vous avez prié et écouté la Parole aujourd’hui. Que le Seigneur vous bénisse et vous garde.' }
  }

  return {
    // État
    dailyLogs, prayerRequests, journalEntries, bookmarks, readingProgress, goals, profile,
    // Calculs
    prayerStreak, readingStreak, totalChaptersRead, totals, growth, milestones,
    returnGap, goalSuggestion, goalMetDays,
    // Journal quotidien / activités
    getTodayLog, logActivity, markPrayed, markBibleRead, unmarkBibleRead,
    // Statistiques
    getLast30Days, getLast7Days, getWeeklyStats, getThisWeek,
    // Demandes de prière
    addPrayerRequest, markAnswered, deletePrayerRequest,
    // Journal
    addJournalEntry, updateJournalEntry, deleteJournalEntry, getTodayJournal,
    // Signets
    addBookmark, removeBookmark, removeBookmarkAt, isBookmarked,
    // Objectifs
    setGoals, setDailyMinutes, snoozeGoalSuggestion,
    // UX
    getEncouragementMessage,
    today,
  }
}
