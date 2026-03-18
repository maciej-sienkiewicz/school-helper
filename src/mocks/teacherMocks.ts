import type {
  Teacher,
  Subject,
  SchoolClass,
  Lesson,
  LessonNote,
  Topic,
  TopicProgress,
  Test,
  TestResult,
  AnalyticsSummary,
} from '@/types/teacher'

// ─── Reference data ──────────────────────────────────────────────────────────

export const MOCK_TEACHER: Teacher = {
  id: 'teacher-1',
  firstName: 'Anna',
  lastName: 'Kowalska',
  email: 'a.kowalska@sp47.edu.pl',
  school: 'Szkoła Podstawowa nr 47 w Krakowie',
  schoolType: 'SP',
  bio: 'Nauczyciel matematyki i informatyki z 12-letnim doświadczeniem. Pasjonat nowoczesnych metod nauczania.',
  subjects: [
    { id: 'sub-1', name: 'Matematyka' },
    { id: 'sub-2', name: 'Informatyka' },
  ],
}

export const MOCK_SUBJECTS: Subject[] = [
  { id: 'sub-1', name: 'Matematyka' },
  { id: 'sub-2', name: 'Informatyka' },
  { id: 'sub-3', name: 'Fizyka' },
]

export const MOCK_CLASSES: SchoolClass[] = [
  { id: 'cls-1', name: '6A', grade: 6, schoolType: 'SP', subjectId: 'sub-1', subjectName: 'Matematyka', schoolYear: '2024/2025' },
  { id: 'cls-2', name: '7B', grade: 7, schoolType: 'SP', subjectId: 'sub-1', subjectName: 'Matematyka', schoolYear: '2024/2025' },
  { id: 'cls-3', name: '8C', grade: 8, schoolType: 'SP', subjectId: 'sub-1', subjectName: 'Matematyka', schoolYear: '2024/2025' },
  { id: 'cls-4', name: '7B', grade: 7, schoolType: 'SP', subjectId: 'sub-2', subjectName: 'Informatyka', schoolYear: '2024/2025' },
  { id: 'cls-5', name: '8C', grade: 8, schoolType: 'SP', subjectId: 'sub-2', subjectName: 'Informatyka', schoolYear: '2024/2025' },
]

// ─── Lessons ─────────────────────────────────────────────────────────────────

export const MOCK_LESSONS: Lesson[] = [
  {
    id: 'les-1',
    title: 'Równania liniowe z jedną niewiadomą',
    classId: 'cls-2',
    className: '7B',
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    date: '2025-03-18',
    time: '08:00',
    durationMinutes: 45,
    hasRecording: true,
    hasNotes: true,
    recordingUrl: '/mock-audio/les-1.mp3',
    status: 'completed',
    topicId: 'top-3',
    topicTitle: 'Równania liniowe',
  },
  {
    id: 'les-2',
    title: 'Algorytmy sortowania – bąbelkowe i przez wybór',
    classId: 'cls-4',
    className: '7B',
    subjectId: 'sub-2',
    subjectName: 'Informatyka',
    date: '2025-03-18',
    time: '10:00',
    durationMinutes: 45,
    hasRecording: false,
    hasNotes: false,
    status: 'scheduled',
    topicId: 'top-8',
    topicTitle: 'Sortowanie',
  },
  {
    id: 'les-3',
    title: 'Twierdzenie Pitagorasa – zastosowania',
    classId: 'cls-3',
    className: '8C',
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    date: '2025-03-17',
    time: '09:00',
    durationMinutes: 45,
    hasRecording: true,
    hasNotes: true,
    status: 'completed',
    topicId: 'top-5',
    topicTitle: 'Twierdzenie Pitagorasa',
  },
  {
    id: 'les-4',
    title: 'Układy równań – metoda podstawiania',
    classId: 'cls-2',
    className: '7B',
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    date: '2025-03-16',
    time: '08:00',
    durationMinutes: 45,
    hasRecording: true,
    hasNotes: false,
    status: 'recorded',
    topicId: 'top-4',
    topicTitle: 'Układy równań',
  },
  {
    id: 'les-5',
    title: 'Bazy danych – podstawy SQL',
    classId: 'cls-5',
    className: '8C',
    subjectId: 'sub-2',
    subjectName: 'Informatyka',
    date: '2025-03-15',
    time: '11:00',
    durationMinutes: 45,
    hasRecording: true,
    hasNotes: true,
    status: 'completed',
    topicId: 'top-9',
    topicTitle: 'Bazy danych',
  },
  {
    id: 'les-6',
    title: 'Procenty – obliczenia praktyczne',
    classId: 'cls-1',
    className: '6A',
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    date: '2025-03-14',
    time: '08:00',
    durationMinutes: 45,
    hasRecording: true,
    hasNotes: true,
    status: 'completed',
    topicId: 'top-1',
    topicTitle: 'Procenty',
  },
  {
    id: 'les-7',
    title: 'Potęgi i pierwiastki',
    classId: 'cls-1',
    className: '6A',
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    date: '2025-03-19',
    time: '08:00',
    durationMinutes: 45,
    hasRecording: false,
    hasNotes: false,
    status: 'scheduled',
    topicId: 'top-2',
    topicTitle: 'Potęgi i pierwiastki',
  },
  {
    id: 'les-8',
    title: 'Zmienne i typy danych w Pythonie',
    classId: 'cls-4',
    className: '7B',
    subjectId: 'sub-2',
    subjectName: 'Informatyka',
    date: '2025-03-19',
    time: '12:00',
    durationMinutes: 45,
    hasRecording: false,
    hasNotes: false,
    status: 'scheduled',
    topicId: 'top-7',
    topicTitle: 'Python – podstawy',
  },
]

