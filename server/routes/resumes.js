import express from 'express'
import { body, validationResult } from 'express-validator'
import Resume from '../models/Resume.js'

const router = express.Router()

// Get all resumes for authenticated user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.auth
    const resumes = await Resume.findByUserId(userId)
    res.json(resumes)
  } catch (error) {
    console.error('Fetch resumes error:', error)
    res.status(500).json({ error: 'Failed to fetch resumes' })
  }
})

// Get specific resume by ID
router.get('/:id', async (req, res) => {
  try {
    const { userId } = req.auth
    const { id } = req.params
    
    const resume = await Resume.findOne({ _id: id, userId })
    
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }
    
    res.json(resume)
  } catch (error) {
    console.error('Fetch resume error:', error)
    res.status(500).json({ error: 'Failed to fetch resume' })
  }
})

// Create new resume
router.post('/', [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('jobTitle').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { userId } = req.auth
    const { title, jobTitle, sections } = req.body

    // Default sections if none provided
    const defaultSections = [
      {
        type: 'personal',
        title: 'Personal Information',
        content: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          linkedin: '',
          website: ''
        },
        isVisible: true,
        order: 1
      },
      {
        type: 'summary',
        title: 'Professional Summary',
        content: { text: '' },
        isVisible: true,
        order: 2
      },
      {
        type: 'experience',
        title: 'Work Experience',
        content: { experiences: [] },
        isVisible: true,
        order: 3
      },
      {
        type: 'skills',
        title: 'Skills',
        content: { skills: [] },
        isVisible: true,
        order: 4
      }
    ]

    const resume = new Resume({
      userId,
      title,
      jobTitle: jobTitle || '',
      sections: sections || defaultSections,
    })

    await resume.save()
    res.status(201).json(resume)
  } catch (error) {
    console.error('Create resume error:', error)
    res.status(500).json({ error: 'Failed to create resume' })
  }
})

// Update resume
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1 }),
  body('jobTitle').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { userId } = req.auth
    const { id } = req.params
    const updateData = req.body

    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    res.json(resume)
  } catch (error) {
    console.error('Update resume error:', error)
    res.status(500).json({ error: 'Failed to update resume' })
  }
})

// Delete resume
router.delete('/:id', async (req, res) => {
  try {
    const { userId } = req.auth
    const { id } = req.params

    const resume = await Resume.findOneAndDelete({ _id: id, userId })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    res.json({ message: 'Resume deleted successfully' })
  } catch (error) {
    console.error('Delete resume error:', error)
    res.status(500).json({ error: 'Failed to delete resume' })
  }
})

// Share resume (make public)
router.post('/:id/share', async (req, res) => {
  try {
    const { userId } = req.auth
    const { id } = req.params

    const resume = await Resume.findOne({ _id: id, userId })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    resume.isPublic = true
    await resume.save()

    res.json({ 
      message: 'Resume shared successfully',
      shareUrl: resume.shareUrl 
    })
  } catch (error) {
    console.error('Share resume error:', error)
    res.status(500).json({ error: 'Failed to share resume' })
  }
})

// Get public resume by share URL
router.get('/public/:shareUrl', async (req, res) => {
  try {
    const { shareUrl } = req.params

    const resume = await Resume.findOne({ shareUrl, isPublic: true })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found or not public' })
    }

    await resume.incrementViews()
    res.json(resume.toPublicJSON())
  } catch (error) {
    console.error('Fetch public resume error:', error)
    res.status(500).json({ error: 'Failed to fetch resume' })
  }
})

// Download resume (increment download counter)
router.post('/:id/download', async (req, res) => {
  try {
    const { userId } = req.auth
    const { id } = req.params

    const resume = await Resume.findOne({ _id: id, userId })

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    await resume.incrementDownloads()
    res.json({ message: 'Download tracked successfully' })
  } catch (error) {
    console.error('Track download error:', error)
    res.status(500).json({ error: 'Failed to track download' })
  }
})

export default router
