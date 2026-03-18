import { Link } from 'react-router-dom'
import { FileText, Edit3, Globe } from 'lucide-react'
import type { LessonNote } from '@/types/teacher'

interface Props {
  notes: LessonNote[]
}

export default function RecentNotesCard({ notes }: Props) {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Ostatnie notatki</h2>
        <Link to="/teacher/notes" className="text-xs text-primary-600 hover:underline">
          Wszystkie →
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <FileText size={32} className="text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">Brak notatek do wyświetlenia</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notes.map(note => (
            <li key={note.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={15} className="text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{note.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-500">{note.className} · {note.subjectName}</span>
                  {note.status === 'published' ? (
                    <span className="badge-green text-[10px] px-1.5 py-0">opublikowane</span>
                  ) : (
                    <span className="badge-yellow text-[10px] px-1.5 py-0">szkic</span>
                  )}
                  {note.isPublic && (
                    <span title="Publiczne"><Globe size={11} className="text-blue-500" /></span>
                  )}
                </div>
              </div>
              <Link
                to={`/teacher/notes/${note.id}/edit`}
                className="btn-ghost p-1.5 shrink-0"
                title="Edytuj"
              >
                <Edit3 size={14} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
