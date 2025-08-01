import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthUser } from '../components/AuthWrappers'
import { 
  Plus, 
  FileText, 
  Calendar, 
  Download, 
  Share2, 
  Edit3,
  Trash2,
  Eye
} from 'lucide-react'

interface Resume {
  id: string
  title: string
  jobTitle: string
  updatedAt: string
  createdAt: string
  isPublic: boolean
}

export default function Dashboard() {
  const { user } = useAuthUser()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch user's resumes from API
    // For now, using mock data
    const mockResumes: Resume[] = [
      {
        id: '1',
        title: 'Software Engineer Resume',
        jobTitle: 'Frontend Developer',
        updatedAt: '2024-01-15',
        createdAt: '2024-01-10',
        isPublic: false
      },
      {
        id: '2',
        title: 'Product Manager Resume',
        jobTitle: 'Senior Product Manager',
        updatedAt: '2024-01-12',
        createdAt: '2024-01-08',
        isPublic: true
      }
    ]
    
    setTimeout(() => {
      setResumes(mockResumes)
      setLoading(false)
    }, 1000)
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your resumes and track your job applications
          </p>
        </div>
        <Link to="/resume" className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Create New Resume
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Resumes</p>
              <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Download className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Share2 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Shares</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumes Grid */}
      <div className="mb-8">
        <h2 className="section-title">Your Resumes</h2>
        
        {resumes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first resume
            </p>
            <div className="mt-6">
              <Link to="/resume" className="btn-primary">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Resume
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {resume.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{resume.jobTitle}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      Updated {formatDate(resume.updatedAt)}
                    </div>
                  </div>
                  {resume.isPublic && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Public
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Link
                      to={`/resume/${resume.id}`}
                      className="text-blue-600 hover:text-blue-700 p-1"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>
                    <button
                      className="text-green-600 hover:text-green-700 p-1"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="text-purple-600 hover:text-purple-700 p-1"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      className="text-orange-600 hover:text-orange-700 p-1"
                      title="Share"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/resume"
            className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <Plus className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Create New Resume</p>
              <p className="text-sm text-gray-600">Start from scratch or use a template</p>
            </div>
          </Link>
          
          <button className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
            <Download className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Download All</p>
              <p className="text-sm text-gray-600">Export all resumes as ZIP</p>
            </div>
          </button>
          
          <Link
            to="/profile"
            className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <Edit3 className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Update Profile</p>
              <p className="text-sm text-gray-600">Manage your account settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
