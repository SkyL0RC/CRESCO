-- ============================================
-- MONAD FLOW - ROW LEVEL SECURITY POLICIES
-- ============================================
-- Supabase Dashboard → SQL Editor'da çalıştırın
-- Bu script tüm tablolarda RLS'i aktifleştirir ve temel politikalar oluşturur

-- ============================================
-- 1. RLS'İ AKTİFLEŞTİR
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quest_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. USERS TABLOSU POLİTİKALARI
-- ============================================

-- Herkes herkesin public bilgilerini okuyabilir
CREATE POLICY "Public profiles are viewable by everyone" 
ON users FOR SELECT 
USING (true);

-- Kullanıcılar sadece kendi verilerini güncelleyebilir
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (wallet_address = current_setting('request.jwt.claim.sub', true)::text);

-- Yeni kullanıcı oluşturma (wallet bağlantısı)
CREATE POLICY "Users can insert own profile" 
ON users FOR INSERT 
WITH CHECK (wallet_address = current_setting('request.jwt.claim.sub', true)::text);

-- ============================================
-- 3. QUESTS TABLOSU POLİTİKALARI  
-- ============================================

-- Aktif questler herkese açık
CREATE POLICY "Active quests are viewable by everyone" 
ON quests FOR SELECT 
USING (status = 'Active' OR status = 'Completed');

-- Quest sahipleri kendi questlerini yönetebilir
CREATE POLICY "Quest owners can manage own quests" 
ON quests FOR ALL 
USING (owner_wallet = current_setting('request.jwt.claim.sub', true)::text);

-- ============================================
-- 4. QUEST COMPLETIONS POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi tamamlamalarını görebilir
CREATE POLICY "Users can view own completions" 
ON quest_completions FOR SELECT 
USING (user_wallet = current_setting('request.jwt.claim.sub', true)::text);

-- Quest sahipleri kendi questlerinin tamamlamalarını görebilir
CREATE POLICY "Quest owners can view quest completions" 
ON quest_completions FOR SELECT 
USING (
  quest_id IN (
    SELECT id FROM quests 
    WHERE owner_wallet = current_setting('request.jwt.claim.sub', true)::text
  )
);

-- INSERT sadece server-side (service role key ile)
-- Bu politika olmadan hiç kimse insert yapamaz

-- ============================================
-- 5. PROJECTS TABLOSU POLİTİKALARI
-- ============================================

-- Verified projeler herkese açık
CREATE POLICY "Verified projects are viewable by everyone" 
ON projects FOR SELECT 
USING (is_verified = true);

-- Proje sahipleri kendi projelerini görebilir
CREATE POLICY "Project owners can view own projects" 
ON projects FOR SELECT 
USING (wallet_address = current_setting('request.jwt.claim.sub', true)::text);

-- Proje sahipleri kendi projelerini yönetebilir
CREATE POLICY "Project owners can manage own projects" 
ON projects FOR ALL 
USING (wallet_address = current_setting('request.jwt.claim.sub', true)::text);

-- yeni proje oluşturma
CREATE POLICY "Authenticated users can create projects" 
ON projects FOR INSERT 
WITH CHECK (wallet_address = current_setting('request.jwt.claim.sub', true)::text);

-- ============================================
-- 6. BADGES TABLOSU POLİTİKALARI
-- ============================================

-- Herkes herkesin badge'lerini görebilir
CREATE POLICY "Badges are viewable by everyone" 
ON badges FOR SELECT 
USING (true);

-- Badge minting server-side (service role)

-- ============================================
-- 7. DAILY CHECKINS POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi checkin geçmişini görebilir
CREATE POLICY "Users can view own checkins" 
ON daily_checkins FOR SELECT 
USING (user_wallet = current_setting('request.jwt.claim.sub', true)::text);

-- INSERT server-side (API route ile)

-- ============================================
-- 8. STAKING POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi staking pozisyonlarını görebilir
CREATE POLICY "Users can view own stakes" 
ON staking FOR SELECT 
USING (user_wallet = current_setting('request.jwt.claim.sub', true)::text);

-- INSERT ve UPDATE server-side

-- ============================================
-- 9. NOTIFICATIONS POLİTİKALARI
-- ============================================

-- Kullanıcılar kendi bildirimlerini görebilir
CREATE POLICY "Users can view own notifications" 
ON notifications FOR SELECT 
USING (user_id = current_setting('request.jwt.claim.sub', true)::text);

-- Bildirim oluşturma server-side

-- Kullanıcılar kendi bildirimlerini güncelleyebilir (okundu işaretleme)
CREATE POLICY "Users can update own notifications" 
ON notifications FOR UPDATE 
USING (user_id = current_setting('request.jwt.claim.sub', true)::text);

-- ============================================
-- 10. ADMIN POLİTİKALARI (OPSİYONEL)
-- ============================================
-- Admin wallet'ları .env'den alın ve buraya ekleyin

-- CREATE POLICY "Admins have full access to all tables" 
-- ON users FOR ALL 
-- USING (
--   current_setting('request.jwt.claim.sub', true)::text = 'ADMIN_WALLET_ADDRESS_HERE'
-- );

-- ============================================
-- NOTLAR
-- ============================================
-- 1. current_setting('request.jwt.claim.sub', true) Supabase JWT'den gelen wallet address
-- 2. Service role key kullanıldığında RLS bypass edilir (API routes için)
-- 3. Anon key kullanıldığında bu politikalar geçerlidir (client-side)
-- 4. Test etmek için Supabase Dashboard → Table Editor'dan deneyebilirsiniz
