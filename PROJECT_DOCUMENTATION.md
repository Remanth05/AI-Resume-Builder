# Resumier - AI-Powered Resume Builder

## 🚀 Project Overview

Resumier is a modern, full-stack web application that helps users create professional resumes using AI-powered content generation. Built with React, TypeScript, and a Node.js backend, it provides a seamless experience for resume creation, editing, and sharing.

## 📋 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast development build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM v6** - Client-side routing
- **Lucide React** - Beautiful SVG icons

### Authentication
- **Clerk** - Production authentication service
- **Demo Auth Provider** - Development/testing authentication

### AI & Content Generation
- **Google Gemini AI** - Advanced content generation
- **Custom AI Helper** - Resume content optimization

### PDF Generation
- **jsPDF** - PDF creation library
- **html2canvas** - HTML to canvas conversion

### Backend
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Node.js** - JavaScript runtime

## 🏗️ Project Structure

```
resumier/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AIHelper.tsx     # AI content generation helper
│   │   ├── AuthWrappers.tsx # Authentication wrapper components
│   │   ├── ClerkSetup.tsx   # Clerk configuration guide
│   │   ├── DemoAuthProvider.tsx # Demo authentication system
│   │   └── Navbar.tsx       # Navigation component
│   ├── pages/               # Application pages
│   │   ├── Dashboard.tsx    # User dashboard
│   │   ├── LandingPage.tsx  # Marketing landing page
│   │   ├── Profile.tsx      # User profile management
│   │   ├── ResumeBuilder.tsx # Resume creation/editing
│   │   └── SignIn.tsx       # Authentication page
│   ├── utils/               # Utility functions
│   │   ├── api.ts          # API communication layer
│   │   ├── geminiAI.ts     # AI integration utilities
│   │   └── pdfGenerator.ts # PDF export functionality
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── server/                  # Backend API
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── server.js           # Express server
└── public/                 # Static assets
```

## 🔐 Authentication System

The application uses a dual authentication approach:

### Production Mode (Clerk)
- Professional authentication service
- Supports social logins (Google, GitHub, etc.)
- User management and session handling
- Secure and compliant

### Development Mode (Demo Auth)
- Custom authentication provider for development
- Simulates user sessions without external dependencies
- Automatic fallback when Clerk keys are not configured

### Authentication Flow
1. User visits landing page (`/`)
2. Clicks "Sign In" → Redirects to `/sign-in`
3. After authentication → Redirects to `/dashboard`
4. After sign-out → Redirects back to landing page (`/`)

## 📱 Application Pages

### Landing Page (`/`)
- **Purpose**: Main marketing page and entry point
- **Access**: Public (all users)
- **Features**: 
  - Hero section with value proposition
  - Feature highlights
  - Call-to-action buttons
  - Statistics and social proof

### Sign In Page (`/sign-in`)
- **Purpose**: User authentication
- **Access**: Unauthenticated users only
- **Features**:
  - Beautiful sign-in form
  - Feature overview
  - Social proof elements

### Dashboard (`/dashboard`)
- **Purpose**: User's main workspace
- **Access**: Authenticated users only
- **Features**:
  - Resume management
  - Quick actions
  - User statistics

### Resume Builder (`/resume/:id?`)
- **Purpose**: Create and edit resumes
- **Access**: Authenticated users only
- **Features**:
  - AI-powered content generation
  - Real-time editing
  - Template selection
  - PDF export

### Profile (`/profile`)
- **Purpose**: User account management
- **Access**: Authenticated users only
- **Features**:
  - Personal information
  - Account settings
  - Resume preferences

## 🤖 AI Integration

### Google Gemini AI
- **Content Generation**: Creates professional resume content based on job titles, skills, and experience
- **Smart Suggestions**: Provides improvement recommendations
- **Industry-Specific**: Tailors content to specific industries and roles

### AI Helper Component
- Integrated throughout the application
- Context-aware suggestions
- Real-time content optimization

## 📄 PDF Generation

### Technology Stack
- **jsPDF**: Core PDF creation library
- **html2canvas**: Converts HTML resume to canvas for PDF embedding
- **Custom Styling**: Ensures print-friendly formatting

### Features
- High-quality PDF output
- Consistent formatting
- ATS-friendly layouts
- Instant download

## 🎨 Design System

### Color Palette
```css
primary: {
  50: '#eff6ff',   /* Lightest blue */
  100: '#dbeafe',
  ...
  600: '#2563eb',  /* Primary blue */
  ...
  900: '#1e3a8a'   /* Darkest blue */
}
```

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Responsive scaling**: Mobile-first approach
- **Hierarchy**: Clear heading and body text structure

