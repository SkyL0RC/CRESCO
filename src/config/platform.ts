/**
 * Platform Configuration
 * Central configuration for platform fees, limits, and contract addresses
 */

export const PLATFORM_CONFIG = {
    // Fee Configuration
    FEE_PERCENTAGE: 10, // 10% platform fee on all quest rewards

    // Admin Configuration
    ADMIN_WALLET: process.env.NEXT_PUBLIC_ADMIN_WALLET || '',

    // Quest Budget Limits (in MON tokens)
    MIN_QUEST_BUDGET: 100, // Minimum 100 MON
    MAX_QUEST_BUDGET: 100_000, // Maximum 100k MON
    MIN_QUEST_REWARD: 1, // Minimum 1 MON per completion

    // Contract Addresses
    QUEST_MANAGER_CONTRACT: process.env.NEXT_PUBLIC_QUEST_MANAGER_CONTRACT || '',
    BADGE_NFT_CONTRACT: process.env.NEXT_PUBLIC_BADGE_NFT_CONTRACT || '',

    // Contract Status
    CONTRACTS_ENABLED: !!(
        process.env.NEXT_PUBLIC_QUEST_MANAGER_CONTRACT &&
        process.env.NEXT_PUBLIC_QUEST_MANAGER_CONTRACT !== 'YOUR_CONTRACT_ADDRESS' &&
        process.env.NEXT_PUBLIC_QUEST_MANAGER_CONTRACT !== ''
    ),

    // Network Configuration
    CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID ? parseInt(process.env.NEXT_PUBLIC_CHAIN_ID) : 1,

    // Badge Tiers
    BADGE_TIERS: {
        TIER_1: 'Early Adopter',
        TIER_2: 'ZK-KYC Verified',
        TIER_3: 'Monad Staker',
    } as const,

    // Staking Configuration
    STAKING_TIERS: {
        BRONZE: { min: 100, apy: 5 },
        SILVER: { min: 1000, apy: 10 },
        GOLD: { min: 10000, apy: 15 },
    } as const,
} as const;

/**
 * Calculate platform fee for a given reward amount
 */
export function calculatePlatformFee(rewardAmount: number): {
    platformFee: number;
    userReward: number;
} {
    const platformFee = (rewardAmount * PLATFORM_CONFIG.FEE_PERCENTAGE) / 100;
    const userReward = rewardAmount - platformFee;

    return {
        platformFee: Math.floor(platformFee * 100) / 100, // Round to 2 decimals
        userReward: Math.floor(userReward * 100) / 100,
    };
}

/**
 * Validate quest budget and reward amounts
 */
export function validateQuestBudget(params: {
    totalBudget: number;
    baseReward: number;
    kycBonus?: number;
}): { valid: boolean; error?: string } {
    const { totalBudget, baseReward, kycBonus = 0 } = params;

    // Check minimum budget
    if (totalBudget < PLATFORM_CONFIG.MIN_QUEST_BUDGET) {
        return {
            valid: false,
            error: `Minimum quest budget is ${PLATFORM_CONFIG.MIN_QUEST_BUDGET} MON`,
        };
    }

    // Check maximum budget
    if (totalBudget > PLATFORM_CONFIG.MAX_QUEST_BUDGET) {
        return {
            valid: false,
            error: `Maximum quest budget is ${PLATFORM_CONFIG.MAX_QUEST_BUDGET} MON`,
        };
    }

    // Check minimum reward
    if (baseReward < PLATFORM_CONFIG.MIN_QUEST_REWARD) {
        return {
            valid: false,
            error: `Minimum reward is ${PLATFORM_CONFIG.MIN_QUEST_REWARD} MON`,
        };
    }

    // Check if budget can cover at least one completion
    const totalReward = baseReward + kycBonus;
    if (totalBudget < totalReward) {
        return {
            valid: false,
            error: 'Budget must cover at least one quest completion',
        };
    }

    return { valid: true };
}

/**
 * Calculate maximum completions for a quest
 */
export function calculateMaxCompletions(params: {
    totalBudget: number;
    baseReward: number;
    kycBonus?: number;
}): number {
    const { totalBudget, baseReward, kycBonus = 0 } = params;
    const maxReward = baseReward + kycBonus; // Worst case: all users get bonus

    return Math.floor(totalBudget / maxReward);
}
