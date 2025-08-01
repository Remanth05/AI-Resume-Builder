import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'

// Check if we're using demo mode
const isUsingDemo = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_demo_key_for_development_bypass'

// Conditionally import auth components
let AuthSignedIn: React.ComponentType<{ children: React.ReactNode }>
let AuthSignedOut: React.ComponentType<{ children: React.ReactNode }>

if (isUsingDemo) {
  const { DemoSignedIn, DemoSignedOut } = await import('./components/DemoAuthProvider')
  AuthSignedIn = DemoSignedIn
  AuthSignedOut = DemoSignedOut
} else {
  const { SignedIn, SignedOut } = await import('@clerk/clerk-react')
  AuthSignedIn = SignedIn
  AuthSignedOut = SignedOut
}

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
