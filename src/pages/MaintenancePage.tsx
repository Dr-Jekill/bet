import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, ArrowLeft } from 'lucide-react';

interface MaintenancePageProps {
  type: 'house' | 'player';
  houseName?: string;
}

export default function MaintenancePage({ type, houseName }: MaintenancePageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            {type === 'house' ? (
              <AlertTriangle className="h-16 w-16 text-red-500" />
            ) : (
              <Clock className="h-16 w-16 text-yellow-500" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {type === 'house' 
              ? 'Subscription Required'
              : 'Temporarily Unavailable'}
          </h1>

          <div className="mb-8">
            {type === 'house' ? (
              <>
                <p className="text-gray-600 mb-4">
                  Your subscription has expired. Please contact the administrator to restore access to the platform.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    To reactivate your account, please make the corresponding payment to continue offering services to your players.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  {houseName} is currently undergoing maintenance.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    The platform will resume its services shortly. We apologize for any inconvenience.
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}