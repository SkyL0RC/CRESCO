'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Upload, Wallet, Zap, Shield, Image as ImageIcon, Rocket, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuestActions } from '@/lib/hooks/useQuestActions';
import { useRouter } from 'next/navigation';

const steps = [
    { number: 1, title: 'Basic Info', desc: 'Describe your quest' },
    { number: 2, title: 'Rewards', desc: 'Set payout amount' },
    { number: 3, title: 'Requirements', desc: 'Who can join?' },
    { number: 4, title: 'Review', desc: 'Launch campaign' },
];

interface QuestCreationFormProps {
    projectId: string;
}

// Predefined quest emojis for variety
const QUEST_EMOJIS = ['🚀', '💎', '🛡️', '⚡', '🦄', '🔗', '💰', '🎯', '🌟', '🔥', '🎮', '🌐'];

export default function QuestCreationForm({ projectId }: QuestCreationFormProps) {
    const router = useRouter();
    const { createQuest } = useQuestActions();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'DeFi',
        difficulty: 'Easy',
        image_url: '',
        base_reward: 10,
        kyc_bonus: 0,
        requirements: {
            kyc: false,
            staking: false,
        },
        total_budget: 1000,
    });

    const handleNext = () => {
        if (currentStep < 4) setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Select a random emoji if none provided
            const finalImage = formData.image_url || QUEST_EMOJIS[Math.floor(Math.random() * QUEST_EMOJIS.length)];

            await createQuest({
                project_id: projectId,
                title: formData.title,
                description: formData.description || null,
                category: formData.category || null,
                difficulty: formData.difficulty || null,
                image_url: finalImage,
                reward_amount: formData.base_reward + formData.kyc_bonus,
                base_reward: formData.base_reward,
                kyc_bonus: formData.kyc_bonus,
                staker_bonus: 0,
                requires_kyc: formData.requirements.kyc,
                requires_staking: formData.requirements.staking,
                // Calculate budget for 10 users + 10% buffer/fee as shown in UI
                total_budget: Number(((formData.base_reward + formData.kyc_bonus) * 10 * 1.1).toFixed(2)),
                verification_method: 'manual',
            });

            toast.success('Quest created successfully! 🎉');

            // Redirect to project dashboard
            setTimeout(() => {
                router.push('/project-dashboard');
            }, 1500);
        } catch (error: any) {
            console.error('Error creating quest:', error);
            toast.error(error?.message || 'Failed to create quest');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl mx-auto">
            {/* Steps Indicator */}
            <div className="mb-12">
                <div className="flex justify-between items-center relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10" />
                    {steps.map((step) => (
                        <div key={step.number} className="flex flex-col items-center bg-[#0E0E10] px-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${currentStep >= step.number
                                ? 'bg-[#0066FF] text-white shadow-[0_0_20px_rgba(131,110,249,0.5)]'
                                : 'bg-[#1A1A1D] border border-white/10 text-muted-foreground'
                                }`}>
                                {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                            </div>
                            <span className={`text-sm font-medium ${currentStep >= step.number ? 'text-white' : 'text-muted-foreground'}`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card rounded-2xl p-8 md:p-12 mb-8"
            >
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Quest Details</h2>

                        <div>
                            <label className="block text-sm font-medium mb-2">Quest Title</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0066FF]"
                                placeholder="e.g. Swap $10 on MonadSwap"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0066FF] h-32"
                                placeholder="Explain specifically what the user needs to do..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#0066FF] appearance-none">
                                    <option>DeFi</option>
                                    <option>NFT</option>
                                    <option>Gaming</option>
                                    <option>Social</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Media</label>
                                <div className="w-full border-2 border-dashed border-white/10 rounded-xl p-3 flex items-center justify-center cursor-pointer hover:border-[#0066FF]/50 hover:bg-[#0066FF]/5 transition-all text-center h-[50px]">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Upload className="w-4 h-4" />
                                        <span>Upload Cover</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Rewards */}
                {currentStep === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Set Rewards</h2>

                        <div className="bg-[#0066FF]/10 border border-[#0066FF]/20 rounded-xl p-6 mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-[#0066FF] mb-1">Base Reward</h3>
                                    <p className="text-sm text-muted-foreground">Amount every user gets upon completion</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="w-24 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-right font-mono"
                                        value={formData.base_reward}
                                        onChange={(e) => setFormData({ ...formData, base_reward: parseFloat(e.target.value) || 0 })}
                                    />
                                    <span className="font-bold">MON</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Optional Bonuses</h3>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">KYC Bonus</h4>
                                        <p className="text-xs text-muted-foreground">Extra reward for verified humans</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm opacity-50">+</span>
                                    <input type="number" placeholder="0.00" className="w-20 bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-right text-sm" />
                                    <span className="text-xs font-bold">MON</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 opacity-70 hover:opacity-100 transition-opacity">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[#0066FF]/20 flex items-center justify-center text-[#0066FF]">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Staker Bonus</h4>
                                        <p className="text-xs text-muted-foreground">For active MON stakers</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm opacity-50">+</span>
                                    <input type="number" placeholder="0.00" className="w-20 bg-black/20 border border-white/10 rounded-lg px-2 py-1 text-right text-sm" />
                                    <span className="text-xs font-bold">MON</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Requirements */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Targeting & Requirements</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${formData.requirements.kyc ? 'border-[#0066FF] bg-[#0066FF]/10' : 'border-white/10 hover:border-white/30'}`}
                                onClick={() => setFormData({ ...formData, requirements: { ...formData.requirements, kyc: !formData.requirements.kyc } })}
                            >
                                <Shield className={`w-8 h-8 mb-4 ${formData.requirements.kyc ? 'text-[#0066FF]' : 'text-muted-foreground'}`} />
                                <h3 className="font-bold mb-2">Require KYC</h3>
                                <p className="text-sm text-muted-foreground">Only allow users who have completed ZK-KYC verification to join.</p>
                            </div>

                            <div
                                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${formData.requirements.staking ? 'border-[#0066FF] bg-[#0066FF]/10' : 'border-white/10 hover:border-white/30'}`}
                                onClick={() => setFormData({ ...formData, requirements: { ...formData.requirements, staking: !formData.requirements.staking } })}
                            >
                                <Zap className={`w-8 h-8 mb-4 ${formData.requirements.staking ? 'text-[#0066FF]' : 'text-muted-foreground'}`} />
                                <h3 className="font-bold mb-2">Monad Stakers Only</h3>
                                <p className="text-sm text-muted-foreground">Limit this quest to users who are staking MON tokens.</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <label className="block text-sm font-medium mb-2">Verification Method</label>
                            <div className="flex gap-4">
                                <div className="flex-1 p-4 rounded-xl bg-white/5 border border-[#0066FF] relative">
                                    <div className="absolute top-3 right-3 text-[#0066FF]"><CheckCircle className="w-4 h-4" /></div>
                                    <h4 className="font-bold text-sm mb-1">On-Chain Transaction</h4>
                                    <p className="text-xs text-muted-foreground">We verify verify tx hash on Monad blockchain automatically.</p>
                                </div>
                                <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 opacity-50 cursor-not-allowed">
                                    <h4 className="font-bold text-sm mb-1">API Webhook</h4>
                                    <p className="text-xs text-muted-foreground">Verify off-chain events via API.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold mb-6">Review & Launch</h2>

                        <div className="bg-[#0E0E10] rounded-xl p-6 space-y-4 mb-8">
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-muted-foreground">Quest Title</span>
                                <span className="font-bold">{formData.title || 'Untitled Quest'}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-bold">{formData.category}</span>
                            </div>
                            <div className="flex justify-between border-b border-white/5 pb-4">
                                <span className="text-muted-foreground">Reward per User</span>
                                <span className="font-bold text-[#10B981]">{formData.base_reward || '0'} MON</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Requirements</span>
                                <div className="flex gap-2">
                                    {formData.requirements.kyc && <span className="text-xs bg-white/10 px-2 py-1 rounded">KYC</span>}
                                    {formData.requirements.staking && <span className="text-xs bg-white/10 px-2 py-1 rounded">Staker</span>}
                                    {!formData.requirements.kyc && !formData.requirements.staking && <span className="text-xs text-muted-foreground">None</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-[#0066FF]/10 border border-[#0066FF]/20 rounded-xl">
                            <Wallet className="w-6 h-6 text-[#0066FF]" />
                            <div className="flex-1">
                                <p className="font-bold">Estimated Budget Required</p>
                                <p className="text-xs text-muted-foreground">
                                    10 users × {formData.base_reward} MON = {(Number(formData.base_reward || 0) * 10).toFixed(0)} MON + 10% platform fee ({(Number(formData.base_reward || 0) * 10 * 0.1).toFixed(0)} MON)
                                </p>
                            </div>
                            <p className="text-2xl font-bold font-mono">{(Number(formData.base_reward || 0) * 10 * 1.1).toFixed(2)} MON</p>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-white/10 mt-8">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="text-muted-foreground"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    {currentStep < 4 ? (
                        <Button
                            onClick={handleNext}
                            className="px-8 bg-white text-black hover:bg-white/90"
                        >
                            Next Step <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            className="px-8 bg-gradient-to-r from-[#0066FF] to-[#0066FF] hover:opacity-90"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Waiting for Blockchain...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-4 h-4 mr-2" /> Purchase & Launch
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