// ─── Notes ───────────────────────────────────────────────────────────────────

export const MOCK_NOTES: LessonNote[] = [
  {
    id: 'note-1',
    lessonId: 'les-1',
    title: 'Równania liniowe z jedną niewiadomą',
    summary: 'Na lekcji omówiliśmy metody rozwiązywania równań liniowych. Uczniowie nauczyli się przenosić wyrazy na jedną stronę, upraszczać i wyznaczać wartość niewiadomej. Ćwiczyliśmy na przykładach z życia codziennego.',
    concepts: ['równanie liniowe', 'niewiadoma', 'przenoszenie wyrazów', 'sprawdzenie', 'równanie sprzeczne'],
    outline: [
      {
        id: 'ob-1',
        heading: 'Definicja równania liniowego',
        content: 'Równanie postaci ax + b = 0, gdzie a ≠ 0.',
        audioTimestamp: 60,
      },
      {
        id: 'ob-2',
        heading: 'Metoda rozwiązywania',
        content: 'Przenosimy wyrazy z x na lewą stronę, pozostałe na prawą. Dzielimy obie strony przez współczynnik przy x.',
        audioTimestamp: 300,
      },
      {
        id: 'ob-3',
        heading: 'Przykłady i ćwiczenia',
        content: '3x + 5 = 14, 2x − 3 = x + 7, sprawdzanie poprawności wyników.',
        audioTimestamp: 900,
      },
    ],
    classId: 'cls-2',
    className: '7B',
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    date: '2025-03-18',
    status: 'published',
    hasAudio: true,
    isPublic: false,
    shareLevel: 'my-classes',
    shareScope: ['notes'],
    publishedToClasses: ['cls-2'],
  },
  {
    id: 'note-2',
    lessonId: 'les-3',
    title: 'Twierdzenie Pitagorasa – zastosowania',
    summary: 'Lekcja poświęcona praktycznym zastosowaniom twierdzenia Pitagorasa. Rozwiązywaliśmy zadania z geometrii płaskiej, obliczaliśmy długości przekątnych i odległości punktów.',
    concepts: ['twierdzenie Pitagorasa', 'trójkąt prostokątny', 'przeciwprostokątna', 'przyprostokątna', 'pierwiastek kwadratowy'],
    outline: [
      {
        id: 'ob-4',
        heading: 'Powtórzenie twierdzenia',
        content: 'W trójkącie prostokątnym: a² + b² = c², gdzie c to przeciwprostokątna.',
        audioTimestamp: 45,
      },
      {
        id: 'ob-5',
        heading: 'Zastosowania praktyczne',
        content: 'Obliczanie przekątnej prostokąta, odległości punktów na płaszczyźnie, wysokości drzewa.',
        audioTimestamp: 420,
      },
    ],
    classId: 'cls-3',
    className: '8C',
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    date: '2025-03-17',
    status: 'published',
    hasAudio: true,
    isPublic: true,
    shareLevel: 'school',
    shareScope: ['notes', 'audio'],
    publishedToClasses: ['cls-3'],
  },
  {
    id: 'note-3',
    lessonId: 'les-5',
    title: 'Bazy danych – podstawy SQL',
    summary: 'Wprowadzenie do relacyjnych baz danych. Omówiliśmy strukturę tabel, podstawowe polecenia SQL: SELECT, INSERT, UPDATE, DELETE. Ćwiczenia na przykładowej bazie danych szkoły.',
    concepts: ['baza danych', 'tabela', 'rekord', 'pole', 'SQL', 'SELECT', 'WHERE', 'klucz główny'],
    outline: [
      {
        id: 'ob-6',
        heading: 'Co to jest baza danych?',
        content: 'Zorganizowany zbiór danych przechowywanych elektronicznie. Typy: relacyjne, dokumentowe, grafowe.',
        audioTimestamp: 30,
      },
      {
        id: 'ob-7',
        heading: 'Podstawy SQL',
        content: 'SELECT * FROM tabela; SELECT kolumna FROM tabela WHERE warunek;',
        audioTimestamp: 600,
      },
    ],
    classId: 'cls-5',
    className: '8C',
    subjectId: 'sub-2',
    subjectName: 'Informatyka',
    date: '2025-03-15',
    status: 'published',
    hasAudio: true,
    isPublic: false,
    shareLevel: 'my-classes',
    shareScope: ['notes'],
    publishedToClasses: ['cls-5'],
  },
  {
    id: 'note-4',
    lessonId: 'les-6',
    title: 'Procenty – obliczenia praktyczne',
    summary: 'Rozwiązywanie zadań procentowych z życia codziennego: rabaty, podatki, odsetki bankowe, skala procentowa na wykresach.',
    concepts: ['procent', 'promil', 'rabat', 'podatek', 'odsetki', 'skala procentowa'],
    outline: [
      {
        id: 'ob-8',
        heading: 'Definicja procentu',
        content: '1% = 1/100 całości. Zamiana ułamka zwykłego na procent i odwrotnie.',
        audioTimestamp: 60,
      },
    ],
    classId: 'cls-1',
    className: '6A',
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    date: '2025-03-14',
    status: 'draft',
    hasAudio: true,
    isPublic: false,
    shareLevel: 'my-classes',
    shareScope: ['notes'],
    publishedToClasses: [],
  },
]

