// Lectures de la messe du jour — AELF (traduction liturgique officielle)
// API publique : https://api.aelf.org — ne reçoit aucune donnée personnelle (date seulement).
import { format } from 'date-fns'

const CACHE_KEY = 'fj_aelfCache_v2'
const KEEP_DAYS = 4

/** HTML de l'AELF → texte brut avec retours à la ligne. Rien n'est injecté dans la page. */
export function htmlToText(html) {
  if (!html) return ''
  const marked = String(html)
    .replace(/\s*\r?\n\s*/g, ' ') // en HTML, un retour à la ligne brut n'est qu'un espace
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*/gi, '\n\n')
  // DOMParser crée un document inerte : aucun script n'y est exécuté, aucune image chargée
  const doc = new DOMParser().parseFromString(marked, 'text/html')
  return (doc.body.textContent || '')
    .replace(/\u00a0/g, ' ') // espaces insécables
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

const LABELS = {
  lecture_1: 'Première lecture',
  lecture_2: 'Deuxième lecture',
  psaume: 'Psaume',
  cantique: 'Cantique',
  evangile: 'Évangile',
  sequence: 'Séquence',
}
const labelFor = (type) => LABELS[type] || (type?.startsWith('lecture') ? 'Lecture' : 'Lecture')

function normalize(raw) {
  const info = raw.informations || {}
  const messes = (raw.messes || []).map(m => ({
    nom: m.nom || 'Messe du jour',
    lectures: (m.lectures || []).map(l => ({
      type: l.type,
      label: labelFor(l.type),
      titre: htmlToText(l.titre),
      ref: htmlToText(l.ref),
      intro: htmlToText(l.intro_lue),
      refrain: htmlToText(l.refrain_psalmique),
      acclamation: htmlToText(l.verset_evangile),
      texte: htmlToText(l.contenu),
    })).filter(l => l.texte),
  })).filter(m => m.lectures.length)
  return {
    date: info.date,
    jour: [info.ligne1, info.ligne2, info.ligne3].filter(Boolean),
    fete: info.fete || '',
    couleur: info.couleur || '',
    messes,
  }
}

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY)) || {} } catch { return {} }
}
function writeCache(dateKey, data) {
  const cache = readCache()
  cache[dateKey] = data
  const keys = Object.keys(cache).sort().slice(-KEEP_DAYS)
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(keys.map(k => [k, cache[k]])))) } catch { /* plein */ }
}

/** Lectures du jour (depuis le cache si déjà chargées). */
export async function fetchMesseDuJour(date = new Date(), { signal } = {}) {
  const dateKey = format(date, 'yyyy-MM-dd')
  const cached = readCache()[dateKey]
  if (cached) return cached
  const res = await fetch(`https://api.aelf.org/v1/messes/${dateKey}/romain`, { signal, referrerPolicy: 'no-referrer' })
  if (!res.ok) throw new Error(`Lectures indisponibles (${res.status})`)
  const data = normalize(await res.json())
  if (!data.messes.length) throw new Error('Aucune lecture trouvée pour ce jour.')
  writeCache(dateKey, data)
  return data
}

export const getEvangile = (data) =>
  data?.messes?.[0]?.lectures.find(l => l.type === 'evangile') || null

// Couleur liturgique → pastille
export const LITURGICAL_COLORS = {
  vert: { label: 'vert', className: 'bg-emerald-500' },
  blanc: { label: 'blanc', className: 'bg-slate-100' },
  rouge: { label: 'rouge', className: 'bg-red-500' },
  violet: { label: 'violet', className: 'bg-violet-500' },
  rose: { label: 'rose', className: 'bg-pink-400' },
  noir: { label: 'noir', className: 'bg-slate-700' },
}
