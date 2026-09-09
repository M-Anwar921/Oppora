import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import InboxPage from './pages/InboxPage'
import AnalyzingPage from './pages/AnalyzingPage'
import ResultsPage from './pages/ResultsPage'
import OpportunityDetailsPage from './pages/OpportunityDetailsPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/analyzing" element={<AnalyzingPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/opportunity/:id" element={<OpportunityDetailsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
