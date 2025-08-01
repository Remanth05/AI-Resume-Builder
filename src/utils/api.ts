import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Check if we're using demo mode
const isUsingDemo = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY === 'pk_test_demo_key_for_development_bypass'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Mock data for demo mode
let mockResumes = [
  {
    id: '1',
    title: 'Software Engineer Resume',
    jobTitle: 'Frontend Developer',
    updatedAt: '2024-01-15',
    createdAt: '2024-01-10',
    isPublic: false,
    views: 45,
    downloads: 12
  },
  {
    id: '2',
    title: 'Product Manager Resume',
    jobTitle: 'Senior Product Manager',
    updatedAt: '2024-01-12',
    createdAt: '2024-01-08',
    isPublic: true,
    views: 78,
    downloads: 23
  }
]

const mockStats = {
  totalResumes: 2,
  totalDownloads: 35,
  totalShares: 8,
  totalViews: 123
}

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (!isUsingDemo) {
      // Add Clerk token if available
      const token = localStorage.getItem('clerk-token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isUsingDemo) {
      // Handle unauthorized - redirect to login
      window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

// API functions with demo mode fallbacks
export const resumeAPI = {
  // Get all resumes for user
  getResumes: async () => {
    if (isUsingDemo) {
      return { data: mockResumes }
    }
    return api.get('/resumes')
  },

  // Get single resume
  getResume: async (id: string) => {
    if (isUsingDemo) {
      const resume = mockResumes.find(r => r.id === id)
      if (!resume) throw new Error('Resume not found')
      return { data: resume }
    }
    return api.get(`/resumes/${id}`)
  },

  // Create new resume
  createResume: async (resumeData: any) => {
    if (isUsingDemo) {
      const newResume = {
        id: String(Date.now()),
        title: resumeData.title || 'New Resume',
        jobTitle: resumeData.jobTitle || '',
        ...resumeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        downloads: 0,
        isPublic: false
      }
      mockResumes.unshift(newResume)
      return { data: newResume }
    }
    return api.post('/resumes', resumeData)
  },

  // Update resume
  updateResume: async (id: string, resumeData: any) => {
    if (isUsingDemo) {
      const index = mockResumes.findIndex(r => r.id === id)
      if (index !== -1) {
        mockResumes[index] = { ...mockResumes[index], ...resumeData, updatedAt: new Date().toISOString() }
        return { data: mockResumes[index] }
      }
      throw new Error('Resume not found')
    }
    return api.put(`/resumes/${id}`, resumeData)
  },

  // Delete resume
  deleteResume: async (id: string) => {
    if (isUsingDemo) {
      const index = mockResumes.findIndex(r => r.id === id)
      if (index !== -1) {
        mockResumes.splice(index, 1)
        return { data: { success: true } }
      }
      throw new Error('Resume not found')
    }
    return api.delete(`/resumes/${id}`)
  },

  // Download resume
  downloadResume: async (id: string) => {
    if (isUsingDemo) {
      // Simulate download
      const resume = mockResumes.find(r => r.id === id)
      if (resume) {
        resume.downloads += 1
        // Create a mock PDF download
        const link = document.createElement('a')
        link.href = 'data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKP...'
        link.download = `${resume.title}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        return { data: { success: true } }
      }
      throw new Error('Resume not found')
    }
    return api.get(`/resumes/${id}/download`)
  },

  // Share resume
  shareResume: async (id: string) => {
    if (isUsingDemo) {
      const resume = mockResumes.find(r => r.id === id)
      if (resume) {
        resume.isPublic = true
        const shareUrl = `https://resumier.com/share/${id}`
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl)
        return { data: { shareUrl } }
      }
      throw new Error('Resume not found')
    }
    return api.post(`/resumes/${id}/share`)
  },

  // Toggle resume visibility
  toggleVisibility: async (id: string) => {
    if (isUsingDemo) {
      const resume = mockResumes.find(r => r.id === id)
      if (resume) {
        resume.isPublic = !resume.isPublic
        return { data: resume }
      }
      throw new Error('Resume not found')
    }
    return api.patch(`/resumes/${id}/visibility`)
  }
}

export const userAPI = {
  // Get user stats
  getStats: async () => {
    if (isUsingDemo) {
      // Calculate real stats from mock data
      const stats = {
        totalResumes: mockResumes.length,
        totalDownloads: mockResumes.reduce((sum, r) => sum + r.downloads, 0),
        totalShares: mockResumes.filter(r => r.isPublic).length,
        totalViews: mockResumes.reduce((sum, r) => sum + r.views, 0)
      }
      return { data: stats }
    }
    return api.get('/users/stats')
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    if (isUsingDemo) {
      return { data: { ...profileData, success: true } }
    }
    return api.put('/users/profile', profileData)
  }
}

export const aiAPI = {
  // Generate content with AI
  generateContent: async (sectionType: string, userInput: string) => {
    if (isUsingDemo) {
      // Mock AI generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let generatedContent = ''
      switch (sectionType) {
        case 'summary':
          generatedContent = `Dynamic ${userInput} with proven track record of delivering high-impact solutions. Skilled in leveraging cutting-edge technologies to drive business growth and enhance user experiences. Known for collaborative leadership and innovative problem-solving approach.`
          break
        case 'experience':
          generatedContent = `• Developed and maintained scalable applications serving 100,000+ users daily
• Implemented modern development practices, reducing deployment time by 60%
• Collaborated with cross-functional teams to deliver projects on time and within budget
• Optimized application performance, improving load times by 45%`
          break
        default:
          generatedContent = `AI-generated content for ${sectionType} based on: ${userInput}`
      }
      
      return { data: { content: generatedContent } }
    }
    return api.post('/ai/generate', { sectionType, userInput })
  }
}

// Helper function to show toast notifications
export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  // Create a simple toast notification
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    'bg-blue-500'
  }`
  toast.textContent = message
  
  document.body.appendChild(toast)
  
  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
    toast.style.opacity = '1'
  }, 100)
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    toast.style.opacity = '0'
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

export default api
