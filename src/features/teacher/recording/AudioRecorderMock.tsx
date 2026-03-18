import { useState, useEffect, useRef } from 'react'
import { Mic, Pause, Square, Play } from 'lucide-react'

interface Props {
  onStop: (blob: Blob) => void
}

type RecordState = 'idle' | 'recording' | 'paused'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function AudioRecorderMock({ onStop }: Props) {
  const [state, setState] = useState<RecordState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (state === 'recording') {
      intervalRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [state])

  const handleStart = () => setState('recording')
  const handlePause = () => setState('paused')
  const handleResume = () => setState('recording')
  const handleStop = () => {
    setState('idle')
    // Return a mock blob
    const mockBlob = new Blob(['mock-audio-data'], { type: 'audio/webm' })
    onStop(mockBlob)
  }

  // Visual waveform bars
  const bars = Array.from({ length: 32 }, (_, i) => i)

  return (
    <div className="card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Nagrywanie</h2>
        {state !== 'idle' && (
          <span className="flex items-center gap-1.5 text-sm font-mono font-semibold text-gray-800">
            {state === 'recording' && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
            {state === 'paused' && (
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
            )}
            {formatTime(elapsed)}
          </span>
        )}
      </div>

      {/* Waveform visualizer (mock) */}
      <div className="flex items-center justify-center gap-0.5 h-16">
        {bars.map(i => {
          const active = state === 'recording'
          const height = active
            ? `${20 + Math.random() * 60}%`
            : state === 'paused'
              ? `${15 + (i % 4) * 10}%`
              : '15%'
          return (
            <div
              key={i}
              className={`w-1.5 rounded-full transition-all duration-100 ${
                active ? 'bg-primary-500' : state === 'paused' ? 'bg-yellow-400' : 'bg-gray-200'
              }`}
              style={{ height: active ? undefined : height }}
            />
          )
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {state === 'idle' && (
          <button
            onClick={handleStart}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg transition-all hover:shadow-red-200 hover:scale-105"
          >
            <Mic size={26} />
          </button>
        )}

        {state === 'recording' && (
          <>
            <button
              onClick={handlePause}
              className="w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center text-white shadow-md transition-all"
              title="Pauza"
            >
              <Pause size={20} />
            </button>
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center ring-4 ring-red-200 animate-pulse">
              <Mic size={26} className="text-white" />
            </div>
            <button
              onClick={handleStop}
              className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center text-white shadow-md transition-all"
              title="Zatrzymaj"
            >
              <Square size={18} />
            </button>
          </>
        )}

        {state === 'paused' && (
          <>
            <button
              onClick={handleResume}
              className="w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 flex items-center justify-center text-white shadow-md transition-all"
              title="Wznów"
            >
              <Play size={20} />
            </button>
            <button
              onClick={handleStop}
              className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-900 flex items-center justify-center text-white shadow-md transition-all"
              title="Zatrzymaj i zapisz"
            >
              <Square size={18} />
            </button>
          </>
        )}
      </div>

      <p className="text-center text-xs text-gray-400">
        {state === 'idle' && 'Kliknij mikrofon, aby rozpocząć nagrywanie'}
        {state === 'recording' && 'Nagrywanie w toku… Kliknij pauza lub stop'}
        {state === 'paused' && 'Nagrywanie wstrzymane – kliknij play, aby wznowić'}
      </p>

      <div className="text-center">
        <span className="badge-gray text-xs">
          🧪 Demo – nagranie symulowane (bez mikrofonu)
        </span>
      </div>
    </div>
  )
}
