import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, Save, Send, Plus, X, Headphones,
  Clock, Globe, ChevronDown, ChevronUp, Check
} from 'lucide-react'
import { api, MOCK_CLASSES } from '@/mocks/teacherMocks'
import type { LessonNote, OutlineBlock } from '@/types/teacher'

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => api.getNote(id!),
    enabled: !!id,
  })

  const mutation = useMutation({
    mutationFn: (data: Partial<LessonNote>) => api.updateNote(id!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const [title, setTitle]             = useState('')
  const [summary, setSummary]         = useState('')
  const [concepts, setConcepts]       = useState<string[]>([])
  const [newConcept, setNewConcept]   = useState('')
  const [outline, setOutline]         = useState<OutlineBlock[]>([])
  const [shareAudio, setShareAudio]   = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [publishClasses, setPublishClasses]   = useState<string[]>([])
  const [publishNotes, setPublishNotes]       = useState(true)
  const [publishAudio, setPublishAudio]       = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Init state from loaded note
  if (note && !initialized) {
    setTitle(note.title)
    setSummary(note.summary)
    setConcepts([...note.concepts])
    setOutline(note.outline.map(b => ({ ...b })))
    setShareAudio(note.hasAudio && note.shareScope.includes('audio'))
    setInitialized(true)
  }

  const handleSave = async () => {
    setSaving(true)
    await mutation.mutateAsync({ title, summary, concepts, outline, shareScope: shareAudio ? ['notes', 'audio'] : ['notes'] })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handlePublish = async () => {
    await mutation.mutateAsync({
      title, summary, concepts, outline,
      status: 'published',
      publishedToClasses: publishClasses,
      shareScope: publishNotes && publishAudio ? ['notes', 'audio'] : publishNotes ? ['notes'] : ['audio'],
    })
    setShowPublishModal(false)
    navigate('/teacher/notes')
  }

  const addConcept = () => {
    if (newConcept.trim() && !concepts.includes(newConcept.trim())) {
      setConcepts(c => [...c, newConcept.trim()])
      setNewConcept('')
    }
  }

  const removeConcept = (c: string) => setConcepts(prev => prev.filter(x => x !== c))

  const updateBlock = (idx: number, field: keyof OutlineBlock, value: string) => {
    setOutline(prev => prev.map((b, i) => i === idx ? { ...b, [field]: value } : b))
  }

  const addBlock = () => {
    setOutline(prev => [...prev, { id: `ob-${Date.now()}`, heading: '', content: '' }])
  }

  const removeBlock = (idx: number) => setOutline(prev => prev.filter((_, i) => i !== idx))

  const moveBlock = (idx: number, dir: -1 | 1) => {
    const next = [...outline]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setOutline(next)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!note) {
    return <div className="card p-8 text-center text-gray-500">Notatka nie znaleziona</div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Edycja notatki</h1>
          <p className="text-xs text-gray-500 mt-0.5">{note.className} · {note.subjectName} · {new Date(note.date).toLocaleDateString('pl-PL')}</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600">
              <Check size={14} /> Zapisano
            </span>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-secondary">
            {saving ? <span className="w-4 h-4 rounded-full border-2 border-gray-500 border-t-transparent animate-spin" /> : <Save size={15} />}
            Zapisz
          </button>
          <button onClick={() => setShowPublishModal(true)} className="btn-primary">
            <Send size={15} />
            Opublikuj dla klas…
          </button>
        </div>
      </div>

      {/* Title & meta */}
      <div className="card p-5 space-y-4">
        <div>
          <label className="label">Temat lekcji</label>
          <input
            type="text"
            className="input text-lg font-semibold"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        {note.hasAudio && (
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setShareAudio(v => !v)}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${shareAudio ? 'bg-primary-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${shareAudio ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-gray-700 flex items-center gap-1.5">
              <Headphones size={14} />
              Udostępnij audio uczniom
            </span>
          </label>
        )}
      </div>

      {/* Summary */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Streszczenie</h2>
        <textarea
          className="input min-h-[120px] resize-y"
          placeholder="Krótkie streszczenie lekcji…"
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />
      </div>

      {/* Concepts */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Najważniejsze pojęcia</h2>
        <div className="flex flex-wrap gap-2">
          {concepts.map(c => (
            <span key={c} className="badge-blue flex items-center gap-1">
              {c}
              <button onClick={() => removeConcept(c)} className="hover:text-red-600 ml-0.5">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="input flex-1"
            placeholder="Dodaj pojęcie…"
            value={newConcept}
            onChange={e => setNewConcept(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addConcept())}
          />
          <button onClick={addConcept} className="btn-secondary px-3">
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Outline */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Przebieg lekcji</h2>
          <button onClick={addBlock} className="btn-secondary text-xs">
            <Plus size={13} /> Dodaj blok
          </button>
        </div>
        {outline.length === 0 && (
          <p className="text-sm text-gray-400 italic">Brak bloków – kliknij „Dodaj blok"</p>
        )}
        <div className="space-y-3">
          {outline.map((block, idx) => (
            <div key={block.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/60">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="input font-medium"
                  placeholder="Nagłówek sekcji…"
                  value={block.heading}
                  onChange={e => updateBlock(idx, 'heading', e.target.value)}
                />
                {block.audioTimestamp !== undefined && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 shrink-0 bg-white border border-gray-200 rounded px-2 py-1">
                    <Clock size={11} />
                    {Math.floor(block.audioTimestamp / 60)}:{(block.audioTimestamp % 60).toString().padStart(2, '0')}
                  </span>
                )}
                <div className="flex gap-1 shrink-0 ml-auto">
                  <button onClick={() => moveBlock(idx, -1)} disabled={idx === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                    <ChevronUp size={14} />
                  </button>
                  <button onClick={() => moveBlock(idx, 1)} disabled={idx === outline.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                    <ChevronDown size={14} />
                  </button>
                  <button onClick={() => removeBlock(idx)} className="p-1 hover:bg-red-100 text-red-500 rounded">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <textarea
                className="input min-h-[72px] resize-y text-sm"
                placeholder="Treść sekcji…"
                value={block.content}
                onChange={e => updateBlock(idx, 'content', e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Publish modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Globe size={18} className="text-primary-600" />
              Opublikuj dla klas
            </h2>

            <div>
              <label className="label">Wybierz klasy</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {MOCK_CLASSES.map(cls => (
                  <label key={cls.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      checked={publishClasses.includes(cls.id)}
                      onChange={e => {
                        if (e.target.checked) setPublishClasses(prev => [...prev, cls.id])
                        else setPublishClasses(prev => prev.filter(c => c !== cls.id))
                      }}
                    />
                    <span className="text-sm">{cls.name} – {cls.subjectName}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Zakres udostępnienia</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" checked={publishNotes} onChange={e => setPublishNotes(e.target.checked)} />
                  <span className="text-sm">Notatki tekstowe</span>
                </label>
                {note.hasAudio && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" checked={publishAudio} onChange={e => setPublishAudio(e.target.checked)} />
                    <span className="text-sm flex items-center gap-1.5"><Headphones size={13} />Audio</span>
                  </label>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowPublishModal(false)} className="btn-secondary flex-1">Anuluj</button>
              <button
                onClick={handlePublish}
                disabled={publishClasses.length === 0}
                className="btn-primary flex-1"
              >
                <Send size={15} />
                Opublikuj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
