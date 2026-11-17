// Rappels via le calendrier du téléphone (fichier .ics) : aucun serveur,
// aucune donnée envoyée, fonctionne même hors ligne.

const pad = (n) => String(n).padStart(2, '0')
const icsDate = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
const stamp = () => new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')
// Échappement imposé par la norme iCalendar (RFC 5545)
// Lignes de plus de 75 octets : pliées (RFC 5545 §3.1)
const fold = (line) => {
  const enc = new TextEncoder()
  if (enc.encode(line).length <= 75) return line
  const out = []
  let cur = ''
  for (const ch of line) {
    if (enc.encode(cur + ch).length > (out.length ? 74 : 75)) { out.push(cur); cur = '' }
    cur += ch
  }
  out.push(cur)
  return out.join('\r\n ')
}
const esc = (t) => String(t).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

/**
 * Crée un évènement quotidien répété avec une alerte à l'heure.
 * Heure « flottante » (sans fuseau) : elle reste à l'heure locale du téléphone,
 * même en voyage.
 */
function buildIcs({ uid, time, title, description, url, minutes = 10 }) {
  const [h, m] = time.split(':').map(Number)
  const start = new Date()
  start.setDate(start.getDate() + 1) // à partir de demain
  const end = new Date(start); end.setHours(h, m + minutes)
  const dt = `${icsDate(start)}T${pad(h)}${pad(m)}00`
  const dtEnd = `${icsDate(end)}T${pad(end.getHours())}${pad(end.getMinutes())}00`
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//For Jesus//Compagnon spirituel//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp()}`,
    `DTSTART:${dt}`,
    `DTEND:${dtEnd}`,
    'RRULE:FREQ=DAILY',
    `SUMMARY:${esc(title)}`,
    `DESCRIPTION:${esc(description)}`,
    url ? `URL:${url}` : null,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(title)}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).map(fold).join('\r\n') + '\r\n'
}

function download(filename, content) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

const appUrl = (path) => `${window.location.origin}${path}`

/** Rappel quotidien « Mon moment avec Dieu » */
export function downloadDailyReminder(time, minutes) {
  download('for-jesus-rappel-priere.ics', buildIcs({
    uid: 'for-jesus-moment-quotidien@for-jesus',
    time,
    minutes: Math.max(5, minutes),
    title: '🙏 Mon moment avec Dieu',
    description: `Quelques minutes pour Lui : l'Évangile du jour, une prière, une ligne au journal.\nOuvrir : ${appUrl('/moment')}`,
    url: appUrl('/moment'),
  }))
}

/** Rappel quotidien de l'Heure de la Miséricorde (15 h) */
export function downloadMercyReminder() {
  download('for-jesus-heure-misericorde.ics', buildIcs({
    uid: 'for-jesus-heure-misericorde@for-jesus',
    time: '15:00',
    minutes: 10,
    title: '🩸 Heure de la Miséricorde',
    description: `« Jésus, j'ai confiance en toi. » Chapelet de la Divine Miséricorde.\nOuvrir : ${appUrl('/priere?onglet=chapelet&chapelet=misericorde')}`,
    url: appUrl('/priere?onglet=chapelet&chapelet=misericorde'),
  }))
}
