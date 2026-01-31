import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import { createQuestOnChain } from '@/contracts/utils';
import { toast } from 'sonner';

type Quest = Database['public']['Tables']['quests']['Row'];
type QuestInsert = Database['public']['Tables']['quests']['Insert'];
type QuestUpdate = Database['public']['Tables']['quests']['Update'];
type QuestCompletion = Database['public']['Tables']['quest_completions']['Insert'];

// Check if contracts are configured
const CONTRACTS_ENABLED = !!(
    process.env.NEXT_PUBLIC_QUEST_MANAGER_CONTRACT &&
    process.env.NEXT_PUBLIC_QUEST_MANAGER_CONTRACT !== 'YOUR_CONTRACT_ADDRESS'
);

export function useQuestActions() {
    const { address } = useAccount();

    async function createQuest(questData: Omit<QuestInsert, 'owner_wallet'>) {
        if (!address) throw new Error('Wallet not connected');

        try {
            let contractQuestId: bigint | null = null;
            let txHash: string | null = null;

            // If contracts are deployed, create quest on-chain first
            if (CONTRACTS_ENABLED) {
                try {
                    toast.info('Creating quest on-chain...');

                    const tx = await createQuestOnChain({
                        title: questData.title,
                        description: questData.description || '',
                        rewardAmount: questData.base_reward,
                        rewardToken: '0x0000000000000000000000000000000000000000' as `0x${string}`,
                        maxCompletions: Math.floor(questData.total_budget / questData.base_reward),
                        totalBudget: questData.total_budget,
                    });

                    await tx.wait();
                    contractQuestId = tx.questId;
                    txHash = tx.hash;

                    toast.success('Quest created on-chain! Adding to database...');
                } catch (contractError) {
                    console.error('Contract creation failed, falling back to database:', contractError);
                    toast.warning('Contract unavailable, creating in database only');
                }
            }

            // Create quest in Supabase
            const newQuest: QuestInsert = {
                ...questData,
                owner_wallet: address.toLowerCase(),
                status: 'Active',
                total_completions: 0,
                budget_spent: 0,
                // Ensure we pass null if 0 or undefined, unless it's a valid ID
                contract_quest_id: contractQuestId !== null ? Number(contractQuestId) : null,
                tx_hash: txHash,
            };

            // @ts-ignore - Supabase type system limitation
            const { data, error } = await supabase
                .from('quests')
                .insert(newQuest as any)
                .select()
                .single();

            if (error) {
                // If contract payment succeeded but DB failed, it's a critical state
                if (txHash) {
                    console.error('CRITICAL: Payment succeeded but DB insert failed. Tx:', txHash, 'Error:', error);
                    toast.error(`Payment successful (Tx: ${txHash.slice(0, 8)}...) but database error: ${error.message}. Please save your transaction hash.`);
                    // We re-throw to stop the flow, but the user is warned
                    throw new Error(`Database error after payment: ${error.message}`);
                }
                throw error;
            }

            return data;
        } catch (err: any) {
            console.error('Error creating quest:', err);
            // If it's the error we threw above, just rethrow
            throw err;
        }
    }

    async function updateQuest(questId: string, updates: QuestUpdate) {
        if (!address) throw new Error('Wallet not connected');

        try {
            // @ts-ignore - Supabase generated types may show as 'never' without proper type generation
            const { data, error } = await supabase
                .from('quests')
                .update(updates as unknown as never)
                .eq('id', questId)
                .eq('owner_wallet', address.toLowerCase())
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (err) {
            console.error('Error updating quest:', err);
            throw err;
        }
    }

    async function deleteQuest(questId: string) {
        if (!address) throw new Error('Wallet not connected');

        try {
            const { error } = await supabase
                .from('quests')
                .delete()
                .eq('id', questId)
                .eq('owner_wallet', address.toLowerCase());

            if (error) throw error;
        } catch (err) {
            console.error('Error deleting quest:', err);
            throw err;
        }
    }

    async function completeQuest(
        questId: string,
        txHash?: string
    ): Promise<{ success: boolean; reward: number; completion: any }> {
        if (!address) throw new Error('Wallet not connected');

        try {
            // 1. Fetch quest details
            const { data: questData, error: questError } = await supabase
                .from('quests')
                .select('*')
                .eq('id', questId)
                .single();

            if (questError) throw questError;
            if (!questData) throw new Error('Quest not found');

            const quest = questData as Quest;

            // 2. Check if quest is active
            if (quest.status !== 'Active') {
                throw new Error('Quest is not active');
            }

            // 3. Check if user already completed this quest
            const { data: existingCompletion } = await supabase
                .from('quest_completions')
                .select('id')
                .eq('quest_id', questId)
                .eq('user_wallet', address.toLowerCase())
                .single();

            if (existingCompletion) {
                throw new Error('Quest already completed by this user');
            }

            // 4. Check if user meets requirements
            const { data: userData } = await supabase
                .from('users')
                .select('is_kyc_verified')
                .eq('wallet_address', address.toLowerCase())
                .single();

            const user = userData as { is_kyc_verified: boolean } | null;

            if (quest.requires_kyc && !user?.is_kyc_verified) {
                throw new Error('KYC verification required');
            }

            // 5. Calculate reward (base + bonuses)
            let totalReward = quest.base_reward;
            if (user?.is_kyc_verified && quest.kyc_bonus > 0) {
                totalReward += quest.kyc_bonus;
            }

            // Check if budget allows this reward
            if (quest.budget_spent + totalReward > quest.total_budget) {
                throw new Error('Quest budget exceeded');
            }

            // 6. If contract is available, claim reward on-chain
            let rewardTxHash = txHash;

            // Debug log
            console.log('Checking contract interaction:', {
                enabled: CONTRACTS_ENABLED,
                questId: quest.contract_quest_id,
                hasId: quest.contract_quest_id !== null
            });

            if (CONTRACTS_ENABLED && quest.contract_quest_id !== null) {
                try {
                    const { completeQuestOnChain } = await import('@/contracts/utils');

                    toast.info('Claiming reward on-chain...');

                    const tx = await completeQuestOnChain({
                        questId: quest.contract_quest_id,
                        userAddress: address as `0x${string}`,
                        txHash: (txHash || '0x0000000000000000000000000000000000000000000000000000000000000000') as `0x${string}`,
                    });

                    rewardTxHash = tx.transactionHash;
                    toast.success('Reward claimed on-chain!');
                } catch (contractError: any) {
                    console.error('On-chain reward claim failed:', contractError);
                    // CRITICAL CHANGE: Do not fallback. If it's an on-chain quest, it must succeed on-chain.
                    // Throwing here prevents the DB update below.
                    throw new Error(`On-chain transaction failed: ${contractError?.message || 'Unknown error'}`);
                }
            } else if (CONTRACTS_ENABLED && quest.contract_quest_id === null) {
                console.error('Critical: Quest is missing on-chain ID');
                throw new Error('This quest is invalid (missing on-chain ID). Please recreate the quest.');
            } else {
                console.warn('Skipping on-chain claim. Reason: Contracts disabled');
            }

            // 7. Create quest completion record
            const completionData: QuestCompletion = {
                quest_id: questId,
                user_wallet: address.toLowerCase(),
                reward_amount: totalReward,
                tx_hash: rewardTxHash || null,
                reward_claimed: !!rewardTxHash,
            };

            // @ts-ignore - Supabase type system limitation  
            const { data: completion, error: completionError } = await supabase
                .from('quest_completions')
                .insert(completionData as any)
                .select()
                .single();

            if (completionError) throw completionError;

            // 8. Update quest stats
            // @ts-ignore - Supabase generated types may show as 'never' without proper type generation
            await supabase
                .from('quests')
                .update({
                    total_completions: quest.total_completions + 1,
                    budget_spent: quest.budget_spent + totalReward,
                } as unknown as never)
                .eq('id', questId);

            // 9. Update user stats
            const { data: currentUserData } = await supabase
                .from('users')
                .select('total_earned, quest_completed_count')
                .eq('wallet_address', address.toLowerCase())
                .single();

            const currentUser = currentUserData as { total_earned: number; quest_completed_count: number } | null;

            if (currentUser) {
                // @ts-ignore - Supabase generated types may show as 'never' without proper type generation
                await supabase
                    .from('users')
                    .update({
                        total_earned: currentUser.total_earned + totalReward,
                        quest_completed_count: currentUser.quest_completed_count + 1,
                    } as unknown as never)
                    .eq('wallet_address', address.toLowerCase());
            }

            // 10. Award badges if conditions met
            await checkAndAwardBadges(address.toLowerCase(), currentUser?.quest_completed_count || 0);

            return {
                success: true,
                reward: totalReward,
                completion,
            };
        } catch (err) {
            console.error('Error completing quest:', err);
            throw err;
        }
    }

    async function getUserQuests() {
        if (!address) throw new Error('Wallet not connected');

        try {
            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .eq('owner_wallet', address.toLowerCase())
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (err) {
            console.error('Error fetching user quests:', err);
            throw err;
        }
    }

    async function getUserCompletions() {
        if (!address) throw new Error('Wallet not connected');

        try {
            const { data: completionsData, error: completionsError } = await supabase
                .from('quest_completions')
                .select(`
                    *,
                    quests (
                        id,
                        title,
                        category,
                        difficulty
                    )
                `)
                .eq('user_wallet', address.toLowerCase())
                .order('completed_at', { ascending: false });

            if (completionsError) throw completionsError;

            return completionsData || [];
        } catch (err) {
            console.error('Error fetching user completions:', err);
            throw err;
        }
    }

    return {
        createQuest,
        updateQuest,
        deleteQuest,
        completeQuest,
        getUserQuests,
        getUserCompletions,
    };
}

// Helper function to award badges
async function checkAndAwardBadges(userWallet: string, completedCount: number) {
    try {
        // Award "First Quest" badge
        if (completedCount === 0) {
            await supabase
                .from('badges')
                // @ts-ignore
                .insert({
                    user_wallet: userWallet,
                    badge_type: 'first_quest',
                    metadata: { quest_count: 1 },
                });
        }

        // Award "10 Quests" badge
        if (completedCount === 9) {
            await supabase
                .from('badges')
                // @ts-ignore
                .insert({
                    user_wallet: userWallet,
                    badge_type: 'quest_master_10',
                    metadata: { quest_count: 10 },
                });
        }

        // Award "50 Quests" badge
        if (completedCount === 49) {
            await supabase
                .from('badges')
                // @ts-ignore
                .insert({
                    user_wallet: userWallet,
                    badge_type: 'quest_master_50',
                    metadata: { quest_count: 50 },
                });
        }
    } catch (err) {
        console.error('Error awarding badges:', err);
        // Don't throw - badges are nice-to-have
    }
}
