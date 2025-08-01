import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'demo-key'
const genAI = new GoogleGenerativeAI(API_KEY)

export class GeminiAIService {
  private model: any

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' })
  }

  async generateSummary(jobTitle: string, experience: string = '', skills: string[] = []): Promise<string> {
    const prompt = `
Create a professional resume summary for a ${jobTitle} position. 
${experience ? `Experience level: ${experience}` : ''}
${skills.length > 0 ? `Key skills: ${skills.join(', ')}` : ''}

Requirements:
- 3-4 sentences maximum
- Professional and engaging tone
- Highlight key strengths and value proposition
- Avoid generic phrases
- Make it specific to the role

Generate only the summary text, no additional formatting or labels.
`

    try {
      // Check if properly configured before making API call
      if (!this.isConfigured()) {
        throw new Error('API key not configured')
      }

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (error) {
      console.error('Gemini AI Error:', error)
      // Always return fallback content
      return `Experienced ${jobTitle} with a proven track record of delivering high-quality results. Skilled in modern technologies and best practices, with strong problem-solving abilities and a passion for continuous learning. Dedicated to creating innovative solutions that drive business growth and enhance user experiences.`
    }
  }

  async generateExperienceDescription(
    jobTitle: string, 
    company: string = '', 
    responsibilities: string[] = []
  ): Promise<string> {
    const prompt = `
Create professional bullet points for a ${jobTitle} position${company ? ` at ${company}` : ''}.
${responsibilities.length > 0 ? `Key responsibilities include: ${responsibilities.join(', ')}` : ''}

Requirements:
- 3-5 bullet points
- Start each bullet with strong action verbs
- Include specific achievements and metrics where possible
- Focus on impact and results
- Use present tense for current roles, past tense for previous roles

Format as bullet points with "•" symbol. Generate only the bullet points, no additional text.
`

    try {
      // Check if properly configured before making API call
      if (!this.isConfigured()) {
        throw new Error('API key not configured')
      }

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (error) {
      console.error('Gemini AI Error:', error)
      // Always return fallback content
      return `• Developed and maintained scalable applications serving thousands of users daily
• Collaborated with cross-functional teams to deliver projects on time and within budget
• Implemented best practices and modern development methodologies
• Optimized application performance, improving load times and user experience
• Mentored junior team members and contributed to code reviews`
    }
  }

  async generateSkills(jobTitle: string, experienceLevel: string = 'mid'): Promise<string[]> {
    const prompt = `
Generate a list of relevant technical and soft skills for a ${jobTitle} position at ${experienceLevel} level.

Requirements:
- 8-12 skills total
- Mix of technical and soft skills
- Relevant to current industry standards
- Appropriate for the experience level
- No duplicates

Format as a simple comma-separated list. Generate only the skills, no additional text.
`

    try {
      // Check if properly configured before making API call
      if (!this.isConfigured()) {
        throw new Error('API key not configured')
      }

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const skillsText = response.text().trim()
      return skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
    } catch (error) {
      console.error('Gemini AI Error:', error)
      // Always return fallback skills
      const fallbackSkills = this.getFallbackSkills(jobTitle)
      return fallbackSkills
    }
  }

  async improveContent(content: string, contentType: 'summary' | 'experience' | 'general'): Promise<string> {
    const prompt = `
Improve the following ${contentType} content for a professional resume:

"${content}"

Requirements:
- Keep the same general meaning and key information
- Make it more professional and impactful
- Use stronger action words
- Ensure proper grammar and formatting
- Keep it concise but comprehensive
- ${contentType === 'experience' ? 'Format as bullet points with "•" symbol' : 'Return as clean paragraph text'}

Generate only the improved content, no additional text or explanations.
`

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text().trim()
    } catch (error) {
      console.error('Gemini AI Error:', error)
      return content // Return original content if AI fails
    }
  }

  private getFallbackSkills(jobTitle: string): string[] {
    const skillsMap: { [key: string]: string[] } = {
      'frontend developer': ['React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Redux', 'Git', 'Responsive Design', 'Problem Solving', 'Team Collaboration', 'Agile'],
      'backend developer': ['Node.js', 'Python', 'JavaScript', 'APIs', 'Databases', 'Git', 'Cloud Services', 'Problem Solving', 'System Design', 'Testing'],
      'full stack developer': ['React', 'Node.js', 'JavaScript', 'TypeScript', 'Databases', 'Git', 'APIs', 'Problem Solving', 'Team Collaboration', 'Agile'],
      'product manager': ['Product Strategy', 'Roadmap Planning', 'Stakeholder Management', 'Data Analysis', 'User Research', 'Agile', 'Leadership', 'Communication', 'Problem Solving', 'Market Research'],
      'software engineer': ['Programming', 'Algorithms', 'Data Structures', 'Git', 'Testing', 'Problem Solving', 'Team Collaboration', 'Code Review', 'Debugging', 'Documentation'],
      'data scientist': ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization', 'R', 'Problem Solving', 'Communication', 'Research', 'Analytics'],
      'designer': ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Visual Design', 'Communication', 'Problem Solving', 'Creativity', 'Collaboration']
    }

    const key = jobTitle.toLowerCase()
    return skillsMap[key] || skillsMap['software engineer']
  }

  // Check if API key is properly configured
  isConfigured(): boolean {
    return API_KEY !== 'demo-key' && API_KEY.length > 0 && API_KEY.startsWith('AIza')
  }

  // Get demo content if AI is not configured
  getDemoContent(type: 'summary' | 'experience' | 'skills', jobTitle: string = 'Software Engineer'): any {
    switch (type) {
      case 'summary':
        return `Dynamic ${jobTitle} with proven track record of delivering high-impact solutions. Skilled in leveraging cutting-edge technologies to drive business growth and enhance user experiences. Known for collaborative leadership and innovative problem-solving approach.`
      
      case 'experience':
        return `• Developed and maintained scalable applications serving 100,000+ users daily
• Implemented modern development practices, reducing deployment time by 60%
• Collaborated with cross-functional teams to deliver projects on time and within budget
• Optimized application performance, improving load times by 45%
• Mentored junior developers and established coding standards`
      
      case 'skills':
        return this.getFallbackSkills(jobTitle)
      
      default:
        return ''
    }
  }
}

// Export singleton instance
export const geminiAI = new GeminiAIService()
