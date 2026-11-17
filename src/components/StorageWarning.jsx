import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/** Prévient si le téléphone n'a plus de place pour enregistrer (au lieu d'échouer en silence). */
export default function StorageWarning() {
  const [full, setFull] = useState(false)
  useEffect(() => {
    const onError = () => setFull(true)
    window.addEventListener('fj-storage-error', onError)
    return () => window.removeEventListener('fj-storage-error', onError)
  }, [])
  if (!full) return null
  return (
    <div role="alert" className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-sm text-slate-200">
      <p className="font-semibold text-red-400">Enregistrement impossible</p>
      <p className="mt-1">L'espace de stockage de l'appli est plein : vos dernières modifications n'ont pas été enregistrées.
        {' '}<Link to="/outils?outil=backup" className="underline text-gold-300">Faites une sauvegarde</Link>, puis supprimez d'anciennes entrées.</p>
    </div>
  )
}
