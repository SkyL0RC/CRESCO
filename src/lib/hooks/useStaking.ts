import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';

interface StakingPosition {
    id: string;
    user_wallet: string;
    amount: number;
    staked_at: string;
    unstaked_at: string | null;
    is_active: boolean;
    duration_days?: number;
    unlock_date?: string;
}

export function useStaking() {
    const { address: walletAddress } = useAccount();
    const queryClient = useQueryClient();

    // Aktif stake pozisyonları
    const { data: activeStakes, isLoading } = useQuery({
        queryKey: ['staking', walletAddress],
        queryFn: async () => {
            if (!walletAddress) return [];

            const { data, error } = await supabase
                .from('staking')
                .select('*')
                .eq('user_wallet', walletAddress.toLowerCase())
                .eq('is_active', true)
                .order('staked_at', { ascending: false });

            if (error) throw error;
            return data as StakingPosition[];
        },
        enabled: !!walletAddress,
    });

    // Toplam stake miktarı
    const totalStaked = activeStakes?.reduce((sum, stake) => sum + stake.amount, 0) || 0;

    // Stake yap
    const stakeMutation = useMutation({
        mutationFn: async ({ amount, durationDays }: { amount: number; durationDays: number }) => {
            if (!walletAddress) throw new Error('Wallet not connected');

            // TODO: Smart contract'a stake gönder
            // const txHash = await stakeOnChain(amount);

            const unlockDate = new Date();
            unlockDate.setDate(unlockDate.getDate() + durationDays);

            const { data, error } = await supabase
                .from('staking')
                .insert({
                    user_wallet: walletAddress.toLowerCase(),
                    amount,
                    is_active: true,
                    duration_days: durationDays,
                    unlock_date: unlockDate.toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staking'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    // Unstake yap
    const unstakeMutation = useMutation({
        mutationFn: async (stakeId: string) => {
            if (!walletAddress) throw new Error('Wallet not connected');

            // Kilidi kontrol et
            const stake = activeStakes?.find(s => s.id === stakeId);
            if (stake?.unlock_date && new Date(stake.unlock_date) > new Date()) {
                throw new Error('Stake is still locked');
            }

            // TODO: Smart contract'tan unstake
            // const txHash = await unstakeOnChain(stakeId);

            const { data, error } = await supabase
                .from('staking')
                .update({
                    is_active: false,
                    unstaked_at: new Date().toISOString(),
                })
                .eq('id', stakeId)
                .eq('user_wallet', walletAddress.toLowerCase())
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['staking'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });

    // Geçmiş stake'ler (unstaked)
    const { data: stakingHistory } = useQuery({
        queryKey: ['staking-history', walletAddress],
        queryFn: async () => {
            if (!walletAddress) return [];

            const { data, error } = await supabase
                .from('staking')
                .select('*')
                .eq('user_wallet', walletAddress.toLowerCase())
                .eq('is_active', false)
                .order('unstaked_at', { ascending: false })
                .limit(10);

            if (error) throw error;
            return data as StakingPosition[];
        },
        enabled: !!walletAddress,
    });

    // Staker mı kontrol et (quest bonus için)
    const isStaker = totalStaked > 0;

    // Staker tier hesapla
    const getStakerTier = () => {
        if (totalStaked >= 10000) return 'Diamond';
        if (totalStaked >= 5000) return 'Gold';
        if (totalStaked >= 1000) return 'Silver';
        if (totalStaked >= 100) return 'Bronze';
        return 'None';
    };

    // APY hesaplama (simplified)
    const calculateAPY = (durationDays: number) => {
        const baseAPY = 5; // 5%
        const bonusAPY = {
            7: 0,
            30: 2,
            90: 5,
            180: 10,
        }[durationDays] || 0;

        return baseAPY + bonusAPY;
    };

    return {
        activeStakes,
        totalStaked,
        isLoading,
        isStaker,
        stakerTier: getStakerTier(),
        stake: stakeMutation.mutate,
        isStaking: stakeMutation.isPending,
        unstake: unstakeMutation.mutate,
        isUnstaking: unstakeMutation.isPending,
        stakingHistory,
        calculateAPY,
    };
}