### Components
- **Cards**: Consistent shadow and border radius
- **Buttons**: Primary, secondary, and ghost variants
- **Forms**: Styled inputs with validation states
- **Navigation**: Responsive navbar with mobile menu

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB (for backend)

### Environment Variables
```bash
# Frontend (.env)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_GOOGLE_AI_API_KEY=your_gemini_api_key

# Backend (server/.env)
MONGODB_URI=mongodb://localhost:27017/resumier
CLERK_SECRET_KEY=sk_test_your_clerk_secret
GOOGLE_AI_API_KEY=your_gemini_api_key
```

### Installation & Running
```bash
# Frontend
npm install
npm run dev

# Backend
cd server
npm install
npm run dev
```

## 🔒 Security Features

### Authentication Security
- Secure session management
- JWT token validation
- Protected API routes
- CORS configuration

### Data Protection
- Input validation and sanitization
- XSS prevention
- SQL injection protection
- Rate limiting

## 📊 Key Features

### Resume Management
- **Multiple Resumes**: Create and manage multiple resume versions
- **Template Selection**: Choose from professional templates
- **Version Control**: Track resume changes over time
- **Sharing**: Generate shareable links

### AI-Powered Content
- **Job-Specific Content**: Tailored to specific roles
- **Skills Optimization**: Suggests relevant skills
- **Achievement Writing**: Helps craft impactful bullet points
- **Industry Standards**: Follows best practices

### Export & Sharing
- **PDF Export**: High-quality PDF generation
- **Online Sharing**: Shareable resume links
- **Multiple Formats**: Various export options
- **Print Optimization**: Print-friendly layouts

## 🚀 Deployment

### Frontend Deployment
- **Vercel/Netlify**: Recommended for frontend
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`

### Backend Deployment
- **Railway/Heroku**: Recommended for backend
- **MongoDB Atlas**: Cloud database
- **Environment Variables**: Configure production keys

## 🧪 Testing

### Frontend Testing
- **Development**: Built-in Vite dev server
- **Build Testing**: `npm run build && npm run preview`
- **Linting**: ESLint configuration included

### Backend Testing
- **API Testing**: Jest and Supertest configured
- **Database Testing**: MongoDB memory server
- **Integration Tests**: Full API endpoint testing

## 📈 Performance Optimization

### Frontend
- **Code Splitting**: Lazy loading for routes
- **Image Optimization**: Responsive images and lazy loading
- **Bundle Analysis**: Vite bundle analyzer
- **Caching**: Service worker implementation ready

### Backend
- **Database Indexing**: Optimized MongoDB queries
- **Compression**: Gzip compression enabled
- **Rate Limiting**: API request throttling
- **Caching**: Redis integration ready

## 🔧 Configuration Files

### Tailwind Config (`tailwind.config.js`)
- Custom color palette
- Extended spacing and animations
- Custom fonts and utilities

### TypeScript Config (`tsconfig.json`)
- Strict type checking
- Path aliases configured
- Modern ES features enabled

### Vite Config (`vite.config.ts`)
- React plugin configuration
- Development server settings
- Build optimization

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile-First Approach
- Progressive enhancement
- Touch-friendly interactions
- Optimized performance

## 🔄 State Management

### Client State
- React hooks (useState, useEffect)
- Context API for auth state
- Local storage for preferences

### Server State
- API communication via Axios
- Error handling and retry logic
- Loading states management

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Resume Endpoints
- `GET /api/resumes` - List user resumes
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Endpoints
- `POST /api/ai/generate` - Generate content
- `POST /api/ai/improve` - Improve existing content
- `POST /api/ai/suggestions` - Get content suggestions

## 🎯 Future Enhancements

### Planned Features
- **Real-time Collaboration**: Multiple users editing
- **Template Marketplace**: User-generated templates
- **Analytics Dashboard**: Resume performance tracking
- **Mobile App**: Native mobile application
- **Integration APIs**: LinkedIn, GitHub integration

### Technical Improvements
- **Offline Support**: PWA implementation
- **Advanced AI**: GPT-4 integration
- **Better Performance**: React 19 features
- **Enhanced Security**: Additional security layers

---

## 📞 Support & Contact

For technical support or questions about the codebase:
- Review the documentation above
- Check the inline code comments
- Refer to component-specific README files
- Contact the development team

---

*This documentation is comprehensive and covers all aspects of the Resumier application. Keep it updated as the project evolves.*
