import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />
        <Route
          path="/resume/:id?"
          element={
            <SignedIn>
              <ResumeBuilder />
            </SignedIn>
          }
        />
        <Route
          path="/profile"
          element={
            <SignedIn>
              <Profile />
            </SignedIn>
          }
        />
        {/* Redirect any other routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
