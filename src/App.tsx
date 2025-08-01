import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import Navbar from './components/Navbar'
import SignOutHandler from './components/SignOutHandler'
import { AuthSignedIn, AuthSignedOut } from './components/AuthWrappers'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Handle sign-out redirects */}
      <SignOutHandler />

      {/* Show navbar for signed-in users */}
      <AuthSignedIn>
        <Navbar />
      </AuthSignedIn>

      {/* Show simple navbar for signed-out users only on landing page */}
      <AuthSignedOut>
        <Routes>
          <Route path="/" element={<Navbar />} />
        </Routes>
      </AuthSignedOut>
      
      <Routes>
        {/* Landing page - main entry point for all users */}
        <Route path="/" element={<LandingPage />} />
        
        {/* SignIn route - only show when signed out */}
        <Route
          path="/sign-in"
          element={
            <AuthSignedOut>
              <SignIn />
            </AuthSignedOut>
          }
        />
        
        {/* Protected routes - only accessible when signed in */}
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
        
        {/* Redirect any other routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      

    </div>
  )
}

export default App
