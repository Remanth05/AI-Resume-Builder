import mongoose from 'mongoose'

const personalInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  location: String,
  linkedin: String,
  website: String,
  github: String,
})

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  location: String,
  startDate: { type: String, required: true },
  endDate: String, // null or empty for current positions
  description: String,
  achievements: [String],
  technologies: [String],
})

const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  field: String,
  location: String,
  startDate: String,
  endDate: String,
  gpa: String,
  achievements: [String],
})

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  technologies: [String],
  url: String,
  githubUrl: String,
  startDate: String,
  endDate: String,
  highlights: [String],
})

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: String,
  expiryDate: String,
  credentialId: String,
  url: String,
})

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'custom'],
    required: true,
  },
  title: { type: String, required: true },
  content: mongoose.Schema.Types.Mixed,
  isVisible: { type: Boolean, default: true },
  order: { type: Number, required: true },
})

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true }, // Clerk user ID
  title: { type: String, required: true },
  jobTitle: String,
  
  // Resume sections
  sections: [sectionSchema],
  
  // Resume styling and layout
  template: { type: String, default: 'modern' },
  colorScheme: { type: String, default: 'blue' },
  fontSize: { type: String, default: 'medium' },
  
  // Sharing and visibility
  isPublic: { type: Boolean, default: false },
  shareUrl: { type: String, unique: true, sparse: true },
  
  // Analytics
  views: { type: Number, default: 0 },
  downloads: { type: Number, default: 0 },
  
  // AI generation tracking
  aiGeneratedSections: [String], // Array of section IDs that were AI-generated
  
  // Metadata
  tags: [String],
  version: { type: Number, default: 1 },
  
}, {
  timestamps: true,
})

// Indexes
resumeSchema.index({ userId: 1, createdAt: -1 })
resumeSchema.index({ shareUrl: 1 })
resumeSchema.index({ isPublic: 1, createdAt: -1 })

// Pre-save middleware to generate share URL
resumeSchema.pre('save', function(next) {
  if (this.isPublic && !this.shareUrl) {
    this.shareUrl = generateShareUrl()
  }
  next()
})

// Methods
resumeSchema.methods.incrementViews = function() {
  this.views += 1
  return this.save()
}

resumeSchema.methods.incrementDownloads = function() {
  this.downloads += 1
  return this.save()
}

resumeSchema.methods.toPublicJSON = function() {
  const obj = this.toObject()
  delete obj.userId
  delete obj.__v
  return obj
}

// Static methods
resumeSchema.statics.findByUserId = function(userId) {
  return this.find({ userId }).sort({ updatedAt: -1 })
}

resumeSchema.statics.findPublicResumes = function(limit = 10) {
  return this.find({ isPublic: true })
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .select('-userId')
}

// Helper function to generate unique share URL
function generateShareUrl() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default mongoose.model('Resume', resumeSchema)
