import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Map,
  ClipboardList,
  BarChart2,
  User,
  Mic,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/lessons',   icon: BookOpen,        label: 'Lekcje' },
  { to: '/teacher/notes',     icon: FileText,        label: 'Notatki' },
  { to: '/teacher/topics',    icon: Map,             label: 'Tematy' },
  { to: '/teacher/tests',     icon: ClipboardList,   label: 'Testy' },
  { to: '/teacher/analytics', icon: BarChart2,       label: 'Analityka' },
  { to: '/teacher/profile',   icon: User,            label: 'Profil' },
]

interface SidebarProps {
  collapsed?: boolean
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={`
        flex flex-col bg-white border-r border-gray-200 h-full transition-all duration-200
        ${collapsed ? 'w-16' : 'w-56'}
      `}
    >
      <nav className="flex-1 py-4 px-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
               ${isActive
                 ? 'bg-primary-50 text-primary-700'
                 : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
               }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Quick record button */}
      {!collapsed && (
        <div className="p-3 border-t border-gray-200">
          <NavLink
            to="/teacher/lessons/new"
            className="btn-primary w-full justify-center text-sm"
          >
            <Mic size={15} />
            Nagraj lekcję
          </NavLink>
        </div>
      )}
    </aside>
  )
}
