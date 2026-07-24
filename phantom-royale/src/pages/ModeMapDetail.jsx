import { useParams, useNavigate } from 'react-router-dom'
import reloadMaps from '../data/reload_maps.json'
import blitzMaps from '../data/blitz_maps.json'

const MODE_CONFIG = {
  reload: {
    label: 'Reload',
    color: '#22c55e',
    borderColor: '#4ade80',
    glow: 'rgba(34,197,94,0.4)',
    maps: reloadMaps,
  },
  blitz: {
    label: 'Blitz',
    color: '#a855f7',
    borderColor: '#c084fc',
    glow: 'rgba(168,85,247,0.4)',
    maps: blitzMaps,
  },
}

export default function ModeMapDetail() {
  const { mode, mapId } = useParams()
  const navigate = useNavigate()

  const config = MODE_CONFIG[mode]
  if (!config) {
    return (
      <div className="min-h-svh bg-[#0a0e1a] flex items-center justify-center text-gray-400">
        Unknown mode
      </div>
    )
  }

  const map = config.maps.find(m => m.id === mapId)
  if (!map) {
    return (
      <div className="min-h-svh bg-[#0a0e1a] flex flex-col items-center justify-center gap-4 p-8 text-center">
        <button onClick={() => navigate('/')} className="text-blue-400 text-sm">← Back</button>
        <p className="text-gray-400">Map not found</p>
      </div>
    )
  }

  const mapSrc = map.mapFile ? `/maps/${map.mapFile}` : null

  return (
    <div
      className="min-h-svh pb-8"
      style={{ background: 'linear-gradient(160deg, #060e1e 0%, #0b1a33 55%, #0a0e1a 100%)' }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 pt-4 pb-3"
        style={{ background: 'linear-gradient(to bottom, rgba(6,14,30,0.95) 0%, transparent 100%)' }}
      >
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-blue-400 text-sm font-medium active:opacity-60"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          ‹ Back
        </button>
        <p
          className="text-xs font-black uppercase tracking-widest"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: config.color }}
        >
          {config.label} Mode
        </p>
      </div>

      {/* Title */}
      <div className="px-4 pt-1 pb-4 border-b border-[#2a3450]">
        <h1
          className="text-white text-4xl font-black leading-tight uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {map.name}
        </h1>
        {map.description && (
          <p className="text-gray-300 text-sm mt-2 leading-relaxed">{map.description}</p>
        )}
      </div>

      {/* Map image */}
      <div className="mx-4 mt-5">
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: config.color }}
        >
          The Map
        </p>
        {mapSrc ? (
          <img
            src={mapSrc}
            alt={map.name}
            className="w-full rounded-2xl border border-[#2a3450]"
            style={{ borderColor: `${config.borderColor}44` }}
          />
        ) : (
          <div className="w-full aspect-video bg-[#1a2236] rounded-2xl border border-[#2a3450] flex flex-col items-center justify-center gap-3 text-gray-500">
            <span className="text-4xl opacity-40">🗺️</span>
            <span className="text-sm">Map coming soon</span>
          </div>
        )}
      </div>

      {/* YouTube */}
      {map.youtubeId && (
        <div className="mx-4 mt-5">
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", color: config.color }}
          >
            Trailer
          </p>
          <div className="aspect-video rounded-2xl overflow-hidden border border-[#2a3450]">
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube.com/embed/${map.youtubeId}?rel=0&modestbranding=1`}
              title={map.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  )
}
