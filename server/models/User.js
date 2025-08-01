import mongoose from 'mongoose'

const userStatsSchema = new mongoose.Schema({
  totalResumes: { type: Number, default: 0 },
  totalDownloads: { type: Number, default: 0 },
  totalShares: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now },
})

const userPreferencesSchema = new mongoose.Schema({
  defaultTemplate: { type: String, default: 'modern' },
  defaultColorScheme: { type: String, default: 'blue' },
  emailNotifications: { type: Boolean, default: true },
  profilePublic: { type: Boolean, default: false },
  resumesSearchable: { type: Boolean, default: true },
  analyticsEnabled: { type: Boolean, default: true },
})

const userSchema = new mongoose.Schema({
  // Clerk user ID as primary identifier
  clerkId: { type: String, required: true, unique: true, index: true },
  
  // Basic user info (synced from Clerk)
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  imageUrl: String,
  
  // Professional information
  professionalTitle: String,
  bio: String,
  
  // User statistics
  stats: { type: userStatsSchema, default: {} },
  
  // User preferences
  preferences: { type: userPreferencesSchema, default: {} },
  
  // Subscription and limits
  plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
  resumeLimit: { type: Number, default: 5 }, // Free plan limit
  
  // Account status
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: Date.now },
  
}, {
  timestamps: true,
})

// Indexes
userSchema.index({ clerkId: 1 })
userSchema.index({ email: 1 })
userSchema.index({ 'stats.lastActiveAt': -1 })

// Instance methods
userSchema.methods.updateStats = function(statsUpdate) {
  Object.assign(this.stats, statsUpdate)
  this.stats.lastActiveAt = new Date()
  return this.save()
}

userSchema.methods.incrementResumeCount = function() {
  this.stats.totalResumes += 1
  this.stats.lastActiveAt = new Date()
  return this.save()
}

userSchema.methods.incrementDownloadCount = function() {
  this.stats.totalDownloads += 1
  this.stats.lastActiveAt = new Date()
  return this.save()
}

userSchema.methods.incrementShareCount = function() {
  this.stats.totalShares += 1
  this.stats.lastActiveAt = new Date()
  return this.save()
}

userSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date()
  this.stats.lastActiveAt = new Date()
  return this.save()
}

userSchema.methods.canCreateResume = function() {
  return this.stats.totalResumes < this.resumeLimit
}

userSchema.methods.toSafeJSON = function() {
  const obj = this.toObject()
  delete obj.__v
  return obj
}

// Static methods
userSchema.statics.findByClerkId = function(clerkId) {
  return this.findOne({ clerkId })
}

userSchema.statics.createFromClerk = function(clerkUserData) {
  return this.create({
    clerkId: clerkUserData.id,
    email: clerkUserData.emailAddresses[0]?.emailAddress || clerkUserData.primaryEmailAddress?.emailAddress,
    firstName: clerkUserData.firstName,
    lastName: clerkUserData.lastName,
    imageUrl: clerkUserData.imageUrl,
  })
}

userSchema.statics.getActiveUsers = function(days = 30) {
  const since = new Date()
  since.setDate(since.getDate() - days)
  
  return this.find({
    'stats.lastActiveAt': { $gte: since },
    isActive: true
  }).sort({ 'stats.lastActiveAt': -1 })
}

export default mongoose.model('User', userSchema)
