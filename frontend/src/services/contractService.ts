import { Contract, BrowserProvider } from 'ethers';
import { sideShiftService } from './sideShiftService';

export interface UserToken {
  tokenId: number;
  owner: string;
  tbaAddress: string;
  strategy: {
    name: string;
    minAPY: number;
    targetChains: string[];
    targetAssets: string[];
    active: boolean;
  };
}

export interface TokenSwap {
  quoteId: string;
  tokenOwner: string;
  tbaAddress: string;
  depositMethodId: string;
  settleMethodId: string;
  settleAddress: string;
  depositAmount: string;
  minReturnAmount: string;
  deadline: number;
  executed: boolean;
  cancelled: boolean;
}

class ContractService {
  private contract: Contract | null = null;
  private provider: BrowserProvider | null = null;

  setContract(contract: Contract, provider: BrowserProvider) {
    this.contract = contract;
    this.provider = provider;
  }

  /**
   * Get all tokens owned by user
   */
  async getUserTokens(userAddress: string): Promise<UserToken[]> {
    if (!this.contract) throw new Error('Contract not initialized');

    const balance = await this.contract.balanceOf(userAddress);
    const tokens: UserToken[] = [];

    // Get token IDs owned by user (simplified - in production use events/indexing)
    for (let i = 0; i < balance; i++) {
      try {
        const tokenId = i; // Simplified - would need proper token enumeration
        const owner = await this.contract.ownerOf(tokenId);
        
        if (owner.toLowerCase() === userAddress.toLowerCase()) {
          const details = await this.contract.getYieldSpiritDetails(tokenId);
          tokens.push({
            tokenId,
            owner: details.owner,
            tbaAddress: details.tba,
            strategy: {
              name: details.strategy.name,
              minAPY: Number(details.strategy.minAPY),
              targetChains: details.strategy.targetChains,
              targetAssets: details.strategy.targetAssets,
              active: details.strategy.active
            }
          });
        }
      } catch (error) {
        // Token doesn't exist or not owned by user
        break;
      }
    }

    return tokens;
  }

  /**
   * Execute yield strategy by creating SideShift swap
   */
  async executeYieldStrategy(tokenId: number, fromCoin: string, toCoin: string, fromNetwork: string, toNetwork: string, amount: string): Promise<void> {
    if (!this.contract) throw new Error('Contract not initialized');

    // Get token details
    const details = await this.contract.getYieldSpiritDetails(tokenId);
    if (!details.tba || details.tba === '0x0000000000000000000000000000000000000000') {
      throw new Error('TBA not associated with token');
    }

    // Create SideShift swap
    const shiftData = {
      settleAddress: details.tba, // TBA receives the swapped tokens
      depositCoin: fromCoin,
      settleCoin: toCoin,
      depositNetwork: fromNetwork,
      settleNetwork: toNetwork,
    };

    const shift = await sideShiftService.createVariableShift(shiftData);

    // Record swap in contract
    const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
    await this.contract.initiateSideShiftSwap(
      tokenId,
      shift.id,
      `${fromCoin}-${fromNetwork}`,
      `${toCoin}-${toNetwork}`,
      details.tba,
      amount,
      '0', // Min return amount (calculated by SideShift)
      deadline
    );
  }

  /**
   * Get swap history for a token
   */
  async getTokenSwaps(tokenId: number): Promise<TokenSwap[]> {
    if (!this.contract) throw new Error('Contract not initialized');

    const swaps = await this.contract.getSideShiftSwaps(tokenId);
    return swaps.map((swap: any) => ({
      quoteId: swap.quoteId,
      tokenOwner: swap.tokenOwner,
      tbaAddress: swap.tbaAddress,
      depositMethodId: swap.depositMethodId,
      settleMethodId: swap.settleMethodId,
      settleAddress: swap.settleAddress,
      depositAmount: swap.depositAmount.toString(),
      minReturnAmount: swap.minReturnAmount.toString(),
      deadline: Number(swap.deadline),
      executed: swap.executed,
      cancelled: swap.cancelled
    }));
  }

  /**
   * Check if NFT can perform yield operations
   */
  async canPerformYield(tokenId: number): Promise<boolean> {
    if (!this.contract) return false;

    try {
      const details = await this.contract.getYieldSpiritDetails(tokenId);
      return details.strategy.active && details.tba !== '0x0000000000000000000000000000000000000000';
    } catch {
      return false;
    }
  }

  /**
   * Get TBA balance for a token
   */
  async getTBABalance(tokenId: number): Promise<string> {
    if (!this.contract || !this.provider) return '0';

    const details = await this.contract.getYieldSpiritDetails(tokenId);
    if (!details.tba || details.tba === '0x0000000000000000000000000000000000000000') {
      return '0';
    }

    const balance = await this.provider.getBalance(details.tba);
    return balance.toString();
  }
}

export const contractService = new ContractService();
