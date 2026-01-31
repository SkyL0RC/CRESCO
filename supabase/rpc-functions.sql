-- ============================================
-- MONAD FLOW - DATABASE RPC FUNCTIONS
-- ============================================
-- Supabase Dashboard → SQL Editor'da çalıştırın
-- Bu fonksiyonlar API routes tarafından kullanılır

-- ============================================
-- 1. USER STATS GÜNCELLEME
-- ============================================

CREATE OR REPLACE FUNCTION increment_user_stats(
  wallet TEXT,
  earned NUMERIC DEFAULT 0,
  quests_done INT DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET
    total_earned = total_earned + earned,
    quest_completed_count = quest_completed_count + quests_done,
    updated_at = NOW()
  WHERE wallet_address = wallet;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. REPUTATION EKLEME
-- ============================================

CREATE OR REPLACE FUNCTION add_reputation(
  wallet TEXT,
  points INT
)
RETURNS VOID AS $$
BEGIN
  UPDATE users
  SET
    reputation_score = LEAST(reputation_score + points, 100), -- Max 100
    updated_at = NOW()
  WHERE wallet_address = wallet;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. QUEST BUDGET GÜNCELLEME
-- ============================================

CREATE OR REPLACE FUNCTION update_quest_stats(
  quest_uuid UUID,
  spent NUMERIC
)
RETURNS VOID AS $$
BEGIN
  -- Stats güncelle
  UPDATE quests
  SET
    budget_spent = budget_spent + spent,
    total_completions = total_completions + 1,
    updated_at = NOW()
  WHERE id = quest_uuid;

  -- Budget bittiyse quest'i kapat
  UPDATE quests
  SET status = 'Completed'
  WHERE id = quest_uuid
    AND budget_spent >= total_budget
    AND status = 'Active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. GÜNLÜK STREAK HESAPLAMA
-- ============================================

CREATE OR REPLACE FUNCTION calculate_streak(
  wallet TEXT,
  today_date DATE
)
RETURNS INT AS $$
DECLARE
  current_streak INT;
  last_checkin_date DATE;
BEGIN
  -- Son checkin tarihini al
  SELECT checkin_date INTO last_checkin_date
  FROM daily_checkins
  WHERE user_wallet = wallet
  ORDER BY checkin_date DESC
  LIMIT 1;

  -- İlk checkin ise
  IF last_checkin_date IS NULL THEN
    RETURN 1;
  END IF;

  -- Dünmü checkin yapmış?
  IF last_checkin_date = today_date - INTERVAL '1 day' THEN
    -- Streak devam ediyor
    SELECT streak_count + 1 INTO current_streak
    FROM daily_checkins
    WHERE user_wallet = wallet
    ORDER BY checkin_date DESC
    LIMIT 1;
    RETURN current_streak;
  ELSIF last_checkin_date = today_date THEN
    -- Bugün zaten checkin yapmış
    SELECT streak_count INTO current_streak
    FROM daily_checkins
    WHERE user_wallet = wallet
    ORDER BY checkin_date DESC
    LIMIT 1;
    RETURN current_streak;
  ELSE
    -- Streak kırıldı
    RETURN 1;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. LEADERBOARD VIEW (READ-ONLY)
-- ============================================

CREATE OR REPLACE VIEW leaderboard AS
SELECT
  wallet_address,
  username,
  avatar_url,
  total_earned,
  quest_completed_count,
  reputation_score,
  RANK() OVER (ORDER BY total_earned DESC) as rank
FROM users
WHERE total_earned > 0
ORDER BY total_earned DESC
LIMIT 100;

-- ============================================
-- 6. QUEST COMPLETION DUPLICATE CHECK
-- ============================================

CREATE OR REPLACE FUNCTION check_quest_completion_exists(
  quest_uuid UUID,
  wallet TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM quest_completions
    WHERE quest_id = quest_uuid
      AND user_wallet = wallet
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. GET USER STAKING STATUS
-- ============================================

CREATE OR REPLACE FUNCTION get_user_staking_total(
  wallet TEXT
)
RETURNS NUMERIC AS $$
DECLARE
  total NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO total
  FROM staking
  WHERE user_wallet = wallet
    AND is_active = true;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. BADGE OWNERSHIP CHECK
-- ============================================

CREATE OR REPLACE FUNCTION has_badge(
  wallet TEXT,
  badge_type_name TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM badges
    WHERE user_wallet = wallet
      AND badge_type = badge_type_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 9. PROJECT QUEST COUNT
-- ============================================

CREATE OR REPLACE FUNCTION get_project_quest_count(
  project_uuid UUID
)
RETURNS TABLE (
  total_quests INT,
  active_quests INT,
  completed_quests INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INT as total_quests,
    COUNT(*) FILTER (WHERE status = 'Active')::INT as active_quests,
    COUNT(*) FILTER (WHERE status = 'Completed')::INT as completed_quests
  FROM quests
  WHERE project_id = project_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 10. ADMIN: PLATFORM STATS
-- ============================================

CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS TABLE (
  total_users BIGINT,
  total_quests BIGINT,
  total_completions BIGINT,
  total_value_distributed NUMERIC,
  active_projects BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM quests) as total_quests,
    (SELECT COUNT(*) FROM quest_completions) as total_completions,
    (SELECT COALESCE(SUM(reward_amount), 0) FROM quest_completions) as total_value_distributed,
    (SELECT COUNT(*) FROM projects WHERE is_verified = true) as active_projects;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- İNDEXLER (Performance için)
-- ============================================

-- Eğer yoksa oluştur
CREATE INDEX IF NOT EXISTS idx_quests_status ON quests(status);
CREATE INDEX IF NOT EXISTS idx_quests_category ON quests(category);
CREATE INDEX IF NOT EXISTS idx_quests_owner ON quests(owner_wallet);
CREATE INDEX IF NOT EXISTS idx_quests_project ON quests(project_id);

CREATE INDEX IF NOT EXISTS idx_quest_completions_user ON quest_completions(user_wallet);
CREATE INDEX IF NOT EXISTS idx_quest_completions_quest ON quest_completions(quest_id);
CREATE INDEX IF NOT EXISTS idx_quest_completions_created ON quest_completions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_reputation ON users(reputation_score DESC);
CREATE INDEX IF NOT EXISTS idx_users_earned ON users(total_earned DESC);

CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_wallet, checkin_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_staking_user_active ON staking(user_wallet, is_active);
CREATE INDEX IF NOT EXISTS idx_badges_user ON badges(user_wallet);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

-- Anon ve authenticated rollere execute izni ver
GRANT EXECUTE ON FUNCTION increment_user_stats TO anon, authenticated;
GRANT EXECUTE ON FUNCTION add_reputation TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_quest_stats TO anon, authenticated;
GRANT EXECUTE ON FUNCTION calculate_streak TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_quest_completion_exists TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_staking_total TO anon, authenticated;
GRANT EXECUTE ON FUNCTION has_badge TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_project_quest_count TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_platform_stats TO anon, authenticated;

-- Leaderboard view'a Select izni
GRANT SELECT ON leaderboard TO anon, authenticated;

-- ============================================
-- NOTLAR
-- ============================================
-- 1. SECURITY DEFINER: Fonksiyon owner (postgres) olarak çalışır, RLS bypass
-- 2. Bu fonksiyonlar hem client-side hem server-side kullanılabilir
-- 3. Hassas işlemler için API routes tercih edilmeli
-- 4. Test için: SELECT * FROM get_platform_stats();
