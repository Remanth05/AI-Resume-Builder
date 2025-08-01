import express from 'express'
import { ClerkExpressWithAuth } from '@clerk/backend'

const router = express.Router()

// Verify authentication status
router.get('/verify', ClerkExpressWithAuth(), (req, res) => {
  try {
    const { userId } = req.auth
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    res.json({ 
      authenticated: true, 
      userId,
      message: 'Authentication verified'
    })
  } catch (error) {
    console.error('Auth verification error:', error)
    res.status(500).json({ error: 'Authentication verification failed' })
  }
})

// Get user profile from Clerk
router.get('/profile', ClerkExpressWithAuth(), async (req, res) => {
  try {
    const { userId } = req.auth
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // In a real implementation, you might want to fetch additional user data
    // from your database or from Clerk's API
    res.json({ 
      userId,
      message: 'Profile data would be returned here'
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

export default router
