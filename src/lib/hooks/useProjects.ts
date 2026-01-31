import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Project = Database['public']['Tables']['projects']['Row'];
type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export function useProjects() {
    const { address } = useAccount();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (address) {
            fetchProjects();
        } else {
            setProjects([]);
            setLoading(false);
        }
    }, [address]);

    async function fetchProjects() {
        if (!address) return;

        try {
            setLoading(true);

            const { data, error: fetchError } = await supabase
                .from('projects')
                .select('*')
                .eq('wallet_address', address.toLowerCase())
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            setProjects(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function createProject(projectData: Omit<ProjectInsert, 'wallet_address'>) {
        if (!address) throw new Error('Wallet not connected');

        try {
            const newProject: ProjectInsert = {
                ...projectData,
                wallet_address: address.toLowerCase(),
            };

            // @ts-ignore - Supabase type system limitation
            const { data, error } = await supabase
                .from('projects')
                .insert(newProject as any)
                .select()
                .single();

            if (error) throw error;

            // Refresh projects list
            await fetchProjects();

            return data;
        } catch (err) {
            console.error('Error creating project:', err);
            throw err;
        }
    }

    async function updateProject(projectId: string, updates: ProjectUpdate) {
        if (!address) throw new Error('Wallet not connected');

        try {
            const { data, error } = await supabase
                .from('projects')
                // @ts-ignore - Supabase type system limitation
                .update(updates as any)
                .eq('id', projectId)
                .eq('wallet_address', address.toLowerCase())
                .select()
                .single();

            if (error) throw error;

            // Refresh projects list
            await fetchProjects();

            return data;
        } catch (err) {
            console.error('Error updating project:', err);
            throw err;
        }
    }

    async function deleteProject(projectId: string) {
        if (!address) throw new Error('Wallet not connected');

        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId)
                .eq('wallet_address', address.toLowerCase());

            if (error) throw error;

            // Refresh projects list
            await fetchProjects();
        } catch (err) {
            console.error('Error deleting project:', err);
            throw err;
        }
    }

    return {
        projects,
        loading,
        error,
        createProject,
        updateProject,
        deleteProject,
        refetch: fetchProjects,
    };
}

// Hook for fetching a single project by ID
export function useProject(projectId?: string) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (projectId) {
            fetchProject();
        } else {
            setProject(null);
            setLoading(false);
        }
    }, [projectId]);

    async function fetchProject() {
        if (!projectId) return;

        try {
            setLoading(true);

            const { data, error: fetchError } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (fetchError) throw fetchError;

            setProject(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching project:', err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    return {
        project,
        loading,
        error,
        refetch: fetchProject,
    };
}
