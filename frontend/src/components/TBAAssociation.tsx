import { useState } from 'react';
import { Shield, Wallet, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useWallet } from '@/context/WalletContext';
import { useBlockchain } from '@/context/BlockchainContext';

export const TBAAssociation = () => {
  const [tokenId, setTokenId] = useState<string>('');
  const [tbaAddress, setTbaAddress] = useState<string>('');
  const [isAssociating, setIsAssociating] = useState(false);
  const [associationSuccess, setAssociationSuccess] = useState(false);
  
  const { isConnected } = useWallet();
  const { associateTBA, isLoading } = useBlockchain();

  const handleAssociate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!tokenId) {
      toast.error('Please enter a token ID');
      return;
    }

    if (!tbaAddress) {
      toast.error('Please enter a TBA address');
      return;
    }

    // Validate address format
    if (!tbaAddress.startsWith('0x') || tbaAddress.length !== 42) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    setIsAssociating(true);
    setAssociationSuccess(false);

    try {
      await associateTBA(parseInt(tokenId), tbaAddress);

      setAssociationSuccess(true);
      toast.success('TBA associated successfully!', {
        description: `Token ${tokenId} is now linked to ${tbaAddress}`
      });

      // Reset form after successful association
      setTimeout(() => {
        setTokenId('');
        setTbaAddress('');
        setAssociationSuccess(false);
      }, 3000);
    } catch (error) {
      toast.error('An error occurred while associating TBA');
    } finally {
      setIsAssociating(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Token Bound Account Association
          </CardTitle>
          <CardDescription>
            Connect your wallet to associate TBA addresses with your YieldSpirit NFTs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-muted" />
            </div>
            <p className="text-muted-foreground">Connect your wallet to manage TBA associations</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-lift shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Token Bound Account Association
        </CardTitle>
        <CardDescription>
          Associate a Token Bound Account address with your YieldSpirit NFT
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAssociate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tokenId">Token ID</Label>
            <Input
              id="tokenId"
              type="number"
              placeholder="Enter the token ID of your YieldSpirit NFT"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              disabled={isAssociating || isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tbaAddress">TBA Address</Label>
            <Input
              id="tbaAddress"
              placeholder="0x..."
              value={tbaAddress}
              onChange={(e) => setTbaAddress(e.target.value)}
              disabled={isAssociating || isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isAssociating || isLoading || associationSuccess}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {isLoading || isAssociating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Associating...
              </>
            ) : associationSuccess ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Associated Successfully!
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                Associate TBA
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};