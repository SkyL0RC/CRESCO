'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Fingerprint, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { WalletButton } from '@/components/ui/wallet-button';

export default function HomePage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Clean Background - No gradients */}
            <div className="absolute inset-0 z-0" />

            {/* Header */}
            <motion.header
                className="relative z-10 flex justify-between items-center px-8 py-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="flex items-center gap-3 group cursor-pointer">
                    <img src="/cresco.png" alt="CRESCO" className="w-10 h-10 rounded-lg object-contain transition-transform group-hover:scale-110" />
                    <h1 className="text-2xl font-bold text-white">
                        CRESCO
                    </h1>
                </div>
                <nav className="flex gap-6 items-center">
                    <a href="#features" className="text-muted-foreground hover:text-white transition-colors">Features</a>
                    <a href="#stats" className="text-muted-foreground hover:text-white transition-colors">Stats</a>
                    <WalletButton />
                </nav>
            </motion.header>

            {/* Hero Section */}
            <motion.section
                className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-8 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <motion.div
                    className="inline-block px-4 py-2 mb-6 rounded-full border border-[#0066FF]/30 bg-[#0066FF]/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="text-sm text-[#0066FF]">Powered by Monad Blockchain</span>
                </motion.div>

                <motion.h2
                    className="text-6xl md:text-7xl font-bold mb-6 max-w-4xl leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-white">
                        Real Users. Real Yield.
                    </span>
                    <br />
                    <span className="text-white">Zero Bots.</span>
                </motion.h2>

                <motion.p
                    className="text-xl text-muted-foreground mb-12 max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    Performance-based user acquisition platform on Monad. Connect verified humans with Web3 projects through ZK-KYC identity and anti-farming shields.
                </motion.p>

                <motion.div
                    className="flex gap-4 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Link href="/dashboard">
                        <Button
                            size="lg"
                            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-6 text-lg shadow-lg shadow-[#0066FF]/50 group h-auto"
                        >
                            Enter App (Earn)
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/builder">
                        <Button
                            size="lg"
                            className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 py-6 text-lg shadow-lg shadow-[#0066FF]/50 h-auto"
                        >
                            For Builders (Grow)
                        </Button>
                    </Link>
                </motion.div>

                {/* Stats Strip */}
                <motion.div
                    id="stats"
                    className="flex gap-8 justify-center flex-wrap max-w-4xl backdrop-blur-xl bg-[#0E0E10]/50 border border-[#0066FF]/20 rounded-2xl p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-[#0066FF] mb-1">$2.4M</div>
                        <div className="text-sm text-muted-foreground">Total Value Distributed</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-[#0066FF] mb-1">47,231</div>
                        <div className="text-sm text-muted-foreground">Verified Humans</div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-3xl font-bold text-[#10B981] mb-1 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            10,000
                        </div>
                        <div className="text-sm text-muted-foreground">Monad TPS Live</div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Features Grid */}
            <motion.section
                id="features"
                className="relative z-10 px-8 py-24 max-w-7xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold mb-4">Why Monad Flow?</h3>
                    <p className="text-muted-foreground text-lg">Built for the high-frequency future of Web3</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <motion.div
                        className="group relative backdrop-blur-xl bg-[#0E0E10]/60 border border-[#0066FF]/20 rounded-2xl p-8 hover:border-[#0066FF] transition-all duration-300 cursor-pointer overflow-hidden"
                        whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0, 102, 255, 0.3)' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-[#0066FF]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Shield className="w-7 h-7 text-[#0066FF]" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Anti-Farming Shield</h4>
                            <p className="text-muted-foreground">
                                Advanced sybil resistance and bot detection. Only real humans get paid, protecting your marketing budget.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="group relative backdrop-blur-xl bg-[#0E0E10]/60 border border-[#0066FF]/20 rounded-2xl p-8 hover:border-[#0066FF] transition-all duration-300 cursor-pointer overflow-hidden"
                        whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0, 102, 255, 0.3)' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-[#0066FF]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Fingerprint className="w-7 h-7 text-[#0066FF]" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">ZK-KYC Identity</h4>
                            <p className="text-muted-foreground">
                                Privacy-preserving verification with zero-knowledge proofs. Prove you're human without revealing your identity.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="group relative backdrop-blur-xl bg-[#0E0E10]/60 border border-[#0066FF]/20 rounded-2xl p-8 hover:border-[#0066FF] transition-all duration-300 cursor-pointer overflow-hidden"
                        whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0, 102, 255, 0.3)' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-[#0066FF]/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7 text-[#0066FF]" />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Instant Payouts</h4>
                            <p className="text-muted-foreground">
                                Powered by Monad's 10,000 TPS. Complete a quest, get paid instantly. No delays, no friction.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-[#0066FF]/20 mt-24 py-12">
                <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0066FF] rounded-lg" />
                        <span className="text-muted-foreground">© 2026 Monad Flow</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="text-muted-foreground hover:text-[#0066FF] transition-colors">Docs</a>
                        <a href="#" className="text-muted-foreground hover:text-[#0066FF] transition-colors">Discord</a>
                        <a href="#" className="text-muted-foreground hover:text-[#0066FF] transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
