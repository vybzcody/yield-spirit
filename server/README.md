# YieldSpirit Server

Backend services for the YieldSpirit autonomous yield farming system.

## Overview

The YieldSpirit server provides off-chain autonomous services that monitor NFTs and execute yield strategies, addressing the key issues with the previous architecture:

- **Autonomy**: NFTs can execute strategies without manual user intervention
- **Efficiency**: Off-chain decision making reduces blockchain costs and delays
- **Scalability**: Services can monitor and manage many NFTs simultaneously

## Architecture

```
┌─────────────────┐    ┌────────────────────┐
│   User Frontend │────│  YieldSpirit NFT   │
│                 │    │   (on-chain)       │
│   (Mint, View)  │    │ - Owner            │
│                 │    │ - Strategy params  │
└─────────────────┘    │ - TBA association  │
                       └────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │    YieldSpirit       │
                    │   Server (off-chain) │
                    │ - Monitors NFTs      │
                    │ - Executes strategies│
                    │ - Reports back       │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │   SideShift API      │
                    │ Cross-chain swaps    │
                    └──────────────────────┘
```

## Components

### 1. Autonomous Yield Service
- Monitors all YieldSpirit NFTs for active strategies
- Scans for profitable yield opportunities
- Executes strategies automatically when conditions are met
- Reports execution results on-chain

### 2. Main Server
- REST API for monitoring and status
- Coordinates background services
- Provides health checks and metrics

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration:
```env
# RPC Configuration
RPC_URL=http://localhost:8545

# Contract Configuration
YIELDSPIRIT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# SideShift API Configuration
SIDESHIFT_API_URL=https://sideshift.ai/api/v2

# Server Configuration
PORT=3001
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Standalone Autonomous Service
```bash
npm run autonomous
```

## API Endpoints

- `GET /api/health` - Server health status
- `GET /api/status` - Service status and metrics
- `GET /api/monitored-tokens` - List of currently monitored tokens

## Key Features

1. **Automatic Monitoring**: Continuously scans for new tokens and strategies
2. **Opportunity Detection**: Finds profitable yield opportunities across chains
3. **Autonomous Execution**: Executes strategies without user intervention
4. **Real-time Updates**: Keeps on-chain state synchronized with off-chain operations

## Configuration

- `RPC_URL`: Ethereum-compatible RPC endpoint
- `YIELDSPIRIT_CONTRACT_ADDRESS`: Deployed YieldSpirit contract address
- `SIDESHIFT_API_URL`: SideShift API endpoint
- `PORT`: Server port (default: 3001)

## Security Considerations

- The autonomous service only executes strategies that were set by the NFT owner
- All on-chain operations maintain the security model of the original architecture
- Token ownership is verified on-chain before any strategy execution