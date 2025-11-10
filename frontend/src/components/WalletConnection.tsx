import { Wallet, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/context/WalletContext';
import { useBlockchain } from '@/context/BlockchainContext';
import { toast } from 'sonner';

export const WalletConnection = () => {
  const { 
    account, 
    connectWallet, 
    disconnectWallet, 
    isConnected, 
    isLoading: walletLoading 
  } = useWallet();
  
  const { isLoading: blockchainLoading } = useBlockchain();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connectWallet();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.info('Wallet disconnected');
  };

  const combinedLoading = walletLoading || blockchainLoading;

  return (
    <Card className="hover-lift shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Wallet Connection
        </CardTitle>
        <CardDescription>
          Connect your wallet to access YieldSpirit features
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            disabled={combinedLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
          >
            {combinedLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <div>
                  <p className="text-sm font-medium font-mono">{truncateAddress(account || '')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">Connected</p>
              </div>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};