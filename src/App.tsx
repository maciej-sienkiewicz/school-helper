import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TeacherLayout from '@/features/teacher/layout/TeacherLayout'
import DashboardPage from '@/features/teacher/dashboard/DashboardPage'
import LessonsPage from '@/features/teacher/lessons/LessonsPage'
import RecordingPage from '@/features/teacher/recording/RecordingPage'
import NotesPage from '@/features/teacher/notes/NotesPage'
import NoteEditorPage from '@/features/teacher/notes/NoteEditorPage'
import TopicsPage from '@/features/teacher/topics/TopicsPage'
import TestsPage from '@/features/teacher/tests/TestsPage'
import TestCreatorPage from '@/features/teacher/tests/TestCreatorPage'
import TestResultsPage from '@/features/teacher/tests/TestResultsPage'
import AnalyticsPage from '@/features/teacher/analytics/AnalyticsPage'
import ProfilePage from '@/features/teacher/profile/ProfilePage'
import StudentLayout from '@/features/student/layout/StudentLayout'
import StudentDashboardPage from '@/features/student/dashboard/StudentDashboardPage'
import SubjectPage from '@/features/student/subject/SubjectPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="lessons" element={<LessonsPage />} />
          <Route path="lessons/new" element={<RecordingPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="notes/:id/edit" element={<NoteEditorPage />} />
          <Route path="topics" element={<TopicsPage />} />
          <Route path="tests" element={<TestsPage />} />
          <Route path="tests/new" element={<TestCreatorPage />} />
          <Route path="tests/:id/results" element={<TestResultsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<StudentDashboardPage />} />
          <Route path="subject/:subjectName" element={<SubjectPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/teacher/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
