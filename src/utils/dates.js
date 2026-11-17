import { format, parseISO, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

/** Date « AAAA-MM-JJ » → texte en français. Ne plante jamais : '' si la date est invalide. */
export function formatDay(value, pattern = 'd MMM yyyy') {
  if (typeof value !== 'string' || !value) return ''
  const d = parseISO(value.length === 10 ? `${value}T00:00:00` : value)
  return isValid(d) ? format(d, pattern, { locale: fr }) : ''
}
