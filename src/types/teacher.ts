// ─── Domain types ───────────────────────────────────────────────────────────

export type SchoolType = 'SP' | 'LO' | 'Technikum' | 'Branżowa'

export interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  school: string
  schoolType: SchoolType
  subjects: Subject[]
  bio: string
  avatar?: string
}

export interface Subject {
  id: string
  name: string
}

export interface SchoolClass {
  id: string
  name: string       // "8A", "3B"
  grade: number      // 6-8 SP, 1-4 LO/Tech
  schoolType: SchoolType
  subjectId: string
  subjectName: string
  schoolYear: string // "2024/2025"
}

// ─── Lesson ─────────────────────────────────────────────────────────────────

export type LessonStatus = 'scheduled' | 'recorded' | 'processing' | 'completed'

export interface Lesson {
  id: string
  title: string
  classId: string
  className: string
  subjectId: string
  subjectName: string
  date: string       // ISO date string
  time: string       // "HH:MM"
  durationMinutes?: number
  hasRecording: boolean
  hasNotes: boolean
  recordingUrl?: string
  status: LessonStatus
  topicId?: string
  topicTitle?: string
}

// ─── Notes ──────────────────────────────────────────────────────────────────

export type NoteStatus = 'draft' | 'published'
export type ShareLevel = 'my-classes' | 'school' | 'district' | 'region' | 'platform'
export type ShareScope = 'notes' | 'audio' | 'topic-concepts'

export interface OutlineBlock {
  id: string
  heading: string
  content: string
  audioTimestamp?: number // seconds
}

export interface LessonNote {
  id: string
  lessonId: string
  title: string
  summary: string
  concepts: string[]
  outline: OutlineBlock[]
  classId: string
  className: string
  subjectId: string
  subjectName: string
  date: string
  status: NoteStatus
  hasAudio: boolean
  isPublic: boolean
  shareLevel: ShareLevel
  shareScope: ShareScope[]
  publishedToClasses: string[]
}

// ─── Topics ─────────────────────────────────────────────────────────────────

export interface Topic {
  id: string
  subjectId: string
  subjectName: string
  title: string
  grade: number
  orderIndex: number
}

export interface TopicProgress {
  topicId: string
  classId: string
  completed: boolean
  sourceType?: 'own' | 'borrowed'
  sourceLessonId?: string
  shareNotes: boolean
  shareAudio: boolean
}

// ─── Tests ──────────────────────────────────────────────────────────────────

export type QuestionType = 'single-choice' | 'open' | 'true-false'
export type TestStatus = 'draft' | 'published' | 'completed'

export interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[]
  correctAnswer?: string | boolean
  points: number
}

export interface Test {
  id: string
  title: string
  classIds: string[]
  classNames: string[]
  lessonIds?: string[]
  topicIds?: string[]
  subjectId: string
  subjectName: string
  scheduledAt?: string
  durationMinutes?: number
  status: TestStatus
  questions: Question[]
  averageScore?: number
  maxScore: number
}

export interface TestResult {
  id: string
  testId: string
  studentId: string  // anonymized, e.g. "Uczeń #1"
  score: number
  maxScore: number
  percentage: number
  answers: Record<string, string | boolean>
  submittedAt: string
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export interface DifficultTopic {
  topicId: string
  topicTitle: string
  subjectName: string
  avgScore: number
}

export interface AnalyticsSummary {
  recordedLessonsLast30Days: number
  publishedNotesLast30Days: number
  avgTestsPerClass: number
  totalLessons: number
  totalNotes: number
  totalTests: number
  difficultTopics: DifficultTopic[]
  lessonsPerMonth: { month: string; count: number }[]
  testScoresByClass: { className: string; avgScore: number }[]
}

// ─── API response wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  total?: number
  page?: number
  pageSize?: number
}

// ─── Filters ────────────────────────────────────────────────────────────────

export interface LessonFilters {
  dateFrom?: string
  dateTo?: string
  classId?: string
  subjectId?: string
  status?: LessonStatus | ''
  hasNotes?: boolean | null
}

export interface NoteFilters {
  classId?: string
  subjectId?: string
  status?: NoteStatus | ''
  dateFrom?: string
  dateTo?: string
  topicId?: string
}

export interface TestFilters {
  classId?: string
  subjectId?: string
  status?: TestStatus | ''
}
