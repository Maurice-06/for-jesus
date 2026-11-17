import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Polices hébergées avec l'appli (plus de requête vers Google Fonts, fonctionne hors ligne)
import '@fontsource/inter/latin-300.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/playfair-display/latin-400.css'
import '@fontsource/playfair-display/latin-400-italic.css'
import '@fontsource/playfair-display/latin-600.css'
import './index.css'
import App from './App'
import { requestPersistentStorage } from './utils/backup'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Demande au navigateur de conserver les données (sans effet si refusé)
requestPersistentStorage()
