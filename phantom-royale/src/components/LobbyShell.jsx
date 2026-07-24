import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import ItemShop from '../pages/ItemShop'
import DiscoverTab from '../pages/DiscoverTab'
import LockerTab from '../pages/LockerTab'
import SearchTab from '../pages/SearchTab'

// ─── Config ───────────────────────────────────────────────
const TABS = [
  { id: 'discover', label: 'DISCOVER' },
  { id: 'shop',     label: 'SHOP'     },
  { id: 'locker',   label: 'LOCKER'   },
  { id: 'search',   label: 'SEARCH'   },
]

export const MODES = [
  {
    id: 'br',
    short: 'BR',
    label: 'Battle Royale',
    tagline: '100 players',
    art: '/maps/chapter1-season1.jpg',
    bg: '#1d4ed8',
    gradient: 'linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 100%)',
    border: '#60a5fa',
    glow: 'rgba(59,130,246,0.55)',
  },
  {
    id: 'reload',
    short: 'RELOAD',
    label: 'Reload',
    tagline: 'Fast respawns',
    art: '/maps/reload/reload-venture.jpg',
    bg: '#15803d',
    gradient: 'linear-gradient(160deg, #14532d 0%, #15803d 100%)',
    border: '#4ade80',
    glow: 'rgba(34,197,94,0.55)',
  },
  {
    id: 'og',
    short: 'OG',
    label: 'OG',
    tagline: 'Chapter 1',
    art: '/maps/chapter1-season1.jpg',
    bg: '#92400e',
    gradient: 'linear-gradient(160deg, #78350f 0%, #b45309 100%)',
    border: '#fcd34d',
    glow: 'rgba(245,158,11,0.55)',
  },
  {
    id: 'blitz',
    short: 'BLITZ',
    label: 'Blitz',
    tagline: 'Speed mode',
    art: '/maps/blitz/blitz-starfall-island.jpg',
    bg: '#6b21a8',
    gradient: 'linear-gradient(160deg, #581c87 0%, #7e22ce 100%)',
    border: '#c084fc',
    glow: 'rgba(168,85,247,0.55)',
  },
]

// Stable date seed
function dateSeed() {
  const d = new Date().toDateString()
  let h = 0
  for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) >>> 0
  return h
}

