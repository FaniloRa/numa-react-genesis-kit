
import React from 'react';
import { useAuth } from '@/lib/auth';
import { Bell } from 'lucide-react';

const TopBar: React.FC = () => {
  const { auth } = useAuth();

  return (
    <div className="w-full bg-white shadow-sm py-2.5 px-4 flex justify-between items-center">
      <div className="flex-1" /> {/* Empty div for spacing */}
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
            2
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {auth.user ? auth.user.firstName[0] : 'U'}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">
              {auth.user ? `${auth.user.firstName} ${auth.user.lastName}` : 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {auth.user?.role || 'Non connecté'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
