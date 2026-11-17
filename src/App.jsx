import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { SpiritualProvider } from './context/SpiritualContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'

// Chaque page n'est téléchargée que lorsqu'on l'ouvre (démarrage plus rapide sur mobile)
const Bible = lazy(() => import('./pages/Bible'))
const Prayer = lazy(() => import('./pages/Prayer'))
const Chapelet = lazy(() => import('./pages/Chapelet'))
const Journal = lazy(() => import('./pages/Journal'))
const Progress = lazy(() => import('./pages/Progress'))
const Outils = lazy(() => import('./pages/Outils'))

function PageLoader() {
  return (
    <div className="flex justify-center py-24" role="status" aria-label="Chargement">
      <div className="w-8 h-8 rounded-full border-2 border-gold-500/30 border-t-gold-400 animate-spin" />
    </div>
  )
}

function NotFound() {
  return (
    <div className="card text-center py-14 space-y-3">
      <p className="text-slate-300 font-medium">Cette page n'existe pas.</p>
      <Link to="/" className="btn-primary inline-block">Retour à l'accueil</Link>
    </div>
  )
}

const page = (el) => <Suspense fallback={<PageLoader />}>{el}</Suspense>

export default function App() {
  return (
    <BrowserRouter>
      <SpiritualProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="bible" element={page(<Bible />)} />
            <Route path="priere" element={page(<Prayer />)} />
            <Route path="chapelet" element={page(<Chapelet />)} />
            <Route path="journal" element={page(<Journal />)} />
            <Route path="outils" element={page(<Outils />)} />
            <Route path="progres" element={page(<Progress />)} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </SpiritualProvider>
    </BrowserRouter>
  )
}
