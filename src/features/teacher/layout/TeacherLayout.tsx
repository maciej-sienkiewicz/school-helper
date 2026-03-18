import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

export default function TeacherLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex flex-col">
          <Sidebar collapsed={sidebarCollapsed} />
          <button
            onClick={() => setSidebarCollapsed(v => !v)}
            className="absolute bottom-4 left-4 p-1.5 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-50 z-10 hidden md:flex"
            title={sidebarCollapsed ? 'Rozwiń' : 'Zwiń'}
          >
            <Menu size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/40"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden fixed bottom-4 left-4 p-3 rounded-full bg-primary-600 text-white shadow-lg z-40"
        >
          <Menu size={20} />
        </button>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
