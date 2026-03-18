import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Plus, Trash2, Wand2, Eye } from 'lucide-react'
import { api } from '@/mocks/teacherMocks'
import type { Question, QuestionType } from '@/types/teacher'

type Step = 1 | 2 | 3

const SUGGESTED_QUESTIONS: Question[] = [
  { id: 'sq-1', type: 'single-choice', text: 'Które wyrażenie jest równaniem liniowym?', options: ['x² + 1 = 0', '2x + 3 = 7', 'x³ = 8', '√x = 2'], correctAnswer: '2x + 3 = 7', points: 4 },
  { id: 'sq-2', type: 'true-false', text: 'Równanie x + 5 = 5 + x jest tożsamościowe (nieskończenie wiele rozwiązań).', correctAnswer: true, points: 3 },
  { id: 'sq-3', type: 'open', text: 'Rozwiąż równanie: 4x − 8 = 2x + 6', points: 6 },
]

function QuestionEditor({
  q, idx, onUpdate, onRemove,
}: {
  q: Question
  idx: number
  onUpdate: (q: Question) => void
  onRemove: () => void
}) {
  const TYPE_LABELS: Record<QuestionType, string> = {
    'single-choice': 'Jednokrotny wybór',
    'open': 'Otwarte',
    'true-false': 'Prawda / Fałsz',
  }
  return (
    <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white hover:border-primary-200 transition-colors">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center shrink-0">
          {idx + 1}
        </span>
        <select
          className="select w-auto text-xs"
          value={q.type}
          onChange={e => onUpdate({ ...q, type: e.target.value as QuestionType })}
        >
          {(Object.keys(TYPE_LABELS) as QuestionType[]).map(t => (
            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          max={20}
          className="input w-20 text-xs"
          value={q.points}
          onChange={e => onUpdate({ ...q, points: Number(e.target.value) })}
          title="Punkty"
        />
        <span className="text-xs text-gray-400">pkt</span>
        <button onClick={onRemove} className="btn-ghost p-1.5 text-red-400 hover:text-red-600 ml-auto">
          <Trash2 size={14} />
        </button>
      </div>

      <textarea
        className="input min-h-[60px] resize-y text-sm"
        placeholder="Treść pytania…"
        value={q.text}
        onChange={e => onUpdate({ ...q, text: e.target.value })}
      />

      {q.type === 'single-choice' && (
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 font-medium">Odpowiedzi (zaznacz poprawną):</p>
          {(q.options ?? ['', '', '', '']).map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${q.id}`}
                checked={q.correctAnswer === opt}
                onChange={() => onUpdate({ ...q, correctAnswer: opt })}
                className="w-4 h-4"
              />
              <input
                type="text"
                className="input flex-1 text-xs"
                placeholder={`Odpowiedź ${String.fromCharCode(65 + i)}`}
                value={opt}
                onChange={e => {
                  const opts = [...(q.options ?? [])]
                  opts[i] = e.target.value
                  onUpdate({ ...q, options: opts })
                }}
              />
            </div>
          ))}
        </div>
      )}

      {q.type === 'true-false' && (
        <div className="flex items-center gap-4">
          <p className="text-xs text-gray-500 font-medium">Poprawna odpowiedź:</p>
          {[true, false].map(v => (
            <label key={String(v)} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={q.correctAnswer === v}
                onChange={() => onUpdate({ ...q, correctAnswer: v })}
                className="w-4 h-4"
              />
              <span className="text-sm">{v ? 'Prawda' : 'Fałsz'}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function TestCreatorPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [step, setStep] = useState<Step>(1)

  // Step 1 state
  const [title, setTitle]         = useState('')
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [subjectId, setSubjectId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [duration, setDuration]   = useState(45)

  // Step 2 state
  const [questions, setQuestions] = useState<Question[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { data: classes = [] }  = useQuery({ queryKey: ['classes'],  queryFn: api.getClasses })
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: api.getSubjects })

  const mutation = useMutation({
    mutationFn: api.createTest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tests'] })
      navigate('/teacher/tests')
    },
  })

  const addQuestion = (type: QuestionType = 'single-choice') => {
    setQuestions(prev => [...prev, {
      id: `q-${Date.now()}`,
      type,
      text: '',
      options: type === 'single-choice' ? ['', '', '', ''] : undefined,
      points: 5,
    }])
  }

  const maxScore = questions.reduce((s, q) => s + q.points, 0)

  const filteredClasses = subjectId
    ? classes.filter(c => c.subjectId === subjectId)
    : classes

  const uniqueSubjects = [...new Map(subjects.map(s => [s.id, s])).values()]

  const handlePublish = () => {
    const classNames = selectedClasses.map(id => classes.find(c => c.id === id)?.name ?? '')
    mutation.mutate({
      title,
      classIds: selectedClasses,
      classNames,
      subjectId,
      subjectName: subjects.find(s => s.id === subjectId)?.name ?? '',
      scheduledAt: scheduledAt || undefined,
      durationMinutes: duration,
      status: 'published',
      questions,
      maxScore,
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nowy test</h1>
          <p className="text-sm text-gray-500">Krok {step} z 3</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
              ${s === step ? 'bg-primary-600 text-white' : s < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {s < step ? '✓' : s}
            </div>
            {s < 3 && <div className={`flex-1 h-0.5 w-8 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
        <span className="text-sm text-gray-500 ml-2">
          {step === 1 ? 'Ustawienia' : step === 2 ? 'Pytania' : 'Podsumowanie'}
        </span>
      </div>

      {/* Step 1: Settings */}
      {step === 1 && (
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">Ustawienia testu</h2>
          <div>
            <label className="label">Nazwa testu *</label>
            <input className="input" placeholder="np. Kartkówka – Równania liniowe" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="label">Przedmiot *</label>
            <select className="select" value={subjectId} onChange={e => { setSubjectId(e.target.value); setSelectedClasses([]) }}>
              <option value="">Wybierz przedmiot…</option>
              {uniqueSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Klasy *</label>
            <div className="space-y-2">
              {filteredClasses.map(c => (
                <label key={c.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    checked={selectedClasses.includes(c.id)}
                    onChange={e => {
                      if (e.target.checked) setSelectedClasses(prev => [...prev, c.id])
                      else setSelectedClasses(prev => prev.filter(x => x !== c.id))
                    }}
                  />
                  <span className="text-sm">{c.name}</span>
                </label>
              ))}
              {filteredClasses.length === 0 && <p className="text-sm text-gray-400">Wybierz najpierw przedmiot</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Termin</label>
              <input type="datetime-local" className="input" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />
            </div>
            <div>
              <label className="label">Czas trwania (min)</label>
              <input type="number" min={5} max={180} className="input" value={duration} onChange={e => setDuration(Number(e.target.value))} />
            </div>
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!title || !subjectId || selectedClasses.length === 0}
            className="btn-primary w-full"
          >
            Dalej – pytania <ArrowRight size={15} />
          </button>
        </div>
      )}

      {/* Step 2: Questions */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Pytania ({questions.length})</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSuggestions(v => !v)}
                  className="btn-secondary text-xs"
                >
                  <Wand2 size={13} /> Podpowiedzi z notatek
                </button>
              </div>
            </div>

            {showSuggestions && (
              <div className="mb-4 p-3 bg-primary-50 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-primary-700">Sugerowane pytania (na podstawie notatek):</p>
                {SUGGESTED_QUESTIONS.map(sq => (
                  <div key={sq.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-primary-100">
                    <p className="text-xs flex-1 text-gray-700">{sq.text}</p>
                    <button
                      onClick={() => {
                        setQuestions(prev => [...prev, { ...sq, id: `q-${Date.now()}` }])
                        setShowSuggestions(false)
                      }}
                      className="btn-primary text-xs px-2 py-1 shrink-0"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <QuestionEditor
                  key={q.id}
                  q={q}
                  idx={idx}
                  onUpdate={updated => setQuestions(prev => prev.map(x => x.id === updated.id ? updated : x))}
                  onRemove={() => setQuestions(prev => prev.filter(x => x.id !== q.id))}
                />
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              {(['single-choice', 'open', 'true-false'] as QuestionType[]).map(type => (
                <button key={type} onClick={() => addQuestion(type)} className="btn-secondary text-xs flex-1">
                  <Plus size={12} />
                  {type === 'single-choice' ? 'Wybór' : type === 'open' ? 'Otwarte' : 'P/F'}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-2 text-right">Łącznie: {maxScore} pkt</p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary">
              <ArrowLeft size={15} /> Wróć
            </button>
            <button onClick={() => setStep(3)} disabled={questions.length === 0} className="btn-primary flex-1">
              Podgląd <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-primary-600" />
              <h2 className="font-semibold text-gray-800">Podgląd testu</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2"><span className="text-gray-500 w-28">Nazwa:</span><span className="font-medium">{title}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 w-28">Klasy:</span><span>{selectedClasses.map(id => classes.find(c => c.id === id)?.name).join(', ')}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 w-28">Pytań:</span><span>{questions.length}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 w-28">Maks. punktów:</span><span>{maxScore}</span></div>
              {scheduledAt && <div className="flex gap-2"><span className="text-gray-500 w-28">Termin:</span><span>{new Date(scheduledAt).toLocaleString('pl-PL')}</span></div>}
              <div className="flex gap-2"><span className="text-gray-500 w-28">Czas:</span><span>{duration} min</span></div>
            </div>
            <div className="border-t border-gray-100 pt-3 space-y-2">
              {questions.map((q, i) => (
                <div key={q.id} className="text-sm">
                  <p className="font-medium">{i + 1}. {q.text || <em className="text-gray-400">Brak treści</em>}</p>
                  <p className="text-xs text-gray-500">{q.type === 'single-choice' ? 'Jednokrotny wybór' : q.type === 'open' ? 'Otwarte' : 'P/F'} · {q.points} pkt</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-secondary">
              <ArrowLeft size={15} /> Edytuj pytania
            </button>
            <button onClick={handlePublish} disabled={mutation.isPending} className="btn-primary flex-1">
              {mutation.isPending ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /> : null}
              Opublikuj test
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
