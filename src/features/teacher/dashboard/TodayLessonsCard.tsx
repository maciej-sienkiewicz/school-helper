import { Link } from 'react-router-dom'
import { Mic, FileText, Clock, Users } from 'lucide-react'
import type { Lesson } from '@/types/teacher'

interface Props {
  lessons: Lesson[]
}

export default function TodayLessonsCard({ lessons }: Props) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Dzisiejsze lekcje</h2>
        <Link to="/teacher/lessons" className="text-xs text-primary-600 hover:underline">
          Wszystkie →
        </Link>
      </div>

      {lessons.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <Clock size={32} className="text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">Brak zaplanowanych lekcji na dziś</p>
          <Link to="/teacher/lessons/new" className="mt-3 btn-primary text-xs">
            <Mic size={13} /> Nagraj lekcję
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {lessons.map(lesson => (
            <li
              key={lesson.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {lesson.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {lesson.className}
                  </span>
                  <span>{lesson.subjectName}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {lesson.hasNotes ? (
                  <Link
                    to={`/teacher/notes?lessonId=${lesson.id}`}
                    className="btn-secondary text-xs px-2 py-1"
                    title="Przejdź do notatek"
                  >
                    <FileText size={12} />
                  </Link>
                ) : (
                  <Link
                    to="/teacher/lessons/new"
                    className="btn-primary text-xs px-2 py-1"
                    title="Nagraj"
                  >
                    <Mic size={12} />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
