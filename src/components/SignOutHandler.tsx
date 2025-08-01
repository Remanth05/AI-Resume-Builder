import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDemoAuth } from './DemoAuthProvider'

export default function SignOutHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isSignedIn } = useDemoAuth()

  useEffect(() => {
    // If user is signed out and on a protected route, redirect to home
    if (!isSignedIn && location.pathname !== '/' && location.pathname !== '/sign-in') {
      navigate('/', { replace: true })
    }
  }, [isSignedIn, location.pathname, navigate])

  return null // This component doesn't render anything
}
