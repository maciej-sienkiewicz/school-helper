import { Outlet, Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { MOCK_STUDENT } from '@/mocks/studentMocks'

export default function StudentLayout() {
  const student = MOCK_STUDENT

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/student" className="flex items-center gap-2.5 text-gray-900">
            <div className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">SchoolHelper</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">
              {student.firstName} {student.lastName}
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold select-none">
              {student.firstName[0]}{student.lastName[0]}
            </div>
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  )
}
