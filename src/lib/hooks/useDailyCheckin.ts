import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';

interface DailyCheckin {
    id: string;
    user_wallet: string;
    checkin_date: string;
    points_earned: number;
    streak_count: number;
    created_at: string;
}

interface StreakInfo {
    currentStreak: number;
    isActive: boolean;
}

export function useDailyCheckin() {
    const { address: walletAddress } = useAccount();
    const queryClient = useQueryClient();

    // Bugünkü check-in durumunu sorgula
    const { data: todayCheckin, isLoading: isChecking } = useQuery({
        queryKey: ['daily-checkin', walletAddress, new Date().toISOString().split('T')[0]],
        queryFn: async () => {
            if (!walletAddress) return null;

            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('daily_checkins')
                .select('*')
                .eq('user_wallet', walletAddress.toLowerCase())
                .eq('checkin_date', today)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') throw error;
            return data as DailyCheckin | null;
        },
        enabled: !!walletAddress,
    });

    // Streak bilgisini al
    const { data: streakInfo } = useQuery<StreakInfo>({
        queryKey: ['streak', walletAddress],
        queryFn: async () => {
            if (!walletAddress) return { currentStreak: 0, isActive: false };

            const { data, error } = await supabase
                .from('daily_checkins')
                .select('streak_count, checkin_date')
                .eq('user_wallet', walletAddress.toLowerCase())
                .order('checkin_date', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (error && error.code !== 'PGRST116') throw error;

            // Dünden streak devam ediyor mu kontrol et
            if (data) {
                const lastCheckin = new Date(data.checkin_date);
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                const lastCheckinStr = lastCheckin.toISOString().split('T')[0];
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastCheckinStr === yesterdayStr) {
                    return { currentStreak: data.streak_count, isActive: true };
                }
            }

            return { currentStreak: 0, isActive: false };
        },
        enabled: !!walletAddress,
    });

    // Check-in yap
    const checkinMutation = useMutation({
        mutationFn: async () => {
            if (!walletAddress) throw new Error('Wallet not connected');

            const today = new Date().toISOString().split('T')[0];

            // Streak hesapla
            let newStreak = 1;
            if (streakInfo?.isActive) {
                newStreak = streakInfo.currentStreak + 1;
            }

            // Bonus puan hesapla (streak bazlı)
            const basePoints = 10;
            const streakBonus = Math.min(newStreak * 2, 20); // Max 20 bonus
            const totalPoints = basePoints + streakBonus;

            const { data, error } = await supabase
                .from('daily_checkins')
                .insert({
                    user_wallet: walletAddress.toLowerCase(),
                    checkin_date: today,
                    points_earned: totalPoints,
                    streak_count: newStreak,
                })
                .select()
                .single();

            if (error) throw error;

            // User reputation güncelle
            await supabase.rpc('add_reputation', {
                wallet: walletAddress.toLowerCase(),
                points: totalPoints,
            });

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['daily-checkin'] });
            queryClient.invalidateQueries({ queryKey: ['streak'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    // Check-in geçmişi
    const { data: checkinHistory } = useQuery({
        queryKey: ['checkin-history', walletAddress],
        queryFn: async () => {
            if (!walletAddress) return [];

            const { data, error } = await supabase
                .from('daily_checkins')
                .select('*')
                .eq('user_wallet', walletAddress.toLowerCase())
                .order('checkin_date', { ascending: false })
                .limit(30);

            if (error) throw error;
            return data as DailyCheckin[];
        },
        enabled: !!walletAddress,
    });

    return {
        todayCheckin,
        isChecking,
        hasCheckedInToday: !!todayCheckin,
        currentStreak: streakInfo?.currentStreak || 0,
        checkin: checkinMutation.mutate,
        isCheckingIn: checkinMutation.isPending,
        checkinHistory,
    };
}
