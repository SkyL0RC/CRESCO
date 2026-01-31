'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowRight, Lock, ShieldCheck, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function StakingPage() {
    const [stakeAmount, setStakeAmount] = useState('');
    const [isStaking, setIsStaking] = useState(false);

    // Mock data
    const userBalance = 1542.50;
    const stakedAmount = 0;
    const apy = 12.5;

    const handleStake = () => {
        if (!stakeAmount || isNaN(Number(stakeAmount)) || Number(stakeAmount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (Number(stakeAmount) > userBalance) {
            toast.error('Insufficient balance');
            return;
        }

        setIsStaking(true);

        // Mock transaction delay
        setTimeout(() => {
            setIsStaking(false);
            setStakeAmount('');
            toast.success(`Successfully staked ${stakeAmount} MON!`);
        }, 2000);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-8 py-12">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-4">Stake MON</h1>
                    <p className="text-muted-foreground text-lg">Earn rewards and unlock platform badges by staking your MON tokens</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Staking Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            className="glass-card rounded-2xl p-8 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold">Staking</h2>
                                <div className="flex items-center gap-2 text-sm bg-[#0066FF]/10 px-3 py-1.5 rounded-full text-[#0066FF]">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Audited Contract</span>
                                </div>
                            </div>

                            <div className="bg-[#0E0E10]/50 rounded-xl p-6 mb-6 border border-white/5">
                                <div className="flex justify-between mb-4">
                                    <span className="text-muted-foreground">Amount to Stake</span>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Wallet className="w-4 h-4" />
                                        <span>Balance: {userBalance.toLocaleString()} MON</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={stakeAmount}
                                            onChange={(e) => setStakeAmount(e.target.value)}
                                            className="w-full bg-transparent text-3xl font-bold focus:outline-none placeholder:text-muted-foreground/30"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0066FF] to-[#0066FF] flex items-center justify-center text-[10px] font-bold">M</div>
                                        <span className="font-bold">MON</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    {[25, 50, 75, 100].map((percent) => (
                                        <button
                                            key={percent}
                                            onClick={() => setStakeAmount((userBalance * percent / 100).toFixed(2))}
                                            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors"
                                        >
                                            {percent}%
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-[#0E0E10]/50 rounded-xl p-4 border border-white/5">
                                    <p className="text-sm text-muted-foreground mb-1">APY Rate</p>
                                    <p className="text-xl font-bold text-[#10B981]">{apy}%</p>
                                </div>
                                <div className="bg-[#0E0E10]/50 rounded-xl p-4 border border-white/5">
                                    <p className="text-sm text-muted-foreground mb-1">Lock Period</p>
                                    <p className="text-xl font-bold">7 Days</p>
                                </div>
                            </div>

                            <Button
                                size="lg"
                                className="w-full bg-gradient-to-r from-[#0066FF] to-[#0066FF] h-14 text-lg"
                                onClick={handleStake}
                                disabled={isStaking}
                            >
                                {isStaking ? 'Processing...' : 'Stake Tokens'}
                                {!isStaking && <ArrowRight className="w-5 h-5 ml-2" />}
                            </Button>
                        </motion.div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            className="glass-card rounded-2xl p-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Coins className="w-5 h-5 text-[#0066FF]" />
                                Your Staking Stats
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-muted-foreground text-sm">Total Staked</span>
                                    <span className="font-bold">{stakedAmount} MON</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-muted-foreground text-sm">Earned Rewards</span>
                                    <span className="font-bold text-[#10B981]">+0.00 MON</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-muted-foreground text-sm">Next Payout</span>
                                    <span className="font-bold text-sm">in 23h 12m</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="glass-card rounded-2xl p-6 bg-gradient-to-br from-[#0066FF]/20 to-[#0066FF]/10 border-[#0066FF]/30"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5 text-[#0066FF]" />
                                Unlockable Badges
                            </h3>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5">
                                    <div className="text-2xl">🪙</div>
                                    <div>
                                        <p className="font-bold text-sm">Staker Initiation</p>
                                        <p className="text-xs text-muted-foreground">Stake 10+ MON</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 backdrop-blur-sm border border-white/5 opacity-50">
                                    <div className="text-2xl">💎</div>
                                    <div>
                                        <p className="font-bold text-sm">Diamond Hands</p>
                                        <p className="text-xs text-muted-foreground">Stake 100+ MON for 30 days</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
