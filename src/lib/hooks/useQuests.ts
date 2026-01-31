import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Quest = Database['public']['Tables']['quests']['Row'];

interface UseQuestsOptions {
    category?: string;
    difficulty?: string;
    status?: 'Active' | 'Paused' | 'Completed';
}

export function useQuests(options: UseQuestsOptions = {}) {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchQuests();
    }, [options.category, options.difficulty]);

    async function fetchQuests() {
        try {
            setLoading(true);

            let query = supabase
                .from('quests')
                .select('*')
                .order('created_at', { ascending: false });

            // Apply filters
            if (options.status) {
                query = query.eq('status', options.status);
            }
            if (options.category) {
                query = query.eq('category', options.category);
            }
            if (options.difficulty) {
                query = query.eq('difficulty', options.difficulty);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;

            setQuests(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching quests:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    return {
        quests,
        loading,
        error,
        refetch: fetchQuests,
    };
}

export function useQuest(questId: string) {
    const [quest, setQuest] = useState<Quest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!questId) return;
        fetchQuest();
    }, [questId]);

    async function fetchQuest() {
        try {
            setLoading(true);

            const { data, error: fetchError } = await supabase
                .from('quests')
                .select('*')
                .eq('id', questId)
                .single();

            if (fetchError) throw fetchError;

            setQuest(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching quest:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    return {
        quest,
        loading,
        error,
        refetch: fetchQuest,
    };
}
