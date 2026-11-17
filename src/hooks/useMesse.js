import { useState, useEffect } from 'react'
import { fetchMesseDuJour } from '../utils/aelf'

/** Lectures de la messe du jour (AELF), partagées entre l'accueil, la Bible et le Moment avec Dieu. */
export function useMesseDuJour() {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [reload, setReload] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState(s => ({ ...s, loading: true, error: null }))
    fetchMesseDuJour(new Date(), { signal: controller.signal })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => {
        if (err.name === 'AbortError') return
        setState({
          data: null, loading: false,
          error: navigator.onLine === false ? 'Hors connexion : les lectures du jour ne sont pas disponibles.' : err.message,
        })
      })
    return () => controller.abort()
  }, [reload])

  return { ...state, retry: () => setReload(r => r + 1) }
}
