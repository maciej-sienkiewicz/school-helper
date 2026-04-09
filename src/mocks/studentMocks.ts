import type {
  StudentProfile,
  StudentSubjectInfo,
  StudentHomework,
  StudentGrade,
  StudentUpcomingTest,
  StudentNote,
  StudentTopic,
} from '@/types/student'

// ─── Student profile ──────────────────────────────────────────────────────────

export const MOCK_STUDENT: StudentProfile = {
  id: 'student-1',
  firstName: 'Jan',
  lastName: 'Kowalski',
  className: '7B',
  schoolName: 'Szkoła Podstawowa nr 47 w Krakowie',
}

// ─── Subjects ─────────────────────────────────────────────────────────────────

export const MOCK_STUDENT_SUBJECTS: StudentSubjectInfo[] = [
  {
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    classId: 'cls-2',
    className: '7B',
    schoolName: 'Szkoła Podstawowa nr 47 w Krakowie',
    avgGrade: 4.17,
  },
  {
    subjectId: 'sub-2',
    subjectName: 'Informatyka',
    classId: 'cls-4',
    className: '7B',
    schoolName: 'Szkoła Podstawowa nr 47 w Krakowie',
    avgGrade: 5.0,
  },
  {
    subjectId: 'sub-3',
    subjectName: 'Fizyka',
    classId: 'cls-6',
    className: '7B',
    schoolName: 'Szkoła Podstawowa nr 47 w Krakowie',
    avgGrade: 3.5,
  },
]

// ─── Homework ─────────────────────────────────────────────────────────────────

export const MOCK_STUDENT_HOMEWORK: StudentHomework[] = [
  {
    id: 'hw-1',
    title: 'Zadania 3–8 str. 142 (Układy równań)',
    description: 'Podręcznik matematyki, rozdział 5',
    dueDate: '2026-04-11',
    subjectId: 'sub-1',
    completed: false,
  },
  {
    id: 'hw-2',
    title: 'Projekt: wykres funkcji liniowej',
    description: 'Narysuj wykresy 4 funkcji liniowych na jednym układzie współrzędnych',
    dueDate: '2026-04-14',
    subjectId: 'sub-1',
    completed: false,
  },
  {
    id: 'hw-3',
    title: 'Zadanie tekstowe – Twierdzenie Pitagorasa',
    dueDate: '2026-04-17',
    subjectId: 'sub-1',
    completed: false,
  },
  // Completed – hidden from student view
  {
    id: 'hw-0',
    title: 'Równania – ćwiczenia str. 98',
    dueDate: '2026-04-07',
    subjectId: 'sub-1',
    completed: true,
  },
]

// ─── Grades ───────────────────────────────────────────────────────────────────

export const MOCK_STUDENT_GRADES: StudentGrade[] = [
  { id: 'g-1', value: 4, weight: 1, description: 'Kartkówka – równania liniowe', date: '2026-03-18', subjectId: 'sub-1' },
  { id: 'g-2', value: 5, weight: 1, description: 'Aktywność na lekcji', date: '2026-03-20', subjectId: 'sub-1' },
  { id: 'g-3', value: 3, weight: 2, description: 'Sprawdzian – równania i procenty', date: '2026-03-28', subjectId: 'sub-1' },
  { id: 'g-4', value: 5, weight: 1, description: 'Praca domowa', date: '2026-04-02', subjectId: 'sub-1' },
  { id: 'g-5', value: 4, weight: 1, description: 'Kartkówka – układy równań', date: '2026-04-07', subjectId: 'sub-1' },
]

// ─── Upcoming tests ───────────────────────────────────────────────────────────

export const MOCK_UPCOMING_TESTS: StudentUpcomingTest[] = [
  {
    id: 'ut-1',
    title: 'Kartkówka – Układy równań',
    scheduledAt: '2026-04-15T10:00:00',
    durationMinutes: 20,
    topicTitles: ['Metoda podstawiania', 'Metoda przeciwnych współczynników'],
    subjectId: 'sub-1',
  },
  {
    id: 'ut-2',
    title: 'Sprawdzian – Równania i układy równań',
    scheduledAt: '2026-04-22T09:00:00',
    durationMinutes: 45,
    topicTitles: ['Równania liniowe', 'Układy równań'],
    subjectId: 'sub-1',
  },
]

// ─── Notes ────────────────────────────────────────────────────────────────────

export const MOCK_STUDENT_NOTES: StudentNote[] = [
  {
    id: 'sn-1',
    title: 'Układy równań – metoda przeciwnych współczynników',
    date: '2026-04-07',
    hasAudio: true,
    topicTitle: 'Układy równań',
    subjectId: 'sub-1',
  },
  {
    id: 'sn-2',
    title: 'Układy równań – metoda podstawiania',
    date: '2026-03-31',
    hasAudio: true,
    topicTitle: 'Układy równań',
    subjectId: 'sub-1',
  },
  {
    id: 'sn-3',
    title: 'Równania liniowe z jedną niewiadomą',
    date: '2026-03-18',
    hasAudio: false,
    topicTitle: 'Równania liniowe',
    subjectId: 'sub-1',
  },
]

// ─── Topics ───────────────────────────────────────────────────────────────────

export const MOCK_STUDENT_TOPICS: StudentTopic[] = [
  { id: 'st-1', title: 'Procenty i promile', status: 'completed', subjectId: 'sub-1' },
  { id: 'st-2', title: 'Potęgi i pierwiastki', status: 'completed', subjectId: 'sub-1' },
  { id: 'st-3', title: 'Równania liniowe', status: 'completed', subjectId: 'sub-1' },
  { id: 'st-4', title: 'Układy równań', status: 'current', subjectId: 'sub-1' },
  { id: 'st-5', title: 'Nierówności liniowe', status: 'upcoming', subjectId: 'sub-1' },
  { id: 'st-6', title: 'Funkcja liniowa', status: 'upcoming', subjectId: 'sub-1' },
  { id: 'st-7', title: 'Twierdzenie Pitagorasa', status: 'upcoming', subjectId: 'sub-1' },
]

// ─── Mock API ─────────────────────────────────────────────────────────────────

const delay = (ms = 200) => new Promise<void>((res) => setTimeout(res, ms))

export const studentApi = {
  getStudent: async () => {
    await delay()
    return MOCK_STUDENT
  },
  getSubjects: async () => {
    await delay()
    return MOCK_STUDENT_SUBJECTS
  },
  getSubjectInfo: async (subjectName: string) => {
    await delay()
    return MOCK_STUDENT_SUBJECTS.find((s) => s.subjectName === subjectName) ?? null
  },
  getHomework: async (subjectId: string) => {
    await delay()
    return MOCK_STUDENT_HOMEWORK.filter((h) => h.subjectId === subjectId && !h.completed)
  },
  getGrades: async (subjectId: string) => {
    await delay()
    return MOCK_STUDENT_GRADES.filter((g) => g.subjectId === subjectId)
  },
  getUpcomingTests: async (subjectId: string) => {
    await delay()
    return MOCK_UPCOMING_TESTS.filter((t) => t.subjectId === subjectId)
  },
  getNotes: async (subjectId: string) => {
    await delay()
    return MOCK_STUDENT_NOTES.filter((n) => n.subjectId === subjectId)
  },
  getTopics: async (subjectId: string) => {
    await delay()
    return MOCK_STUDENT_TOPICS.filter((t) => t.subjectId === subjectId)
  },
}
