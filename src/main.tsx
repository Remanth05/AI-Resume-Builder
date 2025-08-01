import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import ClerkSetup from './components/ClerkSetup.tsx'
import './index.css'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if Clerk key is valid (not empty, not placeholder, and starts with pk_)
const isValidClerkKey = clerkPubKey &&
  clerkPubKey !== 'pk_test_your_clerk_publishable_key_here' &&
  clerkPubKey.startsWith('pk_')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isValidClerkKey ? (
      <ClerkProvider publishableKey={clerkPubKey}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <ClerkSetup />
    )}
  </React.StrictMode>,
)
