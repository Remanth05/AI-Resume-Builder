import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Check if we're using demo mode
const isUsingDemo = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_demo_key_for_development_bypass'

export default function SignOutHandler() {
  const navigate = useNavigate()
  const location = useLocation()

  // Only import demo auth if we're in demo mode
  let isSignedIn = true
  if (isUsingDemo) {
    try {
      // Dynamic import to avoid issues when not in demo mode
      const { useDemoAuth } = require('./DemoAuthProvider')
      const demoAuth = useDemoAuth()
      isSignedIn = demoAuth.isSignedIn
    } catch (error) {
      console.log('Demo auth not available')
      return null
    }
  }

  useEffect(() => {
    // Only handle redirects in demo mode
    if (isUsingDemo && !isSignedIn && location.pathname !== '/' && location.pathname !== '/sign-in') {
      console.log('Redirecting from protected route:', location.pathname)
      navigate('/', { replace: true })
    }
  }, [isSignedIn, location.pathname, navigate])

  return null // This component doesn't render anything
}
