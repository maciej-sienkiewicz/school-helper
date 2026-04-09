export interface StudentProfile {
  id: string
  firstName: string
  lastName: string
  className: string
  schoolName: string
}

export interface StudentSubjectInfo {
  subjectId: string
  subjectName: string
  classId: string
  className: string
  schoolName: string
  avgGrade: number
}

export interface StudentHomework {
  id: string
  title: string
  description?: string
  dueDate: string
  subjectId: string
  completed: boolean
}

export interface StudentGrade {
  id: string
  value: number
  weight: number
  description: string
  date: string
  subjectId: string
}

export interface StudentUpcomingTest {
  id: string
  title: string
  scheduledAt: string
  durationMinutes: number
  topicTitles: string[]
  subjectId: string
}

export interface StudentNote {
  id: string
  title: string
  date: string
  hasAudio: boolean
  topicTitle?: string
  subjectId: string
}

export interface StudentTopic {
  id: string
  title: string
  status: 'completed' | 'current' | 'upcoming'
  subjectId: string
}
