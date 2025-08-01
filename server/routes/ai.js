import express from 'express'
import { body, validationResult } from 'express-validator'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = express.Router()

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// Rate limiting for AI endpoints (more restrictive)
import rateLimit from 'express-rate-limit'
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 AI requests per windowMs
  message: 'Too many AI requests, please try again later.',
})

router.use(aiLimiter)

// Generate professional summary
router.post('/generate/summary', [
  body('jobTitle').trim().isLength({ min: 1 }).withMessage('Job title is required'),
  body('experience').optional().trim(),
  body('skills').optional().isArray(),
  body('industry').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { jobTitle, experience, skills, industry } = req.body

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Generate a professional resume summary for a ${jobTitle} position. 
    ${experience ? `Experience level: ${experience}` : ''}
    ${skills && skills.length > 0 ? `Key skills: ${skills.join(', ')}` : ''}
    ${industry ? `Industry: ${industry}` : ''}
    
    The summary should be:
    - 2-3 sentences long
    - Highlight key strengths and value proposition
    - Use action-oriented language
    - Be specific and quantifiable where possible
    - Sound professional and engaging
    - Avoid generic phrases
    
    Return only the summary text without any formatting or additional commentary.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    res.json({ 
      content: text.trim(),
      type: 'summary',
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Summary generation error:', error)
    res.status(500).json({ error: 'Failed to generate summary' })
  }
})

// Generate job description
router.post('/generate/experience', [
  body('jobTitle').trim().isLength({ min: 1 }).withMessage('Job title is required'),
  body('company').optional().trim(),
  body('duration').optional().trim(),
  body('responsibilities').optional().isArray(),
  body('achievements').optional().isArray(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { jobTitle, company, duration, responsibilities, achievements } = req.body

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Generate professional job description bullet points for a ${jobTitle} position.
    ${company ? `Company: ${company}` : ''}
    ${duration ? `Duration: ${duration}` : ''}
    ${responsibilities && responsibilities.length > 0 ? `Key responsibilities: ${responsibilities.join(', ')}` : ''}
    ${achievements && achievements.length > 0 ? `Achievements: ${achievements.join(', ')}` : ''}
    
    Generate 4-6 bullet points that:
    - Start with strong action verbs
    - Include specific metrics and numbers where possible
    - Highlight achievements and impact
    - Use professional language
    - Are relevant to the job title
    - Show progression and growth
    
    Format as bullet points with • at the start of each line.
    Return only the bullet points without any additional commentary.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    res.json({ 
      content: text.trim(),
      type: 'experience',
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Experience generation error:', error)
    res.status(500).json({ error: 'Failed to generate experience description' })
  }
})

// Generate skills suggestions
router.post('/generate/skills', [
  body('jobTitle').trim().isLength({ min: 1 }).withMessage('Job title is required'),
  body('industry').optional().trim(),
  body('experienceLevel').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { jobTitle, industry, experienceLevel } = req.body

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Generate a list of relevant skills for a ${jobTitle} position.
    ${industry ? `Industry: ${industry}` : ''}
    ${experienceLevel ? `Experience level: ${experienceLevel}` : ''}
    
    Include:
    - Technical skills (programming languages, tools, software)
    - Soft skills (communication, leadership, etc.)
    - Industry-specific skills
    - Certifications or methodologies
    
    Provide 15-20 skills that are:
    - Highly relevant to the job title
    - Mix of technical and soft skills
    - Appropriate for the experience level
    - Currently in demand
    
    Return as a simple comma-separated list without any additional commentary or formatting.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the comma-separated skills
    const skills = text.trim()
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)

    res.json({ 
      content: skills,
      type: 'skills',
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Skills generation error:', error)
    res.status(500).json({ error: 'Failed to generate skills' })
  }
})

// Improve existing content
router.post('/improve', [
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('type').isIn(['summary', 'experience', 'skills']).withMessage('Invalid content type'),
  body('context').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { content, type, context } = req.body

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    let prompt = ''
    
    switch (type) {
      case 'summary':
        prompt = `Improve this professional summary: "${content}"
        ${context ? `Context: ${context}` : ''}
        
        Make it more:
        - Impactful and compelling
        - Specific with quantifiable achievements
        - Professional and polished
        - Concise but comprehensive
        
        Return only the improved summary without any additional commentary.`
        break
        
      case 'experience':
        prompt = `Improve this job experience description: "${content}"
        ${context ? `Context: ${context}` : ''}
        
        Enhance it by:
        - Using stronger action verbs
        - Adding specific metrics and results
        - Making achievements more prominent
        - Improving clarity and impact
        
        Maintain the bullet point format. Return only the improved content.`
        break
        
      default:
        prompt = `Improve this professional content: "${content}"
        ${context ? `Context: ${context}` : ''}
        
        Make it more professional, impactful, and polished.
        Return only the improved content without any additional commentary.`
    }

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    res.json({ 
      content: text.trim(),
      originalContent: content,
      type: 'improvement',
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('AI Content improvement error:', error)
    res.status(500).json({ error: 'Failed to improve content' })
  }
})

// Get AI usage statistics
router.get('/usage', async (req, res) => {
  try {
    const { userId } = req.auth
    
    // In a real implementation, you would track AI usage per user
    // For now, return mock data
    res.json({
      userId,
      totalRequests: 15,
      remainingRequests: 85,
      monthlyLimit: 100,
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  } catch (error) {
    console.error('AI Usage fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch usage statistics' })
  }
})

export default router
