import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { MintNFTForm } from '@/components/MintNFTForm';
import { NFTCollection } from '@/components/NFTCollection';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Shield } from 'lucide-react';

const Mint = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Create Your YieldSpirit NFT</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Mint a new Token-Bound Account NFT and select your preferred yield hunting strategy
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <MintNFTForm />
          </div>

          <div className="pt-8">
            <NFTCollection />
          </div>

          <div className="max-w-2xl mx-auto bg-muted/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Token Bound Account Management</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              After minting, associate a Token Bound Account with your NFT to enable autonomous yield execution.
            </p>
            <Button 
              onClick={() => navigate('/tba')}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Shield className="mr-2 h-4 w-4" />
              Manage TBAs
            </Button>
          </div>

          <div className="flex gap-4 justify-center pt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/connect')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Connect
            </Button>
            <Button
              size="lg"
              onClick={() => navigate('/strategy')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Explore Strategies
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Mint;