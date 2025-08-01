import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { resumeAPI, showToast } from '../utils/api'
import { downloadAsPDF } from '../utils/pdfGenerator'
import { geminiAI } from '../utils/geminiAI'
import { 
  Save, 
  Download, 
  Share2, 
  Eye, 
  EyeOff, 
  Sparkles,
  Plus,
  Trash2,
  ArrowLeft,
  Layout,
  X,
  Users,
  BarChart3,
  FileText,
  Settings,
  Palette,
  Type,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Award,
  User,
  FileTextIcon,
  Target
} from 'lucide-react'

interface ResumeSection {
  id: string
  type: 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications'
  title: string
  content: any
  isVisible: boolean
  order: number
}

interface ResumeData {
  id: string
  title: string
  sections: ResumeSection[]
}

export default function ResumeBuilder() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [resumeTheme, setResumeTheme] = useState('blue')

  // City-named templates like Resume.io
  const templates = [
    {
      id: 'stockholm',
      name: 'Stockholm',
      category: 'Professional',
      color: 'blue',
      preview: 'https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?w=200&h=280&fit=crop',
      sections: [
        { id: '1', type: 'personal', title: 'Personal Details', content: { fullName: 'Emma Johnson', email: 'emma.johnson@email.com', phone: '+1 (555) 234-5678', location: 'Stockholm, Sweden', linkedin: 'linkedin.com/in/emmajohnson', website: 'emmajohnson.dev' }, isVisible: true, order: 1 },
        { id: '2', type: 'summary', title: 'Professional Summary', content: { text: 'Results-driven software engineer with 7+ years of experience developing scalable applications and leading cross-functional teams.' }, isVisible: true, order: 2 },
        { id: '3', type: 'experience', title: 'Employment History', content: { experiences: [{ id: '1', company: 'Tech Solutions AB', position: 'Senior Software Engineer', location: 'Stockholm, Sweden', startDate: '2021-03', endDate: 'Present', description: '• Led development of microservices architecture serving 1M+ users\\n• Reduced application load time by 40% through optimization\\n• Mentored team of 5 junior developers' }] }, isVisible: true, order: 3 },
        { id: '4', type: 'skills', title: 'Skills', content: { skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL'] }, isVisible: true, order: 4 }
      ]
    },
    {
      id: 'dublin',
      name: 'Dublin',
      category: 'Creative',
      color: 'green',
      preview: 'https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?w=200&h=280&fit=crop',
      sections: [
        { id: '1', type: 'personal', title: 'Contact', content: { fullName: 'Liam O\'Connor', email: 'liam.oconnor@email.com', phone: '+353 1 234 5678', location: 'Dublin, Ireland', linkedin: 'linkedin.com/in/liamoconnor', website: 'liamoconnor.design' }, isVisible: true, order: 1 },
        { id: '2', type: 'summary', title: 'Profile', content: { text: 'Creative UX/UI designer with 5+ years crafting user-centered digital experiences for leading brands.' }, isVisible: true, order: 2 },
        { id: '3', type: 'experience', title: 'Experience', content: { experiences: [{ id: '1', company: 'Design Studio Dublin', position: 'Senior UX Designer', location: 'Dublin, Ireland', startDate: '2020-06', endDate: 'Present', description: '• Designed award-winning mobile app with 4.8 star rating\\n• Conducted user research with 200+ participants\\n• Created design system used across multiple product teams' }] }, isVisible: true, order: 3 },
        { id: '4', type: 'skills', title: 'Core Skills', content: { skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'] }, isVisible: true, order: 4 }
      ]
    },
    {
      id: 'vienna',
      name: 'Vienna',
      category: 'Executive',
      color: 'purple',
      preview: 'https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?w=200&h=280&fit=crop',
      sections: [
        { id: '1', type: 'personal', title: 'Contact Information', content: { fullName: 'Dr. Maria Schmidt', email: 'maria.schmidt@executive.com', phone: '+43 1 234 5678', location: 'Vienna, Austria', linkedin: 'linkedin.com/in/mariaschmidt', website: '' }, isVisible: true, order: 1 },
        { id: '2', type: 'summary', title: 'Executive Summary', content: { text: 'Strategic leader with 15+ years driving organizational growth and operational excellence across European markets.' }, isVisible: true, order: 2 },
        { id: '3', type: 'experience', title: 'Professional Experience', content: { experiences: [{ id: '1', company: 'Global Corp Europe', position: 'Vice President of Operations', location: 'Vienna, Austria', startDate: '2018-01', endDate: 'Present', description: '• Led organization of 150+ employees across 3 departments\\n• Increased operational efficiency by 35%\\n• Managed €50M annual budget with 98% accuracy' }] }, isVisible: true, order: 3 },
        { id: '4', type: 'skills', title: 'Core Competencies', content: { skills: ['Strategic Planning', 'Team Leadership', 'Budget Management', 'Process Optimization'] }, isVisible: true, order: 4 }
      ]
    }
  ]

  const sectionIcons = {
    personal: User,
    summary: Target,
    experience: Briefcase,
    education: GraduationCap,
    skills: Award,
    projects: FileTextIcon,
    certifications: Award
  }

  const applyTemplate = (template: any) => {
    const newResumeData: ResumeData = {
      id: resumeData?.id || 'new',
      title: `${template.name} Resume`,
      sections: template.sections
    }
    setResumeData(newResumeData)
    setResumeTheme(template.color)
    setHasUnsavedChanges(true)
    setShowTemplates(false)
    showToast(`${template.name} template applied!`, 'success')
  }

  useEffect(() => {
    const loadResumeData = async () => {
      if (id && id !== 'new') {
        try {
          const response = await resumeAPI.getResume(id)
          setResumeData(response.data)
        } catch (error) {
          console.error('Failed to load resume:', error)
          createNewResumeData()
        }
      } else {
        createNewResumeData()
      }
      setLoading(false)
    }

    const createNewResumeData = () => {
      const mockResumeData: ResumeData = {
        id: 'new',
        title: 'My Resume',
        sections: [
          {
            id: '1',
            type: 'personal',
            title: 'Personal Details',
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
            id: '2',
            type: 'summary',
            title: 'Professional Summary',
            content: {
              text: ''
            },
            isVisible: true,
            order: 2
          },
          {
            id: '3',
            type: 'experience',
            title: 'Employment History',
            content: {
              experiences: []
            },
            isVisible: true,
            order: 3
          },
          {
            id: '4',
            type: 'skills',
            title: 'Skills',
            content: {
              skills: []
            },
            isVisible: true,
            order: 4
          }
        ]
      }
      setResumeData(mockResumeData)
    }

    loadResumeData()
  }, [id])

  const handleSave = async () => {
    if (!resumeData) return
    try {
      setIsSaving(true)
      if (id && id !== 'new' && resumeData.id && resumeData.id !== 'new') {
        await resumeAPI.updateResume(resumeData.id, resumeData)
      } else {
        const response = await resumeAPI.createResume(resumeData)
        setResumeData(prev => prev ? { ...prev, id: response.data.id } : null)
        window.history.replaceState(null, '', `/resume/${response.data.id}`)
      }
      setHasUnsavedChanges(false)
      showToast('Resume saved successfully!', 'success')
    } catch (error) {
      showToast('Failed to save resume', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!resumeData) return
    try {
      setIsDownloading(true)
      await downloadAsPDF(resumeData as any)
      showToast('PDF downloaded successfully!', 'success')
    } catch (error) {
      showToast('Failed to download resume', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  const updateSectionContent = (sectionId: string, field: string, value: string | string[]) => {
    if (!resumeData) return
    setResumeData({
      ...resumeData,
      sections: (resumeData.sections || []).map(section =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, [field]: value } }
          : section
      )
    })
    setHasUnsavedChanges(true)
  }

  const addExperience = (sectionId: string) => {
    if (!resumeData) return
    const newExp = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    setResumeData({
      ...resumeData,
      sections: (resumeData.sections || []).map(section =>
        section.id === sectionId
          ? {
              ...section,
              content: {
                ...section.content,
                experiences: [...(section.content.experiences || []), newExp]
              }
            }
          : section
      )
    })
    setHasUnsavedChanges(true)
  }

  const updateExperienceField = (sectionId: string, expIndex: number, field: string, value: string) => {
    if (!resumeData) return
    setResumeData({
      ...resumeData,
      sections: (resumeData.sections || []).map(section =>
        section.id === sectionId
          ? {
              ...section,
              content: {
                ...section.content,
                experiences: (section.content.experiences || []).map((exp: any, index: number) =>
                  index === expIndex ? { ...exp, [field]: value } : exp
                )
              }
            }
          : section
      )
    })
    setHasUnsavedChanges(true)
  }

  const addSkill = (sectionId: string, skill: string) => {
    if (!resumeData) return
    setResumeData({
      ...resumeData,
      sections: (resumeData.sections || []).map(section =>
        section.id === sectionId
          ? {
              ...section,
              content: {
                ...section.content,
                skills: [...(section.content.skills || []), skill]
              }
            }
          : section
      )
    })
    setHasUnsavedChanges(true)
  }

  const removeSkill = (sectionId: string, skillIndex: number) => {
    if (!resumeData) return
    setResumeData({
      ...resumeData,
      sections: (resumeData.sections || []).map(section =>
        section.id === sectionId
          ? {
              ...section,
              content: {
                ...section.content,
                skills: (section.content.skills || []).filter((_: string, index: number) => index !== skillIndex)
              }
            }
          : section
      )
    })
    setHasUnsavedChanges(true)
  }

  if (loading || !resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Templates Modal - Resume.io Style */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Resume Templates</h2>
                  <p className="text-gray-600 mt-1">Choose a professional template designed by experts</p>
                </div>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="group border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 hover:shadow-lg cursor-pointer transition-all duration-200"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-4 bg-white rounded shadow-sm border">
                        <div className="p-3 space-y-2">
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                          <div className="mt-3 space-y-1">
                            <div className="h-2 bg-blue-200 rounded w-full"></div>
                            <div className="h-2 bg-blue-200 rounded w-5/6"></div>
                            <div className="h-2 bg-blue-200 rounded w-4/5"></div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          Use Template
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">{template.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header - Resume.io Style */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">{resumeData.title}</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Layout className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  hasUnsavedChanges 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save' : 'Saved'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Sidebar - Sections Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Sections</h3>
              <div className="space-y-1">
                {(resumeData.sections || []).map((section) => {
                  const IconComponent = sectionIcons[section.type] || FileText
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                      <ChevronRight className="h-3 w-3 ml-auto opacity-50" />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Middle - Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {(resumeData.sections || []).map((section) => (
                <div
                  key={section.id}
                  className={`p-6 ${activeSection === section.id ? 'block' : 'hidden'}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                    <button
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      disabled={isGenerating}
                    >
                      <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {section.type === 'personal' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={section.content.fullName?.split(' ')[0] || ''}
                            onChange={(e) => {
                              const lastName = section.content.fullName?.split(' ').slice(1).join(' ') || ''
                              updateSectionContent(section.id, 'fullName', `${e.target.value} ${lastName}`.trim())
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={section.content.fullName?.split(' ').slice(1).join(' ') || ''}
                            onChange={(e) => {
                              const firstName = section.content.fullName?.split(' ')[0] || ''
                              updateSectionContent(section.id, 'fullName', `${firstName} ${e.target.value}`.trim())
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={section.content.email || ''}
                          onChange={(e) => updateSectionContent(section.id, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="john.doe@email.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={section.content.phone || ''}
                            onChange={(e) => updateSectionContent(section.id, 'phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={section.content.location || ''}
                            onChange={(e) => updateSectionContent(section.id, 'location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="New York, NY"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {section.type === 'summary' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Write 2-4 short & energetic sentences to interest the reader! Mention your role, experience & most important accomplishments.
                      </label>
                      <textarea
                        value={section.content.text || ''}
                        onChange={(e) => updateSectionContent(section.id, 'text', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="e.g. Passionate software engineer with 5+ years of experience developing scalable web applications..."
                      />
                    </div>
                  )}

                  {section.type === 'experience' && (
                    <div className="space-y-6">
                      {(section.content.experiences || []).map((exp: any, index: number) => (
                        <div key={exp.id || index} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job Title
                              </label>
                              <input
                                type="text"
                                value={exp.position || ''}
                                onChange={(e) => updateExperienceField(section.id, index, 'position', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g. Software Engineer"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company
                              </label>
                              <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => updateExperienceField(section.id, index, 'company', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g. Google"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              <input
                                type="month"
                                value={exp.startDate || ''}
                                onChange={(e) => updateExperienceField(section.id, index, 'startDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              <input
                                type="month"
                                value={exp.endDate || ''}
                                onChange={(e) => updateExperienceField(section.id, index, 'endDate', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Present"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                              </label>
                              <input
                                type="text"
                                value={exp.location || ''}
                                onChange={(e) => updateExperienceField(section.id, index, 'location', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g. New York"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={exp.description || ''}
                              onChange={(e) => updateExperienceField(section.id, index, 'description', e.target.value)}
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              placeholder="• Describe your key achievements and responsibilities..."
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addExperience(section.id)}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <Plus className="h-5 w-5 mx-auto mb-1" />
                        Add Employment
                      </button>
                    </div>
                  )}

                  {section.type === 'skills' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Add 5-10 important skills that show you fit the position. Make sure they match the keywords of the job listing.
                      </label>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {(section.content.skills || []).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm flex items-center border border-blue-200"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(section.id, index)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add a skill and press Enter"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement
                            if (input.value.trim()) {
                              addSkill(section.id, input.value.trim())
                              input.value = ''
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right - Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Preview</h3>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Resume Preview */}
                <div className="bg-white border border-gray-300 shadow-sm" style={{ aspectRatio: '8.5/11' }}>
                  <div className="p-8 text-sm">
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {(resumeData.sections || [])[0]?.content.fullName || 'Your Name'}
                      </h1>
                      <div className="text-gray-600 space-y-1">
                        <p>{(resumeData.sections || [])[0]?.content.email} • {(resumeData.sections || [])[0]?.content.phone}</p>
                        <p>{(resumeData.sections || [])[0]?.content.location}</p>
                      </div>
                    </div>

                    {/* Sections */}
                    {(resumeData.sections || [])
                      .filter(section => section.isVisible && section.type !== 'personal')
                      .map((section) => (
                        <div key={section.id} className="mb-6">
                          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                            {section.title}
                          </h2>
                          
                          {section.type === 'summary' && (
                            <p className="text-gray-700 leading-relaxed">
                              {section.content.text || 'Your professional summary will appear here...'}
                            </p>
                          )}

                          {section.type === 'experience' && (
                            <div className="space-y-4">
                              {(section.content.experiences || []).length > 0 ? (
                                (section.content.experiences || []).map((exp: any, index: number) => (
                                  <div key={exp.id || index}>
                                    <div className="flex justify-between items-start mb-1">
                                      <h3 className="font-semibold text-gray-900">{exp.position || 'Job Title'}</h3>
                                      <span className="text-gray-600">
                                        {exp.startDate} - {exp.endDate || 'Present'}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 mb-2">
                                      {exp.company || 'Company Name'} • {exp.location || 'Location'}
                                    </p>
                                    <div className="text-gray-700 whitespace-pre-line">
                                      {exp.description || 'Job description will appear here...'}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-400 italic">Add your work experience...</p>
                              )}
                            </div>
                          )}

                          {section.type === 'skills' && (
                            <div className="flex flex-wrap gap-2">
                              {(section.content.skills || []).length > 0 ? (
                                (section.content.skills || []).map((skill: string, index: number) => (
                                  <span
                                    key={index}
                                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                                  >
                                    {skill}
                                  </span>
                                ))
                              ) : (
                                <p className="text-gray-400 italic">Add your skills...</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
