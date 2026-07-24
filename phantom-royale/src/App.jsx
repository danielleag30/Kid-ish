import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import LobbyShell from './components/LobbyShell'
import ChapterDetail from './pages/ChapterDetail'
import ModeMapDetail from './pages/ModeMapDetail'
import OfflineBanner from './components/OfflineBanner'
import OnboardingOverlay from './components/OnboardingOverlay'
import './index.css'

// ─── Loading screen ────────────────────────────────────────
function LoadingScreen() {
  return (
    <div
      className="min-h-svh flex flex-col items-center justify-center gap-6 px-8"
      style={{ background: 'linear-gradient(160deg, #060e1e 0%, #0b1a33 55%, #0a0e1a 100%)' }}
    >
      <img src="/icons/icon-192.png" alt="" className="w-24 h-24 rounded-2xl shadow-2xl" />
      <div className="text-center">
        <h1
          className="text-5xl font-black text-white tracking-wider uppercase"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Phantom Royale
        </h1>
        <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mt-2">
          Loading your collection...
        </p>
      </div>
      <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mt-2" />
    </div>
  )
}

// ─── Error screen ──────────────────────────────────────────
function ErrorScreen() {
  const { error, retryLoad } = useApp()
  return (
    <div className="min-h-svh bg-[#0a0e1a] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-5xl">😵</p>
      <h2
        className="text-white text-2xl font-bold uppercase"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        Couldn't load the skins
      </h2>
      <p className="text-gray-400 text-sm max-w-xs">{error}</p>
      <button
        onClick={retryLoad}
        className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors uppercase tracking-wide"
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        Try Again
      </button>
    </div>
  )
}

// ─── Routes ───────────────────────────────────────────────
function AppRoutes() {
  const { isLoading, error } = useApp()

  if (isLoading) return <LoadingScreen />
  if (error)     return <ErrorScreen />

  return (
    <>
      <OfflineBanner />
      <OnboardingOverlay />
      <Routes>
        {/* Main lobby — all tabs live inside LobbyShell */}
        <Route path="/"              element={<LobbyShell />} />

        {/* Chapter detail — full-screen page, back button → "/" */}
        <Route path="/lore/:chapter"    element={<ChapterDetail />} />

        {/* Reload + Blitz map detail pages */}
        <Route path="/reload/:mapId"    element={<ModeMapDetail />} />
        <Route path="/blitz/:mapId"     element={<ModeMapDetail />} />
      </Routes>
    </>
  )
}

// ─── App root ─────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}
