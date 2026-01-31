export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    wallet_address: string
                    username: string | null
                    avatar_url: string | null
                    bio: string | null
                    total_earned: number
                    quest_completed_count: number
                    reputation_score: number
                    is_kyc_verified: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    wallet_address: string
                    username?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    total_earned?: number
                    quest_completed_count?: number
                    reputation_score?: number
                    is_kyc_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    wallet_address?: string
                    username?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    total_earned?: number
                    quest_completed_count?: number
                    reputation_score?: number
                    is_kyc_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    wallet_address: string
                    name: string
                    description: string | null
                    website_url: string | null
                    logo_url: string | null
                    category: string | null
                    is_verified: boolean
                    total_budget: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    wallet_address: string
                    name: string
                    description?: string | null
                    website_url?: string | null
                    logo_url?: string | null
                    category?: string | null
                    is_verified?: boolean
                    total_budget?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    wallet_address?: string
                    name?: string
                    description?: string | null
                    website_url?: string | null
                    logo_url?: string | null
                    category?: string | null
                    is_verified?: boolean
                    total_budget?: number
                    created_at?: string
                }
            }
            quests: {
                Row: {
                    id: string
                    project_id: string | null
                    owner_wallet: string
                    title: string
                    description: string | null
                    image_url: string | null
                    category: string | null
                    difficulty: string | null
                    reward_amount: number
                    base_reward: number
                    kyc_bonus: number
                    staker_bonus: number
                    total_budget: number
                    budget_spent: number
                    requires_kyc: boolean
                    requires_staking: boolean
                    status: string
                    max_completions: number | null
                    total_completions: number
                    verification_method: string
                    steps: Json | null
                    created_at: string
                    contract_quest_id: number | null
                    tx_hash: string | null
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    owner_wallet: string
                    title: string
                    description?: string | null
                    image_url?: string | null
                    category?: string | null
                    difficulty?: string | null
                    reward_amount: number
                    base_reward: number
                    kyc_bonus?: number
                    staker_bonus?: number
                    total_budget: number
                    budget_spent?: number
                    requires_kyc?: boolean
                    requires_staking?: boolean
                    status?: string
                    max_completions?: number | null
                    total_completions?: number
                    verification_method?: string
                    steps?: Json | null
                    created_at?: string
                    contract_quest_id?: number | null
                    tx_hash?: string | null
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    owner_wallet?: string
                    title?: string
                    description?: string | null
                    image_url?: string | null
                    category?: string | null
                    difficulty?: string | null
                    reward_amount?: number
                    base_reward?: number
                    kyc_bonus?: number
                    staker_bonus?: number
                    total_budget?: number
                    budget_spent?: number
                    requires_kyc?: boolean
                    requires_staking?: boolean
                    status?: string
                    max_completions?: number | null
                    total_completions?: number
                    verification_method?: string
                    steps?: Json | null
                    created_at?: string
                    contract_quest_id?: number | null
                    tx_hash?: string | null
                }
            }
            quest_completions: {
                Row: {
                    id: string
                    quest_id: string
                    user_wallet: string
                    reward_claimed: boolean
                    reward_amount: number
                    tx_hash: string | null
                    completed_at: string
                }
                Insert: {
                    id?: string
                    quest_id: string
                    user_wallet: string
                    reward_claimed?: boolean
                    reward_amount: number
                    tx_hash?: string | null
                    completed_at?: string
                }
                Update: {
                    id?: string
                    quest_id?: string
                    user_wallet?: string
                    reward_claimed?: boolean
                    reward_amount?: number
                    tx_hash?: string | null
                    completed_at?: string
                }
            }
            badges: {
                Row: {
                    id: string
                    user_wallet: string
                    badge_type: string
                    metadata: Json | null
                    earned_at: string
                }
                Insert: {
                    id?: string
                    user_wallet: string
                    badge_type: string
                    metadata?: Json | null
                    earned_at?: string
                }
                Update: {
                    id?: string
                    user_wallet?: string
                    badge_type?: string
                    metadata?: Json | null
                    earned_at?: string
                }
            }
            daily_checkins: {
                Row: {
                    id: string
                    user_wallet: string
                    checkin_date: string
                    points_earned: number
                    streak_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_wallet: string
                    checkin_date: string
                    points_earned?: number
                    streak_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_wallet?: string
                    checkin_date?: string
                    points_earned?: number
                    streak_count?: number
                    created_at?: string
                }
            }
            staking: {
                Row: {
                    id: string
                    user_wallet: string
                    amount: number
                    staked_at: string
                    unstaked_at: string | null
                    is_active: boolean
                }
                Insert: {
                    id?: string
                    user_wallet: string
                    amount: number
                    staked_at?: string
                    unstaked_at?: string | null
                    is_active?: boolean
                }
                Update: {
                    id?: string
                    user_wallet?: string
                    amount?: number
                    staked_at?: string
                    unstaked_at?: string | null
                    is_active?: boolean
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: string
                    title: string
                    message: string
                    is_read: boolean
                    created_at: string
                    metadata: Json | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: string
                    title: string
                    message: string
                    is_read?: boolean
                    created_at?: string
                    metadata?: Json | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: string
                    title?: string
                    message?: string
                    is_read?: boolean
                    created_at?: string
                    metadata?: Json | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
