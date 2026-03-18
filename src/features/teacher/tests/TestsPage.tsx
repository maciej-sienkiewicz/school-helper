import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Plus, ClipboardList, Calendar, Users, BarChart2 } from 'lucide-react'
import { api } from '@/mocks/teacherMocks'
import type { TestStatus } from '@/types/teacher'

const STATUS_CONFIG = {
  draft:     { label: 'Szkic',       cls: 'badge-yellow' },
  published: { label: 'Opublikowany', cls: 'badge-blue' },
  completed: { label: 'Zakończony',  cls: 'badge-green' },
}

export default function TestsPage() {
  const { data: tests = [], isLoading } = useQuery({ queryKey: ['tests'], queryFn: api.getTests })
  const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: api.getClasses })
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: api.getSubjects })

  const [filterClass,   setFilterClass]   = useState('')
  const [filterSubject, setFilterSubject] = useState('')
  const [filterStatus,  setFilterStatus]  = useState<TestStatus | ''>('')

  const filtered = tests.filter(t => {
    if (filterClass   && !t.classIds.includes(filterClass)) return false
    if (filterSubject && t.subjectId !== filterSubject) return false
    if (filterStatus  && t.status !== filterStatus) return false
    return true
  })

  const uniqueClasses  = [...new Map(classes.map(c => [c.id, c])).values()]
  const uniqueSubjects = [...new Map(subjects.map(s => [s.id, s])).values()]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testy i kartkówki</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} testów</p>
        </div>
        <Link to="/teacher/tests/new" className="btn-primary">
          <Plus size={16} />
          Nowy test
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 flex items-center gap-2 flex-wrap">
        <select className="select w-auto" value={filterClass} onChange={e => setFilterClass(e.target.value)}>
          <option value="">Wszystkie klasy</option>
          {uniqueClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="select w-auto" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
          <option value="">Wszystkie przedmioty</option>
          {uniqueSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="select w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value as TestStatus | '')}>
          <option value="">Wszystkie statusy</option>
          <option value="draft">Szkice</option>
          <option value="published">Opublikowane</option>
          <option value="completed">Zakończone</option>
        </select>
        <button onClick={() => { setFilterClass(''); setFilterSubject(''); setFilterStatus('') }} className="text-xs text-gray-500 hover:text-gray-700 ml-auto">
          Wyczyść
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center space-y-3">
          <ClipboardList size={40} className="text-gray-300 mx-auto" />
          <p className="text-gray-600 font-medium">Brak testów</p>
          <Link to="/teacher/tests/new" className="btn-primary inline-flex">
            <Plus size={15} /> Utwórz test
          </Link>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map(test => {
            const cfg = STATUS_CONFIG[test.status]
            const pct = test.averageScore != null
              ? Math.round((test.averageScore / test.maxScore) * 100)
              : null
            return (
              <div key={test.id} className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm leading-snug">{test.title}</h3>
                  <span className={`${cfg.cls} shrink-0`}>{cfg.label}</span>
                </div>

                <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users size={11} />
                    {test.classNames.join(', ')}
                  </span>
                  <span>{test.subjectName}</span>
                  {test.scheduledAt && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(test.scheduledAt).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{test.questions.length} pytań · max {test.maxScore} pkt</span>
                  {test.durationMinutes && <span>· {test.durationMinutes} min</span>}
                </div>

                {pct != null && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Średni wynik</span>
                      <span className="font-semibold text-gray-800">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100">
                      <div
                        className={`h-1.5 rounded-full ${pct >= 70 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                  {test.status === 'completed' || test.averageScore != null ? (
                    <Link to={`/teacher/tests/${test.id}/results`} className="btn-primary flex-1 justify-center text-xs">
                      <BarChart2 size={13} /> Wyniki
                    </Link>
                  ) : (
                    <Link to={`/teacher/tests/new?edit=${test.id}`} className="btn-secondary flex-1 justify-center text-xs">
                      Edytuj
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
