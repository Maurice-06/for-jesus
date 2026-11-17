import { useEffect } from 'react'
import { Delete, ScanFace } from 'lucide-react'

/**
 * Pavé numérique (gros boutons, pensé pour le pouce).
 * @param {string} value          code saisi
 * @param {number} length         longueur attendue (points affichés)
 * @param {(v: string) => void} onChange
 * @param {() => void} [onBiometric] affiche le bouton Face ID si fourni
 */
export default function PinPad({ value, onChange, length = 4, maxLength = 6, onBiometric, disabled, error }) {
  const press = (d) => { if (!disabled && value.length < maxLength) onChange(value + d) }
  const erase = () => { if (!disabled) onChange(value.slice(0, -1)) }

  // Clavier physique (ordinateur)
  useEffect(() => {
    const onKey = (e) => {
      if (/^\d$/.test(e.key)) press(e.key)
      else if (e.key === 'Backspace') erase()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const dots = Math.max(length, value.length)
  return (
    <div className="flex flex-col items-center gap-7">
      <div className={`flex gap-3.5 ${error ? 'animate-[shake_0.35s]' : ''}`} aria-live="polite" aria-label={`${value.length} chiffre${value.length > 1 ? 's' : ''} saisi${value.length > 1 ? 's' : ''}`}>
        {Array.from({ length: dots }, (_, i) => (
          <span key={i} className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
            i < value.length ? (error ? 'bg-red-400 border-red-400' : 'bg-gold-400 border-gold-400') : 'border-slate-500'}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
          <button key={d} type="button" onClick={() => press(d)} disabled={disabled}
            className="w-[4.5rem] h-[4.5rem] rounded-full bg-white/[0.06] active:bg-white/15 text-2xl font-medium text-slate-100 disabled:opacity-40">
            {d}
          </button>
        ))}
        {onBiometric ? (
          <button type="button" onClick={onBiometric} aria-label="Déverrouiller avec Face ID"
            className="w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center text-gold-300 active:bg-white/10">
            <ScanFace size={30} />
          </button>
        ) : <span />}
        <button type="button" onClick={() => press('0')} disabled={disabled}
          className="w-[4.5rem] h-[4.5rem] rounded-full bg-white/[0.06] active:bg-white/15 text-2xl font-medium text-slate-100 disabled:opacity-40">
          0
        </button>
        <button type="button" onClick={erase} aria-label="Effacer" disabled={disabled}
          className="w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center text-slate-400 active:bg-white/10 disabled:opacity-40">
          <Delete size={26} />
        </button>
      </div>
    </div>
  )
}
