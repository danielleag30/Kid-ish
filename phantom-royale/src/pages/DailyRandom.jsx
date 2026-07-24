import { useState } from 'react'
import { useApp } from '../context/AppContext'

function dateSeed() {
  const d = new Date()
  return `${d.getFullYear()}${d.getMonth()}${d.getDate()}`
}

function seededIndex(seed, max) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  }
  return Math.abs(h) % max
}

const RARITY_BG = {
  common:    'from-gray-800 to-gray-900',
  uncommon:  'from-green-900 to-gray-900',
  rare:      'from-blue-900 to-gray-900',
  epic:      'from-purple-900 to-gray-900',
  legendary: 'from-yellow-900 to-gray-900',
  mythic:    'from-yellow-800 to-gray-900',
  exotic:    'from-teal-900 to-gray-900',
}

export default function DailyRandom() {
  const { cosmetics, ownedIds, toggleOwned } = useApp()
  const [extraIndex, setExtraIndex] = useState(null)

  if (!cosmetics.length) return null

  const dailyIdx = seededIndex(dateSeed(), cosmetics.length)
  const activeIdx = extraIndex ?? dailyIdx
  const item = cosmetics[activeIdx]
  const rarityKey = item.rarity?.value?.toLowerCase() ?? 'common'
  const bgGradient = RARITY_BG[rarityKey] ?? 'from-gray-800 to-gray-900'
  const isOwned = ownedIds.has(item.id)
  const isDaily = extraIndex === null

  function giveAnother() {
    let idx
    do { idx = Math.floor(Math.random() * cosmetics.length) } while (idx === activeIdx)
    setExtraIndex(idx)
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="px-4 pt-4 pb-2 border-b border-[#2a3450]">
        <h1 className="text-2xl font-bold text-white uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {isDaily ? "Today's Pick" : "Random Skin"}
        </h1>
        {isDaily && <p className="text-gray-400 text-xs mt-0.5">Changes every day at midnight</p>}
      </div>

      <div className={`mx-4 mt-4 rounded-2xl bg-gradient-to-b ${bgGradient} border border-[#2a3450] overflow-hidden`}>
        {/* Big image */}
        <div className="flex justify-center py-6 px-4">
          {item.images?.icon ? (
            <img
              src={item.images.icon}
              alt={item.name}
              className="w-48 h-48 object-contain drop-shadow-2xl"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-gray-500 text-sm text-center">
              {item.name}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          <h2 className="text-white text-3xl font-bold leading-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {item.name}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-[#0a0e1a] text-gray-300 text-xs px-3 py-1 rounded-full capitalize">
              {item.rarity?.displayValue ?? 'Common'}
            </span>
            <span className="bg-[#0a0e1a] text-gray-300 text-xs px-3 py-1 rounded-full capitalize">
              {item.type?.displayValue ?? 'Item'}
            </span>
          </div>
          {item.description && (
            <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
          )}

          {/* Owned toggle */}
          <button
            onClick={() => toggleOwned(item.id)}
            className={`mt-2 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-colors ${
              isOwned ? 'bg-green-600 text-white' : 'bg-[#0a0e1a] text-gray-300 border border-[#2a3450]'
            }`}
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {isOwned ? '✓ You Own This' : 'I Own This'}
          </button>
        </div>
      </div>

      {/* Give me another */}
      <div className="px-4 mt-4 pb-4">
        <button
          onClick={giveAnother}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl uppercase tracking-wide transition-colors"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Give me another 🎲
        </button>
        {extraIndex !== null && (
          <button
            onClick={() => setExtraIndex(null)}
            className="w-full mt-2 py-2 text-gray-400 text-sm"
          >
            ← Back to today's pick
          </button>
        )}
      </div>
    </div>
  )
}
