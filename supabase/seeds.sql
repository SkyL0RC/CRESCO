-- Test Data for Monad Flow
-- Run this in Supabase SQL Editor to populate initial data

-- Insert Sample Projects
INSERT INTO projects (wallet_address, name, description, website_url, category, is_verified, total_budget) VALUES
('0x742d35cc6634c0532925a3b844bc9e7595f0beb', 'MonadSwap', 'Leading DEX on Monad blockchain with lowest fees and best liquidity', 'https://monadswap.xyz', 'DeFi', true, 10000.00),
('0x8ba1f109551bd432803012645ac136ddd64dba72', 'MonadNFT', 'First NFT marketplace on Monad with zero gas fees', 'https://monadnft.io', 'NFT', true, 5000.00),
('0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed', 'MonadLend', 'Decentralized lending protocol with algorithmic interest rates', 'https://monadlend.finance', 'DeFi', false, 8000.00)
ON CONFLICT (id) DO NOTHING;

-- Get project IDs (you'll need to update these after insert)
-- For now, we'll use owner_wallet without project_id

-- Insert Sample Quests
INSERT INTO quests (
  owner_wallet,
  title,
  description,
  category,
  difficulty,
  reward_amount,
  base_reward,
  kyc_bonus,
  staker_bonus,
  total_budget,
  budget_spent,
  status,
  requires_kyc,
  requires_staking,
  max_completions,
  total_completions,
  verification_method,
  steps,
  image_url
) VALUES
(
  '0x742d35cc6634c0532925a3b844bc9e7595f0beb',
  'Make Your First Swap',
  'Connect your wallet and make your first token swap on MonadSwap. Minimum swap amount: $10 equivalent.',
  'DeFi',
  'Easy',
  1.50,
  1.00,
  0.30,
  0.20,
  1500.00,
  0.00,
  'Active',
  false,
  false,
  1000,
  0,
  'on-chain',
  '[
    {"step": 1, "title": "Connect Wallet", "description": "Connect your Web3 wallet"},
    {"step": 2, "title": "Visit MonadSwap", "description": "Go to monadswap.xyz"},
    {"step": 3, "title": "Make a Swap", "description": "Swap minimum $10 worth of tokens"},
    {"step": 4, "title": "Return & Claim", "description": "Come back and claim your reward"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800'
),
(
  '0x742d35cc6634c0532925a3b844bc9e7595f0beb',
  'Provide Liquidity $100+',
  'Become a liquidity provider on MonadSwap by adding at least $100 in liquidity to any pool.',
  'DeFi',
  'Medium',
  5.00,
  3.00,
  1.00,
  1.00,
  3000.00,
  0.00,
  'Active',
  true,
  false,
  500,
  0,
  'on-chain',
  '[
    {"step": 1, "title": "Select Pool", "description": "Choose a trading pair"},
    {"step": 2, "title": "Add Liquidity", "description": "Add minimum $100 liquidity"},
    {"step": 3, "title": "Confirm Transaction", "description": "Approve the transaction"},
    {"step": 4, "title": "Claim Reward", "description": "Return to claim your reward"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800'
),
(
  '0x8ba1f109551bd432803012645ac136ddd64dba72',
  'Mint Your First NFT',
  'Create and mint your first NFT on MonadNFT marketplace. Show your creativity!',
  'NFT',
  'Easy',
  2.00,
  1.50,
  0.50,
  0.00,
  2000.00,
  0.00,
  'Active',
  false,
  false,
  750,
  0,
  'on-chain',
  '[
    {"step": 1, "title": "Connect Wallet", "description": "Connect your wallet to MonadNFT"},
    {"step": 2, "title": "Upload Artwork", "description": "Upload your NFT image or artwork"},
    {"step": 3, "title": "Mint NFT", "description": "Complete the minting process"},
    {"step": 4, "title": "Claim Reward", "description": "Return and claim your reward"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800'
),
(
  '0x8ba1f109551bd432803012645ac136ddd64dba72',
  'Buy an NFT',
  'Purchase any NFT from the MonadNFT marketplace to support creators.',
  'NFT',
  'Easy',
  1.00,
  0.80,
  0.20,
  0.00,
  1000.00,
  0.00,
  'Active',
  false,
  false,
  1000,
  0,
  'on-chain',
  '[
    {"step": 1, "title": "Browse Marketplace", "description": "Find an NFT you like"},
    {"step": 2, "title": "Purchase NFT", "description": "Complete the purchase"},
    {"step": 3, "title": "Confirm Ownership", "description": "NFT appears in your wallet"},
    {"step": 4, "title": "Claim Reward", "description": "Return for your reward"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800'
),
(
  '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed',
  'Supply Assets to MonadLend',
  'Supply at least $50 worth of assets to MonadLend protocol and start earning interest.',
  'DeFi',
  'Medium',
  3.00,
  2.00,
  0.50,
  0.50,
  2500.00,
  0.00,
  'Active',
  true,
  true,
  400,
  0,
  'on-chain',
  '[
    {"step": 1, "title": "Connect Wallet", "description": "Connect to MonadLend"},
    {"step": 2, "title": "Choose Asset", "description": "Select asset to supply"},
    {"step": 3, "title": "Supply Funds", "description": "Supply minimum $50"},
    {"step": 4, "title": "Claim Reward", "description": "Return for reward"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800'
),
(
  '0x742d35cc6634c0532925a3b844bc9e7595f0beb',
  'Daily Trading Challenge',
  'Make at least 3 trades in a single day on MonadSwap.',
  'DeFi',
  'Hard',
  10.00,
  7.00,
  2.00,
  1.00,
  5000.00,
  0.00,
  'Active',
  false,
  true,
  200,
  0,
  'on-chain',
  '[
    {"step": 1, "title": "Start Trading", "description": "Begin your trading day"},
    {"step": 2, "title": "Complete 3 Trades", "description": "Make 3 successful swaps"},
    {"step": 3, "title": "Verify Activity", "description": "Wait for on-chain confirmation"},
    {"step": 4, "title": "Claim Reward", "description": "Return for your reward"}
  ]'::jsonb,
  'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800'
)
ON CONFLICT (id) DO NOTHING;

-- Insert a test user (optional)
INSERT INTO users (wallet_address, username, total_earned, quest_completed_count, reputation_score, is_kyc_verified) VALUES
('0x742d35cc6634c0532925a3b844bc9e7595f0beb', 'TestUser', 0.00, 0, 0, false)
ON CONFLICT (wallet_address) DO NOTHING;

-- Verify data
SELECT 'Projects:', COUNT(*) FROM projects;
SELECT 'Quests:', COUNT(*) FROM quests;
SELECT 'Users:', COUNT(*) FROM users;
