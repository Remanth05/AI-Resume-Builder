import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import { AuthSignedIn } from './components/AuthWrappers'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <AuthSignedIn>
              <Dashboard />
            </AuthSignedIn>
          }
        />
        <Route
          path="/resume/:id?"
          element={
            <AuthSignedIn>
              <ResumeBuilder />
            </AuthSignedIn>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthSignedIn>
              <Profile />
            </AuthSignedIn>
          }
        />
        {/* Redirect any other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
