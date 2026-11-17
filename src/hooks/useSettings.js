import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export const DEFAULT_SETTINGS = {
  theme: 'auto',          // 'auto' (comme le téléphone) | 'dark' | 'light'
  textSize: 'normal',     // 'normal' | 'large' | 'xlarge'
  reminderTime: '07:30',  // heure du rappel quotidien (calendrier)
}

/** Réglages d'affichage, appliqués en direct sur <html>. */
export function useSettings() {
  const [stored, setStored] = useLocalStorage('fj_settings', DEFAULT_SETTINGS)
  const settings = { ...DEFAULT_SETTINGS, ...stored }
  const update = (patch) => setStored(prev => ({ ...DEFAULT_SETTINGS, ...prev, ...patch }))

  useEffect(() => {
    const el = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: light)')
    const apply = () => {
      const dark = settings.theme === 'dark' || (settings.theme === 'auto' && !media.matches)
      el.classList.toggle('light', !dark)
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#070b14' : '#f8f5ee')
    }
    apply()
    el.classList.toggle('text-large', settings.textSize === 'large')
    el.classList.toggle('text-xlarge', settings.textSize === 'xlarge')
    // En mode « auto », suit le changement clair/sombre du téléphone en direct
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [settings.theme, settings.textSize])

  return [settings, update]
}
