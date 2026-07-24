import { useOnlineStatus } from '../hooks/useOnlineStatus'

export default function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null
  return (
    <div className="bg-yellow-600 text-yellow-950 text-xs font-semibold text-center py-2 px-4">
      Showing saved data — reconnect for the latest skins
    </div>
  )
}
