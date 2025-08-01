import { AuthSignedIn, AuthSignedOut, AuthSignInButton } from '../components/AuthWrappers'
import { Link } from 'react-router-dom'
import { 
  Sparkles, 
  Shield, 
  Download, 
  Share2, 
  Clock, 
  Users,
  Star,
  ArrowRight
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Build Your Perfect Resume with{' '}
              <span className="text-blue-600">AI Power</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create professional, ATS-friendly resumes in minutes. Let our AI help you 
              craft compelling content that gets you noticed by employers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <AuthSignedOut>
                <Link to="/sign-in">
                  <button className="btn-primary text-lg px-8 py-4">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>
              </AuthSignedOut>
              <AuthSignedIn>
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </AuthSignedIn>
              <button className="btn-secondary text-lg px-8 py-4">
                View Templates
              </button>
            </div>

            <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                50,000+ users
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-2 text-yellow-500" />
                4.9/5 rating
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                100% secure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Resumier?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes resume building effortless and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                AI-Powered Content
              </h3>
              <p className="text-gray-600">
                Generate compelling resume content based on your job title, skills, and experience with advanced AI technology.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                Your personal data is encrypted and protected. We follow strict privacy standards to keep your information safe.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Quick & Easy
              </h3>
              <p className="text-gray-600">
                Create a professional resume in under 10 minutes. No design skills required - just focus on your content.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Multiple Formats
              </h3>
              <p className="text-gray-600">
                Download your resume as PDF, share online, or export to various formats for different applications.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Easy Sharing
              </h3>
              <p className="text-gray-600">
                Share your resume with a custom link, embed it on your website, or send it directly to employers.
              </p>
            </div>

            <div className="card text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Multiple Versions
              </h3>
              <p className="text-gray-600">
                Create and manage multiple resume versions for different roles and industries from one dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Dream Resume?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who've landed their dream jobs with Resumier
          </p>
          <AuthSignedOut>
            <Link to="/sign-in">
              <button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-colors">
                Start Building Now - It's Free!
              </button>
            </Link>
          </AuthSignedOut>
          <AuthSignedIn>
            <Link
              to="/dashboard"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-colors inline-block"
            >
              Go to Your Dashboard
            </Link>
          </AuthSignedIn>
        </div>
      </section>
    </div>
  )
}
