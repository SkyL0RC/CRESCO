import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyMessage } from 'viem';
import { questCompletionSchema } from '@/lib/validations';
import { ZodError } from 'zod';

// Service role client - bypasses RLS
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validated = questCompletionSchema.parse(body);
        const { quest_id, user_wallet, signature, message } = validated;

        // 1. Verify signature
        try {
            const isValid = await verifyMessage({
                address: user_wallet as `0x${string}`,
                message,
                signature: signature as `0x${string}`,
            });

            if (!isValid) {
                return NextResponse.json(
                    { error: 'Invalid signature' },
                    { status: 401 }
                );
            }
        } catch (error) {
            console.error('Signature verification failed:', error);
            return NextResponse.json(
                { error: 'Signature verification failed' },
                { status: 401 }
            );
        }

        // 2. Check if quest exists and is active
        const { data: quest, error: questError } = await supabaseAdmin
            .from('quests')
            .select('*')
            .eq('id', quest_id)
            .single();

        if (questError || !quest) {
            return NextResponse.json(
                { error: 'Quest not found' },
                { status: 404 }
            );
        }

        if (quest.status !== 'Active') {
            return NextResponse.json(
                { error: 'Quest is not active' },
                { status: 400 }
            );
        }

        // 3. Check if already completed
        const { data: existingCompletion } = await supabaseAdmin
            .from('quest_completions')
            .select('id')
            .eq('quest_id', quest_id)
            .eq('user_wallet', user_wallet.toLowerCase())
            .single();

        if (existingCompletion) {
            return NextResponse.json(
                { error: 'Quest already completed' },
                { status: 400 }
            );
        }

        // 4. Check if quest has budget remaining
        if (quest.budget_spent >= quest.total_budget) {
            return NextResponse.json(
                { error: 'Quest budget exhausted' },
                { status: 400 }
            );
        }

        // 5. Check max completions
        if (quest.total_completions >= quest.max_completions) {
            return NextResponse.json(
                { error: 'Quest max completions reached' },
                { status: 400 }
            );
        }

        // 6. Get user data for bonus calculations
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('is_kyc_verified')
            .eq('wallet_address', user_wallet.toLowerCase())
            .single();

        if (userError) {
            console.error('User fetch error:', userError);
            // Continue anyway, user might not exist yet
        }

        // 7. Calculate reward with bonuses
        let rewardAmount = quest.reward_amount;

        // KYC Bonus
        if (quest.kyc_bonus > 0 && user?.is_kyc_verified) {
            rewardAmount += quest.kyc_bonus;
        }

        // Staker Bonus
        if (quest.staker_bonus > 0) {
            const { data: stakeTotal } = await supabaseAdmin
                .rpc('get_user_staking_total', { wallet: user_wallet.toLowerCase() });

            if (stakeTotal && stakeTotal > 0) {
                rewardAmount += quest.staker_bonus;
            }
        }

        // 8. Create quest completion record
        const { data: completion, error: completionError } = await supabaseAdmin
            .from('quest_completions')
            .insert({
                quest_id,
                user_wallet: user_wallet.toLowerCase(),
                reward_amount: rewardAmount,
                reward_claimed: true,
                completed_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (completionError) {
            console.error('Completion insert error:', completionError);
            return NextResponse.json(
                { error: 'Failed to record completion' },
                { status: 500 }
            );
        }

        // 9. Update quest stats
        await supabaseAdmin.rpc('update_quest_stats', {
            quest_uuid: quest_id,
            spent: rewardAmount,
        });

        // 10. Update user stats
        await supabaseAdmin.rpc('increment_user_stats', {
            wallet: user_wallet.toLowerCase(),
            earned: rewardAmount,
            quests_done: 1,
        });

        // 11. Create notification
        await supabaseAdmin.from('notifications').insert({
            user_id: user_wallet.toLowerCase(),
            type: 'quest_completed',
            title: 'Quest Completed! 🎉',
            message: `You earned ${rewardAmount} MON from "${quest.title}"`,
            metadata: {
                quest_id,
                quest_title: quest.title,
                reward_amount: rewardAmount,
            },
        });

        // 12. Check for badge eligibility
        const { data: userData } = await supabaseAdmin
            .from('users')
            .select('quest_completed_count, total_earned')
            .eq('wallet_address', user_wallet.toLowerCase())
            .single();

        if (userData) {
            // Quest Master badge (10, 50, 100 quests)
            if ([10, 50, 100].includes(userData.quest_completed_count)) {
                await supabaseAdmin.from('badges').insert({
                    user_wallet: user_wallet.toLowerCase(),
                    badge_type: 'Quest Master',
                    tier: userData.quest_completed_count === 100 ? 'Gold' :
                        userData.quest_completed_count === 50 ? 'Silver' : 'Bronze',
                    earned_at: new Date().toISOString(),
                });
            }
        }

        return NextResponse.json({
            success: true,
            completion,
            reward: rewardAmount,
            message: 'Quest completed successfully!',
        });

    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: error.issues,
                },
                { status: 400 }
            );
        }
        console.error('Quest completion error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
