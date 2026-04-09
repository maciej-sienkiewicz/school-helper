import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { studentApi } from '@/mocks/studentMocks'

function gradeColor(avg: number) {
  if (avg >= 4.5) return 'text-green-600'
  if (avg >= 3.5) return 'text-gray-900'
  return 'text-amber-600'
}

export default function StudentDashboardPage() {
  const { data: subjects = [] } = useQuery({
    queryKey: ['studentSubjects'],
    queryFn: studentApi.getSubjects,
  })

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Moje przedmioty</h1>
        <p className="text-sm text-gray-400 mt-0.5">Rok szkolny 2025/2026</p>
      </div>

      <div className="space-y-2">
        {subjects.map((subject) => (
          <Link
            key={subject.subjectId}
            to={`/student/subject/${encodeURIComponent(subject.subjectName)}`}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 px-4 py-4 hover:border-gray-200 hover:shadow-sm transition-all group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{subject.subjectName}</p>
              <p className="text-xs text-gray-400 mt-0.5">Klasa {subject.className}</p>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-lg font-bold ${gradeColor(subject.avgGrade)}`}>
                {subject.avgGrade.toFixed(2)}
              </span>
              <p className="text-xs text-gray-400">średnia</p>
            </div>
            <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </main>
  )
}
