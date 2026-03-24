import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SpiritualProvider } from './context/SpiritualContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Bible from './pages/Bible'
import Prayer from './pages/Prayer'
import Chapelet from './pages/Chapelet'
import Journal from './pages/Journal'
import Progress from './pages/Progress'
import Outils from './pages/Outils'

export default function App() {
  return (
    <BrowserRouter>
      <SpiritualProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="bible" element={<Bible />} />
            <Route path="priere" element={<Prayer />} />
            <Route path="chapelet" element={<Chapelet />} />
            <Route path="journal" element={<Journal />} />
            <Route path="outils" element={<Outils />} />
            <Route path="progres" element={<Progress />} />
          </Route>
        </Routes>
      </SpiritualProvider>
    </BrowserRouter>
  )
}
