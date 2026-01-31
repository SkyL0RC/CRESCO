'use client';

import { motion } from 'framer-motion';
import { Check, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock Data
const pendingProjects = [
    { id: 1, name: 'MonadLend', category: 'DeFi', description: 'DeFi lending protocol on Monad', submitted: '2h ago', wallet: '0x123...456' },
    { id: 2, name: 'Monad NFT Market', category: 'NFT', description: 'The first NFT marketplace', submitted: '5h ago', wallet: '0x789...012' },
    { id: 3, name: 'GameFi Hub', category: 'Gaming', description: 'Play to earn gaming platform', submitted: '1d ago', wallet: '0xabc...def' },
];

export default function PendingApprovals() {
    return (
        <motion.div
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    Pending Project Approvals
                    <span className="bg-[#0066FF]/20 text-[#0066FF] text-xs px-2 py-0.5 rounded-full">
                        {pendingProjects.length}
                    </span>
                </h2>
                <Button variant="ghost" size="sm">View All</Button>
            </div>

            <div className="space-y-4">
                {pendingProjects.map((project) => (
                    <div key={project.id} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg">{project.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white">{project.category}</span>
                                    <span>• {project.submitted}</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="w-4 h-4" />
                            </Button>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {project.description}
                        </p>

                        <div className="flex gap-2">
                            <Button className="flex-1 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 border border-[#10B981]/20 h-9">
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                            </Button>
                            <Button className="flex-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 h-9">
                                <X className="w-4 h-4 mr-2" />
                                Reject
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
