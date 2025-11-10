import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { AIOptimizationEngine } from '@/components/AIOptimizationEngine';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bot } from 'lucide-react';

const AIOptimization = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Bot className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">AI-Powered Yield Optimization</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Autonomous cross-chain yield optimization powered by machine learning and SideShift
            </p>
          </div>

          <AIOptimizationEngine />

          <div className="flex gap-4 justify-center pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/cross-chain-yield')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cross-Chain Yield
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIOptimization;