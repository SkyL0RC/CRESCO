'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { WalletButton } from '@/components/ui/wallet-button';
import { useQuestActions } from '@/lib/hooks/useQuestActions';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    Trophy,
    DollarSign,
    Shield,
    Zap,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Quest {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    category: string | null;
    difficulty: string | null;
    base_reward: number;
    kyc_bonus: number;
    staker_bonus: number;
    reward_amount: number;
    requires_kyc: boolean;
    requires_staking: boolean;
    status: string;
    total_completions: number;
    budget_spent: number;
    total_budget: number;
    project_id: string | null;
    verification_method: string;
}

export default function QuestDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { completeQuest } = useQuestActions();

    const [quest, setQuest] = useState<Quest | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [txHash, setTxHash] = useState('');
    const [hasCompleted, setHasCompleted] = useState(false);
    const [userKycStatus, setUserKycStatus] = useState(false);

    const questId = params.id as string;

    useEffect(() => {
        fetchQuestDetails();
        if (address) {
            checkCompletion();
            checkKycStatus();
        }
    }, [questId, address]);

    const fetchQuestDetails = async () => {
        try {
            const { data, error } = await supabase
                .from('quests')
                .select('*')
                .eq('id', questId)
                .single();

            if (error) throw error;
            setQuest(data as Quest);
        } catch (err) {
            console.error('Error fetching quest:', err);
            toast.error('Failed to load quest details');
        } finally {
            setLoading(false);
        }
    };

    const checkCompletion = async () => {
        if (!address) return;

        try {
            const { data } = await supabase
                .from('quest_completions')
                .select('id')
                .eq('quest_id', questId)
                .eq('user_wallet', address.toLowerCase())
                .maybeSingle();

            setHasCompleted(!!data);
        } catch (err) {
            console.error('Error checking completion:', err);
        }
    };

    const checkKycStatus = async () => {
        if (!address) return;

        try {
            const { data } = await supabase
                .from('users')
                .select('is_kyc_verified')
                .eq('wallet_address', address.toLowerCase())
                .maybeSingle();

            setUserKycStatus((data as any)?.is_kyc_verified || false);
        } catch (err) {
            console.error('Error checking KYC:', err);
        }
    };

    const handleSubmit = async () => {
        if (!quest || !address) return;

        // Validate TX hash format
        if (txHash && !txHash.startsWith('0x')) {
            toast.error('Invalid transaction hash format');
            return;
        }

        setSubmitting(true);
        try {
            const result = await completeQuest(questId, txHash || undefined);

            toast.success(`🎉 Quest completed! You earned ${result.reward} MON`, {
                duration: 5000,
            });

            // Refresh completion status
            setHasCompleted(true);
            setTxHash('');

            // Redirect after a delay
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (error: any) {
            console.error('Quest completion error:', error);
            toast.error(error?.message || 'Failed to complete quest');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-[#0066FF] mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading quest...</p>
                </div>
            </div>
        );
    }

    if (!quest) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Quest Not Found</h2>
                    <p className="text-muted-foreground mb-6">This quest doesn't exist or has been removed.</p>
                    <Link href="/dashboard">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const canComplete = !hasCompleted &&
        quest.status === 'Active' &&
        (!quest.requires_kyc || userKycStatus) &&
        quest.budget_spent < quest.total_budget;

    const potentialReward = quest.base_reward +
        (quest.requires_kyc && userKycStatus ? quest.kyc_bonus : 0);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-[#0066FF]/20 bg-[#0E0E10]/80 backdrop-blur-xl sticky top-0">
                <div className="flex justify-between items-center px-8 py-4">
                    <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                        <img src="/cresco.png" alt="CRESCO" className="w-10 h-10 rounded-lg object-contain transition-transform group-hover:scale-110" />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#0066FF] bg-clip-text text-transparent">
                            CRESCO
                        </h1>
                    </Link>

                    <nav className="flex gap-6 items-center">
                        <Link href="/dashboard" className="text-muted-foreground hover:text-white transition-colors">Dashboard</Link>
                        <Link href="/builder" className="text-muted-foreground hover:text-white transition-colors">Builder</Link>
                        <WalletButton />
                    </nav>
                </div>
            </header>

            <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
                {/* Back Button */}
                <Link href="/dashboard">
                    <Button variant="outline" className="mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>

                {/* Quest Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl p-8 mb-6"
                >
                    <div className="flex items-start gap-6">
                        {quest.image_url && (quest.image_url.startsWith('http') || quest.image_url.startsWith('/')) ? (
                            <img
                                src={quest.image_url}
                                alt={quest.title}
                                className="w-24 h-24 rounded-xl object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 rounded-xl flex items-center justify-center text-5xl">
                                {quest.image_url || '🏆'}
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold">{quest.title}</h1>
                                {quest.status === 'Active' ? (
                                    <span className="px-3 py-1 bg-[#10B981]/10 text-[#10B981] text-sm rounded-full border border-[#10B981]/20">
                                        Active
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-white/10 text-muted-foreground text-sm rounded-full">
                                        {quest.status}
                                    </span>
                                )}
                            </div>

                            {quest.description && (
                                <p className="text-muted-foreground mb-4">{quest.description}</p>
                            )}

                            <div className="flex gap-2">
                                {quest.category && (
                                    <span className="px-3 py-1 bg-white/5 text-sm rounded-full">
                                        {quest.category}
                                    </span>
                                )}
                                {quest.difficulty && (
                                    <span className="px-3 py-1 bg-white/5 text-sm rounded-full">
                                        {quest.difficulty}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Reward & Requirements */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Rewards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-[#10B981]" />
                            </div>
                            <h3 className="text-xl font-bold">Rewards</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Base Reward</span>
                                <span className="font-bold text-[#10B981]">{quest.base_reward} MON</span>
                            </div>
                            {quest.kyc_bonus > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">KYC Bonus</span>
                                    <span className="font-bold text-[#F59E0B]">+{quest.kyc_bonus} MON</span>
                                </div>
                            )}
                            {quest.staker_bonus > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Staker Bonus</span>
                                    <span className="font-bold text-[#0066FF]">+{quest.staker_bonus} MON</span>
                                </div>
                            )}
                            <div className="border-t border-white/10 pt-3 flex justify-between">
                                <span className="font-bold">Your Potential</span>
                                <span className="font-bold text-2xl text-[#10B981]">{potentialReward} MON</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Requirements */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#0066FF]/10 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-[#0066FF]" />
                            </div>
                            <h3 className="text-xl font-bold">Requirements</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">KYC Verification</span>
                                {quest.requires_kyc ? (
                                    userKycStatus ? (
                                        <span className="flex items-center gap-1 text-[#10B981]">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-[#F59E0B]">
                                            <AlertCircle className="w-4 h-4" />
                                            Required
                                        </span>
                                    )
                                ) : (
                                    <span className="text-muted-foreground">Not Required</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Staking</span>
                                {quest.requires_staking ? (
                                    <span className="flex items-center gap-1 text-[#F59E0B]">
                                        <Zap className="w-4 h-4" />
                                        Required
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">Not Required</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Wallet Connection</span>
                                {isConnected ? (
                                    <span className="flex items-center gap-1 text-[#10B981]">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Connected
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-500">
                                        <AlertCircle className="w-4 h-4" />
                                        Not Connected
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Completion Status */}
                {hasCompleted ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-8 text-center border-[#10B981]/20"
                    >
                        <CheckCircle2 className="w-16 h-16 text-[#10B981] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Quest Completed! 🎉</h3>
                        <p className="text-muted-foreground">You've already completed this quest and claimed your rewards.</p>
                    </motion.div>
                ) : !isConnected ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-8 text-center"
                    >
                        <AlertCircle className="w-16 h-16 text-[#F59E0B] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Connect Your Wallet</h3>
                        <p className="text-muted-foreground mb-6">You need to connect your wallet to complete this quest.</p>
                        <ConnectButton />
                    </motion.div>
                ) : quest.status !== 'Active' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-8 text-center"
                    >
                        <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Quest Not Active</h3>
                        <p className="text-muted-foreground">This quest is currently {quest.status.toLowerCase()}.</p>
                    </motion.div>
                ) : quest.budget_spent >= quest.total_budget ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-8 text-center"
                    >
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Budget Exhausted</h3>
                        <p className="text-muted-foreground">This quest has run out of budget for rewards.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-8"
                    >
                        <h3 className="text-2xl font-bold mb-2">Complete This Quest</h3>
                        <p className="text-muted-foreground mb-6">
                            {quest.verification_method === 'manual'
                                ? 'Submit your transaction hash to claim your reward.'
                                : 'Click complete to claim your reward.'}
                        </p>

                        {quest.requires_kyc && !userKycStatus && (
                            <div className="mb-6 p-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-[#F59E0B] mt-0.5" />
                                    <div>
                                        <p className="font-bold text-[#F59E0B] mb-1">KYC Required</p>
                                        <p className="text-sm text-muted-foreground">
                                            You need to complete KYC verification to complete this quest. Without KYC, you won't receive the bonus.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {quest.verification_method === 'manual' && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">
                                    Transaction Hash (Optional)
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={txHash}
                                        onChange={(e) => setTxHash(e.target.value)}
                                        placeholder="0x..."
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors"
                                    />
                                    {txHash && (
                                        <a
                                            href={`https://explorer.monad.xyz/tx/${txHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleSubmit}
                            disabled={submitting || !canComplete}
                            className="w-full bg-gradient-to-r from-[#0066FF] to-[#0066FF] text-lg py-6"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Completing Quest...
                                </>
                            ) : (
                                <>
                                    <Trophy className="w-5 h-5 mr-2" />
                                    Complete Quest & Earn {potentialReward} MON
                                </>
                            )}
                        </Button>
                    </motion.div>
                )}

                {/* Quest Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card rounded-2xl p-6 mt-6"
                >
                    <h3 className="text-lg font-bold mb-4">Quest Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="text-muted-foreground text-sm mb-1">Total Completions</p>
                            <p className="text-2xl font-bold">{quest.total_completions}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm mb-1">Budget Remaining</p>
                            <p className="text-2xl font-bold">
                                ${(quest.total_budget - quest.budget_spent).toFixed(0)}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm mb-1">Completion Rate</p>
                            <p className="text-2xl font-bold">
                                {quest.total_budget > 0
                                    ? Math.round((quest.budget_spent / quest.total_budget) * 100)
                                    : 0}%
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
