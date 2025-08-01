# Resumier - AI-Powered Resume Builder

Resumier is a modern, full-stack web application that enables users to create, manage, and share professional resumes with the power of artificial intelligence. Built with cutting-edge technologies and designed for both developers and end-users.

## 🚀 Features

### Core Functionality
- **AI-Powered Content Generation**: Leverage Gemini AI to generate compelling resume content
- **Secure Authentication**: Clerk-based authentication with social login support
- **Real-time Resume Builder**: Interactive drag-and-drop resume creation
- **Multiple Templates**: Professional, modern, and customizable resume templates
- **PDF Export**: High-quality PDF generation with print optimization
- **Resume Sharing**: Public sharing with custom URLs and analytics
- **Multi-device Access**: Responsive design for desktop, tablet, and mobile

### AI Features
- Professional summary generation based on job title and experience
- Achievement-focused bullet points for work experience
- Industry-relevant skill suggestions
- Content improvement and optimization
- Smart content recommendations

### User Experience
- Clean, intuitive interface built with Tailwind CSS
- Real-time preview while editing
- Auto-save functionality
- Version control for multiple resume variants
- Dashboard with analytics and insights
- Privacy controls and data export (GDPR compliant)

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

### Backend
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Node.js** - JavaScript runtime environment

### Authentication & AI
- **Clerk** - Complete authentication and user management
- **Gemini AI** - Google's generative AI for content creation

### Additional Tools
- **html2canvas** & **jsPDF** - PDF generation
- **Lucide React** - Beautiful icon library
- **ESLint** & **TypeScript** - Code quality and type checking

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud instance)
- Clerk account for authentication
- Google AI Studio account for Gemini AI API

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/resumier.git
cd resumier
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory:
```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Backend API
VITE_API_URL=http://localhost:5000/api

# MongoDB
MONGODB_URI=mongodb://localhost:27017/resumier

# JWT Secret
JWT_SECRET=your_jwt_secret

# Environment
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 5. Start the Development Servers

**Frontend (Vite):**
```bash
npm run dev
```

**Backend (Express):**
```bash
npm run server
# or in the server directory:
cd server && npm run dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000`.

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your preferred hosting platform
3. Set environment variables in your hosting platform

### Backend Deployment (Railway/Heroku/DigitalOcean)
1. Deploy the `server` directory
2. Set all required environment variables
3. Ensure MongoDB connection is properly configured

### Database Setup
- **Local**: Install MongoDB locally
- **Cloud**: Use MongoDB Atlas for cloud database
- The application will automatically create collections on first run

## 📁 Project Structure

```
resumier/
├── src/                    # Frontend source code
│   ├── components/         # Reusable React components
│   ├── pages/             # Main application pages
│   ├── utils/             # Utility functions and API clients
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── server/                # Backend source code
│   ├── models/            # MongoDB models
│   ├── routes/            # Express routes
│   ├── middleware/        # Custom middleware
│   └── server.js          # Express server
├── public/                # Static assets
├── dist/                  # Built frontend (after npm run build)
└── docs/                  # Documentation
```

## 🔧 API Documentation

### Authentication Endpoints
- `GET /api/auth/verify` - Verify authentication status
- `GET /api/auth/profile` - Get user profile

### Resume Endpoints
- `GET /api/resumes` - Get all user resumes
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/share` - Share resume publicly
- `GET /api/resumes/public/:shareUrl` - Get public resume

### AI Endpoints
- `POST /api/ai/generate/summary` - Generate professional summary
- `POST /api/ai/generate/experience` - Generate job descriptions
- `POST /api/ai/generate/skills` - Generate skill suggestions
- `POST /api/ai/improve` - Improve existing content

### User Endpoints
- `GET /api/users/dashboard` - Get dashboard statistics
- `GET /api/users/preferences` - Get user preferences
- `PUT /api/users/preferences` - Update preferences
- `GET /api/users/export` - Export user data

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server && npm test

# Run linting
npm run lint
```

## 🔒 Security Features

- **Input Validation**: Express-validator for all API endpoints
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet.js**: Security headers for Express
- **Data Encryption**: Secure handling of sensitive information
- **Authentication**: Clerk-based secure authentication
- **GDPR Compliance**: Data export and deletion capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure code passes linting and type checks
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/your-username/resumier/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/resumier/discussions)
- **Email**: support@resumier.com

## 🙏 Acknowledgments

- [Clerk](https://clerk.dev) for authentication services
- [Google AI](https://ai.google.dev) for Gemini AI API
- [Tailwind CSS](https://tailwindcss.com) for styling
- [React](https://reactjs.org) community for excellent documentation
- [MongoDB](https://mongodb.com) for database services

---

**Resumier** - Building careers with AI-powered resumes ✨
