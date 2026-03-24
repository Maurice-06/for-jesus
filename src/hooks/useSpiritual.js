import { useLocalStorage } from './useLocalStorage'
import { format, parseISO, differenceInCalendarDays, subDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

const today = () => format(new Date(), 'yyyy-MM-dd')

export function useSpiritual() {
  const [dailyLogs, setDailyLogs] = useLocalStorage('fj_dailyLogs', {})
  const [prayerRequests, setPrayerRequests] = useLocalStorage('fj_prayerRequests', [])
  const [journalEntries, setJournalEntries] = useLocalStorage('fj_journalEntries', [])
  const [bookmarks, setBookmarks] = useLocalStorage('fj_bookmarks', [])
  const [readingProgress, setReadingProgress] = useLocalStorage('fj_readingProgress', {})
  const [goals, setGoals] = useLocalStorage('fj_goals', { weeklyPrayerDays: 5, weeklyBibleChapters: 7 })

  // --- Daily log helpers ---
  const getTodayLog = () => dailyLogs[today()] || { prayed: false, bibleRead: false, prayerMinutes: 0, chaptersRead: [] }

  const markPrayed = (minutes = 5) => {
    const date = today()
    setDailyLogs(prev => ({
      ...prev,
      [date]: { ...getTodayLog(), prayed: true, prayerMinutes: (prev[date]?.prayerMinutes || 0) + minutes },
    }))
  }

  const markBibleRead = (bookId, chapter) => {
    const date = today()
    const key = `${bookId}-${chapter}`
    setDailyLogs(prev => {
      const log = prev[date] || { prayed: false, bibleRead: false, prayerMinutes: 0, chaptersRead: [] }
      const chaptersRead = log.chaptersRead.includes(key) ? log.chaptersRead : [...log.chaptersRead, key]
      return { ...prev, [date]: { ...log, bibleRead: true, chaptersRead } }
    })
    setReadingProgress(prev => ({ ...prev, [key]: date }))
  }

  // --- Streak calculation ---
  const calculateStreak = (type) => {
    let streak = 0
    let currentDate = new Date()
    while (true) {
      const dateKey = format(currentDate, 'yyyy-MM-dd')
      const log = dailyLogs[dateKey]
      if (!log) break
      const done = type === 'prayer' ? log.prayed : log.bibleRead
      if (!done) break
      streak++
      currentDate = subDays(currentDate, 1)
    }
    return streak
  }

  const prayerStreak = calculateStreak('prayer')
  const readingStreak = calculateStreak('reading')

  // --- Last 30 days data for charts ---
  const getLast30Days = () => {
    const days = []
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'yyyy-MM-dd')
      const log = dailyLogs[date] || {}
      days.push({
        date,
        label: format(subDays(new Date(), i), 'dd/MM'),
        prayed: log.prayed ? 1 : 0,
        bibleRead: log.bibleRead ? 1 : 0,
        prayerMinutes: log.prayerMinutes || 0,
        chaptersRead: (log.chaptersRead || []).length,
      })
    }
    return days
  }

  const getLast7Days = () => getLast30Days().slice(-7)

  // Weekly stats
  const getWeeklyStats = () => {
    const last7 = getLast7Days()
    return {
      prayerDays: last7.filter(d => d.prayed).length,
      readingDays: last7.filter(d => d.bibleRead).length,
      totalPrayerMinutes: last7.reduce((s, d) => s + d.prayerMinutes, 0),
      totalChapters: last7.reduce((s, d) => s + d.chaptersRead, 0),
    }
  }

  // Total chapters read
  const totalChaptersRead = Object.keys(readingProgress).length

  // --- Prayer requests ---
  const addPrayerRequest = (title, description, category = 'petition') => {
    const req = { id: uuidv4(), title, description, category, date: today(), answered: false, answeredDate: null }
    setPrayerRequests(prev => [req, ...prev])
    return req
  }

  const markAnswered = (id) => {
    setPrayerRequests(prev => prev.map(r => r.id === id ? { ...r, answered: true, answeredDate: today() } : r))
  }

  const deletePrayerRequest = (id) => {
    setPrayerRequests(prev => prev.filter(r => r.id !== id))
  }

  // --- Journal ---
  const addJournalEntry = (data) => {
    const entry = { id: uuidv4(), date: today(), ...data, createdAt: new Date().toISOString() }
    setJournalEntries(prev => [entry, ...prev])
    return entry
  }

  const updateJournalEntry = (id, data) => {
    setJournalEntries(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))
  }

  const deleteJournalEntry = (id) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id))
  }

  const getTodayJournal = () => journalEntries.find(e => e.date === today()) || null

  // --- Bookmarks ---
  const addBookmark = (bookId, bookName, chapter, verse, text, note = '') => {
    const bm = { id: uuidv4(), bookId, bookName, chapter, verse, text, note, date: today() }
    setBookmarks(prev => [bm, ...prev])
    return bm
  }

  const removeBookmark = (id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }

  const isBookmarked = (bookId, chapter, verse) => {
    return bookmarks.some(b => b.bookId === bookId && b.chapter === chapter && b.verse === verse)
  }

  // --- Encouragement messages ---
  const getEncouragementMessage = () => {
    const log = getTodayLog()
    const streak = Math.max(prayerStreak, readingStreak)
    if (!log.prayed && !log.bibleRead) {
      return { type: 'alert', message: "Aujourd'hui est une nouvelle opportunité de vous approcher de Dieu. Commencez par une simple prière !" }
    }
    if (log.prayed && !log.bibleRead) {
      return { type: 'info', message: "Bravo pour votre prière ! Prenez quelques minutes pour lire la Parole de Dieu." }
    }
    if (!log.prayed && log.bibleRead) {
      return { type: 'info', message: "Vous avez lu la Parole. Maintenant parlez à Dieu en prière — il vous écoute." }
    }
    if (streak >= 7) {
      return { type: 'success', message: `Incroyable ! ${streak} jours consécutifs de fidélité. Continuez ainsi !` }
    }
    return { type: 'success', message: "Excellent ! Vous avez prié et lu la Bible aujourd'hui. Dieu est fier de vous !" }
  }

  return {
    // State
    dailyLogs, prayerRequests, journalEntries, bookmarks, readingProgress, goals,
    // Computed
    prayerStreak, readingStreak, totalChaptersRead,
    // Daily log
    getTodayLog, markPrayed, markBibleRead,
    // Stats
    getLast30Days, getLast7Days, getWeeklyStats,
    // Prayer requests
    addPrayerRequest, markAnswered, deletePrayerRequest,
    // Journal
    addJournalEntry, updateJournalEntry, deleteJournalEntry, getTodayJournal,
    // Bookmarks
    addBookmark, removeBookmark, isBookmarked,
    // Goals
    setGoals,
    // UX
    getEncouragementMessage,
    today,
  }
}
