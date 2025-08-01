import { Link, useLocation } from 'react-router-dom'
import { AuthSignedIn, AuthSignedOut, AuthSignInButton, AuthUserButton } from './AuthWrappers'
import { FileText, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Resumier</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <AuthSignedIn>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/resume"
                className={`text-sm font-medium transition-colors ${
                  isActive('/resume')
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Create Resume
              </Link>
              {isUsingDemo ? <AuthUserButton /> : <AuthUserButton afterSignOutUrl="/" />}
            </AuthSignedIn>
            <AuthSignedOut>
              <AuthSignInButton mode="modal">
                <button className="btn-primary">
                  Sign In
                </button>
              </AuthSignInButton>
            </AuthSignedOut>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <AuthSignedIn>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/resume"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Resume
                </Link>
                <div className="pt-2">
                  <AuthUserButton afterSignOutUrl="/" />
                </div>
              </AuthSignedIn>
              <AuthSignedOut>
                <AuthSignInButton mode="modal">
                  <button className="btn-primary w-full">
                    Sign In
                  </button>
                </AuthSignInButton>
              </AuthSignedOut>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
