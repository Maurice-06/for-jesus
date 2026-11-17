import { STORAGE_KEYS } from '../hooks/useSpiritual'

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

// Type attendu pour chaque clé : on refuse tout le reste
const EXPECTED = {
  fj_dailyLogs: isPlainObject,
  fj_prayerRequests: Array.isArray,
  fj_journalEntries: Array.isArray,
  fj_bookmarks: Array.isArray,
  fj_readingProgress: isPlainObject,
  fj_goals: isPlainObject,
  fj_activePlan: (v) => v === null || typeof v === 'string',
  fj_planStart: (v) => v === null || typeof v === 'string',
  fj_bibleLast: (v) => v === null || isPlainObject(v),
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
    const value = Array.isArray(raw)
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
