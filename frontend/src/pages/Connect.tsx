import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { WalletConnection } from '@/components/WalletConnection';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const Connect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
            <p className="text-lg text-muted-foreground">
              Connect your Ethereum wallet to start creating YieldSpirit NFTs and accessing DeFi yield opportunities
            </p>
          </div>

          <WalletConnection />

          <div className="flex gap-4 justify-center pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/mint')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue to Mint
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 text-center space-y-2">
            <p className="font-semibold">What's Next?</p>
            <p className="text-sm text-muted-foreground">
              After connecting your wallet, you'll be able to mint YieldSpirit NFTs and configure automated yield strategies
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Connect;
