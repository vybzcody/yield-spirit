# YieldSpirit - ERC-6551 Yield Hunting NFT with SideShift API Integration

YieldSpirit is an innovative ERC-6551 NFT that enables yield-hunting across multiple blockchains using the SideShift API. The project implements a token-bound account system that allows NFTs to own assets and execute yield strategies autonomously.

## Deployed Contracts (Sepolia Testnet)

- **YieldSpirit NFT**: `0x0945B3dd5CD2b631A7595bA882C08Debdf33207C`
- **ERC6551 Registry**: `0xe94260c4E5ADbECF63305704ba431d73DE2ABB4f`
- **ERC6551 Account Implementation**: `0x1aB8637E7BF13B277f21a9d40d602c0239c4BA92`

**Network**: Sepolia Testnet (Chain ID: 11155111)  
**Explorer**: https://sepolia.etherscan.io/

## Current Implementation

- **ERC-6551 Architecture**: Full token-bound account implementation with registry and executable accounts
- **NFT Minting**: ERC-721 based NFT creation with unique yield strategies
- **Strategy Management**: Configurable yield strategies with target chains and assets
- **SideShift API Integration**: Cross-chain swap functionality for yield optimization (200+ assets, 40+ chains)
- **Frontend Dashboard**: Complete React UI for minting, strategy configuration, and portfolio management
- **Multi-Chain Ready**: Architecture designed for deployment across 40+ chains
- **Token-Bound Accounts**: NFTs can own and manage assets independently
- **AI-Driven Optimization**: Machine learning engine for yield optimization
- **Cross-Chain Yield Farming**: Automated yield farming across multiple chains
- **SideShiftSwap Component**: Real-time integration with SideShift's cross-chain swap infrastructure
- **TBA-SideShift Manager**: Token Bound Account management with SideShift integration
- **Portfolio Tracking**: Cross-chain portfolio tracking and management
- **Automated Rebalancing**: Algorithmic portfolio rebalancing driven by AI
- **DeFi Protocol Integration**: Integration with Aave, Compound, Uniswap, Curve, Lido and more protocols

## Project Structure

```
yieldSpirit/
├── contracts/                 # Smart contracts
│   ├── ERC6551Registry.sol    # ERC-6551 Registry contract
│   ├── ERC6551Account.sol     # Token-bound account implementation
│   └── YieldSpirit.sol        # Main NFT contract
├── test/                      # Contract tests
│   └── YieldSpirit.test.js    # Test suite
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── context/           # Blockchain context
│   │   ├── components/        # React components
│   │   └── services/          # API services
│   └── ...
├── scripts/                   # Deployment scripts
├── artifacts/                 # Contract artifacts
└── ...
```

## Setup Instructions

### Smart Contracts

1. Navigate to the root directory:
   ```bash
   cd /home/groot/Code/akindo/sideshift/yieldSpirit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile contracts:
   ```bash
   npx hardhat compile
   ```

4. Run tests:
   ```bash
   npx hardhat test
   ```

5. Deploy contracts to Sepolia:
   ```bash
   PRIVATE_KEY=your_private_key npx hardhat run scripts/deploy.js --network sepolia
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd /home/groot/Code/akindo/sideshift/yieldSpirit/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the contract address:
   ```
   VITE_YIELDSPIRIT_CONTRACT_ADDRESS=0x0945B3dd5CD2b631A7595bA882C08Debdf33207C
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. To build for production:
   ```bash
   npm run build
   ```

## Architecture

### Smart Contracts

1. **ERC6551Registry.sol**: Implements the canonical ERC-6551 registry for deterministic account creation
2. **ERC6551Account.sol**: Token-bound account implementation with execution capabilities
3. **YieldSpirit.sol**: ERC-721 contract with yield strategy management functionality

### Frontend

- **BlockchainContext**: Manages wallet connection and contract interactions
- **YieldSpiritDashboard**: Main UI component for minting and configuring strategies
- **SideShift Integration**: Real-time cross-chain swap functionality
- **Contract Service**: Bridges smart contracts with SideShift API

## SideShift API Integration

The system integrates with the SideShift API for cross-chain yield optimization. The TBA (token-bound account) can execute swaps and yield farming operations autonomously based on user-defined strategies.

## Development

For local development, use Hardhat's local node for testing:

```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Run frontend
cd frontend && npm run dev
```

## Testing

Run the contract tests with:
```bash
npx hardhat test
```

## Deployment

The application is deployed via GitHub Actions to Netlify. Set these GitHub secrets:

- `NETLIFY_AUTH_TOKEN` - Your Netlify access token
- `NETLIFY_SITE_ID` - Your Netlify site ID  
- `VITE_YIELDSPIRIT_CONTRACT_ADDRESS` - Contract address (set to deployed address above)

## Future Enhancements

- Automated yield-hunting with AI-driven optimization
- Advanced yield opportunity scanning across DeFi protocols
- Auto-execution of yield strategies via TBA accounts
- Enhanced cross-chain yield farming with rebalancing
- Governance integration for community-driven strategy parameters
- Advanced analytics and performance tracking