import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Zap, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { auth } from '../config/firebase';
import { Button } from './ui/Button';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isProUser, userType, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      if (user?.providerId === 'metamask') {
        // Just clear the auth state for MetaMask users
        logout();
      } else {
        // Use Firebase signOut for other providers
        await auth.signOut();
      }
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user || location.pathname === '/' || location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={isProUser ? '/dashboard' : '/chat-lite'} className="font-bold text-xl">
              AI Node Platform
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isProUser && (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                    location.pathname === '/dashboard' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                    location.pathname === '/chat' 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare size={20} />
                  Chat Pro
                </Link>
              </>
            )}
            {userType === 'lite' && (
              <Link
                to="/chat-lite"
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  location.pathname === '/chat-lite' 
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Zap size={20} />
                Chat Lite
              </Link>
            )}

            <div className="flex items-center gap-4 ml-4 pl-4 border-l">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium">
                  {user.displayName || user.email}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600"
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;