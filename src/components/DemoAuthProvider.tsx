import * as React from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  firstName: string
  lastName: string
  emailAddresses: Array<{ emailAddress: string }>
  primaryEmailAddress: { emailAddress: string } | null
  imageUrl?: string
}

interface DemoAuthContextType {
  user: User | null
  isSignedIn: boolean
  signIn: () => void
  signOut: () => void
}

const DemoAuthContext = React.createContext<DemoAuthContextType | null>(null)

const demoUser: User = {
  id: 'demo_user_123',
  firstName: 'Demo',
  lastName: 'User',
  emailAddresses: [{ emailAddress: 'demo@example.com' }],
  primaryEmailAddress: { emailAddress: 'demo@example.com' },
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
}

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(demoUser)
  const [isSignedIn, setIsSignedIn] = React.useState(true)

  const signIn = () => {
    setUser(demoUser)
    setIsSignedIn(true)
  }

  const signOut = () => {
    console.log('Sign out started')
    setUser(null)
    setIsSignedIn(false)
    console.log('Sign out completed - state updated')
  }

  return (
    <DemoAuthContext.Provider value={{ user, isSignedIn, signIn, signOut }}>
      {children}
    </DemoAuthContext.Provider>
  )
}

export function useDemoAuth() {
  const context = React.useContext(DemoAuthContext)
  if (!context) {
    throw new Error('useDemoAuth must be used within DemoAuthProvider')
  }
  return context
}

// Demo wrapper components that mimic Clerk's API
export function DemoSignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useDemoAuth()
  return isSignedIn ? <>{children}</> : null
}

export function DemoSignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useDemoAuth()
  return !isSignedIn ? <>{children}</> : null
}

export function DemoSignInButton({ children, mode = 'modal' }: { children: React.ReactNode, mode?: string }) {
  const { signIn } = useDemoAuth()
  
  return (
    <button onClick={signIn} className="inline-flex items-center">
      {children}
    </button>
  )
}

export function DemoUserButton() {
  const { user, signOut } = useDemoAuth()
  const [showDropdown, setShowDropdown] = React.useState(false)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.demo-user-button')) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDropdown])

  if (!user) return null
  
  return (
    <div className="relative demo-user-button">
      <button
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <img
          src={user.imageUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium text-gray-700">
          {user.firstName} {user.lastName}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[9999] border border-gray-200">
          <div className="px-4 py-2 text-sm text-gray-700 border-b">
            <div className="font-medium">{user.firstName} {user.lastName}</div>
            <div className="text-gray-500">{user.primaryEmailAddress?.emailAddress}</div>
          </div>
          <button
            onClick={() => {
              signOut()
              setShowDropdown(false)
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
