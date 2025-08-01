import { useDemoAuth } from './DemoAuthProvider'

export default function AuthDebug() {
  const { user, isSignedIn } = useDemoAuth()
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs opacity-75">
      <div>Signed In: {isSignedIn ? 'Yes' : 'No'}</div>
      <div>User: {user?.firstName || 'None'}</div>
      <div>Path: {window.location.pathname}</div>
    </div>
  )
}
