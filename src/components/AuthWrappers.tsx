import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { DemoSignedIn, DemoSignedOut, DemoUserButton, useDemoAuth } from './DemoAuthProvider'

// Check if we're using demo mode
const isUsingDemo = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_demo_key_for_development_bypass'

// Conditional auth components
export function AuthSignedIn({ children }: { children: React.ReactNode }) {
  if (isUsingDemo) {
    const { isSignedIn } = useDemoAuth()
    return isSignedIn ? <>{children}</> : null
  } else {
    return <SignedIn>{children}</SignedIn>
  }
}

export function AuthSignedOut({ children }: { children: React.ReactNode }) {
  if (isUsingDemo) {
    const { isSignedIn } = useDemoAuth()
    return !isSignedIn ? <>{children}</> : null
  } else {
    return <SignedOut>{children}</SignedOut>
  }
}

export function AuthSignInButton({ children, mode = 'modal' }: { children: React.ReactNode, mode?: string }) {
  if (isUsingDemo) {
    const { signIn } = useDemoAuth()

    // If children is a button, clone it with onClick handler
    if (React.isValidElement(children) && children.type === 'button') {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: signIn
      })
    }

    return (
      <button onClick={signIn} className="inline-flex items-center">
        {children}
      </button>
    )
  } else {
    return <SignInButton mode={mode}>{children}</SignInButton>
  }
}

export function AuthUserButton({ afterSignOutUrl }: { afterSignOutUrl?: string }) {
  if (isUsingDemo) {
    return <DemoUserButton />
  } else {
    return <UserButton afterSignOutUrl={afterSignOutUrl} />
  }
}

export function useAuthUser() {
  if (isUsingDemo) {
    const { user } = useDemoAuth()
    return { user, isLoaded: true, isSignedIn: !!user }
  } else {
    return useUser()
  }
}
