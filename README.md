# NeuroMint Platform

A decentralized platform that lets users submit GitHub project ideas, deposit ETH, and have AI analyze their repository for task completion.

## Features

- Smart contract-based project submission and reward system
- GitHub integration for repository monitoring
- AI-powered project validation
- MetaMask wallet integration
- Modern React frontend with shadcn/ui components

## Prerequisites

- Node.js 16+
- MetaMask wallet
- GitHub account
- Goerli testnet ETH

## Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_NEUROMINT_ADDRESS=      # Deployed contract address
NEXT_PUBLIC_GOERLI_RPC_URL=         # Goerli RPC URL (e.g., from Infura)
GITHUB_CLIENT_ID=                    # GitHub OAuth App client ID
GITHUB_CLIENT_SECRET=                # GitHub OAuth App client secret
OPENAI_API_KEY=                     # OpenAI API key
GITHUB_WEBHOOK_SECRET=              # GitHub webhook secret
PRIVATE_KEY=                        # Ethereum private key for contract deployment
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd neuromint
```

2. Install dependencies:
```bash
npm install
```

3. Deploy the smart contract:
```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network goerli
```

4. Start the development server:
```bash
npm run dev
```

## Smart Contract

The NeuroMint smart contract (`contracts/NeuroMint.sol`) includes:

- Fixed deposit amount (0.01 ETH)
- Project submission with deadline
- Reward release with bonus system
- Gas-optimized storage and functions

## Backend Service

The backend service (`src/server/services/neuromint.ts`) handles:

- GitHub webhook processing
- AI validation of project completion
- Smart contract interaction for reward release

## Frontend

The frontend (`src/app/neuromint/page.tsx`) provides:

- MetaMask wallet connection
- Project submission form
- Repository link and deadline input
- Real-time transaction status

## Usage

1. Connect your MetaMask wallet
2. Submit your GitHub repository link and project details
3. Set a deadline and deposit ETH
4. Make commits to your repository
5. AI will validate your progress
6. Receive your deposit back plus any bonus rewards upon completion

## Development

1. Make changes to the smart contract:
```bash
npx hardhat compile
npx hardhat test
```

2. Update frontend components:
```bash
npm run dev
```

3. Test webhook processing:
```bash
npm run test:webhook
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
"# Neuromint" 
