'use client';

import { motion } from 'framer-motion';
import { AreaChart, BarChart, LineChart, PieChart, Activity, Users, DollarSign, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';

// Mock Data
const metrics = [
    { label: 'Total Completions', value: '1,234', change: '+12%', icon: Users, color: 'text-[#0066FF]' },
    { label: 'Budget Spent', value: '$4,560', change: '+5%', icon: DollarSign, color: 'text-[#0066FF]' },
    { label: 'Avg. Education Time', value: '2m 34s', change: '-10s', icon: Clock, color: 'text-[#10B981]' },
    { label: 'User Quality Score', value: '92/100', change: '+2', icon: Activity, color: 'text-[#F59E0B]' },
];

export default function QuestAnalyticsPage({ params }: { params: { id: string } }) {
    // In a real app, use params.id to fetch data

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                <div className="mb-8">
                    <Link href="/project-dashboard">
                        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground hover:text-white pl-0">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>
                    </Link>
                    <div className="flex justify-between items-end">
                        <h1 className="text-3xl font-bold">Campaign Analytics</h1>
                        <div className="flex gap-2">
                            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>All Time</option>
                            </select>
                            <Button variant="outline" size="sm" className="border-white/10">Export CSV</Button>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={index}
                            className="glass-card p-6 rounded-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <metric.icon className={`w-5 h-5 ${metric.color}`} />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${metric.change.startsWith('+') ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-red-500/10 text-red-500'
                                    }`}>
                                    {metric.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                            <p className="text-sm text-muted-foreground">{metric.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        className="glass-card p-8 rounded-2xl lg:col-span-2 min-h-[400px] flex flex-col"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="text-lg font-bold mb-6">User Acquisition Growth</h3>
                        {/* Mock Chart Placeholder */}
                        <div className="flex-1 w-full bg-gradient-to-t from-[#0066FF]/20 to-transparent rounded-xl flex items-end justify-between px-4 pb-4 gap-2 border-b border-[#0066FF]/30">
                            {[40, 60, 45, 70, 85, 90, 75, 95, 120, 110].map((h, i) => (
                                <div key={i} className="w-full bg-[#0066FF]/40 hover:bg-[#0066FF]/60 transition-all rounded-t-sm relative group" style={{ height: `${h}%`, maxHeight: '300px' }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h * 12} Users
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                            <span>Day 1</span>
                            <span>Day 5</span>
                            <span>Day 10</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="glass-card p-8 rounded-2xl flex flex-col"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="text-lg font-bold mb-6">User Demographics</h3>
                        <div className="flex-1 flex flex-col justify-center gap-6">
                            <div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>Verified Humans</span>
                                    <span className="font-bold">85%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-[#10B981] h-2 rounded-full" style={{ width: '85%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>Monad Stakers</span>
                                    <span className="font-bold">62%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-[#0066FF] h-2 rounded-full" style={{ width: '62%' }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2 text-sm">
                                    <span>NFT Holders</span>
                                    <span className="font-bold">45%</span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-[#0066FF] h-2 rounded-full" style={{ width: '45%' }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    className="glass-card p-8 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3 className="text-lg font-bold mb-6">Recent Completions</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10 text-left">
                                <th className="pb-4 text-muted-foreground font-medium">User</th>
                                <th className="pb-4 text-muted-foreground font-medium">Time</th>
                                <th className="pb-4 text-muted-foreground font-medium">Status</th>
                                <th className="pb-4 text-muted-foreground font-medium text-right">Reward</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="py-4 font-mono text-muted-foreground">0x{Math.random().toString(16).slice(2, 8)}...{Math.random().toString(16).slice(2, 6)}</td>
                                    <td className="py-4 text-muted-foreground">{i * 2} mins ago</td>
                                    <td className="py-4">
                                        <span className="bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded-full text-xs">Verified</span>
                                    </td>
                                    <td className="py-4 text-right">15 MON</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </div>
    );
}
