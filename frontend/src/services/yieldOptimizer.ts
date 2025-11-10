import { sideShiftService, Coin, Pair } from './sideShiftService';

export interface YieldOpportunity {
  fromCoin: string;
  toCoin: string;
  fromNetwork: string;
  toNetwork: string;
  estimatedAPY: number;
  swapRate: string;
  minAmount: string;
  maxAmount: string;
}

export interface SwapPath {
  fromCoin: string;
  toCoin: string;
  fromNetwork: string;
  toNetwork: string;
  rate: string;
  minAmount: string;
  maxAmount: string;
}

export interface Strategy {
  name: string;
  minAPY: number;
  targetChains: string[];
  targetAssets: string[];
  active: boolean;
}

class YieldOptimizer {
  private readonly MIN_YIELD_THRESHOLD = 500; // 5% APY in basis points

  /**
   * Scan for yield opportunities across supported chains
   */
  async scanYieldOpportunities(chains: string[]): Promise<YieldOpportunity[]> {
    const coins = await sideShiftService.getCoins();
    const opportunities: YieldOpportunity[] = [];

    // Filter coins by target chains
    const targetCoins = coins.filter(coin => 
      coin.networks.some(network => chains.includes(network))
    );

    for (const fromCoin of targetCoins.slice(0, 10)) { // Limit for performance
      for (const fromNetwork of fromCoin.networks) {
        for (const toCoin of targetCoins.slice(0, 5)) {
          for (const toNetwork of toCoin.networks) {
            if (fromCoin.coin !== toCoin.coin || fromNetwork !== toNetwork) {
              try {
                const pair = await sideShiftService.getPair(
                  fromCoin.coin, 
                  toCoin.coin, 
                  fromNetwork, 
                  toNetwork
                );
                const estimatedAPY = this.calculateEstimatedAPY(pair.rate);
                
                if (estimatedAPY > this.MIN_YIELD_THRESHOLD) {
                  opportunities.push({
                    fromCoin: fromCoin.coin,
                    toCoin: toCoin.coin,
                    fromNetwork,
                    toNetwork,
                    estimatedAPY,
                    swapRate: pair.rate,
                    minAmount: pair.min,
                    maxAmount: pair.max
                  });
                }
              } catch (error) {
                console.warn(`Failed to get pair for ${fromCoin.coin}-${fromNetwork} -> ${toCoin.coin}-${toNetwork}`);
              }
            }
          }
        }
      }
    }

    return opportunities.sort((a, b) => b.estimatedAPY - a.estimatedAPY);
  }

  /**
   * Calculate optimal swap path between coins
   */
  async calculateOptimalSwapPath(
    fromCoin: string, 
    toCoin: string, 
    fromNetwork: string, 
    toNetwork: string
  ): Promise<SwapPath> {
    const pair = await sideShiftService.getPair(fromCoin, toCoin, fromNetwork, toNetwork);
    
    return {
      fromCoin,
      toCoin,
      fromNetwork,
      toNetwork,
      rate: pair.rate,
      minAmount: pair.min,
      maxAmount: pair.max
    };
  }

  /**
   * Execute yield strategy for a specific token
   */
  async executeYieldStrategy(tokenId: number, strategy: Strategy): Promise<void> {
    const opportunities = await this.scanYieldOpportunities(strategy.targetChains);
    const validOpportunities = opportunities.filter(opp => 
      opp.estimatedAPY >= strategy.minAPY &&
      strategy.targetAssets.includes(opp.toCoin)
    );

    if (validOpportunities.length === 0) {
      throw new Error('No valid yield opportunities found for strategy');
    }

    // Execute the highest yield opportunity
    const bestOpportunity = validOpportunities[0];
    console.log(`Executing yield strategy for token ${tokenId}:`, bestOpportunity);
    
    // TODO: Integrate with TBA contract execution
  }

  /**
   * Rebalance portfolio based on yield opportunities
   */
  async rebalancePortfolio(tokenId: number): Promise<void> {
    // TODO: Get current portfolio from TBA
    // TODO: Calculate optimal rebalancing
    // TODO: Execute rebalancing swaps
    console.log(`Rebalancing portfolio for token ${tokenId}`);
  }

  private calculateEstimatedAPY(rate: string): number {
    // Simplified APY calculation - in reality would factor in:
    // - Historical volatility
    // - Liquidity depth
    // - Protocol-specific yields
    const rateNum = parseFloat(rate);
    return Math.max(0, (rateNum - 1) * 10000); // Convert to basis points
  }
}

export const yieldOptimizer = new YieldOptimizer();
