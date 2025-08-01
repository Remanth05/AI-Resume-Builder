import { AlertTriangle, ExternalLink, Copy } from 'lucide-react'
import { useState } from 'react'

export default function ClerkSetup() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clerk Setup Required</h1>
              <p className="text-gray-600">Authentication service needs to be configured</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">What is Clerk?</h3>
              <p className="text-blue-800 text-sm">
                Clerk provides secure authentication, user management, and session handling for modern applications. 
                It's required for Resumier to manage user accounts and protect your resume data.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Setup Steps:</h3>
              
              <ol className="space-y-4 text-sm">
                <li className="flex">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  <div>
                    <p className="font-medium">Create a free Clerk account</p>
                    <a 
                      href="https://dashboard.clerk.com/sign-up" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center mt-1"
                    >
                      Sign up at Clerk Dashboard <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </li>

                <li className="flex">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  <div>
                    <p className="font-medium">Create a new application</p>
                    <p className="text-gray-600">Choose "React" as your framework when prompted</p>
                  </div>
                </li>

                <li className="flex">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                  <div>
                    <p className="font-medium">Get your Publishable Key</p>
                    <a 
                      href="https://dashboard.clerk.com/last-active?path=api-keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center mt-1"
                    >
                      View API Keys <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </li>

                <li className="flex">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                  <div>
                    <p className="font-medium">Set your environment variable</p>
                    <div className="mt-2 bg-gray-100 rounded p-3 font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span>VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here</span>
                        <button
                          onClick={() => copyToClipboard('VITE_CLERK_PUBLISHABLE_KEY=pk_test_')}
                          className="text-gray-500 hover:text-gray-700"
                          title="Copy to clipboard"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {copied && (
                      <p className="text-green-600 text-xs mt-1">Copied to clipboard!</p>
                    )}
                  </div>
                </li>

                <li className="flex">
                  <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">5</span>
                  <div>
                    <p className="font-medium">Restart the development server</p>
                    <p className="text-gray-600">The app will automatically detect the new key</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Why Clerk?</h3>
              <ul className="text-green-800 text-sm space-y-1">
                <li>• Free tier with 10,000 monthly active users</li>
                <li>• Social logins (Google, GitHub, etc.)</li>
                <li>• Built-in security and compliance</li>
                <li>• No credit card required to start</li>
              </ul>
            </div>

            <div className="text-center pt-4">
              <p className="text-gray-500 text-sm">
                Current environment variable: 
                <code className="bg-gray-100 px-2 py-1 rounded text-xs ml-1">
                  {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'Not set'}
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
