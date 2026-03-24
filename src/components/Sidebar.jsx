import { NavLink } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Heart, NotebookPen, TrendingUp, Orbit, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/bible', label: 'Bible', icon: BookOpen },
  { to: '/priere', label: 'Prière', icon: Heart },
  { to: '/chapelet', label: 'Chapelet', icon: Orbit },
  { to: '/journal', label: 'Journal', icon: NotebookPen },
  { to: '/outils', label: 'Outils', icon: Wrench },
  { to: '/progres', label: 'Progrès', icon: TrendingUp },
]

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-navy-800 border-r border-navy-600 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-navy-600">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg glow-gold">
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <rect x="10.5" y="2" width="3" height="20" rx="1.5"/>
            <rect x="4" y="7" width="16" height="3" rx="1.5"/>
          </svg>
        </div>
        <div>
          <h1 className="font-semibold text-slate-100 leading-tight">For Jesus</h1>
          <p className="text-xs text-slate-500">Compagnon spirituel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-gold-400' : ''} />
                {label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom verse */}
      <div className="px-4 py-4 border-t border-navy-600">
        <p className="text-xs text-slate-500 italic text-center leading-relaxed">
          "Je puis tout par celui qui me fortifie."
          <span className="block text-gold-600 not-italic mt-0.5">Phil. 4:13</span>
        </p>
      </div>
    </aside>
  )
}
