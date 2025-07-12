import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from './RegisterForm';

export default function Navigation() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <div>
        <RegisterForm />
        <div className="text-center mt-4">
          <button
            onClick={() => setShowRegister(false)}
            className="text-blue-600 hover:text-blue-500"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-4">
        <button
          onClick={() => setShowRegister(true)}
          className="text-blue-600 hover:text-blue-500"
        >
          Don't have an account? Sign up
        </button>
      </div>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">CRM Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={logout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}