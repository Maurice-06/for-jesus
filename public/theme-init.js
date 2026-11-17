// Applique le thème et la taille du texte AVANT l'affichage (évite un flash de couleur).
// Fichier externe (et non inline) pour respecter la politique de sécurité (CSP).
(function () {
  try {
    var s = JSON.parse(localStorage.getItem('fj_settings') || '{}') || {}
    var dark = s.theme === 'dark' || (s.theme !== 'light' && !window.matchMedia('(prefers-color-scheme: light)').matches)
    var el = document.documentElement
    el.classList.toggle('light', !dark)
    if (s.textSize === 'large') el.classList.add('text-large')
    if (s.textSize === 'xlarge') el.classList.add('text-xlarge')
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', dark ? '#070b14' : '#f8f5ee')
  } catch (e) { /* réglages illisibles : thème sombre par défaut */ }
})()