// ─── Topics ──────────────────────────────────────────────────────────────────

export const MOCK_TOPICS: Topic[] = [
  { id: 'top-1', subjectId: 'sub-1', subjectName: 'Matematyka', title: 'Procenty i promile', grade: 6, orderIndex: 1 },
  { id: 'top-2', subjectId: 'sub-1', subjectName: 'Matematyka', title: 'Potęgi i pierwiastki', grade: 6, orderIndex: 2 },
  { id: 'top-3', subjectId: 'sub-1', subjectName: 'Matematyka', title: 'Równania liniowe', grade: 7, orderIndex: 1 },
  { id: 'top-4', subjectId: 'sub-1', subjectName: 'Matematyka', title: 'Układy równań', grade: 7, orderIndex: 2 },
  { id: 'top-5', subjectId: 'sub-1', subjectName: 'Matematyka', title: 'Twierdzenie Pitagorasa', grade: 8, orderIndex: 1 },
  { id: 'top-6', subjectId: 'sub-1', subjectName: 'Matematyka', title: 'Funkcja liniowa', grade: 8, orderIndex: 2 },
  { id: 'top-7', subjectId: 'sub-2', subjectName: 'Informatyka', title: 'Python – podstawy', grade: 7, orderIndex: 1 },
  { id: 'top-8', subjectId: 'sub-2', subjectName: 'Informatyka', title: 'Sortowanie', grade: 7, orderIndex: 2 },
  { id: 'top-9', subjectId: 'sub-2', subjectName: 'Informatyka', title: 'Bazy danych', grade: 8, orderIndex: 1 },
  { id: 'top-10', subjectId: 'sub-2', subjectName: 'Informatyka', title: 'Sieci komputerowe', grade: 8, orderIndex: 2 },
]

export const MOCK_TOPIC_PROGRESS: TopicProgress[] = [
  { topicId: 'top-1', classId: 'cls-1', completed: true, sourceType: 'own', sourceLessonId: 'les-6', shareNotes: true, shareAudio: false },
  { topicId: 'top-2', classId: 'cls-1', completed: false, shareNotes: false, shareAudio: false },
  { topicId: 'top-3', classId: 'cls-2', completed: true, sourceType: 'own', sourceLessonId: 'les-1', shareNotes: true, shareAudio: false },
  { topicId: 'top-4', classId: 'cls-2', completed: true, sourceType: 'own', sourceLessonId: 'les-4', shareNotes: false, shareAudio: false },
  { topicId: 'top-5', classId: 'cls-3', completed: true, sourceType: 'own', sourceLessonId: 'les-3', shareNotes: true, shareAudio: true },
  { topicId: 'top-6', classId: 'cls-3', completed: false, shareNotes: false, shareAudio: false },
  { topicId: 'top-7', classId: 'cls-4', completed: false, shareNotes: false, shareAudio: false },
  { topicId: 'top-8', classId: 'cls-4', completed: false, shareNotes: false, shareAudio: false },
  { topicId: 'top-9', classId: 'cls-5', completed: true, sourceType: 'own', sourceLessonId: 'les-5', shareNotes: true, shareAudio: true },
  { topicId: 'top-10', classId: 'cls-5', completed: false, shareNotes: false, shareAudio: false },
  // Borrowed – cls-3 uses cls-2 notes for top-3
  { topicId: 'top-3', classId: 'cls-3', completed: true, sourceType: 'borrowed', sourceLessonId: 'les-1', shareNotes: true, shareAudio: false },
]

