import { createContext, useContext } from 'react'
import { useSpiritual } from '../hooks/useSpiritual'

const SpiritualContext = createContext(null)

export function SpiritualProvider({ children }) {
  const spiritual = useSpiritual()
  return (
    <SpiritualContext.Provider value={spiritual}>
      {children}
    </SpiritualContext.Provider>
  )
}

export function useSpiritualContext() {
  const ctx = useContext(SpiritualContext)
  if (!ctx) throw new Error('useSpiritualContext must be used within SpiritualProvider')
  return ctx
}
