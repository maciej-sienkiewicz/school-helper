import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts'
import { Mic, FileText, ClipboardList, AlertCircle, TrendingUp } from 'lucide-react'
import { api } from '@/mocks/teacherMocks'

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: api.getAnalytics,
  })

  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  const topStats = [
    {
      label: 'Nagrane lekcje (30 dni)',
      value: analytics.recordedLessonsLast30Days,
      total: analytics.totalLessons,
      icon: Mic,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      label: 'Opublikowane notatki (30 dni)',
      value: analytics.publishedNotesLast30Days,
      total: analytics.totalNotes,
      icon: FileText,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Śr. testów na klasę',
      value: analytics.avgTestsPerClass.toFixed(1),
      total: analytics.totalTests,
      icon: ClipboardList,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      label: 'Łącznie lekcji',
      value: analytics.totalLessons,
      total: null,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analityka</h1>
        <p className="text-sm text-gray-500 mt-0.5">Podsumowanie Twojej aktywności</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topStats.map(({ label, value, total, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500 uppercase tracking-wide leading-tight">{label}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg}`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            {total !== null && (
              <span className="text-xs text-gray-400">łącznie: {total}</span>
            )}
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lessons per month */}
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold text-gray-800">Lekcje wg miesiąca</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.lessonsPerMonth} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Lekcje" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Test scores by class */}
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold text-gray-800">Średnie wyniki testów wg klasy</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics.testScoresByClass} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="className" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                cursor={{ fill: '#f3f4f6' }}
                formatter={(v: number) => [`${v}%`, 'Średnia']}
              />
              <Bar
                dataKey="avgScore"
                radius={[4, 4, 0, 0]}
                fill="#10b981"
                name="Wynik (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Difficult topics */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500" />
          Najtrudniejsze tematy
        </h2>
        <div className="space-y-3">
          {analytics.difficultTopics.map((dt, idx) => (
            <div key={dt.topicId} className="flex items-center gap-4">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                idx === 0 ? 'bg-red-100 text-red-700' : idx === 1 ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{dt.topicTitle}</p>
                <p className="text-xs text-gray-500">{dt.subjectName}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full ${dt.avgScore >= 70 ? 'bg-green-500' : dt.avgScore >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${dt.avgScore}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-10 text-right">{dt.avgScore}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend line (fake) */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Trend nagrywania</h2>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={analytics.lessonsPerMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
              name="Lekcje"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
