-- Monad Flow Complete Database Schema
-- This schema matches the comprehensive version from eklenecekler.md
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  avatar_url TEXT,
  bio TEXT,
  total_earned DECIMAL(18, 2) DEFAULT 0,
  quest_completed_count INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  is_kyc_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  category TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  total_budget DECIMAL(18, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QUESTS TABLE
CREATE TABLE IF NOT EXISTS quests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  owner_wallet TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT,
  difficulty TEXT,
  
  -- Rewards (IN MON)
  reward_amount DECIMAL(18, 2) NOT NULL,
  base_reward DECIMAL(18, 2) NOT NULL,
  kyc_bonus DECIMAL(18, 2) DEFAULT 0,
  staker_bonus DECIMAL(18, 2) DEFAULT 0,
  
  -- Budget
  total_budget DECIMAL(18, 2) NOT NULL,
  budget_spent DECIMAL(18, 2) DEFAULT 0,
  
  -- Requirements
  requires_kyc BOOLEAN DEFAULT FALSE,
  requires_staking BOOLEAN DEFAULT FALSE,
  
  -- Operational
  status TEXT DEFAULT 'Active',
  max_completions INTEGER,
  total_completions INTEGER DEFAULT 0,
  verification_method TEXT DEFAULT 'on-chain',
  steps JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QUEST COMPLETIONS TABLE
CREATE TABLE IF NOT EXISTS quest_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quest_id UUID REFERENCES quests(id),
  user_wallet TEXT NOT NULL,
  reward_claimed BOOLEAN DEFAULT FALSE,
  reward_amount DECIMAL(18, 2) NOT NULL,
  tx_hash TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(quest_id, user_wallet)
);

-- BADGES TABLE
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_wallet TEXT NOT NULL,
  badge_type TEXT NOT NULL,
  metadata JSONB,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_wallet, badge_type)
);

-- DAILY CHECKINS TABLE
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_wallet TEXT NOT NULL,
  checkin_date DATE NOT NULL,
  points_earned DECIMAL(10, 2) DEFAULT 0,
  streak_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_wallet, checkin_date)
);

-- STAKING TABLE
CREATE TABLE IF NOT EXISTS staking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_wallet TEXT NOT NULL,
  amount DECIMAL(18, 8) NOT NULL,
  staked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unstaked_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_projects_wallet ON projects(wallet_address);
CREATE INDEX IF NOT EXISTS idx_quests_owner ON quests(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status);
CREATE INDEX IF NOT EXISTS idx_completions_quest ON quest_completions(quest_id);
CREATE INDEX IF NOT EXISTS idx_completions_user ON quest_completions(user_wallet);
CREATE INDEX IF NOT EXISTS idx_badges_user ON badges(user_wallet);
CREATE INDEX IF NOT EXISTS idx_checkins_user ON daily_checkins(user_wallet);
CREATE INDEX IF NOT EXISTS idx_staking_user ON staking(user_wallet, is_active);

-- RLS POLICIES
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking ENABLE ROW LEVEL SECURITY;

-- Public read access for most tables
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read quests" ON quests FOR SELECT USING (true);
CREATE POLICY "Public read completions" ON quest_completions FOR SELECT USING (true);
CREATE POLICY "Public read badges" ON badges FOR SELECT USING (true);
CREATE POLICY "Public read checkins" ON daily_checkins FOR SELECT USING (true);
CREATE POLICY "Public read staking" ON staking FOR SELECT USING (true);

-- Public insert/update (for now - can be restricted later)
CREATE POLICY "Public insert/update users" ON users FOR ALL USING (true);
CREATE POLICY "Public insert/update projects" ON projects FOR ALL USING (true);
CREATE POLICY "Public insert/update quests" ON quests FOR ALL USING (true);
CREATE POLICY "Public insert/update completions" ON quest_completions FOR ALL USING (true);
CREATE POLICY "Public insert/update badges" ON badges FOR ALL USING (true);
CREATE POLICY "Public insert/update checkins" ON daily_checkins FOR ALL USING (true);
CREATE POLICY "Public insert/update staking" ON staking FOR ALL USING (true);
