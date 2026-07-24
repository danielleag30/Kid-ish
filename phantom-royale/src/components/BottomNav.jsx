import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',      label: 'Skins',  icon: '👕' },
  { to: '/shop',  label: 'Shop',   icon: '🛒' },
  { to: '/lore',  label: 'Story',  icon: '📖' },
  { to: '/random',label: 'Daily',  icon: '🎲' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 flex z-50">
      {tabs.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors ${
              isActive ? 'text-blue-400' : 'text-gray-400'
            }`
          }
        >
          <span className="text-xl">{icon}</span>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
