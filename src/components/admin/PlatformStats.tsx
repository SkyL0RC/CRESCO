'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Briefcase, Trophy, DollarSign, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface PlatformStatsData {
    totalUsers: number;
    totalProjects: number;
    totalQuests: number;
    totalVolume: number;
    platformFees: number;
}

export default function PlatformStats() {
    const [stats, setStats] = useState<PlatformStatsData>({
        totalUsers: 0,
        totalProjects: 0,
        totalQuests: 0,
        totalVolume: 0,
        platformFees: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlatformStats();
    }, []);

    const fetchPlatformStats = async () => {
        try {
            // Fetch total users
            const { count: usersCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });

            // Fetch total projects
            const { count: projectsCount } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true });

            // Fetch total quests
            const { count: questsCount } = await supabase
                .from('quests')
                .select('*', { count: 'exact', head: true });

            // Fetch total volume (sum of all quest budgets spent)
            const { data: questsData } = await supabase
                .from('quests')
                .select('budget_spent');

            const totalVolume = questsData?.reduce((sum, q: any) => sum + (q.budget_spent || 0), 0) || 0;
            const platformFees = totalVolume * 0.1; // 10% platform fee

            setStats({
                totalUsers: usersCount || 0,
                totalProjects: projectsCount || 0,
                totalQuests: questsCount || 0,
                totalVolume,
                platformFees,
            });
        } catch (error) {
            console.error('Error fetching platform stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        {
            label: 'Total Users',
            value: loading ? '...' : stats.totalUsers.toLocaleString(),
            icon: Users,
            color: 'text-[#0066FF]',
            bg: 'bg-[#0066FF]/20'
        },
        {
            label: 'Total Projects',
            value: loading ? '...' : stats.totalProjects.toString(),
            icon: Briefcase,
            color: 'text-[#0066FF]',
            bg: 'bg-[#0066FF]/20'
        },
        {
            label: 'Total Quests',
            value: loading ? '...' : stats.totalQuests.toString(),
            icon: Trophy,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/20'
        },
        {
            label: 'Total Volume',
            value: loading ? '...' : `$${stats.totalVolume.toFixed(2)}`,
            icon: Wallet,
            color: 'text-[#10B981]',
            bg: 'bg-[#10B981]/20'
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat, index) => (
                <motion.div
                    key={index}
                    className="glass-card p-6 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-bold">{stat.value}</h3>
                </motion.div>
            ))}

            {/* Fees Collected Card (Full Width/Separate) */}
            <motion.div
                className="glass-card p-6 rounded-2xl md:col-span-2 lg:col-span-4 flex items-center justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#0066FF] to-[#0066FF]">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-muted-foreground text-sm">Platform Fees Collected</p>
                        <h3 className="text-3xl font-bold">
                            {loading ? '...' : `$${stats.platformFees.toFixed(2)}`}
                        </h3>
                    </div>
                </div>
                <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl transition-colors font-medium">
                    Withdraw Fees
                </button>
            </motion.div>
        </div>
    );
}
