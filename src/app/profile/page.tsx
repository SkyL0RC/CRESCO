'use client';

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { Shield, Star, Trophy, TrendingUp, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/hooks/useUser';
import { useState, useEffect } from 'react';
import { useIsAdmin } from '@/lib/hooks/useIsAdmin';

// Mock user data
// Mock available badges
const availableBadges = [
    {
        id: 'zk-kyc',
        name: 'ZK-KYC',
        description: 'Verified human with zero-knowledge proof',
        tier: 2,
        unlocked: false,
        icon: '🔐',
        requirement: 'Complete KYC verification',
    },
    {
        id: 'monad-staker',
        name: 'Monad Staker',
        description: 'Staked MON tokens',
        tier: 3,
        unlocked: false,
        icon: '💎',
        requirement: 'Stake 100+ MON',
    },
    {
        id: 'veteran',
        name: 'Cross-Chain Veteran',
        description: 'Active on multiple chains',
        tier: 2,
        unlocked: false,
        icon: '🌟',
        requirement: 'Connect wallets from 3+ chains',
    },
    {
        id: 'early-adopter',
        name: 'Early Adopter',
        description: 'One of the first users',
        tier: 1,
        unlocked: false,
        icon: '🚀',
        requirement: 'Complete first quest',
    },
];

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { user, loading: userLoading } = useUser();
    const [mounted, setMounted] = useState(false);
    const isAdmin = useIsAdmin();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0E0E10]">
                <div className="w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isConnected || !address) {
        return (
            <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                </div>

                <div className="relative z-10 glass-card p-8 rounded-2xl text-center max-w-md mx-4">
                    <div className="w-20 h-20 bg-[#0066FF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-[#0066FF]" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">Wallet Not Connected</h2>
                    <p className="text-muted-foreground mb-6">
                        Please connect your wallet to view your profile and stats.
                    </p>
                    <div className="flex justify-center">
                        <ConnectButton />
                    </div>
                </div>
            </div>
        );
    }

    // Determine tier based on user status (example logic)
    let currentTier = 1;
    if (user?.is_kyc_verified) currentTier = 2;
    // if (user?.staked_amount > 100) currentTier = 3; // Example for future

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
                        <Link href="/profile" className="text-white font-medium">Profile</Link>
                        <Link href="/builder" className="text-muted-foreground hover:text-white transition-colors">Builder</Link>
                        {isAdmin && (
                            <Link href="/admin" className="text-[#0066FF] font-medium hover:text-[#0066FF]/80 transition-colors">Admin</Link>
                        )}
                        <ConnectButton />
                    </nav>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Left Column - Identity */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl p-8">
                            {/* Avatar */}
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#0066FF] to-[#0066FF] rounded-full mb-4 flex items-center justify-center text-4xl">
                                    👤
                                </div>
                                <h2 className="text-xl font-bold mb-1">
                                    {address?.slice(0, 6)}...{address?.slice(-4)}
                                </h2>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-sm">
                                    <CheckCircle className="w-4 h-4" />
                                    Sybil Resistant
                                </div>
                            </div>

                            {/* Trust Score */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-muted-foreground">Trust Score</span>
                                    <span className="text-sm font-bold">{user?.reputation_score || 0}/100</span>
                                </div>
                                <div className="w-full h-2 bg-[#0066FF]/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#0066FF] to-[#0066FF] rounded-full transition-all"
                                        style={{ width: `${user?.reputation_score || 0}%` }}
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Total Earned</span>
                                    <span className="font-bold text-[#10B981]">${user?.total_earned?.toFixed(2) || '0.00'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Quests Completed</span>
                                    <span className="font-bold">{user?.quest_completed_count || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Current Tier</span>
                                    <span className="font-bold">
                                        {currentTier === 1 && '⚪ Free'}
                                        {currentTier === 2 && '🟢 KYC'}
                                        {currentTier === 3 && '💜 Staker'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Staking Widget */}
                        <div className="glass-card rounded-2xl p-6 mt-6">
                            <h3 className="text-lg font-bold mb-4">Upgrade Your Tier</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Stake MON tokens to unlock higher rewards and exclusive quests
                            </p>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span>Free Tier</span>
                                    <span className="text-muted-foreground">100% rewards</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Staker Tier</span>
                                    <span className="text-[#0066FF]">150% rewards</span>
                                </div>
                            </div>
                            <Button className="w-full bg-gradient-to-r from-[#0066FF] to-[#0066FF]">
                                Stake MON
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Badges */}
                    <div className="lg:col-span-2">
                        <div className="glass-card rounded-2xl p-8">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-2">Badge Collection</h2>
                                <p className="text-muted-foreground">
                                    Unlock badges to access exclusive quests and higher rewards
                                </p>
                            </div>

                            {/* Badges Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {availableBadges.map((badge, index) => (
                                    <motion.div
                                        key={badge.id}
                                        className={`relative p-6 rounded-2xl border-2 ${badge.unlocked
                                            ? 'border-[#0066FF] bg-[#0066FF]/10'
                                            : 'border-[#0066FF]/20 bg-[#0E0E10]/50'
                                            } transition-all duration-300 cursor-pointer group`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {!badge.unlocked && (
                                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                                <Lock className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )}

                                        <div className="text-center">
                                            <div className="text-4xl mb-3">{badge.icon}</div>
                                            <h4 className="font-bold mb-1 text-sm">{badge.name}</h4>
                                            <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>

                                            {!badge.unlocked && (
                                                <div className="mt-3 pt-3 border-t border-[#0066FF]/20">
                                                    <p className="text-xs text-muted-foreground">{badge.requirement}</p>
                                                </div>
                                            )}

                                            {badge.tier === 3 && (
                                                <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full bg-gradient-to-r from-[#0066FF] to-[#FFD700] text-xs font-bold">
                                                    <Star className="w-3 h-3" />
                                                    Premium
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Badge Claim Section */}
                            <div className="mt-8 pt-8 border-t border-[#0066FF]/20">
                                <h3 className="text-xl font-bold mb-4">Claim Badges</h3>
                                <p className="text-muted-foreground mb-6">
                                    Connect external wallets to prove your Web3 history and unlock veteran badges
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button variant="outline" className="border-[#0066FF]/50">
                                        <span className="mr-2">🦊</span>
                                        Connect Ethereum
                                    </Button>
                                    <Button variant="outline" className="border-[#0066FF]/50">
                                        <span className="mr-2">⚡</span>
                                        Connect Solana
                                    </Button>
                                    <Button variant="outline" className="border-[#0066FF]/50">
                                        <span className="mr-2">🔵</span>
                                        Connect Base
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
