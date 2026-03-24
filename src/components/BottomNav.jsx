import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Heart, Orbit, NotebookPen, Wrench } from 'lucide-react'

// 6 items compact — Progrès accessible via Outils sur mobile
const navItems = [
  { to: '/', label: 'Accueil', icon: LayoutDashboard },
  { to: '/bible', label: 'Bible', icon: BookOpen },
  { to: '/priere', label: 'Prière', icon: Heart },
  { to: '/chapelet', label: 'Chapelet', icon: Orbit },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/outils', label: 'Outils', icon: Wrench },
]

export default function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-800/98 backdrop-blur-xl border-t border-navy-600">
      <div className="flex items-center justify-around px-1 pt-1.5 pb-safe-bottom"
        style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all duration-200 min-w-0 ${
                isActive ? 'text-gold-400' : 'text-slate-500 active:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-gold-500/10' : ''}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                </div>
                <span className="text-[9px] font-medium leading-none truncate w-full text-center">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
