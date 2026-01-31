import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type User = Database['public']['Tables']['users']['Row'];

export function useUser() {
    const { address, isConnected } = useAccount();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!isConnected || !address) {
            setUser(null);
            setLoading(false);
            return;
        }

        fetchOrCreateUser();
    }, [address, isConnected]);

    async function fetchOrCreateUser() {
        if (!address) return;

        try {
            setLoading(true);

            // Try to fetch existing user
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('wallet_address', address.toLowerCase())
                .single();

            if (existingUser) {
                setUser(existingUser);
                setError(null);
                return;
            }

            // Create new user if doesn't exist
            if (fetchError?.code === 'PGRST116') {
                const newUser: Database['public']['Tables']['users']['Insert'] = {
                    wallet_address: address.toLowerCase(),
                    total_earned: 0,
                    quest_completed_count: 0,
                    reputation_score: 0,
                    is_kyc_verified: false,
                };

                const { data: userData, error: insertError } = await supabase
                    .from('users')
                    .insert(newUser as any)
                    .select()
                    .single();

                if (insertError) throw insertError;
                setUser(userData);
                setError(null);
            } else if (fetchError) {
                throw fetchError;
            }
        } catch (err) {
            console.error('Error fetching/creating user:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function updateUser(updates: Partial<User>) {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('users')
                // @ts-ignore - Supabase type system limitation
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;
            setUser(data);
            return data;
        } catch (err) {
            console.error('Error updating user:', err);
            throw err;
        }
    }

    return {
        user,
        loading,
        error,
        updateUser,
        refetch: fetchOrCreateUser,
    };
}
