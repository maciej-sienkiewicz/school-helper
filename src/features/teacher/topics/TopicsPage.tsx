import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, MOCK_LESSONS } from '@/mocks/teacherMocks'
import TopicsMapTable from './TopicsMapTable'

export default function TopicsPage() {
  const { data: topics = [] }   = useQuery({ queryKey: ['topics'],        queryFn: api.getTopics })
  const { data: progress = [] } = useQuery({ queryKey: ['topicProgress'], queryFn: api.getTopicProgress })
  const { data: classes = [] }  = useQuery({ queryKey: ['classes'],       queryFn: api.getClasses })
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'],      queryFn: api.getSubjects })
  const qc = useQueryClient()

  const [filterSubject, setFilterSubject] = useState('sub-1')
  const [filterGrade,   setFilterGrade]   = useState<number | ''>('')

  const mutation = useMutation({
    mutationFn: api.updateTopicProgress,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['topicProgress'] }),
  })

  const grades = [...new Set(topics.map(t => t.grade))].sort()
  const uniqueSubjects = [...new Map(subjects.map(s => [s.id, s])).values()]

  const filteredTopics = topics.filter(t => {
    if (filterSubject && t.subjectId !== filterSubject) return false
    if (filterGrade !== '' && t.grade !== filterGrade) return false
    return true
  })

  const filteredClasses = classes.filter(c => {
    if (filterSubject && c.subjectId !== filterSubject) return false
    if (filterGrade !== '' && c.grade !== filterGrade) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mapa tematów</h1>
        <p className="text-sm text-gray-500 mt-0.5">Śledź realizację tematów w każdej klasie</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <div>
          <label className="label text-xs">Przedmiot</label>
          <select className="select w-auto" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            <option value="">Wszystkie</option>
            {uniqueSubjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label text-xs">Rocznik</label>
          <select className="select w-auto" value={filterGrade} onChange={e => setFilterGrade(e.target.value === '' ? '' : Number(e.target.value))}>
            <option value="">Wszystkie</option>
            {grades.map(g => (
              <option key={g} value={g}>Klasa {g}</option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-xs text-gray-500">
          {filteredTopics.length} tematów · {filteredClasses.length} klas
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
        <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-green-100 border border-green-300 flex items-center justify-center text-green-700 text-[10px]">✓📝</span> Zrealizowany – własne notatki</span>
        <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-700 text-[10px]">↗📝</span> Zrealizowany – materiały z innej klasy</span>
        <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-yellow-50 border border-yellow-200 flex items-center justify-center text-yellow-700 text-[10px]">🎧</span> Nagranie bez notatek</span>
        <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 text-[10px]">○</span> Nie zrealizowany</span>
      </div>

      {/* Map table */}
      <TopicsMapTable
        topics={filteredTopics}
        classes={filteredClasses}
        progress={progress}
        lessons={MOCK_LESSONS}
        onUpdateProgress={mutation.mutate}
      />
    </div>
  )
}