// ─── Tests ───────────────────────────────────────────────────────────────────

export const MOCK_TESTS: Test[] = [
  {
    id: 'test-1',
    title: 'Kartkówka – Równania liniowe',
    classIds: ['cls-2'],
    classNames: ['7B'],
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    scheduledAt: '2025-03-20T10:00:00',
    durationMinutes: 20,
    status: 'published',
    maxScore: 20,
    averageScore: 14.5,
    questions: [
      {
        id: 'q-1',
        type: 'single-choice',
        text: 'Rozwiąż równanie: 3x + 6 = 0',
        options: ['x = −2', 'x = 2', 'x = −3', 'x = 3'],
        correctAnswer: 'x = −2',
        points: 4,
      },
      {
        id: 'q-2',
        type: 'open',
        text: 'Rozwiąż równanie: 2x − 5 = x + 3 i sprawdź wynik.',
        points: 6,
      },
      {
        id: 'q-3',
        type: 'true-false',
        text: 'Równanie 2x + 4 = 2(x + 2) ma nieskończenie wiele rozwiązań.',
        correctAnswer: true,
        points: 5,
      },
      {
        id: 'q-4',
        type: 'single-choice',
        text: 'Który zapis opisuje równanie liniowe?',
        options: ['x² + 3 = 0', '2x + 1 = 7', 'x³ = 8', '√x = 4'],
        correctAnswer: '2x + 1 = 7',
        points: 5,
      },
    ],
    lessonIds: ['les-1'],
    topicIds: ['top-3'],
  },
  {
    id: 'test-2',
    title: 'Test – Twierdzenie Pitagorasa',
    classIds: ['cls-3'],
    classNames: ['8C'],
    subjectId: 'sub-1',
    subjectName: 'Matematyka',
    scheduledAt: '2025-03-22T09:00:00',
    durationMinutes: 45,
    status: 'draft',
    maxScore: 30,
    questions: [
      {
        id: 'q-5',
        type: 'open',
        text: 'Oblicz przekątną prostokąta o bokach 6 cm i 8 cm.',
        points: 10,
      },
      {
        id: 'q-6',
        type: 'true-false',
        text: 'Trójkąt o bokach 3, 4, 5 jest prostokątny.',
        correctAnswer: true,
        points: 5,
      },
    ],
    lessonIds: ['les-3'],
    topicIds: ['top-5'],
  },
  {
    id: 'test-3',
    title: 'Sprawdzian – Bazy danych SQL',
    classIds: ['cls-5'],
    classNames: ['8C'],
    subjectId: 'sub-2',
    subjectName: 'Informatyka',
    scheduledAt: '2025-03-25T11:00:00',
    durationMinutes: 45,
    status: 'published',
    maxScore: 40,
    averageScore: 31.2,
    questions: [
      {
        id: 'q-7',
        type: 'single-choice',
        text: 'Które polecenie SQL służy do pobierania danych?',
        options: ['INSERT', 'SELECT', 'DELETE', 'UPDATE'],
        correctAnswer: 'SELECT',
        points: 5,
      },
      {
        id: 'q-8',
        type: 'open',
        text: 'Napisz zapytanie SQL zwracające imię i nazwisko uczniów o ocenie > 4.',
        points: 15,
      },
    ],
    lessonIds: ['les-5'],
    topicIds: ['top-9'],
  },
]

