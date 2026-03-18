import { Link } from 'react-router-dom'
import { Mic, FileText, Headphones, Clock, Users, BookOpen, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import type { Lesson } from '@/types/teacher'

interface Props {
  lesson: Lesson
}

const STATUS_CONFIG = {
  scheduled:  { label: 'Zaplanowana',       cls: 'badge-gray',   icon: Clock },
  recorded:   { label: 'Nagrana',           cls: 'badge-yellow', icon: Headphones },
  processing: { label: 'W przetwarzaniu',   cls: 'badge-blue',   icon: Loader },
  completed:  { label: 'Zakończona',        cls: 'badge-green',  icon: CheckCircle },
}

export default function LessonCard({ lesson }: Props) {
  const status = STATUS_CONFIG[lesson.status]
  const StatusIcon = status.icon

  return (
    <div className="card p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
      {/* Date block */}
      <div className="shrink-0 w-14 h-14 rounded-xl bg-primary-50 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-bold text-primary-700 leading-none">
          {new Date(lesson.date).getDate()}
        </span>
        <span className="text-xs text-primary-500 capitalize">
          {new Date(lesson.date).toLocaleDateString('pl-PL', { month: 'short' })}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 truncate">{lesson.title}</h3>
          <span className={`${status.cls} shrink-0`}>
            <StatusIcon size={11} />
            {status.label}
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {lesson.time}
            {lesson.durationMinutes && ` · ${lesson.durationMinutes} min`}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} />
            {lesson.className}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={11} />
            {lesson.subjectName}
          </span>
          {lesson.topicTitle && (
            <span className="text-gray-400 italic truncate max-w-[200px]">
              {lesson.topicTitle}
            </span>
          )}
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-2 mt-2">
          {lesson.hasRecording && (
            <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <Headphones size={11} /> Nagranie
            </span>
          )}
          {lesson.hasNotes && (
            <span className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              <FileText size={11} /> Notatki
            </span>
          )}
          {!lesson.hasRecording && !lesson.hasNotes && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <AlertCircle size={11} /> Brak nagrania i notatek
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 shrink-0">
        {lesson.hasNotes ? (
          <Link
            to={`/teacher/notes?lessonId=${lesson.id}`}
            className="btn-secondary text-xs px-3 py-1.5"
          >
            <FileText size={13} />
            Notatki
          </Link>
        ) : lesson.hasRecording ? (
          <Link
            to={`/teacher/notes?lessonId=${lesson.id}`}
            className="btn-primary text-xs px-3 py-1.5"
          >
            <FileText size={13} />
            Dodaj notatki
          </Link>
        ) : (
          <Link
            to="/teacher/lessons/new"
            className="btn-primary text-xs px-3 py-1.5"
          >
            <Mic size={13} />
            Nagraj
          </Link>
        )}
      </div>
    </div>
  )
}
