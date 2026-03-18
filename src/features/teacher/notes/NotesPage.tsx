import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FileText, Headphones, Globe, Edit3, SlidersHorizontal } from 'lucide-react'
import { api } from '@/mocks/teacherMocks'
import type { NoteStatus } from '@/types/teacher'

export default function NotesPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const { data: notes = [], isLoading } = useQuery({ queryKey: ['notes'], queryFn: api.getNotes })
  const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: api.getClasses })
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: api.getSubjects })

  const [filterClass, setFilterClass]     = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterStatus, setFilterStatus]   = useState<NoteStatus | ''>('')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [showDateFilter, setShowDateFilter] = useState(false)

  const filtered = notes.filter(n => {
    if (q && !n.title.toLowerCase().includes(q.toLowerCase())) return false
    if (filterClass && n.classId !== filterClass) return false
    if (filterSubject && n.subjectId !== filterSubject) return false
    if (filterStatus && n.status !== filterStatus) return false
    if (filterDateFrom && n.date < filterDateFrom) return false
    return true
  })

  const uniqueClasses = [...new Map(classes.map(c => [c.id, c])).values()]
  const uniqueSubjects = [...new Map(subjects.map(s => [s.id, s])).values()]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notatki</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} notatek</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <select className="select w-auto" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
            <option value="">Wszystkie klasy</option>
            {uniqueClasses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select className="select w-auto" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option value="">Wszystkie przedmioty</option>
            {uniqueSubjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select className="select w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value as NoteStatus | '')}>
            <option value="">Wszystkie statusy</option>
            <option value="draft">Szkice</option>
            <option value="published">Opublikowane</option>
          </select>
          <button
            onClick={() => setShowDateFilter(v => !v)}
            className={`btn-secondary ${showDateFilter ? 'ring-2 ring-primary-300' : ''}`}
          >
            <SlidersHorizontal size={14} /> Data
          </button>
          <button
            onClick={() => { setFilterClass(''); setFilterSubject(''); setFilterStatus(''); setFilterDateFrom('') }}
            className="text-xs text-gray-500 hover:text-gray-700 ml-auto"
          >
            Wyczyść
          </button>
        </div>
        {showDateFilter && (
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <label className="label mb-0 text-xs">Od:</label>
            <input type="date" className="input w-auto" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
          </div>
        )}
      </div>

      {/* Notes grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 gap-3">
          <FileText size={40} className="text-gray-300" />
          <p className="text-gray-600 font-medium">Brak notatek</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(note => (
            <div key={note.id} className="card p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm leading-snug">{note.title}</h3>
                {note.status === 'published' ? (
                  <span className="badge-green shrink-0">opublikowane</span>
                ) : (
                  <span className="badge-yellow shrink-0">szkic</span>
                )}
              </div>

              {/* Meta */}
              <p className="text-xs text-gray-500">
                {note.className} · {note.subjectName} ·{' '}
                {new Date(note.date).toLocaleDateString('pl-PL')}
              </p>

              {/* Summary */}
              <p className="text-xs text-gray-600 line-clamp-2">{note.summary}</p>

              {/* Concepts */}
              {note.concepts.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.concepts.slice(0, 4).map(c => (
                    <span key={c} className="badge-blue text-[10px]">{c}</span>
                  ))}
                  {note.concepts.length > 4 && (
                    <span className="text-xs text-gray-400">+{note.concepts.length - 4}</span>
                  )}
                </div>
              )}

              {/* Icons row */}
              <div className="flex items-center gap-3 text-gray-400 text-xs">
                {note.hasAudio && (
                  <span className="flex items-center gap-1 text-green-600">
                    <Headphones size={12} /> Audio
                  </span>
                )}
                {note.isPublic && (
                  <span className="flex items-center gap-1 text-blue-600">
                    <Globe size={12} /> Publiczne
                  </span>
                )}
                <span className="ml-auto">{note.publishedToClasses.length} klas</span>
              </div>

              {/* Action */}
              <Link
                to={`/teacher/notes/${note.id}/edit`}
                className="btn-secondary w-full justify-center text-xs mt-auto"
              >
                <Edit3 size={13} />
                Edytuj notatki
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
