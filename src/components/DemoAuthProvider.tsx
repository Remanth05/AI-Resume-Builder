import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  firstName: string
  lastName: string
  emailAddress: string
  imageUrl?: string
}

interface DemoAuthContextType {
  user: User | null
  isSignedIn: boolean
  signIn: () => void
  signOut: () => void
}

const DemoAuthContext = createContext<DemoAuthContextType | null>(null)

const demoUser: User = {
  id: 'demo_user_123',
  firstName: 'Demo',
  lastName: 'User',
  emailAddress: 'demo@example.com',
  imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
}

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(demoUser)
  const [isSignedIn, setIsSignedIn] = useState(true)

  const signIn = () => {
    setUser(demoUser)
    setIsSignedIn(true)
  }

  const signOut = () => {
    setUser(null)
    setIsSignedIn(false)
  }

  return (
    <DemoAuthContext.Provider value={{ user, isSignedIn, signIn, signOut }}>
      {children}
    </DemoAuthContext.Provider>
  )
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext)
  if (!context) {
    throw new Error('useDemoAuth must be used within DemoAuthProvider')
  }
  return context
}

// Demo wrapper components that mimic Clerk's API
export function DemoSignedIn({ children }: { children: ReactNode }) {
  const { isSignedIn } = useDemoAuth()
  return isSignedIn ? <>{children}</> : null
}

export function DemoSignedOut({ children }: { children: ReactNode }) {
  const { isSignedIn } = useDemoAuth()
  return !isSignedIn ? <>{children}</> : null
}

export function DemoSignInButton({ children, mode = 'modal' }: { children: ReactNode, mode?: string }) {
  const { signIn } = useDemoAuth()
  
  return (
    <button onClick={signIn} className="inline-flex items-center">
      {children}
    </button>
  )
}

export function DemoUserButton() {
  const { user, signOut } = useDemoAuth()
  
  if (!user) return null
  
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
        <img
          src={user.imageUrl}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm font-medium text-gray-700">
          {user.firstName} {user.lastName}
        </span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="px-4 py-2 text-sm text-gray-700 border-b">
          <div className="font-medium">{user.firstName} {user.lastName}</div>
          <div className="text-gray-500">{user.emailAddress}</div>
        </div>
        <button
          onClick={signOut}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
