import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LoginModal } from '../components/auth/LoginModal';

function Login() {
  const [showModal, setShowModal] = useState(true);
  const { user, userType, setUserType } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set user type from location state
    const type = location.state?.type as 'pro' | 'lite';
    if (type) {
      setUserType(type);
    }
  }, [location.state, setUserType]);

  useEffect(() => {
    // Redirect based on user type after login
    if (user && userType) {
      if (userType === 'pro') {
        navigate('/dashboard');
      } else {
        navigate('/chat-lite');
      }
    }
  }, [user, userType, navigate]);

  const handleClose = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div>
      {showModal && <LoginModal onClose={handleClose} />}
    </div>
  );
}

export default Login;