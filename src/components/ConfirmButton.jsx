import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'

/**
 * Bouton de suppression en deux temps : 1er appui → « Supprimer ? », 2e appui → action.
 * Revient à l'état normal après 3 s. Évite les suppressions accidentelles au doigt.
 */
export default function ConfirmButton({ onConfirm, label = 'Supprimer', size = 16, className = '' }) {
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    if (!armed) return
    const t = setTimeout(() => setArmed(false), 3000)
    return () => clearTimeout(t)
  }, [armed])

  return (
    <button
      type="button"
      aria-label={armed ? `Confirmer : ${label}` : label}
      onClick={(e) => {
        e.stopPropagation()
        if (armed) { setArmed(false); onConfirm() } else setArmed(true)
      }}
      className={`flex-shrink-0 inline-flex items-center justify-center gap-1 rounded-lg min-w-[40px] min-h-[40px] px-2 text-xs font-medium transition-all ${
        armed ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'text-slate-600 hover:text-red-400 hover:bg-navy-700'
      } ${className}`}
    >
      <Trash2 size={size} />
      {armed && <span>{label} ?</span>}
    </button>
  )
}
