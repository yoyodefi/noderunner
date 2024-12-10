import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AuthError } from './AuthError';

interface LoginModalProps {
  onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
  const { setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (!accounts[0]) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      // Request signature to verify ownership
      const message = `Sign this message to verify your wallet ownership\nTimestamp: ${Date.now()}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, accounts[0]],
      });

      if (!signature) {
        throw new Error('Signature required to verify wallet ownership');
      }

      // Create custom user object for MetaMask
      const user = {
        uid: accounts[0],
        email: null,
        displayName: `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        photoURL: null,
        providerId: 'metamask',
        metadata: {
          address: accounts[0],
          signature,
          signedMessage: message,
        },
      };

      setUser(user as any);
    } catch (error: any) {
      console.error('MetaMask login error:', error);
      setError(error.message || 'Failed to connect with MetaMask');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6">Welcome to AI Node Platform</h2>
        
        {error && <AuthError message={error} />}
        
        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </Button>

          <Button
            onClick={handleMetaMaskLogin}
            disabled={isLoading}
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
          >
            <img src="/metamask.svg" alt="MetaMask" className="w-5 h-5" />
            Connect with MetaMask
          </Button>
        </div>

        <p className="mt-4 text-sm text-gray-500 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>

        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </Card>
    </div>
  );
}