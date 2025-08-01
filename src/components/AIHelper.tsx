import { useState } from 'react'
import { Sparkles, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import { aiAPI } from '../utils/api'

interface AIHelperProps {
  type: 'summary' | 'experience' | 'skills'
  onGenerated: (content: string | string[]) => void
  context?: {
    jobTitle?: string
    company?: string
    experience?: string
    skills?: string[]
    industry?: string
  }
}

export default function AIHelper({ type, onGenerated, context }: AIHelperProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const generateContent = async () => {
    if (!context?.jobTitle) {
      setError('Please provide a job title to generate AI content')
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuccess(false)

    try {
      let result
      
      switch (type) {
        case 'summary':
          result = await aiAPI.generateSummary({
            jobTitle: context.jobTitle,
            experience: context.experience,
            skills: context.skills,
            industry: context.industry,
          })
          onGenerated(result.content)
          break
          
        case 'experience':
          result = await aiAPI.generateExperience({
            jobTitle: context.jobTitle,
            company: context.company,
          })
          onGenerated(result.content)
          break
          
        case 'skills':
          result = await aiAPI.generateSkills({
            jobTitle: context.jobTitle,
            industry: context.industry,
            experienceLevel: context.experience,
          })
          onGenerated(result.content)
          break
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      
    } catch (err) {
      console.error('AI generation error:', err)
      setError('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const getButtonText = () => {
    switch (type) {
      case 'summary':
        return 'Generate Summary'
      case 'experience':
        return 'Generate Description'
      case 'skills':
        return 'Suggest Skills'
      default:
        return 'Generate with AI'
    }
  }

  const getTooltipText = () => {
    switch (type) {
      case 'summary':
        return 'Generate a professional summary based on your job title and experience'
      case 'experience':
        return 'Generate achievement-focused bullet points for this role'
      case 'skills':
        return 'Get relevant skill suggestions for your job title'
      default:
        return 'Generate content with AI assistance'
    }
  }

  return (
    <div className="ai-helper">
      <button
        onClick={generateContent}
        disabled={isGenerating || !context?.jobTitle}
        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isGenerating || !context?.jobTitle
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : success
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}
        title={getTooltipText()}
      >
        {isGenerating ? (
          <Loader className="h-4 w-4 mr-2 animate-spin" />
        ) : success ? (
          <CheckCircle className="h-4 w-4 mr-2" />
        ) : (
          <Sparkles className="h-4 w-4 mr-2" />
        )}
        {isGenerating ? 'Generating...' : success ? 'Generated!' : getButtonText()}
      </button>

      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </div>
      )}

      {!context?.jobTitle && (
        <div className="mt-2 text-xs text-gray-500">
          💡 Add a job title to enable AI generation
        </div>
      )}
    </div>
  )
}
