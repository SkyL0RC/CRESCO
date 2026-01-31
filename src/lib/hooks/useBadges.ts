import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Badge = Database['public']['Tables']['badges']['Row'];

export function useBadges(userWallet?: string) {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!userWallet) {
            setBadges([]);
            setLoading(false);
            return;
        }
        fetchBadges();
    }, [userWallet]);

    async function fetchBadges() {
        if (!userWallet) return;

        try {
            setLoading(true);

            const { data, error: fetchError } = await supabase
                .from('badges')
                .select('*')
                .eq('user_wallet', userWallet.toLowerCase())
                .order('earned_at', { ascending: false });

            if (fetchError) throw fetchError;

            setBadges(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching badges:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function awardBadge(badgeType: string, metadata?: any) {
        if (!userWallet) return;

        try {
            // Check if user already has this badge
            const existing = badges.find(b => b.badge_type === badgeType);
            if (existing) {
                console.log('User already has this badge');
                return existing;
            }

            const newBadge: Database['public']['Tables']['badges']['Insert'] = {
                user_wallet: userWallet.toLowerCase(),
                badge_type: badgeType,
                metadata: metadata || null,
            };

            const { data, error } = await supabase
                .from('badges')
                .insert(newBadge as any)
                .select()
                .single();

            if (error) throw error;

            // Refresh badges list
            await fetchBadges();

            return data;
        } catch (err) {
            console.error('Error awarding badge:', err);
            throw err;
        }
    }

    function hasBadge(badgeType: string): boolean {
        return badges.some(b => b.badge_type === badgeType);
    }

    return {
        badges,
        loading,
        error,
        awardBadge,
        hasBadge,
        refetch: fetchBadges,
    };
}
