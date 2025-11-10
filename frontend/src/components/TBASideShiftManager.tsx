import { useState, useEffect } from 'react';
import { 
  Shield, 
  Coins, 
  Zap, 
  Clock, 
  CheckCircle2, 
  XCircle,
  RotateCcw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useBlockchain } from '@/context/BlockchainContext';
import { SideShiftSwap } from '@/components/SideShiftSwap';

interface SideShiftSwapDetails {
  quoteId: string;
  tokenOwner: string;
  tbaAddress: string;
  depositMethodId: string;
  settleMethodId: string;
  settleAddress: string;
  depositAmount: number;
  minReturnAmount: number;
  deadline: number;
  executed: boolean;
  cancelled: boolean;
}

export const TBASideShiftManager = () => {
  const [tokenId, setTokenId] = useState<string>('');
  const [tbaAddress, setTbaAddress] = useState<string>('');
  const [swaps, setSwaps] = useState<SideShiftSwapDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [executingSwap, setExecutingSwap] = useState<number | null>(null);
  const [cancellingSwap, setCancellingSwap] = useState<number | null>(null);
  
  const {
    getSideShiftSwaps,
    executeSideShiftSwap,
    cancelSideShiftSwap,
    yieldSpiritContract
  } = useBlockchain();

  const loadSwaps = async () => {
    if (!tokenId || !yieldSpiritContract) return;

    setLoading(true);
    try {
      const swapsData = await getSideShiftSwaps(parseInt(tokenId));
      setSwaps(swapsData);
    } catch (error) {
      console.error('Error loading swaps:', error);
      toast.error('Failed to load swaps');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteSwap = async (index: number) => {
    if (!tokenId) return;

    setExecutingSwap(index);
    try {
      await executeSideShiftSwap(parseInt(tokenId), index);
      toast.success('Swap executed successfully!');
      // Reload swaps to reflect the change
      await loadSwaps();
    } catch (error) {
      console.error('Error executing swap:', error);
      toast.error('Failed to execute swap');
    } finally {
      setExecutingSwap(null);
    }
  };

  const handleCancelSwap = async (index: number) => {
    if (!tokenId) return;

    setCancellingSwap(index);
    try {
      await cancelSideShiftSwap(parseInt(tokenId), index);
      toast.success('Swap cancelled successfully!');
      // Reload swaps to reflect the change
      await loadSwaps();
    } catch (error) {
      console.error('Error cancelling swap:', error);
      toast.error('Failed to cancel swap');
    } finally {
      setCancellingSwap(null);
    }
  };

  const getStatusColor = (executed: boolean, cancelled: boolean) => {
    if (cancelled) return 'text-destructive';
    if (executed) return 'text-success';
    return 'text-warning';
  };

  const getStatusBadge = (executed: boolean, cancelled: boolean) => {
    if (cancelled) return <Badge variant="destructive">Cancelled</Badge>;
    if (executed) return <Badge variant="default">Executed</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* TBA Swap Management */}
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            TBA SideShift Management
          </CardTitle>
          <CardDescription>
            Manage SideShift swaps for your Token Bound Account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Token ID</label>
                <input
                  type="number"
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                  className="w-full p-2 border rounded bg-background"
                  placeholder="Enter token ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">TBA Address</label>
                <input
                  value={tbaAddress}
                  onChange={(e) => setTbaAddress(e.target.value)}
                  className="w-full p-2 border rounded bg-background font-mono text-sm"
                  placeholder="TBA address"
                />
              </div>
            </div>

            <Button
              onClick={loadSwaps}
              disabled={loading || !tokenId}
              className="w-full"
            >
              {loading ? (
                <>
                  <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                  Loading Swaps...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Load SideShift Swaps
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Swaps List */}
      {swaps.length > 0 && (
        <Card className="hover-lift shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-primary" />
              Active SideShift Swaps
            </CardTitle>
            <CardDescription>
              Swaps initiated for your TBA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {swaps.map((swap, index) => (
                <div 
                  key={index} 
                  className="p-4 border rounded-lg bg-muted/30"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">Swap #{index + 1}</h4>
                        {getStatusBadge(swap.executed, swap.cancelled)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quote ID</p>
                          <p className="font-mono truncate">{swap.quoteId}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">From</p>
                          <p>{swap.depositMethodId.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">To</p>
                          <p>{swap.settleMethodId.toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p>{swap.depositAmount}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 md:w-auto">
                      {!swap.executed && !swap.cancelled && (
                        <Button
                          size="sm"
                          onClick={() => handleExecuteSwap(index)}
                          disabled={executingSwap === index}
                          variant="default"
                          className="w-full"
                        >
                          {executingSwap === index ? (
                            <RotateCcw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Execute
                            </>
                          )}
                        </Button>
                      )}
                      
                      {!swap.executed && !swap.cancelled && (
                        <Button
                          size="sm"
                          onClick={() => handleCancelSwap(index)}
                          disabled={cancellingSwap === index}
                          variant="outline"
                          className="w-full"
                        >
                          {cancellingSwap === index ? (
                            <RotateCcw className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* SideShift Swap Interface */}
      <Card className="hover-lift shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Create New SideShift Swap
          </CardTitle>
          <CardDescription>
            Initiate a cross-chain swap for your TBA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SideShiftSwap />
        </CardContent>
      </Card>
    </div>
  );
};