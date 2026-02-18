'use client';

export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import { Plus, Users, DollarSign, TrendingUp, MoreVertical, Edit, Pause, BarChart3, Rocket, ArrowLeft, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useProjects } from '@/lib/hooks/useProjects';
import { useQuests } from '@/lib/hooks/useQuests';
import { useIsAdmin } from '@/lib/hooks/useIsAdmin';
import { useMemo, useState } from 'react';
import { EditQuestModal } from '@/components/project/EditQuestModal';

export default function ProjectDashboard() {
    const { projects, loading: projectsLoading } = useProjects();
    const [editingQuest, setEditingQuest] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { quests: allQuests, loading: questsLoading, refetch: refetchQuests } = useQuests();
    const isAdmin = useIsAdmin();

    // Use first project for now (can be made dynamic with URL params later)
    const project = useMemo(() => projects[0] || null, [projects]);

    // Filter quests for this project
    const projectQuests = useMemo(() => {
        if (!project) return [];
        return allQuests.filter(q => q.project_id === project.id);
    }, [allQuests, project]);

    // Calculate stats
    const stats = useMemo(() => {
        if (!project || !projectQuests.length) {
            return [
                { label: 'Active Quests', value: '0', icon: Rocket, color: 'text-[#0066FF]', bg: 'bg-[#0066FF]/20' },
                { label: 'Total Users', value: '0', icon: Users, color: 'text-[#0066FF]', bg: 'bg-[#0066FF]/20' },
                { label: 'Conversion Rate', value: '0%', icon: TrendingUp, color: 'text-[#10B981]', bg: 'bg-[#10B981]/20' },
                { label: 'Budget Spent', value: '$0', sub: `of $${project?.total_budget || 0}`, icon: DollarSign, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/20' },
            ];
        }

        const activeQuests = projectQuests.filter(q => q.status === 'Active').length;
        const totalCompletions = projectQuests.reduce((sum, q) => sum + q.total_completions, 0);
        const budgetSpent = projectQuests.reduce((sum, q) => sum + q.budget_spent, 0);
        const conversionRate = totalCompletions > 0 ? Math.round((totalCompletions / (totalCompletions + 200)) * 100) : 0;

        return [
            { label: 'Active Quests', value: activeQuests.toString(), icon: Rocket, color: 'text-[#0066FF]', bg: 'bg-[#0066FF]/20' },
            { label: 'Total Users', value: totalCompletions.toLocaleString(), icon: Users, color: 'text-[#0066FF]', bg: 'bg-[#0066FF]/20' },
            { label: 'Conversion Rate', value: `${conversionRate}%`, icon: TrendingUp, color: 'text-[#10B981]', bg: 'bg-[#10B981]/20' },
            { label: 'Budget Spent', value: `$${budgetSpent.toFixed(0)}`, sub: `of $${project.total_budget}`, icon: DollarSign, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/20' },
        ];
    }, [project, projectQuests]);

    const handleEdit = (quest: any) => {
        setEditingQuest(quest);
        setIsEditModalOpen(true);
    };


    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {project?.logo_url && (project.logo_url.startsWith('http') || project.logo_url.startsWith('/')) ? (
                                <img src={project.logo_url} alt={project.name} className="w-10 h-10 rounded-lg object-cover" />
                            ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0066FF] rounded-lg flex items-center justify-center font-bold text-white text-xl">
                                    {project?.logo_url || 'MS'}
                                </div>
                            )}
                            <h1 className="text-3xl font-bold">{project?.name || 'Your Project'}</h1>
                            <span className="bg-[#10B981]/10 text-[#10B981] text-xs px-2 py-1 rounded-full border border-[#10B981]/20 flex items-center gap-1">
                                <CheckCircleIcon className="w-3 h-3" /> Verified
                            </span>
                        </div>
                        <p className="text-muted-foreground">Manage your campaigns and track performance</p>
                    </div>

                    <Link href="/create-quest">
                        <Button size="lg" className="bg-gradient-to-r from-[#0066FF] to-[#0066FF] hover:opacity-90">
                            <Plus className="w-5 h-5 mr-2" />
                            Create New Quest
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
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
                                {stat.sub && <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded">{stat.sub}</span>}
                            </div>
                            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Active Quests */}
                <motion.div
                    className="glass-card rounded-2xl p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Your Campaigns</h2>
                        <Button variant="ghost" size="sm">View All</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10 text-left">
                                    <th className="pb-4 text-muted-foreground font-medium pl-4">Quest Name</th>
                                    <th className="pb-4 text-muted-foreground font-medium">Status</th>
                                    <th className="pb-4 text-muted-foreground font-medium">Completions</th>
                                    <th className="pb-4 text-muted-foreground font-medium">Budget Spent</th>
                                    <th className="pb-4 text-muted-foreground font-medium text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectQuests.map((quest) => (
                                    <tr key={quest.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 pl-4 font-medium">{quest.title}</td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${quest.status === 'Active' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-yellow-500/10 text-yellow-500'
                                                }`}>
                                                {quest.status}
                                            </span>
                                            {quest.contract_quest_id ? (
                                                <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20" title="On-Chain Quest">
                                                    ⛓️ On-Chain
                                                </span>
                                            ) : (
                                                <span className="ml-2 px-2 py-1 rounded-full text-xs bg-gray-500/10 text-gray-500 border border-white/10" title="Database Only">
                                                    💾 Off-Chain
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4">{quest.total_completions}</td>
                                        <td className="py-4">
                                            <div className="flex items-center gap-2">
                                                <span>${quest.budget_spent}</span>
                                                <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#0066FF]" style={{ width: `${(quest.budget_spent / quest.total_budget) * 100}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right pr-4">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10"><BarChart3 className="w-4 h-4" /></Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10" onClick={() => handleEdit(quest)}><Edit className="w-4 h-4" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Edit Modal */}
                {editingQuest && (
                    <EditQuestModal
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                        quest={editingQuest}
                        onSuccess={refetchQuests}
                    />
                )}
            </div>
        </div>
    );
}

function CheckCircleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
    )
}
