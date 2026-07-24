import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import CosmeticCard from '../components/CosmeticCard'

// ─── The 9 locker slots ───────────────────────────────────
const LOCKER_SLOTS = [
  { type: 'outfit',        label: 'Outfit',     emoji: '👤' },
  { type: 'backpack',      label: 'Back Bling', emoji: '🎒' },  // API: "backpack"
  { type: 'pickaxe',       label: 'Pickaxe',    emoji: '⛏️' },
  { type: 'glider',        label: 'Glider',     emoji: '🪂' },
  { type: 'contrail',      label: 'Trail',      emoji: '✨' },
  { type: 'emote',         label: 'Emote',      emoji: '🕺' },
  { type: 'emote',         label: 'Emote 2',    emoji: '🕺' },
  { type: 'wrap',          label: 'Wrap',       emoji: '🎁' },
  { type: 'loadingscreen', label: 'Loading',    emoji: '🖼️' },
]

const RARITY_BORDER = {
  common:       'border-gray-500',
  uncommon:     'border-green-500',
  rare:         'border-blue-500',
  epic:         'border-purple-500',
  legendary:    'border-yellow-400',
  mythic:       'border-yellow-200',
  exotic:       'border-teal-400',
  transcendent: 'border-red-500',
}

function randomFromType(cosmetics, type) {
  const pool = cosmetics.filter(c => c.type?.value?.toLowerCase() === type)
  if (!pool.length) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export default function LockerTab() {
  const { cosmetics, ownedIds } = useApp()

  const [loadout, setLoadout] = useState(() => LOCKER_SLOTS.map(() => null))
  const [search, setSearch]   = useState('')
  const [rarityFilter, setRarityFilter] = useState('All')
  const [typeFilter, setTypeFilter]     = useState('All')
  const [showOwned, setShowOwned]       = useState(false)

  function randomize() {
    setLoadout(LOCKER_SLOTS.map(slot => randomFromType(cosmetics, slot.type)))
  }

  const rarities = useMemo(() => {
    const set = new Set(cosmetics.map(c => c.rarity?.displayValue).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [cosmetics])

  const types = useMemo(() => {
    const set = new Set(cosmetics.map(c => c.type?.displayValue).filter(Boolean))
    return ['All', ...Array.from(set).sort()]
  }, [cosmetics])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return cosmetics.filter(c => {
      if (q && !c.name?.toLowerCase().includes(q)) return false
      if (typeFilter   !== 'All' && c.type?.displayValue   !== typeFilter)   return false
      if (rarityFilter !== 'All' && c.rarity?.displayValue !== rarityFilter) return false
      if (showOwned && !ownedIds.has(c.id)) return false
      return true
    })
  }, [cosmetics, search, typeFilter, rarityFilter, showOwned, ownedIds])

  const completionPct = cosmetics.length
    ? Math.round((ownedIds.size / cosmetics.length) * 100)
    : 0

  return (
    <div className="flex flex-col">

      {/* ── Locker slots section ── */}
      <div className="px-3 pt-5 pb-4 border-b border-[#2a3450]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2
              className="text-white text-2xl font-black uppercase leading-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              My Locker
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              <span className="text-blue-400 font-bold">{ownedIds.size}</span> owned ·{' '}
              <span className="text-yellow-400 font-bold">{completionPct}%</span> collected
            </p>
          </div>
          <button
            onClick={randomize}
            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              color: '#fff',
              border: '1px solid #60a5fa',
              boxShadow: '0 0 14px rgba(59,130,246,0.4)',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Randomize
          </button>
        </div>

        {/* 3×3 slot grid — 3 cols on phone, 5 on tablet+, 9 on desktop */}
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
          {LOCKER_SLOTS.map((slot, i) => {
            const item = loadout[i]
            const imgUrl = item?.images?.smallIcon ?? item?.images?.icon
            const rarityKey = item?.rarity?.value?.toLowerCase() ?? 'common'
            const borderClass = item ? (RARITY_BORDER[rarityKey] ?? 'border-gray-600') : 'border-[#2a3450]'

            return (
              <div
                key={i}
                className={`aspect-square bg-[#131929] rounded-xl border-2 ${borderClass} flex flex-col items-center justify-center overflow-hidden relative`}
              >
                {item && imgUrl ? (
                  <>
                    <img
                      src={imgUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-1 pb-1 pt-3">
                      <p className="text-white text-[8px] font-bold text-center leading-tight line-clamp-1">
                        {item.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1 opacity-30">
                    <span className="text-2xl">{slot.emoji}</span>
                    <p className="text-gray-400 text-[9px] font-medium">{slot.label}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="text-gray-500 text-[10px] text-center mt-3">
          Your loadout for the next match — tap <span className="text-blue-400">Randomize</span> to mix it up
        </p>
      </div>

      {/* ── Section label ── */}
      <div className="px-4 pt-4 pb-1 flex items-center gap-2">
        <span className="text-yellow-400 text-[10px] font-black uppercase tracking-widest"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>All Cosmetics</span>
        <span className="flex-1 h-px bg-[#2a3450]" />
        <span className="text-gray-500 text-[10px]">Mark what you own · Track your collection</span>
      </div>

      {/* ── Filter bar ── */}
      <div className="sticky top-0 z-40 bg-[#0a0e1a] border-b border-[#2a3450] px-3 py-2.5">
        <div className="flex gap-2 items-center">
          <input
            type="search"
            placeholder="Search all cosmetics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-[#1a2236] text-white placeholder-gray-500 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 min-w-0"
          />
          <button
            onClick={() => setShowOwned(v => !v)}
            className={`shrink-0 text-xs px-3 py-2.5 rounded-xl font-bold transition-colors ${
              showOwned ? 'bg-green-600 text-white' : 'bg-[#1a2236] text-gray-400'
            }`}
          >
            ✓ Owned
          </button>
        </div>

        <div className="flex gap-2 mt-2">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="flex-1 bg-[#1a2236] text-gray-200 text-xs rounded-xl px-2.5 py-2 outline-none min-w-0"
          >
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <select
            value={rarityFilter}
            onChange={e => setRarityFilter(e.target.value)}
            className="flex-1 bg-[#1a2236] text-gray-200 text-xs rounded-xl px-2.5 py-2 outline-none min-w-0"
          >
            {rarities.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* ── Results count ── */}
      <p className="text-xs text-gray-500 px-4 pt-3 pb-1">
        {filtered.length.toLocaleString()} cosmetics
      </p>

      {/* ── Grid ── */}
      <div className="grid grid-cols-3 gap-2 px-3 pb-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
        {filtered.map(item => (
          <CosmeticCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
          No cosmetics match your filters
        </div>
      )}
    </div>
  )
}
