import { NavLink, useLocation } from 'react-router-dom'
import Icon3D from './Icon3D'
import { NAV_ITEMS } from './navItems'
import { useSpiritualContext } from '../context/SpiritualContext'

export default function Sidebar() {
  const { pathname } = useLocation()
  const { growth } = useSpiritualContext()

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-navy-900/80 border-r border-white/5 sticky top-0">
      <div className="flex items-center gap-3 px-6 py-6">
        <Icon3D name="cross" size={36} />
        <div>
          <p className="font-semibold text-slate-100 leading-tight">For Jesus</p>
          <p className="text-xs text-slate-500">Compagnon spirituel</p>
        </div>
      </div>

      <nav aria-label="Navigation principale" className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon, end, also = [] }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => {
              const active = isActive || also.some(p => pathname.startsWith(p))
              return `flex items-center gap-3 px-4 py-3 rounded-2xl text-[0.9375rem] transition-all ${
                active ? 'bg-gold-500/10 text-gold-300 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 font-medium'
              }`
            }}
          >
            {({ isActive }) => (
              <>
                <Icon3D name={icon || growth.stage.icon} size={26} muted={!(isActive || also.some(p => pathname.startsWith(p)))} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="m-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
        <Icon3D name={growth.stage.icon} size={36} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-200">{growth.stage.name}</p>
          <p className="text-xs text-slate-500">{growth.faithfulDays} jour{growth.faithfulDays > 1 ? 's' : ''} de rencontre</p>
        </div>
      </div>
    </aside>
  )
}
