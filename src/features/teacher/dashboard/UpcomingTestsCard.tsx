import { Link } from 'react-router-dom'
import { ClipboardList, Calendar, Users } from 'lucide-react'
import type { Test } from '@/types/teacher'

interface Props {
  tests: Test[]
}

const STATUS_LABEL: Record<string, string> = {
  draft:     'Szkic',
  published: 'Opublikowany',
  completed: 'Zakończony',
}
const STATUS_CLASS: Record<string, string> = {
  draft:     'badge-yellow',
  published: 'badge-blue',
  completed: 'badge-green',
}

export default function UpcomingTestsCard({ tests }: Props) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Nadchodzące testy</h2>
        <Link to="/teacher/tests" className="text-xs text-primary-600 hover:underline">
          Wszystkie →
        </Link>
      </div>

      {tests.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <ClipboardList size={32} className="text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">Brak zaplanowanych testów</p>
          <Link to="/teacher/tests/new" className="mt-3 btn-primary text-xs">
            Utwórz test
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {tests.map(test => (
            <li key={test.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                <ClipboardList size={15} className="text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{test.title}</p>
                <div className="flex items-center flex-wrap gap-2 mt-1 text-xs text-gray-500">
                  {test.scheduledAt && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(test.scheduledAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {test.classNames.join(', ')}
                  </span>
                </div>
              </div>
              <span className={STATUS_CLASS[test.status]}>
                {STATUS_LABEL[test.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
