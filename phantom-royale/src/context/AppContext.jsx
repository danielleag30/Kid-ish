import { createContext, useContext, useEffect, useState } from 'react'
import { fetchCosmetics } from '../utils/api'
import { getOwned, setOwned, getFavorites, setFavorites } from '../utils/storage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // --- Cosmetics (Task 1-1) ---
  const [cosmetics, setCosmetics] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadCosmetics() {
    setIsLoading(true)
    setError(null)
    try {
      const data = await fetchCosmetics()
      setCosmetics(data)
    } catch (err) {
      setError(err.message || 'Could not load skins. Check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCosmetics()
  }, [])

  // --- Collection (Task 1-2) ---
  const [ownedIds, setOwnedIds] = useState(() => new Set(getOwned()))
  const [favoritedIds, setFavoritedIds] = useState(() => new Set(getFavorites()))

  function toggleOwned(id) {
    setOwnedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      setOwned([...next])
      return next
    })
  }

  function toggleFavorited(id) {
    setFavoritedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      setFavorites([...next])
      return next
    })
  }

  return (
    <AppContext.Provider value={{
      cosmetics,
      isLoading,
      error,
      retryLoad: loadCosmetics,
      ownedIds,
      favoritedIds,
      toggleOwned,
      toggleFavorited,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
