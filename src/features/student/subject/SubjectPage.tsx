import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileText,
  Mic,
  ChevronRight,
} from 'lucide-react'
import { studentApi } from '@/mocks/studentMocks'
import type { StudentUpcomingTest, StudentHomework, StudentNote, StudentTopic } from '@/types/student'

// ─── Date utilities ───────────────────────────────────────────────────────────

function getDaysUntil(isoDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(isoDate)
  target.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

function formatRelative(isoDate: string): string {
  const days = getDaysUntil(isoDate)
  if (days === 0) return 'Dziś'
  if (days === 1) return 'Jutro'
  if (days <= 7) return `Za ${days} dni`
  const d = new Date(isoDate)
  return d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' })
}

function formatAbsolute(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
}

function formatLongDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pl-PL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TestAlertCard({ test }: { test: StudentUpcomingTest }) {
  const dateOnly = test.scheduledAt.split('T')[0]
  const days = getDaysUntil(dateOnly)
  const urgent = days <= 3
  const cardCls = urgent
    ? 'bg-amber-50 border-amber-200'
    : 'bg-indigo-50 border-indigo-100'
  const labelCls = urgent ? 'text-amber-600' : 'text-indigo-500'
  const btnCls = urgent ? 'text-amber-700 hover:text-amber-800' : 'text-indigo-600 hover:text-indigo-700'

  return (
    <div className={`rounded-xl border p-4 ${cardCls}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1.5 ${labelCls}`}>
            {days === 1 ? 'Jutro!' : `Za ${days} ${days === 1 ? 'dzień' : 'dni'}`}
          </p>
          <p className="font-semibold text-gray-900 leading-snug">{test.title}</p>
          <p className="text-sm text-gray-500 mt-0.5">
            {formatLongDate(dateOnly)} · {test.durationMinutes} minut
          </p>
          {test.topicTitles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {test.topicTitles.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-white/70 text-gray-600 rounded-md px-2 py-0.5 border border-white/80"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <button className={`shrink-0 flex items-center gap-1 text-sm font-medium mt-0.5 transition-colors ${btnCls}`}>
          Ucz się
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

function HomeworkItem({ item }: { item: StudentHomework }) {
  const days = getDaysUntil(item.dueDate)
  const dueCls =
    days <= 1 ? 'text-amber-600 font-semibold' :
    days <= 3 ? 'text-amber-500' :
    'text-gray-400'

  return (
    <div className="px-4 py-3.5 flex items-start gap-3">
      <Circle size={15} className="text-gray-200 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 leading-snug">{item.title}</p>
        {item.description && (
          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{item.description}</p>
        )}
      </div>
      <div className="shrink-0 text-right ml-2">
        <p className={`text-xs ${dueCls}`}>{formatRelative(item.dueDate)}</p>
        {days > 1 && (
          <p className="text-xs text-gray-300 mt-0.5">{formatAbsolute(item.dueDate)}</p>
        )}
      </div>
    </div>
  )
}

function TestRow({ test }: { test: StudentUpcomingTest }) {
  const dateOnly = test.scheduledAt.split('T')[0]
  const days = getDaysUntil(dateOnly)
  const dueCls =
    days <= 1 ? 'text-amber-600 font-semibold' :
    days <= 3 ? 'text-amber-500' :
    'text-gray-400'

  return (
    <div className="px-4 py-3.5 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{test.title}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatLongDate(dateOnly)} · {test.durationMinutes} min
        </p>
      </div>
      <p className={`text-xs shrink-0 ${dueCls}`}>{formatRelative(dateOnly)}</p>
    </div>
  )
}

function NoteCard({ note }: { note: StudentNote }) {
  return (
    <button className="rounded-xl bg-white border border-gray-100 p-3.5 text-left hover:border-gray-200 hover:shadow-sm transition-all w-full">
      <div className="mb-2.5">
        {note.hasAudio ? (
          <Mic size={15} className="text-indigo-400" />
        ) : (
          <FileText size={15} className="text-gray-300" />
        )}
      </div>
      <p className="text-xs font-medium text-gray-900 leading-snug line-clamp-2">{note.title}</p>
      <p className="text-xs text-gray-400 mt-2">{formatAbsolute(note.date)}</p>
    </button>
  )
}

function TopicRow({ topic }: { topic: StudentTopic }) {
  const isCurrent = topic.status === 'current'
  const isDone = topic.status === 'completed'

  return (
    <div className={`px-4 py-3 flex items-center gap-3 ${isCurrent ? 'bg-indigo-50/60' : ''}`}>
      <div className="shrink-0 flex items-center justify-center w-4">
        {isDone ? (
          <CheckCircle2 size={15} className="text-gray-300" />
        ) : isCurrent ? (
          <div className="w-3.5 h-3.5 rounded-full border-[2px] border-indigo-500 bg-white" />
        ) : (
          <div className="w-3.5 h-3.5 rounded-full border border-gray-200" />
        )}
      </div>
      <span
        className={`text-sm flex-1 leading-snug ${
          isDone
            ? 'text-gray-400'
            : isCurrent
            ? 'text-indigo-700 font-medium'
            : 'text-gray-600'
        }`}
      >
        {topic.title}
      </span>
      {isCurrent && (
        <span className="shrink-0 text-xs text-indigo-500 font-medium bg-indigo-100 rounded-full px-2 py-0.5">
          Teraz
        </span>
      )}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  count,
  action,
  children,
}: {
  title: string
  count?: number | string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{title}</h2>
        <div className="flex items-center gap-3">
          {count !== undefined && (
            <span className="text-xs text-gray-400">{count}</span>
          )}
          {action}
        </div>
      </div>
      {children}
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SubjectPage() {
  const { subjectName } = useParams<{ subjectName: string }>()
  const name = decodeURIComponent(subjectName ?? 'Matematyka')

  const { data: subjectInfo, isLoading } = useQuery({
    queryKey: ['studentSubjectInfo', name],
    queryFn: () => studentApi.getSubjectInfo(name),
  })

  const subjectId = subjectInfo?.subjectId ?? ''

  const { data: homework = [] } = useQuery({
    queryKey: ['studentHomework', subjectId],
    queryFn: () => studentApi.getHomework(subjectId),
    enabled: !!subjectId,
  })

  const { data: upcomingTests = [] } = useQuery({
    queryKey: ['studentTests', subjectId],
    queryFn: () => studentApi.getUpcomingTests(subjectId),
    enabled: !!subjectId,
  })

  const { data: notes = [] } = useQuery({
    queryKey: ['studentNotes', subjectId],
    queryFn: () => studentApi.getNotes(subjectId),
    enabled: !!subjectId,
  })

  const { data: topics = [] } = useQuery({
    queryKey: ['studentTopics', subjectId],
    queryFn: () => studentApi.getTopics(subjectId),
    enabled: !!subjectId,
  })

  const sortedHomework = [...homework].sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  const completedTopics = topics.filter((t) => t.status === 'completed').length
  const progressPct = topics.length > 0 ? Math.round((completedTopics / topics.length) * 100) : 0

  const nextTest = upcomingTests[0]
  const nextTestDays = nextTest ? getDaysUntil(nextTest.scheduledAt.split('T')[0]) : null
  const showTestAlert = nextTestDays !== null && nextTestDays <= 7

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Ładowanie…</p>
      </div>
    )
  }

  if (!subjectInfo) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500">Nie znaleziono przedmiotu.</p>
      </div>
    )
  }

  return (
    <div className="flex-1">
      {/* Subject header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-5">
          <Link
            to="/student"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-4"
          >
            <ArrowLeft size={13} />
            Wszystkie przedmioty
          </Link>

          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {subjectInfo.schoolName} · Klasa {subjectInfo.className}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-bold text-gray-900 leading-none">
                {subjectInfo.avgGrade.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1">średnia</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-6">

        {/* ── Test alert ────────────────────────────────────────────────── */}
        {showTestAlert && nextTest && (
          <TestAlertCard test={nextTest} />
        )}

        {/* ── Homework ──────────────────────────────────────────────────── */}
        <Section
          title="Zadania domowe"
          count={sortedHomework.length > 0 ? `${sortedHomework.length} otwarte` : undefined}
        >
          {sortedHomework.length === 0 ? (
            <div className="rounded-xl bg-white border border-gray-100 px-4 py-6 flex flex-col items-center gap-2 text-center">
              <CheckCircle2 size={22} className="text-gray-200" />
              <p className="text-sm text-gray-400">Brak zadań do wykonania</p>
            </div>
          ) : (
            <div className="rounded-xl bg-white border border-gray-100 divide-y divide-gray-50">
              {sortedHomework.map((item) => (
                <HomeworkItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </Section>

        {/* ── Upcoming tests ────────────────────────────────────────────── */}
        {upcomingTests.length > 0 && (
          <Section title="Sprawdziany i kartkówki">
            <div className="rounded-xl bg-white border border-gray-100 divide-y divide-gray-50">
              {upcomingTests.map((test) => (
                <TestRow key={test.id} test={test} />
              ))}
            </div>
          </Section>
        )}

        {/* ── Notes ─────────────────────────────────────────────────────── */}
        {notes.length > 0 && (
          <Section
            title="Notatki z lekcji"
            action={
              <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                Wszystkie
              </button>
            }
          >
            <div className="grid grid-cols-3 gap-2.5">
              {notes.slice(0, 3).map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </Section>
        )}

        {/* ── Topics ────────────────────────────────────────────────────── */}
        {topics.length > 0 && (
          <Section title="Tematy" count={`${completedTopics} / ${topics.length}`}>
            {/* Progress bar */}
            <div className="h-1 bg-gray-100 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="rounded-xl bg-white border border-gray-100 divide-y divide-gray-50">
              {topics.map((topic) => (
                <TopicRow key={topic.id} topic={topic} />
              ))}
            </div>
          </Section>
        )}

        <div className="h-6" />
      </main>
    </div>
  )
}
