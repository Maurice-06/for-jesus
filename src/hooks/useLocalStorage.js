import { useState, useEffect, useCallback, useRef } from 'react'

const read = (key, initialValue) => {
  try {
    const item = window.localStorage.getItem(key)
    return item !== null ? JSON.parse(item) : initialValue
  } catch {
    return initialValue
  }
}

/**
 * État persistant dans localStorage.
 * - Les mises à jour fonctionnelles partent toujours de la valeur la plus récente
 *   (plusieurs appels successifs ne s'écrasent pas).
 * - Synchronisé entre onglets et entre composants utilisant la même clé.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => read(key, initialValue))
  const latest = useRef(storedValue)

  const setValue = useCallback((value) => {
    const next = value instanceof Function ? value(latest.current) : value
    latest.current = next
    setStoredValue(next)
    try {
      window.localStorage.setItem(key, JSON.stringify(next))
      window.dispatchEvent(new CustomEvent('fj-storage', { detail: { key } }))
    } catch (error) {
      console.error('Sauvegarde impossible :', error)
    }
  }, [key])

  useEffect(() => {
    const sync = (e) => {
      const changedKey = e.type === 'storage' ? e.key : e.detail?.key
      if (changedKey === key || changedKey === null) {
        const fresh = read(key, initialValue)
        latest.current = fresh
        setStoredValue(fresh)
      }
    }
    window.addEventListener('storage', sync)
    window.addEventListener('fj-storage', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('fj-storage', sync)
    }
    // initialValue volontairement exclu : souvent un littéral recréé à chaque rendu
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return [storedValue, setValue]
}
