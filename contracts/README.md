# Monad Flow Contracts

Smart contracts for the Monad Flow platform.

## Contracts

### QuestManager.sol
Manages quest creation, completion verification, and reward distribution.

**Key Features:**
- Create quests with custom rewards
- Track quest completions
- Automatic reward distribution
- Platform fee mechanism
- Budget management

### BadgeNFT.sol
Soulbound NFT badges for user achievements and tier system.

**Key Features:**
- Non-transferable (soulbound) badges
- Multi-tier system (Free, KYC, Staker)
- Pre-defined badge types
- Achievement tracking

## Setup

```bash
cd contracts
npm install
```

## Compile

```bash
npm run compile
```

## Deploy

### Local (Hardhat Network)
```bash
npx hardhat run scripts/deploy.js
```

### Monad Devnet
1. Add your private key to `.env`:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

## Contract Addresses

After deployment, add the contract addresses to the main project's `.env`:

```
NEXT_PUBLIC_QUEST_MANAGER_CONTRACT=0x...
NEXT_PUBLIC_BADGE_NFT_CONTRACT=0x...
```

## Security Notes

- QuestManager uses ReentrancyGuard for all fund transfers
- BadgeNFT badges are soulbound (non-transferable)
- Platform fee is capped at 10%
- Only quest creators can withdraw remaining funds
- Only contract owner can mint badges
