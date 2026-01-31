'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/lib/hooks/useProjects';
import { X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProjectCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectCreated?: (projectId: string) => void;
}

export function ProjectCreationModal({ isOpen, onClose, onProjectCreated }: ProjectCreationModalProps) {
    const router = useRouter();
    const { createProject } = useProjects();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website_url: '',
        logo_url: '',
        category: 'DeFi',
        total_budget: 1000,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const project = await createProject({
                name: formData.name,
                description: formData.description || null,
                website_url: formData.website_url || null,
                logo_url: formData.logo_url || null,
                category: formData.category || null,
                total_budget: formData.total_budget,
                is_verified: false,
            });

            // Reset form
            setFormData({
                name: '',
                description: '',
                website_url: '',
                logo_url: '',
                category: 'DeFi',
                total_budget: 1000,
            });

            // Notify parent
            if (onProjectCreated && project) {
                onProjectCreated((project as any).id);
            }

            onClose();
        } catch (err: any) {
            console.error('Error creating project:', err);
            setError(err?.message || 'Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-[#0E0E10] border-[#0066FF]/20">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create New Project</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Set up your project to start creating quests
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Project Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g., MonadSwap"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Brief description of your project..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors resize-none"
                        />
                    </div>

                    {/* Website URL */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Website URL</label>
                        <input
                            type="url"
                            value={formData.website_url}
                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                            placeholder="https://your-project.com"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors"
                        />
                    </div>

                    {/* Logo URL */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Logo URL</label>
                        <input
                            type="url"
                            value={formData.logo_url}
                            onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                            placeholder="https://your-project.com/logo.png"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors"
                        />
                    </div>

                    {/* Category & Budget Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors"
                            >
                                <option value="DeFi">DeFi</option>
                                <option value="NFT">NFT</option>
                                <option value="Gaming">Gaming</option>
                                <option value="Social">Social</option>
                                <option value="Infrastructure">Infrastructure</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Total Budget (MON) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.total_budget}
                                onChange={(e) => setFormData({ ...formData, total_budget: parseFloat(e.target.value) })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !formData.name}
                            className="bg-gradient-to-r from-[#0066FF] to-[#0066FF]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Project'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
