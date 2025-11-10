import { contractService, UserToken } from './contractService';

export interface AssetBalance {
  asset: string;
  chain: string;
  balance: string;
  usdValue: number;
}

export interface Portfolio {
  tbaAddress: string;
  totalUsdValue: number;
  assets: AssetBalance[];
  lastUpdated: Date;
}

export interface Performance {
  totalYield: number;
  yieldPercentage: number;
  swapCount: number;
  successRate: number;
  avgSwapTime: number;
}

export interface YieldHistory {
  timestamp: Date;
  action: 'swap' | 'yield' | 'rebalance';
  fromAsset: string;
  toAsset: string;
  amount: string;
  yieldGenerated: number;
  txHash?: string;
}

class PortfolioService {
  /**
   * Get cross-chain balance for a TBA address
   */
  async getCrossChainBalance(tbaAddress: string): Promise<Portfolio> {
    // TODO: Integrate with actual blockchain queries and price feeds
    // For now, return mock data with real TBA address
    return {
      tbaAddress,
      totalUsdValue: 1250.75,
      assets: [
        {
          asset: 'ETH',
          chain: 'ethereum',
          balance: '0.5',
          usdValue: 800.00
        },
        {
          asset: 'MATIC',
          chain: 'polygon',
          balance: '500',
          usdValue: 450.75
        }
      ],
      lastUpdated: new Date()
    };
  }

  /**
   * Get portfolio for all user tokens
   */
  async getUserPortfolio(userAddress: string): Promise<{ tokens: UserToken[]; totalValue: number }> {
    const tokens = await contractService.getUserTokens(userAddress);
    let totalValue = 0;

    // Calculate total value across all TBAs
    for (const token of tokens) {
      if (token.tbaAddress && token.tbaAddress !== '0x0000000000000000000000000000000000000000') {
        const balance = await contractService.getTBABalance(token.tokenId);
        // Convert balance to USD (simplified)
        totalValue += parseFloat(balance) * 2000; // Assume ETH price
      }
    }

    return { tokens, totalValue };
  }

  /**
   * Track swap performance for a token
   */
  async trackSwapPerformance(tokenId: number): Promise<Performance> {
    const swaps = await contractService.getTokenSwaps(tokenId);
    const executedSwaps = swaps.filter(s => s.executed);
    
    return {
      totalYield: 125.50, // TODO: Calculate from actual swaps
      yieldPercentage: 12.5,
      swapCount: swaps.length,
      successRate: swaps.length > 0 ? (executedSwaps.length / swaps.length) * 100 : 0,
      avgSwapTime: 45000 // 45 seconds
    };
  }

  /**
   * Get yield history for a token
   */
  async getYieldHistory(tokenId: number): Promise<YieldHistory[]> {
    const swaps = await contractService.getTokenSwaps(tokenId);
    
    return swaps.map(swap => ({
      timestamp: new Date(swap.deadline * 1000 - 7 * 24 * 60 * 60 * 1000), // Approximate creation time
      action: 'swap' as const,
      fromAsset: swap.depositMethodId.split('-')[0],
      toAsset: swap.settleMethodId.split('-')[0],
      amount: swap.depositAmount,
      yieldGenerated: parseFloat(swap.minReturnAmount) * 0.05, // Simplified yield calculation
      txHash: swap.quoteId
    }));
  }

  /**
   * Calculate total yield for a token
   */
  async calculateTotalYield(tokenId: number): Promise<number> {
    const history = await this.getYieldHistory(tokenId);
    return history.reduce((total, entry) => total + entry.yieldGenerated, 0);
  }

  /**
   * Check if token can perform yield operations
   */
  async canTokenYield(tokenId: number): Promise<boolean> {
    return contractService.canPerformYield(tokenId);
  }
}

export const portfolioService = new PortfolioService();
