import { NavLink, useLocation } from 'react-router-dom'
import Icon3D from './Icon3D'
import { NAV_ITEMS } from './navItems'
import { useSpiritualContext } from '../context/SpiritualContext'

export default function BottomNav() {
  const { pathname } = useLocation()
  const { growth } = useSpiritualContext()

  return (
    <nav aria-label="Navigation principale"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-xl border-t border-white/5">
      <div className="flex items-stretch justify-around px-1 pt-1.5"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {NAV_ITEMS.map(({ to, label, icon, end, also = [] }) => {
          const extra = also.some(p => pathname.startsWith(p))
          return (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 flex-1 min-h-[56px] rounded-2xl transition-colors ${
                  isActive || extra ? 'text-gold-300' : 'text-slate-500'
                }`}
            >
              {({ isActive }) => {
                const active = isActive || extra
                return (
                  <>
                    <span className={`flex items-center justify-center w-11 h-8 rounded-full transition-all ${active ? 'bg-gold-500/15' : ''}`}>
                      <Icon3D name={icon || growth.stage.icon} size={24} muted={!active} />
                    </span>
                    <span className={`text-[11px] leading-none ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
                  </>
                )
              }}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
