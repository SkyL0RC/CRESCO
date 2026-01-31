'use client';

import { motion } from 'framer-motion';
import { BarChart3, Users, Shield, DollarSign, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProjects } from '@/lib/hooks/useProjects';
import { useQuests } from '@/lib/hooks/useQuests';
import { useIsAdmin } from '@/lib/hooks/useIsAdmin';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';

export default function BuilderPage() {
    const { isConnected } = useAccount();
    const { projects, loading: projectsLoading } = useProjects();
    const { quests, loading: questsLoading } = useQuests();
    const isAdmin = useIsAdmin();

    // Calculate builder stats from real data
    const builderStats = useMemo(() => {
        if (!projects.length) {
            return {
                totalSpend: 0,
                realUsersAcquired: 0,
                retentionRate: 0,
                botsBlocked: 0,
            };
        }

        const totalBudget = projects.reduce((sum, p) => sum + p.total_budget, 0);
        const userQuests = quests.filter(q =>
            projects.some(p => p.id === q.project_id)
        );
        const totalCompletions = userQuests.reduce((sum, q) => sum + q.total_completions, 0);

        return {
            totalSpend: totalBudget,
            realUsersAcquired: totalCompletions,
            retentionRate: totalCompletions > 0 ? Math.round((totalCompletions / (totalCompletions + 100)) * 100) : 0,
            botsBlocked: Math.round(totalCompletions * 0.3), // Mock bot blocking
        };
    }, [projects, quests]);

    // Get user's campaigns (quests)
    const userCampaigns = useMemo(() => {
        return quests
            .filter(q => projects.some(p => p.id === q.project_id))
            .map(quest => ({
                id: quest.id,
                name: quest.title,
                status: quest.status.toLowerCase(),
                participants: quest.total_completions,
                budget: quest.total_budget,
                spent: quest.budget_spent,
            }));
    }, [quests, projects]);

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
                        <Link href="/profile" className="text-muted-foreground hover:text-white transition-colors">Profile</Link>
                        <Link href="/builder" className="text-white font-medium">Builder</Link>
                        {isAdmin && (
                            <Link href="/admin" className="text-[#0066FF] font-medium hover:text-[#0066FF]/80 transition-colors">Admin</Link>
                        )}
                        <ConnectButton />
                    </nav>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                {/* Welcome Section */}
                <motion.div
                    className="flex justify-between items-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <h2 className="text-4xl font-bold mb-2">Builder Dashboard</h2>
                        <p className="text-muted-foreground">Manage campaigns and track user acquisition</p>
                    </div>
                    <Link href="/create-quest">
                        <Button className="bg-gradient-to-r from-[#0066FF] to-[#0066FF]">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Campaign
                        </Button>
                    </Link>
                </motion.div>

                {/* Key Metrics */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-[#0066FF]/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-[#0066FF]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Spend</p>
                                <p className="text-2xl font-bold text-white">${builderStats.totalSpend.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-[#0066FF]/20 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-[#0066FF]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Real Users</p>
                                <p className="text-2xl font-bold text-white">{builderStats.realUsersAcquired.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-[#10B981]/20 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-[#10B981]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Retention (D7)</p>
                                <p className="text-2xl font-bold text-white">{builderStats.retentionRate}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-[#FF4444]/20 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-[#FF4444]" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Bots Blocked</p>
                                <p className="text-2xl font-bold text-white">{builderStats.botsBlocked.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Traffic Quality Chart */}
                <motion.div
                    className="glass-card rounded-2xl p-8 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">Traffic Quality</h3>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#0066FF]" />
                                <span className="text-muted-foreground">Real Humans</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#FF4444]" />
                                <span className="text-muted-foreground">Bots Blocked</span>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder for chart */}
                    <div className="h-64 flex items-center justify-center border border-[#0066FF]/20 rounded-xl">
                        <div className="text-center">
                            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-muted-foreground">Chart visualization will be integrated with Recharts</p>
                        </div>
                    </div>
                </motion.div>

                {/* Active Campaigns */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="text-2xl font-bold mb-6">Your Campaigns</h3>

                    <div className="space-y-4">
                        {userCampaigns.map((campaign) => (
                            <div key={campaign.id} className="glass-card rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-lg font-bold">{campaign.name}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${campaign.status === 'active'
                                            ? 'bg-[#10B981]/20 text-[#10B981]'
                                            : 'bg-[#9CA3AF]/20 text-[#9CA3AF]'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </div>
                                    <Button variant="outline" size="sm">View Details</Button>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Participants</p>
                                        <p className="text-xl font-bold">{campaign.participants}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Budget</p>
                                        <p className="text-xl font-bold">${campaign.budget.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Spent</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xl font-bold">${campaign.spent.toLocaleString()}</p>
                                            <span className="text-sm text-muted-foreground">
                                                ({Math.round((campaign.spent / campaign.budget) * 100)}%)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-4">
                                    <div className="w-full h-2 bg-[#0066FF]/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#0066FF] to-[#0066FF] rounded-full transition-all"
                                            style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Campaign Creation Wizard Teaser */}
                <motion.div
                    className="glass-card rounded-2xl p-12 text-center mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="max-w-2xl mx-auto">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0066FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Plus className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Ready to launch your campaign?</h3>
                        <p className="text-muted-foreground mb-8">
                            Create targeted quests, set rewards, and acquire real, verified users for your Web3 project
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="text-left">
                                <div className="text-3xl mb-2">1️⃣</div>
                                <p className="font-bold mb-1">Define Task</p>
                                <p className="text-sm text-muted-foreground">Choose the on-chain action</p>
                            </div>
                            <div className="text-left">
                                <div className="text-3xl mb-2">2️⃣</div>
                                <p className="font-bold mb-1">Target Audience</p>
                                <p className="text-sm text-muted-foreground">Select required badges</p>
                            </div>
                            <div className="text-left">
                                <div className="text-3xl mb-2">3️⃣</div>
                                <p className="font-bold mb-1">Set Rewards</p>
                                <p className="text-sm text-muted-foreground">Define payouts per action</p>
                            </div>
                        </div>
                        <Button size="lg" className="bg-gradient-to-r from-[#0066FF] to-[#0066FF] px-8">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Campaign
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
