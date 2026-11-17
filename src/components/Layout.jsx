import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import StorageWarning from './StorageWarning'
import ErrorBoundary from './ErrorBoundary'

export default function Layout() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen bg-navy-900 bg-mesh">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-2xl mx-auto px-4 md:px-8 pt-[max(1.25rem,env(safe-area-inset-top))] pb-32 md:pb-10">
          <StorageWarning />
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
