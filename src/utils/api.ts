import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Types
export interface Resume {
  _id: string
  title: string
  jobTitle: string
  sections: ResumeSection[]
  template: string
  colorScheme: string
  isPublic: boolean
  shareUrl?: string
  views: number
  downloads: number
  createdAt: string
  updatedAt: string
}

export interface ResumeSection {
  id: string
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications'
  title: string
  content: any
  isVisible: boolean
  order: number
}

export interface APIError {
  error: string
  errors?: Array<{ field: string; message: string }>
}

// Add auth token to requests
export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// API functions
export const resumeAPI = {
  // Get all resumes
  getAll: async (): Promise<Resume[]> => {
    const response = await api.get('/resumes')
    return response.data
  },

  // Get resume by ID
  getById: async (id: string): Promise<Resume> => {
    const response = await api.get(`/resumes/${id}`)
    return response.data
  },

  // Create new resume
  create: async (data: Partial<Resume>): Promise<Resume> => {
    const response = await api.post('/resumes', data)
    return response.data
  },

  // Update resume
  update: async (id: string, data: Partial<Resume>): Promise<Resume> => {
    const response = await api.put(`/resumes/${id}`, data)
    return response.data
  },

  // Delete resume
  delete: async (id: string): Promise<void> => {
    await api.delete(`/resumes/${id}`)
  },

  // Share resume
  share: async (id: string): Promise<{ shareUrl: string }> => {
    const response = await api.post(`/resumes/${id}/share`)
    return response.data
  },

  // Track download
  trackDownload: async (id: string): Promise<void> => {
    await api.post(`/resumes/${id}/download`)
  },

  // Get public resume
  getPublic: async (shareUrl: string): Promise<Resume> => {
    const response = await api.get(`/resumes/public/${shareUrl}`)
    return response.data
  },
}

export const aiAPI = {
  // Generate summary
  generateSummary: async (data: {
    jobTitle: string
    experience?: string
    skills?: string[]
    industry?: string
  }): Promise<{ content: string }> => {
    const response = await api.post('/ai/generate/summary', data)
    return response.data
  },

  // Generate experience description
  generateExperience: async (data: {
    jobTitle: string
    company?: string
    duration?: string
    responsibilities?: string[]
    achievements?: string[]
  }): Promise<{ content: string }> => {
    const response = await api.post('/ai/generate/experience', data)
    return response.data
  },

  // Generate skills
  generateSkills: async (data: {
    jobTitle: string
    industry?: string
    experienceLevel?: string
  }): Promise<{ content: string[] }> => {
    const response = await api.post('/ai/generate/skills', data)
    return response.data
  },

  // Improve content
  improveContent: async (data: {
    content: string
    type: 'summary' | 'experience' | 'skills'
    context?: string
  }): Promise<{ content: string }> => {
    const response = await api.post('/ai/improve', data)
    return response.data
  },

  // Get usage statistics
  getUsage: async (): Promise<{
    totalRequests: number
    remainingRequests: number
    monthlyLimit: number
    resetDate: string
  }> => {
    const response = await api.get('/ai/usage')
    return response.data
  },
}

export const userAPI = {
  // Get dashboard data
  getDashboard: async (): Promise<{
    statistics: {
      totalResumes: number
      totalViews: number
      totalDownloads: number
      publicResumes: number
      recentActivity: number
    }
    recentResumes: Array<{
      id: string
      title: string
      updatedAt: string
      views: number
      downloads: number
    }>
    mostViewedResume: {
      id: string
      title: string
      views: number
    } | null
  }> => {
    const response = await api.get('/users/dashboard')
    return response.data
  },

  // Get preferences
  getPreferences: async (): Promise<{
    preferences: {
      defaultTemplate: string
      defaultColorScheme: string
      autoSave: boolean
      emailNotifications: boolean
      publicProfile: boolean
      allowIndexing: boolean
    }
  }> => {
    const response = await api.get('/users/preferences')
    return response.data
  },

  // Update preferences
  updatePreferences: async (preferences: Record<string, any>): Promise<void> => {
    await api.put('/users/preferences', preferences)
  },

  // Export data
  exportData: async (): Promise<any> => {
    const response = await api.get('/users/export')
    return response.data
  },

  // Delete account
  deleteAccount: async (): Promise<void> => {
    await api.delete('/users/account')
  },
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access - redirecting to login')
    }
    return Promise.reject(error)
  }
)

export default api
