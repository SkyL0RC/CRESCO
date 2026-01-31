'use client';

import { motion } from 'framer-motion';
import { Rocket, Target, Users, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ForProjectsPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
            </div>

            <div className="relative z-10">
                {/* Hero */}
                <section className="pt-32 pb-20 px-8 text-center max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0066FF]/10 text-[#0066FF] border border-[#0066FF]/20 mb-6">
                            <Rocket className="w-4 h-4" />
                            <span className="text-sm font-medium">For Web3 Builders</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Acquire Real Users.<br />
                            <span className="bg-gradient-to-r from-[#0066FF] to-[#0066FF] bg-clip-text text-transparent">
                                Not Bots.
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            The first performance-based user acquisition platform on Monad.
                            Distribute rewards only to verified humans who actually use your dApp.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/project-dashboard">
                                <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-white/90">
                                    Launch Campaign
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5">
                                Talk to Sales
                            </Button>
                        </div>
                    </motion.div>
                </section>

                {/* Features Grid */}
                <section className="py-20 px-8 max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-14 h-14 bg-[#0066FF]/20 rounded-xl flex items-center justify-center mb-6">
                                <Target className="w-7 h-7 text-[#0066FF]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Precision Targeting</h3>
                            <p className="text-muted-foreground">
                                Target users based on on-chain history: Monad stakers, NFT holders, or high-volume traders.
                            </p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-14 h-14 bg-[#0066FF]/20 rounded-xl flex items-center justify-center mb-6">
                                <Users className="w-7 h-7 text-[#0066FF]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Sybil Resistant</h3>
                            <p className="text-muted-foreground">
                                Our ZK-KYC and reputation system filters out bots. You only pay for real human interaction.
                            </p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl">
                            <div className="w-14 h-14 bg-[#10B981]/20 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7 text-[#10B981]" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Pay for Performance</h3>
                            <p className="text-muted-foreground">
                                Zero upfront fees. Smart contracts release funds only when the specific on-chain action is verified.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Integration Steps */}
                <section className="py-20 px-8 bg-[#0E0E10]/30 border-y border-white/5">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-16">Launch in 3 Steps</h2>
                        <div className="space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-full bg-[#0066FF] flex items-center justify-center font-bold text-xl shrink-0">1</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Define Your Quest</h3>
                                    <p className="text-muted-foreground">Set the specific on-chain action you want users to take (e.g., "Swap $10 on MonadSwap") and create your campaign.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-full bg-[#0066FF] flex items-center justify-center font-bold text-xl shrink-0">2</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Set Reward & Budget</h3>
                                    <p className="text-muted-foreground">Decide how much MON to reward per completion. Deposit limits to control your total spend.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center font-bold text-xl shrink-0">3</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Watch You Grow</h3>
                                    <p className="text-muted-foreground">Track real-time analytics as verified users complete your quests. Approve payouts automatically or manually.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-32 px-8 text-center">
                    <div className="max-w-3xl mx-auto glass-card p-12 rounded-3xl border border-[#0066FF]/30 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/10 to-[#0066FF]/10" />
                        <h2 className="text-4xl font-bold mb-6 relative z-10">Ready to scale?</h2>
                        <p className="text-xl text-muted-foreground mb-8 relative z-10">
                            Join 50+ projects building on Monad Flow.
                        </p>
                        <Button size="lg" className="h-14 px-10 text-lg bg-white text-black hover:bg-white/90 relative z-10">
                            Start Building Now
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
}
