'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, Trophy, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WalletButton } from '@/components/ui/wallet-button';
import { useUser } from '@/lib/hooks/useUser';
import { useQuests } from '@/lib/hooks/useQuests';
import { useAccount } from 'wagmi';
import { useIsAdmin } from '@/lib/hooks/useIsAdmin';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { isConnected } = useAccount();
    const { user, loading: userLoading } = useUser();
    const { quests, loading: questsLoading } = useQuests({ status: 'Active' });
    const [mounted, setMounted] = useState(false);
    const isAdmin = useIsAdmin();
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Redirect admin to admin panel
    useEffect(() => {
        if (mounted && isAdmin) {
            router.push('/admin');
        }
    }, [mounted, isAdmin, router]);

    // Prevent hydration mismatch - wait for client-side mount
    if (!mounted || userLoading || questsLoading) {
        return null;
    }

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
                        <Link href="/dashboard" className="text-white font-medium">Dashboard</Link>
                        <Link href="/profile" className="text-muted-foreground hover:text-white transition-colors">Profile</Link>
                        <Link href="/builder" className="text-muted-foreground hover:text-white transition-colors">Builder</Link>
                        <WalletButton />
                    </nav>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                {/* Welcome Section */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-4xl font-bold mb-2">Welcome back! 👋</h2>
                    <p className="text-muted-foreground">Complete quests and earn rewards on Monad</p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#0066FF]/20 rounded-lg flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-[#0066FF]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Earned</p>
                                <p className="text-2xl font-bold text-white">
                                    ${user?.total_earned?.toFixed(2) || '0.00'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#0066FF]/20 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-[#0066FF]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Quests Done</p>
                                <p className="text-2xl font-bold text-white">
                                    {user?.quest_completed_count || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#0066FF]/20 rounded-lg flex items-center justify-center">
                                <Star className="w-5 h-5 text-[#0066FF]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Reputation</p>
                                <p className="text-2xl font-bold text-white">
                                    {user?.reputation_score || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-[#10B981]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="text-2xl font-bold text-white">
                                    {user?.is_kyc_verified ? '✅ Verified' : 'Basic'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    className="flex gap-3 mb-8 overflow-x-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button variant="default" size="sm">All Quests</Button>
                    <Button variant="outline" size="sm">High Yield</Button>
                    <Button variant="outline" size="sm">Easy Start</Button>
                    <Button variant="outline" size="sm">Verified Only</Button>
                    <Button variant="outline" size="sm">Staker Special</Button>
                </motion.div>

                {/* Quest Grid */}
                {questsLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF] mx-auto"></div>
                        <p className="text-muted-foreground mt-4">Loading quests...</p>
                    </div>
                ) : quests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quests.map((quest, index) => (
                            <motion.div
                                key={quest.id}
                                className="group glass-card rounded-2xl p-6 hover:border-[#0066FF] transition-all duration-300 cursor-pointer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                {/* Project Info */}
                                <div className="flex items-center gap-3 mb-4">
                                    {quest.image_url && (quest.image_url.startsWith('http') || quest.image_url.startsWith('/')) ? (
                                        <img
                                            src={quest.image_url}
                                            alt={quest.title}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 rounded-lg flex items-center justify-center text-2xl">
                                            {quest.image_url || '🎯'}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-white">{quest.owner_wallet.slice(0, 6)}...</h4>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${quest.difficulty === 'Easy' ? 'bg-[#10B981]/20 text-[#10B981]' :
                                                quest.difficulty === 'Medium' ? 'bg-[#F59E0B]/20 text-[#F59E0B]' :
                                                    'bg-[#FF4444]/20 text-[#FF4444]'
                                                }`}>
                                                {quest.difficulty}
                                            </span>
                                            {quest.category && (
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                                                    {quest.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quest Title & Description */}
                                <h3 className="text-lg font-bold mb-2">{quest.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {quest.description}
                                </p>

                                {/* Requirements */}
                                {(quest.requires_kyc || quest.requires_staking) && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <Lock className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            Requires: {[
                                                quest.requires_kyc && 'KYC',
                                                quest.requires_staking && 'Staking'
                                            ].filter(Boolean).join(', ')}
                                        </span>
                                    </div>
                                )}

                                {/* Reward & CTA */}
                                <div className="flex items-center justify-between pt-4 border-t border-[#0066FF]/20">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Reward</p>
                                        <p className="text-xl font-bold text-[#10B981]">
                                            ${quest.reward_amount.toFixed(2)} MON
                                        </p>
                                        {quest.kyc_bonus > 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                +${quest.kyc_bonus.toFixed(2)} KYC bonus
                                            </p>
                                        )}
                                    </div>
                                    <Link href={`/quests/${quest.id}`}>
                                        <Button
                                            size="sm"
                                            className="bg-gradient-to-r from-[#0066FF] to-[#0066FF]"
                                            disabled={!isConnected || (quest.requires_kyc && !user?.is_kyc_verified)}
                                        >
                                            {!isConnected ? 'Connect' :
                                                (quest.requires_kyc && !user?.is_kyc_verified) ? 'Locked' :
                                                    'Start'}
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="glass-card rounded-2xl p-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">No quests available yet</h3>
                        <p className="text-muted-foreground">Check back soon for new opportunities!</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
