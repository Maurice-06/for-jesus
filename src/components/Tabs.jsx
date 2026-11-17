import Icon3D from './Icon3D'

/** Sélecteur segmenté (onglets internes d'une page) */
export default function Tabs({ tabs, value, onChange, className = '' }) {
  return (
    <div role="tablist" className={`flex gap-1 p-1 bg-white/[0.04] border border-white/5 rounded-2xl ${className}`}>
      {tabs.map(t => {
        const active = value === t.id
        return (
          <button key={t.id} role="tab" aria-selected={active} onClick={() => onChange(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 min-h-[44px] px-2 rounded-xl text-sm transition-all ${
              active ? 'bg-navy-600 text-slate-50 font-semibold shadow' : 'text-slate-400 font-medium hover:text-slate-200'
            }`}
          >
            {t.icon && <Icon3D name={t.icon} size={20} muted={!active} />}
            <span className="truncate">{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
