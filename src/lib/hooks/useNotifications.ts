import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

interface Notification {
    id: string;
    user_id: string;
    type: 'quest_completed' | 'badge_earned' | 'reward_received' | 'system' | 'project_approved';
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    metadata?: Record<string, unknown>;
}

export function useNotifications() {
    const { address: walletAddress } = useAccount();
    const queryClient = useQueryClient();

    // Bildirimleri getir
    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications', walletAddress],
        queryFn: async () => {
            if (!walletAddress) return [];

            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', walletAddress.toLowerCase())
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            return data as Notification[];
        },
        enabled: !!walletAddress,
    });

    // Okunmamış sayısı
    const unreadCount = notifications?.filter((n: Notification) => !n.is_read).length || 0;

    // Realtime subscription
    useEffect(() => {
        if (!walletAddress) return;

        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${walletAddress.toLowerCase()}`,
                },
                (payload: any) => {
                    queryClient.setQueryData(
                        ['notifications', walletAddress],
                        (old: Notification[] | undefined) => [payload.new as Notification, ...(old || [])]
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [walletAddress, queryClient]);

    // Okundu işaretle
    const markAsReadMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', notificationId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    // Tümünü okundu işaretle
    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            if (!walletAddress) return;

            const { error } = await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', walletAddress.toLowerCase())
                .eq('is_read', false);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    // Notification silme
    const deleteNotificationMutation = useMutation({
        mutationFn: async (notificationId: string) => {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('id', notificationId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    // Filter by type
    const getNotificationsByType = (type: Notification['type']) => {
        return notifications?.filter((n: Notification) => n.type === type) || [];
    };

    // Recent unread notifications
    const recentUnread = notifications?.filter((n: Notification) => !n.is_read).slice(0, 5) || [];

    return {
        notifications,
        isLoading,
        unreadCount,
        markAsRead: markAsReadMutation.mutate,
        markAllAsRead: markAllAsReadMutation.mutate,
        deleteNotification: deleteNotificationMutation.mutate,
        getNotificationsByType,
        recentUnread,
    };
}

// Utility function for creating notifications (server-side use)
export async function createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    metadata?: Record<string, unknown>
) {
    const { error } = await supabase
        .from('notifications')
        .insert({
            user_id: userId.toLowerCase(),
            type,
            title,
            message,
            metadata,
        });

    if (error) throw error;
}
