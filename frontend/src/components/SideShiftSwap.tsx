import React, { useState, useEffect } from 'react';
import { sideShiftService, Coin, CreateVariableShiftData, Shift } from '../services/sideShiftService';
import { contractService } from '../services/contractService';
import { useBlockchain } from '../context/BlockchainContext';

interface SideShiftSwapProps {
  tokenId?: number | null;
  onSwapCreated?: (shift: Shift) => void;
}

export const SideShiftSwap: React.FC<SideShiftSwapProps> = ({ tokenId, onSwapCreated }) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedFromCoin, setSelectedFromCoin] = useState<string>('');
  const [selectedToCoin, setSelectedToCoin] = useState<string>('');
  const [selectedFromNetwork, setSelectedFromNetwork] = useState<string>('');
  const [selectedToNetwork, setSelectedToNetwork] = useState<string>('');
  const [settleAddress, setSettleAddress] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState<string>('');
  const [tbaAddress, setTbaAddress] = useState<string>('');

  const { yieldSpiritContract, provider } = useBlockchain();

  useEffect(() => {
    loadCoins();
  }, []);

  useEffect(() => {
    if (tokenId && yieldSpiritContract && provider) {
      contractService.setContract(yieldSpiritContract, provider);
      loadTokenTBA();
    }
  }, [tokenId, yieldSpiritContract, provider]);

  useEffect(() => {
    if (selectedFromCoin && selectedToCoin && selectedFromNetwork && selectedToNetwork) {
      loadRate();
    }
  }, [selectedFromCoin, selectedToCoin, selectedFromNetwork, selectedToNetwork]);

  const loadCoins = async () => {
    try {
      const coinsData = await sideShiftService.getCoins();
      setCoins(coinsData.slice(0, 20)); // Limit for UI performance
    } catch (error) {
      console.error('Failed to load coins:', error);
    }
  };

  const loadTokenTBA = async () => {
    if (!tokenId) return;
    
    try {
      const details = await contractService.contract?.getYieldSpiritDetails(tokenId);
      if (details?.tba && details.tba !== '0x0000000000000000000000000000000000000000') {
        setTbaAddress(details.tba);
        setSettleAddress(details.tba); // Auto-set TBA as settle address
      }
    } catch (error) {
      console.error('Failed to load token TBA:', error);
    }
  };

  const loadRate = async () => {
    try {
      const pair = await sideShiftService.getPair(
        selectedFromCoin, 
        selectedToCoin, 
        selectedFromNetwork, 
        selectedToNetwork
      );
      setRate(pair.rate);
    } catch (error) {
      console.error('Failed to load rate:', error);
      setRate('');
    }
  };

  const handleCreateSwap = async () => {
    if (!selectedFromCoin || !selectedToCoin || !selectedFromNetwork || !selectedToNetwork || !settleAddress) return;

    setLoading(true);
    try {
      const swapData: CreateVariableShiftData = {
        depositCoin: selectedFromCoin,
        settleCoin: selectedToCoin,
        depositNetwork: selectedFromNetwork,
        settleNetwork: selectedToNetwork,
        settleAddress,
      };

      const shift = await sideShiftService.createVariableShift(swapData);
      
      // If we have a token ID, record the swap in the contract
      if (tokenId && contractService.contract) {
        const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days
        await contractService.contract.initiateSideShiftSwap(
          tokenId,
          shift.id,
          `${selectedFromCoin}-${selectedFromNetwork}`,
          `${selectedToCoin}-${selectedToNetwork}`,
          settleAddress,
          shift.depositMin || '0',
          '0', // Min return amount
          deadline
        );
      }

      onSwapCreated?.(shift);
      alert(`Swap created! Deposit ${selectedFromCoin} to: ${shift.depositAddress}`);
    } catch (error) {
      console.error('Failed to create swap:', error);
      alert('Failed to create swap');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableNetworks = (coinSymbol: string): string[] => {
    const coin = coins.find(c => c.coin === coinSymbol);
    return coin?.networks || [];
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        Cross-Chain Swap
        {tokenId && <span className="text-sm text-muted-foreground ml-2">(Token #{tokenId})</span>}
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">From Coin</label>
            <select 
              value={selectedFromCoin} 
              onChange={(e) => {
                setSelectedFromCoin(e.target.value);
                setSelectedFromNetwork('');
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select coin to send</option>
              {coins.map(coin => (
                <option key={coin.coin} value={coin.coin}>
                  {coin.name} ({coin.coin})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">From Network</label>
            <select 
              value={selectedFromNetwork} 
              onChange={(e) => setSelectedFromNetwork(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={!selectedFromCoin}
            >
              <option value="">Select network</option>
              {getAvailableNetworks(selectedFromCoin).map(network => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">To Coin</label>
            <select 
              value={selectedToCoin} 
              onChange={(e) => {
                setSelectedToCoin(e.target.value);
                setSelectedToNetwork('');
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select coin to receive</option>
              {coins.map(coin => (
                <option key={coin.coin} value={coin.coin}>
                  {coin.name} ({coin.coin})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To Network</label>
            <select 
              value={selectedToNetwork} 
              onChange={(e) => setSelectedToNetwork(e.target.value)}
              className="w-full p-2 border rounded-md"
              disabled={!selectedToCoin}
            >
              <option value="">Select network</option>
              {getAvailableNetworks(selectedToCoin).map(network => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
          </div>
        </div>

        {rate && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="text-sm text-blue-800">
              Exchange Rate: 1 {selectedFromCoin} = {rate} {selectedToCoin}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">
            Receive Address
            {tbaAddress && <span className="text-xs text-muted-foreground ml-2">(Auto-filled with TBA)</span>}
          </label>
          <input
            type="text"
            value={settleAddress}
            onChange={(e) => setSettleAddress(e.target.value)}
            placeholder="Enter destination address"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <button
          onClick={handleCreateSwap}
          disabled={!selectedFromCoin || !selectedToCoin || !selectedFromNetwork || !selectedToNetwork || !settleAddress || loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating Swap...' : 'Create Swap'}
        </button>
      </div>
    </div>
  );
};
