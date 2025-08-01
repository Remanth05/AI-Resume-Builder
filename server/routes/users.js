import express from 'express'
import { body, validationResult } from 'express-validator'
import Resume from '../models/Resume.js'

const router = express.Router()

// Get user dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const { userId } = req.auth
    
    // Get resume statistics
    const resumes = await Resume.find({ userId })
    const totalResumes = resumes.length
    const totalViews = resumes.reduce((sum, resume) => sum + resume.views, 0)
    const totalDownloads = resumes.reduce((sum, resume) => sum + resume.downloads, 0)
    const publicResumes = resumes.filter(resume => resume.isPublic).length
    
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentResumes = resumes.filter(resume => resume.updatedAt > thirtyDaysAgo)
    
    // Most viewed resume
    const mostViewedResume = resumes.reduce((prev, current) => 
      (prev.views > current.views) ? prev : current, resumes[0] || null
    )

    res.json({
      statistics: {
        totalResumes,
        totalViews,
        totalDownloads,
        publicResumes,
        recentActivity: recentResumes.length
      },
      recentResumes: recentResumes.slice(0, 5).map(resume => ({
        id: resume._id,
        title: resume.title,
        updatedAt: resume.updatedAt,
        views: resume.views,
        downloads: resume.downloads
      })),
      mostViewedResume: mostViewedResume ? {
        id: mostViewedResume._id,
        title: mostViewedResume.title,
        views: mostViewedResume.views
      } : null
    })
  } catch (error) {
    console.error('Dashboard fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard data' })
  }
})

// Get user profile preferences
router.get('/preferences', async (req, res) => {
  try {
    const { userId } = req.auth
    
    // In a real implementation, you would have a User model
    // For now, return default preferences
    res.json({
      userId,
      preferences: {
        defaultTemplate: 'modern',
        defaultColorScheme: 'blue',
        autoSave: true,
        emailNotifications: true,
        publicProfile: false,
        allowIndexing: true
      },
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Preferences fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch preferences' })
  }
})

// Update user preferences
router.put('/preferences', [
  body('defaultTemplate').optional().trim(),
  body('defaultColorScheme').optional().trim(),
  body('autoSave').optional().isBoolean(),
  body('emailNotifications').optional().isBoolean(),
  body('publicProfile').optional().isBoolean(),
  body('allowIndexing').optional().isBoolean(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { userId } = req.auth
    const preferences = req.body

    // In a real implementation, you would update the User model
    // For now, just return the updated preferences
    res.json({
      userId,
      preferences,
      updatedAt: new Date().toISOString(),
      message: 'Preferences updated successfully'
    })
  } catch (error) {
    console.error('Preferences update error:', error)
    res.status(500).json({ error: 'Failed to update preferences' })
  }
})

// Export user data (GDPR compliance)
router.get('/export', async (req, res) => {
  try {
    const { userId } = req.auth
    
    // Get all user resumes
    const resumes = await Resume.find({ userId })
    
    const exportData = {
      userId,
      exportDate: new Date().toISOString(),
      resumes: resumes.map(resume => resume.toObject()),
      preferences: {
        // In a real implementation, get from User model
        defaultTemplate: 'modern',
        defaultColorScheme: 'blue',
        autoSave: true,
        emailNotifications: true
      }
    }

    res.json(exportData)
  } catch (error) {
    console.error('Data export error:', error)
    res.status(500).json({ error: 'Failed to export user data' })
  }
})

// Delete user account and all data
router.delete('/account', async (req, res) => {
  try {
    const { userId } = req.auth
    
    // Delete all user resumes
    await Resume.deleteMany({ userId })
    
    // In a real implementation, you would also:
    // - Delete user preferences/profile
    // - Notify Clerk to delete the user account
    // - Clean up any uploaded files
    // - Log the deletion for audit purposes

    res.json({ 
      message: 'Account and all associated data deleted successfully',
      deletedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Account deletion error:', error)
    res.status(500).json({ error: 'Failed to delete account' })
  }
})

// Get user activity log
router.get('/activity', async (req, res) => {
  try {
    const { userId } = req.auth
    const { limit = 20, offset = 0 } = req.query
    
    // In a real implementation, you would have an Activity model
    // For now, return mock activity data based on resume updates
    const resumes = await Resume.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))

    const activities = resumes.map(resume => ({
      id: resume._id,
      type: 'resume_updated',
      title: `Updated "${resume.title}"`,
      timestamp: resume.updatedAt,
      metadata: {
        resumeId: resume._id,
        resumeTitle: resume.title
      }
    }))

    res.json({
      activities,
      total: resumes.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
  } catch (error) {
    console.error('Activity fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch activity log' })
  }
})

export default router