export const MOCK_TEST_RESULTS: TestResult[] = [
  { id: 'tr-1', testId: 'test-1', studentId: 'Uczeń #1', score: 18, maxScore: 20, percentage: 90, answers: {}, submittedAt: '2025-03-20T10:22:00' },
  { id: 'tr-2', testId: 'test-1', studentId: 'Uczeń #2', score: 14, maxScore: 20, percentage: 70, answers: {}, submittedAt: '2025-03-20T10:19:00' },
  { id: 'tr-3', testId: 'test-1', studentId: 'Uczeń #3', score: 10, maxScore: 20, percentage: 50, answers: {}, submittedAt: '2025-03-20T10:20:00' },
  { id: 'tr-4', testId: 'test-1', studentId: 'Uczeń #4', score: 16, maxScore: 20, percentage: 80, answers: {}, submittedAt: '2025-03-20T10:18:00' },
  { id: 'tr-5', testId: 'test-1', studentId: 'Uczeń #5', score: 15, maxScore: 20, percentage: 75, answers: {}, submittedAt: '2025-03-20T10:21:00' },
  { id: 'tr-6', testId: 'test-1', studentId: 'Uczeń #6', score: 12, maxScore: 20, percentage: 60, answers: {}, submittedAt: '2025-03-20T10:17:00' },
  { id: 'tr-7', testId: 'test-3', studentId: 'Uczeń #1', score: 35, maxScore: 40, percentage: 87, answers: {}, submittedAt: '2025-03-25T11:43:00' },
  { id: 'tr-8', testId: 'test-3', studentId: 'Uczeń #2', score: 28, maxScore: 40, percentage: 70, answers: {}, submittedAt: '2025-03-25T11:40:00' },
  { id: 'tr-9', testId: 'test-3', studentId: 'Uczeń #3', score: 31, maxScore: 40, percentage: 77, answers: {}, submittedAt: '2025-03-25T11:44:00' },
]

// ─── Analytics ───────────────────────────────────────────────────────────────

export const MOCK_ANALYTICS: AnalyticsSummary = {
  recordedLessonsLast30Days: 12,
  publishedNotesLast30Days: 9,
  avgTestsPerClass: 2.4,
  totalLessons: 87,
  totalNotes: 63,
  totalTests: 18,
  difficultTopics: [
    { topicId: 'top-4', topicTitle: 'Układy równań', subjectName: 'Matematyka', avgScore: 52 },
    { topicId: 'top-10', topicTitle: 'Sieci komputerowe', subjectName: 'Informatyka', avgScore: 58 },
    { topicId: 'top-6', topicTitle: 'Funkcja liniowa', subjectName: 'Matematyka', avgScore: 61 },
  ],
  lessonsPerMonth: [
    { month: 'Paź', count: 18 },
    { month: 'Lis', count: 21 },
    { month: 'Gru', count: 12 },
    { month: 'Sty', count: 19 },
    { month: 'Lut', count: 17 },
    { month: 'Mar', count: 12 },
  ],
  testScoresByClass: [
    { className: '6A', avgScore: 72 },
    { className: '7B', avgScore: 68 },
    { className: '8C', avgScore: 79 },
  ],
}

// ─── Mock API helpers (simulate async fetch) ──────────────────────────────────

const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms))

export const api = {
  getTeacher: async () => { await delay(); return MOCK_TEACHER },
  getClasses: async () => { await delay(); return MOCK_CLASSES },
  getSubjects: async () => { await delay(); return MOCK_SUBJECTS },

  getLessons: async () => { await delay(); return MOCK_LESSONS },
  getLesson: async (id: string) => { await delay(); return MOCK_LESSONS.find(l => l.id === id) ?? null },
  createLesson: async (data: Partial<Lesson>) => {
    await delay(500)
    return { ...data, id: `les-${Date.now()}`, hasRecording: false, hasNotes: false, status: 'scheduled' as const } as Lesson
  },

  getNotes: async () => { await delay(); return MOCK_NOTES },
  getNote: async (id: string) => { await delay(); return MOCK_NOTES.find(n => n.id === id) ?? null },
  updateNote: async (id: string, data: Partial<LessonNote>) => {
    await delay(400)
    return { ...MOCK_NOTES.find(n => n.id === id), ...data } as LessonNote
  },

  getTopics: async () => { await delay(); return MOCK_TOPICS },
  getTopicProgress: async () => { await delay(); return MOCK_TOPIC_PROGRESS },
  updateTopicProgress: async (data: TopicProgress) => { await delay(200); return data },

  getTests: async () => { await delay(); return MOCK_TESTS },
  getTest: async (id: string) => { await delay(); return MOCK_TESTS.find(t => t.id === id) ?? null },
  getTestResults: async (testId: string) => { await delay(); return MOCK_TEST_RESULTS.filter(r => r.testId === testId) },
  createTest: async (data: Partial<Test>) => {
    await delay(500)
    return { ...data, id: `test-${Date.now()}`, status: 'draft' as const, maxScore: 0, questions: [] } as Test
  },

  getAnalytics: async () => { await delay(); return MOCK_ANALYTICS },
}
