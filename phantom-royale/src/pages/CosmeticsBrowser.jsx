import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import CosmeticCard from '../components/CosmeticCard'

export default function CosmeticsBrowser() {
  const { cosmetics, ownedIds, favoritedIds } = useApp()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [rarityFilter, setRarityFilter] = useState('All')
  const [showOwned, setShowOwned] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)

  // Derive filter options from data
  const types = useMemo(() => {
    const set = new Set(cosmetics.map(c => c.type?.displayValue).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [cosmetics])

  const rarities = useMemo(() => {
    const set = new Set(cosmetics.map(c => c.rarity?.displayValue).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [cosmetics])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return cosmetics.filter(c => {
      if (q && !c.name?.toLowerCase().includes(q)) return false
      if (typeFilter !== 'All' && c.type?.displayValue !== typeFilter) return false
      if (rarityFilter !== 'All' && c.rarity?.displayValue !== rarityFilter) return false
      if (showOwned && !ownedIds.has(c.id)) return false
      if (showFavorites && !favoritedIds.has(c.id)) return false
      return true
    })
  }, [cosmetics, search, typeFilter, rarityFilter, showOwned, showFavorites, ownedIds, favoritedIds])

  const completionPct = cosmetics.length > 0
    ? Math.round((ownedIds.size / cosmetics.length) * 100)
    : 0

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-900 border-b border-gray-700 px-4 pt-4 pb-3 flex flex-col gap-3">
        {/* Title + completion */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">All Skins</h1>
          <span className="text-sm text-gray-400">
            <span className="text-green-400 font-bold">{ownedIds.size}</span>
            <span> / {cosmetics.length} · </span>
            <span className="text-blue-400 font-bold">{completionPct}%</span>
          </span>
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search skins..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Filters row */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 outline-none shrink-0"
          >
            {types.map(t => <option key={t}>{t}</option>)}
          </select>

          <select
            value={rarityFilter}
            onChange={e => setRarityFilter(e.target.value)}
            className="bg-gray-800 text-gray-200 text-xs rounded-lg px-3 py-2 outline-none shrink-0"
          >
            {rarities.map(r => <option key={r}>{r}</option>)}
          </select>

          <button
            onClick={() => setShowOwned(v => !v)}
            className={`shrink-0 text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
              showOwned ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            ✓ Owned
          </button>

          <button
            onClick={() => setShowFavorites(v => !v)}
            className={`shrink-0 text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
              showFavorites ? 'bg-pink-600 text-white' : 'bg-gray-800 text-gray-300'
            }`}
          >
            ❤️ Favorites
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500 px-4 pt-3 pb-1">
        {filtered.length.toLocaleString()} skins
      </p>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 px-3 pb-4 sm:grid-cols-4 md:grid-cols-5">
        {filtered.map(item => (
          <CosmeticCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm py-20">
          No skins match your filters
        </div>
      )}
    </div>
  )
}
