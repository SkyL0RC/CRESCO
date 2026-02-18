import { z } from 'zod';

// ============================================
// WALLET & BASIC VALIDATIONS
// ============================================

export const walletAddressSchema = z.string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address');

export const uuidSchema = z.string().uuid('Invalid UUID format');

// ============================================
// QUEST VALIDATIONS
// ============================================

export const createQuestSchema = z.object({
    project_id: uuidSchema,
    title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
    description: z.string().min(20, 'Description must be at least 20 characters').max(2000, 'Description too long'),
    category: z.enum(['DeFi', 'NFT', 'Gaming', 'Social', 'Infrastructure'], {
        message: 'Invalid category'
    }),
    difficulty: z.enum(['Easy', 'Medium', 'Hard'], {
        message: 'Invalid difficulty'
    }),
    reward_amount: z.number().positive('Reward must be positive').max(10000, 'Reward too high'),
    total_budget: z.number().positive('Budget must be positive'),
    max_completions: z.number().int().positive().max(10000, 'Max completions too high'),
    requires_kyc: z.boolean().default(false),
    requires_staking: z.boolean().default(false),
    kyc_bonus: z.number().min(0).default(0),
    staker_bonus: z.number().min(0).default(0),
    image_url: z.string().url().optional().or(z.literal('')),
    steps: z.array(z.object({
        title: z.string().min(1, 'Step title required'),
        description: z.string().min(1, 'Step description required'),
    })).min(1, 'At least one step required').max(10, 'Maximum 10 steps allowed').optional(),
});

export const updateQuestSchema = createQuestSchema.partial();

export const questCompletionSchema = z.object({
    quest_id: uuidSchema,
    user_wallet: walletAddressSchema,
    signature: z.string().min(1, 'Signature required'),
    message: z.string().min(1, 'Message required'),
    tx_hash: z.string().optional(),
});

// ============================================
// PROJECT VALIDATIONS
// ============================================

export const createProjectSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
    description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description too long'),
    website_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    twitter_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    discord_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    logo_url: z.string().url('Invalid URL').optional().or(z.literal('')),
    category: z.enum(['DeFi', 'NFT', 'Gaming', 'Social', 'Infrastructure', 'Other'], {
        message: 'Invalid category'
    }),
});

export const updateProjectSchema = createProjectSchema.partial();

// ============================================
// STAKING VALIDATIONS
// ============================================

export const stakingSchema = z.object({
    amount: z.number().positive('Amount must be positive').min(0.01, 'Minimum stake is 0.01'),
    duration_days: z.number().int().positive(),
});

export const unstakeSchema = z.object({
    stake_id: uuidSchema,
});

// ============================================
// DAILY CHECKIN VALIDATIONS
// ============================================

export const dailyCheckinSchema = z.object({
    user_wallet: walletAddressSchema,
});

// ============================================
// USER VALIDATIONS
// ============================================

export const updateUserSchema = z.object({
    username: z.string().min(2).max(30).optional(),
    avatar_url: z.string().url().optional().or(z.literal('')),
    bio: z.string().max(500).optional(),
    twitter_handle: z.string().max(50).optional(),
    discord_username: z.string().max(50).optional(),
});

// ============================================
// ADMIN VALIDATIONS
// ============================================

export const adminApproveProjectSchema = z.object({
    project_id: uuidSchema,
    action: z.enum(['approve', 'reject']),
    admin_wallet: walletAddressSchema,
    reason: z.string().optional(),
});

export const adminFlagUserSchema = z.object({
    user_wallet: walletAddressSchema,
    reason: z.string().min(10, 'Reason must be at least 10 characters'),
    admin_wallet: walletAddressSchema,
});

// ============================================
// NOTIFICATION VALIDATIONS
// ============================================

export const createNotificationSchema = z.object({
    user_id: walletAddressSchema,
    type: z.enum(['quest_completed', 'badge_earned', 'reward_received', 'system', 'project_approved']),
    title: z.string().min(1).max(100),
    message: z.string().min(1).max(500),
    metadata: z.record(z.string(), z.unknown()).optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type CreateQuestInput = z.infer<typeof createQuestSchema>;
export type UpdateQuestInput = z.infer<typeof updateQuestSchema>;
export type QuestCompletionInput = z.infer<typeof questCompletionSchema>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type StakingInput = z.infer<typeof stakingSchema>;
export type UnstakeInput = z.infer<typeof unstakeSchema>;
export type DailyCheckinInput = z.infer<typeof dailyCheckinSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type AdminApproveProjectInput = z.infer<typeof adminApproveProjectSchema>;
export type AdminFlagUserInput = z.infer<typeof adminFlagUserSchema>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
