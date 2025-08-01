// Check if we're using demo mode
const isUsingDemo = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_demo_key_for_development_bypass'

export default function AuthDebug() {
  let user = null
  let isSignedIn = false

  if (isUsingDemo) {
    try {
      const { useDemoAuth } = require('./DemoAuthProvider')
      const demoAuth = useDemoAuth()
      user = demoAuth.user
      isSignedIn = demoAuth.isSignedIn
    } catch (error) {
      console.log('Demo auth not available in debug')
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs opacity-75 z-50">
      <div>Mode: {isUsingDemo ? 'Demo' : 'Clerk'}</div>
      <div>Signed In: {isSignedIn ? 'Yes' : 'No'}</div>
      <div>User: {user?.firstName || 'None'}</div>
      <div>Path: {window.location.pathname}</div>
    </div>
  )
}
