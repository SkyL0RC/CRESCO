'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Flame, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DailyGMPage() {
    const [streaks, setStreaks] = useState(12);
    const [hasCheckedIn, setHasCheckedIn] = useState(false);

    const handleCheckIn = () => {
        // Mock check-in logic
        setHasCheckedIn(true);
        setStreaks(streaks + 1);
        toast.success('GM! Daily check-in successful (+0.5 points)');
    };

    const weekDays = [
        { day: 'Mon', checked: true },
        { day: 'Tue', checked: true },
        { day: 'Wed', checked: true },
        { day: 'Thu', checked: true },
        { day: 'Fri', checked: true },
        { day: 'Sat', checked: true },
        { day: 'Sun', checked: false }, // Today
    ];

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0066FF] rounded-full blur-[120px] opacity-10" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-8 py-12">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-4">Daily GM</h1>
                    <p className="text-muted-foreground text-lg">Check in daily to earn points and maintain your streak!</p>
                </motion.div>

                {/* Main Card */}
                <motion.div
                    className="glass-card rounded-2xl p-8 md:p-12 text-center mb-8 relative overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Floating Background Effects */}
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#0066FF]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#0066FF]/10 rounded-full blur-3xl" />

                    {/* Streak Counter */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative">
                            <Flame className={`w-24 h-24 mb-4 ${hasCheckedIn ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'}`} />
                            {hasCheckedIn && (
                                <motion.div
                                    className="absolute -top-2 -right-2 text-2xl"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                >
                                    🔥
                                </motion.div>
                            )}
                        </div>
                        <h2 className="text-5xl font-bold mb-2">{streaks}</h2>
                        <p className="text-muted-foreground uppercase tracking-widest text-sm font-semibold">Day Streak</p>
                    </div>

                    {/* Check-in Button */}
                    <div className="mb-12">
                        <Button
                            size="lg"
                            className={`w-full max-w-sm h-16 text-xl rounded-xl transition-all duration-300 ${hasCheckedIn
                                    ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/20'
                                    : 'bg-gradient-to-r from-[#0066FF] to-[#0066FF] hover:opacity-90 shadow-lg shadow-[#0066FF]/25 hover:shadow-[#0066FF]/40 hover:-translate-y-1'
                                }`}
                            onClick={handleCheckIn}
                            disabled={hasCheckedIn}
                        >
                            {hasCheckedIn ? (
                                <span className="flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6" />
                                    Checked In
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    👋 Say GM!
                                </span>
                            )}
                        </Button>
                        <p className="mt-4 text-sm text-muted-foreground">
                            {hasCheckedIn
                                ? "Come back tomorrow to keep your streak alive!"
                                : "Reward: +0.5 Reputation Points"
                            }
                        </p>
                    </div>

                    {/* Weekly Progress */}
                    <div className="max-w-xl mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium">This Week</span>
                            <span className="text-sm text-muted-foreground">6/7 Days</span>
                        </div>
                        <div className="flex justify-between gap-2">
                            {weekDays.map((day, index) => (
                                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                    <div className={`w-full aspect-square rounded-lg flex items-center justify-center border transition-all ${day.checked
                                            ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]'
                                            : index === 6 && hasCheckedIn // Simulating today check
                                                ? 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]'
                                                : 'bg-[#0E0E10]/50 border-white/10 text-muted-foreground'
                                        }`}>
                                        {(day.checked || (index === 6 && hasCheckedIn)) && <CheckCircle className="w-5 h-5" />}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        className="glass-card rounded-2xl p-6 flex items-center gap-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-12 h-12 bg-[#0066FF]/20 rounded-xl flex items-center justify-center">
                            <Trophy className="w-6 h-6 text-[#0066FF]" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Points</p>
                            <p className="text-2xl font-bold">47.5</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="glass-card rounded-2xl p-6 flex items-center gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="w-12 h-12 bg-[#0066FF]/20 rounded-xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-[#0066FF]" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">This Month</p>
                            <p className="text-2xl font-bold">24 Days</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
