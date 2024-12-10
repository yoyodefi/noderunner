import React from 'react';
import { Settings } from 'lucide-react';
import { ApiKeyManager } from '../components/ApiKeyManager';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UsageChart } from '../components/UsageChart';

function NodeDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Node Runner Dashboard</h1>
        <Button>
          <Settings size={20} className="mr-2" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">API Keys</h2>
          </Card.Header>
          <Card.Content>
            <ApiKeyManager />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <h2 className="text-lg font-semibold">Token Usage</h2>
          </Card.Header>
          <Card.Content>
            <UsageChart />
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

export default NodeDashboard;