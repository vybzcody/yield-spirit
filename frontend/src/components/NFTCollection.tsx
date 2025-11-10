import { useState, useEffect } from 'react';
import { Loader2, Grid3x3, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NFTCard } from './NFTCard';
import { type TokenDetails } from '@/lib/mockData'; // Keeping this for type definition
import { useWallet } from '@/context/WalletContext';
import { useBlockchain } from '@/context/BlockchainContext';

export const NFTCollection = () => {
  const [nfts, setNfts] = useState<any[]>([]); // Using any for now to handle blockchain response structure
  const [loading, setLoading] = useState(true);
  const { isConnected } = useWallet();
  const { account, yieldSpiritContract } = useBlockchain();

  useEffect(() => {
    const loadNFTs = async () => {
      if (!isConnected || !yieldSpiritContract || !account) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Get the balance (number of NFTs owned by the account)
        const balance = await yieldSpiritContract.balanceOf(account);
        const nftCount = Number(balance);

        if (nftCount === 0) {
          setNfts([]);
          setLoading(false);
          return;
        }

        // Get all token IDs owned by the account
        const userNFTs = [];
        for (let i = 0; i < nftCount; i++) {
          try {
            // Get the token ID at the given index for the owner
            const tokenId = await yieldSpiritContract.tokenOfOwnerByIndex(account, i);
            // Get detailed token info
            const tokenDetails = await yieldSpiritContract.getYieldSpiritDetails(tokenId);
            
            // Format the NFT data to match the TokenDetails interface
            const nftData = {
              tokenId: Number(tokenId),
              owner: tokenDetails[0],
              metadata: {
                name: `YieldSpirit #${tokenId}`,
                description: 'An ERC-6551 Token-Bound Account for yield hunting',
                attributes: [
                  { trait_type: 'Strategy', value: 'Dynamic Yield Farming' },
                  { trait_type: 'Risk Level', value: 'Medium' },
                  { trait_type: 'APY Potential', value: '25%' }
                ]
              },
              assets: [
                { token: 'ETH', balance: '1.25' },
                { token: 'USDC', balance: '2500.00' },
                { token: 'YIELD', balance: '500.0' }
              ],
              imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${tokenId}`
            };
            
            userNFTs.push(nftData);
          } catch (error) {
            console.error(`Error fetching details for token at index ${i}:`, error);
          }
        }

        setNfts(userNFTs);
      } catch (error) {
        console.error('Error loading NFTs:', error);
        // If there's an error, we could show empty array or fallback data
        setNfts([]);
      } finally {
        setLoading(false);
      }
    };

    loadNFTs();
  }, [isConnected, yieldSpiritContract, account]);

  const handleViewDetails = (tokenId: number) => {
    console.log('Viewing details for token:', tokenId);
  };

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Grid3x3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Your YieldSpirit Collection</h2>
          </div>
        </div>
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <WalletIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">Connect wallet to view your NFTs</p>
          <p className="text-sm text-muted-foreground mt-2">Your YieldSpirit NFTs will be displayed here</p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/connect'}
            className="mt-4 gap-2"
          >
            <WalletIcon className="h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Your YieldSpirit Collection</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4 animate-pulse">
              <div className="aspect-square bg-muted rounded-lg animate-shimmer" />
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-shimmer" />
                <div className="h-3 bg-muted rounded w-2/3 animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Your YieldSpirit Collection</h2>
        </div>
        <p className="text-sm text-muted-foreground">{nfts.length} NFT{nfts.length !== 1 ? 's' : ''}</p>
      </div>

      {nfts.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Grid3x3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No YieldSpirit NFTs found</p>
          <p className="text-sm text-muted-foreground mt-2">Mint your first NFT to get started!</p>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/mint'}
            className="mt-4"
          >
            Mint NFT
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft, index) => (
            <div
              key={nft.tokenId}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <NFTCard token={nft} onViewDetails={handleViewDetails} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};