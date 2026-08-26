import { useState } from 'react'
import type { Notification } from '../../data/types'

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-1',
    userId: 'u-1',
    title: 'New High Match (84%)',
    message: 'Harbor Collective posted Data Analyst (Chennai Hybrid).',
    type: 'match_alert',
    link: '/candidate/jobs',
    read: false,
    createdAt: '10m ago',
  },
  {
    id: 'n-2',
    userId: 'u-1',
    title: 'Application Update',
    message: 'Your Data Analyst application was moved to Interview stage.',
    type: 'application_update',
    link: '/candidate/applications',
    read: false,
    createdAt: '2h ago',
  },
  {
    id: 'n-3',
    userId: 'u-1',
    title: 'Talent Passport Verified',
    message: 'Your SQL assessment score (91) is now verified on your Passport.',
    type: 'system',
    link: '/candidate/passport',
    read: true,
    createdAt: '1d ago',
  },
]

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-line bg-paper text-sm text-mute hover:border-ink hover:text-ink transition"
        title="Notifications"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 z-40 w-80 rounded-2xl border border-line bg-white p-4 shadow-xl animate-fade-up">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-xs font-semibold text-ink">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[11px] text-teal hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="mt-2 divide-y divide-line/60">
              {notifications.map((n) => (
                <div key={n.id} className={`py-2.5 text-xs ${n.read ? 'opacity-70' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink">{n.title}</span>
                    <span className="text-[10px] text-mute">{n.createdAt}</span>
                  </div>
                  <p className="mt-1 text-mute leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
