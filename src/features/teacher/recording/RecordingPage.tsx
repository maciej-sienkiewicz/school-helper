import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Save, FileText, Bell } from 'lucide-react'
import { api } from '@/mocks/teacherMocks'
import AudioRecorderMock from './AudioRecorderMock'

const schema = z.object({
  classId: z.string().min(1, 'Wybierz klasę'),
  subjectId: z.string().min(1, 'Wybierz przedmiot'),
  title: z.string().optional(),
})
type FormData = z.infer<typeof schema>

type Step = 'form' | 'recording' | 'saved'

export default function RecordingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('form')
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [notifyStudents, setNotifyStudents] = useState(true)
  const [saving, setSaving] = useState(false)

  const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: api.getClasses })
  const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: api.getSubjects })

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const selectedSubjectId = watch('subjectId')
  const filteredClasses = selectedSubjectId
    ? classes.filter(c => c.subjectId === selectedSubjectId)
    : classes

  const onStartRecording = handleSubmit(() => {
    setStep('recording')
  })

  const onRecordingStop = (blob: Blob) => {
    setRecordingBlob(blob)
    setShowModal(true)
  }

  const onSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setShowModal(false)
    setStep('saved')
  }

  if (step === 'saved') {
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Save size={28} className="text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Lekcja zapisana!</h2>
          <p className="text-sm text-gray-500 mt-1">
            Nagranie zostało zapisane. System generuje notatki w tle.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate('/teacher/lessons')} className="btn-secondary">
            <ArrowLeft size={15} />
            Wróć do lekcji
          </button>
          <button onClick={() => navigate('/teacher/notes')} className="btn-primary">
            <FileText size={15} />
            Przejdź do notatek
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nowa lekcja</h1>
          <p className="text-sm text-gray-500">Wypełnij dane i rozpocznij nagrywanie</p>
        </div>
      </div>

      {/* Setup form */}
      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-gray-800">Dane lekcji</h2>

        <div className="space-y-4">
          {/* Subject */}
          <div>
            <label className="label">Przedmiot *</label>
            <select
              className={`select ${errors.subjectId ? 'border-red-400' : ''}`}
              disabled={step === 'recording'}
              {...register('subjectId')}
            >
              <option value="">Wybierz przedmiot…</option>
              {[...new Map(subjects.map(s => [s.id, s])).values()].map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.subjectId && <p className="text-xs text-red-500 mt-1">{errors.subjectId.message}</p>}
          </div>

          {/* Class */}
          <div>
            <label className="label">Klasa *</label>
            <select
              className={`select ${errors.classId ? 'border-red-400' : ''}`}
              disabled={step === 'recording'}
              {...register('classId')}
            >
              <option value="">Wybierz klasę…</option>
              {filteredClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.classId && <p className="text-xs text-red-500 mt-1">{errors.classId.message}</p>}
          </div>

          {/* Topic (optional) */}
          <div>
            <label className="label">Temat lekcji (opcjonalnie)</label>
            <input
              type="text"
              className="input"
              placeholder="np. Równania liniowe – zadania domowe"
              disabled={step === 'recording'}
              {...register('title')}
            />
          </div>
        </div>

        {step === 'form' && (
          <button onClick={onStartRecording} className="btn-primary w-full">
            Dalej – rozpocznij nagrywanie →
          </button>
        )}
      </div>

      {/* Recorder */}
      {step === 'recording' && (
        <AudioRecorderMock onStop={onRecordingStop} />
      )}

      {/* Save modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">Zapisz lekcję</h2>
            <p className="text-sm text-gray-600">
              Nagranie zostało zakończone. Co chcesz zrobić?
            </p>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded"
                checked={notifyStudents}
                onChange={e => setNotifyStudents(e.target.checked)}
              />
              <span className="text-sm text-gray-700 flex items-center gap-1.5">
                <Bell size={14} />
                Powiadom uczniów, gdy notatki będą gotowe
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={onSave}
                disabled={saving}
                className="btn-primary flex-1"
              >
                {saving ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Zapisz lekcję
              </button>
              <button
                onClick={async () => { await onSave(); navigate('/teacher/notes') }}
                disabled={saving}
                className="btn-secondary flex-1"
              >
                <FileText size={15} />
                Przejdź do notatek
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-xs text-gray-400 hover:text-gray-600 w-full text-center"
            >
              Anuluj – kontynuuj nagrywanie
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
