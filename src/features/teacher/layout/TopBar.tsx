import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search, ChevronDown, User, Settings, LogOut, BookOpen } from 'lucide-react'
import { MOCK_TEACHER } from '@/mocks/teacherMocks'

const NOTIFICATIONS = [
  { id: 1, text: 'Notatki z lekcji 7B są gotowe do edycji', time: '5 min temu', unread: true },
  { id: 2, text: 'Test "Równania liniowe" – 6 uczniów odpowiedziało', time: '1 godz. temu', unread: true },
  { id: 3, text: 'Nagranie z 17 marca zostało przetworzone', time: '2 godz. temu', unread: false },
]

export default function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notiOpen, setNotiOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/teacher/lessons?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-40">
      {/* Logo */}
      <Link to="/teacher/dashboard" className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        <span className="font-bold text-gray-900 hidden sm:block">SchoolHelper</span>
      </Link>

      {/* School name */}
      <span className="text-sm text-gray-500 border-l border-gray-200 pl-4 hidden md:block truncate max-w-[200px]">
        {MOCK_TEACHER.school}
      </span>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
            placeholder="Szukaj lekcji, notatek, testów…"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchOpen && searchQuery && (
            <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                type="submit"
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Search size={14} className="text-gray-400" />
                Szukaj „{searchQuery}" w lekcjach
              </button>
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotiOpen(v => !v); setProfileOpen(false) }}
            className="btn-ghost p-2 relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
          {notiOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="font-semibold text-sm">Powiadomienia</span>
                <span className="text-xs text-primary-600 cursor-pointer hover:underline">Oznacz jako przeczytane</span>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${n.unread ? 'bg-primary-50/40' : ''}`}>
                  <p className="text-sm text-gray-800">{n.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(v => !v); setNotiOpen(false) }}
            className="btn-ghost px-2 py-1.5 flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {MOCK_TEACHER.firstName[0]}{MOCK_TEACHER.lastName[0]}
            </div>
            <span className="text-sm font-medium hidden sm:block">
              {MOCK_TEACHER.firstName} {MOCK_TEACHER.lastName}
            </span>
            <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
              <Link
                to="/teacher/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setProfileOpen(false)}
              >
                <User size={15} className="text-gray-400" />
                Mój profil
              </Link>
              <Link
                to="/teacher/profile?tab=settings"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                onClick={() => setProfileOpen(false)}
              >
                <Settings size={15} className="text-gray-400" />
                Ustawienia
              </Link>
              <div className="border-t border-gray-100 my-1" />
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <LogOut size={15} />
                Wyloguj się
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
