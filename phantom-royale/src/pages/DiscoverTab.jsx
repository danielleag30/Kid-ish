import { useNavigate } from 'react-router-dom'
import loreData from '../data/lore.json'
import reloadMaps from '../data/reload_maps.json'
import blitzMaps from '../data/blitz_maps.json'

// ─── Chapter display names ─────────────────────────────────
const CHAPTER_NAMES = {
  1: 'The Island',
  2: 'The Loop Reborn',
  3: 'The Resistance',
  4: 'Fracture',
  5: 'The Underground',
  6: 'Hunters',
  7: 'Pacific Break',
}

const CHAPTER_BG_COLORS = [
  ['#1e3a5f', '#0d1f3c'],   // Ch1 — deep blue
  ['#1a3a1a', '#0d200d'],   // Ch2 — forest
  ['#3a1a1a', '#200d0d'],   // Ch3 — blood red
  ['#3a2a10', '#20180a'],   // Ch4 — gold/sand
  ['#1a0e3a', '#0e081f'],   // Ch5 — dark purple
  ['#0e1a3a', '#080e20'],   // Ch6 — midnight
  ['#0e3a2a', '#082018'],   // Ch7 — tropical teal
]

function groupByChapter(data) {
  const map = new Map()
  for (const entry of data) {
    if (!map.has(entry.chapter)) map.set(entry.chapter, [])
    map.get(entry.chapter).push(entry)
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0])
}

// ─── Mode map grid (Reload / Blitz) — Fortnite playlist tiles ──
function ModeMapGrid({ mode, maps, color, label }) {
  const navigate = useNavigate()
  return (
    <div className="pt-5 pb-6 pl-3 pr-[38%] sm:pr-[42%]">
      {/* Header */}
      <div className="mb-4 px-1">
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-1"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color }}
        >
          {label} Mode
        </p>
        <h2
          className="text-white text-3xl font-black leading-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Map Rotation
        </h2>
        <p className="text-gray-400 text-xs mt-1">{maps.length} maps · Tap to explore</p>
      </div>

      {/* Playlist tile grid — 2 columns (responsive to available width) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {maps.map(map => (
          <button
            key={map.id}
            onClick={() => navigate(`/${mode}/${map.id}`)}
            className="relative overflow-hidden rounded-xl active:scale-[0.95] transition-transform"
            style={{
              aspectRatio: '4 / 3',
              WebkitTapHighlightColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Full-bleed map image */}
            {map.mapFile ? (
              <img
                src={`/maps/${map.mapFile}`}
                alt={map.name}
                className="absolute inset-0 w-full h-full object-cover"
                onError={e => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #1a2236 0%, #0d1422 100%)' }}
              />
            )}

            {/* Bottom gradient — darkens for legible text */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)',
              }}
            />

            {/* Mode colour accent — left edge bar */}
            <div
              className="absolute inset-y-0 left-0 w-[3px]"
              style={{ background: color }}
            />

            {/* "EXPLORE" badge — top right */}
            <div
              className="absolute top-2 right-2 px-1.5 py-[2px] rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wide"
              style={{
                background: 'rgba(0,0,0,0.65)',
                color,
                border: `1px solid ${color}55`,
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
            >
              EXPLORE
            </div>

            {/* Map name — bottom left */}
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 sm:px-3 sm:pb-3">
              <p
                className="text-white font-black leading-tight text-left"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 'clamp(11px, 3vw, 15px)',
                  textShadow: '0 1px 6px rgba(0,0,0,0.9)',
                }}
              >
                {map.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Chapter card ─────────────────────────────────────────
function ChapterCard({ chapterNum, entries, index }) {
  const navigate = useNavigate()
  const name = CHAPTER_NAMES[chapterNum] ?? `Chapter ${chapterNum}`
  const seasonCount = entries.length
  const colors = CHAPTER_BG_COLORS[(chapterNum - 1) % CHAPTER_BG_COLORS.length]

  return (
    <button
      onClick={() => navigate(`/lore/${chapterNum}`)}
      className="w-full text-left rounded-2xl overflow-hidden relative active:scale-[0.98] transition-transform"
      style={{
        background: `linear-gradient(135deg, ${colors[0]}cc 0%, ${colors[1]}ee 100%)`,
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(4px)',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Chapter badge */}
        <div
          className="shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5"
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <span
            className="text-yellow-400 text-[8px] font-black uppercase tracking-widest"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            CH.
          </span>
          <span
            className="text-white text-2xl font-black leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {chapterNum}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p
            className="text-yellow-400 text-[9px] font-black uppercase tracking-widest"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Chapter {chapterNum}
          </p>
          <p
            className="text-white font-black text-lg leading-tight mt-0.5"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {name}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {Array.from({ length: seasonCount }, (_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.35)' }}
              />
            ))}
            <span className="text-gray-400 text-[10px]">
              {seasonCount === 1 ? '1 season' : `${seasonCount} seasons`}
            </span>
          </div>
        </div>

        <span className="text-white/30 text-2xl shrink-0">›</span>
      </div>
    </button>
  )
}

// ─── Main component ────────────────────────────────────────
export default function DiscoverTab({ mode }) {
  if (mode === 'reload') {
    return <ModeMapGrid mode="reload" maps={reloadMaps} color="#22c55e" label="Reload" />
  }

  if (mode === 'blitz') {
    return <ModeMapGrid mode="blitz" maps={blitzMaps} color="#a855f7" label="Blitz" />
  }

  const filteredLore = mode === 'og'
    ? loreData.filter(e => e.chapter === 1)
    : loreData

  const chapters = groupByChapter(filteredLore)

  return (
    <div className="pt-5 pb-6 pl-3 pr-[38%] sm:pr-[42%]">
      {/* Mode header */}
      <div className="mb-5 px-1">
        {mode === 'og' ? (
          <>
            <p
              className="text-yellow-400 text-[10px] font-black uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              OG Mode
            </p>
            <h2
              className="text-white text-3xl font-black leading-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              The Original Island
            </h2>
            <p className="text-gray-400 text-xs mt-1">Chapter 1 · Where it all began</p>
          </>
        ) : (
          <>
            <p
              className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Battle Royale
            </p>
            <h2
              className="text-white text-3xl font-black leading-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              The Full Story
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              {chapters.length} chapters · Every season, told by Jonesy
            </p>
          </>
        )}
      </div>

      {/* Chapter cards */}
      <div className="flex flex-col gap-2">
        {chapters.map(([chapterNum, entries], index) => (
          <ChapterCard
            key={chapterNum}
            chapterNum={chapterNum}
            entries={entries}
            index={index}
          />
        ))}
      </div>

      {chapters.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <span className="text-4xl">📖</span>
          <p className="text-gray-400 text-sm">No chapters found</p>
        </div>
      )}
    </div>
  )
}
