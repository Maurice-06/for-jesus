import { STORAGE_KEYS, ACTIVITIES } from '../hooks/useSpiritual'

const BACKUP_FORMAT = 'for-jesus-backup'
const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo

/** Télécharge toutes les données de l'appli dans un fichier JSON. */
export function exportBackup() {
  const data = {}
  for (const key of STORAGE_KEYS) {
    const raw = localStorage.getItem(key)
    if (raw !== null) {
      try { data[key] = JSON.parse(raw) } catch { /* clé corrompue : ignorée */ }
    }
  }
  const payload = { format: BACKUP_FORMAT, version: 1, exportedAt: new Date().toISOString(), data }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `for-jesus-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const isDateKey = (k) => /^\d{4}-\d{2}-\d{2}$/.test(k)
const isDateStr = (v) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v) && !Number.isNaN(Date.parse(v))
const SAFE_KEY = (k) => k !== '__proto__' && k !== 'constructor' && k !== 'prototype'

const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '')
const cleanList = (list, fix) => list
  .filter(item => isPlainObject(item) && isDateStr(item.date))
  .map((item, i) => fix({ ...item, id: typeof item.id === 'string' && item.id ? item.id.slice(0, 64) : `import-${Date.now()}-${i}` }))

// Nettoyage en profondeur des structures sensibles
const CLEAN = {
  fj_dailyLogs: (v) => Object.fromEntries(Object.entries(v)
    .filter(([k, log]) => isDateKey(k) && isPlainObject(log))
    .map(([k, log]) => [k, {
      prayed: !!log.prayed,
      bibleRead: !!log.bibleRead,
      prayerMinutes: Number.isFinite(log.prayerMinutes) ? Math.max(0, Math.min(1440, log.prayerMinutes)) : 0,
      chaptersRead: Array.isArray(log.chaptersRead) ? log.chaptersRead.filter(c => typeof c === 'string').slice(0, 2000) : [],
      activities: isPlainObject(log.activities)
        ? Object.fromEntries(Object.entries(log.activities).filter(([a, n]) => Object.hasOwn(ACTIVITIES, a) && Number.isFinite(n) && n >= 0))
        : {},
    }])),
  // Listes : chaque élément doit avoir un identifiant et une date valide
  fj_journalEntries: (v) => cleanList(v, (e) => ({
    ...e, content: str(e.content, 20000), verse: str(e.verse, 300), mood: str(e.mood, 40),
    gratitude: Array.isArray(e.gratitude) ? e.gratitude.filter(g => typeof g === 'string').map(g => g.slice(0, 200)) : [],
  })),
  fj_prayerRequests: (v) => cleanList(v, (r) => ({
    ...r, title: str(r.title, 200), description: str(r.description, 2000), category: str(r.category, 40),
    answered: !!r.answered, answeredDate: isDateStr(r.answeredDate) ? r.answeredDate : null,
  })).filter(r => r.title),
  fj_bookmarks: (v) => cleanList(v, (b) => ({
    ...b, bookId: str(b.bookId, 40), bookName: str(b.bookName, 60), text: str(b.text, 5000), note: str(b.note, 1000),
    chapter: Number.isInteger(b.chapter) ? b.chapter : 1, verse: Number.isInteger(b.verse) ? b.verse : 1,
  })),
  fj_readingProgress: (v) => Object.fromEntries(Object.entries(v).filter(([k, d]) => SAFE_KEY(k) && /^[\w+-]+-\d+$/.test(k) && isDateKey(String(d)))),
}

// Type attendu pour chaque clé : on refuse tout le reste
const EXPECTED = {
  fj_dailyLogs: isPlainObject,
  fj_prayerRequests: Array.isArray,
  fj_journalEntries: Array.isArray,
  fj_bookmarks: Array.isArray,
  fj_readingProgress: isPlainObject,
  fj_goals: isPlainObject,
  fj_activePlan: (v) => v === null || typeof v === 'string',
  fj_planStart: (v) => v === null || isDateStr(v),
  fj_bibleLast: (v) => v === null || isPlainObject(v),
  fj_profile: isPlainObject,
  fj_neuvaine: (v) => v === null || isPlainObject(v),
  fj_settings: isPlainObject,
  // fj_lock volontairement exclu : le verrou et Face ID sont propres à chaque appareil
}

/**
 * Restaure une sauvegarde. Valide le fichier avant d'écrire quoi que ce soit.
 * @returns {Promise<number>} nombre de catégories restaurées
 */
export async function importBackup(file) {
  if (!file) throw new Error('Aucun fichier choisi.')
  if (file.size > MAX_SIZE) throw new Error('Fichier trop volumineux.')
  let payload
  try {
    payload = JSON.parse(await file.text())
  } catch {
    throw new Error("Ce fichier n'est pas une sauvegarde valide.")
  }
  if (payload?.format !== BACKUP_FORMAT || !isPlainObject(payload.data)) {
    throw new Error("Ce fichier n'est pas une sauvegarde For Jesus.")
  }
  const entries = Object.entries(payload.data).filter(([k, v]) => EXPECTED[k]?.(v))
  if (entries.length === 0) throw new Error('La sauvegarde est vide.')
  for (const [key, raw] of entries) {
    // Listes : on ne garde que des objets, avec des sous-listes bien formées
    const value = CLEAN[key] ? CLEAN[key](raw) : Array.isArray(raw)
      ? raw.filter(isPlainObject).map(item =>
          'gratitude' in item && !Array.isArray(item.gratitude) ? { ...item, gratitude: [] } : item)
      : raw
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('fj-storage', { detail: { key } }))
  }
  return entries.length
}

/** Demande au navigateur de ne pas effacer les données (Safari iOS les purge sinon). */
export async function requestPersistentStorage() {
  try {
    if (navigator.storage?.persist && !(await navigator.storage.persisted())) {
      return await navigator.storage.persist()
    }
    return true
  } catch {
    return false
  }
}
