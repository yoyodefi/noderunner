import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { useAuthStore } from './store/authStore';
import { AuthGuard } from './components/auth/AuthGuard';
import NodeDashboard from './pages/NodeDashboard';
import ChatInterface from './pages/ChatInterface';
import ChatLite from './pages/ChatLite';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Landing from './pages/Landing';

const queryClient = new QueryClient();

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <AuthGuard requiresPro>
                    <NodeDashboard />
                  </AuthGuard>
                }
              />
              <Route
                path="/chat"
                element={
                  <AuthGuard requiresPro>
                    <ChatInterface />
                  </AuthGuard>
                }
              />
              <Route
                path="/chat-lite"
                element={
                  <AuthGuard>
                    <ChatLite />
                  </AuthGuard>
                }
              />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;