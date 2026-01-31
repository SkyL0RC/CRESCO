-- ===============================================
-- Monad Flow - Database Migration
-- Add Smart Contract Integration Columns
-- ===============================================

-- 1. Add contract integration columns to quests table
ALTER TABLE quests
ADD COLUMN IF NOT EXISTS contract_quest_id INTEGER,
ADD COLUMN IF NOT EXISTS tx_hash TEXT;

-- 2. Add comment for documentation
COMMENT ON COLUMN quests.contract_quest_id IS 'Quest ID from QuestManager smart contract';
COMMENT ON COLUMN quests.tx_hash IS 'Transaction hash from quest creation on blockchain';

-- 3. Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_quests_contract_quest_id ON quests(contract_quest_id);
CREATE INDEX IF NOT EXISTS idx_quests_tx_hash ON quests(tx_hash);

-- ===============================================
-- Verification Queries
-- ===============================================
-- Run these to verify the migration succeeded:

-- Check if columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quests'
  AND column_name IN ('contract_quest_id', 'tx_hash');

-- Check sample data
SELECT id, title, contract_quest_id, tx_hash, created_at
FROM quests
LIMIT 5;
