import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
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
  ChevronDown,
  ChevronUp
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
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(searchParams.get('preview') === 'true')
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    const loadResumeData = async () => {
      if (id && id !== 'new') {
        try {
          // Try to load existing resume
          const response = await resumeAPI.getResume(id)
          setResumeData(response.data)
        } catch (error) {
          console.error('Failed to load resume:', error)
          // If loading fails, create new resume structure
          createNewResumeData()
        }
      } else {
        // Create new resume
        createNewResumeData()
      }
      setLoading(false)
    }

    const createNewResumeData = () => {
      const mockResumeData: ResumeData = {
        id: 'new',
        title: 'New Resume',
      sections: [
        {
          id: '1',
          type: 'personal',
          title: 'Personal Information',
          content: {
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            linkedin: 'linkedin.com/in/johndoe',
            website: 'johndoe.dev'
          },
          isVisible: true,
          order: 1
        },
        {
          id: '2',
          type: 'summary',
          title: 'Professional Summary',
          content: {
            text: 'Experienced software engineer with 5+ years of expertise in building scalable web applications using modern technologies. Passionate about creating user-friendly interfaces and optimizing application performance.'
          },
          isVisible: true,
          order: 2
        },
        {
          id: '3',
          type: 'experience',
          title: 'Work Experience',
          content: {
            experiences: [
              {
                id: '1',
                company: 'Tech Corp',
                position: 'Senior Frontend Developer',
                location: 'San Francisco, CA',
                startDate: '2022-01',
                endDate: 'Present',
                description: '• Led development of React-based dashboard increasing user engagement by 40%\n• Mentored junior developers and established coding standards\n�� Collaborated with design team to implement responsive UI components'
              }
            ]
          },
          isVisible: true,
          order: 3
        },
        {
          id: '4',
          type: 'skills',
          title: 'Skills',
          content: {
            skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'AWS']
          },
          isVisible: true,
          order: 4
        },
        {
          id: '5',
          type: 'education',
          title: 'Education',
          content: {
            education: []
          },
          isVisible: true,
          order: 5
        },
        {
          id: '6',
          type: 'projects',
          title: 'Projects',
          content: {
            projects: []
          },
          isVisible: true,
          order: 6
        },
        {
          id: '7',
          type: 'certifications',
          title: 'Certifications',
          content: {
            certifications: []
          },
          isVisible: true,
          order: 7
        }
      ]
    }

      setResumeData(mockResumeData)
    }

    loadResumeData()
  }, [id])

  // Auto-save effect
  useEffect(() => {
    if (hasUnsavedChanges && resumeData && !loading) {
      const timer = setTimeout(() => {
        handleSave(true) // Auto-save
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer)
    }
  }, [hasUnsavedChanges, resumeData, loading])

  // Save function
  const handleSave = async (isAutoSave = false) => {
    if (!resumeData) return

    try {
      setIsSaving(true)

      // Check if this is an existing resume with a valid ID
      if (id && id !== 'new' && resumeData.id && resumeData.id !== 'new') {
        await resumeAPI.updateResume(resumeData.id, resumeData)
      } else {
        // Create new resume
        const response = await resumeAPI.createResume(resumeData)
        // Update the resume data with the new ID
        setResumeData(prev => prev ? { ...prev, id: response.data.id } : null)
        // Update URL to reflect the new resume ID
        window.history.replaceState(null, '', `/resume/${response.data.id}`)
      }

      setHasUnsavedChanges(false)
      if (!isAutoSave) {
        showToast('Resume saved successfully!', 'success')
      }
    } catch (error) {
      console.error('Failed to save resume:', error)
      if (!isAutoSave) {
        showToast('Failed to save resume', 'error')
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Download function
  const handleDownload = async () => {
    if (!resumeData) return

    try {
      setIsDownloading(true)
      showToast('Generating PDF...', 'info')

      // Convert resume data to the expected format
      const resumeForPDF = {
        ...resumeData,
        sections: resumeData.sections
      }

      // Download as PDF using the existing function
      await downloadAsPDF(resumeForPDF as any)

      showToast('PDF downloaded successfully!', 'success')

    } catch (error) {
      console.error('Failed to download resume:', error)
      showToast('Failed to download resume. Please try again.', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  // Helper function to update section content
  const updateSectionContent = (sectionId: string, field: string, value: string) => {
    if (!resumeData) return

    setResumeData({
      ...resumeData,
      sections: resumeData.sections.map(section =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, [field]: value } }
          : section
      )
    })
    setHasUnsavedChanges(true)
  }

  // Helper function to update experience fields
  const updateExperienceField = (sectionId: string, expIndex: number, field: string, value: string) => {
    if (!resumeData) return

    setResumeData({
      ...resumeData,
      sections: resumeData.sections.map(section =>
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

  // Helper function to add skill
  const addSkill = (sectionId: string, skill: string) => {
    if (!resumeData) return

    setResumeData({
      ...resumeData,
      sections: resumeData.sections.map(section =>
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

  // Helper function to remove skill
  const removeSkill = (sectionId: string, skillIndex: number) => {
    if (!resumeData) return

    setResumeData({
      ...resumeData,
      sections: resumeData.sections.map(section =>
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

  const generateAIContent = async (sectionType: string, userInput: string = '') => {
    setIsGenerating(true)

    try {
      let generatedContent = ''

      // Get job title from personal section or use default
      const personalSection = resumeData?.sections.find(s => s.type === 'personal')
      const jobTitle = userInput || personalSection?.content.jobTitle || 'Software Engineer'

      // Always try to use Gemini AI first, but fall back to demo content on any error
      try {
        if (geminiAI.isConfigured()) {
          // Use actual Gemini AI
          switch (sectionType) {
            case 'summary':
              generatedContent = await geminiAI.generateSummary(jobTitle)
              break
            case 'experience':
              generatedContent = await geminiAI.generateExperienceDescription(jobTitle)
              break
            case 'skills':
              const skills = await geminiAI.generateSkills(jobTitle)
              return skills
            default:
              generatedContent = `AI-generated content for ${sectionType} based on: ${jobTitle}`
          }
        } else {
          throw new Error('AI not configured, using demo content')
        }
      } catch (aiError) {
        console.log('Using demo content due to AI error:', aiError)
        // Use demo content as fallback
        generatedContent = geminiAI.getDemoContent(sectionType as any, jobTitle)
        if (sectionType === 'skills') {
          return generatedContent
        }
      }

      return generatedContent
    } catch (error) {
      console.error('AI generation error:', error)
      showToast('Failed to generate content. Please try again.', 'error')
      throw error
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading || !resumeData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-20 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="h-96 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{resumeData.title}</h1>
          <p className="text-gray-600 mt-1">Build and customize your professional resume</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-secondary"
          >
            {showPreview ? <EyeOff className="h-5 w-5 mr-2" /> : <Eye className="h-5 w-5 mr-2" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button className="btn-secondary">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn-secondary disabled:opacity-50"
          >
            <Download className="h-5 w-5 mr-2" />
            {isDownloading ? 'Generating PDF...' : 'Download'}
          </button>
          <button
            onClick={() => handleSave()}
            disabled={isSaving}
            className="btn-primary disabled:opacity-50"
          >
            <Save className="h-5 w-5 mr-2" />
            {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Panel */}
        <div className="space-y-6">
          {resumeData.sections.map((section) => (
            <div key={section.id} className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={async () => {
                      try {
                        const content = await generateAIContent(section.type)
                        if (section.type === 'skills' && Array.isArray(content)) {
                          // For skills, replace the entire skills array
                          updateSectionContent(section.id, 'skills', content)
                        } else if (typeof content === 'string') {
                          // For other content types, update the text field
                          const field = section.type === 'summary' ? 'text' : 'content'
                          updateSectionContent(section.id, field, content)
                        }
                        showToast('AI content generated successfully!', 'success')
                      } catch (error) {
                        // Error is already handled in generateAIContent
                      }
                    }}
                    className="text-blue-600 hover:text-blue-700 p-1 disabled:opacity-50"
                    title="Generate with AI"
                    disabled={isGenerating}
                  >
                    <Sparkles className={`h-5 w-5 ${isGenerating ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      // Toggle section visibility
                      setResumeData({
                        ...resumeData,
                        sections: resumeData.sections.map(s =>
                          s.id === section.id ? { ...s, isVisible: !s.isVisible } : s
                        )
                      })
                    }}
                    className="text-gray-600 hover:text-gray-700 p-1"
                    title={section.isVisible ? 'Hide section' : 'Show section'}
                  >
                    {section.isVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {section.type === 'personal' && (
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={section.content.fullName || ''}
                    onChange={(e) => updateSectionContent(section.id, 'fullName', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={section.content.email || ''}
                    onChange={(e) => updateSectionContent(section.id, 'email', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={section.content.phone || ''}
                    onChange={(e) => updateSectionContent(section.id, 'phone', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={section.content.location || ''}
                    onChange={(e) => updateSectionContent(section.id, 'location', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn"
                    value={section.content.linkedin || ''}
                    onChange={(e) => updateSectionContent(section.id, 'linkedin', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Website"
                    value={section.content.website || ''}
                    onChange={(e) => updateSectionContent(section.id, 'website', e.target.value)}
                    className="input-field"
                  />
                </div>
              )}

              {section.type === 'summary' && (
                <div>
                  <textarea
                    placeholder="Write a compelling professional summary..."
                    value={section.content.text || ''}
                    onChange={(e) => updateSectionContent(section.id, 'text', e.target.value)}
                    rows={4}
                    className="input-field resize-none"
                  />
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Sparkles className="h-4 w-4 mr-1" />
                    <span>Tip: Click the AI button to generate content based on your job title</span>
                  </div>
                </div>
              )}

              {section.type === 'experience' && (
                <div className="space-y-4">
                  {(section.content.experiences || []).map((exp: any, index: number) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                          type="text"
                          placeholder="Company"
                          value={exp.company || ''}
                          onChange={(e) => updateExperienceField(section.id, index, 'company', e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Position"
                          value={exp.position || ''}
                          onChange={(e) => updateExperienceField(section.id, index, 'position', e.target.value)}
                          className="input-field"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          value={exp.location || ''}
                          onChange={(e) => updateExperienceField(section.id, index, 'location', e.target.value)}
                          className="input-field"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="month"
                            value={exp.startDate || ''}
                            onChange={(e) => updateExperienceField(section.id, index, 'startDate', e.target.value)}
                            className="input-field"
                          />
                          <input
                            type="month"
                            value={exp.endDate || ''}
                            onChange={(e) => updateExperienceField(section.id, index, 'endDate', e.target.value)}
                            placeholder="Present"
                            className="input-field"
                          />
                        </div>
                      </div>
                      <textarea
                        placeholder="Describe your achievements and responsibilities..."
                        value={exp.description || ''}
                        onChange={(e) => updateExperienceField(section.id, index, 'description', e.target.value)}
                        rows={4}
                        className="input-field resize-none"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <button
                          onClick={async () => {
                            try {
                              const content = await generateAIContent('experience', exp.position)
                              if (typeof content === 'string') {
                                updateExperienceField(section.id, index, 'description', content)
                                showToast('AI content generated successfully!', 'success')
                              }
                            } catch (error) {
                              // Error is already handled in generateAIContent
                            }
                          }}
                          className="text-blue-600 hover:text-blue-700 text-sm flex items-center disabled:opacity-50"
                          disabled={isGenerating}
                        >
                          <Sparkles className="h-4 w-4 mr-1" />
                          Generate with AI
                        </button>
                        <button className="text-red-600 hover:text-red-700 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                    <Plus className="h-5 w-5 mx-auto mb-2" />
                    Add Experience
                  </button>
                </div>
              )}

              {section.type === 'skills' && (
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(section.content.skills || []).map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(section.id, index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add a skill and press Enter"
                    className="input-field"
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

          <button className="w-full card border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600 transition-colors">
            <Plus className="h-6 w-6 mx-auto mb-2" />
            Add New Section
          </button>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="card">
            <div className="bg-white border border-gray-300 shadow-lg p-8 resume-preview">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {resumeData.sections[0]?.content.fullName || 'Your Name'}
                </h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{resumeData.sections[0]?.content.email} • {resumeData.sections[0]?.content.phone}</p>
                  <p>{resumeData.sections[0]?.content.location}</p>
                  <p>{resumeData.sections[0]?.content.linkedin} • {resumeData.sections[0]?.content.website}</p>
                </div>
              </div>

              {resumeData.sections
                .filter(section => section.isVisible && section.type !== 'personal')
                .map((section) => (
                  <div key={section.id} className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-1 mb-3">
                      {section.title}
                    </h2>
                    
                    {section.type === 'summary' && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {section.content.text}
                      </p>
                    )}

                    {section.type === 'experience' && (
                      <div className="space-y-4">
                        {(section.content.experiences || []).map((exp: any) => (
                          <div key={exp.id}>
                            <div className="flex justify-between items-start mb-1">
                              <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                              <span className="text-sm text-gray-600">
                                {exp.startDate} - {exp.endDate || 'Present'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              {exp.company} • {exp.location}
                            </p>
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                              {exp.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.type === 'skills' && (
                      <div className="flex flex-wrap gap-2">
                        {(section.content.skills || []).map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
