import { useState } from 'react'
import { useAuthUser } from '../components/AuthWrappers'
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Trash2, 
  Save,
  Download,
  Eye,
  EyeOff
} from 'lucide-react'

export default function Profile() {
  const { user } = useAuthUser()
  const [activeTab, setActiveTab] = useState('personal')
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    resumeReminders: true,
    marketingEmails: false,
  })
  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    resumesSearchable: true,
    analyticsEnabled: true,
  })

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Export', icon: Download },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and privacy settings</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'personal' && (
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600">Update your personal details and profile information</p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={user?.firstName || ''}
                      className="input-field"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={user?.lastName || ''}
                      className="input-field"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.primaryEmailAddress?.emailAddress || ''}
                    className="input-field"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineer, Product Manager"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us a bit about yourself..."
                    className="input-field resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-4">
                    Note: Name and email are managed through your Clerk account. 
                    Use the user menu in the top right to update these fields.
                  </p>
                  <button type="submit" className="btn-primary">
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                  <p className="text-gray-600">Control how your information is shared and used</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Public Profile</h3>
                    <p className="text-sm text-gray-600">Allow others to view your basic profile information</p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, profilePublic: !privacy.profilePublic })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.profilePublic ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacy.profilePublic ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Resume Discoverability</h3>
                    <p className="text-sm text-gray-600">Allow recruiters to find your resumes in search results</p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, resumesSearchable: !privacy.resumesSearchable })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.resumesSearchable ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacy.resumesSearchable ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-600">Help us improve the platform with anonymous usage data</p>
                  </div>
                  <button
                    onClick={() => setPrivacy({ ...privacy, analyticsEnabled: !privacy.analyticsEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      privacy.analyticsEnabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        privacy.analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-4">
                  <button className="btn-primary">
                    <Save className="h-5 w-5 mr-2" />
                    Save Privacy Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Bell className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                  <p className="text-gray-600">Choose what notifications you'd like to receive</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Updates</h3>
                    <p className="text-sm text-gray-600">Receive updates about new features and improvements</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, emailUpdates: !notifications.emailUpdates })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.emailUpdates ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Resume Reminders</h3>
                    <p className="text-sm text-gray-600">Get reminded to update your resume regularly</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, resumeReminders: !notifications.resumeReminders })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.resumeReminders ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.resumeReminders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between py-4 border-b border-gray-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                    <p className="text-sm text-gray-600">Receive promotional content and special offers</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, marketingEmails: !notifications.marketingEmails })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications.marketingEmails ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-4">
                  <button className="btn-primary">
                    <Save className="h-5 w-5 mr-2" />
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="card">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
                  <p className="text-gray-600">Download your data or manage your account</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Export Your Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download all your resumes, personal information, and account data in a portable format.
                  </p>
                  <button className="btn-secondary">
                    <Download className="h-5 w-5 mr-2" />
                    Download Data Export
                  </button>
                </div>

                <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="text-lg font-medium text-red-900 mb-3">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. This action cannot be undone.
                  </p>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    <Trash2 className="h-5 w-5 mr-2" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
