import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  User, BookOpen, FileText, Globe, Shield,
  Save, Camera, Plus, Trash2, Check
} from 'lucide-react'
import { api, MOCK_CLASSES, MOCK_TEACHER } from '@/mocks/teacherMocks'

type Tab = 'about' | 'classes' | 'library' | 'public' | 'privacy'

const SHARE_LEVELS = [
  { value: 'my-classes', label: 'Tylko moje klasy' },
  { value: 'school',     label: 'Cała szkoła' },
  { value: 'district',   label: 'Powiat' },
  { value: 'region',     label: 'Województwo' },
  { value: 'platform',   label: 'Cała platforma' },
]

export default function ProfilePage() {
  const [tab, setTab] = useState<Tab>('about')

  const { data: notes = [] }   = useQuery({ queryKey: ['notes'],   queryFn: api.getNotes })
  const { data: lessons = [] } = useQuery({ queryKey: ['lessons'], queryFn: api.getLessons })

  // About form state
  const [bio, setBio]             = useState(MOCK_TEACHER.bio)
  const [firstName, setFirstName] = useState(MOCK_TEACHER.firstName)
  const [lastName, setLastName]   = useState(MOCK_TEACHER.lastName)
  const [saved, setSaved] = useState(false)

  const handleSaveAbout = async () => {
    await new Promise(r => setTimeout(r, 400))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  // Privacy toggles
  const [autoRecord,   setAutoRecord]   = useState(false)
  const [autoGenNotes, setAutoGenNotes] = useState(true)
  const [autoPublish,  setAutoPublish]  = useState(false)
  const [allowPublic,  setAllowPublic]  = useState(false)
  const [directorAccess, setDirectorAccess] = useState(false)

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'about',    label: 'O mnie',               icon: User },
    { id: 'classes',  label: 'Moje klasy i przedmioty', icon: BookOpen },
    { id: 'library',  label: 'Moje lekcje i notatki', icon: FileText },
    { id: 'public',   label: 'Publiczne notatki',     icon: Globe },
    { id: 'privacy',  label: 'Ustawienia prywatności', icon: Shield },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profil nauczyciela</h1>

      {/* Avatar + name banner */}
      <div className="card p-5 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
            {MOCK_TEACHER.firstName[0]}{MOCK_TEACHER.lastName[0]}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50">
            <Camera size={13} className="text-gray-600" />
          </button>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{MOCK_TEACHER.firstName} {MOCK_TEACHER.lastName}</h2>
          <p className="text-sm text-gray-500">{MOCK_TEACHER.email}</p>
          <p className="text-sm text-gray-500">{MOCK_TEACHER.school}</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {MOCK_TEACHER.subjects.map(s => (
              <span key={s.id} className="badge-blue text-xs">{s.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-gray-200 pb-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px
              ${tab === id
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'about' && (
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-800">Dane osobowe</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Imię</label>
              <input className="input" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="label">Nazwisko</label>
              <input className="input" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">E-mail</label>
            <input className="input opacity-60 cursor-not-allowed" value={MOCK_TEACHER.email} disabled />
          </div>
          <div>
            <label className="label">Szkoła</label>
            <input className="input opacity-60 cursor-not-allowed" value={MOCK_TEACHER.school} disabled />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea
              className="input min-h-[100px] resize-y"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Kilka słów o sobie…"
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSaveAbout} className="btn-primary">
              <Save size={15} /> Zapisz zmiany
            </button>
            {saved && <span className="flex items-center gap-1 text-sm text-green-600"><Check size={14} /> Zapisano</span>}
          </div>
        </div>
      )}

      {tab === 'classes' && (
        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Klasy i przedmioty</h2>
            <button className="btn-secondary text-xs">
              <Plus size={13} /> Dodaj klasę
            </button>
          </div>
          <div className="space-y-2">
            {MOCK_CLASSES.map(cls => (
              <div key={cls.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-200 bg-gray-50/50">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                  {cls.name}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{cls.name}</p>
                  <p className="text-xs text-gray-500">{cls.subjectName} · {cls.schoolYear}</p>
                </div>
                <span className="badge-gray text-xs">{cls.schoolType}</span>
                <button className="btn-ghost p-1.5 text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'library' && (
        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-gray-800">Moje lekcje</h2>
            <div className="space-y-2">
              {lessons.slice(0, 6).map(l => (
                <div key={l.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs shrink-0">
                    {new Date(l.date).getDate()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{l.title}</p>
                    <p className="text-xs text-gray-500">{l.className} · {l.subjectName}</p>
                  </div>
                  {l.hasRecording && <span className="badge-green text-[10px]">🎧</span>}
                  {l.hasNotes && <span className="badge-blue text-[10px]">📝</span>}
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5 space-y-3">
            <h2 className="font-semibold text-gray-800">Moje notatki</h2>
            <div className="space-y-2">
              {notes.map(n => (
                <div key={n.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
                  <FileText size={16} className="text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500">{n.className} · {n.date}</p>
                  </div>
                  {n.status === 'published' ? (
                    <span className="badge-green text-[10px]">opublikowane</span>
                  ) : (
                    <span className="badge-yellow text-[10px]">szkic</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'public' && (
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-800">Zarządzaj udostępnianiem notatek</h2>
          <p className="text-sm text-gray-500">Wybierz, które lekcje i w jakim zakresie są publiczne poza Twoją klasą.</p>
          <div className="space-y-3">
            {notes.map(note => (
              <div key={note.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{note.title}</p>
                    <p className="text-xs text-gray-500">{note.className} · {note.date}</p>
                  </div>
                  {note.isPublic ? (
                    <span className="badge-blue text-xs flex items-center gap-1">
                      <Globe size={11} /> Publiczne
                    </span>
                  ) : (
                    <span className="badge-gray text-xs">Prywatne</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs">Poziom udostępnienia</label>
                    <select className="select text-xs" defaultValue={note.shareLevel}>
                      {SHARE_LEVELS.map(sl => (
                        <option key={sl.value} value={sl.value}>{sl.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label text-xs">Zakres</label>
                    <div className="space-y-1 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input type="checkbox" className="w-3 h-3" defaultChecked={note.shareScope.includes('notes')} />
                        Notatki 📝
                      </label>
                      {note.hasAudio && (
                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input type="checkbox" className="w-3 h-3" defaultChecked={note.shareScope.includes('audio')} />
                          Audio 🎧
                        </label>
                      )}
                      <label className="flex items-center gap-2 cursor-pointer text-xs">
                        <input type="checkbox" className="w-3 h-3" defaultChecked={note.shareScope.includes('topic-concepts')} />
                        Tylko temat i pojęcia
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'privacy' && (
        <div className="card p-6 space-y-6">
          <h2 className="font-semibold text-gray-800">Ustawienia prywatności</h2>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Nagrywanie</h3>

            {[
              { label: 'Auto-nagrywanie wybranych przedmiotów', desc: 'Nagrywanie startuje automatycznie dla wybranych klas', value: autoRecord, set: setAutoRecord },
              { label: 'Auto-generowanie notatek po nagraniu', desc: 'Notatki generowane są automatycznie po zakończeniu lekcji', value: autoGenNotes, set: setAutoGenNotes },
              { label: 'Auto-publikacja notatek', desc: 'Notatki publikowane automatycznie po weryfikacji', value: autoPublish, set: setAutoPublish },
            ].map(({ label, desc, value, set }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => set(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${value ? 'bg-primary-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Zgody</h3>
            {[
              { label: 'Zezwalam na publikowanie notatek poza szkołą', desc: 'Notatki mogą być dostępne dla nauczycieli z innych szkół', value: allowPublic, set: setAllowPublic },
              { label: 'Dyrektor ma wgląd do nagrań', desc: 'Dyrektor szkoły może przeglądać archiwum nagrań', value: directorAccess, set: setDirectorAccess },
            ].map(({ label, desc, value, set }) => (
              <div key={label} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
                <button
                  onClick={() => set(v => !v)}
                  className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${value ? 'bg-primary-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 italic">
            Ustawienia prywatności – tylko UX, logika będzie zaimplementowana w przyszłych wersjach.
          </p>
        </div>
      )}
    </div>
  )
}
