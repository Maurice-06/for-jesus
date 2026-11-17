// Navigation principale : 4 onglets + « Mon chemin » (progrès, outils, réglages)
export const NAV_ITEMS = [
  { to: '/',        label: "Aujourd'hui", icon: 'sunrise', end: true },
  { to: '/bible',   label: 'Bible',       icon: 'book' },
  { to: '/priere',  label: 'Prière',      icon: 'hands', also: ['/chapelet'] },
  { to: '/journal', label: 'Journal',     icon: 'journal' },
  { to: '/chemin',  label: 'Mon chemin',  icon: null, also: ['/outils', '/progres'] }, // icône = étape de croissance
]
