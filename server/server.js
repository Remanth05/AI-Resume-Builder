import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { ClerkExpressWithAuth } from '@clerk/backend'

// Import routes
import authRoutes from './routes/auth.js'
import resumeRoutes from './routes/resumes.js'
import aiRoutes from './routes/ai.js'
import userRoutes from './routes/users.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Middleware
app.use(compression())
app.use(morgan('combined'))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/resumier', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/resumes', ClerkExpressWithAuth(), resumeRoutes)
app.use('/api/ai', ClerkExpressWithAuth(), aiRoutes)
app.use('/api/users', ClerkExpressWithAuth(), userRoutes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err)
  
  // Clerk authentication errors
  if (err.status === 401) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }
  
  // MongoDB errors
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return res.status(500).json({ error: 'Database error' })
  }
  
  // Default error
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📍 API available at http://localhost:${PORT}/api`)
})

export default app
