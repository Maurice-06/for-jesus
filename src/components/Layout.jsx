import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-mesh" style={{ background: '#070b14' }}>
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 pb-28 md:pb-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