export default function LobbyShell() {
  const { cosmetics } = useApp()

  const [activeTab, setActiveTab] = useState('discover')
  const [activeMode, setActiveMode] = useState(
    () => localStorage.getItem('phantom_mode') ?? 'br'
  )

  function selectMode(id) {
    setActiveMode(id)
    localStorage.setItem('phantom_mode', id)
  }

  // Daily character — featured outfit, seeded by date
  const character = useMemo(() => {
    if (!cosmetics.length) return null
    const outfits = cosmetics.filter(
      c => c.type?.value === 'outfit' && c.images?.featured
    )
    if (!outfits.length) return null
    return outfits[dateSeed() % outfits.length]
  }, [cosmetics])

  const mode = MODES.find(m => m.id === activeMode) ?? MODES[0]
  const showModeBar = activeTab === 'discover'

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #060e1e 0%, #0b1a33 55%, #0a0e1a 100%)' }}
    >
      {/* ── Background diagonal stripe texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            #ffffff 0px, #ffffff 1px,
            transparent 1px, transparent 12px
          )`,
        }}
      />

      {/* ── Character display (Discover only) ── */}
      {character && activeTab === 'discover' && (
        <div className="absolute inset-0 flex items-end justify-end pointer-events-none overflow-hidden">
          <img
            src={character.images.featured}
            alt=""
            className="h-[78vh] w-auto object-contain select-none"
            style={{
              filter: `drop-shadow(0 0 70px ${mode.glow})`,
              transform: 'translateX(8%)',
            }}
          />
          {/* left vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060e1e]/90 via-[#060e1e]/30 to-transparent" />
          {/* bottom vignette */}
          <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-t from-[#0a0e1a] via-[#0a0e1a]/70 to-transparent" />
          {/* top vignette */}
          <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
        </div>
      )}

      {/* ── Top tab bar ── */}
      <div className="absolute top-0 left-0 right-0 z-50">
        {/* Safe area + gradient bg */}
        <div style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 100%)' }}>
          <div className="flex items-stretch px-2 pt-3 pb-0">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex flex-col items-center pt-1 pb-2.5 relative"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <span
                    className={`text-[11px] font-black tracking-widest uppercase transition-all ${
                      isActive ? 'text-yellow-400' : 'text-white/50'
                    }`}
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full"
                      style={{ background: '#facc15' }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Scrollable content area ── */}
      <div
        className="absolute left-0 right-0 overflow-y-auto overscroll-contain"
        style={{
          top: '48px',
          bottom: showModeBar ? '108px' : '0px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {activeTab === 'discover' && <DiscoverTab mode={activeMode} />}
        {activeTab === 'shop'     && <ItemShop />}
        {activeTab === 'locker'   && <LockerTab />}
        {activeTab === 'search'   && <SearchTab />}
      </div>

      {/* ── Bottom mode bar (Discover only) ── */}
      {showModeBar && (
        <div className="absolute bottom-0 left-0 right-0 z-50">
          {/* Fade-up ambient gradient */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '160px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)',
            }}
          />
          <div className="relative px-2 pb-3 pt-2 sm:pb-4 sm:pt-3">
            <div className="flex gap-1.5 sm:gap-2">
              {MODES.map(m => {
                const isActive = activeMode === m.id
                return (
                  <button
                    key={m.id}
                    onClick={() => selectMode(m.id)}
                    className="flex-1 relative overflow-hidden rounded-xl active:scale-95"
                    style={{
                      height: isActive ? '80px' : '66px',
                      border: `1.5px solid ${isActive ? m.border : 'rgba(255,255,255,0.08)'}`,
                      boxShadow: isActive
                        ? `0 0 22px ${m.glow}, 0 -4px 16px ${m.glow}`
                        : 'none',
                      WebkitTapHighlightColor: 'transparent',
                      transition: 'height 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                    }}
                  >
                    {/* Map art background */}
                    {m.art && (
                      <img
                        src={m.art}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                        style={{ opacity: isActive ? 0.38 : 0.12 }}
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    )}

                    {/* Color gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: isActive
                          ? `linear-gradient(to top, ${m.bg}f0 0%, ${m.bg}88 55%, transparent 100%)`
                          : 'linear-gradient(to top, rgba(6,10,22,0.88) 0%, rgba(6,10,22,0.7) 100%)',
                      }}
                    />

                    {/* Diagonal texture on active */}
                    {isActive && (
                      <div
                        className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{
                          backgroundImage: `repeating-linear-gradient(-45deg, #fff 0px, #fff 1px, transparent 1px, transparent 9px)`,
                        }}
                      />
                    )}

                    {/* Top highlight bar */}
                    {isActive && (
                      <div
                        className="absolute top-0 left-0 right-0"
                        style={{
                          height: '2px',
                          background: `linear-gradient(to right, transparent 0%, ${m.border} 30%, ${m.border} 70%, transparent 100%)`,
                        }}
                      />
                    )}

                    {/* Label content */}
                    <div className="relative flex flex-col items-center justify-center h-full gap-[2px] px-1">
                      <span
                        className="font-black uppercase tracking-wider leading-none"
                        style={{
                          fontFamily: "'Barlow Condensed', sans-serif",
                          fontSize: 'clamp(10px, 2.8vw, 15px)',
                          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
                          textShadow: isActive ? `0 0 14px ${m.border}` : 'none',
                        }}
                      >
                        {m.short}
                      </span>
                      {isActive && (
                        <span
                          className="leading-none text-white/50"
                          style={{
                            fontSize: 'clamp(7px, 1.6vw, 10px)',
                            fontFamily: "'Barlow', sans-serif",
                            letterSpacing: '0.02em',
                          }}
                        >
                          {m.tagline}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
