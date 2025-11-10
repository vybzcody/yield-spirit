import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useWallet } from '@/context/WalletContext';
import { useBlockchain } from '@/context/BlockchainContext';

const strategies = [
  { value: 'conservative', label: 'Conservative Staking', risk: 'Low', apy: '5-8%' },
  { value: 'balanced', label: 'Balanced LP', risk: 'Medium', apy: '10-15%' },
  { value: 'aggressive', label: 'Aggressive Farming', risk: 'High', apy: '20-40%' },
  { value: 'degen', label: 'Degen Yield Hunting', risk: 'Very High', apy: '50%+' }
];

export const MintNFTForm = () => {
  const [tokenName, setTokenName] = useState('');
  const [strategy, setStrategy] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  
  const { isConnected } = useWallet();
  const { mintYieldSpirit, isLoading } = useBlockchain();

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!tokenName.trim()) {
      toast.error('Please enter a token name');
      return;
    }

    if (!strategy) {
      toast.error('Please select a yield strategy');
      return;
    }

    setIsMinting(true);
    setMintSuccess(false);

    try {
      // Here we'll use a more detailed approach to simulate strategy setting after minting
      // In the real contract, minting doesn't include strategy setting, so we'll mint first
      await mintYieldSpirit();

      setMintSuccess(true);
      toast.success('YieldSpirit NFT minted successfully!', {
        description: `Your new NFT is ready to hunt yields!`
      });

      // Reset form after successful mint
      setTimeout(() => {
        setTokenName('');
        setStrategy('');
        setMintSuccess(false);
      }, 3000);
    } catch (error) {
      toast.error('An error occurred while minting');
    } finally {
      setIsMinting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Mint New YieldSpirit
          </CardTitle>
          <CardDescription>
            Connect your wallet to create a new Token-Bound Account for yield hunting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <WalletIcon className="h-12 w-12 text-muted" />
            </div>
            <p className="text-muted-foreground">Connect your wallet to mint a YieldSpirit NFT</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/connect'}
              className="gap-2"
            >
              <WalletIcon className="h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-lift shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Mint New YieldSpirit
        </CardTitle>
        <CardDescription>
          Create a new Token-Bound Account for yield hunting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleMint} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenName">Token Name</Label>
            <Input
              id="tokenName"
              placeholder="My YieldSpirit NFT"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              disabled={isMinting || isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy">Yield Strategy</Label>
            <Select value={strategy} onValueChange={setStrategy} disabled={isMinting || isLoading}>
              <SelectTrigger id="strategy">
                <SelectValue placeholder="Select a strategy" />
              </SelectTrigger>
              <SelectContent>
                {strategies.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>{s.label}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{s.risk}</span>
                        <span>•</span>
                        <span>{s.apy}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isMinting || mintSuccess || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isLoading || isMinting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Minting...
              </>
            ) : mintSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Minted Successfully!
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Mint NFT
              </>
            )}
          </Button>

          {strategy && (
            <div className="p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-1">Selected Strategy:</p>
              <p className="text-muted-foreground">
                {strategies.find(s => s.value === strategy)?.label} - {strategies.find(s => s.value === strategy)?.risk} Risk, {strategies.find(s => s.value === strategy)?.apy} APY
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};