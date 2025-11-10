import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { TBAAssociation } from '@/components/TBAAssociation';
import { NFTDetailsQuery } from '@/components/NFTDetailsQuery';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TBA = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Token Bound Account Management</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Associate TBA addresses with your YieldSpirit NFTs and view detailed token information.
            </p>
          </div>

          <div className="max-w-2xl mx-auto grid grid-cols-1 gap-6">
            <TBAAssociation />
            <NFTDetailsQuery />
          </div>

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

export default TBA;