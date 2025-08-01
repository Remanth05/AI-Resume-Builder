import React from 'react'

// Check if we're using demo mode
const isUsingDemo = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_demo_key_for_development_bypass'

// Conditional auth components
export function AuthSignedIn({ children }: { children: React.ReactNode }) {
  if (isUsingDemo) {
    const { DemoSignedIn, useDemoAuth } = require('./DemoAuthProvider')
    const { isSignedIn } = useDemoAuth()
    return isSignedIn ? <>{children}</> : null
  } else {
    const { SignedIn } = require('@clerk/clerk-react')
    return <SignedIn>{children}</SignedIn>
  }
}

export function AuthSignedOut({ children }: { children: React.ReactNode }) {
  if (isUsingDemo) {
    const { DemoSignedOut, useDemoAuth } = require('./DemoAuthProvider')
    const { isSignedIn } = useDemoAuth()
    return !isSignedIn ? <>{children}</> : null
  } else {
    const { SignedOut } = require('@clerk/clerk-react')
    return <SignedOut>{children}</SignedOut>
  }
}

export function AuthSignInButton({ children, mode = 'modal' }: { children: React.ReactNode, mode?: string }) {
  if (isUsingDemo) {
    const { useDemoAuth } = require('./DemoAuthProvider')
    const { signIn } = useDemoAuth()
    
    return (
      <button onClick={signIn} className="inline-flex items-center">
        {children}
      </button>
    )
  } else {
    const { SignInButton } = require('@clerk/clerk-react')
    return <SignInButton mode={mode}>{children}</SignInButton>
  }
}

export function AuthUserButton({ afterSignOutUrl }: { afterSignOutUrl?: string }) {
  if (isUsingDemo) {
    const { DemoUserButton } = require('./DemoAuthProvider')
    return <DemoUserButton />
  } else {
    const { UserButton } = require('@clerk/clerk-react')
    return <UserButton afterSignOutUrl={afterSignOutUrl} />
  }
}
