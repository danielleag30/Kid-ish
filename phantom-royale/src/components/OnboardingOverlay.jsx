import { useState } from 'react'

const ONBOARDED_KEY = 'phantom_onboarded'

export default function OnboardingOverlay() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(ONBOARDED_KEY))

  function dismiss() {
    localStorage.setItem(ONBOARDED_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center p-4"
      onClick={dismiss}
    >
      <div
        className="bg-[#1a2236] border border-[#2a3450] rounded-2xl p-6 w-full max-w-sm mb-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <img src="/icons/icon-192.png" alt="" className="w-16 h-16 rounded-2xl" />
        </div>

        <h2 className="text-white text-2xl font-bold text-center uppercase mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Welcome to Phantom Royale
        </h2>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-3 items-start">
            <span className="text-2xl shrink-0">🔊</span>
            <p className="text-gray-300 text-sm leading-relaxed">
              On the Story pages, tap <strong className="text-yellow-400">Hear Jonesy</strong> to listen to the lore. Make sure your iPad isn't muted!
            </p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-2xl shrink-0">✓</span>
            <p className="text-gray-300 text-sm leading-relaxed">
              On any skin, tap <strong className="text-green-400">Own it</strong> to track your collection. Your progress saves automatically.
            </p>
          </div>
        </div>

        <button
          onClick={dismiss}
          className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl uppercase tracking-wide transition-colors active:bg-yellow-300"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          Let's go! 🎮
        </button>
      </div>
    </div>
  )
}
