import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Mic, Filter, SlidersHorizontal, BookOpen } from 'lucide-react'
import { api } from '@/mocks/teacherMocks'
import LessonCard from './LessonCard'
import type { LessonStatus } from '@/types/teacher'

export default function LessonsPage() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const { data: lessons = [], isLoading } = useQuery({ queryKey: ['lessons'], queryFn: api.getLessons })
  const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: api.getClasses })
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: api.getSubjects })

  const [filterClass, setFilterClass] = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterStatus, setFilterStatus] = useState<LessonStatus | ''>('')
  const [filterHasNotes, setFilterHasNotes] = useState<'all' | 'yes' | 'no'>('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = lessons.filter(l => {
    if (q && !l.title.toLowerCase().includes(q.toLowerCase()) &&
        !l.className.toLowerCase().includes(q.toLowerCase()) &&
        !l.subjectName.toLowerCase().includes(q.toLowerCase())) return false
    if (filterClass && l.classId !== filterClass) return false
    if (filterSubject && l.subjectId !== filterSubject) return false
    if (filterStatus && l.status !== filterStatus) return false
    if (filterHasNotes === 'yes' && !l.hasNotes) return false
    if (filterHasNotes === 'no' && l.hasNotes) return false
    if (filterDateFrom && l.date < filterDateFrom) return false
    if (filterDateTo && l.date > filterDateTo) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))

  const uniqueClasses = [...new Map(classes.map(c => [c.id, c])).values()]
  const uniqueSubjects = [...new Map(subjects.map(s => [s.id, s])).values()]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lekcje</h1>
          <p className="text-sm text-gray-500 mt-0.5">{sorted.length} lekcji</p>
        </div>
        <Link to="/teacher/lessons/new" className="btn-primary">
          <Mic size={16} />
          Nagraj nową
        </Link>
      </div>

      {/* Filter bar */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <select className="select w-auto" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
            <option value="">Wszystkie klasy</option>
            {uniqueClasses.map(c => (
              <option key={c.id} value={c.id}>{c.name} – {c.subjectName}</option>
            ))}
          </select>
          <select className="select w-auto" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option value="">Wszystkie przedmioty</option>
            {uniqueSubjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select className="select w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value as LessonStatus | '')}>
            <option value="">Wszystkie statusy</option>
            <option value="scheduled">Zaplanowane</option>
            <option value="recorded">Nagrane</option>
            <option value="processing">W przetwarzaniu</option>
            <option value="completed">Zakończone</option>
          </select>
          <select className="select w-auto" value={filterHasNotes} onChange={e => setFilterHasNotes(e.target.value as 'all' | 'yes' | 'no')}>
            <option value="all">Notatki: wszystkie</option>
            <option value="yes">Mają notatki</option>
            <option value="no">Brak notatek</option>
          </select>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`btn-secondary ${showFilters ? 'ring-2 ring-primary-300' : ''}`}
          >
            <SlidersHorizontal size={14} />
            Data
          </button>
          <button
            onClick={() => {
              setFilterClass(''); setFilterSubject(''); setFilterStatus('');
              setFilterHasNotes('all'); setFilterDateFrom(''); setFilterDateTo('')
            }}
            className="text-xs text-gray-500 hover:text-gray-700 ml-auto"
          >
            Wyczyść filtry
          </button>
        </div>
        {showFilters && (
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <label className="label mb-0">Od:</label>
            <input type="date" className="input w-auto" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
            <label className="label mb-0">Do:</label>
            <input type="date" className="input w-auto" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
          </div>
        )}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16 text-center gap-3">
          <BookOpen size={40} className="text-gray-300" />
          <p className="font-medium text-gray-600">Brak lekcji pasujących do filtrów</p>
          <p className="text-sm text-gray-400">Zmień kryteria lub nagraj nową lekcję</p>
          <Link to="/teacher/lessons/new" className="btn-primary mt-2">
            <Mic size={15} /> Nagraj lekcję
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map(lesson => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  )
}
