import { useState } from 'react'
import { X, Check } from 'lucide-react'
import type { Topic, SchoolClass, TopicProgress, Lesson } from '@/types/teacher'

interface Props {
  topics: Topic[]
  classes: SchoolClass[]
  progress: TopicProgress[]
  lessons: Lesson[]
  onUpdateProgress: (p: TopicProgress) => void
}

interface CellPanelState {
  topicId: string
  classId: string
}

function getCellStatus(topicId: string, classId: string, progress: TopicProgress[]) {
  return progress.find(p => p.topicId === topicId && p.classId === classId) ?? null
}

function CellIcon({ p }: { p: TopicProgress | null }) {
  if (!p || !p.completed) {
    return <span className="text-gray-300 text-base">○</span>
  }
  if (p.sourceType === 'borrowed') {
    return (
      <span className="text-blue-600 font-bold text-sm flex items-center gap-0.5">
        ↗{p.shareNotes ? '📝' : ''}{p.shareAudio ? '🎧' : ''}
      </span>
    )
  }
  return (
    <span className="text-green-700 font-bold text-sm flex items-center gap-0.5">
      ✓{p.shareNotes ? '📝' : ''}{p.shareAudio ? '🎧' : ''}
    </span>
  )
}

function cellBg(p: TopicProgress | null) {
  if (!p || !p.completed) return 'bg-gray-50 hover:bg-gray-100'
  if (p.sourceType === 'borrowed') return 'bg-blue-50 hover:bg-blue-100'
  return 'bg-green-50 hover:bg-green-100'
}

export default function TopicsMapTable({ topics, classes, progress, lessons, onUpdateProgress }: Props) {
  const [panel, setPanel] = useState<CellPanelState | null>(null)

  const activeProgress = panel
    ? getCellStatus(panel.topicId, panel.classId, progress)
    : null

  const [editCompleted, setEditCompleted]   = useState(false)
  const [editSource, setEditSource]         = useState<string>('')
  const [editShareNotes, setEditShareNotes] = useState(false)
  const [editShareAudio, setEditShareAudio] = useState(false)

  const openPanel = (topicId: string, classId: string) => {
    const p = getCellStatus(topicId, classId, progress)
    setPanel({ topicId, classId })
    setEditCompleted(p?.completed ?? false)
    setEditSource(p?.sourceLessonId ?? '')
    setEditShareNotes(p?.shareNotes ?? false)
    setEditShareAudio(p?.shareAudio ?? false)
  }

  const savePanel = () => {
    if (!panel) return
    const sourceLesson = lessons.find(l => l.id === editSource)
    onUpdateProgress({
      topicId: panel.topicId,
      classId: panel.classId,
      completed: editCompleted,
      sourceType: editSource ? (sourceLesson?.classId === panel.classId ? 'own' : 'borrowed') : undefined,
      sourceLessonId: editSource || undefined,
      shareNotes: editShareNotes,
      shareAudio: editShareAudio,
    })
    setPanel(null)
  }

  const activeTopic = topics.find(t => t.id === panel?.topicId)
  const activeClass = classes.find(c => c.id === panel?.classId)
  const relatedLessons = panel
    ? lessons.filter(l => l.topicId === panel.topicId)
    : []

  if (topics.length === 0 || classes.length === 0) {
    return <div className="card p-8 text-center text-gray-500">Brak danych – zmień filtry</div>
  }

  return (
    <div className="relative">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700 w-56 sticky left-0 bg-gray-50 z-10">
                  Temat
                </th>
                {classes.map(cls => (
                  <th
                    key={cls.id}
                    className="px-3 py-3 font-semibold text-gray-700 text-center min-w-[80px]"
                  >
                    {cls.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topics.sort((a, b) => a.orderIndex - b.orderIndex).map((topic, idx) => (
                <tr
                  key={topic.id}
                  className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800 sticky left-0 bg-inherit z-10">
                    <span className="text-gray-400 text-xs mr-2">{topic.orderIndex}.</span>
                    {topic.title}
                  </td>
                  {classes.map(cls => {
                    const p = getCellStatus(topic.id, cls.id, progress)
                    const isActive = panel?.topicId === topic.id && panel?.classId === cls.id
                    return (
                      <td key={cls.id} className="px-2 py-2 text-center">
                        <button
                          onClick={() => {
                            if (isActive) setPanel(null)
                            else openPanel(topic.id, cls.id)
                          }}
                          className={`
                            w-10 h-10 rounded-lg flex items-center justify-center mx-auto transition-all
                            ${cellBg(p)}
                            ${isActive ? 'ring-2 ring-primary-400 shadow-sm' : ''}
                          `}
                          title={`${topic.title} – ${cls.name}`}
                        >
                          <CellIcon p={p} />
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side panel */}
      {panel && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div>
              <p className="font-semibold text-gray-900 text-sm">{activeTopic?.title}</p>
              <p className="text-xs text-gray-500">{activeClass?.name} · {activeClass?.subjectName}</p>
            </div>
            <button onClick={() => setPanel(null)} className="btn-ghost p-1.5">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 p-4 space-y-5 overflow-y-auto">
            {/* Completed */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded"
                checked={editCompleted}
                onChange={e => setEditCompleted(e.target.checked)}
              />
              <span className="text-sm font-medium text-gray-800">Temat zrealizowany w tej klasie</span>
            </label>

            {/* Source lesson */}
            <div>
              <label className="label">Źródło materiałów</label>
              <select
                className="select"
                value={editSource}
                onChange={e => setEditSource(e.target.value)}
              >
                <option value="">– Brak / własna lekcja –</option>
                {relatedLessons.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.date} · {l.className} · {l.title.substring(0, 35)}
                  </option>
                ))}
              </select>
              {relatedLessons.length === 0 && (
                <p className="text-xs text-gray-400 mt-1">Brak powiązanych nagrań dla tego tematu</p>
              )}
            </div>

            {/* Share */}
            <div>
              <label className="label">Udostępnij uczniom</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" checked={editShareNotes} onChange={e => setEditShareNotes(e.target.checked)} />
                  <span className="text-sm">Notatki 📝</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" checked={editShareAudio} onChange={e => setEditShareAudio(e.target.checked)} />
                  <span className="text-sm">Audio 🎧</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <button onClick={savePanel} className="btn-primary w-full">
              <Check size={15} />
              Zapisz
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
