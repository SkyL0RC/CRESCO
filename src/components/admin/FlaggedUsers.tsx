'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const flaggedUsers = [
    { id: 1, address: '0x1234...5678', reason: 'Suspicious bot activity', type: 'High Risk' },
    { id: 2, address: '0x9876...4321', reason: 'Multiple failed KYC attempts', type: 'Medium Risk' },
];

export default function FlaggedUsers() {
    return (
        <motion.div
            className="glass-card rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    Flagged Users
                    <span className="bg-red-500/10 text-red-500 text-xs px-2 py-0.5 rounded-full">
                        {flaggedUsers.length}
                    </span>
                </h2>
                <Button variant="ghost" size="sm">View All</Button>
            </div>

            <div className="space-y-4">
                {flaggedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                                <p className="font-mono font-medium">{user.address}</p>
                                <p className="text-xs text-red-400">{user.reason}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button size="sm" variant="destructive" className="h-8">
                                <Ban className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="secondary" className="h-8">
                                <CheckCircle className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {flaggedUsers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No flagged users found.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
