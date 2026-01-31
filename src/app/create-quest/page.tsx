'use client';

import { useState } from 'react';
import QuestCreationForm from '@/components/project/QuestCreationForm';
import { ProjectCreationModal } from '@/components/project/ProjectCreationModal';
import { useProjects } from '@/lib/hooks/useProjects';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Plus, Rocket, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function CreateQuestPage() {
    const { isConnected } = useAccount();
    const { projects, loading } = useProjects();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [showProjectModal, setShowProjectModal] = useState(false);

    // If project selected, show quest form
    if (selectedProjectId) {
        return (
            <div className="min-h-screen relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                    <div className="text-center mb-12">
                        <Button
                            variant="outline"
                            onClick={() => setSelectedProjectId(null)}
                            className="mb-4"
                        >
                            ← Back to Project Selection
                        </Button>
                        <h1 className="text-4xl font-bold mb-4">Create New Quest</h1>
                        <p className="text-muted-foreground text-lg">Define your quest, set rewards, and launch in minutes.</p>
                    </div>

                    <div className="flex justify-center">
                        <div className="w-full max-w-4xl">
                            <QuestCreationForm projectId={selectedProjectId} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Project selection screen
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
                        <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0066FF] rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#0066FF] bg-clip-text text-transparent">
                            Monad Flow
                        </h1>
                    </Link>

                    <nav className="flex gap-6 items-center">
                        <Link href="/dashboard" className="text-muted-foreground hover:text-white transition-colors">Dashboard</Link>
                        <Link href="/builder" className="text-muted-foreground hover:text-white transition-colors">Builder</Link>
                        <ConnectButton />
                    </nav>
                </div>
            </header>

            <div className="relative z-10 max-w-5xl mx-auto px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Select a Project</h1>
                    <p className="text-muted-foreground text-lg">Choose which project this quest belongs to</p>
                </div>

                {!isConnected ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                        <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                        <p className="text-muted-foreground mb-6">You need to connect your wallet to create quests</p>
                        <ConnectButton />
                    </div>
                ) : loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF] mx-auto"></div>
                        <p className="text-muted-foreground mt-4">Loading your projects...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Create New Project Button */}
                        <button
                            onClick={() => setShowProjectModal(true)}
                            className="w-full glass-card rounded-2xl p-8 hover:border-[#0066FF] transition-all duration-300 cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0066FF] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Plus className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-bold mb-1">Create New Project</h3>
                                    <p className="text-muted-foreground">Set up a new project to organize your quests</p>
                                </div>
                            </div>
                        </button>

                        {/* Existing Projects */}
                        {projects.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-muted-foreground">Your Projects</h3>
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        onClick={() => setSelectedProjectId(project.id)}
                                        className="w-full glass-card rounded-2xl p-6 hover:border-[#0066FF] transition-all duration-300 cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {project.logo_url ? (
                                                    <img
                                                        src={project.logo_url}
                                                        alt={project.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gradient-to-br from-[#0066FF] to-[#0066FF] rounded-lg flex items-center justify-center font-bold text-white">
                                                        {project.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-lg font-bold">{project.name}</h3>
                                                        {project.is_verified && (
                                                            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {project.description || 'No description'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Budget: ${project.total_budget.toLocaleString()} MON
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right text-sm text-muted-foreground">
                                                {project.category && (
                                                    <span className="px-3 py-1 bg-white/5 rounded-full">
                                                        {project.category}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {projects.length === 0 && (
                            <div className="glass-card rounded-2xl p-12 text-center">
                                <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No Projects Yet</h3>
                                <p className="text-muted-foreground mb-6">
                                    Create your first project to start building quests
                                </p>
                                <Button
                                    onClick={() => setShowProjectModal(true)}
                                    className="bg-gradient-to-r from-[#0066FF] to-[#0066FF]"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Project
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Project Creation Modal */}
            <ProjectCreationModal
                isOpen={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                onProjectCreated={(projectId) => {
                    setSelectedProjectId(projectId);
                    setShowProjectModal(false);
                }}
            />
        </div>
    );
}
