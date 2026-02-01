# CRESCO 💎

**Real Users. Real Yield. Zero Bots.**

CRESCO is a performance-based user acquisition platform built on the Monad Blockchain. It connects Web3 projects with verified human users through ZK-KYC identity and anti-farming shields, ensuring authentic engagement and efficient reward distribution.

![CRESCO](https://img.shields.io/badge/Status-Production%20Ready-0066FF?style=for-the-badge) ![Monad](https://img.shields.io/badge/Blockchain-Monad-836EF9?style=for-the-badge)

## 🌟 Key Features

*   **🛡️ Sybil Resistance:** Advanced bot detection and ZK-KYC identity verification.
*   **⚡ Instant Payouts:** Leveraging Monad's 10,000 TPS for real-time reward distribution.
*   **🎯 Quest System:** On-chain and off-chain quests with automated verification.
*   **🏆 Badge NFTs:** Soulbound tokens (SBTs) representing user achievements and reputation.
*   **💎 Multi-Tier System:** Progression system including Free, KYC Verified, and Staker tiers.
*   **🎨 Modern UI:** Sleek, glassmorphism-inspired interface optimized for user experience.

demo: https://skyl0rc.github.io/CRESCO
      https://www.canva.com/design/DAG__x3qu1w/H4r5MH-yYL4erBs8UYlxNw/edit?utm_content=DAG__x3qu1w&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton 
      


## 🛠️ Technology Stack

### Frontend
*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Framer Motion
*   **Web3 Integration:** RainbowKit, wagmi, viem

### Backend & Database
*   **Database:** Supabase (PostgreSQL)
*   **Security:** Row Level Security (RLS) policies
*   **Storage:** Supabase Storage for assets

### Blockchain / Smart Contracts
*   **Network:** Monad Devnet
*   **Contracts:** Solidity 0.8.20
*   **Framework:** Hardhat
*   **Libraries:** OpenZeppelin (ERC721, AccessControl, ReentrancyGuard)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js 18+
*   npm or pnpm
*   A Web3 wallet (e.g., MetaMask, Rabby)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cresco.git
    cd cresco
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Install smart contract dependencies:**
    ```bash
    cd contracts
    npm install
    cd ..
    ```

### Configuration

1.  **Environment Variables:**
    Copy `.env.example` to `.env.local` and fill in the required values:
    ```bash
    cp .env.example .env.local
    ```
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
    *   `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`: Get one from Reown (formerly WalletConnect).
    *   `NEXT_PUBLIC_QUEST_MANAGER_CONTRACT`: (Optional) Contract address after deployment.
    *   `NEXT_PUBLIC_BADGE_NFT_CONTRACT`: (Optional) Contract address after deployment.

2.  **Database Setup:**
    *   Use the SQL scripts in `src/lib/supabase/schema.sql` to set up your Supabase tables.
    *   (Optional) Seed initial data using `supabase/seeds.sql`.

### Running the Application

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Smart Contracts

The project uses two main smart contracts located in `contracts/contracts`:

1.  **QuestManager.sol:** Handles quest creation, budget management (deposit/withdraw), and reward distribution.
2.  **BadgeNFT.sol:** A Soulbound Token (SBT) contract for minting user achievement badges.

To deploy contracts:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network localhost # or monad_devnet
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features or bug fixes.

## 📄 License

This project is licensed under the MIT License.

---

**Built with 💜 on Monad**
