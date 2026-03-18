import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Mic, ArrowRight, BookOpen, ClipboardList, Zap } from 'lucide-react'
import { api } from '@/mocks/teacherMocks'
import TodayLessonsCard from './TodayLessonsCard'
import RecentNotesCard from './RecentNotesCard'
import UpcomingTestsCard from './UpcomingTestsCard'

export default function DashboardPage() {
  const { data: lessons } = useQuery({ queryKey: ['lessons'], queryFn: api.getLessons })
  const { data: notes }   = useQuery({ queryKey: ['notes'],   queryFn: api.getNotes })
  const { data: tests }   = useQuery({ queryKey: ['tests'],   queryFn: api.getTests })

  const today = new Date().toISOString().split('T')[0]
  const todayLessons = (lessons ?? []).filter(l => l.date === today)
  const recentNotes  = (notes ?? []).slice(0, 3)
  const upcomingTests = (tests ?? [])
    .filter(t => t.status !== 'completed')
    .sort((a, b) => (a.scheduledAt ?? '').localeCompare(b.scheduledAt ?? ''))
    .slice(0, 3)

  const completedLessons = (lessons ?? []).filter(l => l.status === 'completed').length
  const publishedNotes   = (notes ?? []).filter(n => n.status === 'published').length
  const activeTests      = (tests ?? []).filter(t => t.status === 'published').length

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link to="/teacher/lessons/new" className="btn-primary">
          <Mic size={16} />
          Nagraj lekcję
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Zrealizowane lekcje</span>
            <BookOpen size={16} className="text-primary-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{completedLessons}</span>
          <span className="text-xs text-gray-400">z {(lessons ?? []).length} łącznie</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Opublikowane notatki</span>
            <Zap size={16} className="text-green-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{publishedNotes}</span>
          <span className="text-xs text-gray-400">z {(notes ?? []).length} łącznie</span>
        </div>
        <div className="stat-card col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Aktywne testy</span>
            <ClipboardList size={16} className="text-orange-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{activeTests}</span>
          <span className="text-xs text-gray-400">oczekuje na uczniów</span>
        </div>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TodayLessonsCard lessons={todayLessons} />
        <RecentNotesCard notes={recentNotes} />
        <UpcomingTestsCard tests={upcomingTests} />
      </div>

      {/* Quick actions */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Szybkie akcje</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/teacher/lessons/new', label: 'Nagraj nową lekcję', icon: Mic, color: 'text-primary-600 bg-primary-50' },
            { to: '/teacher/notes',       label: 'Przeglądaj notatki',  icon: BookOpen, color: 'text-green-600 bg-green-50' },
            { to: '/teacher/topics',      label: 'Mapa tematów',        icon: ArrowRight, color: 'text-orange-600 bg-orange-50' },
            { to: '/teacher/tests/new',   label: 'Utwórz test',         icon: ClipboardList, color: 'text-purple-600 bg-purple-50' },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
