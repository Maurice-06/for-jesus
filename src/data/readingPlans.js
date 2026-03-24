// Chaque plan = tableau de { bookId, chapter }
// Les plans sont générés à partir de la liste canonique des livres

import { ALL_BOOKS } from './bibleBooks'

// Plan 1: Bible en 1 an (1189 chapitres / 365 jours ≈ 3-4 ch/jour)
export const PLAN_BIBLE_1AN = (() => {
  const all = []
  ALL_BOOKS.forEach(book => {
    for (let c = 1; c <= book.chapters; c++) {
      all.push({ bookId: book.id, bookName: book.name, chapter: c, key: `${book.id}-${c}` })
    }
  })
  return all // 1189 entrées
})()

// Plan 2: Nouveau Testament en 90 jours (~2-3 ch/jour)
export const PLAN_NT_90 = (() => {
  const nt = ALL_BOOKS.slice(39) // indices 39-65
  const all = []
  nt.forEach(book => {
    for (let c = 1; c <= book.chapters; c++) {
      all.push({ bookId: book.id, bookName: book.name, chapter: c, key: `${book.id}-${c}` })
    }
  })
  return all
})()

// Plan 3: Psaumes en 30 jours (150 psaumes / 30 = 5/jour)
export const PLAN_PSAUMES_30 = (() => {
  const all = []
  for (let c = 1; c <= 150; c++) {
    all.push({ bookId: 'psalms', bookName: 'Psaumes', chapter: c, key: `psalms-${c}` })
  }
  return all
})()

// Plan 4: Évangiles en 40 jours (Mt 28 + Mc 16 + Lc 24 + Jn 21 = 89 ch / 40 ≈ 2/jour)
export const PLAN_EVANGILES_40 = (() => {
  const gospels = ['matthew', 'mark', 'luke', 'john']
  const all = []
  ALL_BOOKS.filter(b => gospels.includes(b.id)).forEach(book => {
    for (let c = 1; c <= book.chapters; c++) {
      all.push({ bookId: book.id, bookName: book.name, chapter: c, key: `${book.id}-${c}` })
    }
  })
  return all
})()

// Plan 5: Proverbes en 31 jours (1 chapitre/jour)
export const PLAN_PROVERBES_31 = (() => {
  const all = []
  for (let c = 1; c <= 31; c++) {
    all.push({ bookId: 'proverbs', bookName: 'Proverbes', chapter: c, key: `proverbs-${c}` })
  }
  return all
})()

export const READING_PLANS = [
  {
    id: 'bible-1an',
    name: 'Bible en 1 an',
    description: '3-4 chapitres par jour — parcourez toute la Parole de Dieu',
    duration: '365 jours',
    icon: '📖',
    color: 'text-gold-400 bg-gold-500/10 border-gold-500/20',
    chapters: PLAN_BIBLE_1AN,
    dailyCount: 3,
  },
  {
    id: 'nt-90',
    name: 'Nouveau Testament en 90 jours',
    description: '2-3 chapitres par jour — plongez dans la vie et l\'enseignement de Jésus',
    duration: '90 jours',
    icon: '✝️',
    color: 'text-spirit-400 bg-spirit-500/10 border-spirit-500/20',
    chapters: PLAN_NT_90,
    dailyCount: 3,
  },
  {
    id: 'psaumes-30',
    name: 'Psaumes en 30 jours',
    description: '5 psaumes par jour — priez avec les mots inspirés de David',
    duration: '30 jours',
    icon: '🎵',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    chapters: PLAN_PSAUMES_30,
    dailyCount: 5,
  },
  {
    id: 'evangiles-40',
    name: 'Évangiles en 40 jours',
    description: '2 chapitres par jour — suivez Jésus de sa naissance à sa résurrection',
    duration: '40 jours',
    icon: '🕊️',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    chapters: PLAN_EVANGILES_40,
    dailyCount: 2,
  },
  {
    id: 'proverbes-31',
    name: 'Proverbes en 31 jours',
    description: '1 chapitre par jour — un mois de sagesse divine pour votre vie',
    duration: '31 jours',
    icon: '💡',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    chapters: PLAN_PROVERBES_31,
    dailyCount: 1,
  },
]
