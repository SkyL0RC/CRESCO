'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AlertCircle, Shield } from 'lucide-react';
import PlatformStats from '@/components/admin/PlatformStats';
import PendingApprovals from '@/components/admin/PendingApprovals';
import FlaggedUsers from '@/components/admin/FlaggedUsers';
import Link from 'next/link';

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET?.toLowerCase();

export default function AdminPage() {
    const { address, isConnected } = useAccount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Check if user is admin
    const isAdmin = isConnected && address && ADMIN_WALLET && address.toLowerCase() === ADMIN_WALLET;

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <Shield className="w-16 h-16 text-[#0066FF] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
                    <p className="text-muted-foreground mb-6">
                        Please connect your wallet to access the admin panel.
                    </p>
                    <ConnectButton />
                </div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground mb-6">
                        You don't have permission to access the admin panel.
                    </p>
                    <Link href="/dashboard">
                        <button className="px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#0066FF] rounded-lg font-medium hover:opacity-90 transition-opacity">
                            Go to Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0066FF] rounded-full blur-[150px] opacity-10" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#0066FF] rounded-full blur-[150px] opacity-10" />
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
                        <Link href="/dashboard" className="text-muted-foreground hover:text-white transition-colors">User Dashboard</Link>
                        <ConnectButton />
                    </nav>
                </div>
            </header>

            <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                        <span className="bg-[#0066FF]/20 text-[#0066FF] px-2 py-0.5 rounded text-sm font-medium border border-[#0066FF]/30">
                            v1.0.0
                        </span>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Monitor platform activity, approve projects, and manage users.
                    </p>
                </motion.div>

                <PlatformStats />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PendingApprovals />
                    <FlaggedUsers />
                </div>
            </div>
        </div>
    );
}
