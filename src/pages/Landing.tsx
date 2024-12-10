import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Shield, Users } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Welcome to AI Node Platform</h1>
          <p className="text-xl text-gray-600 mb-8">Choose how you want to interact with our AI platform</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-blue-50 mb-4">
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Node Runner</h2>
                <p className="text-gray-600 mb-6">
                  Contribute your API keys and earn rewards while helping others access AI capabilities
                </p>
                <Button
                  onClick={() => navigate('/login', { state: { type: 'pro' } })}
                  className="w-full"
                >
                  Become a Node Runner
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 rounded-full bg-yellow-50 mb-4">
                  <Zap className="h-8 w-8 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Chat Lite User</h2>
                <p className="text-gray-600 mb-6">
                  Access AI capabilities instantly without managing API keys
                </p>
                <Button
                  onClick={() => navigate('/login', { state: { type: 'lite' } })}
                  variant="secondary"
                  className="w-full"
                >
                  Start Chatting
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-8">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-gray-100 mb-4">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Community Powered</h4>
              <p className="text-gray-600">Node runners contribute API keys to power the network</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-gray-100 mb-4">
                <Zap className="h-6 w-6 text-gray-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Instant Access</h4>
              <p className="text-gray-600">Users can start chatting immediately without API keys</p>
            </div>
            <div className="text-center">
              <div className="inline-flex p-3 rounded-full bg-gray-100 mb-4">
                <Shield className="h-6 w-6 text-gray-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Fair Rewards</h4>
              <p className="text-gray-600">Node runners earn rewards based on usage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;