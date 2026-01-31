'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuestActions } from '@/lib/hooks/useQuestActions';
import { toast } from 'sonner';
import { Loader2, Pause, Play, Trash2 } from 'lucide-react';
import { Database } from '@/lib/supabase/types';

type Quest = Database['public']['Tables']['quests']['Row'];

interface EditQuestModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    quest: Quest;
    onSuccess: () => void;
}

export function EditQuestModal({ open, onOpenChange, quest, onSuccess }: EditQuestModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { updateQuest, deleteQuest } = useQuestActions();

    const [formData, setFormData] = useState({
        title: quest.title,
        description: quest.description || '',
        category: quest.category || 'DeFi',
    });

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            await updateQuest(quest.id, {
                title: formData.title,
                description: formData.description,
                category: formData.category,
            });
            toast.success('Quest updated successfully');
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to update quest');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusToggle = async () => {
        try {
            setIsLoading(true);
            const newStatus = quest.status === 'Active' ? 'Paused' : 'Active';

            await updateQuest(quest.id, {
                status: newStatus
            });

            toast.success(`Quest ${newStatus === 'Active' ? 'resumed' : 'paused'}`);
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this quest? This action cannot be undone.')) return;

        try {
            setIsLoading(true);
            await deleteQuest(quest.id);
            toast.success('Quest deleted successfully');
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to delete quest');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-[#0E0E10] border-white/10 text-white sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Quest: {quest.title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0066FF]"
                            placeholder="Quest Title"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0066FF] min-h-[100px]"
                            placeholder="Quest Description"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#0066FF]"
                        >
                            <option value="DeFi">DeFi</option>
                            <option value="Social">Social</option>
                            <option value="NFT">NFT</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 flex gap-3 border-t border-white/10 mt-4">
                        <Button
                            variant="outline"
                            onClick={handleStatusToggle}
                            className={`flex-1 border-white/10 hover:bg-white/5 ${quest.status === 'Active' ? 'text-yellow-500' : 'text-green-500'}`}
                            disabled={isLoading}
                        >
                            {quest.status === 'Active' ? (
                                <>
                                    <Pause className="w-4 h-4 mr-2" /> Pause Quest
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" /> Resume Quest
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            onClick={handleDelete}
                            className="flex-1 border-white/10 hover:bg-red-500/10 text-red-500 hover:text-red-400"
                            disabled={isLoading}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            className="bg-[#0066FF] hover:bg-[#0066FF]/90"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
