import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Users, Award } from 'lucide-react'
import { api } from '@/mocks/teacherMocks'

export default function TestResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: test } = useQuery({
    queryKey: ['test', id],
    queryFn: () => api.getTest(id!),
    enabled: !!id,
  })

  const { data: results = [], isLoading } = useQuery({
    queryKey: ['testResults', id],
    queryFn: () => api.getTestResults(id!),
    enabled: !!id,
  })

  if (!test && !isLoading) {
    return <div className="card p-8 text-center text-gray-500">Test nie znaleziony</div>
  }

  if (!test) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-8 h-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  const avg = results.length
    ? results.reduce((s, r) => s + r.percentage, 0) / results.length
    : 0
  const min = results.length ? Math.min(...results.map(r => r.percentage)) : 0
  const max = results.length ? Math.max(...results.map(r => r.percentage)) : 0

  // Grade distribution (mock-based on percentage)
  const distribution = [
    { label: '1 (0-29%)', count: results.filter(r => r.percentage < 30).length, color: 'bg-red-400' },
    { label: '2 (30-49%)', count: results.filter(r => r.percentage >= 30 && r.percentage < 50).length, color: 'bg-orange-400' },
    { label: '3 (50-69%)', count: results.filter(r => r.percentage >= 50 && r.percentage < 70).length, color: 'bg-yellow-400' },
    { label: '4 (70-84%)', count: results.filter(r => r.percentage >= 70 && r.percentage < 85).length, color: 'bg-blue-400' },
    { label: '5 (85-94%)', count: results.filter(r => r.percentage >= 85 && r.percentage < 95).length, color: 'bg-green-400' },
    { label: '6 (95-100%)', count: results.filter(r => r.percentage >= 95).length, color: 'bg-green-600' },
  ]
  const maxDistCount = Math.max(...distribution.map(d => d.count), 1)

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-ghost p-2">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{test.title} – Wyniki</h1>
          <p className="text-sm text-gray-500">{test.classNames.join(', ')} · {results.length} uczniów</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Średnia</span>
          <span className="text-3xl font-bold text-gray-900">{avg.toFixed(1)}%</span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            {avg >= 60 ? (
              <TrendingUp size={12} className="text-green-500" />
            ) : (
              <TrendingDown size={12} className="text-red-500" />
            )}
            {avg >= 60 ? 'Dobry wynik' : 'Wymaga poprawy'}
          </div>
        </div>
        <div className="stat-card">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Najwyższy</span>
          <span className="text-3xl font-bold text-green-700">{max}%</span>
          <span className="text-xs text-gray-400">wynik</span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Najniższy</span>
          <span className="text-3xl font-bold text-red-700">{min}%</span>
          <span className="text-xs text-gray-400">wynik</span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Uczniów</span>
          <span className="text-3xl font-bold text-gray-900">{results.length}</span>
          <span className="text-xs text-gray-400">odpowiedziało</span>
        </div>
      </div>

      {/* Distribution bar */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">Rozkład ocen</h2>
        <div className="space-y-2">
          {distribution.map(d => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 w-28 shrink-0">{d.label}</span>
              <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-5 rounded-full ${d.color} transition-all`}
                  style={{ width: `${(d.count / maxDistCount) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-6 text-right">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hard questions */}
      {test.questions.length > 0 && (
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500" />
            Najtrudniejsze pytania (mock)
          </h2>
          {test.questions.slice(0, 3).map((q, i) => (
            <div key={q.id} className="flex items-start gap-3 p-3 rounded-lg bg-red-50/50">
              <span className="text-sm font-bold text-red-600 shrink-0">{i + 1}.</span>
              <div>
                <p className="text-sm text-gray-800">{q.text || 'Pytanie bez treści'}</p>
                <p className="text-xs text-red-500 mt-0.5">Średnia: {40 + i * 8}% poprawnych</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <Users size={16} className="text-primary-600" />
            Wyniki uczniów
          </h2>
          <span className="text-xs text-gray-500">Dane zanonimizowane</span>
        </div>
        {results.length === 0 ? (
          <p className="p-6 text-center text-gray-500 text-sm">Brak wyników</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Uczeń</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-600">Punkty</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Wynik</th>
                </tr>
              </thead>
              <tbody>
                {results
                  .sort((a, b) => b.percentage - a.percentage)
                  .map((r, idx) => (
                    <tr key={r.id} className={`border-b border-gray-50 ${idx % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {idx === 0 && <Award size={14} className="text-yellow-500" />}
                          <span>{r.studentId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {r.score} / {r.maxScore}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-gray-100">
                            <div
                              className={`h-1.5 rounded-full ${r.percentage >= 70 ? 'bg-green-500' : r.percentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                              style={{ width: `${r.percentage}%` }}
                            />
                          </div>
                          <span className={`font-semibold ${r.percentage >= 70 ? 'text-green-700' : r.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {r.percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
