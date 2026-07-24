import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import CosmeticCard from '../components/CosmeticCard'

export default function SearchTab() {
  const { cosmetics } = useApp()

  const [search, setSearch]           = useState('')
  const [typeFilter, setTypeFilter]   = useState('All')
  const [rarityFilter, setRarityFilter] = useState('All')

  const types = useMemo(() => {
    const set = new Set(cosmetics.map(c => c.type?.displayValue).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [cosmetics])

  const rarities = useMemo(() => {
    const set = new Set(cosmetics.map(c => c.rarity?.displayValue).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [cosmetics])

  const hasFilters = search !== '' || typeFilter !== 'All' || rarityFilter !== 'All'

  const filtered = useMemo(() => {
    if (!hasFilters) return []
    const q = search.toLowerCase()
    return cosmetics.filter(c => {
      if (q && !c.name?.toLowerCase().includes(q)) return false
      if (typeFilter   !== 'All' && c.type?.displayValue   !== typeFilter)   return false
      if (rarityFilter !== 'All' && c.rarity?.displayValue !== rarityFilter) return false
      return true
    })
  }, [cosmetics, search, typeFilter, rarityFilter, hasFilters])

  return (
    <div className="flex flex-col">

      {/* ── Search header ── */}
      <div className="sticky top-0 z-40 bg-[#0a0e1a] border-b border-[#2a3450] px-3 pt-4 pb-3">
        <h1
          className="text-white text-2xl font-black uppercase mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Search
        </h1>

        <input
          type="search"
          placeholder="Skin name, emote, pickaxe..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
          className="w-full bg-[#1a2236] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 mt-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="flex-1 bg-[#1a2236] text-gray-200 text-xs rounded-xl px-3 py-2 outline-none min-w-0"
          >
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <select
            value={rarityFilter}
            onChange={e => setRarityFilter(e.target.value)}
            className="flex-1 bg-[#1a2236] text-gray-200 text-xs rounded-xl px-3 py-2 outline-none min-w-0"
          >
            {rarities.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* ── Empty state ── */}
      {!hasFilters && (
        <div className="flex flex-col items-center justify-center gap-4 py-28 px-8 text-center">
          <span className="text-6xl select-none">🔍</span>
          <div>
            <p className="text-white font-bold text-lg"
               style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Find anything
            </p>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">
              Search across all {cosmetics.length.toLocaleString()} cosmetics — skins, pickaxes, emotes, and more
            </p>
          </div>
        </div>
      )}

      {/* ── Results ── */}
      {hasFilters && (
        <>
          <p className="text-xs text-gray-500 px-4 pt-3 pb-1">
            {filtered.length.toLocaleString()} results
          </p>
          <div className="grid grid-cols-3 gap-2 px-3 pb-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
            {filtered.map(item => (
              <CosmeticCard key={item.id} item={item} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <span className="text-4xl">😶</span>
              <p className="text-gray-400 text-sm">No results for "{search}"</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
