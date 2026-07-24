import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import loreData from '../data/lore.json'

// ─── Audio ────────────────────────────────────────────────
// Try pre-generated FakeYou WAV first; fall back to Web Speech
function buildAudioPath(chapter, season) {
  return `/audio/chapter${chapter}-season${season}.wav`
}

const activeAudio = { ref: null }

async function playLore(chapter, season, text) {
  // Stop any currently playing audio
  if (activeAudio.ref) {
    activeAudio.ref.pause()
    activeAudio.ref = null
  }
  if (window.speechSynthesis) window.speechSynthesis.cancel()

  // Try pre-generated clip
  const src = buildAudioPath(chapter, season)
  const audio = new Audio(src)

  try {
    await audio.play()
    activeAudio.ref = audio
  } catch {
    // File doesn't exist yet — fall back to Web Speech API
    speakFallback(text)
  }
}

function speakFallback(text) {
  if (!window.speechSynthesis) return
  const utter = new SpeechSynthesisUtterance(text)

  function doSpeak() {
    const voices = window.speechSynthesis.getVoices()
    const preferred = voices.find(
      v => v.name.toLowerCase().includes('daniel') || v.lang === 'en-US'
    )
    if (preferred) utter.voice = preferred
    utter.rate  = 0.9
    utter.pitch = 0.85
    window.speechSynthesis.speak(utter)
  }

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      doSpeak()
      window.speechSynthesis.onvoiceschanged = null
    }
  } else {
    doSpeak()
  }
}

// ─── Component ────────────────────────────────────────────
export default function ChapterDetail() {
  const { chapter } = useParams()
  const navigate    = useNavigate()
  const chapterNum  = Number(chapter)

  const entries = loreData
    .filter(e => e.chapter === chapterNum)
    .sort((a, b) => a.season - b.season)

  const [selectedSeason, setSelectedSeason] = useState(0)
  const [zoomed, setZoomed]                 = useState(false)
  const [playing, setPlaying]               = useState(false)

  if (entries.length === 0) {
    return (
      <div
        className="min-h-svh flex flex-col items-center justify-center gap-4 p-8 text-center"
        style={{ background: 'linear-gradient(160deg, #060e1e 0%, #0b1a33 55%, #0a0e1a 100%)' }}
      >
        <button
          onClick={() => navigate('/')}
          className="text-blue-400 text-sm mb-4"
        >
          ← Back to lobby
        </button>
        <p className="text-gray-400">Chapter {chapter} hasn't been added yet.</p>
      </div>
    )
  }

  const entry  = entries[selectedSeason]
  const mapSrc = entry.mapFile ? `/maps/${entry.mapFile}` : null

  async function handleHearJonesy() {
    setPlaying(true)
    try {
      await playLore(entry.chapter, entry.season, entry.loreText)
    } finally {
      // Reset after a beat so the button can be pressed again
      setTimeout(() => setPlaying(false), 1200)
    }
  }

  return (
    <div
      className="min-h-svh pb-8"
      style={{ background: 'linear-gradient(160deg, #060e1e 0%, #0b1a33 55%, #0a0e1a 100%)' }}
    >
      {/* ── Top bar ── */}
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
          className="text-yellow-400 text-xs font-black uppercase tracking-widest"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Chapter {chapterNum}
        </p>
      </div>

      {/* ── Chapter title ── */}
      <div className="px-4 pt-1 pb-4 border-b border-[#2a3450]">
        <h1
          className="text-white text-4xl font-black leading-tight uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          {entry.title}
        </h1>
      </div>

      {/* ── Season selector ── */}
      {entries.length > 1 && (
        <div className="flex gap-2 px-4 pt-4 overflow-x-auto scrollbar-none">
          {entries.map((e, i) => (
            <button
              key={i}
              onClick={() => { setSelectedSeason(i); setZoomed(false) }}
              className={`shrink-0 text-xs px-4 py-2 rounded-full font-black uppercase tracking-wider transition-all ${
                i === selectedSeason
                  ? 'bg-yellow-400 text-black'
                  : 'bg-[#1a2236] text-gray-400 border border-[#2a3450]'
              }`}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Season {e.season}
            </button>
          ))}
        </div>
      )}

      {/* ── Lore card ── */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden"
           style={{ background: 'rgba(26,34,54,0.85)', border: '1px solid rgba(42,52,80,0.8)', backdropFilter: 'blur(8px)' }}>
        <div className="p-4">
          <p className="text-gray-200 text-sm leading-relaxed">{entry.loreText}</p>
        </div>

        {/* Hear Jonesy button */}
        <button
          onClick={handleHearJonesy}
          disabled={playing}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 border-t border-[#2a3450] transition-opacity active:opacity-60"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <span className="text-lg">{playing ? '⏸' : '🔊'}</span>
          <span
            className="text-yellow-400 text-xs font-black uppercase tracking-widest"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {playing ? 'Playing...' : 'Hear Jonesy'}
          </span>
          {!playing && (
            <span className="text-gray-500 text-xs font-normal normal-case tracking-normal">
              (make sure sound is on)
            </span>
          )}
        </button>
      </div>

      {/* ── Map ── */}
      <div className="mx-4 mt-5">
        <p
          className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          The Island — Season {entry.season}
        </p>

        {mapSrc ? (
          <>
            <img
              src={mapSrc}
              alt={`Chapter ${entry.chapter} Season ${entry.season} map`}
              className="w-full rounded-2xl border border-[#2a3450] cursor-zoom-in active:opacity-80"
              onClick={() => setZoomed(true)}
              onError={e => {
                e.currentTarget.style.display = 'none'
                e.currentTarget.nextSibling.style.display = 'flex'
              }}
            />
            <div
              className="hidden w-full aspect-square bg-[#1a2236] rounded-2xl border border-[#2a3450] items-center justify-center text-gray-500 text-sm"
            >
              Map coming soon
            </div>
          </>
        ) : (
          <div className="w-full aspect-square bg-[#1a2236] rounded-2xl border border-[#2a3450] flex flex-col items-center justify-center gap-3 text-gray-500">
            <span className="text-4xl opacity-40">🗺️</span>
            <span className="text-sm">Map coming soon</span>
          </div>
        )}
      </div>

      {/* ── YouTube embed ── */}
      {entry.youtubeId && (
        <div className="mx-4 mt-5">
          <p
            className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Vibe of the Era
          </p>
          <div className="aspect-video rounded-2xl overflow-hidden border border-[#2a3450]">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${entry.youtubeId}?rel=0&modestbranding=1`}
              title={`Chapter ${entry.chapter} Season ${entry.season}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ── Map zoom lightbox ── */}
      {zoomed && (
        <div
          className="fixed inset-0 bg-black z-50"
          style={{ touchAction: 'none' }}
        >
          {/* Scrollable + pinch-zoomable container */}
          <div
            className="w-full h-full overflow-auto"
            style={{ touchAction: 'pinch-zoom pan-x pan-y' }}
          >
            <img
              src={mapSrc}
              alt="Map zoomed"
              className="w-full h-auto block"
              style={{ minHeight: '100vh', objectFit: 'contain' }}
            />
          </div>

          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-bold"
            style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
            onClick={() => setZoomed(false)}
          >
            ✕ Close
          </button>

          {/* Hint */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white/60 text-xs"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', pointerEvents: 'none' }}
          >
            Pinch to zoom · Scroll to pan
          </div>
        </div>
      )}
    </div>
  )
}
