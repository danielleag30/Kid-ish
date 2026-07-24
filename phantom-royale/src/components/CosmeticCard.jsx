import { useApp } from '../context/AppContext'

const RARITY_BORDER = {
  common:       'border-gray-500',
  uncommon:     'border-green-500',
  rare:         'border-blue-500',
  epic:         'border-purple-500',
  legendary:    'border-yellow-400 legendary-glow',
  mythic:       'border-yellow-200',
  exotic:       'border-teal-400',
  transcendent: 'border-red-500',
}

const RARITY_LABEL = {
  common:       'text-gray-400',
  uncommon:     'text-green-400',
  rare:         'text-blue-400',
  epic:         'text-purple-400',
  legendary:    'text-yellow-400',
  mythic:       'text-yellow-200',
  exotic:       'text-teal-400',
  transcendent: 'text-red-400',
}

export default function CosmeticCard({ item }) {
  const { ownedIds, toggleOwned, favoritedIds, toggleFavorited } = useApp()

  const id = item.id
  const isOwned = ownedIds.has(id)
  const isFavorited = favoritedIds.has(id)
  const rarityKey = item.rarity?.value?.toLowerCase() ?? 'common'
  const borderClass = RARITY_BORDER[rarityKey] ?? 'border-gray-600'
  const labelClass = RARITY_LABEL[rarityKey] ?? 'text-gray-400'
  const isLegendary = rarityKey === 'legendary' || rarityKey === 'mythic'
  const imageUrl = item.images?.smallIcon ?? item.images?.icon ?? null

  return (
    <div className={`relative bg-[#1a2236] rounded-xl border-2 ${borderClass} flex flex-col overflow-hidden`}>
      {/* Image */}
      <div className="aspect-square bg-[#131929] flex items-center justify-center overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        )}
      </div>

      {/* Info */}
      <div className="px-2 pt-1.5 pb-1 flex flex-col gap-0.5">
        <p className={`text-xs font-semibold leading-tight line-clamp-2 ${isLegendary ? 'legendary-shimmer' : 'text-white'}`}>
          {item.name}
        </p>
        <p className={`text-[10px] capitalize ${labelClass}`}>
          {item.rarity?.displayValue ?? 'Common'}
        </p>
      </div>

      {/* Owned button */}
      <button
        onClick={() => toggleOwned(id)}
        className={`mx-2 mb-2 py-1 rounded-lg text-xs font-bold transition-colors ${
          isOwned
            ? 'bg-green-600 text-white'
            : 'bg-[#0a0e1a] text-gray-400 hover:bg-gray-700'
        }`}
      >
        {isOwned ? '✓ Owned' : 'Own it'}
      </button>

      {/* Favorite */}
      <button
        onClick={() => toggleFavorited(id)}
        className="absolute top-1 right-1 text-base leading-none drop-shadow"
        aria-label={isFavorited ? 'Remove favorite' : 'Add favorite'}
      >
        {isFavorited ? '❤️' : '🤍'}
      </button>

      {/* Owned badge */}
      {isOwned && (
        <div className="absolute top-1 left-1 bg-green-600 rounded-full w-5 h-5 flex items-center justify-center text-white text-[10px] font-bold">
          ✓
        </div>
      )}
    </div>
  )
}
