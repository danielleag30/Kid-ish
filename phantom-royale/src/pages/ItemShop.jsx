import { useEffect, useState } from 'react'
import { fetchShop } from '../utils/api'
import { useApp } from '../context/AppContext'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

const RARITY_BORDER = {
  common:    'border-gray-500', uncommon: 'border-green-500',
  rare:      'border-blue-500', epic:     'border-purple-500',
  legendary: 'border-yellow-400', mythic: 'border-yellow-200',
  exotic:    'border-teal-400', transcendent: 'border-red-500',
}

function ShopCard({ entry, ownedIds }) {
  const item = entry.items?.[0]
  if (!item) return null
  const rarity = item.rarity?.value?.toLowerCase() ?? 'common'
  const border = RARITY_BORDER[rarity] ?? 'border-gray-600'
  const isOwned = ownedIds.has(item.id)
  const price = entry.finalPrice ?? entry.regularPrice ?? '—'

  return (
    <div className={`relative bg-[#1a2236] rounded-xl border-2 ${border} overflow-hidden flex flex-col`}>
      <div className="aspect-square bg-[#131929]">
        {item.images?.icon && (
          <img src={item.images.icon} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-2 flex flex-col gap-1 flex-1 justify-between">
        <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">{item.name}</p>
        <div className="flex items-center justify-between">
          <span className="text-yellow-400 text-xs font-bold">⚡ {price}</span>
          {isOwned && (
            <span className="bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">Owned</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ItemShop() {
  const { ownedIds } = useApp()
  const isOnline = useOnlineStatus()
  const [shopData, setShopData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isOnline) { setLoading(false); return }
    fetchShop()
      .then(data => { setShopData(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [isOnline])

  if (!isOnline) return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 px-8 text-center">
      <p className="text-4xl">📡</p>
      <h2 className="text-white text-2xl font-bold uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
        You're offline
      </h2>
      <p className="text-gray-400 text-sm">Check back when you're online — the shop updates every day!</p>
    </div>
  )

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 px-8 text-center">
      <p className="text-4xl">😵</p>
      <p className="text-white font-bold">Couldn't load the shop</p>
      <p className="text-gray-400 text-sm">{error}</p>
    </div>
  )

  const featured = shopData?.featured?.entries ?? []
  const daily = shopData?.daily?.entries ?? []
  const special = shopData?.specialFeatured?.entries ?? shopData?.specialDaily?.entries ?? []

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-4 pb-2 border-b border-[#2a3450]">
        <h1 className="text-2xl font-bold text-white uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Item Shop
        </h1>
        <p className="text-gray-400 text-xs mt-0.5">Today's shop — updates daily at midnight UTC</p>
      </div>

      {featured.length > 0 && (
        <section className="px-3 pt-4">
          <h2 className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Featured</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {featured.map((e, i) => <ShopCard key={i} entry={e} ownedIds={ownedIds} />)}
          </div>
        </section>
      )}

      {daily.length > 0 && (
        <section className="px-3 pt-4 pb-4">
          <h2 className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Daily</h2>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {daily.map((e, i) => <ShopCard key={i} entry={e} ownedIds={ownedIds} />)}
          </div>
        </section>
      )}

      {special.length > 0 && (
        <section className="px-3 pt-4 pb-4">
          <h2 className="text-purple-400 text-sm font-bold uppercase tracking-wider mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Special</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {special.map((e, i) => <ShopCard key={i} entry={e} ownedIds={ownedIds} />)}
          </div>
        </section>
      )}
    </div>
  )
}
