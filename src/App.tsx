import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { DemoSignedIn, DemoSignedOut } from './components/DemoAuthProvider'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

// Check if we're using demo mode
const isUsingDemo = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_demo_key_for_development_bypass'

// Choose the appropriate components based on the mode
const AuthSignedIn = isUsingDemo ? DemoSignedIn : SignedIn
const AuthSignedOut = isUsingDemo ? DemoSignedOut : SignedOut

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
