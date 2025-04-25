
import React from 'react';
import { useAuth } from '@/lib/auth';
import { Bell, User } from 'lucide-react';

const TopBar: React.FC = () => {
  const { auth } = useAuth();

  return (
    <div className="w-full bg-white shadow-sm py-3 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">I-Numa</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="text-gray-600 hover:text-gray-800 cursor-pointer" />
          {/* Add notification badge if needed */}
        </div>
        <div className="flex items-center space-x-2">
          <User className="text-gray-600" />
          <span className="text-sm font-medium">
            {auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : 'Utilisateur'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
