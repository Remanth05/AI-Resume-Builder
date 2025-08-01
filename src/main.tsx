import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import { DemoAuthProvider } from './components/DemoAuthProvider.tsx'
import './index.css'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if Clerk key is valid (not empty, not placeholder, and starts with pk_)
const isValidClerkKey = clerkPubKey &&
  clerkPubKey !== 'pk_test_your_clerk_publishable_key_here' &&
  clerkPubKey !== 'pk_test_demo_key_for_development_bypass' &&
  clerkPubKey.startsWith('pk_')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {isValidClerkKey ? (
        <ClerkProvider publishableKey={clerkPubKey}>
          <App />
        </ClerkProvider>
      ) : (
        <DemoAuthProvider>
          <App />
        </DemoAuthProvider>
      )}
    </BrowserRouter>
  </React.StrictMode>,
)
