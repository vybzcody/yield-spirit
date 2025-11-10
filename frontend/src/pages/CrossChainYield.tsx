import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { CrossChainYieldOptimizer } from '@/components/CrossChainYieldOptimizer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap } from 'lucide-react';

const CrossChainYield = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Zap className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Cross-Chain Yield Optimization</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Leverage SideShift's 200+ assets across 40+ chains for maximum yield potential
            </p>
          </div>

          <CrossChainYieldOptimizer />

          <div className="flex gap-4 justify-center pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/strategy')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Strategies
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CrossChainYield;